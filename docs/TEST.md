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
