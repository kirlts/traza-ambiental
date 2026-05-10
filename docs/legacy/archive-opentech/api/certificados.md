# 📄 API de Certificados Digitales

**Base URL**: `/api/certificados`

La API de certificados maneja la generación, consulta y verificación de certificados de valorización de neumáticos.

## 📋 Tipos de Certificado

| Tipo                            | Descripción                        | Vigencia   |
| ------------------------------- | ---------------------------------- | ---------- |
| **Certificado de Valorización** | Comprobante de procesamiento final | Indefinida |
| **Certificado de Trazabilidad** | Historial completo del neumático   | Indefinida |
| **Certificado Regulatorio**     | Para cumplimiento normativo        | 1 año      |

## 📋 Endpoints

### GET `/api/certificados`

Lista certificados según permisos del usuario.

**Query Parameters**:

- `page` - Página (default: 1)
- `limit` - Elementos por página (default: 10)
- `folio` - Buscar por folio específico
- `fechaDesde` - Fecha desde (YYYY-MM-DD)
- `fechaHasta` - Fecha hasta (YYYY-MM-DD)
- `gestorId` - Filtrar por gestor
- `estado` - Estado del certificado

**Response (200)**:

```json
{
  "certificados": [
    {
      "id": "uuid",
      "folio": "CERT-20251120-001",
      "fechaEmision": "2025-11-20T14:30:00Z",
      "pesoValorizado": 2500,
      "cantidadUnidades": 100,
      "estado": "activo",
      "gestor": {
        "name": "Gestor Ambiental Ltda",
        "rut": "88.777.666-5"
      },
      "solicitud": {
        "folio": "SOL-20251115-045",
        "generador": {
          "name": "Empresa S.A.",
          "rut": "76.543.210-K"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### GET `/api/certificados/[id]`

Obtiene detalles completos de un certificado.

**Response (200)**:

```json
{
  "certificado": {
    "id": "uuid",
    "folio": "CERT-20251120-001",
    "fechaEmision": "2025-11-20T14:30:00Z",
    "pesoValorizado": 2500,
    "cantidadUnidades": 100,
    "pesoBruto": 2750,
    "pesoNeto": 2500,
    "categorias": ["A", "B"],
    "tratamientos": [
      {
        "tipo": "Trituración",
        "descripcion": "Trituración mecánica primaria",
        "porcentaje": 60
      },
      {
        "tipo": "Granulación",
        "descripcion": "Granulación secundaria",
        "porcentaje": 40
      }
    ],
    "estado": "activo",
    "qrCode": "data:image/png;base64,...",
    "firmaDigital": {
      "firmado": true,
      "fechaFirma": "2025-11-20T14:35:00Z",
      "autoridad": "Gestor Autorizado REP"
    },
    "gestor": {
      "name": "Gestor Ambiental Ltda",
      "rut": "88.777.666-5",
      "autorizacionREP": "AUT-2024-001"
    },
    "solicitud": {
      "folio": "SOL-20251115-045",
      "generador": {
        "name": "Empresa S.A.",
        "rut": "76.543.210-K",
        "direccionRetiro": "Av. Industrial 123, Santiago"
      },
      "transportista": {
        "name": "Transportes ABC",
        "rut": "99.888.777-6"
      }
    },
    "evidenciaFotografica": ["proceso1.jpg", "proceso2.jpg", "producto_final.jpg"]
  }
}
```

### GET `/api/certificados/[id]/pdf`

Descarga el certificado en formato PDF.

**Response**: PDF binario con headers apropiados

**Headers de Response**:

```
Content-Type: application/pdf
Content-Disposition: inline; filename="certificado-CERT-20251120-001.pdf"
```

### POST `/api/certificados`

Genera un nuevo certificado (solo Gestores autorizados).

**Request Body**:

```json
{
  "solicitudId": "uuid-de-la-solicitud",
  "pesoValorizado": 2500,
  "cantidadUnidades": 100,
  "categorias": ["A", "B"],
  "tratamientos": [
    {
      "tipo": "Trituración",
      "descripcion": "Proceso de trituración primaria",
      "porcentaje": 60
    },
    {
      "tipo": "Granulación",
      "descripcion": "Granulación secundaria",
      "porcentaje": 40
    }
  ],
  "evidenciaFotografica": ["foto1.jpg", "foto2.jpg"],
  "observaciones": "Proceso completado según normativa"
}
```

**Response (201)**:

```json
{
  "certificado": {
    "id": "uuid",
    "folio": "CERT-20251120-001",
    "fechaEmision": "2025-11-20T14:30:00Z",
    "estado": "activo"
  },
  "pdfUrl": "/api/certificados/uuid/pdf"
}
```

### GET `/api/certificados/verificar/[folio]`

Verificación pública de certificado (sin autenticación).

**Response (200)**:

```json
{
  "valido": true,
  "certificado": {
    "folio": "CERT-20251120-001",
    "fechaEmision": "2025-11-20T14:30:00Z",
    "pesoValorizado": 2500,
    "gestor": {
      "name": "Gestor Ambiental Ltda",
      "autorizacionREP": "AUT-2024-001"
    },
    "estado": "activo",
    "firmaDigital": {
      "valida": true,
      "fechaVerificacion": "2025-11-20T15:00:00Z"
    }
  }
}
```

### PATCH `/api/certificados/[id]/estado`

Actualiza el estado de un certificado.

**Permisos**: Administrador, Sistema de Gestión

**Request Body**:

```json
{
  "estado": "revocado",
  "motivo": "Error en mediciones de peso",
  "observaciones": "Certificado revocado por corrección de datos"
}
```

### GET `/api/certificados/estadisticas`

Obtiene estadísticas de certificados.

**Response (200)**:

```json
{
  "totalCertificados": 1250,
  "porMes": [
    { "mes": "2025-11", "cantidad": 45 },
    { "mes": "2025-10", "cantidad": 38 }
  ],
  "porGestor": [
    { "gestor": "Gestor A", "certificados": 300 },
    { "gestor": "Gestor B", "certificados": 250 }
  ],
  "pesoTotalValorizado": 285000,
  "certificadosActivos": 1200,
  "certificadosRevocados": 50
}
```

## 🔍 Filtros Avanzados

### Búsqueda por Folio

```
GET /api/certificados?folio=CERT-20251120-001
```

### Filtros Combinados

```
GET /api/certificados?gestorId=uuid&fechaDesde=2025-11-01&estado=activo&page=1
```

### Búsqueda por Generador

```
GET /api/certificados?generadorRut=76543210-K
```

## 📊 Validaciones y Reglas

### Generación de Certificado

- **Permisos**: Solo gestores autorizados con certificación REP
- **Solicitud**: Debe estar en estado `delivered`
- **Peso**: Debe ser mayor a 0
- **Tratamientos**: Al menos un tratamiento definido
- **Categorías**: A, B, o ambas según clasificación
- **Fotos**: Mínimo 2 fotos del proceso

### Estados del Certificado

| Estado     | Descripción | Acciones Permitidas     |
| ---------- | ----------- | ----------------------- |
| `borrador` | En creación | Editar, eliminar        |
| `activo`   | Vigente     | Ver, descargar, revocar |
| `revocado` | Anulado     | Solo ver historial      |
| `expirado` | Vencido     | Solo ver historial      |

### Firma Digital

- **Autoridad**: Gestor REP autorizado
- **Algoritmo**: RSA-2048 con SHA-256
- **Timestamp**: Fecha y hora exacta de firma
- **Verificación**: Disponible públicamente

## 📋 Formatos de Exportación

### PDF Profesional

- **Formato**: A4, márgenes estándar
- **Contenido**: Datos completos + QR code + firma digital
- **Idioma**: Español (con opción multiidioma futura)

### JSON Estructurado

- **Uso**: Integraciones API
- **Estructura**: Datos completos + metadatos
- **Compresión**: GZIP opcional

### Excel/CSV

- **Uso**: Análisis masivo
- **Campos**: Datos principales + estadísticas
- **Filtros**: Aplicables en exportación

## 🚨 Alertas y Notificaciones

### Eventos Automáticos

- **Certificado Generado**: Notificación a generador y transportista
- **Certificado Revocado**: Alerta a todas las partes
- **Verificación Externa**: Log de consultas públicas
- **Vencimiento Próximo**: Recordatorios automáticos

## 📋 Ejemplos de Uso

### Generar Certificado

```bash
curl -X POST http://localhost:3000/api/certificados \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "solicitudId": "uuid-solicitud",
    "pesoValorizado": 2500,
    "cantidadUnidades": 100,
    "categorias": ["A"],
    "tratamientos": [{
      "tipo": "Trituración",
      "descripcion": "Proceso primario",
      "porcentaje": 100
    }]
  }'
```

### Verificar Certificado (Público)

```bash
curl http://localhost:3000/api/certificados/verificar/CERT-20251120-001
```

### Descargar PDF

```bash
curl -o certificado.pdf \
  http://localhost:3000/api/certificados/uuid/pdf \
  -H "Authorization: Bearer <token>"
```
