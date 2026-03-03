import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { Prisma, EstadoRuta } from "@prisma/client";

/**
 * GET /api/transportista/rutas
 * Obtiene rutas del transportista con filtros
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");

    const where: Prisma.RutaWhereInput = {
      transportistaId: session.user.id,
    };

    if (estado) {
      where.estado = estado as EstadoRuta;
    }

    if (fechaDesde || fechaHasta) {
      where.fechaPlanificada = {};
      if (fechaDesde) {
        where.fechaPlanificada.gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        where.fechaPlanificada.lte = new Date(fechaHasta);
      }
    }

    const rutas = await prisma.ruta.findMany({
      where: where,
      include: {
        vehiculo: {
          select: {
            id: true,
            patente: true,
            tipo: true,
          },
        },
        solicitudes: {
          include: {
            solicitud: {
              select: {
                id: true,
                folio: true,
                direccionRetiro: true,
                region: true,
                comuna: true,
                pesoTotalEstimado: true,
                cantidadTotal: true,
                estado: true,
                generador: {
                  select: {
                    name: true,
                    rut: true,
                  },
                },
              },
            },
          },
          orderBy: { orden: "asc" },
        },
        _count: {
          select: {
            solicitudes: true,
          },
        },
      },
      orderBy: { fechaPlanificada: "desc" },
    });

    // Calcular estadísticas por ruta
    const rutasConEstadisticas = rutas.map((ruta) => {
      const solicitudesCompletadas = ruta.solicitudes.filter((rs) => rs.completada).length;
      const pesoTotal = ruta.solicitudes.reduce(
        (sum, rs) => sum + (rs.solicitud.pesoTotalEstimado || 0),
        0
      );

      return {
        ...ruta,
        totalSolicitudes: ruta._count.solicitudes,
        solicitudesCompletadas,
        porcentajeCompletado:
          ruta._count.solicitudes > 0
            ? Math.round((solicitudesCompletadas / ruta._count.solicitudes) * 100)
            : 0,
        pesoTotal,
      };
    });

    return NextResponse.json({ rutas: rutasConEstadisticas });
  } catch (error: unknown) {
    console.error("[API Rutas] Error al obtener rutas:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido",
        details:
          process.env.NODE_ENV === "development"
            ? (error as ReturnType<typeof JSON.parse>).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transportista/rutas
 * Crea una nueva ruta
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { nombre, fechaPlanificada, vehiculoId, solicitudesIds, notas } = body;

    // Validaciones
    if (!nombre || !fechaPlanificada) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: nombre, fechaPlanificada" },
        { status: 400 }
      );
    }

    if (!solicitudesIds || !Array.isArray(solicitudesIds) || solicitudesIds.length === 0) {
      return NextResponse.json(
        { error: "Debe seleccionar al menos una solicitud para la ruta" },
        { status: 400 }
      );
    }

    // Validar que todas las solicitudes existen y pertenecen al transportista
    const solicitudes = await prisma.solicitudRetiro.findMany({
      where: {
        id: { in: solicitudesIds },
        transportistaId: session.user.id,
        estado: { in: ["ACEPTADA", "EN_CAMINO"] }, // Solo solicitudes aceptadas o en camino
      },
    });

    if (solicitudes.length !== solicitudesIds.length) {
      return NextResponse.json(
        { error: "Algunas solicitudes no son válidas o no pertenecen al transportista" },
        { status: 400 }
      );
    }

    // Si se proporciona vehículo, validar que existe y pertenece al transportista
    if (vehiculoId) {
      const vehiculo = await prisma.vehiculo.findFirst({
        where: {
          id: vehiculoId,
          transportistaId: session.user.id,
        },
      });

      if (!vehiculo) {
        return NextResponse.json(
          { error: "El vehículo no existe o no pertenece al transportista" },
          { status: 400 }
        );
      }
    }

    // Crear la ruta con las solicitudes
    const ruta = await prisma.ruta.create({
      data: {
        transportistaId: session.user.id,
        nombre,
        fechaPlanificada: new Date(fechaPlanificada),
        vehiculoId: vehiculoId || null,
        notas,
        estado: "PLANIFICADA",
        optimizada: false,
        solicitudes: {
          create: solicitudesIds.map((solicitudId: string, index: number) => ({
            solicitudId,
            orden: index + 1,
          })),
        },
      },
      include: {
        solicitudes: {
          include: {
            solicitud: {
              select: {
                folio: true,
                direccionRetiro: true,
                region: true,
                comuna: true,
              },
            },
          },
        },
        vehiculo: true,
      },
    });

    return NextResponse.json(
      {
        ruta,
        message: "Ruta creada exitosamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[API Rutas] Error al crear ruta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
