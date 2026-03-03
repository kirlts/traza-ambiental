"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, User, Calendar, MapPin, Clock, Weight, Hash } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Función auxiliar para formatear fechas de forma segura
const formatearFecha = (fecha: ReturnType<typeof JSON.parse>): string => {
  if (!fecha) return "Fecha no disponible";
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return "Fecha no disponible";
    return format(date, "PPP", { locale: es });
  } catch {
    return "Fecha no disponible";
  }
};

interface RecepcionPendiente {
  id: string;
  folio: string;
  fechaEntrega: Date;
  generador: {
    name: string;
    email: string;
  };
  transportista: {
    name: string;
    email: string;
  } | null;
  vehiculo: {
    patente: string;
    tipo: string;
  } | null;
  pesoDeclarado: number | null;
  cantidadDeclarada: number | null;
  categoriaDeclarada: string[];
  direccionRetiro: string;
  comuna: string;
}

export default function RecepcionesPendientesPage() {
  const {
    data: recepciones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recepciones-pendientes"],
    queryFn: async (): Promise<RecepcionPendiente[]> => {
      const response = await fetch("/api/gestor/recepciones-pendientes");
      if (!response.ok) {
        throw new Error("Error cargando recepciones pendientes");
      }
      const data = await response.json();
      return data.recepciones;
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  if (isLoading) {
    return (
      <DashboardLayout
        title="Recepciones Pendientes"
        subtitle="Cargando recepciones para validación..."
      >
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-2 border-[#459e60]/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-[#459e60]/10 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-[#459e60]/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-[#459e60]/10 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Recepciones Pendientes" subtitle="Error al cargar las recepciones">
        <Card className="border-2 border-red-500/20 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Error al cargar recepciones</h3>
            <p className="text-red-700">
              {error instanceof Error
                ? (error as ReturnType<typeof JSON.parse>).message
                : "Error desconocido"}
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Recepciones Pendientes"
      subtitle={`${recepciones?.length || 0} solicitud(es) entregada(s) requieren validación física`}
      actions={
        <Badge className="bg-[#f5792a] text-white border-0 font-bold px-4 py-2 text-base">
          {recepciones?.length || 0} Pendientes
        </Badge>
      }
    >
      {recepciones && recepciones.length === 0 ? (
        <Card className="border-2 border-[#459e60]/10 bg-gradient-to-br from-white to-[#f6fcf3]">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2b3b4c] mb-3">
              No hay recepciones pendientes
            </h3>
            <p className="text-[#2b3b4c]/70 mb-6 max-w-md mx-auto">
              Todas las entregas han sido validadas o no hay entregas recientes que requieran
              procesamiento.
            </p>
            <Link href="/dashboard/gestor">
              <Button className="bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#4fa362] text-white">
                Volver al Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recepciones?.map((recepcion: ReturnType<typeof JSON.parse>) => (
            <Card
              key={recepcion.id}
              className="relative overflow-hidden border-2 border-[#459e60]/20 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-white to-[#f6fcf3]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#459e60]/5 to-transparent rounded-full -mr-12 -mt-12"></div>

              <CardContent className="p-4 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#459e60]/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-lg shadow-sm">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#2b3b4c] flex items-center gap-2">
                        <Hash className="h-4 w-4 text-[#459e60]" />
                        {recepcion.folio}
                      </h3>
                      <p className="text-xs text-[#2b3b4c]/70 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3 text-[#459e60]" />
                        Entregado el {formatearFecha(recepcion.fechaEntrega)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#f5792a] text-white border-0 font-semibold px-3 py-1 text-xs">
                    <Clock className="h-3 w-3 mr-1.5" />
                    Pendiente Validación
                  </Badge>
                </div>

                {/* Content Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
                  {/* Generador */}
                  <div className="bg-white p-3 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-[#459e60]/10 rounded-md">
                        <User className="h-3.5 w-3.5 text-[#459e60]" />
                      </div>
                      <span className="text-xs font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Generador
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm text-[#2b3b4c]">
                        {recepcion.generador.name}
                      </p>
                      <p className="text-xs text-[#2b3b4c]/70">{recepcion.generador.email}</p>
                    </div>
                  </div>

                  {/* Transportista */}
                  <div className="bg-white p-3 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-[#44a15d]/10 rounded-md">
                        <Truck className="h-3.5 w-3.5 text-[#44a15d]" />
                      </div>
                      <span className="text-xs font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Transportista
                      </span>
                    </div>
                    {recepcion.transportista ? (
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm text-[#2b3b4c]">
                          {recepcion.transportista.name}
                        </p>
                        <p className="text-xs text-[#2b3b4c]/70">{recepcion.transportista.email}</p>
                        {recepcion.vehiculo && (
                          <p className="text-xs text-[#459e60] font-medium mt-1.5 flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {recepcion.vehiculo.patente} - {recepcion.vehiculo.tipo}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#2b3b4c]/50 italic">No asignado</p>
                    )}
                  </div>

                  {/* Datos Declarados */}
                  <div className="bg-white p-3 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-[#4fa362]/10 rounded-md">
                        <Weight className="h-3.5 w-3.5 text-[#4fa362]" />
                      </div>
                      <span className="text-xs font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Datos Declarados
                      </span>
                    </div>
                    <div className="space-y-1">
                      {recepcion.pesoDeclarado && (
                        <p className="text-xs text-[#2b3b4c]">
                          <span className="font-semibold">Peso:</span> {recepcion.pesoDeclarado} kg
                        </p>
                      )}
                      {recepcion.cantidadDeclarada && (
                        <p className="text-xs text-[#2b3b4c]">
                          <span className="font-semibold">Cantidad:</span>{" "}
                          {recepcion.cantidadDeclarada} unidades
                        </p>
                      )}
                      {recepcion.categoriaDeclarada.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {recepcion.categoriaDeclarada.map(
                            (
                              cat: ReturnType<typeof JSON.parse>,
                              idx: ReturnType<typeof JSON.parse>
                            ) => (
                              <Badge
                                key={idx}
                                className="bg-[#4fa362]/10 text-[#4fa362] border-0 text-xs px-1.5 py-0.5"
                              >
                                {cat}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="bg-[#f0fdf4] p-3 rounded-lg border border-[#459e60]/10 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <MapPin className="h-4 w-4 text-[#459e60]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#2b3b4c]/70 uppercase tracking-wide mb-0.5">
                        Ubicación de Retiro
                      </p>
                      <p className="font-semibold text-sm text-[#2b3b4c]">
                        {recepcion.direccionRetiro}, {recepcion.comuna}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-end">
                  <Link href={`/dashboard/gestor/recepciones/${recepcion.id}/validar`}>
                    <Button className="bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#4fa362] text-white font-semibold px-5 py-2 text-sm shadow-md hover:shadow-lg transition-all">
                      <Package className="h-4 w-4 mr-2" />
                      Validar Recepción
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
