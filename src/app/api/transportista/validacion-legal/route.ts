import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, validateImageFile } from "@/lib/storage";

/**
 * Endpoint para subir y actualizar documentos legales del transportista
 * HU-027: Validación Interna de Requisitos Legales
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const tipo = formData.get("tipo") as string;
    const file = formData.get("file") as File;
    const metadata = formData.get("metadata") as string; // JSON string

    if (!file || !tipo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (archivo o tipo)" },
        { status: 400 }
      );
    }

    // Validar archivo (tamaño, tipo)
    try {
      validateImageFile(file);
    } catch (error: unknown) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : String(error),
        },
        { status: 400 }
      );
    }

    // Subir archivo a Storage (S3 o Local)
    const folder = `transportistas/${session.user.id}/legal`;
    const fileUrl = await uploadFile(file, folder);

    // Parsear metadatos opcionales (ej: numero de resolucion, id retc)
    const parsedMetadata = metadata ? JSON.parse(metadata) : {};

    // Buscar perfil legal existente o crear uno nuevo
    let legalProfile = await prisma.carrierLegalProfile.findUnique({
      where: { carrierId: session.user.id },
    });

    if (!legalProfile) {
      legalProfile = await prisma.carrierLegalProfile.create({
        data: {
          carrierId: session.user.id,
          status: "PENDIENTE",
        },
      });
    }

    // Actualizar campo específico según el tipo de documento
    const updateData: import("@prisma/client").Prisma.CarrierLegalProfileUpdateInput = {
      status: "PENDIENTE", // Al subir nuevo documento, vuelve a revisión si estaba rechazado
      rejectionReason: null, // Limpiar motivo de rechazo previo
    };

    switch (tipo) {
      case "retc":
        updateData.retcFileUrl = fileUrl;
        updateData.isRetcVerified = false; // Requiere nueva validación
        if (parsedMetadata.retcId) {
          updateData.retcId = parsedMetadata.retcId;
        }
        break;
      case "resolucion":
        updateData.resolutionFileUrl = fileUrl;
        updateData.isResolutionVerified = false;
        if (parsedMetadata.resolutionNumber) {
          updateData.sanitaryResolution = parsedMetadata.resolutionNumber;
        }
        if (parsedMetadata.resolutionDate) {
          updateData.resolutionDate = new Date(parsedMetadata.resolutionDate);
        }
        break;
      case "sinader":
        updateData.sinaderFileUrl = fileUrl;
        updateData.isSinaderVerified = false;
        break;
      case "base":
        // Comuna base de operaciones, aunque esto suele venir del perfil general
        if (parsedMetadata.baseOperations) {
          updateData.baseOperations = parsedMetadata.baseOperations;
        }
        break;
      default:
        return NextResponse.json({ error: "Tipo de documento no válido" }, { status: 400 });
    }

    // Ejecutar actualización
    const updatedProfile = await prisma.carrierLegalProfile.update({
      where: { id: legalProfile.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Documento subido correctamente",
      profile: updatedProfile,
    });
  } catch (error: unknown) {
    console.error("Error subiendo documento legal:", error);
    return NextResponse.json({ error: "Error interno al procesar el documento" }, { status: 500 });
  }
}

/**
 * GET: Obtener estado de validación legal del transportista actual
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const legalProfile = await prisma.carrierLegalProfile.findUnique({
      where: { carrierId: session.user.id },
    });

    return NextResponse.json({
      profile: legalProfile || null,
    });
  } catch (error: unknown) {
    console.error("Error obteniendo perfil legal:", error);
    return NextResponse.json({ error: "Error interno al obtener perfil" }, { status: 500 });
  }
}
