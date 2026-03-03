// Service Worker para Sistema REP Chile
// Maneja notificaciones push, cache y sincronización en segundo plano

// const _CACHE_NAME = 'rep-chile-v1'
const STATIC_CACHE = 'rep-chile-static-v1'
const DYNAMIC_CACHE = 'rep-chile-dynamic-v1'

// Recursos a cachear
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
]

// URLs de API que no deben cachearse
const API_ENDPOINTS = [
  '/api/',
  '/_next/static/',
  '/_next/image'
]

// Evento de instalación
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Instalando...')

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE)
      await cache.addAll(STATIC_ASSETS)
      console.log('✅ Service Worker: Recursos estáticos cacheados')

      // Forzar activación inmediata
      await self.skipWaiting()
    })()
  )
})

// Evento de activación
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activándose...')

  event.waitUntil(
    (async () => {
      // Limpiar caches antiguos
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => caches.delete(name))
      )

      console.log('🧹 Service Worker: Caches antiguos limpiados')

      // Tomar control de todas las pestañas
      await clients.claim()
    })()
  )
})

// Estrategia de cache: Cache First para recursos estáticos, Network First para APIs
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // No cachear APIs ni recursos de desarrollo
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint)) ||
      url.searchParams.has('_rsc') ||
      url.protocol === 'chrome-extension:') {
    return
  }

  // Cache First para recursos estáticos
  if (STATIC_ASSETS.includes(url.pathname) ||
      url.pathname.startsWith('/_next/static/') ||
      url.pathname.includes('.css') ||
      url.pathname.includes('.js')) {

    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    )
    return
  }

  // Network First para páginas y recursos dinámicos
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cachear respuesta exitosa
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Fallback al cache si la red falla
        return caches.match(request)
      })
  )
})

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  console.log('🔔 Push recibido:', event)

  let data = {}

  if (event.data) {
    try {
      data = event.data.json()
    } catch (error) {
      console.error('❌ Error parseando datos de push:', error)
      data = { title: 'Notificación', body: event.data.text() }
    }
  }

  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    image: data.image,
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    tag: data.tag || 'rep-chile-notification',
    renotify: data.renotify || true,
    timestamp: Date.now(),
    ...data.options
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Sistema REP Chile', options)
  )
})

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notificación clickeada:', event)

  event.notification.close()

  const data = event.notification.data || {}
  const action = event.action

  let url = '/'

  // Determinar URL basado en la acción o datos
  if (action === 'view-dashboard') {
    url = '/dashboard/sistema-gestion'
  } else if (action === 'view-reports') {
    url = '/dashboard/sistema-gestion/reportes/anual'
  } else if (data.url) {
    url = data.url
  } else if (data.type === 'solicitud') {
    url = `/solicitudes/${data.id}`
  } else if (data.type === 'certificado') {
    url = `/certificados/${data.id}`
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Buscar pestaña existente
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus()
          }
        }

        // Abrir nueva pestaña
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('🔄 Sync event:', event.tag)

  if (event.tag === 'background-sync-solicitudes') {
    event.waitUntil(syncSolicitudesPendientes())
  } else if (event.tag === 'background-sync-certificados') {
    event.waitUntil(syncCertificadosPendientes())
  }
})

// Función para sincronizar solicitudes pendientes
async function syncSolicitudesPendientes() {
  try {
    // Obtener solicitudes pendientes del IndexedDB local
    const solicitudes = await getSolicitudesPendientes()

    for (const solicitud of solicitudes) {
      try {
        const response = await fetch('/api/solicitudes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(solicitud)
        })

        if (response.ok) {
          // Marcar como sincronizada
          await marcarSolicitudSincronizada(solicitud.id)
        }
      } catch (error) {
        console.error('❌ Error sincronizando solicitud:', solicitud.id, error)
      }
    }
  } catch (error) {
    console.error('❌ Error en sync de solicitudes:', error)
  }
}

// Función para sincronizar certificados pendientes
async function syncCertificadosPendientes() {
  try {
    const certificados = await getCertificadosPendientes()

    for (const certificado of certificados) {
      try {
        const response = await fetch('/api/certificados/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificado)
        })

        if (response.ok) {
          await marcarCertificadoSincronizado(certificado.id)
        }
      } catch (error) {
        console.error('❌ Error sincronizando certificado:', certificado.id, error)
      }
    }
  } catch (error) {
    console.error('❌ Error en sync de certificados:', error)
  }
}

// Funciones auxiliares (simuladas - implementarían acceso a IndexedDB)
async function getSolicitudesPendientes() {
  // Implementar acceso a IndexedDB
  return []
}

async function getCertificadosPendientes() {
  // Implementar acceso a IndexedDB
  return []
}

async function marcarSolicitudSincronizada() {
  // Implementar marcado en IndexedDB
}

async function marcarCertificadoSincronizado() {
  // Implementar marcado en IndexedDB
}

// Manejo de mensajes desde el cliente
self.addEventListener('message', (event) => {
  console.log('📨 Mensaje recibido:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' })
  }
})
