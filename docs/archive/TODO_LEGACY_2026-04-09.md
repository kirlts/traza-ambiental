# TODO: Traza Ambiental

## [EPIC-001] Saneamiento de Errores Programáticos

Meta: Alcanzar 0 errores en `eslint` y `tsc`.

### [TASK-001] Corregir shebangs en scripts/ (deben ir en la línea 1)

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-001] `2026-03-02 23:28`
### [TASK-002] Eliminar `as any` en `src/app/api/notificaciones/send/route.ts`

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-002] `2026-03-02 23:28`
### [TASK-003] Eliminar `as any` en `src/app/api/sistema-gestion/` (metas, historial, etc.)

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-003] `2026-03-02 23:28`
### [TASK-004] Saneamiento de `src/app/dashboard/generador/cumplimiento/reportes/page.tsx`

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-004] `2026-03-02 23:28`
### [TASK-005] Resolver warnings de Hook dependencies en los archivos restantes.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-005] `2026-03-02 23:28`
### [TASK-006] Eliminar `as any` en integraciones RETC y productos admin.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-006] `2026-03-02 23:28`
### [TASK-007] Resolver `unused-vars` en `public/sw.js`

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-007] `2026-03-02 23:28`
### [TASK-008] Actualización de `baseline-browser-mapping` (Warning inicial).

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-008] `2026-03-02 23:28`

## [EPIC-002] Modernización React 19 y Next.js

Meta: Migración a TanStack Query, Turbopack, limpieza de useEffect.

> Nota: Las TASKs 009-020 fueron completadas en sesiones pre-Git (~2026-02-28 a 2026-03-02). El timestamp `2026-03-01 12:00:00` es una marca retroactiva de cierre de bloque, no la hora exacta de completitud de cada tarea.

### [TASK-009] Reemplazar fetching manual con TanStack Query en dashboards.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-009] `2026-03-01 12:00:00`
### [TASK-010] Habilitar configuración para Turbopack.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-010] `2026-03-01 12:00:00`
### [TASK-011] Purgar masivamente useEffects no deterministas.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-011] `2026-03-01 12:00:00`

## [EPIC-003] Saneamiento y Robustez de Prisma

Meta: Eliminación de N+1, sincronización completa de esquema.

### [TASK-012] Optimizar consultas N+1 en reportes anuales.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-012] `2026-03-01 12:00:00`
### [TASK-013] Sincronizar modelos ReporteAnual, AlertaVencimiento, PushSubscription.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-013] `2026-03-01 12:00:00`
### [TASK-014] Implementar uso de tipado estricto eliminando `prisma as any`.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-014] `2026-03-01 12:00:00`

## [EPIC-004] Consolidación de Seguridad y RBAC

Meta: NextAuth v5, Middlewares de protección, roles en JWT.

### [TASK-015] Migrar de `getServerSession` a `auth()` globalmente.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-015] `2026-03-01 12:00:00`
### [TASK-016] Migrar protección de rutas a `middleware.ts`.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-016] `2026-03-01 12:00:00`
### [TASK-017] Inyectar y normalizar rol y rut en sesión y JWT.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-017] `2026-03-01 12:00:00`

## [EPIC-005] Finalización de la Redención Técnica

Meta: Purgado masivo de logs, reportes PDF/Excel, tipado de APIs.

### [TASK-018] Eliminar globalmente 200+ `console.log` de rutas de autenticación y API.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-018] `2026-03-01 12:00:00`
### [TASK-019] Sanear endpoints para exportación de reportes PDF/CSV/Excel.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-019] `2026-03-01 12:00:00`
### [TASK-020] Eliminar uso de any en respuestas y bodies de la API.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-020] `2026-03-01 12:00:00`

## [EPIC-006] Inicialización de Control de Versiones e Infraestructura Core

Meta: Preparar el repositorio para su despliegue y validación continua.

### [TASK-021] Inicializar repositorio Git.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-021] `2026-03-03 10:48:00`
### [TASK-022] Crear commit inaugural y base.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-022] `2026-03-03 13:45:00`
### [TASK-023] Generar archivo de configuración Docker. - Completado previamente.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-023]
### [TASK-024] Opcional: Configurar actions/pipelines de validación continua.

**Checks cubiertos:** Gobernanza transversal

- [ ] Implementación de [TASK-024]

## [EPIC-007] Desarrollo Modo Demo: Entorno General (Portal)

Meta: Establecer el bypass de autenticación y la página índice de selección de roles.

### [TASK-025] Crear página principal `/demo` de selección "Pixel-Perfect".

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-025] `2026-03-15 22:00:00`
### [TASK-026] Integrar lógica de mock-login (bypass) para cada rol al hacer click.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-026] `2026-03-15 22:00:00`

## [EPIC-008] Desarrollo Modo Demo: Universo Generador

Meta: Maquetar el flujo lógico y KPIs del Productor/Minera (Categoría A/B).

### [TASK-027] UI de "Panel de Métricas" con data mockeada de avance REP.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-027] `2026-03-15 22:00:00`
### [TASK-028] UI formulario "Nueva Solicitud" con validación de Peso Estimado.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-028] `2026-03-15 22:00:00`

## [EPIC-009] Desarrollo Modo Demo: Universo Transportista

Meta: Maquetar la bolsa de trabajo y la logística inversa.

### [TASK-029] UI de Bolsa de Trabajo y vista del Mapa de Rutas Pendientes.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-029] `2026-03-15 22:00:00`
### [TASK-030] Funcionalidad mock de "Aceptar Viaje" y "Reportar Kilo Real".

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-030] `2026-03-15 22:00:00`

## [EPIC-010] Desarrollo Modo Demo: Universo Gestor (Planta)

Meta: Maquetar el portal de recepción física y certificación final.

### [TASK-031] UI de "Recepción en Puertas" de vehículos en tránsito.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-031] `2026-03-15 22:00:00`
### [TASK-032] Lógica simulada de "Pesaje de Romana" y emisión de QR (Mock).

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-032] `2026-03-15 22:00:00`

## [EPIC-011] Desarrollo Modo Demo: Universo Administración y Fiscalización

Meta: Vistas de visualización asimétrica (L5 vs Read-Only).

### [TASK-033] UI de Admin con opciones "Override" y suspensión de permisos simulados.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-033] `2026-03-15 22:00:00`
### [TASK-034] UI Forense de Auditor con candados Read-Only e historial legal en crudo.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-034] `2026-03-15 22:00:00`

## [EPIC-012] Desarrollo Modo Demo: Sistema de Gestión y Experiencia Guiada

Meta: Consolidar la narrativa de negocio B2B, métricas ESG y flujos interactivos de venta.

### [TASK-035] Implementar motor de simulación de estado (Context + LocalStorage) para el Modo Demo.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-035] `2026-03-15 22:00:00`
### [TASK-036] Integrar simuladores visuales de sistemas externos (SII, SINADER, RETC).

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-036] `2026-03-15 22:00:00`
### [TASK-037] Desarrollar perfil "Sistema de Gestión" (SIG) con consolidación de metas nacionales.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-037] `2026-03-15 22:00:00`
### [TASK-038] Incorporar KPIs de Huella de Carbono (CO2e Evitada) y generación de PDF real (jsPDF).

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-038] `2026-03-15 22:00:00`
### [TASK-039] Desarrollar Recorrido Guiado ("Tour") con enforced-steps y layout dinámico (pb-72).

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-039] `2026-03-15 22:00:00`

## [EPIC-013] Estabilización Modo Demo: Tour Guiado y Sanity Checks

Meta: Corregir bugs críticos de interactividad en el recorrido guiado y establecer una red de seguridad E2E para las vistas Demo.

### [TASK-040] Fix Guided Tour: backdrop `pointer-events: none`, corregir `targetSelector` Paso 1 (`nueva-solicitud`), añadir `data-tour-target` faltantes en Transportista y Gestor.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-040] `2026-03-29 22:15:00`
### [TASK-041] Crear suite de 32 sanity checks Playwright (`e2e/sanity_check.spec.ts`): hub, 5 dashboards, navegación, responsive, overlay del tour, contrato data-tour-target, 404.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-041] `2026-03-29 22:15:00`
### [TASK-042] Crear 10 unit tests de contrato Jest (`GuidedTour.test.tsx`): presencia de targets, pointer-events en source, estado de la máquina de tour.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-042] `2026-03-29 22:15:00`
### [TASK-043] Ampliar mock global lucide-react con 17 iconos faltantes y type export `LucideIcon`.

**Checks cubiertos:** Gobernanza transversal

- [x] Implementación de [TASK-043] `2026-03-29 22:15:00`

## [EPIC-014] Redacción del Reporte de Brecha Conceptual (20K+ palabras)

Meta: Ejecutar la fase de redacción del macro-reporte exponiendo la brecha entre el frontend prometido y el D.S. 8/RETC para 12 actores clave.

> **RESTRICCIÓN DURA INNEGOCIABLE:** El reporte generado DEBE tener al menos **20.000 palabras** en total. Se exige, por Master-Spec, un mínimo de **2.000 palabras POR ACTOR**. Ninguna de las TASK de este EPIC puede marcarse como completada si el contenido redactado para ese actor es inferior a 2.000 palabras.

### [TASK-044] Redacción Bloque 1: Generador (Obligado REP)

**Checks cubiertos:** [GENERADOR-AV-001] a [GENERADOR-RS-010]

- [ ] Implementación de [TASK-044]

### [TASK-045] Redacción Bloque 2: Transportista

**Checks cubiertos:** [TRANSPORTISTA-AV-011] a [TRANSPORTISTA-RS-020]

- [ ] Implementación de [TASK-045]

### [TASK-046] Redacción Bloque 3: Gestor / Valorizador

**Checks cubiertos:** [GESTOR-AV-021] a [GESTOR-RS-030]

- [ ] Implementación de [TASK-046]

### [TASK-047] Redacción Bloque 4: Sistema de Gestión (GRANSIC)

**Checks cubiertos:** [GRANSIC-AV-031] a [GRANSIC-RS-040]

- [ ] Implementación de [TASK-047]

### [TASK-048] Redacción Bloque 5: Administrador de Plataforma

**Checks cubiertos:** [ADMIN-AV-041] a [ADMIN-RS-050]

- [ ] Implementación de [TASK-048]

### [TASK-049] Redacción Bloque 6: Fiscalizador (MMA/SMA/Seremi)

**Checks cubiertos:** [FISCAL-AV-051] a [FISCAL-RS-060]

- [ ] Implementación de [TASK-049]

### [TASK-050] Redacción Bloque 7: Representante Legal

**Checks cubiertos:** [RL-AV-061] a [RL-RS-070]

- [ ] Implementación de [TASK-050]

### [TASK-051] Redacción Bloque 8: Delegado

**Checks cubiertos:** [DEL-AV-071] a [DEL-RS-080]

- [ ] Implementación de [TASK-051]

### [TASK-052] Redacción Bloque 9: Encargado de Establecimiento

**Checks cubiertos:** [ENC-AV-081] a [ENC-RS-090]

- [ ] Implementación de [TASK-052]

### [TASK-053] Redacción Bloque 10: Importador

**Checks cubiertos:** [IMP-AV-091] a [IMP-RS-100]

- [ ] Implementación de [TASK-053]

### [TASK-054] Redacción Bloque 11: Exportador

**Checks cubiertos:** [EXP-AV-101] a [EXP-RS-110]

- [ ] Implementación de [TASK-054]

### [TASK-055] Redacción Bloque 12: Autoridad Sectorial (Aduanas/DGA)

**Checks cubiertos:** [SEC-AV-111] a [SEC-RS-120]

- [ ] Implementación de [TASK-055]

## Resumen de cobertura general

| Epic | Tasks | Estado | Checks cubiertos |
| --- | --- | --- | --- |
| EPIC-001 | TASK-001 a 008 | ✅ Completado | Gobernanza transversal |
| EPIC-002 | TASK-009 a 011 | ✅ Completado | Gobernanza transversal |
| EPIC-003 | TASK-012 a 014 | ✅ Completado | Gobernanza transversal |
| EPIC-004 | TASK-015 a 017 | ✅ Completado | Gobernanza transversal |
| EPIC-005 | TASK-018 a 020 | ✅ Completado | Gobernanza transversal |
| EPIC-006 | TASK-021 a 024 | ☐ En progreso | Gobernanza transversal |
| EPIC-007 | TASK-025 a 026 | ✅ Completado | Gobernanza transversal |
| EPIC-008 | TASK-027 a 028 | ✅ Completado | Gobernanza transversal |
| EPIC-009 | TASK-029 a 030 | ✅ Completado | Gobernanza transversal |
| EPIC-010 | TASK-031 a 032 | ✅ Completado | Gobernanza transversal |
| EPIC-011 | TASK-033 a 034 | ✅ Completado | Gobernanza transversal |
| EPIC-012 | TASK-035 a 039 | ✅ Completado | Gobernanza transversal |
| EPIC-013 | TASK-040 a 043 | ✅ Completado | Gobernanza transversal |
| EPIC-014 | TASK-044 a 055 | ☐ En progreso | Reporte Brecha Conceptual |
