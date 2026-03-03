import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

/**
 * GET /api/transportista/entregas
 * Lista solicitudes en estado RECOLECTADA disponibles para confirmar entrega
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Obtener solicitudes del transportista en estado RECOLECTADA
    const solicitudes = await prisma.solicitudRetiro.findMany({
      where: {
        transportistaId: session.user.id,
        estado: "RECOLECTADA",
      },
      include: {
        generador: {
          select: {
            id: true,
            name: true,
            email: true,
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
      orderBy: { fechaRecoleccion: "desc" },
      skip,
      take: limit,
    });

    // Contar total para paginación
    const total = await prisma.solicitudRetiro.count({
      where: {
        transportistaId: session.user.id,
        estado: "RECOLECTADA",
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
    });
  } catch (error: unknown) {
    console.error("Error al obtener entregas disponibles:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
