"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSolicitudesDisponibles } from "@/hooks/useSolicitudesDisponibles";
import { useSolicitudesActivas } from "@/hooks/useSolicitudesActivas";
import SolicitudCardTransportista from "@/components/transportista/SolicitudCardTransportista";
import FiltrosSolicitudesTransportista from "@/components/transportista/FiltrosSolicitudesTransportista";
import FlotaDashboard from "@/components/transportista/FlotaDashboard";
import ModalRechazoSolicitud from "@/components/transportista/ModalRechazoSolicitud";
import ModalSeleccionVehiculo from "@/components/transportista/ModalSeleccionVehiculo";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MotivoRechazo } from "@prisma/client";
import { List, Map, Truck, Package } from "lucide-react";
import { toast } from "sonner";

// Importar mapa dinámicamente para evitar problemas de SSR
const MapaSolicitudes = dynamic(() => import("@/components/transportista/MapaSolicitudes"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  ),
});

export default function SolicitudesDisponiblesPage() {
  const router = useRouter();
  const [vistaActual, setVistaActual] = useState<"lista" | "mapa">("lista");
  const [filtros, setFiltros] = useState({});
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<string | null>(null);
  const [modalRechazoOpen, setModalRechazoOpen] = useState(false);
  const [modalVehiculoOpen, setModalVehiculoOpen] = useState(false);
  const [folioActual, setFolioActual] = useState("");
  const [pesoRequerido, setPesoRequerido] = useState(0);

  const { solicitudes, isLoading, error, refetch } = useSolicitudesDisponibles(filtros);
  const { data: solicitudesActivas, isLoading: isLoadingActivas } = useSolicitudesActivas();

  // Obtener regiones para filtros
  const [regiones, setRegiones] = useState<Array<{ codigo: string; nombre: string }>>([]);

  // Cargar regiones
  useEffect(() => {
    fetch("/api/regiones")
      .then((res) => res.json())
      .then((data: ReturnType<typeof JSON.parse>) => setRegiones(data.data || []))
      .catch(console.error);
  }, []);

  const handleAceptar = (solicitud: ReturnType<typeof JSON.parse>) => {
    setSolicitudSeleccionada(solicitud.id);
    setFolioActual(solicitud.folio);
    setPesoRequerido(solicitud.pesoTotalEstimado);
    setModalVehiculoOpen(true);
  };

  const handleConfirmarAceptacion = async (vehiculoId: string) => {
    if (!solicitudSeleccionada) return;

    try {
      // Log de seguimiento eliminado

      const response = await fetch(
        `/api/transportista/solicitudes/${solicitudSeleccionada}/aceptar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehiculoId }),
        }
      );

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
          console.error("[FRONTEND] Error response:", JSON.stringify(error, null, 2));
        } catch (e: unknown) {
          console.error("[FRONTEND] No se pudo parsear el error como JSON:", e);
          error = { message: "Error de comunicación con el servidor" };
        }
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).message ||
            (error as ReturnType<typeof JSON.parse>).error ||
            "Error al aceptar solicitud"
        );
      }

      await response.json();

      toast.success("Solicitud aceptada exitosamente", {
        description: `La solicitud ${folioActual || "seleccionada"} ha sido asignada a tu vehículo.`,
        duration: 5000,
      });
      refetch();
      setModalVehiculoOpen(false);
    } catch (error: unknown) {
      console.error("[FRONTEND] Error capturado:", error);
      toast.error(
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error al aceptar solicitud"
      );
    }
  };

  const handleRechazar = (solicitudId: string, folio: string) => {
    setSolicitudSeleccionada(solicitudId);
    setFolioActual(folio);
    setModalRechazoOpen(true);
  };

  const handleConfirmarRechazo = async (motivo: MotivoRechazo, detalles?: string) => {
    if (!solicitudSeleccionada) return;

    const response = await fetch(
      `/api/transportista/solicitudes/${solicitudSeleccionada}/rechazar`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo, detalles }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al rechazar");
    }

    toast.success("Solicitud rechazada", {
      description: "La solicitud ha sido rechazada correctamente.",
    });
    refetch();
  };

  if (isLoading || isLoadingActivas) {
    return (
      <DashboardLayout title="Gestión de Solicitudes" subtitle="Cargando...">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#459e60]/20 border-t-[#459e60] mx-auto"></div>
            <p className="mt-4 text-[#2b3b4c]/60 font-medium">Cargando solicitudes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Gestión de Solicitudes" subtitle="Error">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error al cargar solicitudes</h2>
          <p className="text-red-600">{(error as ReturnType<typeof JSON.parse>).message}</p>
          <button
            onClick={() => refetch()}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Gestión de Solicitudes"
      subtitle="Administra solicitudes disponibles y tus servicios activos"
      actions={
        <div className="flex gap-3">
          <button
            onClick={() => setVistaActual("lista")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md ${
              vistaActual === "lista"
                ? "bg-[#459e60] text-white"
                : "bg-white text-[#2b3b4c] border-2 border-[#459e60]/20 hover:bg-[#f6fcf3]"
            }`}
          >
            <List className="h-5 w-5" />
            Lista
          </button>
          <button
            onClick={() => setVistaActual("mapa")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md ${
              vistaActual === "mapa"
                ? "bg-[#459e60] text-white"
                : "bg-white text-[#2b3b4c] border-2 border-[#459e60]/20 hover:bg-[#f6fcf3]"
            }`}
          >
            <Map className="h-5 w-5" />
            Mapa
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <FlotaDashboard />

        <FiltrosSolicitudesTransportista onFiltrosChange={setFiltros} regiones={regiones} />

        {vistaActual === "lista" ? (
          <div className="space-y-8">
            {/* Solicitudes Activas */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2b3b4c] flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#459e60] to-[#4fa362] rounded-full"></div>
                  <Truck className="h-7 w-7 text-[#459e60]" />
                  Mis Solicitudes Activas
                </h2>
                <p className="text-sm text-[#2b3b4c]/60 mt-2 ml-10">
                  Servicios que has aceptado y están en proceso
                </p>
              </div>
              {solicitudesActivas && solicitudesActivas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {solicitudesActivas.map((solicitud: ReturnType<typeof JSON.parse>) => (
                    <SolicitudCardTransportista
                      key={solicitud.id}
                      solicitud={solicitud}
                      mostrarAcciones="activa"
                      onVerDetalles={() => {
                        router.push(`/dashboard/transportista/ruta/${solicitud.id}`);
                      }}
                      onAceptar={() => {}} // No se usa para activas
                      onRechazar={() => {}} // No se usa para activas
                    />
                  ))}
                </div>
              ) : (
                <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f6fcf3] border-2 border-[#459e60]/20 rounded-xl p-8 text-center shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#459e60]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <Truck className="h-16 w-16 text-[#459e60]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#2b3b4c] mb-2">
                      No tienes solicitudes activas
                    </h3>
                    <p className="text-[#2b3b4c]/60">
                      Las solicitudes que aceptes aparecerán aquí para su seguimiento.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Solicitudes Disponibles */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2b3b4c] flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#4fa362] to-[#459e60] rounded-full"></div>
                  <Package className="h-7 w-7 text-[#4fa362]" />
                  Solicitudes Disponibles
                </h2>
                <p className="text-sm text-[#2b3b4c]/60 mt-2 ml-10">
                  Nuevas solicitudes de recolección en tu zona
                </p>
              </div>
              {solicitudes.length === 0 ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f0fdf4] border-2 border-[#4fa362]/20 rounded-xl p-8 text-center shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4fa362]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <Package className="h-16 w-16 text-[#4fa362]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#2b3b4c] mb-2">
                      No hay solicitudes disponibles
                    </h3>
                    <p className="text-[#2b3b4c]/60 mb-4">
                      No hay solicitudes pendientes en tu zona actualmente.
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="bg-[#4fa362] hover:bg-[#459e60] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {solicitudes.map((solicitud: ReturnType<typeof JSON.parse>) => (
                    <SolicitudCardTransportista
                      key={solicitud.id}
                      solicitud={solicitud}
                      mostrarAcciones="disponible"
                      onVerDetalles={() => {
                        router.push(`/dashboard/transportista/solicitudes/${solicitud.id}`);
                      }}
                      onAceptar={() => handleAceptar(solicitud)}
                      onRechazar={() => handleRechazar(solicitud.id, solicitud.folio)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <MapaSolicitudes
            solicitudes={solicitudes}
            onAceptar={handleAceptar}
            onRechazar={handleRechazar}
          />
        )}

        <ModalRechazoSolicitud
          isOpen={modalRechazoOpen}
          folio={folioActual}
          onClose={() => setModalRechazoOpen(false)}
          onConfirm={handleConfirmarRechazo}
        />

        <ModalSeleccionVehiculo
          isOpen={modalVehiculoOpen}
          solicitudFolio={folioActual}
          pesoRequerido={pesoRequerido}
          onClose={() => setModalVehiculoOpen(false)}
          onConfirm={handleConfirmarAceptacion}
        />
      </div>
    </DashboardLayout>
  );
}
