"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowLeft, Printer, FileText, Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalSeleccionVehiculo from "@/components/transportista/ModalSeleccionVehiculo";
import ModalRechazoSolicitud from "@/components/transportista/ModalRechazoSolicitud";
import { MotivoRechazo } from "@prisma/client";
import { toast } from "sonner";

interface SolicitudDetalleActionsProps {
  solicitud: {
    id: string;
    folio: string;
    pesoTotalEstimado: number;
    estado: string;
  };
  guiaDespacho?: {
    id: string;
    numeroGuia: string;
    pdfUrl: string | null;
  } | null;
  isAssigned: boolean;
  isPending: boolean;
}

export default function SolicitudDetalleActions({
  solicitud,
  guiaDespacho,
  isAssigned,
  isPending,
}: SolicitudDetalleActionsProps) {
  const router = useRouter();
  const [modalVehiculoOpen, setModalVehiculoOpen] = useState(false);
  const [modalRechazoOpen, setModalRechazoOpen] = useState(false);
  const [isGeneratingGuia, setIsGeneratingGuia] = useState(false);

  const handleAceptar = async (vehiculoId: string) => {
    try {
      const response = await fetch(`/api/transportista/solicitudes/${solicitud.id}/aceptar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehiculoId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).message || "Error al aceptar solicitud"
        );
      }

      toast.success("Solicitud aceptada exitosamente", {
        description: `La solicitud ${solicitud.folio} ha sido asignada a tu vehículo.`,
        duration: 5000,
      });

      router.push("/dashboard/transportista/solicitudes");
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error al aceptar solicitud", {
        description:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Ocurrió un error inesperado",
      });
    }
  };

  const handleRechazar = async (motivo: MotivoRechazo, detalles?: string) => {
    try {
      const response = await fetch(`/api/transportista/solicitudes/${solicitud.id}/rechazar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo, detalles }),
      });

      if (!response.ok) {
        throw new Error("Error al rechazar");
      }

      toast.success("Solicitud rechazada", {
        description: "La solicitud ha sido rechazada correctamente.",
      });
      router.push("/dashboard/transportista/solicitudes");
      router.refresh();
    } catch (e: unknown) {
      console.error(e);
      toast.error("Error al rechazar la solicitud", {
        description: "Por favor intenta nuevamente más tarde.",
      });
    }
  };

  const handleGenerarGuia = async () => {
    setIsGeneratingGuia(true);
    try {
      // Por ahora asumimos que el peso y cantidad son los estimados,
      // en una versión avanzada se podría abrir un modal para confirmar "peso real"
      const response = await fetch(`/api/transportista/solicitudes/${solicitud.id}/generar-guia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // pesoReal: ... // Opcional si se quiere corregir al momento de cargar
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).message || "Error al generar Guía"
        );
      }

      const data = await response.json();
      toast.success("Guía de Despacho Generada", {
        description: `Folio: ${data.data.guia.numeroGuia}. Estado actualizado a RECOLECTADA.`,
      });

      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)
          : "Error desconocido";
      toast.error("Error", { description: message });
    } finally {
      setIsGeneratingGuia(false);
    }
  };

  const isReadyToCollect =
    isAssigned &&
    (solicitud.estado === "ACEPTADA" ||
      solicitud.estado === "EN_CAMINO" ||
      (solicitud.estado === "RECOLECTADA" && !guiaDespacho)); // Permitir si ya está recolectada pero falta la guía

  const hasGuia = !!guiaDespacho;

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-6 print:hidden items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold h-10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        {isPending && (
          <>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-10 shadow-sm"
              onClick={() => setModalVehiculoOpen(true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aceptar Solicitud
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold h-10 shadow-sm"
              onClick={() => setModalRechazoOpen(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
          </>
        )}

        {isReadyToCollect && !hasGuia && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 shadow-sm"
            onClick={handleGenerarGuia}
            disabled={isGeneratingGuia}
          >
            {isGeneratingGuia ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Truck className="h-4 w-4 mr-2" />
            )}
            Registrar Recolección y Generar Guía
          </Button>
        )}

        {hasGuia && (
          <Button
            variant="outline"
            className="border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold h-10"
            onClick={() => guiaDespacho?.pdfUrl && window.open(guiaDespacho.pdfUrl, "_blank")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Guía de Despacho ({guiaDespacho.numeroGuia})
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold h-10"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Pantalla
        </Button>
      </div>

      <ModalSeleccionVehiculo
        isOpen={modalVehiculoOpen}
        solicitudFolio={solicitud.folio}
        pesoRequerido={solicitud.pesoTotalEstimado}
        onClose={() => setModalVehiculoOpen(false)}
        onConfirm={handleAceptar}
      />

      <ModalRechazoSolicitud
        isOpen={modalRechazoOpen}
        folio={solicitud.folio}
        onClose={() => setModalRechazoOpen(false)}
        onConfirm={handleRechazar}
      />
    </>
  );
}
