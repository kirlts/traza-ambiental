"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SelectorPeriodoReporte } from "@/components/reportes/SelectorPeriodoReporte";
import { VistaPreviaReporte, ReporteDatos } from "@/components/reportes/VistaPreviaReporte";
import { HistorialReportes } from "@/components/reportes/HistorialReportes";
import { ProgressGeneracion } from "@/components/reportes/ProgressGeneracion";
import { ComparacionAnual } from "@/components/reportes/ComparacionAnual";
import { AlertCircle, CheckCircle, Loader2, FileSpreadsheet } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { ReporteAnual } from "@/types/dashboard";

export default function ReporteAnualPage() {
  const { data: session, status } = useSession();
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(new Date().getFullYear());
  const [datosReporte, setDatosReporte] = useState<ReporteDatos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [reporteGenerado, setReporteGenerado] = useState<ReporteAnual | null>(null);
  const [observaciones, setObservaciones] = useState("");

  // Derivación de estado y cargador inicial
  // En una arquitectura determinista, el año debería venir de la URL o props.
  // Por ahora, mantenemos el estado pero eliminamos el useEffect de sincronización
  // disparando la carga manualmente en los eventos que cambian el año.

  const cargarDatosReporte = useCallback(
    async (anio = anioSeleccionado) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/reportes/anual/datos?anio=${anio}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}`);
        }

        const data = await response.json();
        setDatosReporte(data);
      } catch (err: unknown) {
        console.error("Error cargando datos del reporte:", err);
        setError(err instanceof Error ? err.message : "Error al cargar datos");
        setDatosReporte(null);
      } finally {
        setLoading(false);
      }
    },
    [anioSeleccionado]
  );

  // Carga inicial
  useEffect(() => {
    if (status === "authenticated" && !datosReporte && !loading) {
      cargarDatosReporte();
    }
  }, [status, datosReporte, loading, cargarDatosReporte]);

  const handleExportarRETC = async () => {
    try {
      if (!datosReporte) {
        toast.error("Primero debe cargar los datos del reporte");
        return;
      }

      // Usar un ID temporal o el año como identificador
      const reporteId = `reporte-${anioSeleccionado}`;
      const url = `/api/sistema-gestion/reporte/${reporteId}/exportar-sinader?anio=${anioSeleccionado}`;

      // Abrir en nueva ventana para descarga
      window.open(url, "_blank");
      toast.success("Descarga de archivo RETC iniciada");
    } catch (error: unknown) {
      console.error("Error exportando RETC:", error);
      toast.error("Error al iniciar la descarga");
    }
  };

  const handleGenerarReporte = async () => {
    try {
      setGenerando(true);
      setProgreso(0);
      setError(null);

      // Simular progreso
      const intervalo = setInterval(() => {
        setProgreso((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/reportes/anual/generar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anio: anioSeleccionado,
          observaciones: observaciones || undefined,
        }),
      });

      clearInterval(intervalo);
      setProgreso(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Si ya existe un reporte, permitir regenerar
        if (response.status === 409 && errorData.puedeRegenerar) {
          const result = await Swal.fire({
            title: "Reporte existente",
            text: `Ya existe un reporte para el año ${anioSeleccionado}. ¿Desea regenerarlo?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, regenerar",
            cancelButtonText: "Cancelar",
          });

          if (result.isConfirmed) {
            // Aquí se podría implementar lógica de regeneración
            // Por ahora, simplemente mostrar el error
            setError("Ya existe un reporte para este año. Puede descargarlo desde el historial.");
          }
          return;
        }

        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const result = await response.json();
      setReporteGenerado((result.reporte as ReporteAnual) || (result as ReporteAnual));

      // Recargar datos y historial
      setTimeout(() => {
        cargarDatosReporte();
        setGenerando(false);
        setProgreso(0);
      }, 1000);
    } catch (err: unknown) {
      console.error("Error generando reporte:", err);
      setError(err instanceof Error ? err.message : "Error al generar el reporte");
      setGenerando(false);
      setProgreso(0);
    }
  };

  if (status === "loading") {
    return (
      <DashboardLayout title="Reporte Anual de Cumplimiento">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Verificando sesión...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout title="Reporte Anual de Cumplimiento">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-semibold mb-2">Acceso no autorizado</h2>
            <p className="text-gray-600">Debe iniciar sesión para acceder a los reportes.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Reporte Anual de Cumplimiento"
      subtitle="Generar reporte consolidado para envío a SINADER/RETC"
    >
      <div className="space-y-6">
        {/* Mensaje de éxito al generar */}
        {reporteGenerado && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-900 mb-1">
                Reporte generado exitosamente
              </h3>
              <p className="text-sm text-green-800">
                Folio: <span className="font-mono">{reporteGenerado.folio}</span>
              </p>
              <p className="text-sm text-green-800">
                Código de verificación:{" "}
                <span className="font-mono">{reporteGenerado.codigoVerificacion}</span>
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Paso 1: Seleccionar Período</h2>
          <SelectorPeriodoReporte
            anio={anioSeleccionado}
            onAnioChange={(anio) => {
              setAnioSeleccionado(anio);
              // Disparo imperativo vs Efecto reactivo (Mejor determinismo en este contexto)
              if (status === "authenticated") {
                cargarDatosReporte(anio);
              }
            }}
            loading={loading}
          />
        </div>

        {/* Vista Previa del Reporte */}
        {datosReporte && (
          <VistaPreviaReporte datos={datosReporte} anio={anioSeleccionado} loading={loading} />
        )}

        {/* Observaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Observaciones (opcional)</h2>
          <textarea
            value={observaciones}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setObservaciones(e.target.value)
            }
            placeholder="Agregar observaciones o aclaraciones al reporte..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>

        {/* Progreso de generación */}
        {generando && <ProgressGeneracion progreso={progreso} />}

        {/* Opciones de Exportación y Generación */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col gap-6">
            {/* Exportar para RETC/SINADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Exportar para SINADER/RETC
                </h2>
                <p className="text-sm text-gray-600">
                  Descargue el archivo Excel con formato oficial para carga masiva en Ventanilla
                  Única
                </p>
              </div>
              <button
                onClick={handleExportarRETC}
                disabled={loading || !datosReporte}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Descargar Excel RETC
              </button>
            </div>

            {/* Generar Reporte Interno */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Generar Reporte Interno
                </h2>
                <p className="text-sm text-gray-600">
                  Genera un nuevo reporte anual y guárdalo en el historial
                </p>
              </div>
              <button
                onClick={handleGenerarReporte}
                disabled={generando || loading || !datosReporte}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                {generando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Generar Reporte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Comparación con Años Anteriores */}
        <ComparacionAnual anioActual={anioSeleccionado} />

        {/* Historial de Reportes */}
        <HistorialReportes />
      </div>
    </DashboardLayout>
  );
}
