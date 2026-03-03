import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

/**
 * GET /api/transportista/vehiculos/[id]/capacidad
 * Obtiene capacidad disponible de un vehículo específico
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await context.params;

    // Verificar que el vehículo pertenece al transportista
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id },
    });

    if (!vehiculo || vehiculo.transportistaId !== session.user.id) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    // Calcular capacidad usada en el vehículo
    const solicitudesVehiculo = await prisma.solicitudRetiro.findMany({
      where: {
        transportistaId: session.user.id,
        vehiculoId: id,
        estado: {
          in: ["ACEPTADA", "EN_CAMINO"],
        },
      },
      select: { pesoTotalEstimado: true },
    });

    const capacidadUsada = solicitudesVehiculo.reduce(
      (sum, s: ReturnType<typeof JSON.parse>) => sum + s.pesoTotalEstimado,
      0
    );

    const capacidadDisponible = vehiculo.capacidadKg - capacidadUsada;

    return NextResponse.json({
      vehiculo: {
        id: vehiculo.id,
        patente: vehiculo.patente,
        tipo: vehiculo.tipo,
        capacidadKg: vehiculo.capacidadKg,
        estado: vehiculo.estado,
      },
      capacidadTotal: vehiculo.capacidadKg,
      capacidadUsada,
      capacidadDisponible,
      solicitudesActivas: solicitudesVehiculo.length,
    });
  } catch (error: unknown) {
    console.error("Error al obtener capacidad del vehículo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
