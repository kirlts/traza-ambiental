"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  FileJson,
  File,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Componente de notificación temporal
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md ${colors[type]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>
    </div>
  );
}

interface OpcionesExportacionProps {
  reporteId: string;
  folio: string;
  anio: number;
}

type ExportStatus = "idle" | "loading" | "success" | "error";

export function OpcionesExportacion({ reporteId, folio, anio }: OpcionesExportacionProps) {
  const [exportStatus, setExportStatus] = useState<Record<string, ExportStatus>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleExport = async (formato: "csv" | "json" | "excel" | "pdf") => {
    try {
      setExportStatus((prev) => ({ ...prev, [formato]: "loading" }));

      const response = await fetch(`/api/reportes/anual/${reporteId}/export/${formato}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al exportar ${formato.toUpperCase()}`);
      }

      // Obtener el nombre del archivo del header Content-Disposition o usar uno por defecto
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `reporte-anual-${anio}-${folio}.${formato}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportStatus((prev) => ({ ...prev, [formato]: "success" }));

      // Mostrar notificación de éxito
      setToast({
        message: `✅ Reporte ${formato.toUpperCase()} generado exitosamente`,
        type: "success",
      });

      // Resetear el estado después de 3 segundos
      setTimeout(() => {
        setExportStatus((prev) => ({ ...prev, [formato]: "idle" }));
      }, 3000);
    } catch (error: unknown) {
      console.error(`Error exportando ${formato}:`, error);
      setExportStatus((prev) => ({ ...prev, [formato]: "error" }));

      // Mostrar notificación de error
      setToast({
        message: `❌ Error al exportar ${formato.toUpperCase()}: ${error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)}`,
        type: "error",
      });

      // Resetear el estado después de 5 segundos
      setTimeout(() => {
        setExportStatus((prev) => ({ ...prev, [formato]: "idle" }));
      }, 5000);
    }
  };

  const formatos = [
    {
      id: "csv",
      nombre: "CSV (SINADER)",
      icono: File,
      descripcion: "Formato para carga masiva en SINADER",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "excel",
      nombre: "Excel",
      icono: FileSpreadsheet,
      descripcion: "Formato para análisis con múltiples hojas",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "pdf",
      nombre: "PDF",
      icono: FileText,
      descripcion: "Reporte ejecutivo visual",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      id: "json",
      nombre: "JSON",
      icono: FileJson,
      descripcion: "Formato para integraciones API",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const getStatusIcon = (formato: string) => {
    const status = exportStatus[formato];
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (formato: string) => {
    const status = exportStatus[formato];
    const baseColor = formatos.find((f) => f.id === formato)?.color || "bg-gray-600";

    switch (status) {
      case "loading":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      default:
        return baseColor;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exportar Reporte</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formatos.map((formato) => {
            const Icono = formato.icono;
            const status = exportStatus[formato.id];
            const isLoading = status === "loading";

            return (
              <button
                key={formato.id}
                onClick={() => handleExport(formato.id as "csv" | "json" | "excel" | "pdf")}
                disabled={isLoading}
                className={`${getStatusColor(formato.id)} text-white px-4 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 justify-center disabled:opacity-75 disabled:cursor-not-allowed`}
              >
                {getStatusIcon(formato.id) || <Icono className="h-4 w-4" />}
                {isLoading ? "Generando..." : formato.nombre}
              </button>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500">
            Seleccione el formato para descargar el reporte generado
          </p>

          {/* Mostrar información de estado si hay alguna exportación en progreso */}
          {Object.values(exportStatus).some((status) => status !== "idle") && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 Los archivos se descargarán automáticamente cuando estén listos
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
