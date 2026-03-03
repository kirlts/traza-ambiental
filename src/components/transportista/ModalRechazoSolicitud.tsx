"use client";

import { useState } from "react";
import { MotivoRechazo } from "@prisma/client";
import { AlertTriangle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ModalRechazoSolicitudProps {
  isOpen: boolean;
  folio: string;
  onClose: () => void;
  onConfirm: (motivo: MotivoRechazo, detalles?: string) => Promise<void>;
}

export default function ModalRechazoSolicitud({
  isOpen,
  folio,
  onClose,
  onConfirm,
}: ModalRechazoSolicitudProps) {
  const [motivo, setMotivo] = useState<MotivoRechazo>("FUERA_DE_ZONA");
  const [detalles, setDetalles] = useState("");
  const [cargando, setCargando] = useState(false);

  const motivos = [
    { value: "FUERA_DE_ZONA", label: "Fuera de mi zona de cobertura" },
    { value: "CARGA_NO_COMPATIBLE", label: "Carga no compatible con mi vehículo" },
    { value: "CAPACIDAD_EXCEDIDA", label: "Capacidad excedida" },
    { value: "HORARIO_NO_DISPONIBLE", label: "Horario no disponible" },
    { value: "OTRO", label: "Otro motivo" },
  ];

  const handleSubmit = async () => {
    setCargando(true);
    try {
      await onConfirm(motivo, detalles || undefined);
      onClose();
      setDetalles("");
    } catch {
      console.error("Error al rechazar");
      // alert('Error al rechazar la solicitud') // Removed alert in favor of error handling in parent or silent fail
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl border-0 z-[9999]">
        <DialogHeader className="space-y-3 pb-4 border-b border-gray-100">
          <div className="mx-auto bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-[#2b3b4c]">
            Rechazar Solicitud
          </DialogTitle>
          <DialogDescription className="text-center text-[#2b3b4c]/60">
            Indica el motivo por el cual rechazas la solicitud #{folio}.
            <br />
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="motivo" className="text-sm font-medium text-[#2b3b4c]">
              Motivo de rechazo *
            </Label>
            <select
              id="motivo"
              value={motivo}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setMotivo((e as ReturnType<typeof JSON.parse>).target.value as MotivoRechazo)
              }
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
            >
              {motivos.map((m: ReturnType<typeof JSON.parse>) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="detalles" className="text-sm font-medium text-[#2b3b4c]">
              Detalles adicionales (opcional)
            </Label>
            <Textarea
              id="detalles"
              value={detalles}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setDetalles((e as ReturnType<typeof JSON.parse>).target.value)
              }
              maxLength={500}
              rows={3}
              className="resize-none focus:ring-red-500/20 focus:border-red-500"
              placeholder="Explica brevemente por qué no puedes tomar esta solicitud..."
            />
            <p className="text-xs text-gray-500 text-right">{detalles.length}/500</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-3 border-t border-gray-100 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={cargando}
            className="w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={cargando}
            variant="destructive"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
          >
            {cargando ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Confirmar Rechazo
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
