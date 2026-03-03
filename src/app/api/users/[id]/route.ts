import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-helpers";

// GET: Obtener un usuario por ID
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

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const formattedUser = {
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
    };

    return NextResponse.json(formattedUser);
  } catch (error: unknown) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 });
  }
}

// PUT: Actualizar un usuario
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
    const {
      name,
      rut,
      email,
      password,
      active,
      cuentaAprobada,
      tipoEmpresa,
      capacidadProcesamiento,
      tipoPlanta,
      image,
      idRETC,
      direccionComercial,
      direccionCasaMatriz,
      tipoProductorREP,
      tiposResiduos,
      roleIds,
    } = body;

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Si se proporciona un nuevo email, verificar que no esté en uso
    if (email && email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email },
      });

      if (emailInUse) {
        return NextResponse.json({ error: "El email ya está en uso" }, { status: 400 });
      }
    }

    // Si se proporciona un nuevo RUT, verificar que no esté en uso
    if (rut && rut !== existingUser.rut) {
      const rutInUse = await prisma.user.findUnique({
        where: { rut },
      });

      if (rutInUse) {
        return NextResponse.json({ error: "El RUT ya está en uso" }, { status: 400 });
      }
    }

    // Preparar datos de actualización
    const updateData: {
      name?: string;
      rut?: string | null;
      email?: string;
      active?: boolean;
      cuentaAprobada?: boolean;
      tipoEmpresa?: string | null;
      capacidadProcesamiento?: number | null;
      tipoPlanta?: string | null;
      image?: string | null;
      idRETC?: string | null;
      direccionComercial?: string | null;
      direccionCasaMatriz?: string | null;
      tipoProductorREP?: string | null;
      tiposResiduos?: string[];
      password?: string;
    } = {
      name,
      rut: rut !== undefined ? rut || null : undefined,
      email,
      active,
      cuentaAprobada: cuentaAprobada !== undefined ? cuentaAprobada : undefined,
      tipoEmpresa: tipoEmpresa !== undefined ? tipoEmpresa || null : undefined,
      capacidadProcesamiento:
        capacidadProcesamiento !== undefined ? capacidadProcesamiento || null : undefined,
      tipoPlanta: tipoPlanta !== undefined ? tipoPlanta || null : undefined,
      image: image !== undefined ? image || null : undefined,
      idRETC: idRETC !== undefined ? idRETC || null : undefined,
      direccionComercial: direccionComercial !== undefined ? direccionComercial || null : undefined,
      direccionCasaMatriz:
        direccionCasaMatriz !== undefined ? direccionCasaMatriz || null : undefined,
      tipoProductorREP: tipoProductorREP !== undefined ? tipoProductorREP || null : undefined,
      tiposResiduos: tiposResiduos !== undefined ? tiposResiduos : undefined,
    };

    // Si se proporciona contraseña, encriptarla
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario
    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Si se proporcionan roles, actualizar la relación
    if (roleIds !== undefined) {
      // Eliminar roles actuales
      await prisma.userRole.deleteMany({
        where: { userId: id },
      });

      // Crear nuevos roles
      if (roleIds.length > 0) {
        await prisma.userRole.createMany({
          data: roleIds.map((roleId: string) => ({
            userId: id,
            roleId,
          })),
        });
      }
    }

    // Obtener usuario actualizado con roles
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const formattedUser = {
      id: updatedUser!.id,
      name: updatedUser!.name,
      rut: updatedUser!.rut,
      email: updatedUser!.email,
      emailVerified: updatedUser!.emailVerified,
      image: updatedUser!.image,
      active: updatedUser!.active,
      cuentaAprobada: updatedUser!.cuentaAprobada,
      tipoEmpresa: updatedUser!.tipoEmpresa,
      capacidadProcesamiento: updatedUser!.capacidadProcesamiento,
      tipoPlanta: updatedUser!.tipoPlanta,
      idRETC: updatedUser!.idRETC,
      direccionComercial: updatedUser!.direccionComercial,
      direccionCasaMatriz: updatedUser!.direccionCasaMatriz,
      tipoProductorREP: updatedUser!.tipoProductorREP,
      tiposResiduos: updatedUser!.tiposResiduos,
      estadoVerificacion: updatedUser!.estadoVerificacion,
      fechaVerificacion: updatedUser!.fechaVerificacion,
      estadoSuspension: updatedUser!.estadoSuspension,
      fechaSuspension: updatedUser!.fechaSuspension,
      motivoSuspension: updatedUser!.motivoSuspension,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
      roles: updatedUser!.roles.map((ur: ReturnType<typeof JSON.parse>) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
      })),
    };

    return NextResponse.json(formattedUser);
  } catch (error: unknown) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}

// DELETE: Eliminar un usuario
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

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Prevenir que el usuario se elimine a sí mismo
    if (session.user.id === id) {
      return NextResponse.json({ error: "No puedes eliminar tu propio usuario" }, { status: 400 });
    }

    // Eliminar usuario (las relaciones se eliminan en cascada)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Usuario eliminado exitosamente" });
  } catch (error: unknown) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
  }
}
