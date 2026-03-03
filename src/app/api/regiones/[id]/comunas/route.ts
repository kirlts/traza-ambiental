/**
 * API Route: /api/regiones/[id]/comunas
 * Obtiene las comunas de una región específica
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/regiones/[id]/comunas
 * Obtiene todas las comunas de una región
 *
 * @param request Request object
 * @param context Context con parámetros de ruta
 * @returns Response con lista de comunas
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { id: regionId } = await context.params;

    // Verificar que la región existe
    const region = await prisma.region.findUnique({
      where: { id: regionId },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
    });

    if (!region) {
      return NextResponse.json(
        {
          error: "Región no encontrada",
          message: `No existe una región con el ID: ${regionId}`,
        },
        { status: 404 }
      );
    }

    // Obtener las comunas de la región
    const comunas = await prisma.comuna.findMany({
      where: {
        regionId,
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
    });

    return NextResponse.json({
      success: true,
      region: {
        id: region.id,
        codigo: region.codigo,
        nombre: region.nombre,
      },
      data: comunas,
      total: comunas.length,
    });
  } catch (error: unknown) {
    console.error("Error al obtener comunas:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudieron obtener las comunas.",
      },
      { status: 500 }
    );
  }
}
