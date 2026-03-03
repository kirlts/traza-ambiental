"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Package, Building2, AlertTriangle, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NuevaRutaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    fechaPlanificada: "",
    vehiculoId: "",
    notas: "",
  });
  const [solicitudesSeleccionadas, setSolicitudesSeleccionadas] = useState<
    ReturnType<typeof JSON.parse>[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obtener solicitudes ACEPTADAS del transportista
  const { data: solicitudesData, isLoading: loadingSolicitudes } = useQuery({
    queryKey: ["mis-solicitudes-aceptadas"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/mis-solicitudes?estado=ACEPTADA");
      if (!response.ok) throw new Error("Error cargando solicitudes");
      return response.json();
    },
  });

  // Obtener vehículos
  const { data: vehiculosData, isLoading: loadingVehiculos } = useQuery({
    queryKey: ["vehiculos"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/vehiculos");
      if (!response.ok) throw new Error("Error cargando vehículos");
      return response.json();
    },
  });

  // Mutación para crear ruta
  const crearMutation = useMutation({
    mutationFn: async (data: ReturnType<typeof JSON.parse>) => {
      const response = await fetch("/api/transportista/rutas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error((error as ReturnType<typeof JSON.parse>).error || "Error al crear ruta");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Ruta creada exitosamente");
      router.push("/dashboard/transportista/rutas");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    },
  });

  const solicitudes = solicitudesData?.solicitudes || [];
  const vehiculos = vehiculosData?.vehiculos || [];
  const vehiculosActivos = vehiculos.filter(
    (v: ReturnType<typeof JSON.parse>) => v.estado === "activo"
  );

  const toggleSolicitud = (solicitudId: string) => {
    if (solicitudesSeleccionadas.includes(solicitudId)) {
      setSolicitudesSeleccionadas(solicitudesSeleccionadas.filter((id) => id !== solicitudId));
    } else {
      setSolicitudesSeleccionadas([...solicitudesSeleccionadas, solicitudId]);
    }
  };

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre de la ruta es requerido";
    }

    if (!formData.fechaPlanificada) {
      newErrors.fechaPlanificada = "La fecha es requerida";
    }

    if (solicitudesSeleccionadas.length === 0) {
      newErrors.solicitudes = "Debe seleccionar al menos una solicitud";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: unknown) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();

    if (!validarFormulario()) {
      return;
    }

    crearMutation.mutate({
      nombre: formData.nombre,
      fechaPlanificada: formData.fechaPlanificada,
      vehiculoId: formData.vehiculoId || null,
      solicitudesIds: solicitudesSeleccionadas,
      notas: formData.notas || null,
    });
  };

  const pesoTotalSeleccionado = solicitudes
    .filter((s: ReturnType<typeof JSON.parse>) => solicitudesSeleccionadas.includes(s.id))
    .reduce((sum: number, s: ReturnType<typeof JSON.parse>) => sum + (s.pesoTotalEstimado || 0), 0);

  const isLoading = loadingSolicitudes || loadingVehiculos;

  if (isLoading) {
    return (
      <DashboardLayout title="Nueva Ruta" subtitle="Creando nueva ruta de transporte">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border)] border-t-[var(--primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--muted-foreground)] font-medium">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Crear Nueva Ruta"
      subtitle="Agrupe múltiples solicitudes para optimizar su servicio"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Botón Volver */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-[#459e60] hover:text-[#44a15d] font-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a Rutas
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulario - 1 columna */}
          <Card className="lg:col-span-1 border-2 border-[#459e60]/20 shadow-xl">
            <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Datos de la Ruta</h2>
                  <p className="text-sm text-white/80">Configure su ruta</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-[#2b3b4c] font-semibold">
                    Nombre de la Ruta <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="ej: Ruta Mañana - Santiago"
                    value={formData.nombre}
                    onChange={(e: unknown) => {
                      setFormData({
                        ...formData,
                        nombre: (e as ReturnType<typeof JSON.parse>).target.value,
                      });
                      setErrors({ ...errors, nombre: "" });
                    }}
                    className={`border-2 ${
                      errors.nombre ? "border-red-500" : "border-[#459e60]/30"
                    } focus:border-[#459e60]`}
                  />
                  {errors.nombre && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.nombre}
                    </div>
                  )}
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <Label htmlFor="fecha" className="text-[#2b3b4c] font-semibold">
                    Fecha Planificada <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fechaPlanificada}
                    onChange={(e: unknown) => {
                      setFormData({
                        ...formData,
                        fechaPlanificada: (e as ReturnType<typeof JSON.parse>).target.value,
                      });
                      setErrors({ ...errors, fechaPlanificada: "" });
                    }}
                    className={`border-2 ${
                      errors.fechaPlanificada ? "border-red-500" : "border-[#459e60]/30"
                    } focus:border-[#459e60]`}
                  />
                  {errors.fechaPlanificada && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.fechaPlanificada}
                    </div>
                  )}
                </div>

                {/* Vehículo */}
                <div className="space-y-2">
                  <Label htmlFor="vehiculo" className="text-[#2b3b4c] font-semibold">
                    Vehículo (Opcional)
                  </Label>
                  <Select
                    value={formData.vehiculoId || "sin-asignar"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, vehiculoId: value === "sin-asignar" ? "" : value })
                    }
                  >
                    <SelectTrigger className="border-2 border-[#459e60]/30 focus:border-[#459e60]">
                      <SelectValue placeholder="Seleccione un vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin-asignar">Sin asignar</SelectItem>
                      {vehiculosActivos.map((vehiculo: ReturnType<typeof JSON.parse>) => (
                        <SelectItem key={vehiculo.id} value={vehiculo.id}>
                          {vehiculo.patente} - {vehiculo.tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notas */}
                <div className="space-y-2">
                  <Label htmlFor="notas" className="text-[#2b3b4c] font-semibold">
                    Notas (Opcional)
                  </Label>
                  <Textarea
                    id="notas"
                    placeholder="Información adicional sobre la ruta..."
                    value={formData.notas}
                    onChange={(e: unknown) =>
                      setFormData({
                        ...formData,
                        notas: (e as ReturnType<typeof JSON.parse>).target.value,
                      })
                    }
                    className="border-2 border-[#459e60]/30 focus:border-[#459e60] min-h-[80px]"
                  />
                </div>

                {/* Resumen */}
                <Card className="bg-[#f6fcf3] border-[#459e60]/20">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-[#2b3b4c]">Resumen</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#2b3b4c]/70">Solicitudes:</span>
                      <Badge className="bg-[#459e60] text-white">
                        {solicitudesSeleccionadas.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#2b3b4c]/70">Peso Total:</span>
                      <span className="font-bold text-[#459e60]">
                        {(pesoTotalSeleccionado / 1000).toFixed(1)} t
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {errors.solicitudes && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.solicitudes}
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    variant="outline"
                    className="flex-1 border-2 border-[#459e60]/30"
                    disabled={crearMutation.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold"
                    disabled={crearMutation.isPending}
                  >
                    {crearMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Crear Ruta
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Solicitudes Disponibles - 2 columnas */}
          <Card className="lg:col-span-2 border-2 border-[#459e60]/20 shadow-xl">
            <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Package className="h-7 w-7" />
                Solicitudes Disponibles
              </h2>
              <p className="text-sm text-white/80 mt-2">
                Seleccione las solicitudes a incluir en esta ruta ({solicitudesSeleccionadas.length}{" "}
                seleccionadas)
              </p>
            </div>

            <CardContent className="p-6">
              {solicitudes.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-[#459e60]/30 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-[#2b3b4c] mb-2">
                    No hay solicitudes aceptadas
                  </h3>
                  <p className="text-sm text-[#2b3b4c]/60">
                    Primero debe aceptar solicitudes de transporte
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {solicitudes.map((solicitud: ReturnType<typeof JSON.parse>) => (
                    <Card
                      key={solicitud.id}
                      className={`border-2 cursor-pointer transition-all duration-200 ${
                        solicitudesSeleccionadas.includes(solicitud.id)
                          ? "border-[#459e60] bg-[#f6fcf3]"
                          : "border-[#459e60]/20 hover:border-[#459e60]/50"
                      }`}
                      onClick={() => toggleSolicitud(solicitud.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={solicitudesSeleccionadas.includes(solicitud.id)}
                            onCheckedChange={() => toggleSolicitud(solicitud.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-[#2b3b4c]">
                                  Folio: {solicitud.folio}
                                </h4>
                                <p className="text-sm text-[#2b3b4c]/70 flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {solicitud.generador.name}
                                </p>
                              </div>
                              <Badge className="bg-[#459e60] text-white">{solicitud.estado}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#2b3b4c]/70">
                              <MapPin className="h-4 w-4 text-[#459e60]" />
                              <span>
                                {solicitud.direccionRetiro}, {solicitud.comuna}, {solicitud.region}
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <div>
                                <span className="text-[#2b3b4c]/70">Peso: </span>
                                <span className="font-bold text-[#459e60]">
                                  {solicitud.pesoTotalEstimado} kg
                                </span>
                              </div>
                              <div>
                                <span className="text-[#2b3b4c]/70">Cantidad: </span>
                                <span className="font-bold text-[#459e60]">
                                  {solicitud.cantidadTotal}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
