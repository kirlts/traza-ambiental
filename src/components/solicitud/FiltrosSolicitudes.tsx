"use client";

import { EstadoSolicitud } from "@prisma/client";

interface FiltrosSolicitudesProps {
  onFiltroCambiado: (filtros: { estado?: EstadoSolicitud; busqueda?: string }) => void;
  filtroEstado?: EstadoSolicitud;
  busqueda?: string;
}

/**
 * Componente para filtrar y buscar solicitudes
 * HU-004: Seguimiento de Solicitudes de Retiro
 */
export default function FiltrosSolicitudes({
  onFiltroCambiado,
  filtroEstado: estadoExterno,
  busqueda: busquedaExterna,
}: FiltrosSolicitudesProps) {
  const handleEstadoChange = (estado: string) => {
    onFiltroCambiado({
      estado: estado === "todos" ? undefined : (estado as EstadoSolicitud),
      busqueda: busquedaExterna || undefined,
    });
  };

  const handleBusquedaChange = (valor: string) => {
    onFiltroCambiado({
      estado: estadoExterno,
      busqueda: valor || undefined,
    });
  };

  const estados = [
    { value: "todos", label: "Todos" },
    { value: "PENDIENTE", label: "Pendientes" },
    { value: "ACEPTADA", label: "Aceptadas" },
    { value: "EN_CAMINO", label: "En Camino" },
    { value: "RECOLECTADA", label: "Recolectadas" },
    { value: "RECHAZADA", label: "Rechazadas" },
    { value: "CANCELADA", label: "Canceladas" },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por folio
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="busqueda"
              value={busquedaExterna || ""}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                handleBusquedaChange((e as ReturnType<typeof JSON.parse>).target.value)
              }
              placeholder="Ej: SOL-20251030-0001"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
            />
          </div>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por estado
          </label>
          <select
            id="estado"
            value={estadoExterno || "todos"}
            onChange={(e: ReturnType<typeof JSON.parse>) =>
              handleEstadoChange((e as ReturnType<typeof JSON.parse>).target.value)
            }
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
          >
            {estados.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
