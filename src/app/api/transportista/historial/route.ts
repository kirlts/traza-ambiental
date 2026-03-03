import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { EstadoSolicitud } from "@prisma/client";

/**
 * GET /api/transportista/historial
 * Obtiene el historial completo de solicitudes del transportista con filtros avanzados
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // Parámetros de filtrado
    const folio = searchParams.get("folio");
    const estado = searchParams.get("estado") as EstadoSolicitud | null;
    const region = searchParams.get("region");
    const comuna = searchParams.get("comuna");
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");
    const pesoMin = searchParams.get("pesoMin");
    const pesoMax = searchParams.get("pesoMax");
    const vehiculoId = searchParams.get("vehiculoId");

    // Parámetros de paginación
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Parámetros de ordenamiento
    const orderBy = searchParams.get("orderBy") || "fechaAceptacion";
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";

    // Construir el where dinámico
    const where: import("@prisma/client").Prisma.SolicitudRetiroWhereInput = {
      transportistaId: session.user.id,
    };

    // Filtro por folio (búsqueda parcial)
    if (folio) {
      where.folio = {
        contains: folio,
        mode: "insensitive",
      };
    }

    // Filtro por estado
    if (estado) {
      where.estado = estado;
    }

    // Filtro por región
    if (region) {
      where.region = region;
    }

    // Filtro por comuna
    if (comuna) {
      where.comuna = comuna;
    }

    // Filtro por rango de fechas (fecha de aceptación)
    if (fechaDesde || fechaHasta) {
      where.fechaAceptacion = {};
      if (fechaDesde) {
        where.fechaAceptacion.gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        where.fechaAceptacion.lte = new Date(fechaHasta);
      }
    }

    // Filtro por rango de peso
    if (pesoMin || pesoMax) {
      where.pesoTotalEstimado = {};
      if (pesoMin) {
        where.pesoTotalEstimado.gte = parseFloat(pesoMin);
      }
      if (pesoMax) {
        where.pesoTotalEstimado.lte = parseFloat(pesoMax);
      }
    }

    // Filtro por vehículo
    if (vehiculoId) {
      where.vehiculoId = vehiculoId;
    }

    // Determinar el campo de ordenamiento
    let orderByClause: import("@prisma/client").Prisma.SolicitudRetiroOrderByWithRelationInput = {};
    switch (orderBy) {
      case "folio":
        orderByClause = { folio: order };
        break;
      case "fecha":
      case "fechaPreferida":
        orderByClause = { fechaPreferida: order };
        break;
      case "fechaAceptacion":
        orderByClause = { fechaAceptacion: order };
        break;
      case "peso":
        orderByClause = { pesoTotalEstimado: order };
        break;
      case "estado":
        orderByClause = { estado: order };
        break;
      default:
        orderByClause = { fechaAceptacion: "desc" };
    }

    // Ejecutar queries en paralelo
    const [solicitudes, total] = await Promise.all([
      prisma.solicitudRetiro.findMany({
        where,
        include: {
          generador: {
            select: {
              id: true,
              name: true,
              rut: true,
              email: true,
            },
          },
          gestor: {
            select: {
              id: true,
              name: true,
              rut: true,
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
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      prisma.solicitudRetiro.count({ where }),
    ]);

    // Calcular estadísticas del historial
    const estadisticas = await prisma.solicitudRetiro.groupBy({
      by: ["estado"],
      where: {
        transportistaId: session.user.id,
      },
      _count: true,
      _sum: {
        pesoTotalEstimado: true,
        pesoReal: true,
      },
    });

    return NextResponse.json({
      solicitudes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      estadisticas: estadisticas.map((est: ReturnType<typeof JSON.parse>) => ({
        estado: est.estado,
        count: est._count,
        pesoEstimadoTotal: est._sum.pesoTotalEstimado || 0,
        pesoRealTotal: est._sum.pesoReal || 0,
      })),
    });
  } catch (error: unknown) {
    console.error("[API Historial] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
