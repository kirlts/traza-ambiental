"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";

interface Filtros {
  anio: number;
  periodo: string;
  region: string;
  tratamiento: string;
  gestor: string;
}

interface TablaUltimosCertificadosProps {
  filtros: Filtros;
  enabled?: boolean;
}

interface Certificado {
  id: string;
  folio: string;
  fechaEmision: Date;
  gestor: {
    name: string | null;
  };
  pesoValorizado: number;
  tipoTratamiento: string;
}

interface DatosTabla {
  certificados: Certificado[];
  total: number;
}

export function TablaUltimosCertificados({
  filtros,
  enabled = true,
}: TablaUltimosCertificadosProps) {
  const { status } = useSession();
  const [data, setData] = useState<DatosTabla>({ certificados: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    // Solo hacer llamadas si el usuario está autenticado y el componente está habilitado
    if (status !== "authenticated" || !enabled) {
      setLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          anio: filtros.anio.toString(),
          periodo: filtros.periodo,
          region: filtros.region,
          tratamiento: filtros.tratamiento,
          gestor: filtros.gestor,
          page: page.toString(),
          limit: limit.toString(),
        });

        const response = await fetch(`/api/dashboard/ultimos-certificados?${params}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `Error ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err: unknown) {
        console.error("Error cargando tabla de certificados:", err);
        const errorMessage =
          err instanceof Error
            ? (err as ReturnType<typeof JSON.parse>).message
            : "Error al cargar datos de certificados";
        setError(errorMessage);
        // Datos de ejemplo mientras se implementa la API
        setData({
          certificados: [
            {
              id: "1",
              folio: "CERT-2025-0145",
              fechaEmision: new Date("2025-11-05"),
              gestor: { name: "EcoNeum S.A." },
              pesoValorizado: 146,
              tipoTratamiento: "Reciclaje",
            },
            {
              id: "2",
              folio: "CERT-2025-0144",
              fechaEmision: new Date("2025-11-04"),
              gestor: { name: "Gestión NFU" },
              pesoValorizado: 280,
              tipoTratamiento: "Recauchaje",
            },
            {
              id: "3",
              folio: "CERT-2025-0143",
              fechaEmision: new Date("2025-11-03"),
              gestor: { name: "ReciclaChile Ltda." },
              pesoValorizado: 95,
              tipoTratamiento: "Co-procesamiento",
            },
          ],
          total: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [filtros, page, limit, enabled, status]);

  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams({
        anio: filtros.anio.toString(),
        periodo: filtros.periodo,
        region: filtros.region,
        tratamiento: filtros.tratamiento,
        gestor: filtros.gestor,
      });

      const response = await fetch(`/api/dashboard/export/excel?${params}`);
      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificados-${filtros.anio}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error("Error exportando Excel:", err);
      toast.error("Error al exportar Excel");
    }
  };

  const totalPages = Math.ceil(data.total / limit);

  if (!enabled) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <p className="text-sm">Verificando permisos de acceso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando certificados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Últimos Certificados Emitidos</h3>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="h-4 w-4" />
          Exportar Excel
        </button>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Folio
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Fecha
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gestor
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Peso (kg)
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tratamiento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.certificados.map((certificado) => (
              <tr key={certificado.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {certificado.folio}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {new Date(certificado.fechaEmision).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="truncate block max-w-xs">
                    {certificado.gestor.name || "Sin asignar"}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {certificado.pesoValorizado.toLocaleString("es-CL")}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      certificado.tipoTratamiento === "Reciclaje"
                        ? "bg-blue-100 text-blue-800"
                        : certificado.tipoTratamiento === "Recauchaje"
                          ? "bg-green-100 text-green-800"
                          : certificado.tipoTratamiento === "Co-procesamiento"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {certificado.tipoTratamiento}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, data.total)} de{" "}
            {data.total} resultados
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {data.certificados.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron certificados con los filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}
