import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: "Acceso denegado - Solo administradores" },
        { status: 403 }
      );
    }

    // Obtener configuración
    const config = await prisma.configuracionMetasREP.findUnique({
      where: { id: "config-metas-rep" },
    });

    if (!config) {
      return NextResponse.json({ error: "Configuración no encontrada" }, { status: 404 });
    }

    // Parsear porcentajes de JSON
    const porcentajes = JSON.parse(config.porcentajes);

    return NextResponse.json({
      configuracion: {
        porcentajes,
        ultimaActualizacion: config.ultimaActualizacion,
        actualizadoPor: config.actualizadoPor,
      },
    });
  } catch (error: unknown) {
    console.error("Error al obtener configuración REP:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: "Acceso denegado - Solo administradores" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { porcentajes } = body;

    if (!porcentajes || typeof porcentajes !== "object") {
      return NextResponse.json({ error: "Porcentajes inválidos" }, { status: 400 });
    }

    // Validar estructura de porcentajes
    for (const [anio, valores] of Object.entries(porcentajes)) {
      if (!valores || typeof valores !== "object") {
        return NextResponse.json(
          { error: `Porcentajes inválidos para año ${anio}` },
          { status: 400 }
        );
      }

      const { recoleccion, valorizacion } = valores as {
        recoleccion: number;
        valorizacion: number;
      };

      if (typeof recoleccion !== "number" || typeof valorizacion !== "number") {
        return NextResponse.json(
          { error: `Porcentajes deben ser números para año ${anio}` },
          { status: 400 }
        );
      }

      if (recoleccion < 0 || recoleccion > 100 || valorizacion < 0 || valorizacion > 100) {
        return NextResponse.json(
          { error: `Porcentajes deben estar entre 0 y 100 para año ${anio}` },
          { status: 400 }
        );
      }
    }

    // Actualizar configuración
    const configActualizada = await prisma.configuracionMetasREP.update({
      where: { id: "config-metas-rep" },
      data: {
        porcentajes: JSON.stringify(porcentajes),
        actualizadoPor: session.user.email || session.user.name || "admin",
      },
    });

    // Crear notificación para todos los productores (opcional)
    // Esto podría ser útil para notificar cambios en las metas
    const productores = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: "Productor",
            },
          },
        },
      },
      select: { id: true },
    });

    if (productores.length > 0) {
      await prisma.notificacion.createMany({
        data: productores.map((p) => ({
          userId: p.id,
          tipo: "configuracion_actualizada",
          titulo: "Configuración de Metas REP Actualizada",
          mensaje:
            "Los porcentajes de metas de recolección y valorización han sido actualizados por un administrador. Revisa las nuevas metas en el sistema.",
          leida: false,
        })),
      });
    }

    return NextResponse.json({
      mensaje: "Configuración actualizada exitosamente",
      configuracion: {
        porcentajes: JSON.parse(configActualizada.porcentajes),
        ultimaActualizacion: configActualizada.ultimaActualizacion,
        actualizadoPor: configActualizada.actualizadoPor,
      },
    });
  } catch (error: unknown) {
    console.error("Error al actualizar configuración REP:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
