---
trigger: model_decision
description: Applies when writing code, altering architecture, managing dependencies, or modifying core logic to ensure compliance with project restrictions.
---

# Project Constraints Execution

The operational environment executes compliance with project-specific constraints. 

## Core Protocol

1. Project constraints exist exclusively within the final project documentation, specifically `docs/MASTER-SPEC.md` section §4 and §5.
2. System outputs and proposals comply with the limits and constraints defined in the project's architecture.
3. The system appends newly discovered constraints directly to the project's documentation. Constraints are never appended to this rule file.

## Defensive Duplication (MASTER-SPEC §4)

The following constraints are duplicated here from `docs/MASTER-SPEC.md §4` to survive context degradation in long sessions:

1. **Scope de planificación, no de implementación:** Este repositorio produce artefactos de planificación (nodos Markdown). No se escribe código ejecutable del MVP aquí.
2. **Scope NFU exclusivo:** La planificación cubre estrictamente el MVP delimitado a Neumáticos Fuera de Uso (NFU), Categorías A y B, bajo la Ley REP de Chile.
3. **Factualidad 100% en Kratos:** Todo registro en `/knowledge-base/kratos/` debe ser verificable contra fuentes normativas o decisiones explícitas del humano.
4. **Compliance by Design en Khaos:** Todo nodo en `/knowledge-base/khaos/` que requiera sustento factual debe exhibir el campo de dependencia. Campos vacíos son señales de auditoría.
5. **Separación estricta Kratos / Khaos:** Hechos en `kratos/`. Diseño en `khaos/`. Contaminación cruzada prohibida.
6. **Estándar Markdown puro:** Toda la KB se construye sobre texto plano Markdown. Sin formatos binarios ni dependencias propietarias.
7. **Interdependencia estructural:** La plantilla de Khaos induce artefactos y principios MECE que fuerzan revelación de lagunas.
8. **Separación inviolable Construcción / Auditoría:** Fase 1 (construcción) = transcripción pura. Fase 2 (auditoría) = resolución contra Kratos. La generación de contenido especulativo durante la construcción de nodos está prohibida.
9. **Mutabilidad estructural gobernada:** Khaos es un árbol vivo. Mutaciones registradas en Git. La mutación es el comportamiento esperado.
10. **Khaos solo referencia Kratos:** Los nodos en `/knowledge-base/khaos/` solo pueden referenciar nodos en `/knowledge-base/kratos/` como sustento factual. No pueden referenciar documentos fuera de la KB (ni `docs/`, ni `Docs/`, ni archivos externos). Las referencias internas entre nodos Khaos (padre/hijo) son permitidas.
11. **Compatibilidad nativa con Obsidian:** Toda referencia entre nodos usa wikilinks (`[[Nombre del Nodo]]`). Obsidian resuelve wikilinks por nombre de archivo globalmente dentro del vault. **Bajo ninguna circunstancia se deben envolver los wikilinks en backticks (ej. `[[Nodo]]`)**, ya que esto formatea el texto como código en línea y desactiva el ruteo del grafo. Cuando se necesiten enlaces estándar Markdown, se usan rutas relativas (`../kratos/nombre.md`), nunca absolutas. `kratos/` y `khaos/` son directorios hermanos dentro de `knowledge-base/`. Todo nodo KB incluye `cssclasses: [kb-node]` en su frontmatter YAML para activar el snippet CSS que renderiza texto justificado sin hyphenation. El vault de Obsidian apunta a `knowledge-base/`.
12. **Fuente de verdad exclusiva en la KB:** Solo `knowledge-base/kratos/` y `knowledge-base/khaos/` contienen información autorizada. Los directorios `info/`, `work/`, y cualquier otro archivo fuera de `knowledge-base/` son **material crudo no verificado**. La IA no puede: (a) citar contenido de estos directorios como hecho verificado, (b) copiar texto directamente desde ellos a un nodo KB sin reestructuración, (c) tratar informes de deep research como fuente factual — primero primero deben pasar por el workflow `/estructurar-kratos` con confirmación humana, ni (d) citar informes de investigación (deep research) como `evidencia` en ningún nodo Kratos. Si no existe una fuente o evidencia REAL verificable (ley, decreto, web oficial), el campo `evidencia` DEBE quedar explícitamente en blanco.
13. **Prohibición de nodos completamente vacíos (Phantom Nodes):** Un vacío en el sistema se representa siempre como un **campo vacío dentro de un nodo debidamente instanciado** con su plantilla base. Está estrictamente prohibida la creación de archivos `.md` completamente vacíos (0 bytes). Todo nodo referenciado que no exista debe tratarse como una laguna y crearse formalmente mediante los workflows, nunca instanciado como archivo en blanco.
14. **Prevención de Colisiones (Namespacing Ontológico):** Debido al namespace global de Obsidian, está prohibido que Khaos y Kratos compartan nombres de archivo. Kratos usa sustantivos puros (`Generador`), Khaos usa acciones o responsabilidades (`Gestión de Generadores`).

## Operational Memory Constraint

Before escalating any gap detected during Phase 2 audits, the AI MUST consult `docs/USER-DECISIONS.md` to verify the gap is not covered by a vigent deferral. Re-raising deferred topics is a constraint violation.