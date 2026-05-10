# TEST.md: Contrato de Comportamiento

## Stack de Testing

- **Runner Unitario/Integración:** Jest + ts-jest
- **API Testing:** Jest (Supertest sim)
- **E2E:** Playwright (Chromium Headless en Docker)
- **Validación Estática:** TypeScript (tsc) + ESLint

## Triggers Automáticos

- Al completar cualquier `TASK` que modifique el `prisma/schema.prisma` -> Ejecutar `prisma generate`.
- Al cerrar una Épica -> Ejecutar `npm run build` (valla de construcción).
- Antes de cada commit (propuesta) -> Ejecutar `tsc --noEmit` en archivos afectados.

## Tests de Alta Prioridad (Límites Intransgredibles)

- [ ] **Trazabilidad Inmutable:** Verificar que cada cambio de estado en `SolicitudRetiro` genera un `AuditLog`.
- [ ] **RBAC Estricto:** Verificar que un usuario con rol `Transportista` no puede acceder a endpoints de `Sistema de Gestión`.
- [ ] **Consistencia de Reportes:** Verificar que el `ReporteAnual` coincida con la sumatoria de `SolicitudRetiro` del periodo.

## Política de Playwright/E2E

- Activar cuando: Se modifiquen flujos críticos de firma o dashboards principales.
- No activar cuando: Cambios menores de CSS o textos.
- Budget de tokens estimado: **Medio-Alto** (usar con discreción).

### Baseline de Sanity Checks (32 tests — `e2e/sanity_check.spec.ts`)

Suite de humo obligatoria que valida la integridad estructural de todas las vistas Demo. Ejecutar con:

```bash
npx playwright test e2e/sanity_check.spec.ts --project=chromium
```

Cobertura: Hub (5), Dashboards x5 (5), Generador UI (4), Transportista UI (2), Gestor UI (1), Navegación (3), Tour Guiado (5), Responsive (3), Error 404 (1), Contrato data-tour-target (3).

### Tests de Contrato del Tour Guiado (10 tests — Jest)

Validan que los `data-tour-target` existan en cada página del tour y que la configuración del overlay sea correcta (`pointer-events: none`). Ejecutar con:

```bash
npx jest src/__tests__/components/GuidedTour.test.tsx
```

## Contadores de Suite (Actualizado 2026-03-29)

| Runner | Tests | Suites | Estado |
|---|---|---|---|
| Jest | 267 | 24 | ✅ Verde |
| Playwright (Chromium) | 32 | 1 | ✅ Verde |
