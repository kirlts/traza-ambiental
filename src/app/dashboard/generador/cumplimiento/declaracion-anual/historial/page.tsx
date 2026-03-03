"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Declaracion {
  id: string;
  anio: number;
  folio: string | null;
  totalUnidades: number;
  totalToneladas: number;
  estado: string;
  fechaDeclaracion: string | null;
  categorias: Array<{
    tipo: string;
    nombre: string;
    cantidadUnidades: number;
    pesoToneladas: number;
  }>;
  metasGeneradas: Array<{
    tipo: string;
    metaToneladas: number;
  }>;
}

export default function HistorialDeclaracionesPage() {
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["declaraciones-historial"],
    queryFn: async () => {
      const response = await fetch("/api/productor/declaraciones");
      if (!response.ok) throw new Error("Error al cargar historial");
      return response.json();
    },
  });

  const declaraciones: Declaracion[] = data?.declaraciones || [];

  const declaracionesFiltradas =
    filtroEstado === "todos"
      ? declaraciones
      : declaraciones.filter((d: ReturnType<typeof JSON.parse>) => d.estado === filtroEstado);

  const getEstadoBadge = (estado: string) => {
    const badges = {
      borrador: "bg-gray-100 text-gray-700 border-gray-200",
      enviada: "bg-emerald-100 text-emerald-800 border-emerald-200",
      aprobada: "bg-blue-100 text-blue-800 border-blue-200",
      rechazada: "bg-red-100 text-red-800 border-red-200",
      anulada: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return badges[estado as keyof typeof badges] || badges.borrador;
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Historial de Declaraciones" subtitle="Cargando historial...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
            <p className="mt-4 text-emerald-700 font-medium">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Historial de Declaraciones"
      subtitle="Consulta y gestiona todas tus declaraciones anuales anteriores"
      actions={
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-emerald-200 rounded-lg text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-sm"
        >
          Volver
        </button>
      }
    >
      <div className="space-y-8">
        {/* Resumen estadístico */}
        {declaraciones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-700 mb-2 uppercase tracking-wide">
                    Total Declaraciones
                  </p>
                  <p className="text-4xl font-bold text-emerald-900 mb-1">{declaraciones.length}</p>
                  <div className="flex items-center">
                    <span className="text-xs text-emerald-600 font-medium">Histórico</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <svg
                    className="h-7 w-7 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 mb-2 uppercase tracking-wide">
                    Enviadas
                  </p>
                  <p className="text-4xl font-bold text-blue-900 mb-1">
                    {
                      declaraciones.filter(
                        (d: ReturnType<typeof JSON.parse>) => d.estado !== "borrador"
                      ).length
                    }
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-blue-600 font-medium">Procesadas</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="h-7 w-7 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-purple-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-700 mb-2 uppercase tracking-wide">
                    Total Toneladas
                  </p>
                  <p className="text-4xl font-bold text-purple-900 mb-1">
                    {declaraciones
                      .reduce((sum, d: ReturnType<typeof JSON.parse>) => sum + d.totalToneladas, 0)
                      .toFixed(2)}
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-purple-600 font-medium">Acumulado</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="h-7 w-7 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenedor Principal */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">Listado de Declaraciones</h3>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-slate-600">Filtrar por estado:</label>
              <select
                value={filtroEstado}
                onChange={(e: unknown) =>
                  setFiltroEstado((e as ReturnType<typeof JSON.parse>).target.value)
                }
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-700 outline-none transition-shadow"
              >
                <option value="todos">Todos</option>
                <option value="borrador">Borrador</option>
                <option value="enviada">Enviada</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
              </select>
            </div>
          </div>

          {declaracionesFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-600 text-lg font-medium">No hay declaraciones que mostrar</p>
              <p className="text-slate-400 text-sm mt-1">
                Intenta cambiar los filtros o crea una nueva declaración
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100" data-testid="historial-table">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Año
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Folio
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Total Unidades
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Total Toneladas
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {declaracionesFiltradas.map((declaracion) => (
                    <tr key={declaracion.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {declaracion.anio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                        {declaracion.folio || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getEstadoBadge(declaracion.estado)}`}
                        >
                          {declaracion.estado.charAt(0).toUpperCase() + declaracion.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {declaracion.totalUnidades.toLocaleString("es-CL")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {declaracion.totalToneladas.toFixed(2)} ton
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {declaracion.fechaDeclaracion
                          ? new Date(declaracion.fechaDeclaracion).toLocaleDateString("es-CL")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-3">
                        <button
                          disabled={declaracion.estado === "borrador"}
                          data-testid="descargar-comprobante"
                          onClick={() => {
                            if (declaracion.estado !== "borrador") {
                              window.open(
                                `/api/productor/declaracion-anual/${declaracion.id}/comprobante`,
                                "_blank"
                              );
                            }
                          }}
                          className="text-emerald-600 hover:text-emerald-900 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                          title={
                            declaracion.estado === "borrador"
                              ? "Completa y envía la declaración primero"
                              : "Descargar comprobante PDF"
                          }
                        >
                          <span className="flex items-center justify-end gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Descargar
                          </span>
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          onClick={() => {
                            toast("Detalle de declaración", {
                              description: (
                                <div className="mt-2 text-xs">
                                  <p className="font-semibold mb-1">Folio: {declaracion.folio}</p>
                                  <p className="mb-2">Año: {declaracion.anio}</p>
                                  <p className="font-semibold mb-1">Categorías:</p>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {declaracion.categorias.map(
                                      (c: ReturnType<typeof JSON.parse>, i) => (
                                        <li key={i}>
                                          {c.nombre}: {c.cantidadUnidades} un., {c.pesoToneladas}{" "}
                                          ton
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ),
                              duration: 5000,
                            });
                          }}
                        >
                          <span className="flex items-center justify-end gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Ver Detalle
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
