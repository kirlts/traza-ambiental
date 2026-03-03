import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";

/**
 * GET /api/gestor/recepciones-completadas
 *
 * Obtiene las recepciones que ya han sido validadas y completadas por el gestor.
 * Solo accesible para usuarios con rol 'gestor'.
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    if (!isGestor(session)) {
      return NextResponse.json({ error: "No autorizado - Requiere rol gestor" }, { status: 403 });
    }

    // Obtener recepciones completadas (estado: RECIBIDA_PLANTA)
    const recepcionesCompletadas = await prisma.solicitudRetiro.findMany({
      where: {
        estado: "RECIBIDA_PLANTA",
        gestorId: session.user.id,
        fechaRecepcionPlanta: { not: null }, // Asegurar que han sido recibidas en planta
      },
      include: {
        generador: {
          select: {
            name: true,
            email: true,
            rut: true,
          },
        },
        transportista: {
          select: {
            name: true,
            email: true,
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
        fechaRecepcionPlanta: "desc",
      },
    });

    // Obtener certificados asociados
    const certificadosMap = new Map();

    if (recepcionesCompletadas.length > 0) {
      try {
        const solicitudIds = recepcionesCompletadas.map((s: ReturnType<typeof JSON.parse>) => s.id);
        const certificados = await prisma.certificado.findMany({
          where: {
            solicitudId: { in: solicitudIds },
          },
          select: {
            solicitudId: true,
            folio: true,
            pdfUrl: true,
            fechaEmision: true,
            estado: true,
          },
        });

        certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
          certificadosMap.set(cert.solicitudId, cert);
        });
      } catch (error: unknown) {
        console.warn(
          "⚠️ Error obteniendo certificados:",
          error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
        );
      }
    }

    // Formatear respuesta con estructura esperada por el frontend
    const recepcionesFormateadas = recepcionesCompletadas.map(
      (solicitud: ReturnType<typeof JSON.parse>) => {
        const certificado = certificadosMap.get(solicitud.id);

        // Determinar categorías validadas
        const categoriaValidada: string[] = [];
        if (solicitud.categoriaA_cantidad > 0) categoriaValidada.push("A");
        if (solicitud.categoriaB_cantidad > 0) categoriaValidada.push("B");

        return {
          id: solicitud.id,
          fechaValidacion: solicitud.fechaRecepcionPlanta,
          updatedAt: solicitud.updatedAt,
          observaciones: null, // Se puede extraer de cambiosEstado si es necesario
          pesoValidado: solicitud.pesoReal,
          cantidadValidada: solicitud.cantidadReal,
          categoriaValidada,
          certificadoGenerado: !!certificado,
          certificadoUrl: certificado?.pdfUrl || null,
          solicitud: {
            id: solicitud.id,
            folio: solicitud.folio,
            generador: solicitud.generador,
            transportista: solicitud.transportista,
            vehiculo: solicitud.vehiculo,
            direccionRetiro: solicitud.direccionRetiro,
            comuna: solicitud.comuna,
            region: solicitud.region,
            pesoReal: solicitud.pesoReal,
            cantidadReal: solicitud.cantidadReal,
            pesoTotalEstimado: solicitud.pesoTotalEstimado,
            cantidadTotal: solicitud.cantidadTotal,
            categoriaA_cantidad: solicitud.categoriaA_cantidad,
            categoriaB_cantidad: solicitud.categoriaB_cantidad,
            fechaRecepcionPlanta: solicitud.fechaRecepcionPlanta,
          },
        };
      }
    );

    return NextResponse.json({
      recepciones: recepcionesFormateadas,
      total: recepcionesFormateadas.length,
    });
  } catch (error: unknown) {
    console.error("❌ Error obteniendo recepciones completadas:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido",
        details:
          process.env.NODE_ENV === "development"
            ? (error as ReturnType<typeof JSON.parse>).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
