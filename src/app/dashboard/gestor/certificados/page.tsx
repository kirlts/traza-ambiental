"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Download,
  Calendar,
  Building,
  FileText,
  Award,
  Hash,
  Weight,
  Package,
  BarChart3,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

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

interface Certificado {
  id: string;
  folio: string;
  pesoValorizado: number;
  cantidadUnidades: number;
  categorias: string[];
  tratamientos: unknown[];
  fechaEmision: string;
  pdfUrl: string;
  solicitud: {
    generador: { name: string; rut: string };
    transportista?: { name: string };
  };
}

interface Estadisticas {
  totalCertificados: number;
  totalPesoValorizado: number;
  porTratamiento: { [key: string]: number };
  porMes: { [key: string]: number };
}

export default function CertificadosPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    generadorRut: "",
    tratamiento: "",
  });

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

  const { data, isLoading, error } = useQuery({
    queryKey: ["certificados-gestor", page, filtros],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filtros).filter(([_, value]) => value !== "")),
      });

      const response = await fetch(`/api/gestor/certificados?${params}`);
      if (!response.ok) throw new Error("Error cargando certificados");
      return response.json();
    },
  });

  const certificados: Certificado[] = data?.certificados || [];
  const estadisticas: Estadisticas = data?.estadisticas || {
    totalCertificados: 0,
    totalPesoValorizado: 0,
    porTratamiento: {},
    porMes: {},
  };
  const totalPages = data?.totalPages || 1;

  const handleDescargarPDF = async (certificadoId: string, _folio: string) => {
    try {
      // Generar la URL para el PDF usando el ID del certificado
      const pdfUrl = `/api/gestor/certificados/${certificadoId}/pdf`;

      // Abrir el PDF en una nueva pestaña
      window.open(pdfUrl, "_blank");
    } catch (error: unknown) {
      console.error("Error al abrir certificado:", error);
      toast.error("Error al abrir el certificado", {
        description: "Por favor, intente nuevamente más tarde.",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        title="Certificados Digitales"
        subtitle="Cargando certificados de valorización..."
      >
        <div className="grid gap-6">
          {/* Estadísticas Skeleton */}
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2 border-[#459e60]/10 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-[#459e60]/10 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-[#459e60]/10 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Certificados Skeleton */}
          {[1, 2].map((i) => (
            <Card key={i} className="border-2 border-[#459e60]/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-[#459e60]/10 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-[#459e60]/10 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Certificados Digitales" subtitle="Error al cargar certificados">
        <Card className="border-2 border-red-500/20 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Error al cargar certificados</h3>
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
      title="Certificados Digitales"
      subtitle={`${estadisticas.totalCertificados} certificado(s) de valorización emitido(s)`}
      actions={
        <Badge className="bg-[#459e60] text-white border-0 font-bold px-4 py-2 text-base">
          {estadisticas.totalCertificados} Certificados
        </Badge>
      }
    >
      {/* Alerta de Perfil Legal */}
      {legalProfile && legalProfile.status !== "VERIFICADO" && (
        <Alert
          variant="destructive"
          className="mb-8 border-l-4 border-l-red-600 shadow-md bg-red-50"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-red-900 font-bold flex items-center gap-2 text-lg">
            Emisión de Certificados Bloqueada
          </AlertTitle>
          <AlertDescription className="mt-2 text-red-800">
            <p className="mb-3 text-base">
              Tu perfil legal se encuentra en estado{" "}
              <strong>{legalProfile.status?.replace("_", " ") || "PENDIENTE"}</strong>. Para poder
              emitir certificados de valorización válidos ante la autoridad, debes completar tu
              validación legal y ser aprobado por un administrador.
            </p>
            <Link href="/dashboard/gestor/validacion-legal">
              <Button
                variant="outline"
                className="border-red-300 text-red-800 hover:bg-red-100 hover:text-red-950 bg-white shadow-sm font-semibold"
              >
                Ir a Validación Legal
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Total Certificados */}
        <Card className="relative overflow-hidden border-2 border-[#459e60]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#f6fcf3] to-[#f0fdf4]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 uppercase tracking-wide mb-2">
                  Total Certificados
                </p>
                <p className="text-4xl font-bold text-[#2b3b4c]">
                  {estadisticas.totalCertificados}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-xl shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peso Total Valorizado */}
        <Card className="relative overflow-hidden border-2 border-[#4fa362]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-[#f0fdf4] to-[#f6fcf3]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 uppercase tracking-wide mb-2">
                  Peso Valorizado
                </p>
                <p className="text-4xl font-bold text-[#2b3b4c]">
                  {estadisticas.totalPesoValorizado.toLocaleString("es-CL")}
                  <span className="text-xl ml-2">kg</span>
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#4fa362] to-[#459e60] rounded-xl shadow-lg">
                <Weight className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tratamientos */}
        <Card className="relative overflow-hidden border-2 border-[#44a15d]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-[#fef8f0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2b3b4c]/70 uppercase tracking-wide mb-2">
                  Tipos de Tratamiento
                </p>
                <p className="text-4xl font-bold text-[#2b3b4c]">
                  {Object.keys(estadisticas.porTratamiento).length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#f5792a] to-[#f5792a]/80 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-2 border-[#459e60]/10 bg-white mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-[#459e60] to-[#4fa362]"></div>
            <h3 className="text-lg font-bold text-[#2b3b4c]">Filtros de Búsqueda</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-[#2b3b4c] mb-2 block">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha Desde
              </label>
              <Input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e: unknown) =>
                  setFiltros({
                    ...filtros,
                    fechaDesde: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
                className="border-[#459e60]/20 focus:border-[#459e60]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2b3b4c] mb-2 block">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e: unknown) =>
                  setFiltros({
                    ...filtros,
                    fechaHasta: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
                className="border-[#459e60]/20 focus:border-[#459e60]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2b3b4c] mb-2 block">
                <Building className="h-4 w-4 inline mr-1" />
                RUT Generador
              </label>
              <Input
                placeholder="Ej: 12345678-9"
                value={filtros.generadorRut}
                onChange={(e: unknown) =>
                  setFiltros({
                    ...filtros,
                    generadorRut: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
                className="border-[#459e60]/20 focus:border-[#459e60]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2b3b4c] mb-2 block">
                <Package className="h-4 w-4 inline mr-1" />
                Tratamiento
              </label>
              <Select
                value={filtros.tratamiento || "all"}
                onValueChange={(value) =>
                  setFiltros({ ...filtros, tratamiento: value === "all" ? "" : value })
                }
              >
                <SelectTrigger className="border-[#459e60]/20 focus:border-[#459e60] bg-white text-gray-900">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200">
                  <SelectItem
                    value="all"
                    className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
                  >
                    Todos
                  </SelectItem>
                  {Object.keys(estadisticas.porTratamiento).map(
                    (tratamiento: ReturnType<typeof JSON.parse>) => (
                      <SelectItem
                        key={tratamiento}
                        value={tratamiento}
                        className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
                      >
                        {tratamiento}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() =>
                setFiltros({ fechaDesde: "", fechaHasta: "", generadorRut: "", tratamiento: "" })
              }
              variant="outline"
              className="border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white"
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Certificados */}
      {certificados.length === 0 ? (
        <Card className="border-2 border-[#459e60]/10 bg-gradient-to-br from-white to-[#f6fcf3]">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2b3b4c] mb-3">
              No hay certificados disponibles
            </h3>
            <p className="text-[#2b3b4c]/70 mb-6 max-w-md mx-auto">
              No se encontraron certificados con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {certificados.map((cert: ReturnType<typeof JSON.parse>) => (
            <Card
              key={cert.id}
              className="relative overflow-hidden border-2 border-[#459e60]/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#f6fcf3]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#459e60]/5 to-transparent rounded-full -mr-16 -mt-16"></div>

              <CardContent className="p-6 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-[#459e60]/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-xl shadow-md">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2b3b4c] flex items-center gap-2">
                        <Hash className="h-5 w-5 text-[#459e60]" />
                        Certificado {cert.folio}
                      </h3>
                      <p className="text-sm text-[#2b3b4c]/70 flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-[#459e60]" />
                        Emitido el {formatearFecha(cert.fechaEmision)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#459e60] text-white border-0 font-bold px-4 py-2">
                    <FileText className="h-4 w-4 mr-2" />
                    Digital
                  </Badge>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                  {/* Generador */}
                  <div className="bg-white p-4 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#459e60]/10 rounded-lg">
                        <Building className="h-4 w-4 text-[#459e60]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Generador
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-[#2b3b4c]">
                        {cert.solicitud.generador.name}
                      </p>
                      <p className="text-sm text-[#2b3b4c]/70">
                        RUT: {cert.solicitud.generador.rut}
                      </p>
                    </div>
                  </div>

                  {/* Datos de Valorización */}
                  <div className="bg-white p-4 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#4fa362]/10 rounded-lg">
                        <Weight className="h-4 w-4 text-[#4fa362]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Valorizado
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-[#2b3b4c]">
                        <span className="font-semibold">Peso:</span> {cert.pesoValorizado} kg
                      </p>
                      <p className="text-sm text-[#2b3b4c]">
                        <span className="font-semibold">Unidades:</span> {cert.cantidadUnidades}
                      </p>
                    </div>
                  </div>

                  {/* Categorías */}
                  <div className="bg-white p-4 rounded-lg border border-[#459e60]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#44a15d]/10 rounded-lg">
                        <Package className="h-4 w-4 text-[#44a15d]" />
                      </div>
                      <span className="text-sm font-bold text-[#2b3b4c] uppercase tracking-wide">
                        Categorías
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cert.categorias.map(
                        (
                          cat: ReturnType<typeof JSON.parse>,
                          idx: ReturnType<typeof JSON.parse>
                        ) => (
                          <Badge
                            key={idx}
                            className="bg-[#44a15d]/10 text-[#44a15d] border-0 text-xs"
                          >
                            {cat}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Tratamientos */}
                {cert.tratamientos && cert.tratamientos.length > 0 && (
                  <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#459e60]/10 mb-6">
                    <p className="text-xs font-semibold text-[#2b3b4c]/70 uppercase tracking-wide mb-3">
                      Tratamientos Aplicados
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cert.tratamientos.map(
                        (
                          trat: ReturnType<typeof JSON.parse>,
                          idx: ReturnType<typeof JSON.parse>
                        ) => (
                          <Badge key={idx} className="bg-[#f5792a] text-white border-0 font-medium">
                            {trat.tipo || trat.name || "Tratamiento"}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleDescargarPDF(cert.id, cert.folio)}
                    className="bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#4fa362] text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Ver Certificado PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline"
            className="border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white disabled:opacity-50"
          >
            Anterior
          </Button>
          <span className="text-[#2b3b4c] font-medium">
            Página {page} de {totalPages}
          </span>
          <Button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            variant="outline"
            className="border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
