import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { EstadoSolicitud } from "@prisma/client";

/**
 * GET /api/transportista/mis-solicitudes
 * Obtiene solicitudes aceptadas del transportista
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const estadoParam = searchParams.get("estado"); // ACEPTADA, EN_CAMINO, RECOLECTADA
    const estado = estadoParam as EstadoSolicitud | null;

    const where: {
      transportistaId: string;
      estado?: EstadoSolicitud;
    } = {
      transportistaId: session.user.id,
      ...(estado && { estado }),
    };

    const solicitudes = await prisma.solicitudRetiro.findMany({
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
        vehiculo: true,
      },
      orderBy: { fechaPreferida: "asc" },
    });

    // Calcular capacidad usada
    const solicitudesActivas = solicitudes.filter(
      (s: ReturnType<typeof JSON.parse>) => s.estado === "ACEPTADA" || s.estado === "EN_CAMINO"
    );

    const capacidadUsada = solicitudesActivas.reduce(
      (sum, s: ReturnType<typeof JSON.parse>) => sum + s.pesoTotalEstimado,
      0
    );

    return NextResponse.json({
      solicitudes,
      capacidadUsada,
      totalSolicitudes: solicitudes.length,
    });
  } catch (error: unknown) {
    console.error("Error al obtener mis solicitudes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
