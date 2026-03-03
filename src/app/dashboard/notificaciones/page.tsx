"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  referencia: string | null;
  leida: boolean;
  createdAt: string;
}

export default function NotificacionesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notificaciones", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/notificaciones");
      if (!response.ok) throw new Error("Error al cargar notificaciones");
      return response.json();
    },
    enabled: !!session?.user?.id,
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

  const handleNotificacionClick = (notificacion: Notificacion) => {
    if (!notificacion.leida) {
      marcarLeidaMutation.mutate(notificacion.id);
    }

    if (notificacion.referencia) {
      if (notificacion.tipo === "declaracion_aprobada") {
        router.push("/dashboard/generador/cumplimiento/declaracion-anual/historial");
      } else if (notificacion.tipo === "alerta_plazo") {
        router.push("/dashboard/generador/cumplimiento/declaracion-anual");
      } else if (
        [
          "solicitud_creada",
          "solicitud_aceptada",
          "solicitud_rechazada",
          "entrega_confirmada",
        ].includes(notificacion.tipo)
      ) {
        router.push(`/dashboard/generador/solicitudes/${notificacion.referencia}`);
      }
    }
  };

  const getIconoTipo = (tipo: string) => {
    const iconos = {
      declaracion_aprobada: "✅",
      alerta_plazo: "⚠️",
      observacion: "📝",
      meta_cumplida: "🎯",
      solicitud_creada: "📝",
      solicitud_aceptada: "✅",
      solicitud_rechazada: "❌",
      entrega_confirmada: "📦",
      default: "🔔",
    };
    return iconos[tipo as keyof typeof iconos] || iconos.default;
  };

  const notificaciones: Notificacion[] = data?.notificaciones || [];

  return (
    <DashboardLayout title="Notificaciones" subtitle="Historial completo de tus notificaciones">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        {isLoading ? (
          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center shadow-xl">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#459e60]"></div>
            <p className="mt-4 text-sm font-medium text-[#475569]">Cargando notificaciones...</p>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-16 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eef9f2]">
              <span className="text-4xl">🔕</span>
            </div>
            <h3 className="text-2xl font-black text-[#1f2937]">No tienes notificaciones</h3>
            <p className="mx-auto mb-8 max-w-md text-sm text-[#64748b]">
              Las notificaciones importantes aparecerán aquí cuando haya actividad en tu cuenta.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-xl">
            <div className="divide-y divide-gray-100">
              {notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificacionClick(notif)}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-4 ${
                    !notif.leida ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="text-3xl shrink-0 pt-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    {getIconoTipo(notif.tipo)}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`text-lg ${!notif.leida ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}
                      >
                        {notif.titulo}
                      </h4>
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-2 bg-gray-100 px-2 py-1 rounded-full">
                        {format(new Date(notif.createdAt), "d 'de' MMMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">{notif.mensaje}</p>
                  </div>
                  {!notif.leida && (
                    <div className="shrink-0 self-center">
                      <span className="w-3 h-3 bg-blue-600 rounded-full block shadow-md ring-2 ring-blue-100"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
