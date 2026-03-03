import { prisma } from "@/lib/prisma";

/**
 * Genera un folio único para una declaración
 * Formato: DECL-YYYY-NNNN (ej: DECL-2025-0001)
 */
export async function generarFolioDeclaracion(anio: number): Promise<string> {
  // Obtener el último folio del año
  const ultimaDeclaracion = await prisma.declaracionAnual.findFirst({
    where: {
      anio,
      folio: {
        not: null,
      },
    },
    orderBy: {
      folio: "desc",
    },
  });

  let numero = 1;
  if (ultimaDeclaracion?.folio) {
    // Extraer el número del folio (DECL-2025-0001 -> 0001)
    const match = ultimaDeclaracion.folio.match(/DECL-\d{4}-(\d{4})/);
    if (match) {
      numero = parseInt(match[1]) + 1;
    }
  }

  // Formatear con padding de 4 dígitos
  const numeroFormateado = numero.toString().padStart(4, "0");
  return `DECL-${anio}-${numeroFormateado}`;
}

/**
 * Calcula la fecha límite de declaración (31 de marzo del año siguiente)
 */
export function calcularFechaLimiteDeclaracion(anioDeclaracion: number): Date {
  // Fecha límite es 31 de marzo del año siguiente al declarado
  return new Date(anioDeclaracion + 1, 2, 31, 23, 59, 59); // Mes 2 = marzo (0-indexed)
}

/**
 * Calcula los días restantes hasta la fecha límite
 */
export function calcularDiasRestantes(fechaLimite: Date): number {
  const hoy = new Date();
  const diff = fechaLimite.getTime() - hoy.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si está dentro del período de declaración
 */
export function estaDentroDePeriodoDeclaracion(anioDeclaracion: number): boolean {
  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  const fechaLimite = calcularFechaLimiteDeclaracion(anioDeclaracion);

  // Solo se puede declarar el año inmediatamente anterior
  // y hasta la fecha límite (31 de marzo)
  return anioDeclaracion === anioActual - 1 && hoy <= fechaLimite;
}

/**
 * Obtiene el año de declaración actual (año anterior)
 */
export function getAnioDeclaracionActual(): number {
  const hoy = new Date();
  return hoy.getFullYear() - 1;
}

/**
 * Obtiene la configuración de porcentajes de metas para un año específico
 */
export async function obtenerPorcentajesMetasREP(anio: number): Promise<{
  recoleccion: number;
  valorizacion: number;
}> {
  const config = await prisma.configuracionMetasREP.findUnique({
    where: { id: "config-metas-rep" },
  });

  if (!config) {
    throw new Error("Configuración de metas REP no encontrada");
  }

  const porcentajes = JSON.parse(config.porcentajes);

  // Si no hay configuración para el año específico, usar la más reciente
  if (!porcentajes[anio.toString()]) {
    const aniosDisponibles = Object.keys(porcentajes)
      .map(Number)
      .sort((a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) => b - a);
    const anioMasCercano =
      aniosDisponibles.find((a: ReturnType<typeof JSON.parse>) => a <= anio) ||
      aniosDisponibles[aniosDisponibles.length - 1];

    return porcentajes[anioMasCercano.toString()];
  }

  return porcentajes[anio.toString()];
}

/**
 * Calcula las metas de recolección y valorización basadas en toneladas declaradas
 */
export async function calcularMetasREP(
  anioDeclaracion: number,
  toneladasDeclaradas: number
): Promise<{
  metaRecoleccion: number;
  metaValorizacion: number;
  anioMeta: number;
}> {
  // Las metas se aplican al año siguiente a la declaración
  const anioMeta = anioDeclaracion + 1;

  // Obtener porcentajes configurados
  const porcentajes = await obtenerPorcentajesMetasREP(anioMeta);

  // Calcular meta de recolección (porcentaje sobre toneladas declaradas)
  const metaRecoleccion = (toneladasDeclaradas * porcentajes.recoleccion) / 100;

  // Calcular meta de valorización (porcentaje sobre meta de recolección)
  const metaValorizacion = (metaRecoleccion * porcentajes.valorizacion) / 100;

  return {
    metaRecoleccion: Number(metaRecoleccion.toFixed(2)),
    metaValorizacion: Number(metaValorizacion.toFixed(2)),
    anioMeta,
  };
}

/**
 * Formatea toneladas para visualización
 */
export function formatearToneladas(toneladas: number): string {
  return (
    new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(toneladas) + " ton"
  );
}

/**
 * Formatea unidades para visualización
 */
export function formatearUnidades(unidades: number): string {
  return new Intl.NumberFormat("es-CL").format(unidades);
}

/**
 * Formatea porcentaje para visualización
 */
export function formatearPorcentaje(porcentaje: number): string {
  return (
    new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(porcentaje) + "%"
  );
}

/**
 * Calcula el avance porcentual de una meta
 */
export function calcularPorcentajeAvance(avance: number, meta: number): number {
  if (meta === 0) return 0;
  return Number(((avance / meta) * 100).toFixed(2));
}

/**
 * Determina el estado de una meta basado en su avance
 */
export function determinarEstadoMeta(
  porcentajeAvance: number,
  fechaLimite: Date
): "cumplida" | "en_progreso" | "en_riesgo" | "incumplida" {
  const hoy = new Date();
  const estaVencida = hoy > fechaLimite;

  if (porcentajeAvance >= 100) {
    return "cumplida";
  }

  if (estaVencida) {
    return "incumplida";
  }

  // Calcular si está en riesgo (menos del 80% de avance con menos del 20% del tiempo)
  const diasRestantes = calcularDiasRestantes(fechaLimite);
  const diasTotales = 365; // Un año
  const tiempoTranscurrido = ((diasTotales - diasRestantes) / diasTotales) * 100;

  if (tiempoTranscurrido > 80 && porcentajeAvance < 80) {
    return "en_riesgo";
  }

  return "en_progreso";
}

/**
 * Valida que el productor puede crear/editar una declaración
 */
export async function validarPermisoDeclaracion(
  userId: string,
  declaracionId?: string
): Promise<boolean> {
  if (!declaracionId) {
    return true; // Puede crear nueva
  }

  const declaracion = await prisma.declaracionAnual.findUnique({
    where: { id: declaracionId },
  });

  return declaracion?.productorId === userId;
}

/**
 * Valida que una declaración puede ser modificada (solo borradores)
 */
export async function puedeModificarDeclaracion(declaracionId: string): Promise<boolean> {
  const declaracion = await prisma.declaracionAnual.findUnique({
    where: { id: declaracionId },
    select: { estado: true },
  });

  return declaracion?.estado === "borrador";
}
