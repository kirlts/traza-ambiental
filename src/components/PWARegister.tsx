"use client";

import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent;
  }
}

export function PWARegister() {
  useEffect(() => {
    // Solo registrar en el navegador
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      /*
      // Registrar service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Verificar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nueva versión disponible
                  // Mostrar notificación al usuario
                  Swal.fire({
                    title: 'Nueva versión disponible',
                    text: '¿Quieres actualizar la aplicación ahora?',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, actualizar',
                    cancelButtonText: 'Más tarde'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      newWorker.postMessage({ type: 'SKIP_WAITING' })
                      window.location.reload()
                    }
                  })
                }
              })
            }
          })

          // Escuchar mensajes del service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            }
          })
        })
        .catch((error) => {
        })
      */

      // Escuchar eventos de instalación PWA (sin Service Worker)
      window.addEventListener("beforeinstallprompt", (e: ReturnType<typeof JSON.parse>) => {
        (e as ReturnType<typeof JSON.parse>).preventDefault();

        // Guardar el evento para usarlo después
        window.deferredPrompt = e as BeforeInstallPromptEvent;
      });

      window.addEventListener("appinstalled", () => {
        delete window.deferredPrompt;
      });
    }
  }, []);

  return null; // Este componente no renderiza nada
}
