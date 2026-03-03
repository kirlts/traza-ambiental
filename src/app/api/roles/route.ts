import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-helpers";

// GET: Obtener todos los roles
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que sea administrador
    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador." },
        { status: 403 }
      );
    }

    const roles = await prisma.role.findMany({
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formatear la respuesta
    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      active: role.active,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      userCount: role.users.length,
      users: role.users.map((ur: ReturnType<typeof JSON.parse>) => ({
        id: ur.user.id,
        name: ur.user.name,
        email: ur.user.email,
      })),
    }));

    return NextResponse.json(formattedRoles);
  } catch (error: unknown) {
    console.error("Error al obtener roles:", error);
    return NextResponse.json({ error: "Error al obtener roles" }, { status: 500 });
  }
}

// POST: Crear un nuevo rol
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que sea administrador
    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "El nombre del rol es requerido" }, { status: 400 });
    }

    // Verificar si el rol ya existe
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json({ error: "Ya existe un rol con ese nombre" }, { status: 400 });
    }

    // Crear rol
    const role = await prisma.role.create({
      data: {
        name,
        description,
        active: true,
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error: unknown) {
    console.error("Error al crear rol:", error);
    return NextResponse.json({ error: "Error al crear rol" }, { status: 500 });
  }
}
