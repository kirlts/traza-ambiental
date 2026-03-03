import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { EstadoRuta } from "@prisma/client";

/**
 * GET /api/transportista/rutas/[id]
 * Obtiene una ruta específica con todos sus detalles
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: rutaId } = await params;

    const ruta = await prisma.ruta.findFirst({
      where: {
        id: rutaId,
        transportistaId: session.user.id,
      },
      include: {
        vehiculo: {
          select: {
            id: true,
            patente: true,
            tipo: true,
            capacidadKg: true,
          },
        },
        solicitudes: {
          include: {
            solicitud: {
              include: {
                generador: {
                  select: {
                    name: true,
                    rut: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: { orden: "asc" },
        },
      },
    });

    if (!ruta) {
      return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 });
    }

    // Calcular estadísticas
    const solicitudesCompletadas = ruta.solicitudes.filter((rs) => rs.completada).length;
    const pesoTotal = ruta.solicitudes.reduce(
      (sum, rs) => sum + (rs.solicitud.pesoTotalEstimado || 0),
      0
    );

    return NextResponse.json({
      ...ruta,
      totalSolicitudes: ruta.solicitudes.length,
      solicitudesCompletadas,
      porcentajeCompletado:
        ruta.solicitudes.length > 0
          ? Math.round((solicitudesCompletadas / ruta.solicitudes.length) * 100)
          : 0,
      pesoTotal,
    });
  } catch (error: unknown) {
    console.error("[API Ruta] Error al obtener ruta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/**
 * PATCH /api/transportista/rutas/[id]
 * Actualiza una ruta existente
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: rutaId } = await params;
    const body = await request.json();
    const { nombre, fechaPlanificada, vehiculoId, estado, notas } = body;

    // Verificar que la ruta existe y pertenece al transportista
    const rutaExistente = await prisma.ruta.findFirst({
      where: {
        id: rutaId,
        transportistaId: session.user.id,
      },
    });

    if (!rutaExistente) {
      return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 });
    }

    // Construir datos a actualizar
    const dataToUpdate: {
      nombre?: string;
      fechaPlanificada?: Date;
      vehiculoId?: string | null;
      estado?: EstadoRuta;
      notas?: string | null;
    } = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (fechaPlanificada !== undefined) dataToUpdate.fechaPlanificada = new Date(fechaPlanificada);
    if (vehiculoId !== undefined) dataToUpdate.vehiculoId = vehiculoId || null;
    if (estado !== undefined) {
      const estadosValidos = ["PLANIFICADA", "EN_PROGRESO", "COMPLETADA", "CANCELADA"];
      if (!estadosValidos.includes(estado)) {
        return NextResponse.json(
          { error: `Estado inválido. Use: ${estadosValidos.join(", ")}` },
          { status: 400 }
        );
      }
      dataToUpdate.estado = estado as EstadoRuta;
    }
    if (notas !== undefined) dataToUpdate.notas = notas || null;

    // Si no hay nada que actualizar
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    // Actualizar ruta
    const rutaActualizada = await prisma.ruta.update({
      where: { id: rutaId },
      data: dataToUpdate,
      include: {
        vehiculo: true,
        solicitudes: {
          include: {
            solicitud: {
              select: {
                folio: true,
                direccionRetiro: true,
              },
            },
          },
          orderBy: { orden: "asc" },
        },
      },
    });

    return NextResponse.json({
      ruta: rutaActualizada,
      message: "Ruta actualizada exitosamente",
    });
  } catch (error: unknown) {
    console.error("[API Ruta] Error al actualizar ruta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/**
 * DELETE /api/transportista/rutas/[id]
 * Elimina una ruta
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: rutaId } = await params;

    // Verificar que la ruta existe y pertenece al transportista
    const ruta = await prisma.ruta.findFirst({
      where: {
        id: rutaId,
        transportistaId: session.user.id,
      },
      include: {
        solicitudes: true,
      },
    });

    if (!ruta) {
      return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 });
    }

    // Validación: no permitir eliminar rutas en progreso o completadas
    if (ruta.estado === "EN_PROGRESO") {
      return NextResponse.json(
        { error: "No se puede eliminar una ruta en progreso" },
        { status: 409 }
      );
    }

    // Eliminar la ruta (las relaciones en ruta_solicitudes se eliminan en cascada)
    await prisma.ruta.delete({
      where: { id: rutaId },
    });

    return NextResponse.json({
      message: "Ruta eliminada exitosamente",
    });
  } catch (error: unknown) {
    console.error("[API Ruta] Error al eliminar ruta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
