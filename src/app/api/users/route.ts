import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-helpers";

// GET: Obtener todos los usuarios
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

    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formatear la respuesta para incluir los roles directamente
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      rut: user.rut,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      active: user.active,
      cuentaAprobada: user.cuentaAprobada,
      tipoEmpresa: user.tipoEmpresa,
      capacidadProcesamiento: user.capacidadProcesamiento,
      tipoPlanta: user.tipoPlanta,
      idRETC: user.idRETC,
      direccionComercial: user.direccionComercial,
      direccionCasaMatriz: user.direccionCasaMatriz,
      tipoProductorREP: user.tipoProductorREP,
      tiposResiduos: user.tiposResiduos,
      estadoVerificacion: user.estadoVerificacion,
      fechaVerificacion: user.fechaVerificacion,
      estadoSuspension: user.estadoSuspension,
      fechaSuspension: user.fechaSuspension,
      motivoSuspension: user.motivoSuspension,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map((ur: ReturnType<typeof JSON.parse>) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
      })),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: unknown) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

// POST: Crear un nuevo usuario
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
    const { name, email, password, roleIds } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con roles
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        active: true,
        roles:
          roleIds && roleIds.length > 0
            ? {
                create: roleIds.map((roleId: string) => ({
                  roleId,
                })),
              }
            : undefined,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Formatear respuesta
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map((ur: ReturnType<typeof JSON.parse>) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
      })),
    };

    return NextResponse.json(formattedUser, { status: 201 });
  } catch (error: unknown) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}
