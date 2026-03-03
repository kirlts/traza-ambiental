"use client";

import { useQuery } from "@tanstack/react-query";
import { EstadoSolicitud } from "@prisma/client";

export interface Solicitud {
  id: string;
  folio: string;
  direccionRetiro: string;
  region: string;
  comuna: string;
  fechaPreferida: Date;
  pesoTotalEstimado: number;
  cantidadTotal: number;
  estado: EstadoSolicitud;
  generador: {
    id: string;
    name: string;
    email: string;
    rut: string;
  };
}

interface UseSolicitudesOptions {
  region?: string;
  comuna?: string;
  pesoMin?: number;
  pesoMax?: number;
  orderBy?: "fecha" | "peso";
  page?: number;
  limit?: number;
  refetchInterval?: number;
}

/**
 * Hook para obtener solicitudes disponibles (PENDIENTES) con polling
 */
export function useSolicitudesDisponibles(options: UseSolicitudesOptions = {}) {
  const {
    region,
    comuna,
    pesoMin,
    pesoMax,
    orderBy = "fecha",
    page = 1,
    limit = 20,
    refetchInterval = 30000, // 30 segundos
  } = options;

  const params = new URLSearchParams();
  if (region) params.append("region", region);
  if (comuna) params.append("comuna", comuna);
  if (pesoMin) params.append("pesoMin", pesoMin.toString());
  if (pesoMax) params.append("pesoMax", pesoMax.toString());
  params.append("orderBy", orderBy);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["solicitudes-disponibles", region, comuna, pesoMin, pesoMax, orderBy, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/transportista/solicitudes-disponibles?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener solicitudes");
      }

      return response.json();
    },
    refetchInterval,
    staleTime: 5000,
  });

  return {
    solicitudes: (data?.solicitudes || []) as Solicitud[],
    pagination: data?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
    isLoading,
    error,
    refetch,
  };
}
