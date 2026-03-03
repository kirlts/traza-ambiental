"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";

interface Meta {
  id: string;
  anio: number;
  tipo: string;
  metaToneladas: number;
  avanceToneladas: number;
  porcentajeAvance: number;
  estado: string;
  declaracion: {
    anio: number;
    folio: string;
    totalToneladas: number;
  } | null;
}

export default function MetasREPPage() {
  // Obtener el año actual dinámicamente - se actualizará automáticamente cada año
  const anioActual = new Date().getFullYear();
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(anioActual);

  const { data, isLoading } = useQuery({
    queryKey: ["metas-rep"],
    queryFn: async () => {
      // Simulación de datos
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        metas: [
          {
            id: "1",
            anio: anioActual,
            tipo: "Recolección",
            metaToneladas: 1200,
            avanceToneladas: 850,
            porcentajeAvance: 70.8,
            estado: "activa",
            declaracion: {
              anio: anioActual,
              folio: `DA-${anioActual}-001`,
              totalToneladas: 1500,
            },
          },
          {
            id: "2",
            anio: anioActual,
            tipo: "Valorización",
            metaToneladas: 800,
            avanceToneladas: 620,
            porcentajeAvance: 77.5,
            estado: "activa",
            declaracion: {
              anio: anioActual,
              folio: `DA-${anioActual}-001`,
              totalToneladas: 1500,
            },
          },
          {
            id: "3",
            anio: 2024,
            tipo: "Recolección",
            metaToneladas: 1100,
            avanceToneladas: 1150,
            porcentajeAvance: 104.5,
            estado: "cumplida",
            declaracion: {
              anio: 2024,
              folio: "DA-2024-001",
              totalToneladas: 1400,
            },
          },
          {
            id: "4",
            anio: 2024,
            tipo: "Valorización",
            metaToneladas: 750,
            avanceToneladas: 680,
            porcentajeAvance: 90.7,
            estado: "incumplida",
            declaracion: {
              anio: 2024,
              folio: "DA-2024-001",
              totalToneladas: 1400,
            },
          },
          {
            id: "5",
            anio: 2023,
            tipo: "Recolección",
            metaToneladas: 1000,
            avanceToneladas: 1050,
            porcentajeAvance: 105.0,
            estado: "cumplida",
            declaracion: {
              anio: 2023,
              folio: "DA-2023-001",
              totalToneladas: 1300,
            },
          },
        ],
      };
    },
  });

  const metas: Meta[] = data?.metas || [];
  const metasDelAnio = metas.filter((meta) => meta.anio === anioSeleccionado);

  // Generar lista de años dinámicamente: desde el año actual hasta 5 años atrás
  // Esto asegura que siempre se incluya el año en curso automáticamente
  // Si estamos en 2026, mostrará: 2026, 2025, 2024, 2023, 2022, 2021
  const anosDisponibles = Array.from({ length: 6 }, (_, i) => anioActual - i).sort(
    (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) => b - a
  );

  // También incluir años que existan en las metas pero no estén en el rango estándar
  const anosEnMetas = [...new Set(metas.map((meta) => meta.anio))].filter(
    (anio) => !anosDisponibles.includes(anio)
  );
  const todosLosAnos = [...new Set([...anosDisponibles, ...anosEnMetas])].sort(
    (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) => b - a
  );

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      activa: "bg-emerald-600 text-white border border-emerald-700",
      cumplida: "bg-emerald-500 text-white border border-emerald-600",
      incumplida: "bg-red-500 text-white border border-red-600",
    };

    // Iconos SVG más profesionales
    const iconos = {
      activa: (
        <svg className="w-3.5 h-3.5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.2" />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </svg>
      ),
      cumplida: (
        <svg className="w-3.5 h-3.5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      incumplida: (
        <svg className="w-3.5 h-3.5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };

    return {
      estilo: estilos[estado as keyof typeof estilos] || estilos.activa,
      icono: iconos[estado as keyof typeof iconos] || iconos.activa,
      texto: estado.charAt(0).toUpperCase() + estado.slice(1),
    };
  };

  const getProgressBarColor = (porcentaje: number) => {
    if (porcentaje >= 100) return "bg-green-600";
    if (porcentaje >= 75) return "bg-[#459e60]";
    if (porcentaje >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <DashboardLayout
      title="Metas REP"
      subtitle="Seguimiento de metas de recolección y valorización de neumáticos"
    >
      <div className="w-full space-y-6">
        {/* Selector de Año */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-emerald-900 mb-1">Seleccionar Período</h2>
              <p className="text-sm text-gray-600">
                Selecciona el año para ver las metas correspondientes
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
                {todosLosAnos.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio} {anio === anioActual ? "(Actual)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-emerald-600"></div>
              <p className="ml-4 text-base font-medium text-gray-700">Cargando metas REP...</p>
            </div>
          </div>
        ) : metasDelAnio.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No hay metas disponibles para {anioSeleccionado}
            </h3>
            <p className="text-sm text-gray-600">
              Las metas REP aparecerán aquí una vez que sean asignadas por el Sistema de Gestión.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumen del Año */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-emerald-900 mb-4">
                Resumen {anioSeleccionado}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-lg border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        Total Metas
                      </p>
                      <p className="text-2xl font-bold text-emerald-900">{metasDelAnio.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-lg border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        Metas Cumplidas
                      </p>
                      <p className="text-2xl font-bold text-amber-900">
                        {
                          metasDelAnio.filter(
                            (m: ReturnType<typeof JSON.parse>) => m.estado === "cumplida"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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

                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        Avance Promedio
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {(
                          metasDelAnio.reduce((acc, meta) => acc + meta.porcentajeAvance, 0) /
                          metasDelAnio.length
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metas Detalladas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-emerald-900 mb-5">
                Metas Detalladas {anioSeleccionado}
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                {metasDelAnio.map((meta) => {
                  const badge = getEstadoBadge(meta.estado);
                  return (
                    <div
                      key={meta.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900">Meta de {meta.tipo}</h3>
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${badge.estilo} shadow-sm inline-flex items-center gap-1.5`}
                        >
                          {badge.icono}
                          <span>{badge.texto}</span>
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                            <span>Progreso</span>
                            <span className="text-base font-bold">
                              {meta.porcentajeAvance.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(meta.porcentajeAvance)}`}
                              style={{ width: `${Math.min(meta.porcentajeAvance, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs font-semibold text-gray-600 block mb-1">
                              Meta Establecida:
                            </span>
                            <p className="text-lg font-bold text-gray-900">
                              {meta.metaToneladas.toLocaleString()}{" "}
                              <span className="text-xs font-medium text-gray-600">ton</span>
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs font-semibold text-gray-600 block mb-1">
                              Avance Actual:
                            </span>
                            <p className="text-lg font-bold text-gray-900">
                              {meta.avanceToneladas.toLocaleString()}{" "}
                              <span className="text-xs font-medium text-gray-600">ton</span>
                            </p>
                          </div>
                        </div>

                        {meta.declaracion && (
                          <div className="pt-3 border-t border-gray-100 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                            <p className="text-xs font-semibold text-emerald-900 mb-1">
                              Información de Declaración:
                            </p>
                            <p className="text-xs text-gray-700">
                              Folio: <span className="font-semibold">{meta.declaracion.folio}</span>{" "}
                              • Total declarado:{" "}
                              <span className="font-semibold">
                                {meta.declaracion.totalToneladas.toLocaleString()} ton
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
