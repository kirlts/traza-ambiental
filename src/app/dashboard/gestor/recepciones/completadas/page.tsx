"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  Package,
  Truck,
  User,
  FileText,
  Hash,
  Weight,
  MapPin,
} from "lucide-react";
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

export default function RecepcionesCompletadasPage() {
  // Obtener recepciones completadas (estado: RECIBIDA_PLANTA)
  const { data: recepcionesCompletadas, isLoading } = useQuery({
    queryKey: ["gestor-recepciones-completadas"],
    queryFn: async () => {
      const response = await fetch("/api/gestor/recepciones-completadas");
      if (!response.ok) {
        throw new Error("Error cargando recepciones completadas");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout
        title="Historial de Recepciones"
        subtitle="Cargando recepciones validadas..."
      >
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-2 border-[#44a15d]/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-[#44a15d]/10 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-[#44a15d]/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-[#44a15d]/10 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const recepciones = recepcionesCompletadas?.recepciones || [];

  return (
    <DashboardLayout
      title="Historial de Recepciones"
      subtitle={`${recepciones.length} recepción(es) validada(s) y procesada(s) correctamente`}
      actions={
        <Badge className="bg-[#44a15d] text-white border-0 font-bold px-4 py-2 text-base">
          {recepciones.length} Completadas
        </Badge>
      }
    >
      {recepciones.length === 0 ? (
        <Card className="border-2 border-[#44a15d]/10 bg-gradient-to-br from-white to-[#f6fcf3]">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#44a15d] to-[#4fa362] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2b3b4c] mb-3">
              No hay recepciones completadas
            </h3>
            <p className="text-[#2b3b4c]/70 mb-6 max-w-md mx-auto">
              Aún no se han validado recepciones o el historial está vacío.
            </p>
            <Link href="/dashboard/gestor">
              <Button className="bg-gradient-to-r from-[#44a15d] to-[#4fa362] hover:from-[#4fa362] hover:to-[#459e60] text-white">
                Volver al Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {recepciones.map((recepcion: ReturnType<typeof JSON.parse>) => (
            <Card
              key={recepcion.id}
              className="relative overflow-hidden border-2 border-[#44a15d]/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#f6fcf3]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#44a15d]/5 to-transparent rounded-full -mr-16 -mt-16"></div>

              <CardContent className="p-6 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-[#44a15d]/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#44a15d] to-[#4fa362] rounded-xl shadow-md">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2b3b4c] flex items-center gap-2">
                        <Hash className="h-5 w-5 text-[#44a15d]" />
                        {recepcion.solicitud?.folio || "N/A"}
                      </h3>
                      <p className="text-sm text-[#2b3b4c]/70 flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-[#44a15d]" />
                        Validado el{" "}
                        {formatearFecha(recepcion.fechaValidacion || recepcion.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className="bg-[#44a15d] text-white border-0 font-bold px-4 py-1">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Validada
                    </Badge>
                    {recepcion.certificadoGenerado && (
                      <Badge className="bg-[#459e60] text-white border-0 font-medium px-4 py-1">
                        <FileText className="h-3 w-3 mr-2" />
                        Certificado
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  {/* Generador */}
                  <div className="bg-white p-4 rounded-lg border border-[#44a15d]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#44a15d]/10 rounded-lg">
                        <User className="h-4 w-4 text-[#44a15d]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Generador
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-[#2b3b4c]">
                        {recepcion.solicitud?.generador?.name || "N/A"}
                      </p>
                      <p className="text-sm text-[#2b3b4c]/70">
                        {recepcion.solicitud?.generador?.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* Transportista */}
                  <div className="bg-white p-4 rounded-lg border border-[#44a15d]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#4fa362]/10 rounded-lg">
                        <Truck className="h-4 w-4 text-[#4fa362]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Transportista
                      </span>
                    </div>
                    {recepcion.solicitud?.transportista ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-[#2b3b4c]">
                          {recepcion.solicitud.transportista.name}
                        </p>
                        <p className="text-sm text-[#2b3b4c]/70">
                          {recepcion.solicitud.transportista.email}
                        </p>
                        {recepcion.solicitud.vehiculo && (
                          <p className="text-xs text-[#4fa362] font-medium mt-2 flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {recepcion.solicitud.vehiculo.patente}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-[#2b3b4c]/50 italic">No asignado</p>
                    )}
                  </div>

                  {/* Datos Validados */}
                  <div className="bg-white p-4 rounded-lg border border-[#44a15d]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#459e60]/10 rounded-lg">
                        <Weight className="h-4 w-4 text-[#459e60]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Datos Validados
                      </span>
                    </div>
                    <div className="space-y-2">
                      {recepcion.pesoValidado && (
                        <p className="text-sm text-[#2b3b4c]">
                          <span className="font-semibold">Peso:</span> {recepcion.pesoValidado} kg
                        </p>
                      )}
                      {recepcion.cantidadValidada && (
                        <p className="text-sm text-[#2b3b4c]">
                          <span className="font-semibold">Cantidad:</span>{" "}
                          {recepcion.cantidadValidada} unidades
                        </p>
                      )}
                      {recepcion.categoriaValidada && recepcion.categoriaValidada.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {recepcion.categoriaValidada.map((cat: string, idx: number) => (
                            <Badge
                              key={idx}
                              className="bg-[#459e60]/10 text-[#459e60] border-0 text-xs"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                {recepcion.solicitud?.direccionRetiro && (
                  <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#44a15d]/10 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MapPin className="h-5 w-5 text-[#44a15d]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#2b3b4c]/70 uppercase tracking-wide mb-1">
                          Ubicación de Retiro
                        </p>
                        <p className="font-semibold text-[#2b3b4c]">
                          {recepcion.solicitud.direccionRetiro}, {recepcion.solicitud.comuna}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Observaciones */}
                {recepcion.observaciones && (
                  <div className="bg-[#f6fcf3] p-4 rounded-lg border border-[#44a15d]/10 mb-6">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-[#44a15d] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#2b3b4c]/70 uppercase tracking-wide mb-2">
                          Observaciones de Validación
                        </p>
                        <p className="text-sm text-[#2b3b4c]">{recepcion.observaciones}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end gap-3">
                  {recepcion.certificadoGenerado && recepcion.certificadoUrl && (
                    <Link href={recepcion.certificadoUrl} target="_blank">
                      <Button
                        variant="outline"
                        className="border-2 border-[#44a15d] text-[#44a15d] hover:bg-[#44a15d] hover:text-white font-bold px-6 py-3"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Ver Certificado
                      </Button>
                    </Link>
                  )}
                  <Link href={`/dashboard/gestor/recepciones/${recepcion.id}/detalle`}>
                    <Button className="bg-gradient-to-r from-[#44a15d] to-[#4fa362] hover:from-[#4fa362] hover:to-[#459e60] text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all">
                      <Package className="h-5 w-5 mr-2" />
                      Ver Detalles
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
