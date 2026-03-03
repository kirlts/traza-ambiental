"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, Suspense, lazy, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RefreshCw, Download, FileSpreadsheet, Settings } from "lucide-react";
import { toast } from "sonner";

// Lazy loading para componentes pesados
const VelocimetroMeta = lazy(() =>
  import("@/components/dashboard/VelocimetroMeta").then((mod) => ({ default: mod.VelocimetroMeta }))
);
const GraficoBarrasMeses = lazy(() =>
  import("@/components/dashboard/GraficoBarrasMeses").then((mod) => ({
    default: mod.GraficoBarrasMeses,
  }))
);
const GraficoCircularTratamientos = lazy(() =>
  import("@/components/dashboard/GraficoCircularTratamientos").then((mod) => ({
    default: mod.GraficoCircularTratamientos,
  }))
);
const MapaChileRegiones = lazy(() =>
  import("@/components/dashboard/MapaChileRegiones").then((mod) => ({
    default: mod.MapaChileRegiones,
  }))
);
const TablaUltimosCertificados = lazy(() =>
  import("@/components/dashboard/TablaUltimosCertificados").then((mod) => ({
    default: mod.TablaUltimosCertificados,
  }))
);
const FiltrosDashboard = lazy(() =>
  import("@/components/dashboard/FiltrosDashboard").then((mod) => ({
    default: mod.FiltrosDashboard,
  }))
);
const ProyeccionCumplimiento = lazy(() =>
  import("@/components/dashboard/ProyeccionCumplimiento").then((mod) => ({
    default: mod.ProyeccionCumplimiento,
  }))
);
const NotificationManager = lazy(() =>
  import("@/components/NotificationManager").then((mod) => ({ default: mod.NotificationManager }))
);

interface DashboardData {
  kpis: {
    metaRecoleccion: number;
    avanceRecoleccion: number;
    porcentajeRecoleccion: number;
    metaValorizacion: number;
    avanceValorizacion: number;
    porcentajeValorizacion: number;
    totalCertificados: number;
    gestoresActivos: number;
    generadoresAtendidos: number;
    promedioMensual: number;
  };
  proyeccion: {
    cumpliraAtiempo: boolean;
    fechaEstimada: string;
    toneladasMensualNecesarias: number;
    deficit: number;
  };
  comparacion: {
    periodoActual: { toneladas: number; porcentaje: number };
    periodoAnterior: { toneladas: number; porcentaje: number };
    variacion: number;
    mejora: boolean;
  };
}

interface Filtros {
  anio: number;
  periodo: string;
  region: string;
  tratamiento: string;
  gestor: string;
}

// Hook personalizado para debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SistemaGestionDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filtros, setFiltros] = useState<Filtros>({
    anio: new Date().getFullYear(),
    periodo: "anio",
    region: "todas",
    tratamiento: "todos",
    gestor: "todos",
  });

  // Debounce filtros para evitar llamadas excesivas a la API
  const filtrosDebounced = useDebounce(filtros, 500);

  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch: handleRefresh,
    dataUpdatedAt,
  } = useQuery<DashboardData>({
    queryKey: ["sg-dashboard-kpis", filtrosDebounced],
    queryFn: async () => {
      const params = new URLSearchParams({
        anio: filtrosDebounced.anio.toString(),
        periodo: filtrosDebounced.periodo,
        region: filtrosDebounced.region,
        tratamiento: filtrosDebounced.tratamiento,
        gestor: filtrosDebounced.gestor,
      });

      const response = await fetch(`/api/dashboard/kpis?${params}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: status === "authenticated",
  });

  const error = queryError instanceof Error ? queryError.message : null;
  const ultimaActualizacion = useMemo(() => new Date(dataUpdatedAt), [dataUpdatedAt]);

  const handleFiltrosChange = useCallback((nuevosFiltros: Partial<Filtros>) => {
    setFiltros((prev) => {
      const actualizados = { ...prev, ...nuevosFiltros };
      if (
        actualizados.anio &&
        (isNaN(actualizados.anio) || actualizados.anio < 2000 || actualizados.anio > 2100)
      ) {
        return prev;
      }
      return actualizados;
    });
  }, []);

  // Memoizar valores calculados para evitar re-renders innecesarios
  const kpiValues = useMemo(
    () => ({
      metaGlobal: `${data?.kpis?.porcentajeValorizacion?.toFixed(1) || 0}%`,
      metaSubtitulo: `${data?.kpis?.avanceValorizacion?.toFixed(1) || 0}/${data?.kpis?.metaValorizacion || 0} ton`,
      gestoresActivos: data?.kpis?.gestoresActivos?.toString() || "0",
      generadores: data?.kpis?.generadoresAtendidos?.toString() || "0",
      certificados: data?.kpis?.totalCertificados?.toString() || "0",
      porcentajeValorizacion: data?.kpis?.porcentajeValorizacion || 0,
    }),
    [data]
  );

  const handleExportExcel = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        anio: filtrosDebounced.anio.toString(),
        periodo: filtrosDebounced.periodo,
        region: filtrosDebounced.region,
        tratamiento: filtrosDebounced.tratamiento,
        gestor: filtrosDebounced.gestor,
      });

      const response = await fetch(`/api/dashboard/export/excel?${params}`);
      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-cumplimiento-${filtrosDebounced.anio}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Excel exportado exitosamente");
    } catch (err: unknown) {
      console.error("Error exportando Excel:", err);
      toast.error("Error al exportar Excel");
    }
  }, [filtrosDebounced]);

  const handleExportPDF = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        anio: filtrosDebounced.anio.toString(),
        periodo: filtrosDebounced.periodo,
        region: filtrosDebounced.region,
        tratamiento: filtrosDebounced.tratamiento,
        gestor: filtrosDebounced.gestor,
      });

      const response = await fetch(`/api/dashboard/export/pdf?${params}`);
      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-cumplimiento-${filtrosDebounced.anio}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("PDF exportado exitosamente");
    } catch (err: unknown) {
      console.error("Error exportando PDF:", err);
      toast.error("Error al exportar PDF");
    }
  }, [filtrosDebounced]);

  if (loading) {
    return (
      <DashboardLayout
        title="Dashboard de Cumplimiento Global"
        subtitle="Cargando datos del sistema..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando datos del dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard de Cumplimiento Global" subtitle="Error al cargar datos">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
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
                onClick={() => handleRefresh()}
                className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Verificar sesión antes de renderizar
  if (status === "loading") {
    return (
      <DashboardLayout title="Dashboard de Cumplimiento Global">
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
      <DashboardLayout title="Dashboard de Cumplimiento Global">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-semibold mb-2">Acceso no autorizado</h2>
            <p className="text-gray-600">Debe iniciar sesión para acceder al dashboard.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard de Cumplimiento Global"
      subtitle={`Sistema Nacional de Gestión de Neumáticos - ${filtros.anio}`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/sistema-gestion/configuracion-metas")}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Settings className="h-4 w-4" />
            Configurar Metas
          </button>
          <button
            onClick={() => handleRefresh()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filtros - Lazy loaded */}
        <div className="sticky top-20 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-2 bg-gray-50/95 backdrop-blur-xs transition-all duration-200">
          <Suspense
            fallback={
              <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            }
          >
            <FiltrosDashboard filtros={filtros} onChange={handleFiltrosChange} />
          </Suspense>
        </div>

        {/* Indicador de última actualización */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Última actualización: {ultimaActualizacion.toLocaleString("es-CL")}</span>
        </div>

        {/* KPIs Principales - No necesitan lazy loading, son ligeros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            titulo="Meta Global"
            valor={kpiValues.metaGlobal}
            subtitulo={kpiValues.metaSubtitulo}
            icon="target"
            color="blue"
          />
          <KPICard
            titulo="Gestores Activos"
            valor={kpiValues.gestoresActivos}
            subtitulo="en la red"
            icon="building"
            color="emerald"
          />
          <KPICard
            titulo="Generadores"
            valor={kpiValues.generadores}
            subtitulo="atendidos"
            icon="users"
            color="purple"
          />
          <KPICard
            titulo="Certificados"
            valor={kpiValues.certificados}
            subtitulo="emitidos"
            icon="file-check"
            color="green"
          />
        </div>

        {/* Gráficos Principales - Lazy loaded con Suspense */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Velocímetro y Gráfico de Barras */}
          <div className="space-y-6">
            <Suspense fallback={<ChartSkeleton />}>
              <VelocimetroMeta
                porcentaje={kpiValues.porcentajeValorizacion}
                titulo="Avance de Meta de Valorización"
              />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <GraficoBarrasMeses filtros={filtros} enabled={status === "authenticated"} />
            </Suspense>
          </div>

          {/* Gráfico Circular y Mapa */}
          <div className="space-y-6">
            <Suspense fallback={<ChartSkeleton />}>
              <GraficoCircularTratamientos filtros={filtros} enabled={status === "authenticated"} />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <MapaChileRegiones filtros={filtros} enabled={status === "authenticated"} />
            </Suspense>
          </div>
        </div>

        {/* Proyección de Cumplimiento - Lazy loaded */}
        {data?.proyeccion && (
          <Suspense fallback={<ChartSkeleton />}>
            <ProyeccionCumplimiento proyeccion={data.proyeccion} comparacion={data.comparacion} />
          </Suspense>
        )}

        {/* Últimos Certificados - Lazy loaded */}
        <Suspense fallback={<TableSkeleton />}>
          <TablaUltimosCertificados filtros={filtros} enabled={status === "authenticated"} />
        </Suspense>

        {/* Notificaciones Push - Lazy loaded */}
        <Suspense fallback={<ChartSkeleton />}>
          <NotificationManager />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Componentes de loading optimizados
function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto mb-2"></div>
          <div className="text-sm text-gray-500">Cargando gráfico...</div>
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
