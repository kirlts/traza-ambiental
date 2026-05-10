# 📊 API de Reportes y Estadísticas

**Base URL**: `/api/reportes`

La API de reportes proporciona acceso a estadísticas, métricas y reportes regulatorios del sistema REP.

## 📋 Tipos de Reporte

| Tipo                        | Descripción                | Periodicidad | Audiencia        |
| --------------------------- | -------------------------- | ------------ | ---------------- |
| **Reporte Anual REP**       | Cumplimiento metas anuales | Anual        | MMA, Productores |
| **Dashboard Ejecutivo**     | KPIs en tiempo real        | Tiempo real  | Administradores  |
| **Reporte de Trazabilidad** | Seguimiento de procesos    | Mensual      | Todos los roles  |
| **Estadísticas Operativas** | Métricas de rendimiento    | Semanal      | Operadores       |

## 📋 Endpoints

### GET `/api/reportes/dashboard`

Obtiene métricas principales del dashboard ejecutivo.

**Query Parameters**:

- `periodo` - `dia`, `semana`, `mes`, `ano` (default: `mes`)
- `fecha` - Fecha específica (YYYY-MM-DD)

**Response (200)**:

```json
{
  "periodo": {
    "inicio": "2025-11-01",
    "fin": "2025-11-30"
  },
  "kpis": {
    "totalSolicitudes": 450,
    "solicitudesCompletadas": 380,
    "tasaCompletitud": 84.4,
    "pesoTotalValorizado": 125000,
    "certificadosEmitidos": 320,
    "tiempoPromedioProceso": "4.2 días"
  },
  "graficos": {
    "solicitudesPorDia": [
      { "fecha": "2025-11-01", "cantidad": 15 },
      { "fecha": "2025-11-02", "cantidad": 22 }
    ],
    "distribucionPorEstado": {
      "completadas": 380,
      "en_proceso": 45,
      "pendientes": 25
    },
    "pesoPorCategoria": {
      "A": 75000,
      "B": 50000
    },
    "mapaRegional": [{ "region": "Metropolitana", "peso": 45000, "porcentaje": 36 }]
  }
}
```

### GET `/api/reportes/cumplimiento-anual`

Reporte anual de cumplimiento REP por productor.

**Query Parameters**:

- `ano` - Año del reporte (default: año actual)
- `productorId` - ID específico del productor (opcional)

**Response (200)**:

```json
{
  "ano": 2025,
  "metaAnualREP": 1000000,
  "cumplimientoTotal": {
    "pesoValorizado": 850000,
    "porcentajeCumplimiento": 85.0,
    "proyeccionFinal": 92.5
  },
  "porProductor": [
    {
      "productor": {
        "name": "Empresa ABC S.A.",
        "rut": "76.543.210-K"
      },
      "metaAsignada": 150000,
      "pesoValorizado": 127500,
      "porcentajeCumplimiento": 85.0,
      "meses": [{ "mes": "Enero", "meta": 12500, "valorizado": 11800, "porcentaje": 94.4 }]
    }
  ],
  "resumenPorCategoria": {
    "neumaticosLivianos": {
      "meta": 600000,
      "valorizado": 510000,
      "porcentaje": 85.0
    },
    "neumaticosPesados": {
      "meta": 400000,
      "valorizado": 340000,
      "porcentaje": 85.0
    }
  }
}
```

### GET `/api/reportes/trazabilidad`

Reporte de trazabilidad completo del sistema.

**Query Parameters**:

- `fechaDesde` - Fecha inicial (YYYY-MM-DD)
- `fechaHasta` - Fecha final (YYYY-MM-DD)
- `tipo` - `completo`, `resumido` (default: `resumido`)

**Response (200)**:

```json
{
  "periodo": {
    "desde": "2025-11-01",
    "hasta": "2025-11-30"
  },
  "estadisticasGenerales": {
    "totalSolicitudes": 450,
    "totalCertificados": 380,
    "pesoTotalKg": 125000,
    "tiempoPromedioDias": 4.2
  },
  "flujoPorEstados": {
    "recibidas": 450,
    "aprobadas": 435,
    "asignadas": 420,
    "en_transito": 45,
    "entregadas": 380,
    "procesadas": 380,
    "completadas": 380
  },
  "porRegion": [
    {
      "region": "Metropolitana",
      "solicitudes": 180,
      "certificados": 165,
      "pesoTotal": 52000
    }
  ],
  "porTipoNeumatico": [
    {
      "tipo": "Vehículo Liviano",
      "solicitudes": 320,
      "porcentaje": 71.1
    }
  ]
}
```

### GET `/api/reportes/gestor/[id]/rendimiento`

Reporte de rendimiento específico de un gestor.

**Response (200)**:

```json
{
  "gestor": {
    "name": "Gestor Ambiental Ltda",
    "rut": "88.777.666-5",
    "autorizacionREP": "AUT-2024-001"
  },
  "periodo": {
    "desde": "2025-11-01",
    "hasta": "2025-11-30"
  },
  "metricas": {
    "certificadosEmitidos": 45,
    "pesoTotalValorizado": 12500,
    "tiempoPromedioProceso": 2.3,
    "calidadPromedio": 4.8,
    "incidenciasReportadas": 2
  },
  "eficienciaMensual": [
    { "mes": "2025-11", "certificados": 45, "peso": 12500, "diasPromedio": 2.3 }
  ],
  "distribucionTratamientos": {
    "Trituración": 60,
    "Granulación": 25,
    "Reciclaje": 15
  }
}
```

### POST `/api/reportes/exportar`

Exporta reportes en diferentes formatos.

**Request Body**:

```json
{
  "tipoReporte": "cumplimiento_anual",
  "formato": "pdf", // pdf, excel, csv, json
  "parametros": {
    "ano": 2025,
    "incluirGraficos": true,
    "idioma": "es"
  },
  "destinatario": "admin@empresa.com" // opcional: envía por email
}
```

**Response (201)**:

```json
{
  "exportacionId": "uuid",
  "estado": "procesando",
  "urlDescarga": "/api/reportes/exportacion/uuid/descargar",
  "tiempoEstimado": "30 segundos"
}
```

### GET `/api/reportes/exportacion/[id]/estado`

Verifica el estado de una exportación.

**Response (200)**:

```json
{
  "estado": "completado",
  "urlDescarga": "/api/reportes/exportacion/uuid/descargar",
  "tamanoBytes": 2457600,
  "expiraEn": "2025-11-21T10:00:00Z"
}
```

### GET `/api/reportes/exportacion/[id]/descargar`

Descarga el archivo exportado.

**Response**: Archivo binario con headers apropiados

## 📊 Métricas en Tiempo Real

### GET `/api/reportes/kpis`

Obtiene indicadores clave de rendimiento actuales.

**Response (200)**:

```json
{
  "timestamp": "2025-11-20T14:30:00Z",
  "kpis": [
    {
      "id": "solicitudes_activas",
      "nombre": "Solicitudes Activas",
      "valor": 45,
      "unidad": "solicitudes",
      "tendencia": "up", // up, down, stable
      "cambioPorcentaje": 12.5
    },
    {
      "id": "peso_mensual",
      "nombre": "Peso Valorizado (Mes)",
      "valor": 12500,
      "unidad": "kg",
      "tendencia": "up",
      "cambioPorcentaje": 8.3
    }
  ]
}
```

## 🔍 Filtros y Personalización

### Filtros Temporales

- **Por período**: `dia`, `semana`, `mes`, `trimestre`, `ano`
- **Por rango**: `fechaDesde` y `fechaHasta`
- **Por frecuencia**: Diaria, semanal, mensual

### Filtros Geográficos

- **Por región**: Códigos de región chilena
- **Por comuna**: IDs de comunas específicas
- **Por zona**: Metropolitana, Regional

### Filtros Operativos

- **Por tipo de neumático**: Liviano, pesado, etc.
- **Por categoría REP**: A, B
- **Por estado del proceso**: Todos los estados posibles

## 📋 Formatos de Exportación

| Formato   | Descripción                      | Uso Recomendado               |
| --------- | -------------------------------- | ----------------------------- |
| **PDF**   | Reporte profesional con gráficos | Presentaciones, documentación |
| **Excel** | Datos tabulares con fórmulas     | Análisis detallado, cálculos  |
| **CSV**   | Datos planos separados por coma  | Importación a otros sistemas  |
| **JSON**  | Datos estructurados              | APIs, integraciones           |

## 🚨 Alertas y Monitoreo

### Umbrales Configurables

- **Tasa de completitud**: Alerta si < 80%
- **Tiempo de proceso**: Alerta si > 7 días promedio
- **Certificados pendientes**: Alerta si > 50 pendientes
- **Cumplimiento meta**: Alerta si < 85% mensual

### Notificaciones Automáticas

- **Reportes semanales**: Envío automático los lunes
- **Alertas críticas**: Notificación inmediata por email/SMS
- **Recordatorios**: Vencimientos de metas y plazos

## 📋 Ejemplos de Uso

### Dashboard Ejecutivo

```bash
curl "http://localhost:3000/api/reportes/dashboard?periodo=mes" \
  -H "Authorization: Bearer <token>"
```

### Reporte Anual de Cumplimiento

```bash
curl "http://localhost:3000/api/reportes/cumplimiento-anual?ano=2025" \
  -H "Authorization: Bearer <token>"
```

### Exportar Reporte

```bash
curl -X POST http://localhost:3000/api/reportes/exportar \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoReporte": "trazabilidad",
    "formato": "pdf",
    "parametros": {
      "fechaDesde": "2025-11-01",
      "fechaHasta": "2025-11-30"
    }
  }'
```

## 🔒 Permisos de Acceso

| Rol             | Dashboard    | Cumplimiento   | Trazabilidad | Exportación  |
| --------------- | ------------ | -------------- | ------------ | ------------ |
| Administrador   | ✅ Completo  | ✅ Completo    | ✅ Completo  | ✅ Todos     |
| Sistema Gestión | ✅ Completo  | ✅ Completo    | ✅ Completo  | ✅ Limitado  |
| Productor       | ❌ No acceso | ✅ Solo propio | ✅ Limitado  | ✅ Propio    |
| Generador       | ❌ No acceso | ❌ No acceso   | ✅ Propio    | ✅ Propio    |
| Transportista   | ❌ No acceso | ❌ No acceso   | ✅ Asignadas | ✅ Asignadas |
| Gestor          | ❌ No acceso | ❌ No acceso   | ✅ Propio    | ✅ Propio    |

---

## 🔗 Endpoints Relacionados

### Exportación RETC/SINADER

Para exportar datos en formato compatible con RETC y SINADER, consulte:

- **Productor/Generador**: [API de Exportación RETC - Declaración Anual](../api/exportacion-retc.md#1-exportar-declaración-anual-productorgenerador)
  - `GET /api/generador/declaracion/[id]/exportar-retc`
- **Sistema de Gestión**: [API de Exportación RETC - Reporte Anual](../api/exportacion-retc.md#2-exportar-reporte-anual-sistema-de-gestión)
  - `GET /api/sistema-gestion/reporte/[id]/exportar-sinader?anio=[año]`

Estos endpoints generan archivos Excel con formato oficial para cumplimiento regulatorio.
