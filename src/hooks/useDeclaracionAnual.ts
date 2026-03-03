import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface PeriodoActivo {
  anio: number;
  fechaLimite: string;
  diasRestantes: number;
  declaracionExistente: Declaracion | null;
}

interface Declaracion {
  id: string;
  anio: number;
  estado: string;
  folio: string | null;
  totalUnidades: number;
  totalToneladas: number;
  categorias: Array<{
    id: string;
    nombre: string;
    cantidadUnidades: number;
    pesoToneladas: number;
  }>;
  fechaDeclaracion: string | null;
}

export function usePeriodoActivo() {
  return useQuery<PeriodoActivo>({
    queryKey: ["periodo-activo"],
    queryFn: async () => {
      const response = await fetch("/api/productor/declaracion-anual/periodo-activo");
      if (!response.ok) {
        throw new Error("Error al obtener período activo");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useGuardarDeclaracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReturnType<typeof JSON.parse>) => {
      const response = await fetch("/api/productor/declaracion-anual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error al guardar declaración"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodo-activo"] });
      queryClient.invalidateQueries({ queryKey: ["declaraciones"] });
    },
  });
}

export function useEnviarDeclaracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (declaracionId: string) => {
      const response = await fetch(`/api/productor/declaracion-anual/${declaracionId}/enviar`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error al enviar declaración"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodo-activo"] });
      queryClient.invalidateQueries({ queryKey: ["declaraciones"] });
      queryClient.invalidateQueries({ queryKey: ["metas"] });
    },
  });
}

export function useDeclaraciones() {
  return useQuery<{ declaraciones: Declaracion[] }>({
    queryKey: ["declaraciones"],
    queryFn: async () => {
      const response = await fetch("/api/productor/declaracion-anual");
      if (!response.ok) {
        throw new Error("Error al obtener declaraciones");
      }
      return response.json();
    },
  });
}
