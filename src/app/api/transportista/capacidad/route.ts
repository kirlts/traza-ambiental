import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

/**
 * GET /api/transportista/capacidad
 * Obtiene capacidad total y disponible del transportista
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtener vehículos activos
    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        transportistaId: session.user.id,
        estado: "activo",
      },
    });

    const capacidadTotal = vehiculos.reduce(
      (sum, v: ReturnType<typeof JSON.parse>) => sum + v.capacidadKg,
      0
    );

    // Calcular capacidad usada (solicitudes activas)
    const solicitudesActivas = await prisma.solicitudRetiro.findMany({
      where: {
        transportistaId: session.user.id,
        estado: {
          in: ["ACEPTADA", "EN_CAMINO"],
        },
      },
      select: { pesoTotalEstimado: true },
    });

    const capacidadUsada = solicitudesActivas.reduce(
      (sum, s: ReturnType<typeof JSON.parse>) => sum + s.pesoTotalEstimado,
      0
    );

    return NextResponse.json({
      capacidadTotal,
      capacidadUsada,
      capacidadDisponible: capacidadTotal - capacidadUsada,
      vehiculos: vehiculos.length,
    });
  } catch (error: unknown) {
    console.error("Error al obtener capacidad:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
