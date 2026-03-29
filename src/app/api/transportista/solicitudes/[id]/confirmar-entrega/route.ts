import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { z } from "zod";

const confirmarEntregaSchema = z.object({
  fechaEntrega: z.string().datetime("Fecha de entrega inválida"),
  gestorId: z.string().min(1, "Gestor es requerido"),
  nombreReceptor: z.string().min(1, "Nombre del receptor es requerido").max(100),
  rutReceptor: z.string().min(1, "RUT del receptor es requerido"),
  observacionesEntrega: z.string().nullable().optional(),
  ubicacionEntregaGPS: z.string().nullable().optional(),
  guiaDespacho: z.string().nullable().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/transportista/solicitudes/[id]/confirmar-entrega
 * Confirma la entrega de una solicitud al gestor
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
    const validacion = confirmarEntregaSchema.safeParse(body);

    if (!validacion.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validacion.error.issues },
        { status: 400 }
      );
    }

    const {
      fechaEntrega,
      gestorId,
      nombreReceptor,
      rutReceptor,
      observacionesEntrega,
      ubicacionEntregaGPS,
    } = validacion.data;

    // Verificar que la solicitud existe y pertenece al transportista
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id: solicitudId },
      include: { generador: true },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (solicitud.transportistaId !== session.user.id) {
      return NextResponse.json({ error: "No tienes acceso a esta solicitud" }, { status: 403 });
    }

    // Verificar estado de la solicitud
    if (solicitud.estado !== "RECOLECTADA") {
      return NextResponse.json(
        {
          error: "Estado inválido",
          message: `La solicitud debe estar en estado RECOLECTADA. Estado actual: ${solicitud.estado}`,
        },
        { status: 400 }
      );
    }

    // Verificar que el gestor existe y está activo
    const gestor = await prisma.user.findFirst({
      where: {
        id: gestorId,
        active: true,
        roles: {
          some: {
            role: {
              name: "Gestor",
            },
          },
        },
      },
    });

    if (!gestor) {
      return NextResponse.json(
        { error: "Gestor no válido", message: "El gestor seleccionado no existe o no está activo" },
        { status: 400 }
      );
    }

    // Validar formato RUT del receptor
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
    if (!rutRegex.test(rutReceptor)) {
      return NextResponse.json(
        {
          error: "RUT inválido",
          message: "El RUT del receptor debe tener formato chileno válido (XX.XXX.XXX-X)",
        },
        { status: 400 }
      );
    }

    // Validar fecha de entrega
    const fechaEntregaDate = new Date(fechaEntrega);
    const ahora = new Date();
    const fechaRecoleccion = solicitud.fechaRecoleccion;

    if (fechaEntregaDate > ahora) {
      return NextResponse.json(
        { error: "Fecha futura", message: "La fecha de entrega no puede ser futura" },
        { status: 400 }
      );
    }

    if (fechaRecoleccion && fechaEntregaDate < fechaRecoleccion) {
      return NextResponse.json(
        {
          error: "Fecha anterior",
          message: "La fecha de entrega no puede ser anterior a la fecha de recolección",
        },
        { status: 400 }
      );
    }

    // Confirmar entrega
    const solicitudActualizada = await prisma.$transaction(async (tx) => {
      // Actualizar solicitud
      const updated = await tx.solicitudRetiro.update({
        where: { id: solicitudId },
        data: {
          estado: "ENTREGADA_GESTOR",
          fechaEntregaGestor: fechaEntregaDate,
          gestorId: gestorId,
          // Campos guardados en notas de CambioEstado temporalmente
          // nombreReceptor,
          // rutReceptor,
          // observacionesEntrega,
          // ubicacionEntregaGPS
        },
        include: {
          generador: true,
          transportista: true,
          vehiculo: true,
        },
      });

      // Preparar notas con toda la información
      const notasDetalladas = [
        `Entrega confirmada al gestor ${gestor.name} (${gestor.email})`,
        `Receptor: ${nombreReceptor}`,
        `RUT Receptor: ${rutReceptor}`,
        observacionesEntrega ? `Observaciones: ${observacionesEntrega}` : null,
        ubicacionEntregaGPS ? `Ubicación: ${ubicacionEntregaGPS}` : null,
      ]
        .filter(Boolean)
        .join(". ");

      // Crear cambio de estado
      await tx.cambioEstado.create({
        data: {
          solicitudId: solicitudId,
          estadoAnterior: solicitud.estado,
          estadoNuevo: "ENTREGADA_GESTOR",
          realizadoPor: session.user.id,
          notas: notasDetalladas,
        },
      });

      // Crear notificación básica (sin envío real ya que EPIC-4 no está implementado)
      if (solicitud.generadorId) {
          await tx.notificacion.create({
            data: {
              userId: solicitud.generadorId,
              tipo: "entrega_confirmada",
              titulo: "Entrega Confirmada",
              mensaje: `La entrega de tu solicitud ${solicitud.folio} ha sido confirmada al gestor ${gestor.name}`,
              referencia: solicitud.id
            }
          });
      }

      // Nota: No se crea notificación al gestor porque EPIC-4 no está implementado
      // En el futuro, cuando EPIC-4 esté implementado, se agregará:
      // await tx.notificacion.create({
      //   data: {
      //     userId: gestorId,
      //     tipo: 'nueva_entrega',
      //     titulo: 'Nueva Entrega Recibida',
      //     mensaje: `Has recibido una nueva entrega de ${session.user.name}: Solicitud ${solicitud.folio}`,
      //     referencia: solicitudId
      //   }
      // })

      return updated;
    });

    return NextResponse.json({
      success: true,
      solicitud: solicitudActualizada,
      mensaje: "Entrega confirmada exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error al confirmar entrega:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
