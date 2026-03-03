"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  User,
  Truck,
  Weight,
  MapPin,
  Calendar,
  Award,
  Download,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface RecepcionDetalle {
  id: string;
  folio: string;
  estado: string;
  fechaRecepcionPlanta: string;
  createdAt: string;
  fechaPreferida: string | null;
  direccionRetiro: string;
  comuna: string;
  region: string;
  cantidadTotal: number;
  pesoTotalEstimado: number;
  categoriaA_cantidad: number;
  categoriaB_cantidad: number;
  pesoReal: number | null;
  cantidadReal: number | null;
  categoriaVerificada: string[];
  generador: {
    name: string;
    email: string;
    rut: string | null;
  };
  transportista: {
    name: string;
    email: string;
  } | null;
  vehiculo: {
    patente: string;
    tipo: string;
  } | null;
  historialEstados: Array<{
    id: string;
    estadoAnterior: string;
    estadoNuevo: string;
    fecha: string;
    usuario: {
      name: string;
      email: string;
    } | null;
  }>;
}

interface Certificado {
  id: string;
  folio: string;
  pdfUrl: string;
  fechaEmision: string;
  estado: string;
}

const formatearFecha = (fecha: ReturnType<typeof JSON.parse>): string => {
  if (!fecha) return "Fecha no disponible";
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return "Fecha no disponible";
    return format(date, "PPP 'a las' HH:mm", { locale: es });
  } catch {
    return "Fecha no disponible";
  }
};

export default function DetalleRecepcionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const _router = useRouter();

  // Obtener detalles de la solicitud
  const {
    data: solicitudData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["solicitud-detalle", id],
    queryFn: async () => {
      const response = await fetch(`/api/solicitudes/${id}`);
      if (!response.ok) {
        throw new Error("Error al cargar los detalles de la recepción");
      }
      const result = await response.json();
      return result.data as RecepcionDetalle;
    },
  });

  // Obtener certificado si existe
  const { data: certificadoData, isLoading: isLoadingCertificado } = useQuery({
    queryKey: ["certificado-recepcion", id],
    queryFn: async (): Promise<Certificado | null> => {
      try {
        const response = await fetch(`/api/gestor/certificados?solicitudId=${id}&limit=1`);
        if (!response.ok) {
          return null;
        }
        const result = await response.json();
        const certificado = result.certificados?.[0];

        if (certificado) {
        } else {
        }

        return certificado || null;
      } catch (error: unknown) {
        console.error("❌ Error en query de certificado:", error);
        return null;
      }
    },
    enabled: !!id && !!solicitudData,
    initialData: null,
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Cargando..." subtitle="Obteniendo detalles de la recepción">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#459e60]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !solicitudData) {
    return (
      <DashboardLayout title="Error" subtitle="No se pudo cargar la recepción">
        <Card className="border-2 border-red-200">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">
              {error instanceof Error
                ? (error as ReturnType<typeof JSON.parse>).message
                : "Error desconocido"}
            </p>
            <Link href="/dashboard/gestor/recepciones/completadas">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Recepciones Completadas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const solicitud = solicitudData;
  const certificado = certificadoData;

  // Determinar categoría
  let categoriaTexto = "N/A";
  if (solicitud.categoriaA_cantidad > 0 && solicitud.categoriaB_cantidad > 0) {
    categoriaTexto = "A y B - Neumáticos de vehículo liviano y pesado";
  } else if (solicitud.categoriaA_cantidad > 0) {
    categoriaTexto = "A - Neumáticos de vehículo liviano";
  } else if (solicitud.categoriaB_cantidad > 0) {
    categoriaTexto = "B - Neumáticos de vehículo pesado";
  }

  return (
    <DashboardLayout
      title={`Recepción ${solicitud.folio}`}
      subtitle="Detalles de la recepción validada"
      actions={
        <Link href="/dashboard/gestor/recepciones/completadas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        {/* Header compacto con estado */}
        <Card className="border-2 border-[#459e60]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#44a15d] to-[#4fa362] rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2b3b4c]">Recepción Validada</h3>
                  <p className="text-xs text-[#2b3b4c]/70">
                    {formatearFecha(solicitud.fechaRecepcionPlanta)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-[#44a15d] text-white border-0 text-xs px-3 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validada
                </Badge>
                {certificado && (
                  <Badge className="bg-[#459e60] text-white border-0 text-xs px-3 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    Certificado
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de 2 columnas para información principal */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Generador */}
          <Card className="border border-[#459e60]/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-[#459e60]" />
                <h4 className="text-sm font-bold text-[#2b3b4c]">Generador</h4>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-[#2b3b4c]">{solicitud.generador.name}</p>
                <p className="text-xs text-[#2b3b4c]/70">{solicitud.generador.email}</p>
                {solicitud.generador.rut && (
                  <p className="text-xs text-[#2b3b4c]/70">RUT: {solicitud.generador.rut}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transportista */}
          {solicitud.transportista && (
            <Card className="border border-[#459e60]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-[#4fa362]" />
                  <h4 className="text-sm font-bold text-[#2b3b4c]">Transportista</h4>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-[#2b3b4c]">
                    {solicitud.transportista.name}
                  </p>
                  <p className="text-xs text-[#2b3b4c]/70">{solicitud.transportista.email}</p>
                  {solicitud.vehiculo && (
                    <p className="text-xs text-[#4fa362] font-medium mt-1">
                      {solicitud.vehiculo.patente} - {solicitud.vehiculo.tipo}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Datos Validados - Grid compacto */}
        <Card className="border border-[#459e60]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Weight className="h-4 w-4 text-[#459e60]" />
              <h4 className="text-sm font-bold text-[#2b3b4c]">Datos Validados</h4>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-[#f6fcf3] p-3 rounded-lg">
                <p className="text-xs font-semibold text-[#2b3b4c]/70 mb-1">Peso</p>
                <p className="text-base font-bold text-[#2b3b4c]">
                  {solicitud.pesoReal?.toLocaleString("es-CL") || "N/A"} kg
                </p>
                {solicitud.pesoTotalEstimado && (
                  <p className="text-xs text-[#2b3b4c]/50 mt-0.5">
                    Est: {solicitud.pesoTotalEstimado.toLocaleString("es-CL")} kg
                  </p>
                )}
              </div>
              <div className="bg-[#f6fcf3] p-3 rounded-lg">
                <p className="text-xs font-semibold text-[#2b3b4c]/70 mb-1">Cantidad</p>
                <p className="text-base font-bold text-[#2b3b4c]">
                  {solicitud.cantidadReal?.toLocaleString("es-CL") || "N/A"}
                </p>
                {solicitud.cantidadTotal && (
                  <p className="text-xs text-[#2b3b4c]/50 mt-0.5">
                    Est: {solicitud.cantidadTotal.toLocaleString("es-CL")}
                  </p>
                )}
              </div>
              <div className="bg-[#f6fcf3] p-3 rounded-lg">
                <p className="text-xs font-semibold text-[#2b3b4c]/70 mb-1">Categoría</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {solicitud.categoriaVerificada && solicitud.categoriaVerificada.length > 0 ? (
                    solicitud.categoriaVerificada.map(
                      (cat: ReturnType<typeof JSON.parse>, idx: ReturnType<typeof JSON.parse>) => (
                        <Badge
                          key={idx}
                          className="bg-[#459e60]/10 text-[#459e60] border-0 text-xs px-2 py-0"
                        >
                          {cat}
                        </Badge>
                      )
                    )
                  ) : (
                    <p className="text-xs text-[#2b3b4c]/50">N/A</p>
                  )}
                </div>
                <p className="text-xs text-[#2b3b4c]/70 mt-1 line-clamp-2">{categoriaTexto}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de 2 columnas para Ubicación y Certificado */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Ubicación */}
          <Card className="border border-[#459e60]/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-[#459e60]" />
                <h4 className="text-sm font-bold text-[#2b3b4c]">Ubicación</h4>
              </div>
              <p className="font-semibold text-sm text-[#2b3b4c]">{solicitud.direccionRetiro}</p>
              <p className="text-xs text-[#2b3b4c]/70 mt-1">
                {solicitud.comuna}, {solicitud.region}
              </p>
            </CardContent>
          </Card>

          {/* Certificado */}
          {isLoadingCertificado ? (
            <Card className="border border-[#459e60]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-[#459e60]" />
                  <h4 className="text-sm font-bold text-[#2b3b4c]">Certificado</h4>
                </div>
                <p className="text-xs text-[#2b3b4c]/50">Verificando...</p>
              </CardContent>
            </Card>
          ) : certificado ? (
            <Card className="border-2 border-[#459e60]/20 bg-gradient-to-br from-white to-[#f6fcf3]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-[#459e60]" />
                  <h4 className="text-sm font-bold text-[#2b3b4c]">Certificado</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-[#2b3b4c]/70 mb-0.5">Folio</p>
                    <p className="text-sm font-bold text-[#2b3b4c]">{certificado.folio}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2b3b4c]/70 mb-0.5">Fecha</p>
                    <p className="text-xs text-[#2b3b4c]">
                      {format(new Date(certificado.fechaEmision), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                  <Link href={certificado.pdfUrl} target="_blank" className="block">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#44a15d] to-[#4fa362] hover:from-[#4fa362] hover:to-[#459e60] text-white w-full mt-2 text-xs"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Descargar PDF
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-[#459e60]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-[#459e60]" />
                  <h4 className="text-sm font-bold text-[#2b3b4c]">Certificado</h4>
                </div>
                <p className="text-xs text-[#2b3b4c]/70 mb-2">
                  {solicitud.estado === "TRATADA"
                    ? "Aún no generado. Puedes generarlo desde Tratamientos."
                    : "Requiere tratamiento para generar certificado."}
                </p>
                {solicitud.estado === "TRATADA" && (
                  <Link href="/dashboard/gestor/tratamientos">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white"
                    >
                      Ir a Tratamientos
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Historial de Estados - Compacto */}
        {solicitud.historialEstados && solicitud.historialEstados.length > 0 && (
          <Card className="border border-[#459e60]/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-[#459e60]" />
                <h4 className="text-sm font-bold text-[#2b3b4c]">Historial de Estados</h4>
              </div>
              <div className="space-y-2">
                {solicitud.historialEstados
                  .slice(0, 5)
                  .map((cambio, idx: ReturnType<typeof JSON.parse>) => (
                    <div
                      key={cambio.id}
                      className="flex gap-3 pb-2 border-b border-[#459e60]/10 last:border-0"
                    >
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-2 h-2 rounded-full bg-[#459e60]"></div>
                        {idx < Math.min(solicitud.historialEstados.length, 5) - 1 && (
                          <div className="w-0.5 h-full bg-[#459e60]/30 mt-1 min-h-[20px]"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-xs text-[#2b3b4c] truncate">
                            {cambio.estadoAnterior} → {cambio.estadoNuevo}
                          </p>
                          <p className="text-xs text-[#2b3b4c]/50 whitespace-nowrap">
                            {format(new Date(cambio.fecha), "dd/MM/yy HH:mm", { locale: es })}
                          </p>
                        </div>
                        {cambio.usuario && (
                          <p className="text-xs text-[#2b3b4c]/60 truncate mt-0.5">
                            {cambio.usuario.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                {solicitud.historialEstados.length > 5 && (
                  <p className="text-xs text-[#2b3b4c]/50 text-center pt-1">
                    + {solicitud.historialEstados.length - 5} cambios más
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
