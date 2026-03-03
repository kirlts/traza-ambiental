"use client";

import { CheckCircle, XCircle } from "lucide-react";

export interface ReporteResumen {
  metaRecoleccion?: number;
  pesoRecolectado?: number;
  porcentajeRecoleccion?: number;
  metaValorizacion?: number;
  pesoValorizado?: number;
  porcentajeValorizacion?: number;
  cumplido?: boolean;
}

export interface DesgloseTratamiento {
  tipo: string;
  cantidad: number;
  peso: number;
  porcentaje: number;
}

export interface ReporteDatos {
  resumenEjecutivo?: ReporteResumen;
  desgloseTratamiento?: DesgloseTratamiento[];
  gestores?: string[];
  totalCertificados?: number;
  totalToneladas?: number;
}

interface VistaPreviaReporteProps {
  datos: ReporteDatos | null;
  anio: number;
  loading?: boolean;
}

export function VistaPreviaReporte({ datos, anio, loading }: VistaPreviaReporteProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando datos del reporte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!datos) {
    return null;
  }

  const resumen = datos.resumenEjecutivo || {};
  const desgloseTratamiento = datos.desgloseTratamiento || [];
  const gestores = datos.gestores || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Vista Previa del Reporte - {anio}
      </h2>

      {/* Resumen Ejecutivo */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Resumen Ejecutivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Meta Recolección</span>
              <span className="text-sm font-semibold text-gray-900">
                {resumen.metaRecoleccion?.toFixed(2) || 0} ton
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Recolectado</span>
              <span className="text-sm font-semibold text-gray-900">
                {resumen.pesoRecolectado?.toFixed(2) || 0} ton
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Porcentaje</span>
                <span>{resumen.porcentajeRecoleccion?.toFixed(2) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, resumen.porcentajeRecoleccion || 0)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Meta Valorización</span>
              <span className="text-sm font-semibold text-gray-900">
                {resumen.metaValorizacion?.toFixed(2) || 0} ton
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valorizado</span>
              <span className="text-sm font-semibold text-gray-900">
                {resumen.pesoValorizado?.toFixed(2) || 0} ton
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Porcentaje</span>
                <span>{resumen.porcentajeValorizacion?.toFixed(2) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, resumen.porcentajeValorizacion || 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Estado de cumplimiento */}
        <div
          className={`mt-4 rounded-lg p-4 flex items-center gap-3 ${
            resumen.cumplido
              ? "bg-green-50 border border-green-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          {resumen.cumplido ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-yellow-600" />
          )}
          <div>
            <p
              className={`text-sm font-semibold ${
                resumen.cumplido ? "text-green-900" : "text-yellow-900"
              }`}
            >
              Estado: {resumen.cumplido ? "Cumplido" : "No Cumplido"}
            </p>
            <p className={`text-xs ${resumen.cumplido ? "text-green-800" : "text-yellow-800"}`}>
              {resumen.cumplido
                ? "Las metas de valorización han sido alcanzadas"
                : "Las metas de valorización no han sido alcanzadas"}
            </p>
          </div>
        </div>
      </div>

      {/* Desglose por Tratamiento */}
      {desgloseTratamiento.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Desglose por Tipo de Tratamiento
          </h3>
          <div className="space-y-2">
            {desgloseTratamiento.map((tratamiento: DesgloseTratamiento, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{tratamiento.tipo}</span>
                  <span className="text-xs text-gray-600 ml-2">
                    {tratamiento.cantidad || 0} unidades
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {tratamiento.peso?.toFixed(2) || 0} ton
                  </span>
                  <span className="text-xs text-gray-600 ml-2">
                    ({tratamiento.porcentaje?.toFixed(1) || 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-600 mb-1">Total Certificados</p>
          <p className="text-2xl font-bold text-blue-900">{datos.totalCertificados || 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-green-600 mb-1">Total Toneladas</p>
          <p className="text-2xl font-bold text-green-900">
            {datos.totalToneladas?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-purple-600 mb-1">Gestores Participantes</p>
          <p className="text-2xl font-bold text-purple-900">{gestores.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
