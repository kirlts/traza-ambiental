"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Truck, CheckCircle, Clock, Calendar, Package, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

import { FormularioEntregaGestor } from "@/components/transportista/FormularioEntregaGestor";

interface SolicitudEntrega {
  id: string;
  folio: string;
  estado: string;
  fechaRecoleccion: string | null;
  pesoReal: number | null;
  cantidadReal: number | null;
  pesoTotalEstimado: number;
  cantidadTotal: number;
  generador: {
    name: string;
    email: string;
    rut: string;
  };
  vehiculo: {
    patente: string;
    tipo: string;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function EntregasPage() {
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudEntrega | null>(null);
  const [isFormularioOpen, setIsFormularioOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["entregas-disponibles"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/entregas");
      if (!response.ok) throw new Error("Error al cargar entregas disponibles");
      return response.json() as Promise<{
        solicitudes: SolicitudEntrega[];
        pagination: PaginationData;
      }>;
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });

  const handleConfirmarEntrega = (solicitud: ReturnType<typeof JSON.parse>) => {
    setSelectedSolicitud(solicitud);
    setIsFormularioOpen(true);
  };

  const handleEntregaExitosa = () => {
    // Refrescar datos y cerrar modal
    queryClient.invalidateQueries({ queryKey: ["entregas-disponibles"] });
    setIsFormularioOpen(false);
    setSelectedSolicitud(null);
  };

  const handleCloseFormulario = () => {
    setIsFormularioOpen(false);
    setSelectedSolicitud(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Confirmar Entregas" subtitle="Cargando...">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#459e60]/20 border-t-[#459e60] mx-auto"></div>
            <p className="mt-4 text-[#2b3b4c]/60 font-medium">Cargando entregas disponibles...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Confirmar Entregas" subtitle="Error">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error al cargar las entregas</h2>
          <p className="text-red-600 mb-6">
            No se pudieron cargar las entregas disponibles. Intente nuevamente.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const solicitudes = data?.solicitudes || [];

  return (
    <DashboardLayout
      title="Confirmar Entregas"
      subtitle="Gestiona las entregas pendientes de confirmación al gestor"
      actions={
        <Badge className="bg-[#459e60]/10 text-[#459e60] border-2 border-[#459e60]/30 font-bold px-4 py-2 text-base">
          <Clock className="h-4 w-4 mr-2" />
          {solicitudes.length} pendientes
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Lista de solicitudes */}
        {solicitudes.length === 0 ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f0fdf4] border-2 border-[#4fa362]/20 rounded-xl p-12 text-center shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4fa362]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-[#4fa362] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#2b3b4c] mb-3">¡Todo al día!</h3>
              <p className="text-[#2b3b4c]/70 text-lg mb-2">
                No hay entregas pendientes de confirmación
              </p>
              <p className="text-[#2b3b4c]/60">
                Todas las entregas han sido confirmadas o no hay solicitudes recolectadas.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {solicitudes.map((solicitud: ReturnType<typeof JSON.parse>) => (
              <div
                key={solicitud.id}
                className="relative overflow-hidden bg-white border-2 border-[#459e60]/20 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Decoración */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#459e60]/10 to-transparent rounded-full -mr-12 -mt-12"></div>

                {/* Header */}
                <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{solicitud.folio}</h3>
                        <p className="text-sm text-white/90">Solicitud recolectada</p>
                      </div>
                    </div>
                    <Badge className="bg-[#f5792a] text-white border-0 font-bold px-4 py-2">
                      Pendiente entrega
                    </Badge>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                  {/* Información principal */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Generador */}
                    <div className="flex items-start gap-3 p-3 bg-[#f6fcf3] rounded-lg">
                      <Building2 className="h-5 w-5 text-[#459e60] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide mb-1">
                          Generador
                        </p>
                        <p className="text-sm font-bold text-[#2b3b4c] truncate">
                          {solicitud.generador.name}
                        </p>
                        <p className="text-xs text-[#2b3b4c]/70">RUT: {solicitud.generador.rut}</p>
                      </div>
                    </div>

                    {/* Vehículo */}
                    <div className="flex items-start gap-3 p-3 bg-[#f6fcf3] rounded-lg">
                      <Truck className="h-5 w-5 text-[#459e60] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide mb-1">
                          Vehículo
                        </p>
                        <p className="text-sm font-bold text-[#2b3b4c]">
                          {solicitud.vehiculo.patente}
                        </p>
                        <p className="text-xs text-[#2b3b4c]/70">{solicitud.vehiculo.tipo}</p>
                      </div>
                    </div>

                    {/* Fecha recolección */}
                    <div className="flex items-start gap-3 p-3 bg-[#f6fcf3] rounded-lg">
                      <Calendar className="h-5 w-5 text-[#459e60] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide mb-1">
                          Recolectado
                        </p>
                        <p className="text-sm font-bold text-[#2b3b4c]">
                          {solicitud.fechaRecoleccion
                            ? new Date(solicitud.fechaRecoleccion).toLocaleDateString("es-CL", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "No disponible"}
                        </p>
                        <p className="text-xs text-[#2b3b4c]/70">
                          {solicitud.fechaRecoleccion
                            ? new Date(solicitud.fechaRecoleccion).toLocaleTimeString("es-CL", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la carga */}
                  <div className="bg-gradient-to-br from-[#f6fcf3] to-white border-2 border-[#459e60]/10 p-5 rounded-xl">
                    <h4 className="text-sm font-bold text-[#2b3b4c] mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#459e60]" />
                      Detalles de la Carga
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Peso */}
                      <div className="space-y-2">
                        <div className="text-center p-2 bg-white rounded-lg border border-[#459e60]/20">
                          <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide mb-1">
                            Peso Real
                          </p>
                          <p className="text-xl font-bold text-[#459e60]">
                            {solicitud.pesoReal || "—"}
                          </p>
                          <p className="text-[10px] text-[#2b3b4c]/70">kilogramos</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide mb-1">
                            Peso Declarado
                          </p>
                          <p className="text-lg font-bold text-[#2b3b4c]/80">
                            {solicitud.pesoTotalEstimado || "—"}
                          </p>
                          <p className="text-[10px] text-[#2b3b4c]/70">kilogramos</p>
                        </div>
                      </div>

                      {/* Cantidad */}
                      <div className="space-y-2">
                        <div className="text-center p-2 bg-white rounded-lg border border-[#459e60]/20">
                          <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide mb-1">
                            Cantidad Real
                          </p>
                          <p className="text-xl font-bold text-[#459e60]">
                            {solicitud.cantidadReal || "—"}
                          </p>
                          <p className="text-[10px] text-[#2b3b4c]/70">unidades</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide mb-1">
                            Cant. Declarada
                          </p>
                          <p className="text-lg font-bold text-[#2b3b4c]/80">
                            {solicitud.cantidadTotal || "—"}
                          </p>
                          <p className="text-[10px] text-[#2b3b4c]/70">unidades</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acción */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleConfirmarEntrega(solicitud)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Confirmar Entrega a Gestor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulario de confirmación */}
        {selectedSolicitud && (
          <FormularioEntregaGestor
            isOpen={isFormularioOpen}
            onClose={handleCloseFormulario}
            solicitudId={selectedSolicitud.id}
            onEntregaExitosa={handleEntregaExitosa}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
