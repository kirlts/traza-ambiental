"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { isAdmin } from "@/lib/auth-helpers";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/RecentActivity";
import QuickActions from "@/components/QuickActions";
import AlertsPanel from "@/components/AlertsPanel";
import DashboardCharts from "@/components/DashboardCharts";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading, error, lastUpdated, refresh, autoRefreshEnabled, setAutoRefreshEnabled } =
    useAdminDashboard();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session && !isAdmin(session)) {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  // Generar alertas memoizadas - MOVIDO AQUÍ PARA EVITAR LLAMADA CONDICIONAL
  const alerts = useMemo(() => {
    if (!data) return [];

    const newAlerts = [];
    const baseTime = lastUpdated?.getTime() || 0;

    if (data.usuarios?.inactivos && data.usuarios.inactivos > 0) {
      newAlerts.push({
        id: "inactive-users",
        type: "warning" as const,
        title: "Usuarios inactivos",
        message: `${data.usuarios.inactivos} usuario(s) inactivo(s) en el sistema`,
        timestamp: new Date(baseTime).toISOString(),
        action: {
          label: "Revisar usuarios",
          onClick: () => router.push("/dashboard/admin/users"),
        },
      });
    }

    if (data.neumaticos?.pendientes && data.neumaticos.pendientes > 0) {
      newAlerts.push({
        id: "pending-neumaticos",
        type: "info" as const,
        title: "Neumáticos pendientes",
        message: `${data.neumaticos.pendientes} neumático(s) pendiente(s) de procesamiento`,
        timestamp: new Date(baseTime).toISOString(),
      });
    }

    // Alerta de sistema actualizado
    newAlerts.push({
      id: "system-update",
      type: "success" as const,
      title: "Sistema actualizado",
      message: "El sistema se ha actualizado correctamente",
      timestamp: new Date(baseTime - 3600000).toISOString(),
    });

    return newAlerts;
  }, [data, lastUpdated, router]);

  if (status === "loading" || loading) {
    return (
      <DashboardLayout title="Dashboard Administrador" subtitle="Cargando...">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-(--border) border-t-(--primary) mx-auto"></div>
            <p className="mt-4 text-(--muted-foreground) font-medium">Cargando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || !isAdmin(session)) {
    return (
      <DashboardLayout title="Acceso Denegado">
        <div className="flex items-center justify-center h-96">
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
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">Acceso Denegado</h2>
            <p className="text-(--muted-foreground) mb-8">
              No tienes permisos para acceder al dashboard de administrador.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-(--primary) hover:bg-(--primary-hover) text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Bienvenido, ${session.user?.name || "Administrador Sistema"}`}
      subtitle="Panel de administración del sistema"
      actions={
        <div className="flex items-center gap-4">
          {/* Auto-refresh toggle */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Auto-refresh</label>
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefreshEnabled ? "bg-emerald-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  autoRefreshEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={refresh}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Actualizar</span>
          </button>
        </div>
      }
    >
      {/* Main Content */}
      <div className="space-y-6">
        {/* Last updated info */}
        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Última actualización: {lastUpdated.toLocaleString("es-ES")}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-5 shadow-sm">
            <div className="flex gap-3">
              <div className="shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">Error al cargar datos</h3>
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={refresh}
                  className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {data && (
          <DashboardStats
            usuarios={data.usuarios}
            roles={data.roles}
            neumaticos={data.neumaticos}
            loading={loading}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <RecentActivity activities={data?.actividad || []} loading={loading} />

          {/* Alerts Panel */}
          <AlertsPanel alerts={alerts} loading={loading} />
        </div>

        {/* Charts Section */}
        {data && (
          <DashboardCharts historico={data.historico} usuarios={data.usuarios} loading={loading} />
        )}

        {/* Quick Actions */}
        <QuickActions loading={loading} />
      </div>
    </DashboardLayout>
  );
}
