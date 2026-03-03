import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/gestores/activos
 * Lista gestores activos para selección en entregas
 */
export async function GET(_request: NextRequest) {
  try {
    // Obtener usuarios con rol "Gestor" y estado activo
    const gestores = await prisma.user.findMany({
      where: {
        active: true,
        roles: {
          some: {
            role: {
              name: "Gestor",
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        rut: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(gestores);
  } catch (error: unknown) {
    console.error("Error al obtener gestores activos:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
