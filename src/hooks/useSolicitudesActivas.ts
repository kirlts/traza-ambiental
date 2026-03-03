import { useQuery } from "@tanstack/react-query";

export interface SolicitudActiva {
  id: string;
  folio: string;
  estado: string;
  direccionRetiro: string;
  region: string;
  comuna: string;
  fechaPreferida: Date;
  pesoTotalEstimado: number;
  cantidadTotal: number;
  fechaAceptacion: Date | null;
  generador: {
    name: string;
  };
  vehiculo: {
    patente: string;
    tipo: string;
  };
}

interface ApiResponse {
  solicitudes: SolicitudActiva[];
  capacidadUsada: number;
  totalSolicitudes: number;
}

export function useSolicitudesActivas() {
  return useQuery({
    queryKey: ["solicitudes-activas-transportista"],
    queryFn: async (): Promise<SolicitudActiva[]> => {
      const response = await fetch("/api/transportista/mis-solicitudes");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (response.status === 403) {
          throw new Error("No tienes permisos para acceder a esta información.");
        }
        throw new Error("Error al cargar solicitudes activas");
      }
      const data: ApiResponse = await response.json();
      // Filtrar solo las solicitudes activas (ACEPTADA o EN_CAMINO)
      return data.solicitudes.filter(
        (solicitud: ReturnType<typeof JSON.parse>) =>
          solicitud.estado === "ACEPTADA" || solicitud.estado === "EN_CAMINO"
      );
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });
}
