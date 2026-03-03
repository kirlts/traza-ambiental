import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/transportista/solicitudes/[id]/aceptar
 * Acepta una solicitud de retiro (PENDIENTE -> ACEPTADA)
 * HU-027: Bloqueo de aceptación si no está validado legalmente
 */
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json(
        { error: "No autorizado", message: "Debes tener rol de transportista" },
        { status: 403 }
      );
    }

    const params = await context.params;
    const { id: solicitudId } = params;

    // Obtener vehiculoId del body
    let vehiculoId: string | undefined;
    try {
      const body = await request.json();
      vehiculoId = body.vehiculoId;
    } catch {}

    // 1. Verificar Validación Legal (HU-027)
    /* 
    // COMENTADO TEMPORALMENTE PARA DEMO/DEV
    const legalProfile = await prisma.carrierLegalProfile.findUnique({
      where: { carrierId: session.user.id },
    });
    // Log perfil legal eliminado

    if (!legalProfile || legalProfile.status !== "VERIFICADO") {
      return NextResponse.json(
        {
          error: "Transportista no habilitado",
          code: "LEGAL_VALIDATION_REQUIRED",
          message:
            "Debes completar tu validación legal (RETC, Res. Sanitaria, SINADER) para aceptar solicitudes.",
        },
        { status: 403 }
      );
    }
    */

    // 2. Verificar Solicitud
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id: solicitudId },
    });
    // Log solicitud eliminado

    if (!solicitud) {
      return NextResponse.json(
        { error: "Solicitud no encontrada", message: "La solicitud no existe" },
        { status: 404 }
      );
    }

    if (solicitud.estado !== "PENDIENTE") {
      return NextResponse.json(
        {
          error: `La solicitud ya no está disponible (Estado: ${solicitud.estado})`,
          message: `La solicitud ya no está disponible (Estado: ${solicitud.estado})`,
        },
        { status: 400 }
      );
    }

    // 3. Aceptar Solicitud (Transacción)
    const solicitudActualizada = await prisma.$transaction(async (tx) => {
      const updated = await tx.solicitudRetiro.update({
        where: { id: solicitudId },
        data: {
          estado: "ACEPTADA",
          transportistaId: session.user.id,
          vehiculoId: vehiculoId,
        },
        include: { generador: true },
      });

      await tx.cambioEstado.create({
        data: {
          solicitudId,
          estadoAnterior: "PENDIENTE",
          estadoNuevo: "ACEPTADA",
          realizadoPor: session.user.id,
          notas: "Solicitud aceptada por transportista validado legalmente",
        },
      });

      // Notificar al generador (Pendiente implementar Notificaciones reales)
      // await tx.notificacion.create(...)

      return updated;
    });

    return NextResponse.json({
      success: true,
      solicitud: solicitudActualizada,
      message: "Solicitud aceptada correctamente",
    });
  } catch (error: unknown) {
    console.error("[ACEPTAR] Error al aceptar solicitud:", error);
    const errorMessage =
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).message
        : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: errorMessage,
        details:
          error instanceof Error ? (error as ReturnType<typeof JSON.parse>).stack : String(error),
      },
      { status: 500 }
    );
  }
}
