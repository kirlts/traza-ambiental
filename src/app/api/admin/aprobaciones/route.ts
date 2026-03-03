import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoVerificacionUsuario } from "@prisma/client";

/**
 * GET /api/admin/aprobaciones
 *
 * Lista todos los usuarios pendientes de aprobación de documentos.
 * Incluye información de documentos cargados y estado de verificación.
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    // Verificar que sea administrador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const roleNames = user?.roles.map((ur: ReturnType<typeof JSON.parse>) => ur.role.name) || [];

    if (!roleNames.includes("Administrador")) {
      return NextResponse.json(
        { error: "No autorizado - Requiere rol administrador" },
        { status: 403 }
      );
    }

    // Obtener usuarios pendientes de verificación
    const usuariosPendientes = await prisma.user.findMany({
      where: {
        OR: [
          { estadoVerificacion: EstadoVerificacionUsuario.DOCUMENTOS_CARGADOS },
          { estadoVerificacion: EstadoVerificacionUsuario.PENDIENTE_VERIFICACION },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        rut: true,
        roles: {
          include: {
            role: true,
          },
        },
        estadoVerificacion: true,
        createdAt: true,
        documentos: {
          select: {
            id: true,
            tipoDocumento: true,
            numeroFolio: true,
            fechaEmision: true,
            fechaVencimiento: true,
            estadoValidacion: true,
            archivoNombre: true,
            archivoTamano: true,
            archivoTipo: true,
            validadoPor: {
              select: {
                name: true,
                email: true,
              },
            },
            fechaValidacion: true,
            notasValidacion: true,
            vehiculoPatente: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Calcular estadísticas
    const stats = {
      totalPendientes: usuariosPendientes.length,
      transportistasPendientes: usuariosPendientes.filter((u) =>
        u.roles.some((ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Transportista")
      ).length,
      gestoresPendientes: usuariosPendientes.filter((u) =>
        u.roles.some((ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Gestor")
      ).length,
      documentosTotales: usuariosPendientes.reduce((sum, user) => sum + user.documentos.length, 0),
    };

    return NextResponse.json({
      usuarios: usuariosPendientes,
      estadisticas: stats,
    });
  } catch (error: unknown) {
    console.error("Error obteniendo aprobaciones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
