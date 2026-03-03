"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  MapPin,
  Building2,
  Calendar,
  Package,
  Truck,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface SolicitudCardTransportistaProps {
  solicitud: {
    id: string;
    folio: string;
    direccionRetiro: string;
    region: string;
    comuna: string;
    fechaPreferida: Date;
    pesoTotalEstimado: number;
    cantidadTotal: number;
    estado?: string;
    fechaAceptacion?: Date | null;
    vehiculo?: {
      patente: string;
      tipo: string;
    };
    generador: {
      name: string;
    };
  };
  mostrarAcciones: "disponible" | "activa";
  onVerDetalles: () => void;
  onAceptar: () => void;
  onRechazar: () => void;
}

export default function SolicitudCardTransportista({
  solicitud,
  mostrarAcciones,
  onVerDetalles,
  onAceptar,
  onRechazar,
}: SolicitudCardTransportistaProps) {
  return (
    <div className="relative overflow-hidden bg-white border-2 border-[#459e60]/20 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Decoración de esquina */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#459e60]/10 to-transparent rounded-full -mr-12 -mt-12"></div>

      {/* Header con folio y estado */}
      <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-white" />
              <h3 className="text-lg font-bold text-white">{solicitud.folio}</h3>
            </div>
            <p className="text-sm text-white/90">
              {solicitud.region} - {solicitud.comuna}
            </p>
          </div>
          {mostrarAcciones === "activa" && solicitud.estado && (
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                solicitud.estado === "ACEPTADA"
                  ? "bg-white text-[#459e60]"
                  : solicitud.estado === "EN_CAMINO"
                    ? "bg-[#f5792a] text-white"
                    : "bg-white/20 text-white"
              }`}
            >
              {solicitud.estado === "ACEPTADA"
                ? "Aceptada"
                : solicitud.estado === "EN_CAMINO"
                  ? "En Camino"
                  : solicitud.estado}
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Generador */}
        <div className="flex items-start gap-2">
          <Building2 className="h-4 w-4 text-[#459e60] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide">
              Generador
            </p>
            <p className="text-sm font-medium text-[#2b3b4c] truncate">
              {solicitud.generador.name}
            </p>
          </div>
        </div>

        {/* Dirección */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-[#459e60] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide">
              Dirección
            </p>
            <p className="text-sm text-[#2b3b4c]">{solicitud.direccionRetiro}</p>
          </div>
        </div>

        {/* Carga */}
        <div className="flex items-start gap-2">
          <Package className="h-4 w-4 text-[#459e60] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide">
              Carga Estimada
            </p>
            <p className="text-sm font-medium text-[#2b3b4c]">
              <span className="text-[#459e60] font-bold">{solicitud.pesoTotalEstimado} kg</span>
              <span className="text-[#2b3b4c]/60"> • </span>
              <span className="text-[#459e60] font-bold">{solicitud.cantidadTotal}</span>
              <span className="text-[#2b3b4c]/80"> unidades</span>
            </p>
          </div>
        </div>

        {/* Vehículo (solo para activas) */}
        {mostrarAcciones === "activa" && solicitud.vehiculo && (
          <div className="flex items-start gap-2 bg-[#f6fcf3] rounded-lg p-2">
            <Truck className="h-4 w-4 text-[#459e60] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide">
                Vehículo Asignado
              </p>
              <p className="text-sm font-medium text-[#2b3b4c]">
                {solicitud.vehiculo.patente}{" "}
                <span className="text-[#2b3b4c]/60">({solicitud.vehiculo.tipo})</span>
              </p>
            </div>
          </div>
        )}

        {/* Fecha */}
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-[#459e60] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#2b3b4c]/60 uppercase tracking-wide">
              {mostrarAcciones === "activa" ? "Fecha Aceptación" : "Fecha Preferida"}
            </p>
            <p className="text-sm font-medium text-[#2b3b4c]">
              {mostrarAcciones === "activa" && solicitud.fechaAceptacion
                ? format(new Date(solicitud.fechaAceptacion), "dd 'de' MMMM, yyyy HH:mm", {
                    locale: es,
                  })
                : format(new Date(solicitud.fechaPreferida), "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="p-4 pt-0">
        {mostrarAcciones === "disponible" ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onVerDetalles}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-[#2b3b4c] bg-white border-2 border-[#2b3b4c]/20 rounded-lg hover:bg-[#2b3b4c]/5 hover:border-[#2b3b4c]/40 transition-all"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Ver</span>
            </button>
            <button
              onClick={onAceptar}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#459e60] to-[#44a15d] rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Aceptar</span>
            </button>
            <button
              onClick={onRechazar}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-[#dc2626] bg-white border-2 border-[#dc2626]/30 rounded-lg hover:bg-red-50 hover:border-[#dc2626]/50 transition-all"
            >
              <XCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Rechazar</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onVerDetalles}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#459e60] to-[#44a15d] rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            <Eye className="h-5 w-5" />
            <span>Ver Detalles de Ruta</span>
          </button>
        )}
      </div>
    </div>
  );
}
