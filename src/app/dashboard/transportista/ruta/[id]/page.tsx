"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Map,
  RefreshCw,
} from "lucide-react";

import { toast } from "sonner";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MapaSolicitudRuta from "@/components/transportista/MapaSolicitudRuta";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface SolicitudRuta {
  id: string;
  folio: string;
  estado: string;
  direccionRetiro: string;
  region: string;
  comuna: string;
  fechaPreferida: Date;
  fechaAceptacion: Date | null;
  pesoTotalEstimado: number;
  cantidadTotal: number;
  nombreContacto: string;
  telefonoContacto: string;
  instrucciones: string | null;
  generador: {
    id: string;
    name: string;
    email: string;
    rut: string | null;
  };
  vehiculo: {
    id: string;
    patente: string;
    tipo: string;
    capacidadKg: number;
  };
  fotos?: string[];
}

export default function SolicitudEnRutaPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const solicitudId = params.id as string;

  const [ubicacionActual, setUbicacionActual] = useState<{ lat: number; lng: number } | null>(null);

  // Obtener datos de la solicitud
  const {
    data: solicitud,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["solicitud-ruta", solicitudId],
    queryFn: async (): Promise<SolicitudRuta> => {
      const response = await fetch(`/api/transportista/solicitudes/${solicitudId}`);
      if (!response.ok) {
        throw new Error("Error al cargar solicitud");
      }
      return response.json();
    },
  });

  // Mutación para actualizar estado
  const actualizarEstadoMutation = useMutation({
    mutationFn: async (nuevoEstado: string) => {
      const response = await fetch(`/api/transportista/solicitudes/${solicitudId}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar estado");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitud-ruta", solicitudId] });
      queryClient.invalidateQueries({ queryKey: ["solicitudes-activas-transportista"] });
    },
  });

  // Función para marcar como EN_CAMINO
  const handleMarcarEnCamino = async () => {
    const result = await Swal.fire({
      title: "¿Estás en camino?",
      text: "¿Confirmas que te diriges hacia el lugar de recolección?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, voy en camino",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      actualizarEstadoMutation.mutate("EN_CAMINO");
    }
  };

  // Función para obtener ubicación actual con estrategia de fallback
  const handleObtenerUbicacion = async (intento = 1) => {
    if (!navigator.geolocation) {
      toast.error("GPS no disponible", {
        description: "Tu navegador no soporta geolocalización.",
        action: {
          label: "🔍 Ver guía GPS",
          onClick: () => {
            window.open("/geolocalizacion", "_blank");
          },
        },
      });
      return;
    }

    // Estrategias progresivas: primero alta precisión, luego baja precisión
    const estrategias = [
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
    ];

    const estrategiaActual = estrategias[Math.min(intento - 1, estrategias.length - 1)];

    // Mostrar mensaje de carga
    const loadingToast = toast.loading(
      intento === 1
        ? "Obteniendo ubicación GPS..."
        : `Reintentando con configuración alternativa (${intento}/3)...`,
      {
        description:
          intento === 1
            ? "Esto puede tardar unos segundos. Asegúrate de estar en un lugar con buena señal."
            : "Usando modo de baja precisión para mayor compatibilidad.",
      }
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss(loadingToast);
        setUbicacionActual({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        const precision = Math.round(position.coords.accuracy);
        const mensajePrecision =
          precision > 100
            ? `⚠️ Precisión baja: ${precision}m - Considera reintentar en exterior`
            : precision > 50
              ? `⚠️ Precisión media: ${precision}m`
              : `✓ Precisión: ${precision}m`;

        toast.success("✓ Ubicación actualizada", {
          description: mensajePrecision,
          duration: 5000,
        });
      },
      async (error: unknown) => {
        toast.dismiss(loadingToast);

        // Mapear códigos de error a mensajes útiles
        let errorMessage = "Error desconocido al obtener la ubicación";
        let errorDetails = "";
        let sugerencias = "";

        switch ((error as { code?: string }).code) {
          case (error as ReturnType<typeof JSON.parse>).PERMISSION_DENIED:
            errorMessage = "Permisos de ubicación denegados";
            errorDetails = "Debes permitir el acceso a la ubicación en tu navegador.";
            sugerencias = "Ve a configuración del navegador y activa los permisos de ubicación.";
            break;
          case (error as ReturnType<typeof JSON.parse>).POSITION_UNAVAILABLE:
            errorMessage = "Señal GPS no disponible";
            errorDetails = "No se pudo determinar tu ubicación actual.";
            sugerencias =
              intento < 3
                ? "Intentando con configuración alternativa..."
                : "⚠️ IMPORTANTE: Si usas Cloudflare WARP o VPN, desactívalo. En macOS: Preferencias → Seguridad → Servicios de Ubicación. Sal al exterior si estás en interior.";
            break;
          case (error as ReturnType<typeof JSON.parse>).TIMEOUT:
            errorMessage = "Tiempo de espera agotado";
            errorDetails = "La solicitud de ubicación tardó demasiado.";
            sugerencias =
              intento < 3
                ? "Reintentando con tiempo de espera extendido..."
                : "Verifica que los servicios de ubicación estén activos en tu dispositivo.";
            break;
        }

        // Logging detallado del error (warn para intentos intermedios, error para el final)
        const logFn = intento < 3 ? console.warn : console.error;
        logFn(
          `[Geolocalización] ${intento < 3 ? "Intento" : "Error final"} ${intento}/3 (código ${(error as { code?: string }).code}): ${(error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)) || errorMessage}\n` +
            `→ ${errorDetails}\n` +
            `💡 ${sugerencias}\n` +
            `Configuración: ${JSON.stringify(estrategiaActual)}`
        );

        // Reintentar con configuración alternativa si hay más intentos
        if (
          intento < 3 &&
          ((error as { code?: string }).code ===
            (error as ReturnType<typeof JSON.parse>).POSITION_UNAVAILABLE ||
            (error as { code?: string }).code === (error as ReturnType<typeof JSON.parse>).TIMEOUT)
        ) {
          toast.info("Reintentando...", {
            description: sugerencias,
            duration: 2000,
          });

          // Esperar un momento antes de reintentar
          await new Promise((resolve) => setTimeout(resolve, 1000));
          handleObtenerUbicacion(intento + 1);
          return;
        }

        // Mostrar error al usuario con sugerencias si todos los intentos fallaron
        if (intento >= 3) {
          toast.error(errorMessage, {
            description: `${errorDetails} ${sugerencias}`,
            duration: 10000,
            action: {
              label: "🔍 Ver guía GPS",
              onClick: () => {
                window.open("/geolocalizacion", "_blank");
              },
            },
          });
        }
      },
      estrategiaActual
    );
  };

  // Función para registrar recolección
  const handleRegistrarRecoleccion = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar Recolección?",
      text: "Se registrará que has recolectado los residuos del generador.",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, confirmar recolección",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      actualizarEstadoMutation.mutate("RECOLECTADA");
    }
  };

  // Efecto para inicializar estado basado en la solicitud
  useEffect(() => {
    // Aquí se pueden agregar inicializaciones futuras
  }, [solicitud]);

  if (isLoading) {
    return (
      <DashboardLayout title="Cargando Ruta" subtitle="Por favor espere...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !solicitud) {
    return (
      <DashboardLayout title="Error" subtitle="No se pudo cargar la información de la ruta">
        <div className="container mx-auto p-4">
          <Alert className="max-w-2xl mx-auto" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar la solicitud. Puede que no tengas permisos para acceder a esta
              información.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Link href="/dashboard/transportista/solicitudes">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Solicitudes
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "ACEPTADA":
        return "bg-blue-100 text-blue-800";
      case "EN_CAMINO":
        return "bg-yellow-100 text-yellow-800";
      case "RECOLECTADA":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "ACEPTADA":
        return "✅ Aceptada";
      case "EN_CAMINO":
        return "🚚 En Camino";
      case "RECOLECTADA":
        return "📦 Recolectada";
      default:
        return estado;
    }
  };

  return (
    <DashboardLayout
      title={`📍 ${solicitud.folio}`}
      subtitle="Gestión de Ruta Activa"
      actions={
        <div className="flex items-center gap-4">
          <Badge className={getEstadoColor(solicitud.estado)}>
            {getEstadoTexto(solicitud.estado)}
          </Badge>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Link href="/dashboard/transportista/solicitudes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      }
    >
      <div className="container mx-auto max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Detalles y Acciones (4 columnas) */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            {/* Estado y Acciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#459e60]" />
                  Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className={`${getEstadoColor(solicitud.estado)} text-sm px-3 py-1`}>
                    {getEstadoTexto(solicitud.estado)}
                  </Badge>
                </div>

                {/* Acciones según estado */}
                {solicitud.estado === "ACEPTADA" && (
                  <Button
                    onClick={handleMarcarEnCamino}
                    className="w-full bg-linear-to-r from-[#459e60] to-[#3a8e50] hover:from-[#3a8e50] hover:to-[#2f7a40] text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 animate-pulse"
                    disabled={actualizarEstadoMutation.isPending}
                  >
                    {actualizarEstadoMutation.isPending ? (
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    ) : (
                      <Play className="h-6 w-6 mr-3 fill-current" />
                    )}
                    INICIAR RUTA
                  </Button>
                )}

                {solicitud.estado === "EN_CAMINO" && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleObtenerUbicacion()}
                      variant="outline"
                      className="w-full"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Actualizar Ubicación
                    </Button>

                    {ubicacionActual && (
                      <div className="text-xs text-gray-600 bg-green-50 border border-green-200 p-3 rounded">
                        <div className="font-semibold text-green-800 mb-1">✓ Ubicación Activa</div>
                        <div className="text-gray-700">
                          📍 {ubicacionActual.lat.toFixed(6)}, {ubicacionActual.lng.toFixed(6)}
                        </div>
                      </div>
                    )}

                    {!ubicacionActual && (
                      <Alert className="text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <AlertDescription>
                          <strong>Consejo GPS:</strong> Si tienes problemas obteniendo tu ubicación:
                          <ul className="list-disc ml-4 mt-1 space-y-0.5">
                            <li>
                              <strong className="text-orange-700">
                                Desactiva Cloudflare WARP o VPN
                              </strong>{" "}
                              si los tienes activos
                            </li>
                            <li>Sal al exterior o acércate a una ventana</li>
                            <li>En macOS: Verifica Servicios de Ubicación en Preferencias</li>
                          </ul>
                          <Link
                            href="/geolocalizacion"
                            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium underline"
                          >
                            🔍 Ver guía completa de configuración GPS →
                          </Link>
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleRegistrarRecoleccion}
                      disabled={actualizarEstadoMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {actualizarEstadoMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Registrar Recolección
                    </Button>
                  </div>
                )}

                {solicitud.estado === "RECOLECTADA" && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Recolección completada. Esta solicitud está lista para entrega.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Detalles de la Solicitud */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-[#459e60]" />
                  Detalles de la Solicitud
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Generador</label>
                    <p className="text-sm text-gray-900">{solicitud.generador.name}</p>
                    <p className="text-xs text-gray-500">{solicitud.generador.email}</p>
                    {solicitud.generador.rut && (
                      <p className="text-xs text-gray-500">RUT: {solicitud.generador.rut}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Contacto</label>
                    <p className="text-sm text-gray-900">{solicitud.nombreContacto}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {solicitud.telefonoContacto}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Dirección de Recolección
                  </label>
                  <p className="text-sm text-gray-900">{solicitud.direccionRetiro}</p>
                  <p className="text-xs text-gray-500">
                    {solicitud.comuna}, {solicitud.region}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Carga Estimada</label>
                    <p className="text-sm text-gray-900">{solicitud.pesoTotalEstimado} kg</p>
                    <p className="text-xs text-gray-500">{solicitud.cantidadTotal} unidades</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha Preferida</label>
                    <p className="text-sm text-gray-900">
                      {format(new Date(solicitud.fechaPreferida), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                {solicitud.instrucciones && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Instrucciones Especiales
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                      {solicitud.instrucciones}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehículo Asignado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-[#459e60]" />
                  Vehículo Asignado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{solicitud.vehiculo.patente}</p>
                    <p className="text-sm text-gray-600">{solicitud.vehiculo.tipo}</p>
                    <p className="text-xs text-gray-500">
                      Capacidad: {solicitud.vehiculo.capacidadKg} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        solicitud.pesoTotalEstimado <= solicitud.vehiculo.capacidadKg
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {solicitud.pesoTotalEstimado <= solicitud.vehiculo.capacidadKg
                        ? "✅ Capacidad suficiente"
                        : "⚠️ Sobrecarga posible"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Mapa Destacado (8 columnas) */}
          <div className="lg:col-span-8 space-y-6 order-1 lg:order-2 -mx-4 md:mx-0 w-[calc(100%+2rem)] md:w-auto">
            <Card className="h-full flex flex-col overflow-hidden min-h-[600px] rounded-none md:rounded-lg border-x-0 md:border">
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-[#459e60]" />
                  Mapa de Ruta
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 relative h-full">
                <MapaSolicitudRuta
                  solicitud={solicitud}
                  ubicacionActual={ubicacionActual}
                  className="h-full min-h-[600px] w-full rounded-none border-0"
                />
                <div className="absolute bottom-4 left-4 right-4 z-400">
                  <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto md:mx-0">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Punto de Recolección</p>
                        <p className="text-sm text-gray-600">{solicitud.direccionRetiro}</p>
                        <p className="text-xs text-gray-500">
                          {solicitud.comuna}, {solicitud.region}
                        </p>
                      </div>
                    </div>
                    {ubicacionActual && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-blue-600 font-medium">
                        <Truck className="h-3 w-3" />
                        Tu ubicación actual: {ubicacionActual.lat.toFixed(4)},{" "}
                        {ubicacionActual.lng.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
