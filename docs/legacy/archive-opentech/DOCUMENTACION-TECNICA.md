# Documentación Técnica Central - TrazAmbiental

## Visión General

Plataforma para la trazabilidad de residuos (Neumáticos Fuera de Uso - NFU) y cumplimiento de la Ley REP en Chile.

## Estructura de Roles y Permisos

### 1. Generador (Rol Unificado)

Este rol consolida las funciones operativas y normativas.

- **Dashboard**: `/dashboard/generador`
- **Capacidades**:
  - **Operativas**:
    - Crear solicitudes de retiro.
    - Gestionar inventario digital de residuos.
    - Ver trazabilidad de envíos.
  - **Cumplimiento (Ex-Productor)**:
    - Ver y configurar metas anuales de recolección.
    - Realizar Declaración Anual de puesta en el mercado.
    - Descargar certificados de valorización.

### 2. Transportista

- **Dashboard**: `/dashboard/transportista`
- **Capacidades**:
  - Gestionar flota y conductores.
  - Aceptar/Rechazar solicitudes de retiro.
  - Registrar recolecciones y entregas en planta.

### 3. Gestor (Valorizador)

- **Dashboard**: `/dashboard/gestor`
- **Capacidades**:
  - Recepcionar carga.
  - Registrar tratamientos y valorización.
  - Emitir certificados finales.

### 4. Sistema de Gestión

- **Dashboard**: `/dashboard/sistema-gestion`
- **Capacidades**:
  - Visión global del cumplimiento de metas.
  - Validación de declaraciones.
  - Reportabilidad a la autoridad.

## Modelo de Datos

El sistema utiliza PostgreSQL con Prisma ORM. Los modelos principales son:

- `User`: Usuarios del sistema con roles.
- `Role`: Definición de permisos.
- `SolicitudRetiro`: Núcleo del flujo operativo.
- `Meta`: Definición de objetivos REP.
- `DeclaracionAnual`: Registro de cumplimiento normativo.
- `AnalyticsDailySummary`: Agregador de métricas diarias para dashboards de alto rendimiento (SGI 2.0).

### Migraciones y Base de Datos

El esquema se gestiona mediante Prisma Migrate.

- **Directorio**: `prisma/migrations/`
- **Última versión crítica**: `20251125000000_add_analytics_summary` (Restauración de tabla de analítica).
- **Schema**: `prisma/schema.prisma` (Fuente de verdad).

## API Routes

Las rutas están protegidas por middleware y verificaciones de rol (`isGenerador`, `isAdmin`, etc.).

- `/api/generador/*`: Endpoints operativos.
- `/api/productor/*` -> Migrados a `/api/generador/cumplimiento/*` (conceptualmente, aunque las rutas físicas pueden mantenerse por compatibilidad o refactorizarse).
  - _Nota: En la implementación actual, las funcionalidades de productor son accesibles para usuarios con rol Generador._

## Infraestructura

- **Frontend**: Next.js 15, React, Tailwind.
- **Backend**: Next.js API Routes (Serverless functions logic).
- **Base de Datos**: PostgreSQL (Local o VPS).
- **Almacenamiento**: Local filesystem para PDFs/Excels (en versión actual).

## Notas de Desarrollo

- Se utiliza `turbopack` para el desarrollo local.
- Los estilos siguen la metodología utility-first con Tailwind.
- La autenticación persiste mediante sesiones de NextAuth.
