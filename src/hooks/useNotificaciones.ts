import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useNotificaciones() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const response = await fetch("/api/notificaciones");
      if (!response.ok) throw new Error("Error al cargar notificaciones");
      return response.json();
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });

  const marcarLeidaMutation = useMutation({
    mutationFn: async (notificacionId: string) => {
      const response = await fetch("/api/notificaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificacionId }),
      });
      if (!response.ok) throw new Error("Error al marcar notificación");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });

  return {
    notificaciones: data?.notificaciones || [],
    noLeidas: data?.noLeidas || 0,
    isLoading,
    marcarLeida: marcarLeidaMutation.mutate,
  };
}
