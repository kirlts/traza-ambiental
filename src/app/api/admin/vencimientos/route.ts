import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoValidacion, NivelAlertaVencimiento } from "@prisma/client";
import { addDays, isBefore } from "date-fns";

/**
 * GET /api/admin/vencimientos
 *
 * Lista todos los documentos próximos a vencer o ya vencidos.
 * Incluye alertas por niveles de urgencia.
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    // Verificar que sea administrador
    const userRoleInfo = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const isAdm = userRoleInfo?.roles.some(
      (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Administrador"
    );

    if (!isAdm) {
      return NextResponse.json(
        { error: "No autorizado - Requiere rol administrador" },
        { status: 403 }
      );
    }

    const hoy = new Date();
    const fechaLimite30Dias = addDays(hoy, 30);
    const _fechaLimite15Dias = addDays(hoy, 15);

    // Obtener documentos con fechas de vencimiento próximas o vencidas
    const documentosVencimiento = await prisma.documentoVerificacion.findMany({
      where: {
        estadoValidacion: EstadoValidacion.APROBADO,
        OR: [
          // Vencidos
          { fechaVencimiento: { lt: hoy } },
          // Próximos a vencer (30 días)
          {
            fechaVencimiento: {
              gte: hoy,
              lte: fechaLimite30Dias,
            },
          },
        ],
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: {
              include: {
                role: true,
              },
            },
            estadoVerificacion: true,
            estadoSuspension: true,
            fechaSuspension: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            patente: true,
            tipo: true,
          },
        },
      },
      orderBy: [{ fechaVencimiento: "asc" }, { usuario: { name: "asc" } }],
    });

    // Clasificar documentos por nivel de alerta
    const documentosClasificados = documentosVencimiento.map(
      (doc: ReturnType<typeof JSON.parse>) => {
        const diasHastaVencimiento = Math.ceil(
          (doc.fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        );

        let nivelAlerta: NivelAlertaVencimiento;
        let prioridad: number;

        if (isBefore(doc.fechaVencimiento, hoy)) {
          // Vencido
          nivelAlerta = NivelAlertaVencimiento.VENCIDO;
          prioridad = 1;
        } else if (diasHastaVencimiento <= 15) {
          // Crítico (15 días o menos)
          nivelAlerta = NivelAlertaVencimiento.CRITICO;
          prioridad = 2;
        } else {
          // Alerta (16-30 días)
          nivelAlerta = NivelAlertaVencimiento.ALERTA;
          prioridad = 3;
        }

        return {
          ...doc,
          diasHastaVencimiento,
          nivelAlerta,
          prioridad,
          requiereAccion:
            !doc.usuario.estadoSuspension && nivelAlerta === NivelAlertaVencimiento.VENCIDO,
        };
      }
    );

    // Ordenar por prioridad (vencidos primero)
    documentosClasificados.sort(
      (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) =>
        a.prioridad - b.prioridad
    );

    // Calcular estadísticas
    const stats = {
      total: documentosClasificados.length,
      vencidos: documentosClasificados.filter(
        (d: ReturnType<typeof JSON.parse>) => d.nivelAlerta === NivelAlertaVencimiento.VENCIDO
      ).length,
      criticos: documentosClasificados.filter(
        (d: ReturnType<typeof JSON.parse>) => d.nivelAlerta === NivelAlertaVencimiento.CRITICO
      ).length,
      alerta: documentosClasificados.filter(
        (d: ReturnType<typeof JSON.parse>) => d.nivelAlerta === NivelAlertaVencimiento.ALERTA
      ).length,
      requierenAccion: documentosClasificados.filter(
        (d: ReturnType<typeof JSON.parse>) => d.requiereAccion
      ).length,
      transportistas: documentosClasificados.filter((d: ReturnType<typeof JSON.parse>) =>
        d.usuario.roles.some(
          (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Transportista"
        )
      ).length,
      gestores: documentosClasificados.filter((d: ReturnType<typeof JSON.parse>) =>
        d.usuario.roles.some((ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Gestor")
      ).length,
    };

    return NextResponse.json({
      documentos: documentosClasificados,
      estadisticas: stats,
      fechaConsulta: hoy.toISOString(),
    });
  } catch (error: unknown) {
    console.error("Error obteniendo vencimientos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
