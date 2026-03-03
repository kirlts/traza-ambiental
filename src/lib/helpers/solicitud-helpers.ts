/**
 * Helpers para Lógica de Negocio de Solicitudes de Retiro
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { prisma } from "@/lib/prisma";
import { EstadoSolicitud } from "@prisma/client";

// ============================================
// Generación de Folio Único
// ============================================

/**
 * Genera un folio único para una solicitud de retiro
 * Formato: SOL-YYYYMMDD-XXXX
 *
 * @returns Promise<string> Folio único generado
 *
 * @example
 * const folio = await generarFolio();
 * // Resultado: "SOL-20251029-0001"
 */
export async function generarFolio(): Promise<string> {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  const fechaStr = `${year}${month}${day}`;

  // Buscar el último folio del día
  const ultimaSolicitud = await prisma.solicitudRetiro.findFirst({
    where: {
      folio: {
        startsWith: `SOL-${fechaStr}-`,
      },
    },
    orderBy: {
      folio: "desc",
    },
    select: {
      folio: true,
    },
  });

  let secuencia = 1;
  if (ultimaSolicitud) {
    // Extraer el número de secuencia del último folio
    const ultimoNumero = parseInt(ultimaSolicitud.folio.split("-")[2], 10);
    secuencia = ultimoNumero + 1;
  }

  // Generar el folio con secuencia de 4 dígitos
  const folioSecuencia = String(secuencia).padStart(4, "0");
  return `SOL-${fechaStr}-${folioSecuencia}`;
}

// ============================================
// Cálculo de Totales
// ============================================

interface CategoriasData {
  categoriaA_cantidad: number;
  categoriaA_pesoEst: number;
  categoriaB_cantidad: number;
  categoriaB_pesoEst: number;
}

interface TotalesCalculados {
  cantidadTotal: number;
  pesoTotalEstimado: number;
}

/**
 * Calcula los totales de cantidad y peso de una solicitud
 *
 * @param categorias Datos de categorías A y B
 * @returns Totales calculados
 *
 * @example
 * const totales = calcularTotales({
 *   categoriaA_cantidad: 10,
 *   categoriaA_pesoEst: 80.5,
 *   categoriaB_cantidad: 5,
 *   categoriaB_pesoEst: 150.0,
 * });
 * // Resultado: { cantidadTotal: 15, pesoTotalEstimado: 230.5 }
 */
export function calcularTotales(categorias: CategoriasData): TotalesCalculados {
  const cantidadTotal =
    (categorias.categoriaA_cantidad || 0) + (categorias.categoriaB_cantidad || 0);

  const pesoTotalEstimado =
    (categorias.categoriaA_pesoEst || 0) + (categorias.categoriaB_pesoEst || 0);

  return {
    cantidadTotal,
    pesoTotalEstimado,
  };
}

// ============================================
// Creación de Cambio de Estado
// ============================================

interface CrearCambioEstadoParams {
  solicitudId: string;
  estadoAnterior: EstadoSolicitud | null;
  estadoNuevo: EstadoSolicitud;
  realizadoPor: string;
  notas?: string;
}

/**
 * Crea un registro de cambio de estado en el historial
 *
 * @param params Parámetros del cambio de estado
 * @returns Promise<void>
 */
export async function crearCambioEstado(params: CrearCambioEstadoParams): Promise<void> {
  await prisma.cambioEstado.create({
    data: {
      solicitudId: params.solicitudId,
      estadoAnterior: params.estadoAnterior,
      estadoNuevo: params.estadoNuevo,
      realizadoPor: params.realizadoPor,
      notas: params.notas,
    },
  });
}

// ============================================
// Validación de Permisos de Generador
// ============================================

/**
 * Verifica si un usuario puede crear solicitudes de retiro
 * Debe ser generador y tener cuenta aprobada
 *
 * @param userId ID del usuario
 * @returns Promise<boolean> true si puede crear solicitudes
 *
 * @throws Error si el usuario no existe
 */
export async function puedeCrearSolicitud(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
      solicitudesRegistro: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Verificar que tenga rol de generador
  const esGenerador = user.roles.some(
    (ur: ReturnType<typeof JSON.parse>) =>
      ur.role.name === "Generador" || ur.role.name === "generador"
  );

  if (!esGenerador) {
    return false;
  }

  // Verificar que tenga solicitud de registro aprobada o cuenta aprobada explícitamente
  const tieneRegistroAprobado = user.solicitudesRegistro?.estado === "aprobada";

  return tieneRegistroAprobado || user.cuentaAprobada;
}

// ============================================
// Formateo de Datos para Response
// ============================================

/**
 * Formatea una solicitud para ser enviada al cliente
 * Incluye información completa del generador y estados
 *
 * @param solicitud Solicitud de retiro desde la BD
 * @returns Solicitud formateada
 */
export function formatearSolicitudParaResponse(solicitud: ReturnType<typeof JSON.parse>) {
  return {
    id: solicitud.id,
    folio: solicitud.folio,

    // Información del retiro
    direccionRetiro: solicitud.direccionRetiro,
    region: solicitud.region,
    comuna: solicitud.comuna,
    fechaPreferida: solicitud.fechaPreferida.toISOString(),
    horarioPreferido: solicitud.horarioPreferido,

    // Detalles de NFU
    categoriaA_cantidad: solicitud.categoriaA_cantidad,
    categoriaA_pesoEst: solicitud.categoriaA_pesoEst,
    categoriaB_cantidad: solicitud.categoriaB_cantidad,
    categoriaB_pesoEst: solicitud.categoriaB_pesoEst,
    cantidadTotal: solicitud.cantidadTotal,
    pesoTotalEstimado: solicitud.pesoTotalEstimado,

    categoriaA: {
      cantidad: solicitud.categoriaA_cantidad,
      pesoEstimado: solicitud.categoriaA_pesoEst,
    },
    categoriaB: {
      cantidad: solicitud.categoriaB_cantidad,
      pesoEstimado: solicitud.categoriaB_pesoEst,
    },
    totales: {
      cantidad: solicitud.cantidadTotal,
      pesoEstimado: solicitud.pesoTotalEstimado,
    },

    // Contacto
    contacto: {
      nombre: solicitud.nombreContacto,
      telefono: solicitud.telefonoContacto,
    },
    instrucciones: solicitud.instrucciones,
    fotos: solicitud.fotos || [],

    // Estado y trazabilidad
    estado: solicitud.estado,
    esBorrador: solicitud.esBorrador,

    // Fechas
    createdAt: solicitud.createdAt.toISOString(),
    updatedAt: solicitud.updatedAt.toISOString(),

    // Generador (si está incluido)
    generador: solicitud.generador
      ? {
          id: solicitud.generador.id,
          name: solicitud.generador.name,
          email: solicitud.generador.email,
          rut: solicitud.generador.rut,
        }
      : undefined,
  };
}

// ============================================
// Validación de Transición de Estados
// ============================================

/**
 * Estados válidos a los que se puede transicionar desde cada estado
 */
const TRANSICIONES_VALIDAS: Record<EstadoSolicitud, EstadoSolicitud[]> = {
  PENDIENTE: ["ACEPTADA", "RECHAZADA", "CANCELADA"],
  ACEPTADA: ["EN_CAMINO", "CANCELADA"],
  EN_CAMINO: ["RECOLECTADA", "CANCELADA"],
  RECOLECTADA: ["ENTREGADA_GESTOR"],
  ENTREGADA_GESTOR: ["RECIBIDA_PLANTA"],
  RECIBIDA_PLANTA: ["TRATADA"],
  TRATADA: [],
  RECHAZADA: [],
  CANCELADA: [],
};

/**
 * Verifica si una transición de estado es válida
 *
 * @param estadoActual Estado actual de la solicitud
 * @param nuevoEstado Nuevo estado propuesto
 * @returns boolean true si la transición es válida
 */
export function esTransicionValida(
  estadoActual: EstadoSolicitud,
  nuevoEstado: EstadoSolicitud
): boolean {
  const transicionesPermitidas = TRANSICIONES_VALIDAS[estadoActual] || [];
  return transicionesPermitidas.includes(nuevoEstado);
}

/**
 * Obtiene los estados válidos a los que se puede transicionar
 *
 * @param estadoActual Estado actual de la solicitud
 * @returns Array de estados válidos
 */
export function obtenerEstadosDisponibles(estadoActual: EstadoSolicitud): EstadoSolicitud[] {
  return TRANSICIONES_VALIDAS[estadoActual] || [];
}
