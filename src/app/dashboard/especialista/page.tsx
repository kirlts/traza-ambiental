"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EspecialistaDashboard() {
  const { data: session, status } = useSession();
  const _router = useRouter();

  if (status === "loading") {
    return (
      <DashboardLayout title="Dashboard Especialista" subtitle="Cargando...">
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
      title="Dashboard Especialista"
      subtitle="Monitoreo y cumplimiento de metas - Supervisión del sistema REP"
    >
      <div className="space-y-6">
        {/* Cards de Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group opacity-60">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-[var(--secondary)] text-white mb-4 group-hover:scale-110 transition-transform">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Monitoreo de Metas
            </h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-4">
              Supervisa el cumplimiento de metas anuales
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--muted)]/20 text-[var(--muted-foreground)]">
                Próximamente
              </span>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group opacity-60">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-[var(--success)] text-white mb-4 group-hover:scale-110 transition-transform">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Reportes</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-4">
              Genera reportes de cumplimiento normativo
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--muted)]/20 text-[var(--muted-foreground)]">
                Próximamente
              </span>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group opacity-60">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-[var(--primary)] text-white mb-4 group-hover:scale-110 transition-transform">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Optimización</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-4">
              Optimiza procesos según normativa MMA
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--muted)]/20 text-[var(--muted-foreground)]">
                Próximamente
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Metas Activas</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">0</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-[var(--primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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

          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Cumplimiento</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">0%</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[var(--success)]/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-[var(--success)]"
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

          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Alertas</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">0</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-[var(--secondary)]"
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
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Reportes</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">0</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-indigo-600"
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
        </div>

        {/* Información */}
        <div className="bg-gradient-to-r from-[var(--secondary)]/10 to-[var(--primary)]/10 border border-[var(--secondary)]/20 rounded-lg p-6 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-[var(--secondary)]"
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
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Funcionalidades próximamente disponibles
              </h3>
              <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                <p>
                  Estamos desarrollando las herramientas completas de monitoreo, reportes y
                  optimización para especialistas del sistema REP. Pronto estarán disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
