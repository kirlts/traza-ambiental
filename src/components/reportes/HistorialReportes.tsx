"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import { OpcionesExportacion } from "./OpcionesExportacion";

export function HistorialReportes() {
  const { status } = useSession();
  const [reportes, setReportes] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      cargarHistorial();
    }
  }, [status]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/reportes/anual/historial");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setReportes(data.reportes || []);
      setError(null);
    } catch (err: unknown) {
      console.error("Error cargando historial:", err);
      const errorMessage =
        err instanceof Error
          ? err instanceof Error
            ? (err as ReturnType<typeof JSON.parse>).message
            : String(err)
          : "Error al cargar historial";
      setError(errorMessage);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return "bg-green-100 text-green-800 border-green-200";
      case "enviado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "generado":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "rechazado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return <CheckCircle className="h-4 w-4" />;
      case "enviado":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando historial...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Reportes</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {reportes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No hay reportes generados aún</p>
          <p className="text-xs mt-1">Genere su primer reporte usando el formulario superior</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reportes.map((reporte: ReturnType<typeof JSON.parse>) => (
            <div
              key={reporte.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-md font-semibold text-gray-900">{reporte.folio}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border inline-flex items-center gap-1 ${getEstadoColor(reporte.estado)}`}
                    >
                      {getEstadoIcono(reporte.estado)}
                      {reporte.estado.charAt(0).toUpperCase() + reporte.estado.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Año {reporte.anio}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>
                        Generado: {new Date(reporte.fechaGeneracion).toLocaleDateString("es-CL")}
                      </span>
                    </div>
                  </div>
                  {reporte.fechaEnvio && (
                    <p className="text-xs text-gray-500 mt-1">
                      Enviado: {new Date(reporte.fechaEnvio).toLocaleDateString("es-CL")}
                    </p>
                  )}
                </div>
              </div>

              {/* Opciones de exportación */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <OpcionesExportacion
                  reporteId={reporte.id}
                  folio={reporte.folio}
                  anio={reporte.anio}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
