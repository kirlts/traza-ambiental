import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

/**
 * GET /api/transportista/solicitudes/[id]
 * Obtiene detalles completos de una solicitud específica para el transportista
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const solicitud = await prisma.solicitudRetiro.findFirst({
      where: {
        id,
        transportistaId: session.user.id, // Solo solicitudes asignadas a este transportista
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
            capacidadKg: true,
          },
        },
      },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    return NextResponse.json(solicitud);
  } catch (error: unknown) {
    console.error("Error al obtener solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
