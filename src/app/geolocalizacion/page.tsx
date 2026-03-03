"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function GeolocalizacionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [ubicacion, setUbicacion] = useState<{
    latitud: number;
    longitud: number;
    precision: number;
    timestamp: number;
  } | null>(null);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string>("");
  const [soportaGeolocalizacion, setSoportaGeolocalizacion] = useState(true);
  const [estadoPermisos, setEstadoPermisos] = useState<"granted" | "denied" | "prompt" | "unknown">(
    "unknown"
  );
  const [diagnostico, setDiagnostico] = useState<{
    navegador: string;
    so: string;
    protocolo: string;
    idioma: string;
  } | null>(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Verificar si el navegador soporta geolocalización y obtener información del sistema
  useEffect(() => {
    if (!navigator.geolocation) {
      setSoportaGeolocalizacion(false);
      setError("Tu navegador no soporta la API de Geolocalización");
    }

    // Obtener información del sistema para diagnóstico
    const info = {
      navegador: navigator.userAgent,
      so: navigator.platform,
      protocolo: window.location.protocol,
      idioma: navigator.language,
    };
    setDiagnostico(info);

    // Verificar permisos si la API está disponible
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setEstadoPermisos(result.state as "granted" | "denied" | "prompt");

          // Escuchar cambios en los permisos
          result.onchange = () => {
            setEstadoPermisos(result.state as "granted" | "denied" | "prompt");
          };
        })
        .catch((_err) => {});
    }
  }, []);

  const obtenerUbicacion = () => {
    setError("");
    setCargando(true);
    setUbicacion(null);

    if (!navigator.geolocation) {
      setError("La API de Geolocalización no está disponible en este navegador");
      setCargando(false);
      return;
    }

    const opciones: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { coords, timestamp } = position;

        setUbicacion({
          latitud: coords.latitude,
          longitud: coords.longitude,
          precision: coords.accuracy,
          timestamp: timestamp,
        });

        setCargando(false);
      },
      (error: ReturnType<typeof JSON.parse>) => {
        setCargando(false);

        switch ((error as { code?: string }).code) {
          case (error as ReturnType<typeof JSON.parse>).PERMISSION_DENIED:
            setError(`❌ PERMISO DENEGADO (Código: 1)

El navegador no tiene permiso para acceder a tu ubicación.

📋 SOLUCIÓN:

En Chrome/Brave:
 • Haz clic en el icono 🔒 en la barra de direcciones
 • Ve a "Configuración del sitio"
 • En "Ubicación", selecciona "Permitir"

En Safari:
 • Ve a Safari → Configuración → Sitios web → Localización
 • Busca este sitio y cambia a "Permitir"

Recarga la página después de cambiar los permisos.`);
            break;

          case (error as ReturnType<typeof JSON.parse>).POSITION_UNAVAILABLE:
            setError(`❌ UBICACIÓN NO DISPONIBLE (Código: 2)

El sistema operativo no pudo determinar tu ubicación.

⚠️ CAUSAS COMUNES:

1️⃣ **Cloudflare WARP o VPN activo**
   → Desactívalo temporalmente desde la barra de menú

2️⃣ Servicios de Ubicación desactivados (macOS):
   → 🍎 → Preferencias del Sistema
   → Privacidad y Seguridad → Servicios de Ubicación
   → Activa "Servicios de Ubicación" ✅
   → Activa tu navegador en la lista ✅

3️⃣ Sin conexión WiFi (en Macs):
   → Las MacBooks necesitan WiFi para ubicación
   → Conéctate a una red WiFi

4️⃣ Estás en interior:
   → Sal al exterior o acércate a una ventana
   → Las señales GPS funcionan mejor en exterior`);
            break;

          case (error as ReturnType<typeof JSON.parse>).TIMEOUT:
            setError(`❌ TIEMPO DE ESPERA AGOTADO (Código: 3)

La solicitud tardó más de 10 segundos sin respuesta.

📋 SOLUCIÓN:

1️⃣ Verifica tu conexión a internet
2️⃣ Conéctate a una red WiFi (mejora la precisión)
3️⃣ Intenta nuevamente en unos segundos
4️⃣ Si persiste, reinicia tu navegador`);
            break;

          default:
            setError(`❌ ERROR DESCONOCIDO (Código: ${(error as { code?: string }).code})

Mensaje del sistema: ${error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)}

Por favor, verifica la configuración de privacidad de tu sistema.`);
        }
      },
      opciones
    );
  };

  if (status === "loading") {
    return (
      <DashboardLayout title="Cargando..." subtitle="Por favor espere">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#459e60]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout
      title="🌍 Configuración de Geolocalización"
      subtitle="Guía completa para configurar correctamente los servicios de ubicación GPS"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Card Principal - Prueba de GPS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#459e60]" />
              Probar Ubicación GPS
            </CardTitle>
            <CardDescription>
              Verifica que tu GPS esté funcionando correctamente antes de usarlo en rutas
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Verificación de soporte */}
            {!soportaGeolocalizacion && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Tu navegador no soporta la API de Geolocalización. Considera actualizar tu
                  navegador.
                </AlertDescription>
              </Alert>
            )}

            {/* Diagnóstico del Sistema */}
            {diagnostico && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
                <h4 className="font-semibold text-blue-900 mb-2">🔍 Estado del Sistema</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Sistema Operativo:</span>
                    <span>{diagnostico.so}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Protocolo:</span>
                    <span>{diagnostico.protocolo}</span>
                    {diagnostico.protocolo === "https:" && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-medium">Permisos:</span>
                    {estadoPermisos === "granted" && (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Concedido
                      </span>
                    )}
                    {estadoPermisos === "denied" && (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        Denegado
                      </span>
                    )}
                    {estadoPermisos === "prompt" && (
                      <span className="text-orange-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Pendiente
                      </span>
                    )}
                    {estadoPermisos === "unknown" && (
                      <span className="text-gray-600">Desconocido</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botón para obtener ubicación */}
            <Button
              onClick={obtenerUbicacion}
              disabled={cargando || !soportaGeolocalizacion}
              className="w-full bg-[#459e60] hover:bg-[#3a8e50]"
              size="lg"
            >
              {cargando ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Obteniendo ubicación...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Obtener Mi Ubicación
                </>
              )}
            </Button>

            {/* Mostrar errores */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>
            )}

            {/* Mostrar ubicación */}
            {ubicacion && (
              <div className="space-y-4 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />✅ Ubicación Obtenida Correctamente
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Latitud</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {ubicacion.latitud.toFixed(6)}°
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Longitud</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {ubicacion.longitud.toFixed(6)}°
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Precisión</p>
                    <p className="text-xl font-semibold text-gray-800">
                      ±{ubicacion.precision.toFixed(1)} metros
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Timestamp</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(ubicacion.timestamp).toLocaleString("es-ES")}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps?q=${ubicacion.latitud},${ubicacion.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    📍 Ver en Google Maps →
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guía para macOS */}
        {diagnostico?.so.includes("Mac") && (
          <Card className="border-2 border-blue-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🍎 Guía Específica para macOS
              </CardTitle>
              <CardDescription>
                Pasos detallados para resolver problemas de geolocalización en Mac
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong className="text-orange-900">
                      ⚠️ IMPORTANTE: Desactiva Cloudflare WARP o VPNs
                    </strong>
                    <p className="mt-2 text-orange-800">
                      Cloudflare WARP, VPNs y proxies interfieren con la geolocalización al enrutar
                      tu tráfico a través de servidores en otras ubicaciones. Si los usas,
                      desactívalos temporalmente desde la barra de menú superior de macOS.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                    <h5 className="font-semibold mb-2 text-lg">
                      1️⃣ Activar Servicios de Ubicación del Sistema
                    </h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                      <li>Haz clic en el menú 🍎 (esquina superior izquierda)</li>
                      <li>
                        Selecciona <strong>"Configuración del Sistema"</strong> o{" "}
                        <strong>"System Settings"</strong>
                      </li>
                      <li>
                        Ve a <strong>"Privacidad y Seguridad"</strong> →{" "}
                        <strong>"Privacy & Security"</strong>
                      </li>
                      <li>
                        Haz clic en <strong>"Servicios de Ubicación"</strong> →{" "}
                        <strong>"Location Services"</strong>
                      </li>
                      <li>Activa el interruptor principal ✅ (si está desactivado)</li>
                    </ol>
                  </div>

                  <div className="bg-white p-4 rounded border-l-4 border-green-500">
                    <h5 className="font-semibold mb-2 text-lg">2️⃣ Dar Permisos al Navegador</h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                      <li>En la misma ventana de "Servicios de Ubicación"</li>
                      <li>Desplázate hacia abajo en la lista de aplicaciones</li>
                      <li>
                        Busca tu navegador: <strong>Google Chrome</strong>, <strong>Safari</strong>,{" "}
                        <strong>Brave</strong>, <strong>Firefox</strong>, <strong>Arc</strong>
                      </li>
                      <li>Marca el checkbox ✅ junto al nombre del navegador</li>
                    </ol>
                  </div>

                  <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                    <h5 className="font-semibold mb-2 text-lg">3️⃣ Conectarse a WiFi</h5>
                    <p className="text-sm ml-2">
                      ⚠️ <strong>MUY IMPORTANTE:</strong> Las MacBooks usan triangulación WiFi para
                      determinar la ubicación. <strong>No tienen chip GPS</strong> como los iPhones.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                      <li>Conéctate a una red WiFi (aunque tengas internet por cable)</li>
                      <li>
                        El WiFi debe estar <strong>activado y conectado</strong>
                      </li>
                      <li>Sin WiFi activo → Sin ubicación ❌</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border-l-4 border-orange-500">
                    <h5 className="font-semibold mb-2 text-lg">4️⃣ Reiniciar el Navegador</h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                      <li>
                        Cierra <strong>completamente</strong> el navegador (⌘+Q)
                      </li>
                      <li>Espera 5 segundos</li>
                      <li>Vuelve a abrir el navegador</li>
                      <li>Regresa a esta página e intenta nuevamente</li>
                    </ol>
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-yellow-300">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>💡 ¿Por qué las Macs necesitan WiFi?</strong>
                    <p className="mt-2">
                      A diferencia de iPhones y iPads, las MacBooks no tienen chip GPS. Apple usa un
                      sistema de triangulación WiFi que:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Detecta redes WiFi cercanas</li>
                      <li>Compara sus direcciones MAC con una base de datos de Apple</li>
                      <li>Calcula tu ubicación aproximada basándose en estas redes</li>
                    </ul>
                    <p className="mt-2 font-semibold">Sin WiFi activo → Sin ubicación ❌</p>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notas importantes */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>⚠️ Notas importantes:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>La geolocalización solo funciona en contextos seguros (HTTPS o localhost)</li>
              <li>El usuario debe dar permiso explícito para acceder a su ubicación</li>
              <li>La precisión depende del hardware disponible (GPS, WiFi, IP)</li>
              <li>
                <strong>En macOS: DEBES tener WiFi activado y conectado</strong> 📶
              </li>
              <li>
                <strong>Cloudflare WARP y VPNs interfieren con la geolocalización</strong>
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
