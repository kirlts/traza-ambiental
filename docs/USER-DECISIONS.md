# USER-DECISIONS: Memoria Operativa del Humano

> Registro de soberanía del humano sobre el sistema. Antigravity DEBE leer este documento
> al inicio de toda sesión y consultarlo antes de escalar vacíos al humano.
>
> Este documento registra: decisiones tomadas, decisiones aplazadas, y preferencias operativas.
> Es la memoria que sobrevive entre sesiones caóticas, paralelas y sin cierre formal.

| Símbolo | Significado |
|---|---|
| 💡 | Decisión activa |
| ⏸️ | Decisión aplazada |
| ⚙️ | Preferencia operativa |

---

## [UD-001] 💡 El repositorio planifica el MVP, no lo construye

**Fecha:** 2026-05-10
**Contexto:** Sesión fundacional de diseño del sistema Kratos/Khaos/Antigravity.
**Decisión:** Este repositorio contiene exclusivamente la Knowledge Base de planificación del MVP de Trazambiental. No se escribe código ejecutable aquí. El MVP se construirá en otro repositorio a partir de la planificación producida.
**Alternativas descartadas:**
- Repositorio mixto (planificación + código): descartado por contaminación cruzada entre artefactos de planificación y código ejecutable.
**Consecuencias:**
- Todo el contenido del repositorio son nodos Markdown, no código.
- Se necesita un segundo repositorio para la implementación del MVP.
**Condiciones de reversión:** Solo si se decide abandonar la metodología Kratos/Khaos.

---

## [UD-002] 💡 Nodos nombrados en lenguaje natural autoexplicativo

**Fecha:** 2026-05-10
**Contexto:** Discusión sobre IDs crípticos vs. nomenclatura legible. El humano rechazó identificadores tipo `KR-LEY-REP-ART-24`.
**Decisión:** Todos los nodos (Kratos y Khaos) se nombran en español, en lenguaje natural autoexplicativo. El nombre del archivo es el wikilink de Obsidian. No se usan códigos taxonómicos.
**Alternativas descartadas:**
- IDs taxonómicos (`KH-MOD-001`): descartados por ser ilegibles para el humano y no autoexplicativos.
**Consecuencias:**
- Los wikilinks son legibles directamente: `[[Ley REP - Artículo 24 - Obligaciones del Generador]]`.
- La IA parsea nombres naturales en vez de códigos.
**Condiciones de reversión:** Si la cantidad de nodos hace inmanejable la nomenclatura natural (improbable para un MVP).

---

## [UD-003] 💡 Un nodo Khaos = una responsabilidad MECE del MVP

**Fecha:** 2026-05-10
**Contexto:** Discusión filosófica sobre la ontología de los nodos. ¿Qué es un nodo? ¿Cuándo se crea uno nuevo vs. append?
**Decisión:** Un nodo Khaos es una unidad de responsabilidad distinguible del MVP. Se crea un nuevo nodo cuando aparece una responsabilidad que no cabe en ningún nodo existente sin romper exclusividad mutua. Se hace append cuando la información elabora la misma responsabilidad.
**Alternativas descartadas:**
- Nodos por tema/categoría: descartados porque no tienen criterio de frontera determinista.
- Nodos por nivel jerárquico (Módulo > Épica > Historia): descartados porque imponen una taxonomía rígida que no respeta MECE.
**Consecuencias:**
- La jerarquía emerge de la descomposición de responsabilidades, no de una taxonomía predefinida.
- La falla de exhaustividad colectiva señala nodos faltantes.
**Condiciones de reversión:** Ninguna previsible. MECE es el principio estructural del sistema.

---

## [UD-004] 💡 La IA no especula durante la construcción de nodos (Fase 1)

**Fecha:** 2026-05-10
**Contexto:** El humano detectó que la IA estaba generando contenido placeholder especulativo en nodos Khaos (ej. "Vacío: ¿se requiere validación contra formato SINADER?").
**Decisión:** Durante la Fase 1 (construcción), la IA actúa exclusivamente como escriba. Transcribe lo que el humano aportó. Todo campo sin información queda estructuralmente vacío. No se generan placeholders, sugerencias, ni preguntas dentro del nodo. Los vacíos son el producto.
**Alternativas descartadas:**
- Placeholders descriptivos: descartados porque la IA contamina el nodo con suposiciones y el humano cree que el vacío está "atendido" cuando no lo está.
**Consecuencias:**
- Los vacíos son reales e inconfundibles.
- La Fase 2 (auditoría) es el único mecanismo para resolverlos.
**Condiciones de reversión:** Ninguna. Esta separación es inviolable.

---

## [UD-005] ⚙️ No usar términos en francés

**Fecha:** 2026-05-10
**Contexto:** La IA utilizó "raison d'être" como nombre de campo.
**Preferencia:** No usar terminología en francés en ningún artefacto del repositorio. Los nombres de campos, secciones y conceptos deben ser en español, autoexplicativos.
**Motivo:** Preferencia personal del humano. Legibilidad.

---

## [UD-006] 💡 La plantilla no es role-aware

**Fecha:** 2026-05-10
**Contexto:** La IA usó "validado_por_ceo" como estado de nodo.
**Decisión:** La plantilla de nodos no codifica roles organizacionales. Se usa "validado" en vez de "validado_por_ceo". El campo de estado usa "humano" como concepto genérico, no roles específicos.
**Alternativas descartadas:**
- Estados con roles (`validado_por_ceo`, `aprobado_por_legal`): descartados por ser un hardcodeo que no sobrevive cambios organizacionales.
**Consecuencias:**
- La plantilla es agnóstica al organigrama.
**Condiciones de reversión:** Si se introduce un sistema multi-rol con permisos diferenciados.

---

## [UD-007] 💡 Khaos es estructura viva, la mutación es el comportamiento esperado

**Fecha:** 2026-05-10
**Contexto:** Discusión sobre cómo Antigravity debería manejar nueva información que altera nodos existentes.
**Decisión:** La mutación (crear, fusionar, dividir, eliminar, reparentar nodos) es una operación normal, no una excepción. No requiere autorización previa. El criterio MECE gobierna la validez de toda mutación. Git registra el historial.
**Alternativas descartadas:**
- Nodos inmutables que se "cierran" y reemplazan: descartados por burocracia innecesaria.
- Autorización humana para cada mutación: descartada porque paralizaría el sistema.
**Consecuencias:**
- Antigravity puede reestructurar el árbol Khaos libremente mientras mantenga MECE.
- El humano puede revertir cualquier cambio via Git.
**Condiciones de reversión:** Si se detecta que Antigravity está mutando nodos incorrectamente de forma sistemática.

---

## [UD-008] 💡 Eje documental clásico de Kairós deprecado

**Fecha:** 2026-05-10
**Contexto:** El eje documental estándar de Kairós (TODO, VERIFICATION, TECHNICAL-DEBT, TEST, CHANGELOG, LIVING-DOCUMENT) fue diseñado para repositorios de software. Este repositorio es una Knowledge Base de planificación: no tiene código, tests, deuda técnica, ni releases.
**Decisión:** Deprecar completamente el eje documental clásico. Solo se conservan MASTER-SPEC, USER-DECISIONS, MEMORY y REPOMAP. Los workflows, rules, skills y templates irrelevantes para el sistema Kratos/Khaos/Antigravity fueron eliminados. El workflow `/document` fue reconceptualizado para verificar coherencia de nodos, trazabilidad Khaos→Kratos e integridad MECE.
**Alternativas descartadas:**
- Mantener el eje completo "por si acaso": descartado porque genera ruido, confunde a la IA, y consume contexto.
**Consecuencias:**
- 25 archivos de gobernanza eliminados.
- `/document` ahora verifica la KB en vez de sincronizar documentación de código.
- El workflow `/update` de Kairós podría restaurar archivos eliminados; se deberá re-deprecar si se ejecuta.
**Condiciones de reversión:** Si este repositorio evoluciona para contener código ejecutable del MVP.

---

## [UD-009] 💡 La planificación del MVP arranca por el eje Khaos

**Fecha:** 2026-05-10
**Contexto:** Discusión sobre por dónde comenzar: ¿estructurar Kratos primero (el dump crudo) o desplegar Khaos primero (las responsabilidades del MVP)?
**Decisión:** Comenzar por Khaos. El humano define las responsabilidades del MVP en conversación. Los vacíos de Khaos revelarán qué hechos de Kratos son necesarios, lo cual guiará la estructuración selectiva del dump crudo en vez de procesarlo completo sin saber qué es relevante.
**Alternativas descartadas:**
- Estructurar todo el dump de Kratos primero: descartado porque produce nodos que podrían nunca ser referenciados por Khaos.
**Consecuencias:**
- El dump crudo en `external-research/` se estructura bajo demanda, no de golpe.
- Las primeras sesiones de planificación se centran en responsabilidades del MVP.
**Condiciones de reversión:** Si el humano necesita una visión completa de Kratos antes de diseñar Khaos.

---

## [UD-010] 💡 Confirmación humana obligatoria antes de modificar la KB

**Fecha:** 2026-05-10
**Contexto:** El humano solicitó un mecanismo que garantice que la IA no modifique Kratos ni Khaos sin autorización explícita.
**Decisión:** Antigravity nunca escribe en `knowledge-base/` sin confirmación previa del humano. Antes de cualquier creación, append o mutación de nodos, la IA presenta: el workflow que ejecutará, las modificaciones que hará, y el contenido que escribirá. Solo tras confirmación explícita ("sí", "dale", "ok") se ejecuta la escritura.
**Alternativas descartadas:**
- Autonomía total con auditoría posterior: descartada por riesgo de deriva acumulada antes de que el humano revise.
**Consecuencias:**
- Cada nodo es un acto de voluntad del humano, no de inferencia de la IA.
- El proceso es más lento pero elimina modificaciones especulativas.
- Codificado como regla `KNOWLEDGE BASE MODIFICATION GATE` en `.agents/rules/01-behavior.md`.
**Condiciones de reversión:** Si el humano confía lo suficiente en el flujo y quiere acelerar, puede relajar esta regla a confirmación por lote.

---

## [UD-011] 💡 Khaos solo referencia Kratos, con rutas relativas y wikilinks nativos

**Fecha:** 2026-05-10
**Contexto:** El humano detectó que la IA referenciaba documentos fuera de la KB (context.md, conversation.md) desde un nodo Khaos.
**Decisión:** Los nodos Khaos solo pueden referenciar nodos Kratos como sustento factual. No se permiten referencias a documentos fuera de `knowledge-base/`. Las referencias usan wikilinks (`[[Nombre]]`) para compatibilidad nativa con Obsidian. Si se necesitan enlaces Markdown estándar, se usan rutas relativas (`../kratos/nombre.md`), nunca absolutas. `kratos/` y `khaos/` son siempre directorios hermanos.
**Alternativas descartadas:**
- Permitir referencias a docs/: descartado porque rompe la separación entre documentación de gobernanza y Knowledge Base.
**Consecuencias:**
- El grafo de Obsidian muestra exclusivamente relaciones KB internas.
- Codificado como restricciones §4.10 y §4.11 en MASTER-SPEC y en `05-constraints.md`.
**Condiciones de reversión:** Ninguna previsible.

---

## [UD-012] ⏸️ Deseables del MVP no son obligatorios

**Fecha:** 2026-05-10
**Contexto:** El humano declaró en el dump de la cartulina que existen funcionalidades deseables pero no obligatorias para el MVP.
**Decisión aplazada:** Las siguientes funcionalidades son deseables, no comprometidas:
- Integraciones API con MMA o Aduanas
- Capas de personalización por cliente (monetización vía cargos extra)
- Soporte a sistemas de gestión REP para encontrar residuos huérfanos
**Condiciones de reapertura:** Cuando el MVP comprometido esté planificado y se evalúe la extensión del alcance.

---

## [UD-013] ⏸️ KPIs específicos aún no definidos

**Fecha:** 2026-05-10
**Contexto:** El humano declaró que el sistema ofrecerá KPIs ambientales, de eficiencia interna y de operaciones, pero los KPIs específicos no están definidos.
**Decisión aplazada:** La definición de los KPIs concretos y sus mecanismos de oferta queda pendiente.
**Condiciones de reapertura:** Cuando el humano aporte la lista de KPIs específicos o cuando se estructure en Kratos la normativa que los determina.

---

## [UD-014] ⏸️ Diferenciadores adicionales para Cat B (y A) pendientes

**Fecha:** 2026-05-10
**Contexto:** El humano declaró que se necesitan elementos diferenciadores adicionales para fortalecer la propuesta de valor del MVP NFU, especialmente para Cat B.
**Decisión aplazada:** La identificación y definición de diferenciadores adicionales queda como espacio en blanco declarado.
**Condiciones de reapertura:** Cuando el humano defina los diferenciadores o cuando el análisis competitivo los revele.

---

## [UD-015] 💡 Estrategia de población de Kratos: una sesión por informe de deep research

**Fecha:** 2026-05-10
**Contexto:** Kratos está vacío. Existen 9 informes de deep research en `info/` que contienen material crudo sobre el dominio legal y operativo.
**Decisión:** Poblar Kratos secuencialmente, una sesión de chat por cada informe de deep research. Cada sesión lee un informe, lo estructura en nodos Kratos atómicos, y al finalizar se cruza contra Khaos para identificar:
- Información que subsana brechas existentes (celdas de Sustento vacías)
- Inexactitudes en Khaos que requieran corrección
- Información que gatille nuevos nodos o descomposiciones
**Alternativas descartadas:**
- Procesar todos los informes en una sola sesión: descartado por riesgo de degradación de contexto y pérdida de precisión.
- Poblar Kratos sin cruce contra Khaos: descartado porque pierde la interdependencia que es el motor del sistema.
**Consecuencias:**
- El proceso requiere ~9 sesiones (una por informe) + sesiones de cruce.
- Kratos se construye con trazabilidad directa a las fuentes de investigación.
**Condiciones de reversión:** Si algún informe resulta irrelevante para el MVP, se omite esa sesión.
