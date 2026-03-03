import { useState, useEffect } from "react";

// Tipos para suscripciones eliminados temporalmente por falta de uso

interface PWAActions {
  subscribeToNotifications: () => Promise<void>;
  unsubscribeFromNotifications: () => Promise<void>;
  updateApp: () => void;
  sendTestNotification: () => Promise<void>;
  promptInstall: () => Promise<void>;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  notificationPermission: NotificationPermission;
  isSubscribed: boolean;
  registration: ServiceWorkerRegistration | null;
  updateAvailable: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    notificationPermission: "default",
    isSubscribed: false,
    registration: null,
    updateAvailable: false,
    deferredPrompt: null,
  });

  // Service Worker temporalmente deshabilitado
  useEffect(() => {
    // Re-habilitar cuando se resuelva el problema de routing con Turbopack
    /*
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {

          setState(prev => ({ ...prev, registration }))

          // Verificar si hay actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, updateAvailable: true }))
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('❌ Error registrando Service Worker:', error)
        })
    }
    */
  }, []);

  // Verificar permisos de notificación
  useEffect(() => {
    if ("Notification" in window) {
      setState((prev) => ({
        ...prev,
        notificationPermission: Notification.permission,
      }));
    }
  }, []);

  // Verificar estado de instalación PWA
  useEffect(() => {
    const checkInstallable = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInWebAppiOS =
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

      setState((prev) => ({
        ...prev,
        isInstalled: isStandalone || isInWebAppiOS,
      }));
    };

    checkInstallable();

    // Escuchar cambios en el modo de display
    window.matchMedia("(display-mode: standalone)").addEventListener("change", checkInstallable);

    return () => {
      window
        .matchMedia("(display-mode: standalone)")
        .removeEventListener("change", checkInstallable);
    };
  }, []);

  // Escuchar eventos de instalación PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: ReturnType<typeof JSON.parse>) => {
      (e as ReturnType<typeof JSON.parse>).preventDefault();
      setState((prev) => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: e as BeforeInstallPromptEvent,
      }));
    };

    const handleAppInstalled = () => {
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        deferredPrompt: null,
      }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Escuchar estado de conexión
  useEffect(() => {
    const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Verificar suscripción existente
  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();

          setState((prev) => ({
            ...prev,
            isSubscribed: !!subscription,
          }));
        } catch {
          // Error de suscripción manejado silenciosamente
        }
      }
    };

    checkSubscription();
  }, []);

  const subscribeToNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Las notificaciones push no están soportadas en este navegador");
    }

    try {
      // Solicitar permiso
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("Permiso de notificación denegado");
      }

      setState((prev) => ({ ...prev, notificationPermission: permission }));

      // Service Worker temporalmente deshabilitado
      // const registration = state.registration || await navigator.serviceWorker.register('/sw.js')
      return;

      /*
      // Crear suscripción
      const subscription = await (registration as ServiceWorkerRegistration).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      });

      // Enviar suscripción al servidor
      const response = await fetch("/api/notificaciones/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
              auth: arrayBufferToBase64(subscription.getKey("auth")!),
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error enviando suscripción al servidor");
      }

      setState((prev) => ({ ...prev, isSubscribed: true }));

      */
    } catch (error: unknown) {
      throw error;
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Notificar al servidor
        await fetch("/api/notificaciones/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });
      }

      setState((prev) => ({ ...prev, isSubscribed: false }));
    } catch (error: unknown) {
      throw error;
    }
  };

  const updateApp = () => {
    if (state.registration && state.registration.waiting) {
      state.registration.waiting.postMessage({ type: "SKIP_WAITING" });

      // Recargar la página cuando el nuevo SW tome control
      window.location.reload();
    }
  };

  const sendTestNotification = async () => {
    try {
      const response = await fetch("/api/notificaciones/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "¡Notificación de Prueba!",
          body: "Esta es una notificación de prueba del Sistema REP Chile.",
          icon: "/icon-192.png",
        }),
      });

      if (!response.ok) {
        throw new Error("Error enviando notificación de prueba");
      }
    } catch (error: unknown) {
      throw error;
    }
  };

  const promptInstall = async () => {
    if (state.deferredPrompt) {
      await state.deferredPrompt.prompt();
      await state.deferredPrompt.userChoice;
      setState((prev) => ({ ...prev, deferredPrompt: null, isInstallable: false }));
    }
  };

  return {
    ...state,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    updateApp,
    sendTestNotification,
    promptInstall,
  };
}

/**
 * Utilidades para VAPID keys eliminadas por falta de uso tras elevación de rigor ESLint
 */
