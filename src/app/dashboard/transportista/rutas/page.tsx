"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Plus,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Trash2,
  Zap,
  Calendar,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Ruta {
  id: string;
  nombre: string;
  fechaPlanificada: string;
  estado: string;
  optimizada: boolean;
  vehiculo?: {
    patente: string;
    tipo: string;
  };
  totalSolicitudes: number;
  solicitudesCompletadas: number;
  porcentajeCompletado: number;
  pesoTotal: number;
}

export default function PlanificacionRutasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filtroEstado, setFiltroEstado] = useState<string>("");

  // Obtener rutas
  const { data, isLoading, error } = useQuery({
    queryKey: ["rutas", filtroEstado],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtroEstado) params.append("estado", filtroEstado);

      const response = await fetch(`/api/transportista/rutas?${params}`);
      if (!response.ok) throw new Error("Error cargando rutas");
      return response.json();
    },
  });

  // Mutación para eliminar ruta
  const eliminarMutation = useMutation({
    mutationFn: async (rutaId: string) => {
      const response = await fetch(`/api/transportista/rutas/${rutaId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error((error as ReturnType<typeof JSON.parse>).error || "Error al eliminar ruta");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rutas"] });
      toast.success("Ruta eliminada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    },
  });

  // Mutación para optimizar ruta
  const optimizarMutation = useMutation({
    mutationFn: async (rutaId: string) => {
      const response = await fetch(`/api/transportista/rutas/${rutaId}/optimizar`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error al optimizar ruta"
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rutas"] });
      toast.success("Ruta optimizada exitosamente");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    },
  });

  const rutas = data?.rutas || [];
  const rutasPlanificadas = rutas.filter(
    (r: ReturnType<typeof JSON.parse>) => r.estado === "PLANIFICADA"
  ).length;
  const rutasEnProgreso = rutas.filter(
    (r: ReturnType<typeof JSON.parse>) => r.estado === "EN_PROGRESO"
  ).length;
  const rutasCompletadas = rutas.filter(
    (r: ReturnType<typeof JSON.parse>) => r.estado === "COMPLETADA"
  ).length;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PLANIFICADA":
        return (
          <Badge className="bg-blue-500 text-white border-0 font-bold">
            <Clock className="h-3 w-3 mr-1" />
            Planificada
          </Badge>
        );
      case "EN_PROGRESO":
        return (
          <Badge className="bg-[#f5792a] text-white border-0 font-bold">
            <Play className="h-3 w-3 mr-1" />
            En Progreso
          </Badge>
        );
      case "COMPLETADA":
        return (
          <Badge className="bg-[#459e60] text-white border-0 font-bold">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        );
      case "CANCELADA":
        return <Badge className="bg-gray-400 text-white border-0 font-bold">Cancelada</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        title="Planificación de Rutas"
        subtitle="Gestione y optimice sus rutas de transporte"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border)] border-t-[var(--primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--muted-foreground)] font-medium">Cargando rutas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        title="Planificación de Rutas"
        subtitle="Gestione y optimice sus rutas de transporte"
      >
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Error al cargar rutas. Por favor, intente nuevamente.</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Planificación de Rutas"
      subtitle="Optimice sus servicios de transporte agrupando múltiples solicitudes"
    >
      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Rutas */}
          <Card className="relative overflow-hidden border-2 border-[#459e60]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#f6fcf3] to-[#f0fdf4]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#459e60]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-xl shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-[#459e60] text-white border-0 font-bold px-3 py-1">
                  Total
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  Total Rutas
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">{rutas.length}</div>
                <p className="text-xs text-[#459e60] font-medium">Rutas registradas</p>
              </div>
            </CardContent>
          </Card>

          {/* Planificadas */}
          <Card className="relative overflow-hidden border-2 border-blue-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-blue-500 text-white border-0 font-bold px-3 py-1">
                  {rutasPlanificadas}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  Planificadas
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">{rutasPlanificadas}</div>
                <p className="text-xs text-blue-600 font-medium">Listas para iniciar</p>
              </div>
            </CardContent>
          </Card>

          {/* En Progreso */}
          <Card className="relative overflow-hidden border-2 border-[#f5792a]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#fef8f0] to-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f5792a]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#f5792a] to-[#f8a055] rounded-xl shadow-lg">
                  <Play className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-[#f5792a] text-white border-0 font-bold px-3 py-1">
                  {rutasEnProgreso}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  En Progreso
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">{rutasEnProgreso}</div>
                <p className="text-xs text-[#f5792a] font-medium">Rutas activas</p>
              </div>
            </CardContent>
          </Card>

          {/* Completadas */}
          <Card className="relative overflow-hidden border-2 border-[#4fa362]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#f0fdf4] to-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4fa362]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#4fa362] to-[#459e60] rounded-xl shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-[#4fa362] text-white border-0 font-bold px-3 py-1">
                  {rutasCompletadas}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  Completadas
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">{rutasCompletadas}</div>
                <p className="text-xs text-[#4fa362] font-medium">Rutas finalizadas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Botón Crear */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#2b3b4c] flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#459e60] to-[#4fa362] rounded-full"></div>
              Mis Rutas
            </h2>
            <p className="text-sm text-[#2b3b4c]/60 mt-2 ml-7">
              Gestione sus rutas de transporte planificadas
            </p>
          </div>

          <div className="flex gap-3">
            {/* Filtro por Estado */}
            <select
              value={filtroEstado}
              onChange={(e: unknown) =>
                setFiltroEstado((e as ReturnType<typeof JSON.parse>).target.value)
              }
              className="px-4 py-2 border-2 border-[#459e60]/30 rounded-lg focus:border-[#459e60] outline-none text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="PLANIFICADA">Planificada</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>

            {/* Botón Crear Nueva Ruta */}
            <Button
              onClick={() => router.push("/dashboard/transportista/rutas/nueva")}
              className="bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Ruta
            </Button>
          </div>
        </div>

        {/* Lista de Rutas */}
        {rutas.length === 0 ? (
          <Card className="border-2 border-dashed border-[#459e60]/30">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#459e60]/10 to-[#4fa362]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-[#459e60]" />
              </div>
              <h3 className="text-xl font-bold text-[#2b3b4c] mb-2">No hay rutas planificadas</h3>
              <p className="text-[#2b3b4c]/60 mb-6">
                Cree su primera ruta agrupando múltiples solicitudes de transporte
              </p>
              <Button
                onClick={() => router.push("/dashboard/transportista/rutas/nueva")}
                className="bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Primera Ruta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {rutas.map((ruta: Ruta) => (
              <Card
                key={ruta.id}
                className="border-2 border-[#459e60]/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{ruta.nombre}</h3>
                        {ruta.vehiculo && (
                          <p className="text-sm text-white/80">
                            <Truck className="h-3 w-3 inline mr-1" />
                            {ruta.vehiculo.patente}
                          </p>
                        )}
                      </div>
                    </div>
                    {getEstadoBadge(ruta.estado)}
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Fecha */}
                  <div className="flex items-center gap-2 text-sm text-[#2b3b4c]/70">
                    <Calendar className="h-4 w-4 text-[#459e60]" />
                    <span className="font-semibold">Fecha planificada:</span>
                    <span>
                      {format(new Date(ruta.fechaPlanificada), "dd 'de' MMMM yyyy", { locale: es })}
                    </span>
                  </div>

                  {/* Progreso */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-[#2b3b4c]">
                        Progreso: {ruta.solicitudesCompletadas} / {ruta.totalSolicitudes}
                      </span>
                      <span className="font-bold text-[#459e60]">{ruta.porcentajeCompletado}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#459e60] to-[#4fa362] rounded-full transition-all duration-500"
                        style={{ width: `${ruta.porcentajeCompletado}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-[#f6fcf3] rounded-lg">
                      <Package className="h-5 w-5 text-[#459e60]" />
                      <div>
                        <p className="text-xs text-[#2b3b4c]/70">Solicitudes</p>
                        <p className="text-lg font-bold text-[#2b3b4c]">{ruta.totalSolicitudes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-[#f6fcf3] rounded-lg">
                      <Package className="h-5 w-5 text-[#459e60]" />
                      <div>
                        <p className="text-xs text-[#2b3b4c]/70">Peso Total</p>
                        <p className="text-lg font-bold text-[#2b3b4c]">
                          {(ruta.pesoTotal / 1000).toFixed(1)} t
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optimizada */}
                  {ruta.optimizada && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Ruta optimizada</span>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2 border-t border-[#459e60]/20">
                    <Link href={`/dashboard/transportista/rutas/${ruta.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white font-semibold"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </Link>

                    {ruta.estado === "PLANIFICADA" && !ruta.optimizada && (
                      <Button
                        onClick={() => optimizarMutation.mutate(ruta.id)}
                        disabled={optimizarMutation.isPending}
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    )}

                    {ruta.estado === "PLANIFICADA" && (
                      <Button
                        onClick={() => eliminarMutation.mutate(ruta.id)}
                        disabled={eliminarMutation.isPending}
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
