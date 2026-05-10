# 🔔 APIs de Notificaciones - Sistema REP Chile

## 📋 Visión General

Las APIs de notificaciones permiten enviar notificaciones push a usuarios del sistema, tanto manualmente como automáticamente desde eventos del sistema.

## 🎯 Endpoints Disponibles

### 1. `/api/notificaciones/subscribe`

Suscribe un dispositivo a notificaciones push.

#### Método

```http
POST /api/notificaciones/subscribe
```

#### Headers

```
Content-Type: application/json
Authorization: Bearer <token>
```

#### Body

```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BKxXh...",
      "auth": "8pVx..."
    }
  }
}
```

#### Response (200)

```json
{
  "success": true,
  "message": "Suscripción guardada exitosamente",
  "subscriptionId": "sub_123456"
}
```

#### Errores

- `400`: Suscripción inválida
- `401`: No autorizado
- `409`: Ya existe suscripción para este endpoint

### 2. `/api/notificaciones/unsubscribe`

Cancela la suscripción a notificaciones push.

#### Método

```http
POST /api/notificaciones/unsubscribe
```

#### Body

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/..."
}
```

#### Response (200)

```json
{
  "success": true,
  "message": "Suscripción eliminada exitosamente",
  "deletedCount": 1
}
```

### 3. `/api/notificaciones/test`

Envía una notificación de prueba al usuario actual.

#### Método

```http
POST /api/notificaciones/test
```

#### Body

```json
{
  "title": "Notificación de Prueba",
  "body": "Esta es una notificación de prueba",
  "icon": "/icon-192.png",
  "actions": [
    {
      "action": "view-dashboard",
      "title": "Ver Dashboard"
    }
  ]
}
```

#### Response (200)

```json
{
  "success": true,
  "message": "Notificación de prueba enviada a 1 dispositivo(s)",
  "results": {
    "total": 1,
    "successful": 1,
    "failed": 0
  }
}
```

### 4. `/api/notificaciones/send`

Envía notificaciones a usuarios específicos o grupos (solo administradores).

#### Método

```http
POST /api/notificaciones/send
```

#### Body

```json
{
  "title": "Mantenimiento Programado",
  "body": "El sistema estará en mantenimiento mañana a las 2:00 AM",
  "type": "broadcast",
  "icon": "/icon-192.png",
  "actions": [
    {
      "action": "view-dashboard",
      "title": "Ver Dashboard"
    }
  ],
  "requireInteraction": true,
  "tag": "maintenance-2025-01-15"
}
```

#### Tipos de Envío

##### Broadcast (todos los usuarios)

```json
{
  "type": "broadcast"
}
```

##### Usuarios específicos

```json
{
  "type": "users",
  "userIds": ["user_123", "user_456"]
}
```

##### Por roles

```json
{
  "type": "roles",
  "roles": ["Sistema de Gestión", "Productor"]
}
```

#### Response (200)

```json
{
  "success": true,
  "message": "Notificación enviada a 25 dispositivo(s)",
  "results": {
    "total": 25,
    "successful": 23,
    "failed": 2,
    "type": "broadcast",
    "recipients": "Todos los usuarios"
  }
}
```

## 🔐 Autenticación y Autorización

### Suscripción/Desuscripción

- **Autenticación**: JWT token requerido
- **Autorización**: Cualquier usuario autenticado

### Envío de Notificaciones

- **Autenticación**: JWT token requerido
- **Autorización**: Solo usuarios con roles:
  - `admin`
  - `Sistema de Gestión`

## 📱 Payload de Notificaciones

### Estructura Completa

```json
{
  "title": "Título de la notificación",
  "body": "Contenido principal",
  "icon": "/icon-192.png",
  "badge": "/icon-192.png",
  "image": "https://example.com/image.jpg",
  "data": {
    "url": "/dashboard",
    "type": "certificado",
    "id": "cert_123"
  },
  "actions": [
    {
      "action": "view",
      "title": "Ver Detalles"
    },
    {
      "action": "dismiss",
      "title": "Descartar"
    }
  ],
  "requireInteraction": true,
  "silent": false,
  "tag": "unique-notification-tag",
  "timestamp": 1640995200000
}
```

### Acciones Soportadas

- `view-dashboard`: Navega al dashboard
- `view-reports`: Navega a reportes
- `view-[tipo]`: Navega a entidad específica (ej: `view-certificado`)

## ⚙️ Configuración VAPID

Para que funcionen las notificaciones push, necesitas configurar las claves VAPID:

```bash
# Generar claves VAPID
npm run generate:vapid

# Agregar a .env.local
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

## 🔄 Service Worker

El Service Worker maneja las notificaciones en el navegador:

### Registro Automático

```javascript
// Se registra automáticamente en app/layout.tsx
navigator.serviceWorker.register("/sw.js");
```

### Eventos Manejados

- `push`: Recibe notificaciones del servidor
- `notificationclick`: Maneja clics en notificaciones
- `sync`: Sincronización en segundo plano

## 📊 Base de Datos

### Modelo PushSubscription

```prisma
model PushSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String
  keys      Json     // { p256dh: string, auth: string }
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation("PushSubscriptionsUsuario", fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, endpoint])
  @@index([userId])
  @@map("push_subscriptions")
}
```

### Modelo Notificacion

```prisma
model Notificacion {
  id         String   @id @default(cuid())
  userId     String
  tipo       String   // 'push', 'push_failed', 'system'
  titulo     String
  mensaje    String
  referencia String?
  leida      Boolean  @default(false)
  createdAt  DateTime @default(now())
  user       User     @relation("NotificacionesUsuario", fields: [userId], references: [id])

  @@index([userId, leida])
  @@index([createdAt])
  @@map("notificaciones")
}
```

## 🧪 Testing

### Test de Suscripción

```typescript
// Simular suscripción exitosa
const mockSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/test",
  keys: { p256dh: "test_key", auth: "test_auth" },
};

const response = await fetch("/api/notificaciones/subscribe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ subscription: mockSubscription }),
});

expect(response.status).toBe(200);
```

### Test de Notificación

```typescript
// Enviar notificación de prueba
const response = await fetch("/api/notificaciones/test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Test",
    body: "Test notification",
  }),
});

expect(response.status).toBe(200);
```

## 🚨 Manejo de Errores

### Errores de Suscripción

- **Endpoint inválido**: Verificar que el endpoint sea una URL válida
- **Llaves malformadas**: Las llaves VAPID deben ser strings base64 válidas
- **Suscripción duplicada**: No se permiten múltiples suscripciones al mismo endpoint

### Errores de Envío

- **Suscripción expirada**: El navegador puede expirar suscripciones automáticamente
- **Dispositivo offline**: Las notificaciones se pierden si el dispositivo está offline
- **Permisos revocados**: El usuario puede revocar permisos de notificación

### Logging

Se registra automáticamente:

- Suscripciones exitosas/fallidas
- Envíos de notificaciones
- Errores de entrega
- Interacciones del usuario (clics)

## 📈 Métricas y Monitoreo

### KPIs de Notificaciones

- **Tasa de entrega**: Notificaciones entregadas / enviadas
- **Tasa de apertura**: Notificaciones cliqueadas / entregadas
- **Suscripciones activas**: Número de suscripciones válidas
- **Errores de envío**: Número de fallos por día

### Alertas

- Baja tasa de entrega (< 80%)
- Aumento de errores de envío
- Dispositivos offline prolongadamente
- Problemas con VAPID keys

## 🔧 Troubleshooting

### Problema: Notificaciones no llegan

1. Verificar permisos del navegador
2. Comprobar configuración VAPID
3. Revisar logs del servidor
4. Verificar conectividad a FCM/APNs

### Problema: Suscripción falla

1. Verificar que el Service Worker esté registrado
2. Comprobar configuración HTTPS
3. Revisar errores en consola del navegador

### Problema: Notificaciones duplicadas

1. Usar `tag` único para evitar duplicados
2. Implementar lógica de deduplicación
3. Configurar `renotify: false` si es apropiado
