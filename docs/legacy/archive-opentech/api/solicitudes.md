# 📋 API de Solicitudes de Retiro

**Base URL**: `/api/solicitudes`

La API de solicitudes gestiona el ciclo completo de retiro de neumáticos desde su creación hasta entrega final.

## 📋 Estados de Solicitud

| Estado             | Descripción                | Próximo Estado          |
| ------------------ | -------------------------- | ----------------------- |
| `draft`            | Borrador inicial           | `pending_approval`      |
| `pending_approval` | Esperando aprobación admin | `approved` / `rejected` |
| `approved`         | Aprobada por administrador | `assigned`              |
| `assigned`         | Asignada a transportista   | `in_transit`            |
| `in_transit`       | En transporte              | `delivered`             |
| `delivered`        | Entregada al gestor        | `processing`            |
| `processing`       | En procesamiento           | `completed`             |
| `completed`        | Completada con certificado | -                       |
| `cancelled`        | Cancelada                  | -                       |
| `rejected`         | Rechazada                  | -                       |

## 📋 Endpoints

### POST `/api/solicitudes`

Crea una nueva solicitud de retiro (solo Generadores).

**Request Body**:

```json
{
  "tipoNeumatico": "neumatico_vehiculo_liviano",
  "cantidadUnidades": 100,
  "pesoEstimadoKg": 2500,
  "direccionRetiro": {
    "calle": "Av. Industrial 123",
    "regionId": 13,
    "comunaId": 101,
    "referencias": "Frente a la bodega principal"
  },
  "fechaPreferenteRetiro": "2025-11-25",
  "contactoRetiro": {
    "nombre": "Juan Pérez",
    "telefono": "+56912345678",
    "email": "contacto@empresa.com"
  },
  "observaciones": "Neumáticos de repuesto almacenados",
  "fotos": ["foto1.jpg", "foto2.jpg"]
}
```

**Response (201)**:

```json
{
  "solicitud": {
    "id": "SOL-20251120-001",
    "folio": "SOL-20251120-001",
    "estado": "draft",
    "fechaCreacion": "2025-11-20T10:00:00Z",
    "generador": {
      "id": "uuid",
      "name": "Empresa S.A.",
      "rut": "76.543.210-K"
    }
  }
}
```

### GET `/api/solicitudes`

Lista solicitudes según rol del usuario.

**Query Parameters**:

- `estado` - Filtrar por estado
- `page` - Página (default: 1)
- `limit` - Elementos por página (default: 10)
- `fechaDesde` - Fecha desde (YYYY-MM-DD)
- `fechaHasta` - Fecha hasta (YYYY-MM-DD)

**Response (200)**:

```json
{
  "solicitudes": [
    {
      "id": "SOL-20251120-001",
      "folio": "SOL-20251120-001",
      "estado": "approved",
      "fechaCreacion": "2025-11-20T10:00:00Z",
      "tipoNeumatico": "neumatico_vehiculo_liviano",
      "cantidadUnidades": 100,
      "pesoEstimadoKg": 2500,
      "generador": {
        "name": "Empresa S.A.",
        "rut": "76.543.210-K"
      },
      "transportista": {
        "name": "Transportes ABC",
        "rut": "99.888.777-6"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET `/api/solicitudes/[id]`

Obtiene detalles completos de una solicitud.

**Response (200)**:

```json
{
  "solicitud": {
    "id": "SOL-20251120-001",
    "folio": "SOL-20251120-001",
    "estado": "in_transit",
    "fechaCreacion": "2025-11-20T10:00:00Z",
    "tipoNeumatico": "neumatico_vehiculo_liviano",
    "cantidadUnidades": 100,
    "pesoEstimadoKg": 2500,
    "direccionRetiro": {
      "calle": "Av. Industrial 123",
      "regionId": 13,
      "comunaId": 101
    },
    "generador": { "name": "Empresa S.A." },
    "transportista": { "name": "Transportes ABC" },
    "gestor": { "name": "Gestor Ambiental Ltda" },
    "historialEstados": [
      {
        "estado": "draft",
        "fecha": "2025-11-20T10:00:00Z",
        "usuario": "Juan Pérez"
      },
      {
        "estado": "approved",
        "fecha": "2025-11-20T14:30:00Z",
        "usuario": "Admin Sistema"
      }
    ]
  }
}
```

### PATCH `/api/solicitudes/[id]/estado`

Actualiza el estado de una solicitud.

**Permisos**: Transportista, Gestor, Administrador

**Request Body**:

```json
{
  "estado": "delivered",
  "observaciones": "Entrega completada sin novedades",
  "evidenciaFotos": ["entrega1.jpg", "entrega2.jpg"]
}
```

**Response (200)**:

```json
{
  "solicitud": {
    "id": "SOL-20251120-001",
    "estado": "delivered",
    "fechaActualizacion": "2025-11-22T16:00:00Z"
  }
}
```

### POST `/api/solicitudes/[id]/asignar-transportista`

Asigna una solicitud a un transportista.

**Permisos**: Administrador, Sistema de Gestión

**Request Body**:

```json
{
  "transportistaId": "uuid-del-transportista",
  "observaciones": "Asignación automática por proximidad"
}
```

### GET `/api/solicitudes/[id]/historial`

Obtiene el historial completo de cambios de estado.

**Response (200)**:

```json
{
  "historial": [
    {
      "id": "uuid",
      "estadoAnterior": "approved",
      "estadoNuevo": "assigned",
      "fechaCambio": "2025-11-21T09:00:00Z",
      "usuario": {
        "name": "Admin Sistema",
        "role": "Administrador"
      },
      "observaciones": "Asignado a Transportes ABC"
    }
  ]
}
```

## 🔍 Filtros y Búsqueda

### Filtros Disponibles

- **Por Estado**: `estado=approved,in_transit`
- **Por Fecha**: `fechaDesde=2025-11-01&fechaHasta=2025-11-30`
- **Por Tipo**: `tipoNeumatico=neumatico_vehiculo_liviano`
- **Por Región**: `regionId=13`
- **Por Folio**: `folio=SOL-20251120-001`

### Ordenamiento

- `fechaCreacion` (default: desc)
- `fechaActualizacion`
- `cantidadUnidades`
- `pesoEstimadoKg`

## 📊 Estadísticas

### GET `/api/solicitudes/estadisticas`

Obtiene métricas generales de solicitudes.

**Response (200)**:

```json
{
  "totalSolicitudes": 150,
  "porEstado": {
    "draft": 5,
    "approved": 25,
    "in_transit": 30,
    "completed": 85,
    "cancelled": 5
  },
  "porMes": [
    { "mes": "2025-11", "cantidad": 45 },
    { "mes": "2025-10", "cantidad": 38 }
  ],
  "tiempoPromedioProceso": "3.2 días"
}
```

## 📝 Validaciones

### Creación de Solicitud

- **Cantidad**: Mínimo 1, máximo 10,000 unidades
- **Peso**: Calculado automáticamente según tipo de neumático
- **Dirección**: Campos requeridos (calle, región, comuna)
- **Fecha**: No puede ser anterior a hoy
- **Fotos**: Máximo 5 fotos, formatos: JPG, PNG (máx 5MB cada una)

### Transición de Estados

- **draft → pending_approval**: Solo el creador
- **pending_approval → approved**: Solo Administrador
- **approved → assigned**: Solo Administrador/Sistema
- **assigned → in_transit**: Solo Transportista asignado
- **in_transit → delivered**: Solo Transportista asignado
- **delivered → processing**: Solo Gestor asignado

## 🚨 Webhooks y Notificaciones

El sistema envía notificaciones automáticas en:

- Cambio de estado
- Asignación de transportista/gestor
- Aproximación de fecha programada
- Retrasos en el proceso

## 📋 Ejemplos de Uso

### Crear Solicitud

```bash
curl -X POST http://localhost:3000/api/solicitudes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoNeumatico": "neumatico_vehiculo_liviano",
    "cantidadUnidades": 50,
    "direccionRetiro": {
      "calle": "Calle Industrial 123",
      "regionId": 13,
      "comunaId": 101
    }
  }'
```

### Listar Solicitudes Activas

```bash
curl "http://localhost:3000/api/solicitudes?estado=approved,in_transit&page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```
