# Changelog

Todos los cambios notables en el Sistema TrazAmbiental (fase post-OpenTech) serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a un versionamiento iterativo interno.

## [1.2.1-diamante] - 2026-03-01

### Fixed

- **Integridad de Diamante Certificada**: Purga final de residuos técnicos (logs, tipos `as any` y `TODOs` obsoletos) en todo el repositorio.
- **Rigor ESLint**: Elevación de reglas `@typescript-eslint/no-explicit-any` y `@typescript-eslint/no-unused-vars` a nivel de `error`.
- **Saneamiento de Componentes**: Corrección de tipado en `SolicitudDetalleActions.tsx` y `usePWA.ts` para compatibilidad total con Prisma y React 19.

## [1.2.0-diamante] - 2026-03-01

### Added

- **Notificaciones de Negocio**: Implementación de envío de emails automáticos ante el rechazo de solicitudes de retiro en `rechazar/route.ts`.
- **Modernización React 19**: Migración de Dashboards (Sistema de Gestión y Generador) a TanStack Query, eliminando fetching manual y `useEffect` sincronizados.

### Fixed

- **Integridad de Diamante**: Erradicación total de `as any` en API de reportes (CSV/PDF/Excel), Generador de Reportes y Dashboards Administrativos.
- **Robustez de Filtros**: Tipado estricto de estados y manejadores en los dashboards de Admin, Gestor y Transportista.
- **Saneamiento Prisma**: Eliminación definitiva de `prisma as any` en consultas estratégicas.

## [Unreleased]

### Added

- **Modo Demo Élite**: Implementación de un entorno simulado interactivo con 6 perfiles aislados pero integrados lógicamente (Portal, Generador, Transportista, Gestor, Admin, Auditor, Sistema de Gestión).
- **Recorrido Guiado ("Tour") B2B**: Implementación de onboarding en pasos secuenciales reactivos, obligando a completar acciones clave antes de avanzar, y con una narrativa de negocio enfocada en resolver dolores de cumplimiento REP.
- **Métricas ESG (Huella de Carbono)**: Añadido indicador de "tCO2e Emisiones Evitadas" en el panel del Generador y en el consolidado del Sistema de Gestión.
- **Mock de Integraciones Nativas**: Simuladores visuales (Notificaciones/Badges) que explicitan interoperabilidad automática con Ventanilla Única, SINADER y Servicio de Impuestos Internos (SII).
- **Generación Real de PDF**: Los botones de descarga de certificados (Gestor y Auditor) ahora generan en tiempo real un documento PDF fidedigno en el navegador usando jsPDF.
- **Infografía DOM**: Script `render_diagrams.js` implementado para generar diagramas "Pixel-Perfect" usando HTML, Tailwind y Puppeteer.
- **Migración Visual**: Transición de diagramas D2 (dark mode) a DOM-rendered (light mode) purgando anglicismos e introduciendo terminología nativa de negocio (Ley REP).
- **Seguridad Centralizada**: Migración de la lógica de protección de rutas y RBAC al `middleware.ts`, eliminando la necesidad de validaciones redundantes en componentes cliente.
- **Arquitectura de Administración**: Extracción de componentes `UserTable`, `UserModal` y unificación de tipos en el módulo de usuarios para cumplimiento del MASTER-SPEC.

### Fixed

- 💥 **Sorpresa Operativa (Hydration Mismatch)**: Resolución de advertencias de hidratación servidor/cliente en `demo-context.tsx` corrigiendo el diseño de estados iniciales atados a hooks `useEffect`.
- **Efecto Cortina UX**: Adición de `padding-bottom` (pb-72) condicional al layout base del demo para evitar que componentes flotantes tapen botones de acción clave en pantallas menores.
- **Integridad Infrarroja**: Saneamiento quirúrgico de `validar-recepcion`, `kpis`, `export/excel` y `generar-certificado` tras purga de logs. Resolución de 40+ errores sintácticos (bloques `try-catch` mal cerrados, funciones duplicadas y expresiones huérfanas).
- **Compilación Limpia**: Alcanzada la meta de **0 errores TSC** en todo el repositorio estratégico.
- **Nulidad en Guías**: Implementación de _optional chaining_ en el generador de guías de despacho para evitar fallos por datos de vehículo/conductor ausentes.
- **Saneamiento de Hooks (React 19)**: Purga masiva de `useEffect` no deterministas en todos los dashboards del sistema.
- **Corrección de Determinismo**: Reparación de bugs en `useEffect` con dependencias vacías que accedían a variables externas en el módulo de Perfil.
- **Optimización de UI**: Eliminación de parpadeos (_content flashing_) en rutas protegidas mediante el bloqueo a nivel de red.
- **Sincronización de Dependencias**: Inclusión de `react-is` para asegurar compatibilidad de `recharts` con Turbopack/Next 16.
- **Comunicación de Cron**: Activación real del sistema de alertas por email en el cron job de vencimientos, integrando `sendSuspensionEmailMultiple`.
- **Sanación de API Crítica**: Implementación de tipado estricto en `/api/cron/vencimientos` y `/api/dashboard/export/excel`, eliminando el uso de `any` en capas de datos.
- **Purgado de Logs**: Eliminación global de 200+ `console.log` en rutas críticas de auth y API.
- **Determinismo React 19**: Eliminación de `useEffect` para sincronización en `ReporteAnualPage.tsx`, sustituido por carga imperativa.
- **Tipado de Infraestructura**: Remoción de casting `as any` y `@ts-ignore` en transacciones de Prisma tras regeneración del cliente.
- **[EPIC-005] Finalización de la redención técnica**: Purgado de `any` en componentes core y optimización de consultas N+1 en reportes anuales.
- Centralización de interfaces TypeScript para autenticación y vehículos en `src/types/auth.ts` y nuevos contratos en `src/types/api.ts`.
- Interfaz `BeforeInstallPromptEvent` para tipado riguroso de instalación PWA.

### Refactorización

- Resolución definitiva de ESLint v9: Migración nativa a Flat Config eliminando `FlatCompat` y configurando plugins directamente para erradicar errores circulares.
- Eliminado uso de `any` en rutas de API (`solicitudes`, `transportista/rutas`) mediante el uso de `Prisma.WhereInput`.
- Extendidos tipos de NextAuth en `next-auth.d.ts` para soportar `role`, `roles` y `rut` nativamente en `Session` y `JWT`.
- Eliminados `@ts-ignore` en los callbacks de autenticación en `lib/auth.ts`.
- Eliminación de tipos `any` en hooks de permisos (`useInventarioPermissions.ts`) y componentes de selección de vehículos (`ModalSeleccionVehiculo.tsx`).
- Corrección de tipado en `EmpresaForm.tsx` para sincronización estricta con esquemas de Zod.

### Changed

- Refactor de `FormularioSolicitud.tsx` y `useSolicitudMultiStep.ts` para eliminar `any` y sincronizar con validaciones Zod.
- Refactor de `VistaPreviaReporte.tsx` con interfaces descriptivas para datos de reporte.
- Unificación de herramientas CLI: `sync-prisma.js` y `reset-prod-db.js` como estándares únicos.
- **Aislamiento Criptográfico**: Exclusión de la capa documental pasiva (`docs/archive-opentech/`) del versionamiento de Git mediante la inclusión explícita en `.gitignore`.

### Removed

- Scripts duplicados: `sync-prod-db.js` y `test-reset-dev.sh`.
- **Purga de Logs Residuales Efímeros**: Eliminados archivos `.txt`, `.json` de validación y utilidades temporales TS a nivel de raíz y subdirectorios, manteniendo solo configuraciones estructuralmente requeridas.


## [1.1.0-sanacion] - 2026-03-01

### Added

- **Sanación de Esquema Prisma**: Sincronización de modelos `ReporteAnual`, `AlertaVencimiento`, `PushSubscription` y campos críticos como `pesoReal` (antes `pesoRomana`).
- **NextAuth v5 Compliance**: Migración completa de `getServerSession` a `auth()` en todas las API routes y componentes de servidor.
- **Robustez de Tipos**: Resolución de 257 errores de TypeScript, eliminando 'any' implícitos y corrigiendo firmas de índice en componentes visuales (`Recharts`).
- **Seguridad y RBAC**: Normalización de roles y rut en el objeto de sesión y JWT.
- **Infraestructura**: Configuración de `puppeteer` con `executablePath` dinámico para soporte multiplataforma y Docker.

### Fixed

- Corrección de lógica en el servicio de correos (Mailgun API domain checking).
- Solución de errores de indexación en dashboards de transportista y generador.
- Reparación de seeder de pruebas y lógica de cierre de inventario.

---

## [1.0.2-cleanup] - 2026-02-27

### Changed

- Refactorización estricta de `next.config.ts`, removiendo la supresión paramétrica de TypeScript y ESLint (`ignoreBuildErrors`), forzando una compilación que exponga la deuda técnica.
- Unificación de las variables de entorno duplicadas en un `.env.example` universal con la subdivisión clara para contenedores Docker.
- Reestructuración de la carpeta `data/` absorbiendo assets de referenciación json (`regiones-comunas-chile.json`).

### Removed

- Purgado definitivo del Directorio Raíz (Nivel 2 de entropía) neutralizando proyectos react front-end ajenos ocultos (`bluelock-tutorial`), unificando copias de bases SQLite innecesarias y destruyendo scripts legacy de Windows.

---

## [1.0.1-docs] - 2026-02-26 / 2026-02-27

### Added

- **Ecosistema Kairós**: Inicialización de `TODO.md`, `MEMORY.md`, `MASTER-SPEC.md` y `USER-DECISIONS.md` para asentar el motor direccional y de trazabilidad en el desarrollo.
- **Arquitectura Documental Two-Tier**: Creación de una capa activa (4 manuales ejecutivos: `01-ARQUITECTURA-Y-ESTADO-MVP.md`, `02-REGLAS-DE-NEGOCIO-Y-FLUJOS.md`, `03-ROLES-Y-PERMISOS.md`, `04-QA-ESTRATEGIA-REMEDIACION-Y-GLOSARIO.md`) y una capa pasiva (`archive-opentech/`) para resguardar la exhaustividad histórica heredada (granuralidad de reglas alométricas, leyes y diccionarios).

### Changed

- Movilizados todos los +120 documentos `.md`, esquemas, flujos y actas originales provistos por OpenTech hacia `archive-opentech/` para limpiar la raíz de `/docs` y facilitar el onboarding dinámico del nuevo equipo técnico.
- Actualizadas las cabeceras de los 4 manuales monolíticos indicando explícitamente que funcionan como guía operativa principal y que la "verdad forense" descansa en el archivo inerte.

### Removed

- **Purga de "Código de Fantasía"**: Borrado estructural de manuales sobre integraciones API REST con RETC/SINADER, Historias de Usuario muertas, y esquemas de base de datos falsos que OpenTech documentó proactivamente pero jamás implementó en el código fuente actual.
- **Limpieza de ruido**: Eliminados archivos `.md` de tamaño infinitesimal (vacíos) o redundantes que surgieron como restos de migraciones IA primitivas.
