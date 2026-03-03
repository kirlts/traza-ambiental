import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";

/**
 * GET /api/gestor/recepciones-pendientes
 *
 * Obtiene las solicitudes entregadas al gestor que están pendientes de validación.
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

    // Obtener solicitudes en estado "ENTREGADA_GESTOR" asignadas a este gestor
    // que aún no han sido recibidas en planta (pendientes de validación)
    const recepcionesPendientes = await prisma.solicitudRetiro.findMany({
      where: {
        estado: "ENTREGADA_GESTOR",
        gestorId: session.user.id,
        // Asegurar que no haya sido recibida en planta aún
        fechaRecepcionPlanta: null,
      },
      include: {
        generador: {
          select: {
            name: true,
            email: true,
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
        fechaEntregaGestor: "desc",
      },
    });

    // Formatear respuesta
    const recepcionesFormateadas = recepcionesPendientes.map(
      (solicitud: ReturnType<typeof JSON.parse>) => ({
        id: solicitud.id,
        folio: solicitud.folio,
        fechaEntrega: solicitud.fechaEntregaGestor,
        generador: solicitud.generador,
        transportista: solicitud.transportista,
        vehiculo: solicitud.vehiculo,
        pesoDeclarado: solicitud.pesoReal,
        cantidadDeclarada: solicitud.cantidadReal,
        categoriaDeclarada: [
          ...(solicitud.categoriaA_cantidad > 0 ? ["A"] : []),
          ...(solicitud.categoriaB_cantidad > 0 ? ["B"] : []),
        ],
        direccionRetiro: solicitud.direccionRetiro,
        comuna: solicitud.comuna,
      })
    );

    return NextResponse.json({
      recepciones: recepcionesFormateadas,
      total: recepcionesFormateadas.length,
    });
  } catch (error: unknown) {
    console.error("❌ Error obteniendo recepciones pendientes:", error);
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
