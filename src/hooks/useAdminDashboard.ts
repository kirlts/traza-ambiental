"use client";

import { useState, useEffect, useCallback } from "react";

interface UserStats {
  total: number;
  activos: number;
  inactivos: number;
  porRol: Array<{
    roleId: string;
    roleName: string;
    count: number;
  }>;
}

interface RoleStats {
  total: number;
  activos: number;
  conUsuarios: number;
}

interface NeumaticoStats {
  total: number;
  enTransito: number;
  reciclados: number;
  pendientes: number;
}

interface Activity {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  type: "user" | "role" | "system" | "neumatico";
}

interface HistoricalData {
  usuariosRegistrados: Array<{
    fecha: string;
    usuarios: number;
    activos: number;
  }>;
  actividadSistema: Array<{
    fecha: string;
    actividades: number;
    logins: number;
    acciones: number;
  }>;
}

interface DashboardData {
  usuarios: UserStats;
  roles: RoleStats;
  neumaticos: NeumaticoStats;
  actividad: Activity[];
  historico: HistoricalData;
  timestamp: string;
}

interface UseAdminDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: (enabled: boolean) => void;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/dashboard/stats");

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error("Error al cargar datos del dashboard:", err);
      setError(
        err instanceof Error ? (err as ReturnType<typeof JSON.parse>).message : "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(
      () => {
        // Solo hacer refresh si la página está visible
        if (!document.hidden) {
          fetchData();
        }
      },
      5 * 60 * 1000
    ); // 5 minutos

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, fetchData]);

  // Refresh cuando la página vuelve a estar visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && autoRefreshEnabled) {
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [autoRefreshEnabled, fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
  };
}
