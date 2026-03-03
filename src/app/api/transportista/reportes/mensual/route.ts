import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isTransportista } from "@/lib/auth-helpers";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * GET /api/transportista/reportes/mensual
 * Genera reporte mensual de actividades del transportista
 */
type SolicitudConRelaciones = Prisma.SolicitudRetiroGetPayload<{
  include: {
    generador: { select: { name: true; rut: true } };
    vehiculo: { select: { patente: true; tipo: true } };
  };
}>;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const mesParam = searchParams.get("mes"); // formato: YYYY-MM
    const anioParam = searchParams.get("anio");

    let fechaInicio: Date;
    let fechaFin: Date;

    if (mesParam) {
      // Si se proporciona mes en formato YYYY-MM
      const [anio, mes] = mesParam.split("-").map(Number);
      fechaInicio = new Date(anio, mes - 1, 1);
      fechaFin = endOfMonth(fechaInicio);
    } else if (anioParam) {
      // Si solo se proporciona año
      const anio = parseInt(anioParam);
      fechaInicio = new Date(anio, 0, 1);
      fechaFin = new Date(anio, 11, 31, 23, 59, 59);
    } else {
      // Mes actual por defecto
      fechaInicio = startOfMonth(new Date());
      fechaFin = endOfMonth(new Date());
    }

    // Obtener todas las solicitudes del período
    const solicitudes = await prisma.solicitudRetiro.findMany({
      where: {
        transportistaId: session.user.id,
        fechaAceptacion: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      include: {
        generador: {
          select: {
            name: true,
            rut: true,
          },
        },
        vehiculo: {
          select: {
            patente: true,
            tipo: true,
          },
        },
      },
      orderBy: {
        fechaAceptacion: "asc",
      },
    });

    // Calcular estadísticas
    const totalSolicitudes = solicitudes.length;
    const solicitudesCompletadas = solicitudes.filter(
      (s: ReturnType<typeof JSON.parse>) => s.estado === "ENTREGADA_GESTOR"
    ).length;
    const solicitudesEnProceso = solicitudes.filter((s: ReturnType<typeof JSON.parse>) =>
      ["ACEPTADA", "EN_CAMINO", "RECOLECTADA"].includes(s.estado)
    ).length;
    const solicitudesRechazadas = solicitudes.filter(
      (s: ReturnType<typeof JSON.parse>) => s.estado === "RECHAZADA"
    ).length;

    const pesoTotalEstimado = solicitudes.reduce(
      (sum, s: ReturnType<typeof JSON.parse>) => sum + s.pesoTotalEstimado,
      0
    );
    const pesoTotalReal = solicitudes
      .filter((s: ReturnType<typeof JSON.parse>) => s.pesoReal !== null)
      .reduce((sum, s: ReturnType<typeof JSON.parse>) => sum + (s.pesoReal || 0), 0);

    const eficiencia =
      totalSolicitudes > 0 ? Math.round((solicitudesCompletadas / totalSolicitudes) * 100) : 0;

    // Agrupar por región
    const porRegion = solicitudes.reduce(
      (acc, s: ReturnType<typeof JSON.parse>) => {
        if (!acc[s.region]) {
          acc[s.region] = {
            cantidad: 0,
            peso: 0,
          };
        }
        acc[s.region].cantidad++;
        acc[s.region].peso += s.pesoTotalEstimado;
        return acc;
      },
      {} as Record<string, { cantidad: number; peso: number }>
    );

    // Agrupar por vehículo
    const porVehiculo = (solicitudes as SolicitudConRelaciones[]).reduce(
      (
        acc: Record<string, { patente: string; tipo: string; cantidad: number; peso: number }>,
        s
      ) => {
        if (s.vehiculo) {
          const key = s.vehiculo.patente as string;
          if (!acc[key]) {
            acc[key] = {
              patente: s.vehiculo.patente,
              tipo: s.vehiculo.tipo,
              cantidad: 0,
              peso: 0,
            };
          }
          acc[key].cantidad++;
          acc[key].peso += s.pesoTotalEstimado;
        }
        return acc;
      },
      {} as Record<string, { patente: string; tipo: string; cantidad: number; peso: number }>
    );

    // Agrupar por estado
    const porEstado = (solicitudes as SolicitudConRelaciones[]).reduce(
      (acc, s) => {
        if (!acc[s.estado]) {
          acc[s.estado] = 0;
        }
        acc[s.estado]++;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      periodo: {
        inicio: fechaInicio.toISOString(),
        fin: fechaFin.toISOString(),
        nombre: format(fechaInicio, "MMMM 'de' yyyy", { locale: es }),
      },
      resumen: {
        totalSolicitudes,
        solicitudesCompletadas,
        solicitudesEnProceso,
        solicitudesRechazadas,
        eficiencia,
        pesoTotalEstimado: Math.round(pesoTotalEstimado),
        pesoTotalReal: Math.round(pesoTotalReal),
        pesoTotalEstimadoToneladas: (pesoTotalEstimado / 1000).toFixed(2),
        pesoTotalRealToneladas: (pesoTotalReal / 1000).toFixed(2),
      },
      distribuciones: {
        porRegion: Object.entries(porRegion).map(([region, data]) => ({
          region,
          ...data,
          pesoToneladas: (data.peso / 1000).toFixed(2),
        })),
        porVehiculo: Object.values(porVehiculo).map((v: ReturnType<typeof JSON.parse>) => ({
          ...v,
          pesoToneladas: (v.peso / 1000).toFixed(2),
        })),
        porEstado: Object.entries(porEstado).map(([estado, cantidad]) => ({
          estado,
          cantidad,
        })),
      },
      solicitudes: solicitudes.map((s: ReturnType<typeof JSON.parse>) => ({
        folio: s.folio,
        fecha: s.fechaAceptacion,
        generador: s.generador.name,
        region: s.region,
        comuna: s.comuna,
        peso: s.pesoTotalEstimado,
        estado: s.estado,
        vehiculo: s.vehiculo?.patente || "Sin asignar",
      })),
    });
  } catch (error: unknown) {
    console.error("[API Reporte Mensual] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
