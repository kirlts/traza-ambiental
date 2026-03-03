"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  referencia: string | null;
  leida: boolean;
  createdAt: string;
}

export default function NotificacionesBell() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notificaciones", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/notificaciones");
      if (!response.ok) throw new Error("Error al cargar notificaciones");
      return response.json();
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
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

  const notificacionesTodas: Notificacion[] = data?.notificaciones || [];
  // Filtrar solo las no leídas para el dropdown
  const notificaciones: Notificacion[] = notificacionesTodas.filter((n) => !n.leida);
  const noLeidas: number = data?.noLeidas || 0;

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleNotificacionClick = (notificacion: Notificacion) => {
    // Marcar como leída
    if (!notificacion.leida) {
      marcarLeidaMutation.mutate(notificacion.id);
    }

    // Navegar si tiene referencia
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

    setIsOpen(false);
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

  const formatearFecha = (fecha: ReturnType<typeof JSON.parse>) => {
    const now = new Date();
    const notifDate = new Date(fecha);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return notifDate.toLocaleDateString("es-CL");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notificaciones"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge de contador */}
        {noLeidas > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-128 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
              {noLeidas > 0 && <span className="text-xs text-gray-600">{noLeidas} sin leer</span>}
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="overflow-y-auto flex-1">
            {notificaciones.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">🔔</div>
                <p className="text-gray-600 text-sm">No tienes notificaciones nuevas</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notificaciones.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificacionClick(notif)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      !notif.leida ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl shrink-0">{getIconoTipo(notif.tipo)}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${!notif.leida ? "font-semibold text-gray-900" : "font-medium text-gray-800"}`}
                        >
                          {notif.titulo}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.mensaje}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatearFecha(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.leida && (
                        <span className="shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/notificaciones");
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium w-full text-center"
            >
              Ver todas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
