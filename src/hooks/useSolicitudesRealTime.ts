"use client";

import { useQuery } from "@tanstack/react-query";
import { EstadoSolicitud } from "@prisma/client";

export interface Solicitud {
  id: string;
  folio: string;
  createdAt: Date;
  direccionRetiro: string;
  region: string;
  comuna: string;
  estado: EstadoSolicitud;
  cantidadTotal: number;
  pesoTotalEstimado: number;
  categoriaA_cantidad: number;
  categoriaB_cantidad: number;
  nombreContacto: string;
  telefonoContacto: string;
  instrucciones?: string;
  fotos: string[];
  transportista?: {
    name: string;
    email: string;
  };
  generador: {
    name: string;
    email: string;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface UseSolicitudesResponse {
  success: boolean;
  data: Solicitud[];
  pagination: PaginationMeta;
}

interface UseSolicitudesOptions {
  estado?: EstadoSolicitud;
  busqueda?: string;
  page?: number;
  limit?: number;
  refetchInterval?: number;
}

/**
 * Hook personalizado para obtener y gestionar solicitudes con actualización automática
 * HU-004: Seguimiento de Solicitudes de Retiro
 *
 * @param options Opciones de filtrado y paginación
 * @returns { data, isLoading, error, refetch } - Datos de solicitudes y estado de carga
 */
export function useSolicitudesRealTime(options: UseSolicitudesOptions = {}) {
  const {
    estado,
    busqueda,
    page = 1,
    limit = 10,
    refetchInterval = 30000, // 30 segundos por defecto
  } = options;

  // Construir query params
  const params = new URLSearchParams();
  if (estado) params.append("estado", estado);
  if (busqueda) params.append("search", busqueda);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const queryKey = ["solicitudes", estado, busqueda, page, limit];

  const { data, isLoading, error, refetch } = useQuery<UseSolicitudesResponse>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`/api/solicitudes?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Error al obtener solicitudes");
      }

      const result = await response.json();
      return result;
    },
    refetchInterval, // Polling automático
    staleTime: 5000, // Considerar datos frescos por 5 segundos
    gcTime: 300000, // Cache por 5 minutos
  });

  return {
    solicitudes: data?.data || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
    isLoading,
    error,
    refetch,
  };
}
