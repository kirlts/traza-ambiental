import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { enviarEmailAprobacion } from "@/lib/helpers/email";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que sea Administrador o Especialista
    const roles = session.user.roles || [];
    const esAdminOEspecialista =
      roles.includes("Administrador") || roles.includes("Especialista Sistema Gestión");

    if (!esAdminOEspecialista) {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Obtener solicitud
    const solicitud = await prisma.solicitudRegistroGenerador.findUnique({
      where: { id },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (solicitud.estado !== "pendiente") {
      return NextResponse.json(
        { error: `Esta solicitud ya fue ${solicitud.estado}` },
        { status: 400 }
      );
    }

    // Buscar el rol de Generador
    const rolGenerador = await prisma.role.findUnique({
      where: { name: "Generador" },
    });

    if (!rolGenerador) {
      return NextResponse.json(
        { error: "Rol de Generador no encontrado en el sistema" },
        { status: 500 }
      );
    }

    // Crear usuario y asignar rol en una transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const usuario = await tx.user.create({
        data: {
          name: `${solicitud.nombresRepresentante} ${solicitud.apellidosRepresentante}`,
          email: solicitud.email,
          password: solicitud.password, // Ya está hasheado
          active: true,
        },
      });

      // Asignar rol de Generador
      await tx.userRole.create({
        data: {
          userId: usuario.id,
          roleId: rolGenerador.id,
        },
      });

      // Actualizar solicitud
      const solicitudActualizada = await tx.solicitudRegistroGenerador.update({
        where: { id },
        data: {
          estado: "aprobada",
          fechaRevision: new Date(),
          revisadoPor: session.user.id,
          usuarioId: usuario.id,
        },
      });

      return { usuario, solicitudActualizada };
    });

    // Enviar email de aprobación (no bloquear si falla)
    enviarEmailAprobacion(
      solicitud.email,
      `${solicitud.nombresRepresentante} ${solicitud.apellidosRepresentante}`,
      solicitud.razonSocial
    ).catch((error: unknown) => {
      console.error("Error enviando email de aprobación:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Solicitud aprobada exitosamente",
        usuario: {
          id: resultado.usuario.id,
          name: resultado.usuario.name,
          email: resultado.usuario.email,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error aprobando solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
