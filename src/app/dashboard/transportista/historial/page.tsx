"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Package,
  CheckCircle,
  AlertTriangle,
  Search,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Truck,
  Weight,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

interface BadgeConfig {
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  text: string;
}

export default function HistorialPage() {
  const [filtros, setFiltros] = useState({
    folio: "",
    estado: "",
    region: "",
    fechaDesde: "",
    fechaHasta: "",
    orderBy: "fechaAceptacion",
    order: "desc" as "asc" | "desc",
  });
  const [page, setPage] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Obtener historial
  const { data, isLoading } = useQuery({
    queryKey: ["historial", filtros, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...Object.fromEntries(Object.entries(filtros).filter(([_, value]) => value !== "")),
      });

      const response = await fetch(`/api/transportista/historial?${params}`);
      if (!response.ok) throw new Error("Error cargando historial");
      return response.json();
    },
  });

  const solicitudes = data?.solicitudes || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };
  const estadisticas = data?.estadisticas || [];

  const limpiarFiltros = () => {
    setFiltros({
      folio: "",
      estado: "",
      region: "",
      fechaDesde: "",
      fechaHasta: "",
      orderBy: "fechaAceptacion",
      order: "desc",
    });
    setPage(1);
  };

  const exportarCSV = () => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filtros).filter(([_, value]) => value !== ""))
    );
    window.open(`/api/transportista/reportes/exportar?${params}`, "_blank");
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, BadgeConfig> = {
      PENDIENTE: { icon: Clock, bg: "bg-gray-500", text: "Pendiente" },
      ACEPTADA: { icon: CheckCircle, bg: "bg-blue-500", text: "Aceptada" },
      EN_CAMINO: { icon: Truck, bg: "bg-orange-500", text: "En Camino" },
      RECOLECTADA: { icon: Package, bg: "bg-purple-500", text: "Recolectada" },
      ENTREGADA_GESTOR: { icon: CheckCircle, bg: "bg-[#459e60]", text: "Entregada" },
      RECHAZADA: { icon: AlertTriangle, bg: "bg-red-500", text: "Rechazada" },
    };

    const badge = badges[estado] || badges.PENDIENTE;
    const IconComponent = badge.icon;

    return (
      <Badge className={`${badge.bg} text-white border-0 font-bold px-3 py-1.5 shadow-sm`}>
        <IconComponent className="h-4 w-4 mr-1.5" />
        {badge.text}
      </Badge>
    );
  };

  if (isLoading && solicitudes.length === 0) {
    return (
      <DashboardLayout title="Historial" subtitle="Historial completo de solicitudes">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#459e60] mx-auto"></div>
            <p className="mt-6 text-gray-600 font-semibold text-lg">Cargando historial...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Historial Completo"
      subtitle="Consulte el historial de todas sus solicitudes de transporte"
    >
      <div className="space-y-6 p-6">
        {/* Estadísticas Resumidas */}
        {estadisticas.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {estadisticas.map((est: { estado: string; count: number; pesoRealTotal?: number }) => {
              const badgesStats: Record<
                string,
                { color: string; icon: React.ComponentType<{ className?: string }> }
              > = {
                PENDIENTE: { color: "from-gray-500 to-gray-600", icon: Clock },
                ACEPTADA: { color: "from-blue-500 to-blue-600", icon: CheckCircle },
                EN_CAMINO: { color: "from-orange-500 to-orange-600", icon: Truck },
                RECOLECTADA: { color: "from-purple-500 to-purple-600", icon: Package },
                ENTREGADA_GESTOR: { color: "from-[#459e60] to-[#44a15d]", icon: CheckCircle },
                RECHAZADA: { color: "from-red-500 to-red-600", icon: AlertTriangle },
              };

              const badge = badgesStats[est.estado] || {
                color: "from-gray-400 to-gray-500",
                icon: Clock,
              };

              const Icon = badge.icon;

              return (
                <Card
                  key={est.estado}
                  className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className={`h-2 bg-gradient-to-r ${badge.color}`}></div>
                  <CardContent className="p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${badge.color} rounded-xl shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-4xl font-bold text-gray-900">{est.count}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-700 mb-1">{est.estado}</p>
                    <p className="text-xs text-[#459e60] font-semibold">
                      {((est.pesoRealTotal || 0) / 1000).toFixed(1)} toneladas
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Barra de Búsqueda y Acciones */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 bg-white">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Búsqueda por Folio */}
              <div className="flex-1 w-full">
                <Label
                  htmlFor="folio"
                  className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Search className="h-4 w-4 text-[#459e60]" />
                  Buscar por Folio
                </Label>
                <div className="relative">
                  <Input
                    id="folio"
                    placeholder="Ingrese el folio..."
                    value={filtros.folio}
                    onChange={(e: unknown) => {
                      setFiltros({
                        ...filtros,
                        folio: (e as ReturnType<typeof JSON.parse>).target.value,
                      });
                      setPage(1);
                    }}
                    className="h-12 pl-12 border-2 border-gray-200 focus:border-[#459e60] text-gray-900 font-medium text-base"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 w-full lg:w-auto">
                <Button
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  variant="outline"
                  className="flex-1 lg:flex-none h-12 border-2 border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white font-bold transition-all"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  {mostrarFiltros ? "Ocultar" : "Filtros"}
                </Button>
                <Button
                  onClick={exportarCSV}
                  className="flex-1 lg:flex-none h-12 bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#459e60] text-white font-bold shadow-lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Filtros Avanzados */}
        {mostrarFiltros && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-[#f6fcf3] to-white">
            <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="h-6 w-6" />
                Filtros Avanzados
              </h3>
            </div>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Estado */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">Estado</Label>
                  <Select
                    value={filtros.estado}
                    onValueChange={(value) => {
                      setFiltros({ ...filtros, estado: value });
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-[#459e60] bg-white">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="ACEPTADA">Aceptada</SelectItem>
                      <SelectItem value="EN_CAMINO">En Camino</SelectItem>
                      <SelectItem value="RECOLECTADA">Recolectado</SelectItem>
                      <SelectItem value="ENTREGADA_GESTOR">Entregado</SelectItem>
                      <SelectItem value="RECHAZADA">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Región */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">Región</Label>
                  <Input
                    placeholder="Región..."
                    value={filtros.region}
                    onChange={(e: unknown) => {
                      setFiltros({
                        ...filtros,
                        region: (e as ReturnType<typeof JSON.parse>).target.value,
                      });
                      setPage(1);
                    }}
                    className="h-12 border-2 border-gray-200 focus:border-[#459e60] text-gray-900 font-medium"
                  />
                </div>

                {/* Fecha Desde */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">Fecha Desde</Label>
                  <Input
                    type="date"
                    value={filtros.fechaDesde}
                    onChange={(e: unknown) => {
                      setFiltros({
                        ...filtros,
                        fechaDesde: (e as ReturnType<typeof JSON.parse>).target.value,
                      });
                      setPage(1);
                    }}
                    className="h-12 border-2 border-gray-200 focus:border-[#459e60] text-gray-900 font-medium"
                  />
                </div>

                {/* Fecha Hasta */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">Fecha Hasta</Label>
                  <Input
                    type="date"
                    value={filtros.fechaHasta}
                    onChange={(e: unknown) => {
                      setFiltros({
                        ...filtros,
                        fechaHasta: (e as ReturnType<typeof JSON.parse>).target.value,
                      });
                      setPage(1);
                    }}
                    className="h-12 border-2 border-gray-200 focus:border-[#459e60] text-gray-900 font-medium"
                  />
                </div>

                {/* Botón Limpiar */}
                <div className="flex items-end">
                  <Button
                    onClick={limpiarFiltros}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Solicitudes */}
        <div className="space-y-4">
          {solicitudes.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No se encontraron solicitudes
                </h3>
                <p className="text-gray-600">Intente ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          ) : (
            solicitudes.map((solicitud: ReturnType<typeof JSON.parse>) => (
              <Card
                key={solicitud.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <CardContent className="p-6 bg-white">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Folio: {solicitud.folio}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {solicitud.fechaAceptacion &&
                          format(new Date(solicitud.fechaAceptacion), "PPP", { locale: es })}
                      </p>
                    </div>
                    {getEstadoBadge(solicitud.estado)}
                  </div>

                  {/* Información en Grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                    {/* Generador */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <div className="p-2 bg-[#459e60]/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-[#459e60]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-500 mb-1">GENERADOR</p>
                        <p className="font-bold text-gray-900 truncate">
                          {solicitud.generador?.razonSocial || "No especificado"}
                        </p>
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-500 mb-1">UBICACIÓN</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {solicitud.comuna}, {solicitud.region}
                        </p>
                      </div>
                    </div>

                    {/* Peso */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                      <div className="p-2 bg-[#459e60]/10 rounded-lg">
                        <Weight className="h-5 w-5 text-[#459e60]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-500 mb-1">PESO</p>
                        <p className="font-bold text-gray-900">
                          {solicitud.pesoEstimadoKg / 1000} t / {solicitud.cantidadUnidades} unid.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehículo si existe */}
                  {solicitud.vehiculo && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-[#f6fcf3] to-white rounded-xl border-2 border-[#459e60]/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#459e60] rounded-lg">
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600">VEHÍCULO ASIGNADO</p>
                          <p className="font-bold text-gray-900">
                            {solicitud.vehiculo.patente} - {solicitud.vehiculo.tipo}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botón Ver Detalles */}
                  <Link href={`/dashboard/transportista/solicitudes/${solicitud.id}`}>
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white font-bold transition-all"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Ver Detalles Completos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm font-semibold text-gray-700">
                  Mostrando página {pagination.page} de {pagination.totalPages} ({pagination.total}{" "}
                  solicitudes en total)
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="border-2 border-gray-300 hover:bg-gray-50 font-bold"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold"
                  >
                    Siguiente
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
