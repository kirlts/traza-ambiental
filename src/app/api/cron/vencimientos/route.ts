import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EstadoValidacion, NivelAlertaVencimiento } from "@prisma/client";
import { addDays } from "date-fns";

interface DocumentoVencimiento {
  id: string;
  tipoDocumento: string;
  fechaVencimiento: Date;
  usuario: {
    id: string;
    name: string | null;
    email: string;
    estadoSuspension: boolean;
  };
}

// Función auxiliar para enviar email
async function enviarEmailAlerta(
  email: string,
  nombre: string,
  documentos: Array<{ tipoDocumento: string; fechaVencimiento: Date }>,
  tipoAlerta: "30dias" | "15dias" | "vencido"
) {
  try {
    const documentosFormateados = documentos.map((doc: ReturnType<typeof JSON.parse>) => ({
      tipoDocumento: doc.tipoDocumento,
      fechaVencimiento: doc.fechaVencimiento,
    }));

    let enviado = false;

    switch (tipoAlerta) {
      case "30dias":
        const { sendVencimiento30DiasEmailMultiple } = await import("@/lib/emails/send");
        enviado = await sendVencimiento30DiasEmailMultiple(email, nombre, documentosFormateados);
        break;
      case "15dias":
        const { sendVencimiento15DiasEmailMultiple } = await import("@/lib/emails/send");
        enviado = await sendVencimiento15DiasEmailMultiple(email, nombre, documentosFormateados);
        break;
      case "vencido":
        const { sendSuspensionEmailMultiple } = await import("@/lib/emails/send");
        enviado = await sendSuspensionEmailMultiple(email, nombre, documentosFormateados);
        break;
    }

    if (enviado) {
    } else {
    }

    return enviado;
  } catch (error: unknown) {
    console.error(`Error enviando email de alerta ${tipoAlerta} a ${email}:`, error);
    return false;
  }
}

// Función auxiliar para suspender usuario automáticamente
async function suspenderUsuario(userId: string, documentos: DocumentoVencimiento[]) {
  const documentosIds = documentos.map((d: ReturnType<typeof JSON.parse>) => d.id);

  await prisma.$transaction(async (tx) => {
    // Suspender usuario
    await tx.user.update({
      where: { id: userId },
      data: {
        estadoSuspension: true,
        fechaSuspension: new Date(),
        motivoSuspension: "Documentación vencida - Suspensión automática",
        documentosCausantesSuspension: documentosIds,
      },
    });

    // Actualizar documentos a VENCIDO
    await tx.documentoVerificacion.updateMany({
      where: { id: { in: documentosIds } },
      data: {
        estadoValidacion: EstadoValidacion.VENCIDO,
        nivelAlerta: NivelAlertaVencimiento.VENCIDO,
        alertaVencido: true,
        fechaAlertaVencido: new Date(),
      },
    });

    // Crear alertas de vencimiento
    const alertas = documentos.map((doc: ReturnType<typeof JSON.parse>) => ({
      documentoId: doc.id,
      usuarioId: userId,
      tipoAlerta: "SUSPENSIÓN AUTOMÁTICA",
      fechaEnvio: new Date(),
      emailEnviado: true, // Marcamos como enviado ya que el trigger del email ocurre tras la transacción
    }));

    await tx.alertaVencimiento.createMany({ data: alertas });
  });
}

/**
 * POST /api/cron/vencimientos
 *
 * Cron job que verifica documentos próximos a vencer y envía alertas.
 * Debe ejecutarse diariamente (ej: 00:00 cada día).
 */
export async function POST(_request: NextRequest) {
  try {
    // Verificar que la petición venga de un origen autorizado (opcional)
    // const authHeader = request.headers.get('authorization')
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    // }

    const hoy = new Date();
    const fechaLimite30Dias = addDays(hoy, 30);
    const fechaLimite15Dias = addDays(hoy, 15);

    // 1. Buscar documentos próximos a vencer (30 días)
    const documentos30Dias = await prisma.documentoVerificacion.findMany({
      where: {
        estadoValidacion: EstadoValidacion.APROBADO,
        fechaVencimiento: {
          gte: hoy,
          lte: fechaLimite30Dias,
        },
        alertaEnviada30d: false,
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
            estadoSuspension: true,
          },
        },
      },
    });

    // 2. Buscar documentos críticos (15 días)
    const documentos15Dias = await prisma.documentoVerificacion.findMany({
      where: {
        estadoValidacion: EstadoValidacion.APROBADO,
        fechaVencimiento: {
          gte: hoy,
          lte: fechaLimite15Dias,
        },
        alertaEnviada15d: false,
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
            estadoSuspension: true,
          },
        },
      },
    });

    // 3. Buscar documentos vencidos (sin suspensión)
    const documentosVencidos = await prisma.documentoVerificacion.findMany({
      where: {
        estadoValidacion: EstadoValidacion.APROBADO,
        fechaVencimiento: { lt: hoy },
        alertaVencido: false,
      },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
            estadoSuspension: true,
          },
        },
      },
    });

    let alertasEnviadas = 0;
    let usuariosSuspendidos = 0;

    // Procesar alertas de 30 días
    for (const doc of documentos30Dias) {
      if (!doc.usuario.estadoSuspension) {
        try {
          await enviarEmailAlerta(
            doc.usuario.email,
            doc.usuario.name || "Usuario",
            [doc],
            "30dias"
          );

          // Marcar como alerta enviada
          await prisma.documentoVerificacion.update({
            where: { id: doc.id },
            data: {
              alertaEnviada30d: true,
              fechaAlerta30d: new Date(),
              nivelAlerta: NivelAlertaVencimiento.ALERTA,
            },
          });

          alertasEnviadas++;
        } catch (error: unknown) {
          console.error(`Error enviando alerta 30d para documento ${doc.id}:`, error);
        }
      }
    }

    // Procesar alertas de 15 días
    for (const doc of documentos15Dias) {
      if (!doc.usuario.estadoSuspension) {
        try {
          await enviarEmailAlerta(
            doc.usuario.email,
            doc.usuario.name || "Usuario",
            [doc],
            "15dias"
          );

          // Marcar como alerta enviada
          await prisma.documentoVerificacion.update({
            where: { id: doc.id },
            data: {
              alertaEnviada15d: true,
              fechaAlerta15d: new Date(),
              nivelAlerta: NivelAlertaVencimiento.CRITICO,
            },
          });

          alertasEnviadas++;
        } catch (error: unknown) {
          console.error(`Error enviando alerta 15d para documento ${doc.id}:`, error);
        }
      }
    }

    // Procesar suspensiones automáticas
    const usuariosPorSuspender = new Map<string, DocumentoVencimiento[]>();

    for (const doc of documentosVencidos as unknown as DocumentoVencimiento[]) {
      if (!doc.usuario.estadoSuspension) {
        if (!usuariosPorSuspender.has(doc.usuario.id)) {
          usuariosPorSuspender.set(doc.usuario.id, []);
        }
        usuariosPorSuspender.get(doc.usuario.id)!.push(doc);
      }
    }

    // Suspender usuarios con documentos vencidos
    for (const [userId, documentos] of usuariosPorSuspender) {
      try {
        await suspenderUsuario(userId, documentos);
        usuariosSuspendidos++;

        // Intentar enviar email de suspensión
        const usuario = documentos[0].usuario;
        await enviarEmailAlerta(usuario.email, usuario.name || "Usuario", documentos, "vencido");
      } catch (error: unknown) {
        console.error(`Error suspendiendo usuario ${userId}:`, error);
      }
    }

    // Preparar respuesta
    const respuesta = {
      fechaEjecucion: hoy.toISOString(),
      estadisticas: {
        documentos30Dias: documentos30Dias.length,
        documentos15Dias: documentos15Dias.length,
        documentosVencidos: documentosVencidos.length,
        alertasEnviadas,
        usuariosSuspendidos,
      },
      mensaje: `Verificación completada. ${alertasEnviadas} alertas enviadas, ${usuariosSuspendidos} usuarios suspendidos.`,
    };

    return NextResponse.json(respuesta);
  } catch (error: unknown) {
    console.error("Error en cron job de vencimientos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/**
 * GET /api/cron/vencimientos
 *
 * Endpoint para verificar el estado del cron job (útil para debugging).
 */
export async function GET() {
  try {
    const hoy = new Date();
    const fechaLimite30Dias = addDays(hoy, 30);

    // Contar documentos por estado
    const [totalAprobados, proximos30Dias, proximos15Dias, vencidos] = await Promise.all([
      prisma.documentoVerificacion.count({
        where: { estadoValidacion: EstadoValidacion.APROBADO },
      }),
      prisma.documentoVerificacion.count({
        where: {
          estadoValidacion: EstadoValidacion.APROBADO,
          fechaVencimiento: { gte: hoy, lte: fechaLimite30Dias },
        },
      }),
      prisma.documentoVerificacion.count({
        where: {
          estadoValidacion: EstadoValidacion.APROBADO,
          fechaVencimiento: { gte: hoy, lte: addDays(hoy, 15) },
        },
      }),
      prisma.documentoVerificacion.count({
        where: {
          estadoValidacion: EstadoValidacion.APROBADO,
          fechaVencimiento: { lt: hoy },
        },
      }),
    ]);

    const usuariosSuspendidos = await prisma.user.count({
      where: { estadoSuspension: true },
    });

    return NextResponse.json({
      fechaConsulta: hoy.toISOString(),
      estadisticas: {
        totalDocumentosAprobados: totalAprobados,
        proximos30Dias,
        proximos15Dias,
        vencidos,
        usuariosSuspendidos,
      },
      estado: "Sistema operativo",
    });
  } catch (error: unknown) {
    console.error("Error obteniendo estado del cron:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
