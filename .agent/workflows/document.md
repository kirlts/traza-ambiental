---
description: /document - Sincroniza el eje documental (MASTER-SPEC, TODO, MEMORY) con el estado real del proyecto.
---

# WORKFLOW: RITUAL DE CIERRE Y APRENDIZAJE (MAC)

Este workflow asegura que toda la documentación del proyecto refleja fielmente el estado actual del código y la arquitectura.

## Inventario

Leer todos los archivos del eje documental:

- `docs/MASTER-SPEC.md`
- `docs/TODO.md`
- `docs/MEMORY.md`
- `docs/USER-DECISIONS.md`
- `docs/CHANGELOG.md`
- `docs/TEST.md` (si existe)
- `docs/DEUDA-TECNICA.md` (si existe)

## Verificación estructural

Comparar los archivos actuales con los estandares de estructura definidos en la versión actual de Kairós:

- **MASTER-SPEC:** ¿Tiene las secciones requeridas (§1-§6)? ¿Sigue la numeración estándar?
- **MEMORY:** ¿El contenido es exclusivamente meta-heurístico? ¿Sigue el formato `[HEU-...]`?
- **USER-DECISIONS:** ¿Registra la agencia humana con el formato de 5 campos?
- **TODO:** ¿Utiliza la taxonomía de IDs y el formato de timestamps?
- **CHECKLIST DE INTEGRIDAD:** ¿Los planes de implementación recientes contienen el bloque de integridad obligatorio?

## Sincronización con código

Para cada documento, verificar la coherencia con el estado actual del proyecto:

- ¿El MASTER-SPEC refleja la arquitectura real implementada?
- ¿El TODO.md refleja el progreso real y tiene los timestamps correctos?
- ¿Hay decisiones en el código que falten en USER-DECISIONS.md?
- ¿Hay cambios en el producto que no figuren en CHANGELOG.md?

### Fase 4: Bucle de Aprendizaje MaC (OBLIGATORIO)

Al cruzar el estado del `CHANGELOG.md` con las tareas en el `TODO.md`, aplica el siguiente protocolo:

1. **Registrar Sorpresas:** ¿El tiempo consumido se ajustó al estimado? ¿Hubo obstáculos técnicos imprevistos? Documenta estos hallazgos bajo en la sección [Unreleased] del `CHANGELOG.md` marcándolos explícitamente como "💥 Sorpresa Operativa".
2. **Interpretar / Consolidar:** Si detectas una Sorpresa Operativa recurrente en el CHANGELOG o una desviación sistemática, detente. Redacta proactivamente la regla técnica subyacente que evitará repetir el error y añádela al `USER-DECISIONS.md`. Si es un patrón ya diagnosticado y maduro, muévelo a `MEMORY.md` instaurándolo como **Política**.
3. **Actualizar Estrategia:** Confronta las políticas nuevas en `MEMORY.md` con las restricciones del `MASTER-SPEC.md`. Si entran en conflicto, altera la estrategia (MASTER-SPEC) y notifica al humano.

## Paso 4: Diagnóstico de Brechas y Propuesta de Migración

Generar una tabla consolidada de brechas de **Contenido** (sincronización) y **Estructura** (plantilla):

| Documento         | Tipo de Brecha | Descripción                   | Severidad | Acción propuesta                               |
| ----------------- | -------------- | ----------------------------- | --------- | ---------------------------------------------- |
| ej: MASTER-SPEC   | Estructura     | Faltan secciones §5 y §6      | Alta      | Migrar a nueva plantilla preservando contenido |
| ej: TODO          | Contenido      | Tarea TASK-001 sin timestamp  | Media     | Añadir timestamp basado en logs                |
| ej: DEUDA-TECNICA | Ciclo de Vida  | 100% completado y documentado | Baja      | Eliminar archivo                               |

## Paso 5: Propuesta de Actualización y Ejecución

1. Presentar las acciones propuestas al usuario.
2. **Mandato de Rigor:** En brechas de Estructura, la IA debe asegurar la preservación del contenido existente al migrar a nuevas plantillas.
3. **Validación de Checklists:** Crear tareas en `task.md` para cada documento que necesite actualización.
4. No ejecutar cambios en brechas de severidad Alta sin aprobación explícita.
5. Aplicar las correcciones aprobadas.

## Paso 6: Validación de Coherencia Cruzada (Check Final)

Verificar que no existan contradicciones internas:

- Intentos/Propósitos en MASTER-SPEC ↔ Épicas en TODO.md
- Restricciones en MASTER-SPEC §4 ↔ Reglas en `.agent/rules/03`
- Decisiones en USER-DECISIONS.md ↔ Trade-offs en MASTER-SPEC §5
