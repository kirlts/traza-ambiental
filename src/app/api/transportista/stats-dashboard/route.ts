import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que sea transportista
    if (!isTransportista(session)) {
      return NextResponse.json(
        { error: "No autorizado - Requiere rol Transportista" },
        { status: 403 }
      );
    }

    const transportistaId = session.user.id;

    // Obtener solicitudes activas (ACEPTADA, EN_CAMINO, RECOLECTADO)
    const solicitudesActivas = await prisma.solicitudRetiro.count({
      where: {
        transportistaId,
        estado: {
          in: ["ACEPTADA", "EN_CAMINO", "RECOLECTADA"],
        },
      },
    });

    // Obtener solicitudes en ruta (EN_CAMINO)
    const enRuta = await prisma.solicitudRetiro.count({
      where: {
        transportistaId,
        estado: "EN_CAMINO",
      },
    });

    // Obtener solicitudes completadas este mes (ENTREGADO_GESTOR)
    const inicioMes = startOfMonth(new Date());
    const finMes = endOfMonth(new Date());

    const completadasMes = await prisma.solicitudRetiro.count({
      where: {
        transportistaId,
        estado: "ENTREGADA_GESTOR",
        fechaEntregaGestor: {
          gte: inicioMes,
          lte: finMes,
        },
      },
    });

    // Calcular eficiencia (entregas completadas vs rechazadas este mes)
    const totalSolicitudesMes = await prisma.solicitudRetiro.count({
      where: {
        transportistaId,
        OR: [
          {
            estado: "ENTREGADA_GESTOR",
            fechaEntregaGestor: {
              gte: inicioMes,
              lte: finMes,
            },
          },
          {
            estado: "RECHAZADA",
            fechaRechazo: {
              gte: inicioMes,
              lte: finMes,
            },
          },
        ],
      },
    });

    const eficiencia =
      totalSolicitudesMes > 0 ? Math.round((completadasMes / totalSolicitudesMes) * 100) : 100; // Si no hay datos, mostrar 100%

    // Obtener capacidad de vehículos (opcional - para futura implementación)
    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        transportistaId,
        estado: "activo",
      },
      select: {
        capacidadKg: true,
      },
    });

    const capacidadTotal = vehiculos.reduce(
      (sum, v: ReturnType<typeof JSON.parse>) => sum + v.capacidadKg,
      0
    );

    // Calcular capacidad usada basada en solicitudes activas
    const solicitudesConPeso = await prisma.solicitudRetiro.findMany({
      where: {
        transportistaId,
        estado: {
          in: ["ACEPTADA", "EN_CAMINO", "RECOLECTADA"],
        },
      },
      select: {
        pesoTotalEstimado: true,
      },
    });

    const capacidadUsada = solicitudesConPeso.reduce(
      (sum, s: ReturnType<typeof JSON.parse>) => sum + (s.pesoTotalEstimado || 0),
      0
    );

    return NextResponse.json({
      solicitudesActivas,
      enRuta,
      completadasMes,
      eficiencia,
      vehiculos: {
        capacidadTotal,
        capacidadUsada,
      },
    });
  } catch (error: unknown) {
    console.error("[STATS DASHBOARD] Error:", error);
    return NextResponse.json({ error: "Error obteniendo estadísticas" }, { status: 500 });
  }
}
