"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, Search, Filter, Calendar, User, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InventarioGuard } from "@/components/inventario/InventarioGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Paginacion {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

interface Movimiento {
  id: string;
  tipo: "ENTRADA" | "SALIDA";
  cantidad: number;
  cantidadPrevia: number;
  cantidadNueva: number;
  motivo: string;
  referencia?: string;
  notas?: string;
  fechaMovimiento: string;
  producto: {
    nombre: string;
    marca: string;
    modelo: string;
    medidas: string;
  };
  usuario: {
    name: string;
  };
}

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [paginacion, setPaginacion] = useState<Paginacion | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState<string>("TODOS");
  const [motivoFiltro, setMotivoFiltro] = useState<string>("TODOS");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const loadMovimientos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: paginaActual.toString(),
        limit: "20",
      });

      if (tipoFiltro !== "TODOS") params.append("tipo", tipoFiltro);
      if (fechaDesde) params.append("fechaDesde", fechaDesde);
      if (fechaHasta) params.append("fechaHasta", fechaHasta);

      const response = await fetch(`/api/inventario/movimientos?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMovimientos(data.data.movimientos);
        setPaginacion(data.data.paginacion);
      }
    } catch (error: unknown) {
      console.error("Error al cargar movimientos:", error);
    } finally {
      setLoading(false);
    }
  }, [tipoFiltro, fechaDesde, fechaHasta, paginaActual]);

  useEffect(() => {
    loadMovimientos();
  }, [loadMovimientos]);

  const filteredMovimientos = movimientos.filter((movimiento) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      movimiento.producto.nombre.toLowerCase().includes(searchLower) ||
      movimiento.producto.marca.toLowerCase().includes(searchLower) ||
      movimiento.producto.modelo.toLowerCase().includes(searchLower) ||
      movimiento.motivo.toLowerCase().includes(searchLower) ||
      (movimiento.referencia && movimiento.referencia.toLowerCase().includes(searchLower))
    );
  });

  const resetFiltros = () => {
    setTipoFiltro("TODOS");
    setMotivoFiltro("TODOS");
    setFechaDesde("");
    setFechaHasta("");
    setSearchTerm("");
    setPaginaActual(1);
  };

  const motivos = [
    "Producción",
    "Importación",
    "Venta",
    "Entrega REP",
    "Devolución",
    "Pérdida",
    "Ajuste",
    "Otro",
  ];

  if (loading) {
    return (
      <DashboardLayout
        title="Histórico de Movimientos"
        subtitle="Consulta la trazabilidad completa de entradas y salidas de tu inventario"
      >
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Histórico de movimientos"
      subtitle="Audita cada operación de inventario: entradas, salidas y ajustes registrados"
    >
      <InventarioGuard>
        <div className="w-full space-y-6">
          {/* Botón de volver */}
          <div className="flex justify-end">
            <Link href="/dashboard/generador/inventario">
              <Button
                variant="outline"
                className="h-10 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              >
                ← Volver al inventario
              </Button>
            </Link>
          </div>

          {/* Filtros */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
              <CardTitle className="flex items-center text-emerald-900 font-semibold">
                <Filter className="h-5 w-5 mr-2 text-emerald-600" />
                Filtros avanzados
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Refina la búsqueda por tipo de movimiento, motivo o período específico.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger className="h-10 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200">
                      <SelectItem value="TODOS" className="text-gray-900 hover:bg-emerald-50">
                        Todos
                      </SelectItem>
                      <SelectItem value="ENTRADA" className="text-gray-900 hover:bg-emerald-50">
                        Entradas
                      </SelectItem>
                      <SelectItem value="SALIDA" className="text-gray-900 hover:bg-emerald-50">
                        Salidas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
                  <Select value={motivoFiltro} onValueChange={setMotivoFiltro}>
                    <SelectTrigger className="h-10 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200">
                      <SelectItem value="TODOS" className="text-gray-900 hover:bg-emerald-50">
                        Todos
                      </SelectItem>
                      {motivos.map((motivo) => (
                        <SelectItem
                          key={motivo}
                          value={motivo}
                          className="text-gray-900 hover:bg-emerald-50"
                        >
                          {motivo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Desde
                  </label>
                  <Input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="h-10 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Hasta
                  </label>
                  <Input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="h-10 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between pt-4 border-t border-gray-100">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por producto, motivo, referencia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={resetFiltros}
                  className="border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 h-10"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Movimientos */}
          <div className="space-y-4">
            {filteredMovimientos.map((movimiento) => (
              <Card
                key={movimiento.id}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-200"
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    {/* Icono de tipo */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 ${
                        movimiento.tipo === "ENTRADA"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {movimiento.tipo === "ENTRADA" ? (
                        <ArrowUpIcon className="h-6 w-6" />
                      ) : (
                        <ArrowDownIcon className="h-6 w-6" />
                      )}
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1 min-w-0">
                      {/* Header del movimiento */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-gray-900 mb-1">
                            {movimiento.producto.marca} {movimiento.producto.modelo}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {movimiento.producto.nombre} • {movimiento.producto.medidas}
                          </p>
                        </div>
                        <Badge
                          variant={movimiento.tipo === "ENTRADA" ? "default" : "destructive"}
                          className={`ml-3 ${
                            movimiento.tipo === "ENTRADA"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {movimiento.tipo === "ENTRADA" ? "Entrada" : "Salida"}
                        </Badge>
                      </div>

                      {/* Grid de información */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Cantidad
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              movimiento.tipo === "ENTRADA" ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {movimiento.tipo === "ENTRADA" ? "+" : "-"}
                            {Math.abs(movimiento.cantidad)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Stock Anterior
                          </p>
                          <p className="text-base font-semibold text-gray-700">
                            {movimiento.cantidadPrevia}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Stock Resultante
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {movimiento.cantidadNueva}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Motivo
                          </p>
                          <p className="text-sm font-medium text-gray-700">{movimiento.motivo}</p>
                        </div>
                      </div>

                      {/* Metadatos */}
                      <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {format(new Date(movimiento.fechaMovimiento), "dd/MM/yyyy HH:mm", {
                              locale: es,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span>{movimiento.usuario.name}</span>
                        </div>
                        {movimiento.referencia && (
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span>Ref: {movimiento.referencia}</span>
                          </div>
                        )}
                      </div>

                      {/* Notas */}
                      {movimiento.notas && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                          <p className="text-xs font-semibold text-emerald-900 mb-1">Notas:</p>
                          <p className="text-sm text-emerald-800">{movimiento.notas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMovimientos.length === 0 && (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No se encontraron movimientos
                  </h3>
                  <p className="text-sm text-gray-600 text-center max-w-md">
                    No hay movimientos que coincidan con los filtros aplicados. Intenta ajustar los
                    criterios de búsqueda.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Paginación */}
          {paginacion && paginacion.totalPaginas > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Mostrando página <span className="font-semibold text-gray-900">{paginaActual}</span>{" "}
                de <span className="font-semibold text-gray-900">{paginacion.totalPaginas}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  disabled={paginaActual === paginacion.totalPaginas}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </InventarioGuard>
    </DashboardLayout>
  );
}
