import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { EstadoSolicitud } from "@prisma/client";

/**
 * PATCH /api/transportista/solicitudes/[id]/estado
 * Actualiza el estado de una solicitud (ej: ACEPTADA -> EN_CAMINO)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }
    if (!isTransportista(session)) {
      return NextResponse.json(
        { error: "No autorizado - Requiere rol transportista" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { estado } = body;

    if (!estado || !Object.values(EstadoSolicitud).includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    // Verificar que la solicitud existe y pertenece al transportista
    const solicitudActual = await prisma.solicitudRetiro.findFirst({
      where: {
        id,
        transportistaId: session.user.id,
      },
    });

    if (!solicitudActual) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    // Validar transiciones de estado permitidas
    const transicionesPermitidas: Record<EstadoSolicitud, EstadoSolicitud[]> = {
      PENDIENTE: ["ACEPTADA", "RECHAZADA"],
      ACEPTADA: ["EN_CAMINO", "CANCELADA"],
      EN_CAMINO: ["RECOLECTADA", "CANCELADA"],
      RECOLECTADA: ["ENTREGADA_GESTOR"],
      ENTREGADA_GESTOR: ["RECIBIDA_PLANTA"],
      RECIBIDA_PLANTA: ["TRATADA"],
      TRATADA: [], // Estado final
      RECHAZADA: [], // Estado final
      CANCELADA: [], // Estado final
    };

    if (!transicionesPermitidas[solicitudActual.estado]?.includes(estado)) {
      return NextResponse.json(
        {
          error: `Transición no permitida: ${solicitudActual.estado} -> ${estado}`,
        },
        { status: 400 }
      );
    }

    // Actualizar el estado
    const solicitudActualizada = await prisma.solicitudRetiro.update({
      where: { id },
      data: {
        estado,
        // Si está cambiando a EN_CAMINO, registrar fecha solo si no existe
        ...(estado === "EN_CAMINO" &&
          !solicitudActual.fechaRecoleccion && {
            fechaRecoleccion: new Date(),
          }),
        // Si está cambiando a RECOLECTADA, actualizar fecha de recolección
        ...(estado === "RECOLECTADA" && {
          fechaRecoleccion: new Date(),
        }),
      },
      include: {
        generador: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            patente: true,
            tipo: true,
          },
        },
      },
    });

    // Crear registro en el historial de cambios
    await prisma.cambioEstado.create({
      data: {
        solicitudId: id,
        estadoAnterior: solicitudActual.estado,
        estadoNuevo: estado,
        realizadoPor: session.user.id,
        notas: `Estado actualizado por transportista: ${session.user.name || session.user.email}`,
      },
    });

    return NextResponse.json({
      message: "Estado actualizado exitosamente",
      solicitud: solicitudActualizada,
    });
  } catch (error: unknown) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
