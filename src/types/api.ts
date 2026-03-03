import { type Role, type Vehiculo } from "./auth";

/**
 * Estructura genérica para todas las respuestas de la API.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

/**
 * Respuesta del endpoint /api/users/me/roles
 */
export type UserRolesResponse = ApiResponse<{
  roles: Role[];
}>;

/**
 * Respuesta del endpoint /api/transportista/vehiculos
 */
export type VehiculosResponse = ApiResponse<{
  vehiculos: Vehiculo[];
}>;

/**
 * Respuesta del endpoint /api/transportista/vehiculos/[id]/capacidad
 */
export type CapacidadVehiculoResponse = ApiResponse<{
  capacidadDisponible: number;
  capacidadTotal: number;
}>;

/**
 * Datos para el reporte anual de generadores
 */
export type ReporteAnualResponse = ApiResponse<{
  anio: number;
  neumaticosDeclarados: number;
  neumaticosValorizados: number;
  metaRecoleccion: number;
  metaValorizacion: number;
  cumplimientoRecoleccion: number;
  cumplimientoValorizacion: number;
  certificadosGenerados: number;
  totalSolicitudes: number;
  solicitudesCompletadas: number;
  fechaGeneracion: string;
}>;

/**
 * Interfaz para el campo JSON de tratamientos
 */
export interface TratamientoJSON {
  tipo: string;
  peso: number;
  fecha?: string;
}

/**
 * Metadatos para generación de certificados
 */
export interface CertificadoMetadata {
  destino?: string;
  productoFinal?: string;
}

/**
 * KPIs de Dashboard (Sistema de Gestión / Productor)
 */
export interface DashboardKPIs {
  metaRecoleccion: number;
  avanceRecoleccion: number;
  porcentajeRecoleccion: number;
  metaValorizacion: number;
  avanceValorizacion: number;
  porcentajeValorizacion: number;
  totalCertificados: number;
  gestoresActivos: number;
  generadoresAtendidos: number;
  promedioMensual: number;
}

/**
 * Interfaces para el campo JSON datosReporte de ReporteAnual
 */
export interface ReporteResumenEjecutivo {
  metaRecoleccion: number;
  pesoRecolectado: number;
  porcentajeRecoleccion: number;
  metaValorizacion: number;
  pesoValorizado: number;
  porcentajeValorizacion: number;
  cumplido: boolean;
}

export interface ReporteTratamiento {
  tipo: string;
  cantidad: number;
  peso: number;
  porcentaje: number;
}

export interface ReporteCategoria {
  tipo: string;
  cantidad: number;
  peso: number;
}

export interface ReporteRegion {
  region: string;
  cantidad: number;
  peso: number;
}

export interface ReporteGestor {
  rut?: string;
  nombre: string;
  email?: string;
  certificados: number;
  toneladas: number;
}

export interface ReporteAnualData {
  resumenEjecutivo: ReporteResumenEjecutivo;
  desgloseTratamiento: ReporteTratamiento[];
  desgloseCategoria?: ReporteCategoria[];
  desgloseRegion?: ReporteRegion[];
  gestores?: ReporteGestor[];
  totalCertificados: number;
  totalToneladas: number;
  fechaGeneracion: string;
}
