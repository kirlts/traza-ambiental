"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAnioDeclaracionActual } from "@/lib/helpers/declaracion-helpers";
import {
  FileText,
  FileSpreadsheet,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";

interface ReporteData {
  anio: number;
  neumaticosDeclarados: number;
  metaRecoleccion: number;
  metaValorizacion: number;
  cumplimientoRecoleccion: number;
  cumplimientoValorizacion: number;
  certificadosGenerados: number;
  fechaGeneracion: string;
}

export default function ReportesAnualesPage() {
  const { data: _session } = useSession();
  // Obtener el año actual dinámicamente - se actualizará automáticamente cada año
  const anioActual = new Date().getFullYear();
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(getAnioDeclaracionActual());
  const [reporteData, setReporteData] = useState<ReporteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [descargando, setDescargando] = useState<"pdf" | "excel" | null>(null);

  // Generar lista de años dinámicamente: desde el año actual hasta 5 años atrás
  // Esto asegura que siempre se incluya el año en curso automáticamente
  // Si estamos en 2026, mostrará: 2026, 2025, 2024, 2023, 2022, 2021
  const anosDisponibles = useMemo(() => {
    const anosBase = Array.from({ length: 6 }, (_, i) => anioActual - i).sort((a, b) => b - a);
    return anosBase;
  }, [anioActual]);

  const generarReporte = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/generador/reportes/anual?anio=${anioSeleccionado}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cargar el reporte");
      }

      const data = await response.json();

      setReporteData({
        anio: data?.anio || anioSeleccionado,
        neumaticosDeclarados: data.neumaticosDeclarados || 0,
        metaRecoleccion: data.metaRecoleccion || 0,
        metaValorizacion: data.metaValorizacion || 0,
        cumplimientoRecoleccion: data.cumplimientoRecoleccion || 0,
        cumplimientoValorizacion: data.cumplimientoValorizacion || 0,
        certificadosGenerados: data.certificadosGenerados || 0,
        fechaGeneracion: data.fechaGeneracion
          ? new Date(data.fechaGeneracion).toLocaleDateString("es-CL")
          : new Date().toLocaleDateString("es-CL"),
      });
    } catch (error: unknown) {
      console.error("Error al generar reporte:", error);
      // Si hay error, mostrar datos vacíos en lugar de fallar completamente
      setReporteData({
        anio: anioSeleccionado,
        neumaticosDeclarados: 0,
        metaRecoleccion: 0,
        metaValorizacion: 0,
        cumplimientoRecoleccion: 0,
        cumplimientoValorizacion: 0,
        certificadosGenerados: 0,
        fechaGeneracion: new Date().toLocaleDateString("es-CL"),
      });
    } finally {
      setLoading(false);
    }
  }, [anioSeleccionado]);

  useEffect(() => {
    if (anioSeleccionado) {
      generarReporte();
    }
  }, [anioSeleccionado, generarReporte]);

  const descargarReporte = async (formato: "pdf" | "excel") => {
    if (!anioSeleccionado) {
      alert("Por favor selecciona un año primero");
      return;
    }

    if (descargando) {
      return; // Evitar múltiples descargas simultáneas
    }

    try {
      setDescargando(formato);

      const response = await fetch(
        `/api/generador/reportes/anual/export/${formato}?anio=${anioSeleccionado}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      // Verificar si la respuesta es un JSON (error) o un archivo binario
      const contentType = response.headers.get("Content-Type") || "";

      if (!response.ok) {
        let errorMessage = `Error al descargar ${formato.toUpperCase()}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Verificar que el contenido sea del tipo esperado
      if (formato === "pdf" && !contentType.includes("application/pdf")) {
        throw new Error("El servidor no devolvió un archivo PDF válido");
      }
      if (
        formato === "excel" &&
        !contentType.includes("spreadsheet") &&
        !contentType.includes("excel")
      ) {
        throw new Error("El servidor no devolvió un archivo Excel válido");
      }

      // Obtener el nombre del archivo del header Content-Disposition o usar uno por defecto
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `reporte-anual-${anioSeleccionado}.${formato === "pdf" ? "pdf" : "xlsx"}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // Descargar el archivo
      const blob = await response.blob();

      // Verificar que el blob no esté vacío
      if (blob.size === 0) {
        throw new Error("El archivo descargado está vacío");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Limpiar después de un pequeño delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error: unknown) {
      console.error(`❌ Error al descargar ${formato.toUpperCase()}:`, error);
      const mensajeError =
        (error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)) || `Error al descargar el reporte en formato ${formato.toUpperCase()}`;
      alert(
        `Error al descargar el reporte:\n\n${mensajeError}\n\nPor favor, verifica:\n- Que tengas conexión a internet\n- Que el servidor esté funcionando correctamente\n- Revisa la consola para más detalles`
      );
    } finally {
      setDescargando(null);
    }
  };

  return (
    <DashboardLayout
      title="Reportes Anuales"
      subtitle="Informes de cumplimiento y estadísticas de declaraciones REP"
    >
      <div className="w-full space-y-6">
        {/* Selector de Año */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-emerald-900 mb-1">Seleccionar Período</h2>
              <p className="text-sm text-gray-600">
                Selecciona el año para generar el reporte correspondiente
              </p>
            </div>
            <div className="flex-shrink-0">
              <select
                value={anioSeleccionado}
                onChange={(e: unknown) =>
                  setAnioSeleccionado(Number((e as ReturnType<typeof JSON.parse>).target.value))
                }
                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer min-w-[160px]"
              >
                {anosDisponibles.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio} {anio === anioActual ? "(Actual)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumen del Reporte */}
        {reporteData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-emerald-900 mb-1">
                  Reporte Anual {reporteData.anio}
                </h2>
                <p className="text-sm text-gray-600">
                  Resumen de cumplimiento y estadísticas del período
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => descargarReporte("pdf")}
                  disabled={loading || descargando !== null}
                  className={`inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg shadow-sm transition-all ${
                    loading || descargando !== null
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-emerald-700 hover:shadow-md"
                  }`}
                >
                  {descargando === "pdf" ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generando...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => descargarReporte("excel")}
                  disabled={loading || descargando !== null}
                  className={`inline-flex items-center px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg shadow-sm transition-all ${
                    loading || descargando !== null
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-orange-700 hover:shadow-md"
                  }`}
                >
                  {descargando === "excel" ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generando...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Descargar Excel
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-lg border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Neumáticos Declarados
                    </p>
                    <p className="text-3xl font-black text-emerald-900">
                      {reporteData!.neumaticosDeclarados.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-lg border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Cumplimiento Recolección
                    </p>
                    <p className="text-3xl font-black text-amber-900">
                      {reporteData!.cumplimientoRecoleccion}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Cumplimiento Valorización
                    </p>
                    <p className="text-3xl font-black text-blue-900">
                      {reporteData!.cumplimientoValorizacion}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-lg border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Certificados Generados
                    </p>
                    <p className="text-3xl font-black text-emerald-900">
                      {reporteData!.certificadosGenerados}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-5">
              <h3 className="text-base font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Información del Reporte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Meta de Recolección
                  </p>
                  <p className="text-lg font-bold text-emerald-900">
                    {reporteData!.metaRecoleccion > 0
                      ? `${reporteData!.metaRecoleccion.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ton`
                      : "No disponible"}
                  </p>
                  {reporteData!.metaRecoleccion === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Requiere declaración del año anterior
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Meta de Valorización
                  </p>
                  <p className="text-lg font-bold text-emerald-900">
                    {reporteData!.metaValorizacion > 0
                      ? `${reporteData!.metaValorizacion.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ton`
                      : "No disponible"}
                  </p>
                  {reporteData!.metaValorizacion === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Requiere declaración del año anterior
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Fecha de Generación
                  </p>
                  <p className="text-lg font-bold text-emerald-900">
                    {reporteData!.fechaGeneracion}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Estado del Reporte
                  </p>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completo
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
              <p className="ml-4 text-base font-semibold text-gray-700">Generando reporte...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
