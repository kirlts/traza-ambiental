/**
 * API Route: /api/solicitudes/[id]/historial
 * Obtiene historial de cambios de estado de una solicitud
 * HU-004: Seguimiento de Solicitudes de Retiro
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/solicitudes/[id]/historial
 * Obtiene el historial completo de cambios de estado de una solicitud
 *
 * @param request Request object
 * @param context Context con parámetros de ruta
 * @returns Response con el historial de cambios de estado
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // 1. Verificar autenticación
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2. Obtener ID de la solicitud
    const { id: solicitudId } = await context.params;

    // 3. Verificar que la solicitud existe y el usuario tiene permisos
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id: solicitudId },
      select: {
        id: true,
        generadorId: true,
        folio: true,
      },
    });

    if (!solicitud) {
      return NextResponse.json(
        {
          error: "Solicitud no encontrada",
          message: `No existe una solicitud con el ID: ${solicitudId}`,
        },
        { status: 404 }
      );
    }

    // 4. Verificar que el usuario tenga permisos para ver esta solicitud
    // El generador solo puede ver sus propias solicitudes
    if (solicitud.generadorId !== session.user.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "No tiene permisos para ver el historial de esta solicitud",
        },
        { status: 403 }
      );
    }

    // 5. Obtener historial de cambios de estado
    const historial = await prisma.cambioEstado.findMany({
      where: {
        solicitudId: solicitudId,
      },
      orderBy: {
        fecha: "desc",
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // 6. Formatear historial
    const historialFormateado = historial.map((cambio) => ({
      id: cambio.id,
      estadoAnterior: cambio.estadoAnterior,
      estadoNuevo: cambio.estadoNuevo,
      fecha: cambio.fecha,
      realizadoPor: {
        id: cambio.usuario.id,
        nombre: cambio.usuario.name || "Usuario desconocido",
        email: cambio.usuario.email || "",
      },
      notas: cambio.notas,
    }));

    return NextResponse.json({
      success: true,
      data: {
        solicitudId: solicitud.id,
        folio: solicitud.folio,
        historial: historialFormateado,
        totalCambios: historialFormateado.length,
      },
    });
  } catch (error: unknown) {
    console.error("Error al obtener historial:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudo obtener el historial de la solicitud.",
      },
      { status: 500 }
    );
  }
}
