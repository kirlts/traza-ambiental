import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";
import { z } from "zod";
import { uploadFile, validateDocumentFile } from "@/lib/storage";
import { registrarConsumoCapacidad } from "@/lib/autorizaciones";
import { TratamientoTipo } from "@prisma/client";

// Schema de validación para asignar tratamiento
const asignarTratamientoSchema = z.object({
  tipoTratamiento: z.enum([
    "RECAUCHAJE",
    "RECICLAJE_MATERIAL",
    "CO_PROCESAMIENTO",
    "VALORIZACION_ENERGETICA",
    "OTRO",
  ]),
  fechaInicioTratamiento: z.string().min(1, "Fecha de inicio es requerida"),
  fechaFinTratamiento: z.string().optional(),
  descripcionTratamiento: z.string().optional(),
  ubicacionTratamiento: z.string().optional(),
  otroTratamiento: z.string().optional(), // Solo requerido si tipoTratamiento es 'OTRO'
});

/**
 * POST /api/solicitudes/[id]/asignar-tratamiento
 *
 * Asigna un tratamiento específico a un lote validado y sube documentos de evidencia.
 * Solo accesible para usuarios con rol 'gestor'.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    if (!isGestor(session)) {
      return NextResponse.json({ error: "No autorizado - Requiere rol gestor" }, { status: 403 });
    }

    const { id: solicitudId } = await params;
    // Auditoría de logs eliminada

    // Verificar que la solicitud existe
    const solicitud = await prisma.solicitudRetiro.findFirst({
      where: {
        id: solicitudId,
        estado: "RECIBIDA_PLANTA",
        gestorId: session.user.id,
      },
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: "Solicitud no encontrada o no disponible" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const tipoTratamiento = formData.get("tipoTratamiento") as string;
    const fechaInicioStr = formData.get("fechaInicioTratamiento") as string;
    const fechaFinStr = formData.get("fechaFinTratamiento") as string | null;
    const descripcionTratamiento = formData.get("descripcionTratamiento") as string | null;
    const ubicacionTratamiento = formData.get("ubicacionTratamiento") as string | null;
    const otroTratamiento = formData.get("otroTratamiento") as string | null;

    const fechaInicioTratamiento = fechaInicioStr
      ? fechaInicioStr.includes("T")
        ? fechaInicioStr
        : `${fechaInicioStr}T00:00:00.000Z`
      : null;

    const fechaFinTratamiento = fechaFinStr
      ? fechaFinStr.includes("T")
        ? fechaFinStr
        : `${fechaFinStr}T00:00:00.000Z`
      : null;

    if (!tipoTratamiento || !fechaInicioTratamiento) {
      return NextResponse.json(
        { error: "Datos de tratamiento y fecha requeridos" },
        { status: 400 }
      );
    }

    const validacion = asignarTratamientoSchema.safeParse({
      tipoTratamiento: tipoTratamiento as TratamientoTipo,
      fechaInicioTratamiento,
      ...(fechaFinTratamiento && { fechaFinTratamiento }),
      descripcionTratamiento: descripcionTratamiento?.trim() || undefined,
      ubicacionTratamiento: ubicacionTratamiento?.trim() || undefined,
      otroTratamiento: otroTratamiento?.trim() || undefined,
    });

    if (!validacion.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validacion.error.issues },
        { status: 400 }
      );
    }

    // Procesar archivos de evidencia
    const documentosTratamiento: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("documento") && value instanceof File) {
        try {
          validateDocumentFile(value);
          const fileUrl = await uploadFile(value, `tratamientos/${solicitudId}`);
          documentosTratamiento.push(fileUrl);
        } catch (error: unknown) {
          console.error(`❌ Error procesando archivo ${key}:`, error);
          const msg =
            error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : "Error desconocido";
          return NextResponse.json(
            { error: `Error al procesar archivo ${value.name}: ${msg}` },
            { status: 400 }
          );
        }
      }
    }

    if (documentosTratamiento.length === 0) {
      return NextResponse.json({ error: "Debe subir al menos un documento" }, { status: 400 });
    }

    const notasTratamiento = `Tratamiento: ${tipoTratamiento} | Inicio: ${fechaInicioTratamiento} | Documentos: ${documentosTratamiento.length}`;

    const solicitudActualizada = await prisma.solicitudRetiro.update({
      where: { id: solicitudId },
      data: { estado: "TRATADA" },
      include: { generador: { select: { name: true } } },
    });

    await prisma.cambioEstado.create({
      data: {
        solicitudId,
        estadoAnterior: "RECIBIDA_PLANTA",
        estadoNuevo: "TRATADA",
        realizadoPor: session.user.id,
        notas: notasTratamiento,
      },
    });

    if (tipoTratamiento !== "OTRO") {
      const pesoFinal = solicitud.pesoReal || solicitud.pesoTotalEstimado || 0;
      await registrarConsumoCapacidad(
        session.user.id,
        tipoTratamiento as TratamientoTipo,
        pesoFinal
      ).catch((e: unknown) => console.error("Error actualizando capacidad:", e));
    }

    return NextResponse.json({
      success: true,
      message: "Tratamiento asignado exitosamente",
      solicitud: { id: solicitudActualizada.id, estado: solicitudActualizada.estado },
    });
  } catch (error: unknown) {
    console.error("❌ Error asignando tratamiento:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
