"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdmin } from "@/lib/auth-helpers";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

interface PorcentajesAnio {
  recoleccion: number;
  valorizacion: number;
}

interface ConfiguracionREP {
  porcentajes: Record<string, PorcentajesAnio>;
  ultimaActualizacion: string;
  actualizadoPor: string | null;
}

export default function ConfiguracionREPPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(false);
  const [porcentajesEdit, setPorcentajesEdit] = useState<Record<string, PorcentajesAnio>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isAdmin(session)) {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  // Query para obtener configuración
  const { data, isLoading } = useQuery({
    queryKey: ["configuracion-rep"],
    queryFn: async () => {
      const response = await fetch("/api/admin/configuracion-rep");
      if (!response.ok) throw new Error("Error al cargar configuración");
      return response.json() as Promise<{ configuracion: ConfiguracionREP }>;
    },
  });

  // Mutation para actualizar
  const actualizarMutation = useMutation({
    mutationFn: async (nuevosPorcentajes: Record<string, PorcentajesAnio>) => {
      const response = await fetch("/api/admin/configuracion-rep", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ porcentajes: nuevosPorcentajes }),
      });
      if (!response.ok) throw new Error("Error al actualizar configuración");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracion-rep"] });
      setEditando(false);
      toast.success("Configuración actualizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error("Error al actualizar", {
        description:
          error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error),
      });
    },
  });

  const iniciarEdicion = () => {
    if (data?.configuracion) {
      setPorcentajesEdit({ ...data.configuracion.porcentajes });
      setEditando(true);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setPorcentajesEdit({});
  };

  const guardarCambios = () => {
    actualizarMutation.mutate(porcentajesEdit);
  };

  const actualizarPorcentaje = (
    anio: string,
    tipo: "recoleccion" | "valorizacion",
    valor: number
  ) => {
    setPorcentajesEdit((prev) => ({
      ...prev,
      [anio]: {
        ...prev[anio],
        [tipo]: valor,
      },
    }));
  };

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout title="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || !isAdmin(session)) {
    return (
      <DashboardLayout title="Acceso Denegado">
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
            <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta sección.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const config = data?.configuracion;
  const porcentajes = editando ? porcentajesEdit : config?.porcentajes || {};
  const aniosOrdenados = Object.keys(porcentajes).sort(
    (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) =>
      parseInt(b) - parseInt(a)
  );

  const tabs = [
    {
      label: "Usuarios",
      href: "/dashboard/admin/users",
      active: false,
      onClick: () => router.push("/dashboard/admin/users"),
    },
    {
      label: "Roles",
      href: "/dashboard/admin/roles",
      active: false,
      onClick: () => router.push("/dashboard/admin/roles"),
    },
    {
      label: "Solicitudes Generador",
      href: "/dashboard/admin/solicitudes-generador",
      active: false,
      onClick: () => router.push("/dashboard/admin/solicitudes-generador"),
    },
    {
      label: "Config. REP",
      href: "/dashboard/admin/configuracion-rep",
      active: true,
      onClick: () => router.push("/dashboard/admin/configuracion-rep"),
    },
  ];

  return (
    <DashboardLayout
      title="Configuración de Metas REP"
      subtitle="Gestiona los porcentajes de recolección y valorización por año"
      tabs={tabs}
      actions={
        !editando ? (
          <button
            onClick={iniciarEdicion}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Editar Configuración</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={cancelarEdicion}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={guardarCambios}
              disabled={actualizarMutation.isPending}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{actualizarMutation.isPending ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
          </div>
        )
      }
    >
      <div className="space-y-6">
        {/* Información de última actualización */}
        {config && !editando && (
          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-emerald-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-emerald-700">
                <strong>Última actualización:</strong>{" "}
                {new Date(config.ultimaActualizacion).toLocaleString("es-CL")}
                {config.actualizadoPor && ` por ${config.actualizadoPor}`}
              </p>
            </div>
          </div>
        )}

        {/* Alerta de edición */}
        {editando && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-amber-400 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">⚠️ Modo de Edición Activo</p>
                <p className="text-sm text-amber-700">
                  Los cambios no se guardarán hasta que hagas clic en "Guardar Cambios". Estos
                  porcentajes afectarán el cálculo de metas para futuras declaraciones.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de configuración */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-emerald-50 border-b border-emerald-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Meta de Recolección (%)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Meta de Valorización (%)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aniosOrdenados.map((anio) => {
                  const anioNum = parseInt(anio);
                  const currentYear = new Date().getFullYear();
                  const estado =
                    anioNum < currentYear
                      ? "Pasado"
                      : anioNum === currentYear
                        ? "Actual"
                        : "Futuro";
                  const estadoStyles =
                    anioNum < currentYear
                      ? "bg-gray-50 text-gray-600 border-gray-200"
                      : anioNum === currentYear
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-blue-700 border-blue-200";

                  return (
                    <tr key={anio} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{anio}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editando ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={porcentajes[anio]?.recoleccion || 0}
                              onChange={(e: unknown) =>
                                actualizarPorcentaje(
                                  anio,
                                  "recoleccion",
                                  parseFloat((e as ReturnType<typeof JSON.parse>).target.value)
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium"
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {porcentajes[anio]?.recoleccion || 0}
                            </span>
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editando ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={porcentajes[anio]?.valorizacion || 0}
                              onChange={(e: unknown) =>
                                actualizarPorcentaje(
                                  anio,
                                  "valorizacion",
                                  parseFloat((e as ReturnType<typeof JSON.parse>).target.value)
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium"
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {porcentajes[anio]?.valorizacion || 0}
                            </span>
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full border ${estadoStyles}`}
                        >
                          {estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-emerald-50/30 rounded-lg p-6 border border-emerald-100">
          <div className="flex items-center mb-4">
            <svg
              className="h-5 w-5 text-emerald-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-emerald-900">Información Importante</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start bg-white p-4 rounded-lg border border-emerald-100">
                <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg mr-3">
                  <svg
                    className="h-5 w-5 text-emerald-600"
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
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Meta de Recolección</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Porcentaje del total de toneladas declaradas que debe ser recolectado.
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-white p-4 rounded-lg border border-emerald-100">
                <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg mr-3">
                  <svg
                    className="h-5 w-5 text-emerald-600"
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
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Meta de Valorización</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Porcentaje del total de toneladas declaradas que debe ser valorizado.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start bg-white p-4 rounded-lg border border-blue-100">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg mr-3">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Aplicación Temporal</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Los porcentajes se aplican al año siguiente de la declaración.
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-white p-4 rounded-lg border border-amber-200 bg-amber-50/30">
                <div className="flex-shrink-0 p-2 bg-amber-100 rounded-lg mr-3">
                  <svg
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-amber-800 mb-1">Advertencia</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Modificar porcentajes de años pasados no afecta metas ya generadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
