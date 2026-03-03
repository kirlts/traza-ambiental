import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";

/**
 * GET /api/gestor/lotes-pendientes-tratamiento
 *
 * Obtiene los lotes que están validados (estado RECIBIDA_PLANTA) pero aún no tienen
 * tratamiento asignado. Solo accesible para usuarios con rol 'gestor'.
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

    // Obtener lotes validados (estado RECIBIDA_PLANTA) para asignar tratamiento
    // Por ahora, obtenemos todas las solicitudes recibidas que aún no están tratadas
    const lotesPendientes = await prisma.solicitudRetiro.findMany({
      where: {
        estado: "RECIBIDA_PLANTA",
        gestorId: session.user.id,
        // Nota: El campo tipoTratamiento no existe en el schema actual
        // En el futuro se podría agregar un modelo Tratamiento relacionado
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
        fechaRecepcionPlanta: "desc",
      },
    });

    // Formatear respuesta
    const lotesFormateados = lotesPendientes.map((solicitud: ReturnType<typeof JSON.parse>) => ({
      id: solicitud.id,
      folio: solicitud.folio,
      fechaRecepcionPlanta: solicitud.fechaRecepcionPlanta,
      createdAt: solicitud.createdAt,
      generador: solicitud.generador,
      transportista: solicitud.transportista,
      vehiculo: solicitud.vehiculo,
      pesoReal: solicitud.pesoReal,
      cantidadReal: solicitud.cantidadReal,
      pesoTotalEstimado: solicitud.pesoTotalEstimado,
      cantidadTotal: solicitud.cantidadTotal,
      categoriaA_cantidad: solicitud.categoriaA_cantidad,
      categoriaB_cantidad: solicitud.categoriaB_cantidad,
      direccionRetiro: solicitud.direccionRetiro,
      comuna: solicitud.comuna,
      region: solicitud.region,
    }));

    return NextResponse.json({
      lotes: lotesFormateados,
      total: lotesFormateados.length,
    });
  } catch (error: unknown) {
    console.error("❌ Error obteniendo lotes pendientes de tratamiento:", error);
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
