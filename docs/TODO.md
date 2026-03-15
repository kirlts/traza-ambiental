# TODO: Traza Ambiental

## [EPIC-001] Saneamiento de Errores Programáticos

Meta: Alcanzar 0 errores en `eslint` y `tsc`.

- [x] [TASK-001] Corregir shebangs en scripts/ (deben ir en la línea 1) - 2026-03-02 23:28
- [x] [TASK-002] Eliminar `as any` en `src/app/api/notificaciones/send/route.ts` - 2026-03-02 23:28
- [x] [TASK-003] Eliminar `as any` en `src/app/api/sistema-gestion/` (metas, historial, etc.) - 2026-03-02 23:28
- [x] [TASK-004] Saneamiento de `src/app/dashboard/generador/cumplimiento/reportes/page.tsx` - 2026-03-02 23:28
- [x] [TASK-005] Resolver warnings de Hook dependencies en los archivos restantes. - 2026-03-02 23:28
- [x] [TASK-006] Eliminar `as any` en integraciones RETC y productos admin. - 2026-03-02 23:28
- [x] [TASK-007] Resolver `unused-vars` en `public/sw.js` - 2026-03-02 23:28
- [x] [TASK-008] Actualización de `baseline-browser-mapping` (Warning inicial). - 2026-03-02 23:28

## [EPIC-002] Modernización React 19 y Next.js

Meta: Migración a TanStack Query, Turbopack, limpieza de useEffect.

- [x] [TASK-009] Reemplazar fetching manual con TanStack Query en dashboards. - 2026-03-01 12:00:00
- [x] [TASK-010] Habilitar configuración para Turbopack. - 2026-03-01 12:00:00
- [x] [TASK-011] Purgar masivamente useEffects no deterministas. - 2026-03-01 12:00:00

## [EPIC-003] Saneamiento y Robustez de Prisma

Meta: Eliminación de N+1, sincronización completa de esquema.

- [x] [TASK-012] Optimizar consultas N+1 en reportes anuales. - 2026-03-01 12:00:00
- [x] [TASK-013] Sincronizar modelos ReporteAnual, AlertaVencimiento, PushSubscription. - 2026-03-01 12:00:00
- [x] [TASK-014] Implementar uso de tipado estricto eliminando `prisma as any`. - 2026-03-01 12:00:00

## [EPIC-004] Consolidación de Seguridad y RBAC

Meta: NextAuth v5, Middlewares de protección, roles en JWT.

- [x] [TASK-015] Migrar de `getServerSession` a `auth()` globalmente. - 2026-03-01 12:00:00
- [x] [TASK-016] Migrar protección de rutas a `middleware.ts`. - 2026-03-01 12:00:00
- [x] [TASK-017] Inyectar y normalizar rol y rut en sesión y JWT. - 2026-03-01 12:00:00

## [EPIC-005] Finalización de la Redención Técnica

Meta: Purgado masivo de logs, reportes PDF/Excel, tipado de APIs.

- [x] [TASK-018] Eliminar globalmente 200+ `console.log` de rutas de autenticación y API. - 2026-03-01 12:00:00
- [x] [TASK-019] Sanear endpoints para exportación de reportes PDF/CSV/Excel. - 2026-03-01 12:00:00
- [x] [TASK-020] Eliminar uso de any en respuestas y bodies de la API. - 2026-03-01 12:00:00

## [EPIC-006] Inicialización de Control de Versiones e Infraestructura Core

Meta: Preparar el repositorio para su despliegue y validación continua.

- [x] [TASK-021] Inicializar repositorio Git. - 2026-03-03 10:48:00
- [ ] [TASK-022] Crear commit inaugural y base.
- [x] [TASK-023] Generar archivo de configuración Docker. - Completado previamente.
- [ ] [TASK-024] Opcional: Configurar actions/pipelines de validación continua.

## [EPIC-007] Desarrollo Modo Demo: Entorno General (Portal)

Meta: Establecer el bypass de autenticación y la página índice de selección de roles.

- [ ] [TASK-025] Crear página principal `/demo` de selección "Pixel-Perfect".
- [ ] [TASK-026] Integrar lógica de mock-login (bypass) para cada rol al hacer click.

## [EPIC-008] Desarrollo Modo Demo: Universo Generador

Meta: Maquetar el flujo lógico y KPIs del Productor/Minera (Categoría A/B).

- [ ] [TASK-027] UI de "Panel de Métricas" con data mockeada de avance REP.
- [ ] [TASK-028] UI formulario "Nueva Solicitud" con validación de Peso Estimado.

## [EPIC-009] Desarrollo Modo Demo: Universo Transportista

Meta: Maquetar la bolsa de trabajo y la logística inversa.

- [ ] [TASK-029] UI de Bolsa de Trabajo y vista del Mapa de Rutas Pendientes.
- [ ] [TASK-030] Funcionalidad mock de "Aceptar Viaje" y "Reportar Kilo Real".

## [EPIC-010] Desarrollo Modo Demo: Universo Gestor (Planta)

Meta: Maquetar el portal de recepción física y certificación final.

- [ ] [TASK-031] UI de "Recepción en Puertas" de vehículos en tránsito.
- [ ] [TASK-032] Lógica simulada de "Pesaje de Romana" y emisión de QR (Mock).

## [EPIC-011] Desarrollo Modo Demo: Universo Administración y Fiscalización

Meta: Vistas de visualización asimétrica (L5 vs Read-Only).

- [ ] [TASK-033] UI de Admin con opciones "Override" y suspensión de permisos simulados.
- [ ] [TASK-034] UI Forense de Auditor con candados Read-Only e historial legal en crudo.
