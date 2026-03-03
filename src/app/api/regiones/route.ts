/**
 * API Route: /api/regiones
 * Obtiene listado de regiones de Chile
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/regiones
 * Obtiene todas las regiones de Chile
 *
 * @returns Response con lista de regiones
 */
export async function GET() {
  try {
    const regiones = await prisma.region.findMany({
      orderBy: {
        nombre: "asc",
      },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        _count: {
          select: {
            comunas: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: regiones.map((region: ReturnType<typeof JSON.parse>) => ({
        id: region.id,
        codigo: region.codigo,
        nombre: region.nombre,
        totalComunas: region._count.comunas,
      })),
    });
  } catch (error: unknown) {
    console.error("Error al obtener regiones:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudieron obtener las regiones.",
      },
      { status: 500 }
    );
  }
}
