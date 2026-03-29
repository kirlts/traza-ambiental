import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { z } from "zod";
import { MotivoRechazo } from "@prisma/client";
import { sendSolicitudRechazadaEmail } from "@/lib/emails/send";

const rechazarSchema = z.object({
  motivo: z.nativeEnum(MotivoRechazo),
  detalles: z.string().max(500).optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/transportista/solicitudes/[id]/rechazar
 * Rechaza una solicitud con motivo
 */
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const params = await context.params;
    const { id: solicitudId } = params;
    const body = await request.json();
    const validacion = rechazarSchema.safeParse(body);

    if (!validacion.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validacion.error.issues },
        { status: 400 }
      );
    }

    const { motivo, detalles } = validacion.data;

    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id: solicitudId },
      include: { generador: true },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (solicitud.estado !== "PENDIENTE") {
      return NextResponse.json(
        { error: "Solo se pueden rechazar solicitudes pendientes" },
        { status: 409 }
      );
    }

    // Rechazar la solicitud
    const solicitudActualizada = await prisma.$transaction(async (tx) => {
      const updated = await tx.solicitudRetiro.update({
        where: { id: solicitudId },
        data: {
          estado: "RECHAZADA",
          fechaRechazo: new Date(),
          motivoRechazo: motivo,
          detallesRechazo: detalles,
        },
        include: { generador: true },
      });

      // Crear cambio de estado
      await tx.cambioEstado.create({
        data: {
          solicitudId: solicitudId,
          estadoAnterior: "PENDIENTE",
          estadoNuevo: "RECHAZADA",
          realizadoPor: session.user.id,
          notas: `Rechazada. Motivo: ${motivo}${detalles ? `. Detalles: ${detalles}` : ""}`,
        },
      });

      // Crear notificación para el generador
      const motivoTexto = {
        FUERA_DE_ZONA: "Fuera de zona de cobertura",
        CARGA_NO_COMPATIBLE: "Carga no compatible",
        CAPACIDAD_EXCEDIDA: "Capacidad excedida",
        HORARIO_NO_DISPONIBLE: "Horario no disponible",
        OTRO: "Otro motivo",
      };

      if (solicitud.generadorId) {
          await tx.notificacion.create({
            data: {
              userId: solicitud.generadorId,
              tipo: "solicitud_rechazada",
              titulo: "Solicitud Rechazada",
              mensaje: `Tu solicitud ${solicitud.folio} ha sido rechazada. Motivo: ${motivoTexto[motivo]}${detalles ? ` - ${detalles}` : ""}`,
              referencia: solicitudId,
            },
          });
      }

      return updated;
    });

    // Enviar email al generador (no bloqueante)
    if (solicitudActualizada.generador?.email) {
      sendSolicitudRechazadaEmail({
        to: solicitudActualizada.generador.email,
        folio: solicitudActualizada.folio,
        motivo: motivo,
        detalles: detalles || undefined,
        generadorNombre: solicitudActualizada.generador.name || "Generador",
      }).catch((err: unknown) => {
        console.error("Error al enviar email de rechazo:", err);
      });
    }

    return NextResponse.json({
      success: true,
      mensaje: "Solicitud rechazada",
    });
  } catch (error: unknown) {
    console.error("Error al rechazar solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
