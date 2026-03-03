import { prisma } from "@/lib/prisma";

/**
 * Helpers para gestión de metas del Sistema de Gestión
 */

// Interfaz para el resultado de avance
export interface AvanceMeta {
  metaToneladas: number;
  avanceToneladas: number;
  porcentajeAvance: number;
  restante: number;
  cumplida: boolean;
}

// Interfaz para proyección de cumplimiento
export interface ProyeccionCumplimiento {
  cumplira: boolean;
  fechaEstimadaCumplimiento?: Date;
  tonelajesPendientes: number;
  ritmoActual: number; // toneladas por mes
  mesesRestantes: number;
  mensaje: string;
}

/**
 * Calcula el avance de una meta basado en certificados de valorización
 *
 * @param sistemaGestionId - ID del sistema de gestión
 * @param anio - Año de la meta
 * @param tipo - Tipo de meta (recoleccion o valorizacion)
 * @returns Avance calculado
 */
export async function calcularAvanceMeta(
  sistemaGestionId: string,
  anio: number,
  tipo: "recoleccion" | "valorizacion"
): Promise<AvanceMeta | null> {
  // Buscar la meta
  const meta = await prisma.meta.findFirst({
    where: {
      sistemaGestionId,
      anio,
      tipo,
    },
  });

  if (!meta) {
    return null;
  }

  // Por ahora retornamos los valores actuales de la meta
  const avanceToneladas = meta.avanceToneladas;
  const porcentajeAvance = (avanceToneladas / meta.metaToneladas) * 100;
  const restante = Math.max(0, meta.metaToneladas - avanceToneladas);

  const cumplida = avanceToneladas >= meta.metaToneladas;

  return {
    metaToneladas: meta.metaToneladas,
    avanceToneladas,
    porcentajeAvance: Math.round(porcentajeAvance * 100) / 100,
    restante: Math.round(restante * 100) / 100,
    cumplida,
  };
}

/**
 * Calcula el avance de todas las metas de un año para un sistema
 */
export async function calcularAvanceAnual(sistemaGestionId: string, anio: number) {
  const recoleccion = await calcularAvanceMeta(sistemaGestionId, anio, "recoleccion");
  const valorizacion = await calcularAvanceMeta(sistemaGestionId, anio, "valorizacion");

  return {
    anio,
    recoleccion,
    valorizacion,
  };
}

/**
 * Proyecta si se cumplirá la meta basado en el ritmo actual
 *
 * @param metaToneladas - Meta total en toneladas
 * @param avanceToneladas - Avance actual en toneladas
 * @param anio - Año de la meta
 * @returns Proyección de cumplimiento
 */
export function proyectarCumplimientoMeta(
  metaToneladas: number,
  avanceToneladas: number
): ProyeccionCumplimiento {
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1; // 1-12

  // Calcular meses transcurridos y restantes
  const mesesTranscurridos = mesActual;
  const mesesRestantes = 12 - mesActual;

  // Ritmo actual (toneladas por mes)
  const ritmoActual = mesesTranscurridos > 0 ? avanceToneladas / mesesTranscurridos : 0;

  // Toneladas pendientes
  const tonelajesPendientes = Math.max(0, metaToneladas - avanceToneladas);

  // Proyección al final del año
  const proyeccionFinalAnio = avanceToneladas + ritmoActual * mesesRestantes;

  // Determinar si cumplirá
  const cumplira = proyeccionFinalAnio >= metaToneladas;

  // Calcular fecha estimada de cumplimiento
  let fechaEstimadaCumplimiento: Date | undefined;
  let mensaje: string;

  if (avanceToneladas >= metaToneladas) {
    mensaje = "¡Meta ya cumplida!";
    fechaEstimadaCumplimiento = hoy;
  } else if (ritmoActual === 0) {
    mensaje = "Sin avance registrado. No es posible proyectar cumplimiento.";
  } else if (cumplira) {
    // Calcular en cuántos meses más se cumplirá
    const mesesParaCumplir = tonelajesPendientes / ritmoActual;
    fechaEstimadaCumplimiento = new Date(hoy);
    fechaEstimadaCumplimiento.setMonth(hoy.getMonth() + Math.ceil(mesesParaCumplir));
    mensaje = `Se proyecta cumplir la meta en ${fechaEstimadaCumplimiento.toLocaleDateString("es-CL")}`;
  } else {
    const deficit = metaToneladas - proyeccionFinalAnio;
    mensaje = `A ritmo actual, faltarían ${Math.round(deficit)} toneladas al finalizar el año`;
  }

  return {
    cumplira,
    fechaEstimadaCumplimiento,
    tonelajesPendientes: Math.round(tonelajesPendientes * 100) / 100,
    ritmoActual: Math.round(ritmoActual * 100) / 100,
    mesesRestantes,
    mensaje,
  };
}

/**
 * Valida si se puede modificar una meta
 */
export function validarModificacionMeta(
  metaActual: number,
  metaNueva: number,
  avanceActual: number
): { valida: boolean; mensaje?: string } {
  // No se puede reducir la meta por debajo del avance actual
  if (metaNueva < avanceActual) {
    return {
      valida: false,
      mensaje: `No se puede reducir la meta por debajo del avance actual (${avanceActual} ton)`,
    };
  }

  // Advertencia si el cambio es muy significativo
  const diferencia = Math.abs(metaNueva - metaActual);
  const porcentajeCambio = (diferencia / metaActual) * 100;

  if (porcentajeCambio > 50) {
    return {
      valida: false,
      mensaje: `El cambio de meta es demasiado significativo (${Math.round(porcentajeCambio)}%). Por favor contacte al administrador.`,
    };
  }

  return { valida: true };
}

/**
 * Obtiene el historial de metas de un sistema de gestión
 */
export async function obtenerHistorialMetas(sistemaGestionId: string) {
  const metas = await prisma.meta.findMany({
    where: {
      sistemaGestionId,
    },
    orderBy: [{ anio: "desc" }, { tipo: "asc" }],
    include: {
      desgloses: true,
    },
  });

  // Agrupar por año
  const metasPorAnio: Record<
    number,
    {
      anio: number;
      recoleccion?: (typeof metas)[0];
      valorizacion?: (typeof metas)[0];
    }
  > = {};

  for (const meta of metas) {
    if (!metasPorAnio[meta.anio]) {
      metasPorAnio[meta.anio] = { anio: meta.anio };
    }
    if (meta.tipo === "recoleccion") {
      metasPorAnio[meta.anio].recoleccion = meta;
    } else {
      metasPorAnio[meta.anio].valorizacion = meta;
    }
  }

  return Object.values(metasPorAnio);
}

/**
 * Registra una acción en auditoría
 */
export async function registrarAuditoria(
  usuarioId: string,
  accion: string,
  entidad: string,
  entidadId: string,
  valorAnterior: unknown,
  valorNuevo: unknown,
  justificacion?: string
) {
  return await prisma.auditoriaConfiguracion.create({
    data: {
      usuarioId,
      accion,
      entidad,
      entidadId,
      valorAnterior: valorAnterior ? JSON.stringify(valorAnterior) : null,
      valorNuevo: JSON.stringify(valorNuevo),
      justificacion,
    },
  });
}

/**
 * Determina el estado de cumplimiento basado en el porcentaje
 */
export function determinarEstadoCumplimiento(porcentaje: number): {
  estado: "critico" | "alerta" | "enprogreso" | "cercano" | "cumplido";
  color: string;
  mensaje: string;
} {
  if (porcentaje >= 100) {
    return {
      estado: "cumplido",
      color: "green",
      mensaje: "¡Meta cumplida!",
    };
  } else if (porcentaje >= 90) {
    return {
      estado: "cercano",
      color: "blue",
      mensaje: "Cerca de cumplir la meta",
    };
  } else if (porcentaje >= 50) {
    return {
      estado: "enprogreso",
      color: "yellow",
      mensaje: "En progreso",
    };
  } else if (porcentaje >= 25) {
    return {
      estado: "alerta",
      color: "orange",
      mensaje: "Avance bajo, requiere atención",
    };
  } else {
    return {
      estado: "critico",
      color: "red",
      mensaje: "Avance crítico, acción urgente requerida",
    };
  }
}
