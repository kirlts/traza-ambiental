import { prisma } from "@/lib/prisma";
import { EstadoAutorizacion } from "@prisma/client";

export interface ResultadoValidacion {
  autorizado: boolean;
  motivo?: string;
  capacidadRestante?: number;
}

/**
 * Valida si un gestor tiene autorización sanitaria vigente para un tipo de tratamiento
 * y si tiene capacidad disponible.
 */
export async function validarAutorizacionTratamiento(
  gestorId: string,
  tratamiento: ReturnType<typeof JSON.parse>,
  pesoKg: number,
  anio: number = new Date().getFullYear()
): Promise<ResultadoValidacion> {
  // 1. Obtener autorizaciones vigentes
  const autorizaciones = await prisma.autorizacionSanitaria.findMany({
    where: {
      gestorId,
      estado: EstadoAutorizacion.VIGENTE,
      fechaVencimiento: { gte: new Date() },
      tratamientosAutorizados: { has: tratamiento },
    },
  });

  // BACKWARD COMPATIBILITY: Si no hay autorizaciones específicas,
  // verificar si tiene un perfil legal verificado con resolución general.
  // Esto evita romper la funcionalidad para usuarios existentes.
  if (autorizaciones.length === 0) {
    const perfilLegal = await prisma.managerLegalProfile.findUnique({
      where: { managerId: gestorId },
    });

    if (perfilLegal?.status === "VERIFICADO" && perfilLegal.isResolutionVerified) {
      // Si tiene perfil verificado pero no autorizaciones detalladas,
      // asumimos que la resolución general cubre la operación por ahora.
      // Pero validamos la capacidad global si existe.
      if (perfilLegal.authorizedCapacity) {
        const capacidadUtilizadaGlobal = await prisma.capacidadUtilizada.aggregate({
          where: {
            gestorId,
            anio,
          },
          _sum: {
            toneladasUtilizadas: true,
          },
        });

        const totalUsado = capacidadUtilizadaGlobal._sum.toneladasUtilizadas || 0;
        const pesoToneladas = pesoKg / 1000;

        if (totalUsado + pesoToneladas > perfilLegal.authorizedCapacity) {
          return {
            autorizado: false,
            motivo: `Capacidad anual global excedida. Autorizado: ${perfilLegal.authorizedCapacity}t, Utilizado: ${totalUsado.toFixed(2)}t`,
          };
        }
      }

      return { autorizado: true }; // Permitir por compatibilidad
    }

    return {
      autorizado: false,
      motivo: `No tiene autorización sanitaria vigente específica para el tratamiento: ${tratamiento}`,
    };
  }

  // 2. Verificar capacidad disponible (para autorizaciones específicas)
  // Obtenemos la capacidad total autorizada para este tratamiento (sumando todas las resoluciones vigentes)
  // Nota: Una resolución puede autorizar varios tratamientos, su capacidad es global para esa resolución.
  // Simplificación: Sumamos capacidades de resoluciones que incluyen este tratamiento.
  // (Esto podría refinarse si la capacidad es compartida entre tratamientos en una misma resolución)

  const capacidadTotal = autorizaciones.reduce(
    (total, auth: ReturnType<typeof JSON.parse>) => total + auth.capacidadAnualTn,
    0
  );

  // Consultar uso actual
  const usoActual = await prisma.capacidadUtilizada.findUnique({
    where: {
      gestorId_anio_tratamiento: {
        gestorId,
        anio,
        tratamiento,
      },
    },
  });

  const utilizada = usoActual?.toneladasUtilizadas || 0;
  const disponible = capacidadTotal - utilizada;
  const pesoToneladas = pesoKg / 1000;

  if (pesoToneladas > disponible) {
    return {
      autorizado: false,
      motivo: `Capacidad insuficiente para ${tratamiento}. Disponible: ${disponible.toFixed(2)} ton, Requerido: ${pesoToneladas.toFixed(4)} ton`,
    };
  }

  return {
    autorizado: true,
    capacidadRestante: disponible - pesoToneladas,
  };
}

/**
 * Registra el consumo de capacidad una vez que el tratamiento es confirmado.
 */
export async function registrarConsumoCapacidad(
  gestorId: string,
  tratamiento: ReturnType<typeof JSON.parse>,
  pesoKg: number,
  anio: number = new Date().getFullYear()
) {
  const pesoToneladas = pesoKg / 1000;

  await prisma.capacidadUtilizada.upsert({
    where: {
      gestorId_anio_tratamiento: {
        gestorId,
        anio,
        tratamiento,
      },
    },
    update: {
      toneladasUtilizadas: { increment: pesoToneladas },
      ultimaActualizacion: new Date(),
    },
    create: {
      gestorId,
      anio,
      tratamiento,
      toneladasUtilizadas: pesoToneladas,
    },
  });
}
