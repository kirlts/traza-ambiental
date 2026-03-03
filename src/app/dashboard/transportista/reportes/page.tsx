"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Package,
  CheckCircle,
  TrendingUp,
  Calendar,
  Download,
  MapPin,
  Truck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { format, parse, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export default function ReportesPage() {
  const now = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(format(now, "yyyy-MM"));
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const fechaSeleccionada = parse(mesSeleccionado, "yyyy-MM", new Date());
  const _mesActual = format(fechaSeleccionada, "MMMM", { locale: es });
  const anioActual = format(fechaSeleccionada, "yyyy");

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const mesIndex = fechaSeleccionada.getMonth();

  const handleMesChange = (mes: number) => {
    const nuevaFecha = new Date(fechaSeleccionada.getFullYear(), mes, 1);
    setMesSeleccionado(format(nuevaFecha, "yyyy-MM"));
    setShowMonthPicker(false);
  };

  const handleAnioChange = (delta: number) => {
    const nuevaFecha =
      delta > 0 ? addMonths(fechaSeleccionada, 12) : subMonths(fechaSeleccionada, 12);
    setMesSeleccionado(format(nuevaFecha, "yyyy-MM"));
  };

  // Obtener reporte mensual
  const { data, isLoading } = useQuery({
    queryKey: ["reporte-mensual", mesSeleccionado],
    queryFn: async () => {
      const response = await fetch(`/api/transportista/reportes/mensual?mes=${mesSeleccionado}`);
      if (!response.ok) throw new Error("Error cargando reporte");
      return response.json();
    },
  });

  const reporte = data || {};
  const resumen = reporte.resumen || {};
  const distribuciones = reporte.distribuciones || {};

  const exportarCSV = () => {
    window.open(`/api/transportista/reportes/exportar?mes=${mesSeleccionado}`, "_blank");
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Reportes" subtitle="Análisis y estadísticas de desempeño">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#459e60] mx-auto"></div>
            <p className="mt-6 text-gray-600 font-semibold text-lg">Generando reporte...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Reportes y Estadísticas"
      subtitle="Análisis detallado de su desempeño y operaciones"
    >
      <div className="w-full space-y-6">
        {/* Selector de Período */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Reporte Mensual</h2>
                <p className="text-sm text-gray-600">
                  Análisis completo de actividades y rendimiento
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Button
                    type="button"
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                    variant="outline"
                    className="border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 h-10 px-4 min-w-[180px] justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">
                        {format(fechaSeleccionada, "MMM yyyy", { locale: es })}
                      </span>
                    </div>
                  </Button>

                  {/* Month Picker Dropdown */}
                  {showMonthPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMonthPicker(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px]">
                        {/* Year Selector */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAnioChange(-1)}
                            className="h-8 w-8 hover:bg-gray-100"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-semibold text-gray-900">{anioActual}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAnioChange(1)}
                            className="h-8 w-8 hover:bg-gray-100"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Month Grid */}
                        <div className="grid grid-cols-3 gap-2">
                          {meses.map((mes, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleMesChange(index)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                index === mesIndex
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "text-gray-700 hover:bg-emerald-50"
                              }`}
                            >
                              {mes.substring(0, 3)}
                            </button>
                          ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const hoy = new Date();
                              setMesSeleccionado(format(hoy, "yyyy-MM"));
                              setShowMonthPicker(false);
                            }}
                            className="flex-1 text-xs h-8"
                          >
                            Este mes
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const mesAnterior = subMonths(new Date(), 1);
                              setMesSeleccionado(format(mesAnterior, "yyyy-MM"));
                              setShowMonthPicker(false);
                            }}
                            className="flex-1 text-xs h-8"
                          >
                            Mes anterior
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  onClick={exportarCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm h-10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Solicitudes */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Total Solicitudes
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {resumen.totalSolicitudes || 0}
                </div>
                <p className="text-sm text-emerald-700 font-medium">
                  {resumen.pesoTotalEstimadoToneladas || 0} toneladas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Completadas */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Completadas
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {resumen.solicitudesCompletadas || 0}
                </div>
                <p className="text-sm text-emerald-700 font-medium">
                  {resumen.pesoTotalRealToneladas || 0} t reales
                </p>
              </div>
            </CardContent>
          </Card>

          {/* En Proceso */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  En Proceso
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {resumen.solicitudesEnProceso || 0}
                </div>
                <p className="text-sm text-amber-700 font-medium">En camino y pendientes</p>
              </div>
            </CardContent>
          </Card>

          {/* Eficiencia */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Eficiencia
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {resumen.eficiencia || 0}%
                </div>
                <p className="text-sm text-blue-700 font-medium">Tasa de completitud</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribución por Región */}
        {distribuciones.porRegion && distribuciones.porRegion.length > 0 && (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  Distribución por Región
                </h2>
                <p className="text-sm text-gray-600 ml-11">
                  Solicitudes y peso transportado por región
                </p>
              </div>
              <div className="space-y-4">
                {distribuciones.porRegion
                  .sort(
                    (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) =>
                      b.cantidad - a.cantidad
                  )
                  .slice(0, 10)
                  .map((region: ReturnType<typeof JSON.parse>, index: number) => {
                    const maxCantidad = Math.max(
                      ...distribuciones.porRegion.map(
                        (r: ReturnType<typeof JSON.parse>) => r.cantidad
                      )
                    );
                    const porcentaje = (region.cantidad / maxCantidad) * 100;

                    return (
                      <div key={region.region} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{region.region}</p>
                              <p className="text-xs text-gray-600">
                                {region.pesoToneladas} toneladas
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1 text-xs">
                            {region.cantidad} solicitudes
                          </Badge>
                        </div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Progreso</span>
                            <span className="text-xs font-semibold text-emerald-700">
                              {porcentaje.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Distribución por Vehículo */}
        {distribuciones.porVehiculo && distribuciones.porVehiculo.length > 0 && (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Truck className="h-5 w-5 text-emerald-600" />
                  </div>
                  Rendimiento por Vehículo
                </h2>
                <p className="text-sm text-gray-600 ml-11">
                  Utilización de cada vehículo en el período
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {distribuciones.porVehiculo.map((vehiculo: ReturnType<typeof JSON.parse>) => (
                  <Card
                    key={vehiculo.patente}
                    className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                          <Truck className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-base">
                            {vehiculo.patente}
                          </p>
                          <p className="text-xs text-gray-600">{vehiculo.tipo}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <span className="text-sm font-medium text-gray-700">Solicitudes</span>
                          <Badge className="bg-emerald-600 text-white border-0 font-semibold px-3 py-1">
                            {vehiculo.cantidad}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <span className="text-sm font-medium text-gray-700">Peso Total</span>
                          <span className="font-semibold text-emerald-700">
                            {vehiculo.pesoToneladas} t
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Distribución por Estado */}
        {distribuciones.porEstado && distribuciones.porEstado.length > 0 && (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                  </div>
                  Estados de Solicitudes
                </h2>
                <p className="text-sm text-gray-600 ml-11">
                  Distribución por estado en el período seleccionado
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {distribuciones.porEstado.map((est: { estado: string; cantidad: number }) => {
                  interface EstadoConfig {
                    bg: string;
                    border: string;
                    icon: React.ComponentType<{ className?: string }>;
                    iconColor: string;
                    label: string;
                  }

                  const estadosConfig: Record<string, EstadoConfig> = {
                    PENDIENTE: {
                      bg: "bg-blue-50",
                      border: "border-blue-200",
                      icon: Clock,
                      iconColor: "text-blue-600",
                      label: "Pendientes",
                    },
                    EN_CAMINO: {
                      bg: "bg-orange-50",
                      border: "border-orange-200",
                      icon: Truck,
                      iconColor: "text-orange-600",
                      label: "En Camino",
                    },
                    ENTREGADA_GESTOR: {
                      bg: "bg-emerald-50",
                      border: "border-emerald-200",
                      icon: CheckCircle,
                      iconColor: "text-emerald-600",
                      label: "Entregadas",
                    },
                    RECHAZADA: {
                      bg: "bg-red-50",
                      border: "border-red-200",
                      icon: AlertCircle,
                      iconColor: "text-red-600",
                      label: "Rechazadas",
                    },
                  };

                  const config = estadosConfig[est.estado] || estadosConfig.PENDIENTE;
                  const Icon = config.icon;

                  return (
                    <Card
                      key={est.estado}
                      className={`border ${config.border} shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <CardContent className={`p-5 ${config.bg}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 ${config.bg} rounded-lg border ${config.border}`}>
                            <Icon className={`h-5 w-5 ${config.iconColor}`} />
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{config.label}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {est.cantidad}
                          </div>
                          <p className="text-xs text-gray-600 font-medium">solicitudes</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensaje si no hay datos */}
        {(!reporte.solicitudes || reporte.solicitudes.length === 0) && (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center bg-white">
              <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay datos para este período
              </h3>
              <p className="text-sm text-gray-600">
                Seleccione un período diferente para ver las estadísticas
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
