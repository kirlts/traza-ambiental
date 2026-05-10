# 📊 APIs del Dashboard - Sistema REP Chile

## 📋 Visión General

Las APIs del dashboard proporcionan datos en tiempo real para los indicadores clave de rendimiento (KPIs), gráficos y métricas del sistema REP.

## 🎯 Endpoints Disponibles

### 1. `/api/dashboard/kpis`

Obtiene los indicadores principales del sistema con filtros opcionales.

#### Método

```http
GET /api/dashboard/kpis
```

#### Query Parameters

| Parámetro     | Tipo   | Requerido | Descripción                         |
| ------------- | ------ | --------- | ----------------------------------- |
| `anio`        | number | ✅        | Año para filtrar datos              |
| `periodo`     | string | ❌        | Periodo: 'anio', 'trimestre', 'mes' |
| `region`      | string | ❌        | Región específica o 'todas'         |
| `tratamiento` | string | ❌        | Tipo de tratamiento o 'todos'       |
| `gestor`      | string | ❌        | ID del gestor o 'todos'             |

#### Response (200)

```json
{
  "kpis": {
    "metaRecoleccion": 1000,
    "avanceRecoleccion": 750,
    "porcentajeRecoleccion": 75,
    "metaValorizacion": 800,
    "avanceValorizacion": 600,
    "porcentajeValorizacion": 75,
    "totalCertificados": 150,
    "gestoresActivos": 25,
    "generadoresAtendidos": 45,
    "promedioMensual": 50
  },
  "proyeccion": {
    "cumpliraAtiempo": true,
    "fechaEstimada": "2025-12-31T00:00:00.000Z",
    "toneladasMensualNecesarias": 25,
    "deficit": 0
  },
  "comparacion": {
    "periodoActual": { "toneladas": 600, "porcentaje": 75 },
    "periodoAnterior": { "toneladas": 550, "porcentaje": 68.75 },
    "variacion": 50,
    "mejora": true
  }
}
```

#### Errores

- `401`: No autorizado
- `403`: Rol no autorizado
- `500`: Error interno del servidor

### 2. `/api/dashboard/distribucion-tratamientos`

Obtiene la distribución de tratamientos aplicados.

#### Método

```http
GET /api/dashboard/distribucion-tratamientos
```

#### Query Parameters

| Parámetro     | Tipo   | Requerido | Descripción         |
| ------------- | ------ | --------- | ------------------- |
| `anio`        | number | ✅        | Año para filtrar    |
| `region`      | string | ❌        | Región específica   |
| `tratamiento` | string | ❌        | Tipo de tratamiento |

#### Response (200)

```json
{
  "distribucion": [
    {
      "tratamiento": "Reciclaje Material",
      "toneladas": 450,
      "porcentaje": 45
    },
    {
      "tratamiento": "Recauuchaje",
      "toneladas": 300,
      "porcentaje": 30
    }
  ]
}
```

### 3. `/api/dashboard/toneladas-por-mes`

Obtiene las toneladas procesadas por mes.

#### Método

```http
GET /api/dashboard/toneladas-por-mes
```

#### Query Parameters

| Parámetro | Tipo   | Requerido | Descripción        |
| --------- | ------ | --------- | ------------------ |
| `anio`    | number | ✅        | Año para consultar |
| `region`  | string | ❌        | Región específica  |

#### Response (200)

```json
{
  "mensual": [
    { "mes": "enero", "toneladas": 45 },
    { "mes": "febrero", "toneladas": 52 }
    // ... todos los meses
  ]
}
```

### 4. `/api/dashboard/mapa-regiones`

Obtiene datos para el mapa de recolección por regiones.

#### Método

```http
GET /api/dashboard/mapa-regiones
```

#### Query Parameters

| Parámetro | Tipo   | Requerido | Descripción        |
| --------- | ------ | --------- | ------------------ |
| `anio`    | number | ✅        | Año para consultar |
| `periodo` | string | ❌        | Periodo del año    |

#### Response (200)

```json
{
  "regiones": [
    {
      "codigo": "13",
      "nombre": "Metropolitana de Santiago",
      "toneladas": 250,
      "intensidad": 100
    },
    {
      "codigo": "5",
      "nombre": "Valparaíso",
      "toneladas": 120,
      "intensidad": 75
    }
  ]
}
```

### 5. `/api/dashboard/ultimos-certificados`

Obtiene los certificados más recientes.

#### Método

```http
GET /api/dashboard/ultimos-certificados
```

#### Query Parameters

| Parámetro | Tipo   | Requerido | Descripción                               |
| --------- | ------ | --------- | ----------------------------------------- |
| `limit`   | number | ❌        | Número máximo de resultados (default: 10) |
| `region`  | string | ❌        | Filtrar por región                        |
| `gestor`  | string | ❌        | Filtrar por gestor                        |

#### Response (200)

```json
{
  "certificados": [
    {
      "id": "cert_123",
      "folio": "REP-2025-001",
      "fechaEmision": "2025-01-15T10:30:00Z",
      "toneladas": 25.5,
      "generador": {
        "nombre": "Empresa ABC",
        "rut": "12.345.678-5"
      },
      "gestor": {
        "nombre": "Gestor XYZ",
        "region": "Metropolitana"
      }
    }
  ]
}
```

## 🔄 Endpoints de Exportación

### 1. `/api/dashboard/export/excel`

Exporta datos del dashboard a Excel.

#### Método

```http
GET /api/dashboard/export/excel
```

#### Query Parameters

Iguales a `/api/dashboard/kpis`

#### Response (200)

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Archivo: `dashboard-cumplimiento-{anio}.xlsx`

### 2. `/api/dashboard/export/pdf`

Exporta datos del dashboard a PDF.

#### Método

```http
GET /api/dashboard/export/pdf
```

#### Query Parameters

Iguales a `/api/dashboard/kpis`

#### Response (200)

- Content-Type: `application/pdf`
- Archivo: `dashboard-cumplimiento-{anio}.pdf`

## 🔐 Autenticación y Autorización

Todos los endpoints requieren:

- **Autenticación**: JWT token válido
- **Autorización**: Roles permitidos:
  - Sistema de Gestión
  - Administrador

## ⚡ Optimización de Performance

### Caching

- Respuestas cacheadas por 5 minutos
- Invalidación automática en cambios de datos
- Cache por usuario y filtros

### Rate Limiting

- 100 requests por minuto por usuario
- 1000 requests por hora por IP

### Database Optimization

- Queries optimizadas con índices
- Joins eficientes
- Aggregations en base de datos

## 📊 Formatos de Datos

### Unidades

- **Peso**: Toneladas (convertido automáticamente de kg)
- **Porcentajes**: Valores de 0-100
- **Fechas**: ISO 8601 strings

### Rangos de Intensidad

- 0-20: Gris claro (muy bajo)
- 21-40: Gris (bajo)
- 41-60: Gris medio (medio)
- 61-80: Gris oscuro (alto)
- 81-100: Negro (muy alto)

## 🧪 Testing

### Ejemplos de Tests

```typescript
// Test básico
const response = await fetch("/api/dashboard/kpis?anio=2025");
expect(response.status).toBe(200);

// Test con filtros
const filteredResponse = await fetch("/api/dashboard/kpis?anio=2025&region=13");
const data = await filteredResponse.json();
expect(data.kpis.totalCertificados).toBeDefined();
```

## 🚨 Manejo de Errores

### Errores Comunes

- **Sin datos**: Retorna datos por defecto con valores 0
- **Filtros inválidos**: Ignora filtros no válidos
- **Database timeout**: Retry automático con fallback
- **Rate limit exceeded**: HTTP 429 con Retry-After header

### Logging

Todos los errores se registran con:

- Timestamp
- Usuario afectado
- Endpoint solicitado
- Parámetros utilizados
- Stack trace completo
