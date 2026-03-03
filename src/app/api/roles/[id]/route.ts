import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-helpers";

// GET: Obtener un rol por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    const role = await prisma.role.findUnique({
      where: { id },
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
    });

    if (!role) {
      return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 });
    }

    const formattedRole = {
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
    };

    return NextResponse.json(formattedRole);
  } catch (error: unknown) {
    console.error("Error al obtener rol:", error);
    return NextResponse.json({ error: "Error al obtener rol" }, { status: 500 });
  }
}

// PUT: Actualizar un rol
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const body = await request.json();
    const { name, description, active } = body;

    // Verificar si el rol existe
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 });
    }

    // Si se proporciona un nuevo nombre, verificar que no esté en uso
    if (name && name !== existingRole.name) {
      const nameInUse = await prisma.role.findUnique({
        where: { name },
      });

      if (nameInUse) {
        return NextResponse.json({ error: "El nombre del rol ya está en uso" }, { status: 400 });
      }
    }

    // Actualizar rol
    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        active,
      },
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
    });

    const formattedRole = {
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
    };

    return NextResponse.json(formattedRole);
  } catch (error: unknown) {
    console.error("Error al actualizar rol:", error);
    return NextResponse.json({ error: "Error al actualizar rol" }, { status: 500 });
  }
}

// DELETE: Eliminar un rol
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verificar si el rol existe
    const existingRole = await prisma.role.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!existingRole) {
      return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 });
    }

    // Verificar si hay usuarios asignados al rol
    if (existingRole.users.length > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar el rol porque tiene ${existingRole.users.length} usuario(s) asignado(s)`,
        },
        { status: 400 }
      );
    }

    // Eliminar rol
    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Rol eliminado exitosamente" });
  } catch (error: unknown) {
    console.error("Error al eliminar rol:", error);
    return NextResponse.json({ error: "Error al eliminar rol" }, { status: 500 });
  }
}
