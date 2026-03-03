/**
 * API Route: /api/users/me/roles
 * Obtiene los roles del usuario autenticado
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * GET /api/users/me/roles
 * Obtiene los roles del usuario autenticado
 *
 * @returns Response con los roles del usuario
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes estar autenticado para acceder a esta información.",
        },
        { status: 401 }
      );
    }

    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        roles: userRoles.map((ur: ReturnType<typeof JSON.parse>) => ur.role),
      },
    });
  } catch (error: unknown) {
    console.error("Error al obtener roles del usuario:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudieron obtener los roles del usuario.",
      },
      { status: 500 }
    );
  }
}
