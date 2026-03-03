import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, validateDocumentFile } from "@/lib/storage";
import { z } from "zod";
import { TipoDocumento } from "@prisma/client";

// Schema de validación para subida de documentos
const uploadDocumentoSchema = z.object({
  tipoDocumento: z.nativeEnum(TipoDocumento),
  numeroFolio: z.string().optional(),
  fechaEmision: z.string().optional(),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es requerida"),
  categoria: z.string().optional(),
  vehiculoPatente: z.string().optional(),
});

/**
 * GET /api/user/documentos
 *
 * Lista todos los documentos de verificación del usuario actual.
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    const documentos = await prisma.documentoVerificacion.findMany({
      where: { usuarioId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        tipoDocumento: true,
        numeroFolio: true,
        fechaEmision: true,
        fechaVencimiento: true,
        estadoValidacion: true,
        archivoNombre: true,
        archivoTamano: true,
        archivoTipo: true,
        validadoPor: {
          select: {
            name: true,
            email: true,
          },
        },
        fechaValidacion: true,
        notasValidacion: true,
        nivelAlerta: true,
        alertaEnviada30d: true,
        alertaEnviada15d: true,
        alertaVencido: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ documentos });
  } catch (error: unknown) {
    console.error("Error obteniendo documentos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/**
 * POST /api/user/documentos
 *
 * Sube un nuevo documento de verificación para el usuario actual.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    // Parsear el form data (multipart/form-data)
    const formData = await request.formData();

    // Extraer datos del formulario
    const tipoDocumento = formData.get("tipoDocumento") as string;
    const numeroFolio = (formData.get("numeroFolio") as string) || undefined;
    const fechaEmision = (formData.get("fechaEmision") as string) || undefined;
    const fechaVencimiento = formData.get("fechaVencimiento") as string;
    const categoria = (formData.get("categoria") as string) || undefined;
    const vehiculoPatente = (formData.get("vehiculoPatente") as string) || undefined;

    // Extraer archivo
    const archivo = formData.get("archivo") as File;
    if (!archivo) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    // Validar datos del formulario
    const validationResult = uploadDocumentoSchema.safeParse({
      tipoDocumento: TipoDocumento[tipoDocumento as keyof typeof TipoDocumento],
      numeroFolio,
      fechaEmision,
      fechaVencimiento,
      categoria,
      vehiculoPatente,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Validar archivo
    validateDocumentFile(archivo);

    // Verificar si el usuario tiene permisos para este tipo de documento
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar permisos por rol
    const isTransportista = user.roles.some(
      (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Transportista"
    );
    const isGestor = user.roles.some(
      (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Gestor"
    );

    const documentosTransportista: TipoDocumento[] = [
      TipoDocumento.AUTORIZACION_SANITARIA_TRANSPORTE,
      TipoDocumento.PERMISO_CIRCULACION,
      TipoDocumento.REVISION_TECNICA,
      TipoDocumento.CERTIFICADO_ANTECEDENTES,
    ];

    const documentosGestor: TipoDocumento[] = [
      TipoDocumento.AUTORIZACION_SANITARIA_PLANTA,
      TipoDocumento.RCA,
      TipoDocumento.REGISTRO_GESTOR_MMA,
      TipoDocumento.CERTIFICADO_INSTALACION_ELECTRICA,
    ];

    const documentosCompartidos: TipoDocumento[] = [
      TipoDocumento.CERTIFICADO_VIGENCIA_PODERES,
      TipoDocumento.PATENTE_MUNICIPAL,
    ];

    const documentoPermitido =
      documentosCompartidos.includes(validationResult.data.tipoDocumento) ||
      (isTransportista && documentosTransportista.includes(validationResult.data.tipoDocumento)) ||
      (isGestor && documentosGestor.includes(validationResult.data.tipoDocumento));

    if (!documentoPermitido) {
      return NextResponse.json(
        { error: "Tipo de documento no permitido para tu rol" },
        { status: 403 }
      );
    }

    // Verificar si ya existe un documento del mismo tipo (no vencido)
    const documentoExistente = await prisma.documentoVerificacion.findFirst({
      where: {
        usuarioId: session.user.id,
        tipoDocumento: validationResult.data.tipoDocumento,
        estadoValidacion: { not: "VENCIDO" },
      },
    });

    if (documentoExistente) {
      return NextResponse.json(
        {
          error:
            "Ya tienes un documento de este tipo que no ha vencido. Debes esperar a que venza o contactar al administrador.",
        },
        { status: 409 }
      );
    }

    // Buscar vehículo si se especificó una patente
    let vehiculoId = null;
    if (validationResult.data.vehiculoPatente && isTransportista) {
      const vehiculo = await prisma.vehiculo.findFirst({
        where: {
          transportistaId: session.user.id,
          patente: validationResult.data.vehiculoPatente,
        },
      });

      if (!vehiculo) {
        return NextResponse.json(
          { error: "Vehículo no encontrado o no te pertenece" },
          { status: 404 }
        );
      }

      vehiculoId = vehiculo.id;
    }

    // Subir archivo
    const archivoUrl = await uploadFile(archivo, `documentos-verificacion/${session.user.id}`);

    // Crear registro en la base de datos
    const documento = await prisma.documentoVerificacion.create({
      data: {
        usuarioId: session.user.id,
        tipoDocumento: validationResult.data.tipoDocumento,
        categoria: validationResult.data.categoria,
        numeroFolio: validationResult.data.numeroFolio,
        fechaEmision: validationResult.data.fechaEmision
          ? new Date(validationResult.data.fechaEmision)
          : null,
        fechaVencimiento: new Date(validationResult.data.fechaVencimiento),
        archivoUrl,
        archivoNombre: archivo.name,
        archivoTamano: archivo.size,
        archivoTipo: archivo.type,
        vehiculoPatente: validationResult.data.vehiculoPatente,
        vehiculoId,
      },
    });

    // Actualizar estado de verificación del usuario si es su primer documento
    const documentosUsuario = await prisma.documentoVerificacion.count({
      where: { usuarioId: session.user.id },
    });

    if (documentosUsuario === 1) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          estadoVerificacion: "DOCUMENTOS_CARGADOS",
        },
      });
    }

    return NextResponse.json({
      documento: {
        id: documento.id,
        tipoDocumento: documento.tipoDocumento,
        fechaVencimiento: documento.fechaVencimiento,
        estadoValidacion: documento.estadoValidacion,
        archivoNombre: documento.archivoNombre,
      },
    });
  } catch (error: unknown) {
    console.error("Error subiendo documento:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
