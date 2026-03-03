"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Wrench,
  XCircle,
  BarChart3,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ModalNuevoVehiculo from "@/components/transportista/ModalNuevoVehiculo";

export default function VehiculosPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<string | null>(null);
  const [modalNuevoVehiculoOpen, setModalNuevoVehiculoOpen] = useState(false);

  // Obtener vehículos
  const { data, isLoading, error } = useQuery({
    queryKey: ["vehiculos"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/vehiculos");
      if (!response.ok) throw new Error("Error cargando vehículos");
      return response.json();
    },
  });

  // Mutación para eliminar vehículo
  const eliminarMutation = useMutation({
    mutationFn: async (vehiculoId: string) => {
      const response = await fetch(`/api/transportista/vehiculos/${vehiculoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).details ||
            (error as ReturnType<typeof JSON.parse>).error ||
            "Error al eliminar vehículo"
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      toast.success("Vehículo eliminado exitosamente");
      setVehiculoAEliminar(null);
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    },
  });

  // Mutación para cambiar estado
  const cambiarEstadoMutation = useMutation({
    mutationFn: async ({
      vehiculoId,
      nuevoEstado,
    }: {
      vehiculoId: string;
      nuevoEstado: string;
    }) => {
      const response = await fetch(`/api/transportista/vehiculos/${vehiculoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!response.ok) throw new Error("Error al cambiar estado");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      toast.success("Estado actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el estado");
    },
  });

  const vehiculos = data?.vehiculos || [];
  const totalVehiculos = vehiculos.length;
  const vehiculosActivos = vehiculos.filter(
    (v: ReturnType<typeof JSON.parse>) => v.estado === "activo"
  ).length;
  const capacidadTotal = vehiculos.reduce(
    (sum: number, v: ReturnType<typeof JSON.parse>) => sum + v.capacidadKg,
    0
  );
  const capacidadUsada = vehiculos.reduce(
    (sum: number, v: ReturnType<typeof JSON.parse>) => sum + v.pesoUsadoKg,
    0
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return (
          <Badge className="bg-white text-[#459e60] border-2 border-[#459e60] font-bold px-3 py-1 shadow-md">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        );
      case "mantenimiento":
        return (
          <Badge className="bg-gray-700 text-white border-0 font-bold px-3 py-1 shadow-md">
            <Wrench className="h-3 w-3 mr-1" />
            Mantenimiento
          </Badge>
        );
      case "inactivo":
        return (
          <Badge className="bg-gray-500 text-white border-0 font-bold px-3 py-1 shadow-md">
            <XCircle className="h-3 w-3 mr-1" />
            Inactivo
          </Badge>
        );
      default:
        return null;
    }
  };

  const _getBarraColor = (porcentaje: number) => {
    if (porcentaje >= 80) return "bg-red-500";
    if (porcentaje >= 50) return "bg-yellow-500";
    return "bg-[#459e60]";
  };

  const estadosDisponibles = [
    { value: "activo", label: "Activo", icon: CheckCircle, color: "#459e60" },
    { value: "mantenimiento", label: "Mantenimiento", icon: Wrench, color: "#6b7280" },
    { value: "inactivo", label: "Inactivo", icon: XCircle, color: "#9ca3af" },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Gestión de Vehículos" subtitle="Administre su flota de transporte">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border)] border-t-[var(--primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--muted-foreground)] font-medium">Cargando vehículos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Gestión de Vehículos" subtitle="Administre su flota de transporte">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">
                Error al cargar vehículos. Por favor, intente nuevamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Gestión de Vehículos"
      subtitle="Administre su flota de transporte - Sistema REP Chile"
    >
      <div className="space-y-6">
        {/* Estadísticas Generales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Vehículos */}
          <Card className="relative overflow-hidden border-2 border-[#459e60]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#f6fcf3] to-[#f0fdf4]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#459e60]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-xl shadow-lg">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-[#459e60] text-white border-0 font-bold px-3 py-1">
                  Flota
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  Total Vehículos
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">{totalVehiculos}</div>
                <p className="text-xs text-[#459e60] font-medium">{vehiculosActivos} activos</p>
              </div>
            </CardContent>
          </Card>

          {/* Capacidad Total */}
          <Card className="relative overflow-hidden border-2 border-[#4fa362]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#f0fdf4] to-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4fa362]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#4fa362] to-[#459e60] rounded-xl shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-[#4fa362] text-white border-0 font-bold px-3 py-1">
                  Capacidad
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  Capacidad Total
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">
                  {(capacidadTotal / 1000).toFixed(1)}
                </div>
                <p className="text-xs text-[#4fa362] font-medium">toneladas</p>
              </div>
            </CardContent>
          </Card>

          {/* Capacidad Usada */}
          <Card className="relative overflow-hidden border-2 border-[#f5792a]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#fef8f0] to-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f5792a]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#f5792a] to-[#f8a055] rounded-xl shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-[#f5792a] text-white border-0 font-bold px-3 py-1">
                  En Uso
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  Capacidad Usada
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">
                  {(capacidadUsada / 1000).toFixed(1)}
                </div>
                <p className="text-xs text-[#f5792a] font-medium">toneladas</p>
              </div>
            </CardContent>
          </Card>

          {/* Porcentaje de Uso */}
          <Card className="relative overflow-hidden border-2 border-[#44a15d]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-[#f6fcf3]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#44a15d]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#44a15d] to-[#4fa362] rounded-xl shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <Badge className="bg-[#44a15d] text-white border-0 font-bold px-3 py-1">
                  {Math.round((capacidadUsada / (capacidadTotal || 1)) * 100)}%
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 mb-2 uppercase tracking-wide">
                  Uso de Flota
                </p>
                <div className="text-4xl font-bold text-[#2b3b4c] mb-1">
                  {Math.round((capacidadUsada / (capacidadTotal || 1)) * 100)}%
                </div>
                <p className="text-xs text-[#44a15d] font-medium">ocupación general</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón Agregar Vehículo */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#2b3b4c] flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#459e60] to-[#4fa362] rounded-full"></div>
              Mi Flota de Vehículos
            </h2>
            <p className="text-sm text-[#2b3b4c]/60 mt-2 ml-7">
              Gestione los vehículos de su empresa y monitoree su capacidad
            </p>
          </div>
          <Button
            onClick={() => setModalNuevoVehiculoOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar Vehículo
          </Button>
        </div>

        {/* Lista de Vehículos */}
        {vehiculos.length === 0 ? (
          <Card className="border-2 border-dashed border-[#459e60]/30">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#459e60]/10 to-[#4fa362]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-10 w-10 text-[#459e60]" />
              </div>
              <h3 className="text-xl font-bold text-[#2b3b4c] mb-2">
                No hay vehículos registrados
              </h3>
              <p className="text-[#2b3b4c]/60 mb-6">
                Agregue su primer vehículo para comenzar a gestionar su flota
              </p>
              <Button
                onClick={() => setModalNuevoVehiculoOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Primer Vehículo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {vehiculos.map((vehiculo: ReturnType<typeof JSON.parse>) => (
              <Card
                key={vehiculo.id}
                className="relative overflow-hidden border-2 border-[#459e60]/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{vehiculo.patente}</h3>
                        <p className="text-sm text-white/80">{vehiculo.tipo}</p>
                      </div>
                    </div>
                    {getEstadoBadge(vehiculo.estado)}
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Capacidad */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 text-sm">Capacidad</span>
                      <span className="font-bold text-gray-900 text-sm">
                        {vehiculo.pesoUsadoKg} / {vehiculo.capacidadKg} kg
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-gray-200">
                      <div
                        className="h-full bg-[#459e60] transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(vehiculo.porcentajeUso, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 text-center font-medium">
                      {vehiculo.porcentajeUso}% utilizado
                    </p>
                  </div>

                  {/* Solicitudes Activas */}
                  <div className="flex items-center justify-between p-3 bg-[#f6fcf3] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-[#459e60]" />
                      <span className="text-sm font-semibold text-[#2b3b4c]">
                        Solicitudes Activas
                      </span>
                    </div>
                    <Badge className="bg-[#459e60] text-white border-0 font-bold">
                      {vehiculo.solicitudesActivas}
                    </Badge>
                  </div>

                  {/* Cambiar Estado */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      Estado del Vehículo
                    </p>
                    <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-2">
                      {estadosDisponibles.map((est: ReturnType<typeof JSON.parse>) => {
                        const isActive = vehiculo.estado === est.value;

                        return (
                          <Button
                            key={est.value}
                            onClick={() =>
                              cambiarEstadoMutation.mutate({
                                vehiculoId: vehiculo.id,
                                nuevoEstado: est.value,
                              })
                            }
                            disabled={
                              vehiculo.estado === est.value || cambiarEstadoMutation.isPending
                            }
                            size="sm"
                            className={`w-full sm:flex-1 md:w-full xl:w-auto xl:flex-1 font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-[#2d5a3d] text-white border-2 border-[#2d5a3d] shadow-md"
                                : "bg-white text-gray-700 border-2 border-gray-400 hover:bg-gray-100 hover:border-gray-500"
                            }`}
                          >
                            <est.icon className="h-4 w-4 mr-1" />
                            {est.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/transportista/vehiculos/${vehiculo.id}`)
                      }
                      className="flex-1 bg-[#459e60] hover:bg-[#3d8b53] text-white font-bold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => setVehiculoAEliminar(vehiculo.id)}
                      className={`flex-1 font-bold shadow-md hover:shadow-lg transition-all duration-200 ${
                        vehiculo.solicitudesActivas > 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-800 text-white"
                      }`}
                      disabled={vehiculo.solicitudesActivas > 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>

                  {vehiculo.solicitudesActivas > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-red-700 text-center flex items-center justify-center gap-2 font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        No se puede eliminar mientras tenga solicitudes activas
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {vehiculoAEliminar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full shadow-2xl border-2 border-gray-200">
            <CardContent className="p-6 bg-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-100 rounded-full shadow-md">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar Vehículo?</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Esta acción no se puede deshacer. El vehículo será eliminado permanentemente de
                    su flota.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setVehiculoAEliminar(null)}
                  className="flex-1 bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={eliminarMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => eliminarMutation.mutate(vehiculoAEliminar)}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={eliminarMutation.isPending}
                >
                  {eliminarMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Eliminando...
                    </div>
                  ) : (
                    "Eliminar"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Nuevo Vehículo */}
      <ModalNuevoVehiculo
        isOpen={modalNuevoVehiculoOpen}
        onClose={() => setModalNuevoVehiculoOpen(false)}
      />
    </DashboardLayout>
  );
}
