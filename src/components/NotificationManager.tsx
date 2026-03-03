"use client";

import React, { useState } from "react";
import { Bell, BellOff, TestTube, Settings, CheckCircle, XCircle } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

interface NotificationManagerProps {
  className?: string;
}

export function NotificationManager({ className = "" }: NotificationManagerProps) {
  const {
    notificationPermission,
    isSubscribed,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    sendTestNotification,
    isOnline,
  } = usePWA();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await subscribeToNotifications();
      showMessage("success", "¡Suscripción exitosa! Recibirás notificaciones push.");
    } catch (error: unknown) {
      showMessage(
        "error",
        (error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)) || "Error al suscribirse"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromNotifications();
      showMessage("success", "Has cancelado la suscripción a notificaciones.");
    } catch (error: unknown) {
      showMessage(
        "error",
        (error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)) || "Error al cancelar suscripción"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      await sendTestNotification();
      showMessage("success", "Notificación de prueba enviada. Revisa tus notificaciones.");
    } catch (error: unknown) {
      showMessage(
        "error",
        (error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)) || "Error al enviar notificación de prueba"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionStatus = () => {
    switch (notificationPermission) {
      case "granted":
        return { text: "Permitidas", color: "text-green-600", bg: "bg-green-50" };
      case "denied":
        return { text: "Bloqueadas", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { text: "No solicitadas", color: "text-yellow-600", bg: "bg-yellow-50" };
    }
  };

  const permissionStatus = getPermissionStatus();

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notificaciones Push</h3>
          <p className="text-sm text-gray-600">
            Gestiona tus notificaciones push del sistema REP Chile
          </p>
        </div>
      </div>

      {/* Estado de conexión */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
          <span className={isOnline ? "text-green-600" : "text-red-600"}>
            {isOnline ? "Conectado" : "Sin conexión"}
          </span>
        </div>
      </div>

      {/* Estado de permisos */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Permisos de notificación:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${permissionStatus.bg} ${permissionStatus.color}`}
          >
            {permissionStatus.text}
          </span>
        </div>
      </div>

      {/* Estado de suscripción */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estado de suscripción:</span>
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <Bell className="h-4 w-4 text-green-600" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            <span
              className={`text-sm font-medium ${isSubscribed ? "text-green-600" : "text-gray-600"}`}
            >
              {isSubscribed ? "Suscrito" : "No suscrito"}
            </span>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Acciones */}
      <div className="space-y-3">
        {!isSubscribed ? (
          <button
            onClick={handleSubscribe}
            disabled={isLoading || !isOnline}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Suscribiendo...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                Suscribirse a notificaciones
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleUnsubscribe}
            disabled={isLoading || !isOnline}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Cancelando...
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                Cancelar suscripción
              </>
            )}
          </button>
        )}

        {isSubscribed && (
          <button
            onClick={handleTestNotification}
            disabled={isLoading || !isOnline}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4" />
                Probar notificación
              </>
            )}
          </button>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          ¿Qué tipo de notificaciones recibirás?
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Actualizaciones de solicitudes de retiro</li>
          <li>• Certificados emitidos</li>
          <li>• Recordatorios de plazos límite</li>
          <li>• Alertas del sistema</li>
        </ul>
      </div>
    </div>
  );
}
