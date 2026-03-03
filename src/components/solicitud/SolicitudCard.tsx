"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EstadoSolicitud } from "@prisma/client";
import EstadoSolicitudBadge from "./EstadoSolicitudBadge";

interface SolicitudCardProps {
  _id: string;
  folio: string;
  fechaCreacion: Date;
  direccion: string;
  region: string;
  estado: EstadoSolicitud;
  cantidadTotal: number;
  pesoTotalEstimado: number;
  onClick?: () => void;
}

/**
 * Componente para mostrar una tarjeta individual de solicitud
 * HU-004: Seguimiento de Solicitudes de Retiro
 */
export default function SolicitudCard({
  _id,
  folio,
  fechaCreacion,
  direccion,
  region,
  estado,
  cantidadTotal,
  pesoTotalEstimado,
  onClick,
}: SolicitudCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Información Principal - Izquierda */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{folio}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(fechaCreacion), "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <EstadoSolicitudBadge estado={estado} />
            </div>
          </div>

          {/* Información de Ubicación y Detalles en Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Dirección
                </p>
                <p className="text-sm font-medium text-gray-900 truncate">{direccion}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Región</p>
                <p className="text-sm font-medium text-gray-900">{region}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Cantidad
                </p>
                <p className="text-sm font-medium text-gray-900">{cantidadTotal || 0} unidades</p>
              </div>
            </div>
          </div>

          {/* Peso Total */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Peso total:{" "}
                <span className="font-bold text-gray-900">
                  {(pesoTotalEstimado || 0).toFixed(1)} kg
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Acción - Derecha */}
        {onClick && (
          <div className="flex-shrink-0 lg:ml-6 lg:border-l lg:border-gray-200 lg:pl-6">
            <button className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md">
              <span>Ver detalles</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
