"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RecentActivity from "@/components/RecentActivity";

export default function TransportistaDashboard() {
  const { data: session, status } = useSession();
  const _router = useRouter();
  const _queryClient = useQueryClient();

  // Obtener estadísticas del transportista
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["transportista-stats"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/stats-dashboard");
      if (!response.ok) {
        throw new Error("Error cargando estadísticas");
      }
      return response.json();
    },
    enabled: status === "authenticated",
  });

  // Obtener vehículos del transportista
  const {
    data: vehiculosData,
    isLoading: vehiculosLoading,
    refetch: refetchVehiculos,
  } = useQuery({
    queryKey: ["vehiculos"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/vehiculos");
      if (!response.ok) {
        throw new Error("Error cargando vehículos");
      }
      return response.json();
    },
    enabled: status === "authenticated",
  });

  // Obtener actividad reciente (historial)
  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["transportista-history-recent"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/historial?limit=5");
      if (!response.ok) throw new Error("Error loading history");
      return response.json();
    },
    enabled: status === "authenticated",
  });

  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchVehiculos(), refetchHistory()]);
  };

  const stats = {
    solicitudesActivas: statsData?.solicitudesActivas || 0,
    enRuta: statsData?.enRuta || 0,
    completadas: statsData?.completadasMes || 0,
    eficiencia: statsData?.eficiencia || 0,
  };

  const vehiculos = vehiculosData?.vehiculos || [];

  // Mapear historial a formato de RecentActivity
  const recentActivities =
    (
      historyData?.solicitudes as Array<{
        id: string;
        estado: string;
        folio: string;
        generador?: { name: string };
        vehiculo?: { patente: string };
        updatedAt: string;
        createdAt: string;
      }>
    )?.map((solicitud: ReturnType<typeof JSON.parse>) => {
      let type = "system";
      let action = "Actualización";

      switch (solicitud.estado) {
        case "ACEPTADA":
          type = "user"; // Blue
          action = "Solicitud Aceptada";
          break;
        case "EN_CAMINO":
          type = "neumatico"; // Green (used as proxy for active/moving)
          action = "En Ruta";
          break;
        case "RECOLECTADA":
          type = "role"; // Purple
          action = "Recolección Exitosa";
          break;
        case "ENTREGADA_GESTOR":
          type = "neumatico"; // Green
          action = "Entrega Completada";
          break;
        case "RECHAZADA":
          type = "system"; // Gray
          action = "Solicitud Rechazada";
          break;
        default:
          type = "system";
          action = "Estado Actualizado";
      }

      return {
        id: solicitud.id,
        action: action,
        description: `Folio: ${solicitud.folio} - ${solicitud.generador?.name || "Cliente"}`,
        user: solicitud.vehiculo?.patente || "Sin asignar",
        timestamp: solicitud.updatedAt || solicitud.createdAt,
        type: type as "user" | "role" | "system" | "neumatico",
      };
    }) || [];

  if (status === "loading" || statsLoading || vehiculosLoading) {
    return (
      <DashboardLayout title="Dashboard Transportista" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#459e60] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) return null;

  return (
    <DashboardLayout
      title="Bienvenido, Transportista"
      subtitle="Panel de Control para Transportistas - Sistema REP Chile"
      actions={
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Estadísticas principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Solicitudes Activas */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#f5792a]/10 rounded-bl-full"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#f5792a]/10 rounded-xl">
                  <Package className="h-6 w-6 text-[#f5792a]" />
                </div>
                {stats.solicitudesActivas > 0 && (
                  <Badge className="bg-[#f5792a] text-white border-0">
                    {stats.solicitudesActivas} Nuevas
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Solicitudes Activas</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.solicitudesActivas}
                </div>
                <p className="text-xs text-[#f5792a] font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Requieren atención
                </p>
              </div>
            </CardContent>
          </Card>

          {/* En Ruta */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#459e60]/10 rounded-bl-full"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#459e60]/10 rounded-xl">
                  <Truck className="h-6 w-6 text-[#459e60]" />
                </div>
                <Badge className="bg-[#459e60]/10 text-[#459e60] border-0">En Curso</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">En Ruta</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.enRuta}</div>
                <p className="text-xs text-[#459e60] font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Servicios activos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Completadas Este Mes */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#4fa362]/10 rounded-bl-full"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#4fa362]/10 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-[#4fa362]" />
                </div>
                <Badge className="bg-[#4fa362]/10 text-[#4fa362] border-0">Mes Actual</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completadas</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.completadas}</div>
                <p className="text-xs text-[#4fa362] font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Entregas exitosas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Eficiencia */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-50 text-blue-600 border-0">{stats.eficiencia}%</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Eficiencia</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.eficiencia}%</div>
                <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Rendimiento general
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Acciones y Flota */}
          <div className="lg:col-span-2 space-y-6">
            {/* Acciones Rápidas */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#459e60] rounded-full"></div>
                Acciones Rápidas
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/dashboard/transportista/solicitudes" className="group">
                  <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all group-hover:border-[#459e60] border bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-4 bg-[#459e60]/10 rounded-full group-hover:bg-[#459e60] transition-colors">
                        <Package className="h-6 w-6 text-[#459e60] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#459e60] transition-colors">
                          Gestionar Solicitudes
                        </h3>
                        <p className="text-sm text-gray-500">Ver disponibles y activas</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/transportista/entregas" className="group">
                  <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all group-hover:border-[#4fa362] border bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-4 bg-[#4fa362]/10 rounded-full group-hover:bg-[#4fa362] transition-colors">
                        <CheckCircle className="h-6 w-6 text-[#4fa362] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#4fa362] transition-colors">
                          Confirmar Entregas
                        </h3>
                        <p className="text-sm text-gray-500">Registrar entregas a gestor</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </section>

            {/* Dashboard de Flota */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#4fa362] rounded-full"></div>
                  Estado de la Flota
                </h2>
                <Link href="/dashboard/transportista/vehiculos">
                  <Button
                    variant="ghost"
                    className="text-[#459e60] hover:text-[#459e60] hover:bg-[#459e60]/10 text-sm"
                  >
                    Ver Todos
                  </Button>
                </Link>
              </div>

              {vehiculos.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No hay vehículos registrados</p>
                    <Link href="/dashboard/transportista/vehiculos/nuevo">
                      <Button className="bg-[#459e60] hover:bg-[#44a15d]">Agregar Vehículo</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {vehiculos.slice(0, 4).map((vehiculo: ReturnType<typeof JSON.parse>) => (
                    <Card
                      key={vehiculo.id}
                      className="border-0 shadow-md hover:shadow-lg transition-all bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Truck className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{vehiculo.patente}</p>
                              <p className="text-xs text-gray-500">{vehiculo.tipo}</p>
                            </div>
                          </div>
                          {vehiculo.estado === "activo" && (
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Capacidad</span>
                            <span className="font-medium text-gray-900">
                              {vehiculo.pesoUsadoKg} / {vehiculo.capacidadKg} kg
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                vehiculo.porcentajeUso >= 80
                                  ? "bg-red-500"
                                  : vehiculo.porcentajeUso >= 50
                                    ? "bg-yellow-500"
                                    : "bg-[#459e60]"
                              }`}
                              style={{ width: `${Math.min(vehiculo.porcentajeUso, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Columna Derecha: Actividad Reciente */}
          <div className="lg:col-span-1">
            <section className="h-full">
              <RecentActivity activities={recentActivities} loading={historyLoading} />
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
