import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { EstadoSolicitud } from "@prisma/client";

/**
 * GET /api/transportista/solicitudes-disponibles
 * Obtiene solicitudes en estado PENDIENTE con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const comuna = searchParams.get("comuna");
    const pesoMin = searchParams.get("pesoMin");
    const pesoMax = searchParams.get("pesoMax");
    const orderBy = searchParams.get("orderBy") || "fecha";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: {
      estado: EstadoSolicitud;
      region?: string;
      comuna?: string;
      pesoTotalEstimado?: {
        gte?: number;
        lte?: number;
      };
    } = {
      estado: EstadoSolicitud.PENDIENTE,
      ...(region && { region }),
      ...(comuna && { comuna }),
      ...((pesoMin || pesoMax) && {
        pesoTotalEstimado: {
          ...(pesoMin && { gte: parseFloat(pesoMin) }),
          ...(pesoMax && { lte: parseFloat(pesoMax) }),
        },
      }),
    };

    const orderByClause =
      orderBy === "peso"
        ? { pesoTotalEstimado: "desc" as const }
        : { fechaPreferida: "asc" as const };

    const [solicitudes, total] = await Promise.all([
      prisma.solicitudRetiro.findMany({
        where,
        include: {
          generador: {
            select: {
              id: true,
              name: true,
              email: true,
              rut: true,
            },
          },
        },
        orderBy: orderByClause,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.solicitudRetiro.count({ where }),
    ]);

    return NextResponse.json({
      solicitudes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: unknown) {
    console.error("Error al obtener solicitudes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
