import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoSolicitud } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Definir estados
    const ESTADOS_COMPLETADOS = [EstadoSolicitud.TRATADA];
    const ESTADOS_EN_PROCESO = [
      EstadoSolicitud.PENDIENTE,
      EstadoSolicitud.ACEPTADA,
      EstadoSolicitud.EN_CAMINO,
      EstadoSolicitud.RECOLECTADA,
      EstadoSolicitud.ENTREGADA_GESTOR,
      EstadoSolicitud.RECIBIDA_PLANTA,
    ];

    // Consultas paralelas
    const [totalSolicitudes, totalSolicitudesEsteMes, enProceso, completadas, completadasEsteMes] =
      await Promise.all([
        // Total Solicitudes
        prisma.solicitudRetiro.count({
          where: { generadorId: userId },
        }),

        // Total Solicitudes creadas este mes
        prisma.solicitudRetiro.count({
          where: {
            generadorId: userId,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),

        // En Proceso
        prisma.solicitudRetiro.count({
          where: {
            generadorId: userId,
            estado: { in: ESTADOS_EN_PROCESO },
          },
        }),

        // Completadas (Total)
        prisma.solicitudRetiro.count({
          where: {
            generadorId: userId,
            estado: { in: ESTADOS_COMPLETADOS },
          },
        }),

        // Completadas (Este Mes - basado en updatedAt como proxy de fecha de término)
        prisma.solicitudRetiro.count({
          where: {
            generadorId: userId,
            estado: { in: ESTADOS_COMPLETADOS },
            updatedAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
      ]);

    return NextResponse.json({
      totalSolicitudes,
      totalSolicitudesEsteMes,
      enProceso,
      completadas,
      completadasEsteMes,
    });
  } catch (error: unknown) {
    console.error("Error fetching generador stats:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
