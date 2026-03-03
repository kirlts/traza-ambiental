"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormularioEntregaGestorProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  onEntregaExitosa: () => void;
}

interface Gestor {
  id: string;
  name: string;
  email: string;
  rut: string;
}

export function FormularioEntregaGestor({
  isOpen,
  onClose,
  solicitudId,
  onEntregaExitosa,
}: FormularioEntregaGestorProps) {
  const [formData, setFormData] = useState({
    fechaEntrega: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    rutGestor: "",
    nombreReceptor: "",
    rutReceptor: "",
    observaciones: "",
  });
  const [gestorSeleccionado, setGestorSeleccionado] = useState<Gestor | null>(null);
  const [ubicacionGPS, setUbicacionGPS] = useState<{ lat: number; lng: number } | null>(null);
  const [isObteniendoGPS, setIsObteniendoGPS] = useState(false);

  // Obtener lista de gestores para autocompletado
  const { data: gestores } = useQuery({
    queryKey: ["gestores-activos"],
    queryFn: async () => {
      const response = await fetch("/api/gestores/activos");
      if (!response.ok) throw new Error("Error al cargar gestores");
      return response.json() as Promise<Gestor[]>;
    },
    enabled: isOpen,
  });

  const confirmarEntregaMutation = useMutation({
    mutationFn: async (data: ReturnType<typeof JSON.parse>) => {
      const response = await fetch(
        `/api/transportista/solicitudes/${solicitudId}/confirmar-entrega`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error al confirmar entrega"
        );
      }
      return response.json();
    },
    onSuccess: () => {
      onEntregaExitosa();
      handleClose();
    },
  });

  const handleClose = () => {
    setFormData({
      fechaEntrega: new Date().toISOString().slice(0, 16),
      rutGestor: "",
      nombreReceptor: "",
      rutReceptor: "",
      observaciones: "",
    });
    setGestorSeleccionado(null);
    setUbicacionGPS(null);
    setIsObteniendoGPS(false);
    onClose();
  };

  const handleRutGestorChange = (rut: string) => {
    setFormData((prev) => ({ ...prev, rutGestor: rut }));

    // Buscar gestor por RUT
    const gestor = gestores?.find((g) => g.rut === rut);
    setGestorSeleccionado(gestor || null);
  };

  const handleObtenerGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsObteniendoGPS(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacionGPS({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsObteniendoGPS(false);
        toast.success("Ubicación GPS obtenida con éxito");
      },
      (error: ReturnType<typeof JSON.parse>) => {
        setIsObteniendoGPS(false);

        let mensajeError = "No se pudo obtener la ubicación GPS.";

        switch ((error as { code?: string }).code) {
          case (error as ReturnType<typeof JSON.parse>).PERMISSION_DENIED:
            mensajeError =
              "Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación en la configuración del navegador.";
            break;
          case (error as ReturnType<typeof JSON.parse>).POSITION_UNAVAILABLE:
            mensajeError =
              "Ubicación no disponible. Verifica tu conexión a internet y que tengas GPS habilitado.";
            break;
          case (error as ReturnType<typeof JSON.parse>).TIMEOUT:
            mensajeError = "Tiempo de espera agotado al obtener ubicación. Intenta nuevamente.";
            break;
          default:
            mensajeError = "Error desconocido al obtener ubicación GPS.";
            break;
        }

        console.error("Error obteniendo ubicación GPS:", {
          code: (error as { code?: string }).code,
          message:
            error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : String(error),
        });

        toast.error(mensajeError);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Aumentado a 15 segundos
        maximumAge: 300000, // 5 minutos
      }
    );
  };

  const validarRUT = (rut: string): boolean => {
    // Validación básica de formato chileno: XX.XXX.XXX-X
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
    return rutRegex.test(rut);
  };

  const handleSubmit = async (e: ReturnType<typeof JSON.parse>) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();

    // Validaciones
    if (!formData.fechaEntrega) {
      toast.error("Debe seleccionar la fecha y hora de entrega");
      return;
    }

    if (!formData.rutGestor || !gestorSeleccionado) {
      toast.error("Debe seleccionar un gestor válido");
      return;
    }

    if (!formData.nombreReceptor.trim()) {
      toast.error("Debe ingresar el nombre del receptor");
      return;
    }

    if (!formData.rutReceptor.trim()) {
      toast.error("Debe ingresar el RUT del receptor");
      return;
    }

    if (!validarRUT(formData.rutReceptor)) {
      toast.error("El RUT del receptor debe tener formato chileno válido (XX.XXX.XXX-X)");
      return;
    }

    // Validar fecha no anterior a recolección (esto se hará en el backend también)
    const fechaEntrega = new Date(formData.fechaEntrega);
    const ahora = new Date();

    if (fechaEntrega > ahora) {
      toast.error("La fecha de entrega no puede ser futura");
      return;
    }

    // Preparar datos
    const entregaData = {
      fechaEntrega: fechaEntrega.toISOString(),
      gestorId: gestorSeleccionado.id,
      nombreReceptor: formData.nombreReceptor.trim(),
      rutReceptor: formData.rutReceptor.trim(),
      observacionesEntrega: formData.observaciones.trim() || null,
      ubicacionEntregaGPS: ubicacionGPS ? JSON.stringify(ubicacionGPS) : null,
    };

    confirmarEntregaMutation.mutate(entregaData);
  };

  // Lista de gestores para sugerencias
  const gestoresFiltrados = gestores
    ?.filter(
      (gestor) =>
        gestor.rut.toLowerCase().includes(formData.rutGestor.toLowerCase()) ||
        gestor.name.toLowerCase().includes(formData.rutGestor.toLowerCase())
    )
    .slice(0, 5); // Máximo 5 sugerencias

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Confirmar Entrega al Gestor</DialogTitle>
          <DialogDescription>
            Complete los datos de la entrega al gestor para confirmar la recepción de los
            neumáticos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fecha y Hora de Entrega */}
          <div>
            <Label htmlFor="fechaEntrega">Fecha y Hora de Entrega *</Label>
            <Input
              id="fechaEntrega"
              type="datetime-local"
              value={formData.fechaEntrega}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setFormData((prev) => ({
                  ...prev,
                  fechaEntrega: (e as ReturnType<typeof JSON.parse>).target.value,
                }))
              }
              max={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          {/* RUT del Gestor */}
          <div>
            <Label htmlFor="rutGestor">RUT del Gestor *</Label>
            <div className="relative">
              <Input
                id="rutGestor"
                type="text"
                value={formData.rutGestor}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  handleRutGestorChange((e as ReturnType<typeof JSON.parse>).target.value)
                }
                placeholder="Ej: 12.345.678-9"
                required
              />
              {gestoresFiltrados && gestoresFiltrados.length > 0 && formData.rutGestor && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {gestoresFiltrados.map((gestor) => (
                    <div
                      key={gestor.id}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, rutGestor: gestor.rut }));
                        setGestorSeleccionado(gestor);
                      }}
                    >
                      <div className="font-medium">{gestor.name}</div>
                      <div className="text-sm text-gray-600">{gestor.rut}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {gestorSeleccionado && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    Gestor seleccionado: {gestorSeleccionado.name}
                  </span>
                </div>
              </div>
            )}
            {formData.rutGestor && !gestorSeleccionado && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-800">
                    Gestor no encontrado. Verifique el RUT.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Datos del Receptor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombreReceptor">Nombre del Receptor *</Label>
              <Input
                id="nombreReceptor"
                type="text"
                value={formData.nombreReceptor}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  setFormData((prev) => ({
                    ...prev,
                    nombreReceptor: (e as ReturnType<typeof JSON.parse>).target.value,
                  }))
                }
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
              <Label htmlFor="rutReceptor">RUT del Receptor *</Label>
              <Input
                id="rutReceptor"
                type="text"
                value={formData.rutReceptor}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  setFormData((prev) => ({
                    ...prev,
                    rutReceptor: (e as ReturnType<typeof JSON.parse>).target.value,
                  }))
                }
                placeholder="12.345.678-9"
                required
              />
            </div>
          </div>

          {/* Ubicación GPS */}
          <div>
            <Label>Ubicación GPS de Entrega</Label>
            <div className="mt-2">
              {ubicacionGPS ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      GPS: {ubicacionGPS.lat.toFixed(6)}, {ubicacionGPS.lng.toFixed(6)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUbicacionGPS(null)}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Cambiar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleObtenerGPS}
                    disabled={isObteniendoGPS}
                  >
                    {isObteniendoGPS ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Obteniendo ubicación...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Obtener Ubicación GPS
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">
                    💡 Si el GPS falla, puedes continuar sin ubicación GPS. Asegúrate de permitir
                    permisos de ubicación en tu navegador.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setFormData((prev) => ({
                  ...prev,
                  observaciones: (e as ReturnType<typeof JSON.parse>).target.value,
                }))
              }
              placeholder="Observaciones adicionales sobre la entrega..."
              rows={3}
            />
          </div>

          {/* Mensajes de error */}
          {confirmarEntregaMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {confirmarEntregaMutation.error?.message || "Error al confirmar entrega"}
              </AlertDescription>
            </Alert>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={confirmarEntregaMutation.isPending || !gestorSeleccionado}
              className="bg-green-600 hover:bg-green-700"
            >
              {confirmarEntregaMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Entrega
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
