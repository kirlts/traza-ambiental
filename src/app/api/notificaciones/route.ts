import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener notificaciones del usuario desde PostgreSQL
    const notificaciones = await prisma.notificacion.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limitar a las últimas 50 notificaciones
    });

    // Contar no leídas
    const noLeidas = notificaciones.filter((n) => !n.leida).length;

    const result = {
      notificaciones,
      noLeidas,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("❌ Error al obtener notificaciones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { notificacionId } = await request.json();

    if (!notificacionId) {
      return NextResponse.json({ error: "ID de notificación requerido" }, { status: 400 });
    }

    // Verificar que la notificación pertenece al usuario
    const notificacion = await prisma.notificacion.findUnique({
      where: { id: notificacionId },
    });

    if (!notificacion || notificacion.userId !== session.user.id) {
      return NextResponse.json({ error: "Notificación no encontrada" }, { status: 404 });
    }

    // Marcar como leída
    const actualizada = await prisma.notificacion.update({
      where: { id: notificacionId },
      data: { leida: true },
    });

    return NextResponse.json({ notificacion: actualizada });
  } catch (error: unknown) {
    console.error("Error al actualizar notificación:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
