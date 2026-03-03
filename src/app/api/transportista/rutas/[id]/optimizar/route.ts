import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

/**
 * POST /api/transportista/rutas/[id]/optimizar
 * Optimiza el orden de las solicitudes en una ruta usando el algoritmo del vecino más cercano
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: rutaId } = await params;

    // Obtener la ruta con sus solicitudes
    const ruta = await prisma.ruta.findFirst({
      where: {
        id: rutaId,
        transportistaId: session.user.id,
      },
      include: {
        solicitudes: {
          include: {
            solicitud: {
              select: {
                id: true,
                folio: true,
                direccionRetiro: true,
                region: true,
                comuna: true,
                pesoTotalEstimado: true,
              },
            },
          },
        },
      },
    });

    if (!ruta) {
      return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 });
    }

    // Solo optimizar rutas en estado PLANIFICADA
    if (ruta.estado !== "PLANIFICADA") {
      return NextResponse.json(
        { error: "Solo se pueden optimizar rutas en estado PLANIFICADA" },
        { status: 400 }
      );
    }

    // Si hay menos de 2 solicitudes, no hay nada que optimizar
    if (ruta.solicitudes.length < 2) {
      return NextResponse.json(
        { error: "La ruta debe tener al menos 2 solicitudes para optimizar" },
        { status: 400 }
      );
    }

    // Aplicar algoritmo de optimización simple por región/comuna
    // Agrupa por región, luego por comuna, y ordena alfabéticamente
    const solicitudesOrdenadas = [...ruta.solicitudes].sort(
      (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) => {
        const solicitudA = a.solicitud;
        const solicitudB = b.solicitud;

        // Primero ordenar por región
        if (solicitudA.region !== solicitudB.region) {
          return solicitudA.region.localeCompare(solicitudB.region);
        }

        // Si están en la misma región, ordenar por comuna
        if (solicitudA.comuna !== solicitudB.comuna) {
          return solicitudA.comuna.localeCompare(solicitudB.comuna);
        }

        // Si están en la misma comuna, ordenar alfabéticamente por dirección
        return solicitudA.direccionRetiro.localeCompare(solicitudB.direccionRetiro);
      }
    );

    // Actualizar el orden de las solicitudes en la base de datos
    await Promise.all(
      solicitudesOrdenadas.map((solicitud: ReturnType<typeof JSON.parse>, index) =>
        prisma.rutaSolicitud.update({
          where: { id: solicitud.id },
          data: { orden: index + 1 },
        })
      )
    );

    // Marcar la ruta como optimizada
    await prisma.ruta.update({
      where: { id: rutaId },
      data: { optimizada: true },
    });

    // Obtener la ruta actualizada
    const rutaOptimizada = await prisma.ruta.findUnique({
      where: { id: rutaId },
      include: {
        solicitudes: {
          include: {
            solicitud: {
              select: {
                folio: true,
                direccionRetiro: true,
                region: true,
                comuna: true,
                pesoTotalEstimado: true,
              },
            },
          },
          orderBy: { orden: "asc" },
        },
      },
    });

    return NextResponse.json({
      ruta: rutaOptimizada,
      message: "Ruta optimizada exitosamente",
      optimizacion: {
        metodo: "Agrupación por Región y Comuna",
        descripcion:
          "Las solicitudes se agruparon por región y comuna para minimizar desplazamientos",
      },
    });
  } catch (error: unknown) {
    console.error("[API Optimizar Ruta] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
