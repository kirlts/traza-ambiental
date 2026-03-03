"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface DashboardStats {
  totalSolicitudes: number;
  totalSolicitudesEsteMes: number;
  enProceso: number;
  completadas: number;
  completadasEsteMes: number;
}

export default function GeneradorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["generador-stats"],
    queryFn: async () => {
      const res = await fetch("/api/generador/stats");
      if (!res.ok) throw new Error("Error loading stats");
      return res.json();
    },
    enabled: status === "authenticated",
  });

  if (status === "loading") {
    return (
      <DashboardLayout title="Dashboard Generador" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border)] border-t-[var(--primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--muted-foreground)] font-medium">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout
      title={`Bienvenido, ${session.user?.name || "Generador"}`}
      subtitle="Panel de gestión de solicitudes de retiro de neumáticos"
    >
      <div className="space-y-8">
        {/* Call to action */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-3xl p-8 text-center shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/5 rounded-full"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">¿Listo para solicitar un retiro?</h2>
            <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              Crea una nueva solicitud y gestionaremos el retiro de tus neumáticos fuera de uso de
              manera eficiente y sostenible, cumpliendo con la normativa ambiental.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push("/dashboard/generador/solicitudes/nueva")}
                className="group bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3"
              >
                <svg
                  className="w-6 h-6 group-hover:rotate-12 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Crear Nueva Solicitud</span>
              </button>

              <button
                onClick={() => router.push("/dashboard/generador/solicitudes")}
                className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Ver Mis Solicitudes
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-25/50 rounded-2xl p-8 border border-emerald-100 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">Gestión de Neumáticos REP</h2>
            <p className="text-emerald-700 max-w-2xl mx-auto">
              Como generador, puedes solicitar el retiro de neumáticos fuera de uso cumpliendo con
              la Ley REP. Gestiona tus solicitudes de manera eficiente y sostenible.
            </p>
          </div>
        </div>

        {/* Cards de acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Nueva Solicitud */}
          <div
            className="group relative bg-white border border-emerald-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 cursor-pointer hover:border-emerald-300 overflow-hidden"
            onClick={() => router.push("/dashboard/generador/solicitudes/nueva")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
                Nueva Solicitud
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Solicita el retiro de neumáticos fuera de uso cumpliendo con la normativa ambiental
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Disponible
                </span>
                <svg
                  className="w-5 h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card: Mis Solicitudes */}
          <div
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 cursor-pointer hover:border-slate-300 overflow-hidden"
            onClick={() => router.push("/dashboard/generador/solicitudes")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate-600 text-white group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-slate-900 transition-colors">
                Mis Solicitudes
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Revisa el estado y seguimiento de todas tus solicitudes de retiro enviadas
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Disponible
                </span>
                <svg
                  className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card: Inventario Digital */}
          <Link
            href="/dashboard/generador/inventario"
            className="group relative bg-white border border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer hover:border-blue-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500 text-white group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                Inventario Digital
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Gestiona digitalmente tu inventario de neumáticos con trazabilidad completa
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Disponible
                </span>
                <svg
                  className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
              </div>
            </div>
          </Link>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-700 mb-2 uppercase tracking-wide">
                  Total Solicitudes
                </p>
                <p className="text-4xl font-bold text-emerald-900 mb-1">
                  {isLoadingStats ? "-" : stats?.totalSolicitudes || 0}
                </p>
                <div className="flex items-center">
                  <span className="text-xs text-emerald-600 font-medium">
                    {isLoadingStats ? "-" : stats?.totalSolicitudesEsteMes || 0} este mes
                  </span>
                  <svg
                    className="w-3 h-3 ml-1 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

          <div className="group bg-white border border-amber-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-700 mb-2 uppercase tracking-wide">
                  En Proceso
                </p>
                <p className="text-4xl font-bold text-amber-900 mb-1">
                  {isLoadingStats ? "-" : stats?.enProceso || 0}
                </p>
                <div className="flex items-center">
                  <span className="text-xs text-amber-600 font-medium">Activas</span>
                  <svg
                    className="w-3 h-3 ml-1 text-amber-500"
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
              </div>
              <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <svg
                  className="h-7 w-7 text-amber-600"
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
            </div>
          </div>

          <div className="group bg-white border border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 mb-2 uppercase tracking-wide">
                  Completadas
                </p>
                <p className="text-4xl font-bold text-green-900 mb-1">
                  {isLoadingStats ? "-" : stats?.completadas || 0}
                </p>
                <div className="flex items-center">
                  <span className="text-xs text-green-600 font-medium">
                    {isLoadingStats ? "-" : stats?.completadasEsteMes || 0} este mes
                  </span>
                  <svg
                    className="w-3 h-3 ml-1 text-green-500"
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
              <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg
                  className="h-7 w-7 text-green-600"
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
        </div>
      </div>
    </DashboardLayout>
  );
}
