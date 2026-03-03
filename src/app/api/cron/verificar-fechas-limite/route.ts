import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calcularFechaLimiteDeclaracion,
  calcularDiasRestantes,
  getAnioDeclaracionActual,
} from "@/lib/helpers/declaracion-helpers";

// Este endpoint debería ser llamado por un cron job diario
// En Vercel, se puede configurar en vercel.json
// Para desarrollo, se puede llamar manualmente o configurar con node-cron

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación del cron (opcional pero recomendado)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "dev-secret-change-in-production";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const anioActual = getAnioDeclaracionActual();
    const fechaLimite = calcularFechaLimiteDeclaracion(anioActual);
    const diasRestantes = calcularDiasRestantes(fechaLimite);

    // Log de verificación de cron eliminado

    // Solo crear alertas si estamos dentro del rango de 30 días
    if (diasRestantes <= 0 || diasRestantes > 30) {
      return NextResponse.json({
        mensaje: "Fuera del período de alertas",
        diasRestantes,
        anio: anioActual,
      });
    }

    // Obtener todos los productores
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
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (productores.length === 0) {
      return NextResponse.json({
        mensaje: "No hay productores registrados",
        diasRestantes,
        anio: anioActual,
      });
    }

    // Verificar qué productores tienen declaraciones pendientes
    const declaracionesExistentes = await prisma.declaracionAnual.findMany({
      where: {
        anio: anioActual,
        productorId: { in: productores.map((p) => p.id) },
      },
      select: {
        productorId: true,
        estado: true,
      },
    });

    // Crear un mapa de productores con su estado de declaración
    const estadoDeclaracionMap = new Map(
      declaracionesExistentes.map((d: ReturnType<typeof JSON.parse>) => [d.productorId, d.estado])
    );

    // Determinar qué tipo de alerta enviar según días restantes
    let tipoAlerta: string;
    let nivelUrgencia: "info" | "warning" | "critical";
    let tituloBase: string;

    if (diasRestantes <= 3) {
      tipoAlerta = "alerta_plazo_critico";
      nivelUrgencia = "critical";
      tituloBase = "🚨 URGENTE: Quedan solo {dias} días para declarar";
    } else if (diasRestantes <= 7) {
      tipoAlerta = "alerta_plazo_urgente";
      nivelUrgencia = "warning";
      tituloBase = "⚠️ Quedan {dias} días para enviar tu declaración";
    } else if (diasRestantes <= 15) {
      tipoAlerta = "alerta_plazo";
      nivelUrgencia = "warning";
      tituloBase = "📅 Recordatorio: {dias} días para declarar";
    } else {
      tipoAlerta = "alerta_plazo_informativa";
      nivelUrgencia = "info";
      tituloBase = "📢 Período de declaración abierto: {dias} días restantes";
    }

    const notificacionesCreadas: string[] = [];

    // Crear notificaciones para productores sin declaración o con borrador
    for (const productor of productores) {
      const estadoDeclaracion = estadoDeclaracionMap.get(productor.id);

      // Solo notificar si no tiene declaración o está en borrador
      if (!estadoDeclaracion || estadoDeclaracion === "borrador") {
        // Verificar si ya existe una notificación similar reciente (últimas 24 horas)
        const notificacionReciente = await prisma.notificacion.findFirst({
          where: {
            userId: productor.id,
            tipo: {
              in: [
                "alerta_plazo_critico",
                "alerta_plazo_urgente",
                "alerta_plazo",
                "alerta_plazo_informativa",
              ],
            },
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
            },
          },
        });

        // Solo crear si no hay notificación reciente
        if (!notificacionReciente) {
          const titulo = tituloBase.replace("{dias}", diasRestantes.toString());
          const mensaje =
            estadoDeclaracion === "borrador"
              ? `Tienes una declaración en borrador para el año ${anioActual}. Complétala y envíala antes del ${fechaLimite.toLocaleDateString("es-CL")}.`
              : `No has iniciado tu declaración anual de neumáticos para el año ${anioActual}. La fecha límite es el ${fechaLimite.toLocaleDateString("es-CL")}.`;

          await prisma.notificacion.create({
            data: {
              userId: productor.id,
              tipo: tipoAlerta,
              titulo,
              mensaje,
              leida: false,
            },
          });

          notificacionesCreadas.push(productor.email || productor.name || "Usuario");
        }
      }
    }

    // Log de notificación completada eliminado

    return NextResponse.json({
      mensaje: "Verificación completada",
      anio: anioActual,
      diasRestantes,
      nivelUrgencia,
      totalProductores: productores.length,
      notificacionesCreadas: notificacionesCreadas.length,
      productoresNotificados: notificacionesCreadas,
    });
  } catch (error: unknown) {
    console.error("[CRON] Error al verificar fechas límite:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
