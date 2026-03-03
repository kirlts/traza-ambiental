"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { use } from "react";

interface RutaSolicitud {
  id: string;
  completada: boolean;
  solicitud: {
    folio: string;
    generador: {
      name: string;
    };
    direccionRetiro: string;
    comuna: string;
  };
}

interface Ruta {
  id: string;
  nombre: string;
  estado: string;
  fechaPlanificada: string | Date;
  vehiculo?: {
    patente: string;
    tipo: string;
  };
  pesoTotal: number;
  solicitudesCompletadas: number;
  totalSolicitudes: number;
  porcentajeCompletado: number;
  solicitudes: RutaSolicitud[];
}

export default function DetalleRutaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Obtener ruta específica
  const {
    data: ruta,
    isLoading,
    error,
  } = useQuery<Ruta>({
    queryKey: ["ruta", id],
    queryFn: async () => {
      const response = await fetch(`/api/transportista/rutas/${id}`);
      if (!response.ok) throw new Error("Error cargando ruta");
      return response.json();
    },
    enabled: !!id,
  });

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
            <Truck className="h-3 w-3 mr-1" />
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
      <DashboardLayout title="Detalle de Ruta" subtitle="Cargando información de la ruta">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando ruta...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !ruta) {
    return (
      <DashboardLayout title="Detalle de Ruta" subtitle="Ruta no encontrada">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-[#459e60] hover:text-[#44a15d] font-semibold"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Rutas
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">No se encontró la ruta solicitada.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Ruta: ${ruta.nombre}`} subtitle={`Detalles y seguimiento de la ruta`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-[#459e60] hover:text-[#44a15d] font-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a Rutas
        </Button>

        <Card className="border-2 border-[#459e60]/20 shadow-xl">
          <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{ruta.nombre}</h2>
                  {ruta.vehiculo && (
                    <p className="text-sm text-white/80">
                      <Truck className="h-4 w-4 inline mr-1" />
                      {ruta.vehiculo.patente} - {ruta.vehiculo.tipo}
                    </p>
                  )}
                </div>
              </div>
              {getEstadoBadge(ruta.estado)}
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-[#2b3b4c]">
              <Calendar className="h-5 w-5 text-[#459e60]" />
              <span className="font-semibold">Fecha planificada:</span>
              <span>
                {format(new Date(ruta.fechaPlanificada), "dd 'de' MMMM yyyy", { locale: es })}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#2b3b4c]">
                  Progreso: {ruta.solicitudesCompletadas} / {ruta.totalSolicitudes} solicitudes
                </span>
                <span className="font-bold text-[#459e60] text-xl">
                  {ruta.porcentajeCompletado}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-full bg-gradient-to-r from-[#459e60] to-[#4fa362] rounded-full transition-all duration-500"
                  style={{ width: `${ruta.porcentajeCompletado}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[#f6fcf3] rounded-lg">
                <p className="text-sm font-semibold text-[#2b3b4c]/70">Solicitudes</p>
                <p className="text-2xl font-bold text-[#2b3b4c]">{ruta.totalSolicitudes}</p>
              </div>
              <div className="p-4 bg-[#f6fcf3] rounded-lg">
                <p className="text-sm font-semibold text-[#2b3b4c]/70">Peso Total</p>
                <p className="text-2xl font-bold text-[#2b3b4c]">
                  {(ruta.pesoTotal / 1000).toFixed(1)} t
                </p>
              </div>
              <div className="p-4 bg-[#f6fcf3] rounded-lg">
                <p className="text-sm font-semibold text-[#2b3b4c]/70">Completadas</p>
                <p className="text-2xl font-bold text-[#2b3b4c]">{ruta.solicitudesCompletadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#459e60]/20 shadow-xl">
          <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6 text-white font-bold text-xl">
            Lista de Solicitudes ({ruta.solicitudes.length})
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {ruta.solicitudes.map((rutaSolicitud, index) => (
                <Card
                  key={rutaSolicitud.id}
                  className={`border-2 ${rutaSolicitud.completada ? "border-[#459e60] bg-[#f6fcf3]" : "border-[#459e60]/20"}`}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#459e60] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold">Folio: {rutaSolicitud.solicitud.folio}</h4>
                        <Badge
                          className={rutaSolicitud.completada ? "bg-[#459e60]" : "bg-gray-400"}
                        >
                          {rutaSolicitud.completada ? "Completada" : "Pendiente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Building2 className="h-4 w-4" /> {rutaSolicitud.solicitud.generador.name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" /> {rutaSolicitud.solicitud.direccionRetiro},{" "}
                        {rutaSolicitud.solicitud.comuna}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
