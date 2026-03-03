"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook para obtener capacidad del transportista
 */
export function useCapacidadVehiculo() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["capacidad-vehiculo"],
    queryFn: async () => {
      const response = await fetch("/api/transportista/capacidad");

      if (!response.ok) {
        throw new Error("Error al obtener capacidad");
      }

      return response.json();
    },
    refetchInterval: 30000, // 30 segundos
  });

  return {
    capacidadTotal: data?.capacidadTotal || 0,
    capacidadUsada: data?.capacidadUsada || 0,
    capacidadDisponible: data?.capacidadDisponible || 0,
    vehiculos: data?.vehiculos || 0,
    isLoading,
    error,
    refetch,
  };
}
