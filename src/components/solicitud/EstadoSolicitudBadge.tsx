"use client";

import { EstadoSolicitud } from "@prisma/client";

interface EstadoSolicitudBadgeProps {
  estado: EstadoSolicitud;
  className?: string;
}

/**
 * Componente para mostrar el estado de una solicitud con colores y íconos
 * HU-004: Seguimiento de Solicitudes de Retiro
 */
export default function EstadoSolicitudBadge({
  estado,
  className = "",
}: EstadoSolicitudBadgeProps) {
  const configEstado = getConfigEstado(estado);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${configEstado.bgColor} ${configEstado.textColor} ${className}`}
    >
      {configEstado.icon}
      <span>{configEstado.label}</span>
    </span>
  );
}

/**
 * Retorna la configuración visual para cada estado
 */
function getConfigEstado(estado: EstadoSolicitud) {
  const configs: Record<
    EstadoSolicitud,
    { label: string; bgColor: string; textColor: string; icon: React.ReactNode }
  > = {
    PENDIENTE: {
      label: "Pendiente",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    ACEPTADA: {
      label: "Aceptada",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    EN_CAMINO: {
      label: "En Camino",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    RECOLECTADA: {
      label: "Recolectada",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    ENTREGADA_GESTOR: {
      label: "Entregada",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      ),
    },
    RECIBIDA_PLANTA: {
      label: "Recibida",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      ),
    },
    TRATADA: {
      label: "Tratada",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    RECHAZADA: {
      label: "Rechazada",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
    CANCELADA: {
      label: "Cancelada",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
  };

  return configs[estado] || configs.PENDIENTE;
}
