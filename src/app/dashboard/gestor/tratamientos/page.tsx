"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  Package,
  Truck,
  Factory,
  Plus,
  Hash,
  Weight,
  FileText,
  MapPin,
  Clock,
  Award,
  Loader2,
  Lock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

export default function TratamientosPage() {
  const [tabActiva, setTabActiva] = useState<"pendientes" | "asignados">("pendientes");
  const queryClient = useQueryClient();
  const [generandoCertificado, setGenerandoCertificado] = useState<string | null>(null);

  // Estados para Modal de Certificación (HU-032)
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [certFormData, setCertFormData] = useState({ destino: "", productoFinal: "" });

  // Query para verificar estado legal
  const { data: legalProfile } = useQuery({
    queryKey: ["legal-profile-status"],
    queryFn: async () => {
      const res = await fetch("/api/gestor/validacion-legal");
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  const isLegalProfileVerified = legalProfile?.status === "VERIFICADO";

  // Obtener lotes pendientes de tratamiento (estado: RECIBIDA_PLANTA)
  const { data: lotesPendientes, isLoading: isLoadingPendientes } = useQuery({
    queryKey: ["gestor-lotes-pendientes-tratamiento"],
    queryFn: async () => {
      const response = await fetch("/api/gestor/lotes-pendientes-tratamiento");
      if (!response.ok) {
        throw new Error("Error cargando lotes pendientes de tratamiento");
      }
      return response.json();
    },
  });

  // Obtener tratamientos asignados (estado: TRATADA)
  const { data: tratamientosAsignados, isLoading: isLoadingAsignados } = useQuery({
    queryKey: ["gestor-tratamientos-asignados"],
    queryFn: async () => {
      const response = await fetch("/api/gestor/tratamientos-asignados");
      if (!response.ok) {
        throw new Error("Error cargando tratamientos asignados");
      }
      return response.json();
    },
  });

  // Verificar si ya existe certificado para cada tratamiento
  const { data: certificadosData } = useQuery({
    queryKey: ["certificados-gestor-verificacion"],
    queryFn: async () => {
      const response = await fetch("/api/gestor/certificados?limit=1000");
      if (!response.ok) {
        return { certificados: [] };
      }
      return response.json();
    },
    enabled: tabActiva === "asignados" && tratamientosAsignados?.tratamientos?.length > 0,
  });

  // Crear mapa de certificados por solicitudId para verificación rápida
  const certificadosPorSolicitud = new Map(
    certificadosData?.certificados
      ?.map((cert: ReturnType<typeof JSON.parse>) => {
        const solicitudId = cert.solicitudId || cert.solicitud?.id;
        return solicitudId ? [solicitudId, cert] : null;
      })
      .filter(Boolean) || []
  );

  // Mutation para generar certificado
  const generarCertificadoMutation = useMutation({
    mutationFn: async (vars: { solicitudId: string; destino: string; productoFinal: string }) => {
      const response = await fetch(`/api/lotes/${vars.solicitudId}/generar-certificado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destino: vars.destino,
          productoFinal: vars.productoFinal,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Error al generar certificado";
        let errorDetails = "";

        try {
          const error = await response.json();
          errorMessage =
            (error as ReturnType<typeof JSON.parse>).error ||
            (error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : String(error)) ||
            errorMessage;
          errorDetails = (error as ReturnType<typeof JSON.parse>).details || "";
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        // Construir mensaje completo
        const fullMessage = errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage;

        throw new Error(fullMessage);
      }

      return response.json();
    },
    onSuccess: (data: ReturnType<typeof JSON.parse>, _vars) => {
      toast.success("Certificado generado exitosamente", {
        description: `El certificado ${data.certificado?.folio || ""} ha sido generado correctamente.`,
      });

      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["gestor-tratamientos-asignados"] });
      queryClient.invalidateQueries({ queryKey: ["certificados-gestor"] });
      queryClient.invalidateQueries({ queryKey: ["certificados-gestor-verificacion"] });
      queryClient.invalidateQueries({ queryKey: ["certificado-recepcion"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-recepciones-completadas"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-recepciones-completadas-stats"] });

      setGenerandoCertificado(null);
    },
    onError: (error: unknown) => {
      console.error("❌ Error generando certificado:", error);
      toast.error("Error al generar certificado", {
        description:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Ocurrió un error al intentar generar el certificado.",
        duration: 10000, // Mostrar por más tiempo
      });
      setGenerandoCertificado(null);
    },
  });

  const handleOpenCertModal = (solicitudId: string) => {
    setSelectedLoteId(solicitudId);
    setCertFormData({ destino: "", productoFinal: "" });
    setCertModalOpen(true);
  };

  const handleConfirmGenerate = () => {
    if (!selectedLoteId) return;

    if (!certFormData.destino.trim()) {
      toast.error("El destino del material es obligatorio");
      return;
    }

    setCertModalOpen(false);
    setGenerandoCertificado(selectedLoteId);

    generarCertificadoMutation.mutate({
      solicitudId: selectedLoteId,
      ...certFormData,
    });
  };

  const isLoading = tabActiva === "pendientes" ? isLoadingPendientes : isLoadingAsignados;
  const lotes = lotesPendientes?.lotes || [];
  const tratamientos = tratamientosAsignados?.tratamientos || [];

  if (isLoading) {
    return (
      <DashboardLayout title="Gestión de Tratamientos" subtitle="Cargando...">
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-2 border-[#4fa362]/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-[#4fa362]/10 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-[#4fa362]/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-[#4fa362]/10 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Gestión de Tratamientos"
      subtitle={
        tabActiva === "pendientes"
          ? `${lotes.length} lote(s) validado(s) listo(s) para asignar tratamiento`
          : `${tratamientos.length} tratamiento(s) asignado(s)`
      }
      actions={
        <div className="flex gap-2">
          <Badge
            className={`${tabActiva === "pendientes" ? "bg-[#4fa362]" : "bg-gray-400"} text-white border-0 font-bold px-4 py-2 text-base`}
          >
            {lotes.length} Pendientes
          </Badge>
          <Badge
            className={`${tabActiva === "asignados" ? "bg-[#459e60]" : "bg-gray-400"} text-white border-0 font-bold px-4 py-2 text-base`}
          >
            {tratamientos.length} Asignados
          </Badge>
        </div>
      }
    >
      {/* Alerta de Perfil Legal */}
      {legalProfile && !isLegalProfileVerified && (
        <Alert
          variant="destructive"
          className="mb-6 border-l-4 border-l-red-600 shadow-sm bg-red-50"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-red-900 font-bold flex items-center gap-2">
            Emisión de Certificados Bloqueada
          </AlertTitle>
          <AlertDescription className="mt-2 text-red-800">
            <p className="mb-2">
              Tu perfil legal se encuentra en estado{" "}
              <strong>{legalProfile.status?.replace("_", " ") || "PENDIENTE"}</strong>. Para poder
              emitir certificados de valorización, debes completar tu validación legal y ser
              aprobado por un administrador.
            </p>
            <Link href="/dashboard/gestor/validacion-legal">
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 bg-white mt-1 h-8 text-xs font-semibold"
              >
                Ir a Validación Legal
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b-2 border-[#459e60]/20">
        <button
          onClick={() => setTabActiva("pendientes")}
          className={`px-6 py-3 font-bold text-lg transition-all ${
            tabActiva === "pendientes"
              ? "text-[#459e60] border-b-4 border-[#459e60]"
              : "text-gray-500 hover:text-[#459e60]"
          }`}
        >
          Pendientes ({lotes.length})
        </button>
        <button
          onClick={() => setTabActiva("asignados")}
          className={`px-6 py-3 font-bold text-lg transition-all ${
            tabActiva === "asignados"
              ? "text-[#459e60] border-b-4 border-[#459e60]"
              : "text-gray-500 hover:text-[#459e60]"
          }`}
        >
          Asignados ({tratamientos.length})
        </button>
      </div>

      {/* Contenido según tab activa */}
      {tabActiva === "pendientes" ? (
        lotes.length === 0 ? (
          <Card className="border-2 border-[#4fa362]/10 bg-gradient-to-br from-white to-[#f0fdf4]">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4fa362] to-[#459e60] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Factory className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#2b3b4c] mb-3">
                No hay lotes pendientes de tratamiento
              </h3>
              <p className="text-[#2b3b4c]/70 mb-6 max-w-md mx-auto">
                Todos los lotes han sido asignados a tratamiento o no hay recepciones validadas
                disponibles.
              </p>
              <Link href="/dashboard/gestor">
                <Button className="bg-gradient-to-r from-[#4fa362] to-[#459e60] hover:from-[#459e60] hover:to-[#44a15d] text-white">
                  Volver al Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {lotes.map((lote: ReturnType<typeof JSON.parse>) => (
              <Card
                key={lote.id}
                className="relative overflow-hidden border-2 border-[#4fa362]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-[#f0fdf4]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4fa362]/5 to-transparent rounded-full -mr-16 -mt-16"></div>

                <CardContent className="p-6 relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-[#4fa362]/10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-[#4fa362] to-[#459e60] rounded-xl shadow-md">
                        <Factory className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2b3b4c] flex items-center gap-2">
                          <Hash className="h-5 w-5 text-[#4fa362]" />
                          {lote.folio ? `Lote ${lote.folio}` : `Lote ${lote.id?.slice(0, 8)}`}
                        </h3>
                        <p className="text-sm text-[#2b3b4c]/70 flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-[#4fa362]" />
                          Recibido el {formatearFecha(lote.fechaRecepcionPlanta || lote.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#459e60] text-white border-0 font-bold px-4 py-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Validado
                    </Badge>
                  </div>

                  {/* Content Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                    {/* Solicitud Original */}
                    <div className="bg-white p-4 rounded-lg border border-[#4fa362]/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-[#4fa362]/10 rounded-lg">
                          <Package className="h-4 w-4 text-[#4fa362]" />
                        </div>
                        <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                          Solicitud
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-[#2b3b4c]">Folio: {lote.folio || "N/A"}</p>
                        <p className="text-sm text-[#2b3b4c]/70">
                          Generador: {lote.generador?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Datos de Recepción */}
                    <div className="bg-white p-4 rounded-lg border border-[#4fa362]/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-[#44a15d]/10 rounded-lg">
                          <Weight className="h-4 w-4 text-[#44a15d]" />
                        </div>
                        <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                          Datos Validados
                        </span>
                      </div>
                      <div className="space-y-2">
                        {lote.pesoReal ? (
                          <p className="text-sm text-[#2b3b4c]">
                            <span className="font-semibold">Peso:</span> {lote.pesoReal} kg
                          </p>
                        ) : (
                          <p className="text-sm text-[#2b3b4c]/50 italic">Peso no registrado</p>
                        )}
                        {lote.cantidadReal ? (
                          <p className="text-sm text-[#2b3b4c]">
                            <span className="font-semibold">Cantidad:</span> {lote.cantidadReal}{" "}
                            unidades
                          </p>
                        ) : (
                          <p className="text-sm text-[#2b3b4c]/50 italic">Cantidad no registrada</p>
                        )}
                        {(lote.categoriaA_cantidad && lote.categoriaA_cantidad > 0) ||
                        (lote.categoriaB_cantidad && lote.categoriaB_cantidad > 0) ? (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {lote.categoriaA_cantidad > 0 && (
                              <Badge className="bg-[#44a15d]/10 text-[#44a15d] border-0 text-xs">
                                A ({lote.categoriaA_cantidad})
                              </Badge>
                            )}
                            {lote.categoriaB_cantidad > 0 && (
                              <Badge className="bg-[#44a15d]/10 text-[#44a15d] border-0 text-xs">
                                B ({lote.categoriaB_cantidad})
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-[#2b3b4c]/50 italic mt-2">
                            Categorías no registradas
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="bg-white p-4 rounded-lg border border-[#4fa362]/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-[#459e60]/10 rounded-lg">
                          <Truck className="h-4 w-4 text-[#459e60]" />
                        </div>
                        <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                          Estado Actual
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Badge className="bg-[#459e60] text-white border-0 font-bold">
                          RECIBIDA EN PLANTA
                        </Badge>
                        <p className="text-xs text-[#2b3b4c]/70 mt-2">
                          Lote validado y listo para asignar tratamiento de valorización
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-end gap-3">
                    <Link href={`/dashboard/gestor/tratamientos/${lote.id}`}>
                      <Button className="bg-gradient-to-r from-[#4fa362] to-[#459e60] hover:from-[#459e60] hover:to-[#44a15d] text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all">
                        <Plus className="h-5 w-5 mr-2" />
                        Asignar Tratamiento
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : tratamientos.length === 0 ? (
        <Card className="border-2 border-[#459e60]/10 bg-gradient-to-br from-white to-[#f0fdf4]">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#459e60] to-[#4fa362] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2b3b4c] mb-3">
              No hay tratamientos asignados
            </h3>
            <p className="text-[#2b3b4c]/70 mb-6 max-w-md mx-auto">
              Aún no has asignado tratamientos a ningún lote. Los tratamientos aparecerán aquí una
              vez que los asignes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tratamientos.map((tratamiento: ReturnType<typeof JSON.parse>) => (
            <Card
              key={tratamiento.id}
              className="relative overflow-hidden border-2 border-[#459e60]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-[#f0fdf4]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#459e60]/5 to-transparent rounded-full -mr-16 -mt-16"></div>

              <CardContent className="p-6 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-[#459e60]/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#459e60] to-[#4fa362] rounded-xl shadow-md">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2b3b4c] flex items-center gap-2">
                        <Hash className="h-5 w-5 text-[#459e60]" />
                        {tratamiento.folio
                          ? `Lote ${tratamiento.folio}`
                          : `Lote ${tratamiento.id?.slice(0, 8)}`}
                      </h3>
                      <p className="text-sm text-[#2b3b4c]/70 flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-[#459e60]" />
                        Asignado el {formatearFecha(tratamiento.fechaAsignacion)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#459e60] text-white border-0 font-bold px-4 py-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    TRATADA
                  </Badge>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  {/* Información del Lote */}
                  <div className="bg-white p-4 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#459e60]/10 rounded-lg">
                        <Package className="h-4 w-4 text-[#459e60]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Lote
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-[#2b3b4c]">
                        Generador: {tratamiento.generador?.name || "N/A"}
                      </p>
                      <p className="text-sm text-[#2b3b4c]/70">
                        Peso: {tratamiento.pesoReal || "N/A"} kg
                      </p>
                      <p className="text-sm text-[#2b3b4c]/70">
                        Cantidad: {tratamiento.cantidadReal || "N/A"} unidades
                      </p>
                    </div>
                  </div>

                  {/* Tratamiento Asignado */}
                  <div className="bg-white p-4 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#4fa362]/10 rounded-lg">
                        <Factory className="h-4 w-4 text-[#4fa362]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Tratamiento
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#2b3b4c]">
                        <span className="font-semibold">Tipo:</span>{" "}
                        {tratamiento.tratamiento?.tipo || "No especificado"}
                      </p>
                      {tratamiento.tratamiento?.otroTratamiento && (
                        <p className="text-sm text-[#2b3b4c]">
                          <span className="font-semibold">Específico:</span>{" "}
                          {tratamiento.tratamiento.otroTratamiento}
                        </p>
                      )}
                      {tratamiento.tratamiento?.fechaInicio && (
                        <p className="text-sm text-[#2b3b4c] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-semibold">Inicio:</span>{" "}
                          {tratamiento.tratamiento.fechaInicio}
                        </p>
                      )}
                      {tratamiento.tratamiento?.fechaFin && (
                        <p className="text-sm text-[#2b3b4c] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-semibold">Fin:</span>{" "}
                          {tratamiento.tratamiento.fechaFin}
                        </p>
                      )}
                      {tratamiento.tratamiento?.ubicacion && (
                        <p className="text-sm text-[#2b3b4c] flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="font-semibold">Ubicación:</span>{" "}
                          {tratamiento.tratamiento.ubicacion}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Documentos */}
                  <div className="bg-white p-4 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#44a15d]/10 rounded-lg">
                        <FileText className="h-4 w-4 text-[#44a15d]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Documentos
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#2b3b4c]">
                        <span className="font-semibold">Cantidad:</span>{" "}
                        {tratamiento.tratamiento?.cantidadDocumentos || 0} archivo(s)
                      </p>
                      {tratamiento.tratamiento?.descripcion && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-[#2b3b4c]/70 mb-1">
                            Descripción:
                          </p>
                          <p className="text-xs text-[#2b3b4c]">
                            {tratamiento.tratamiento.descripcion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t-2 border-[#459e60]/10">
                  {(() => {
                    const certificadoExistente = certificadosPorSolicitud.get(tratamiento.id);
                    const estaGenerando = generandoCertificado === tratamiento.id;
                    const isButtonDisabled =
                      estaGenerando || (!isLegalProfileVerified && !certificadoExistente);

                    if (certificadoExistente) {
                      return (
                        <>
                          <Link href={`/dashboard/gestor/certificados`}>
                            <Button
                              variant="outline"
                              className="border-2 border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white font-bold px-6 py-3"
                            >
                              <FileText className="h-5 w-5 mr-2" />
                              Ver Certificado
                            </Button>
                          </Link>
                          <Link href={`/dashboard/gestor/certificados`}>
                            <Button className="bg-gradient-to-r from-[#459e60] to-[#4fa362] hover:from-[#4fa362] hover:to-[#44a15d] text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all">
                              <Award className="h-5 w-5 mr-2" />
                              Certificado Generado
                            </Button>
                          </Link>
                        </>
                      );
                    }

                    return (
                      <Button
                        onClick={() => handleOpenCertModal(tratamiento.id)}
                        disabled={isButtonDisabled}
                        className={`bg-gradient-to-r from-[#459e60] to-[#4fa362] hover:from-[#4fa362] hover:to-[#44a15d] text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${!isLegalProfileVerified ? "bg-gray-400 hover:bg-gray-500" : ""}`}
                      >
                        {estaGenerando ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Generando...
                          </>
                        ) : !isLegalProfileVerified ? (
                          <>
                            <Lock className="h-5 w-5 mr-2" />
                            Validación Requerida
                          </>
                        ) : (
                          <>
                            <Award className="h-5 w-5 mr-2" />
                            Generar Certificado
                          </>
                        )}
                      </Button>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Certificación */}
      <Dialog open={certModalOpen} onOpenChange={setCertModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar Emisión de Certificado</DialogTitle>
            <DialogDescription>
              Por favor completa la información final del proceso de valorización. Estos datos
              aparecerán en el certificado oficial.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="destino" className="text-right">
                Destino Final del Material <span className="text-red-500">*</span>
              </Label>
              <Input
                id="destino"
                placeholder="Ej: Planta de Reciclaje, Coprocesamiento, etc."
                value={certFormData.destino}
                onChange={(e: unknown) =>
                  setCertFormData({
                    ...certFormData,
                    destino: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="producto" className="text-right">
                Producto Obtenido (Opcional)
              </Label>
              <Input
                id="producto"
                placeholder="Ej: Gránulo de Caucho, Acero, Combustible Alternativo"
                value={certFormData.productoFinal}
                onChange={(e: unknown) =>
                  setCertFormData({
                    ...certFormData,
                    productoFinal: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCertModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmGenerate}
              className="bg-[#459e60] hover:bg-[#44a15d] text-white"
            >
              <Award className="w-4 h-4 mr-2" />
              Emitir Certificado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
