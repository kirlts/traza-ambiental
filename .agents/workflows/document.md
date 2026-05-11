---
description: /document - Synchronizes the documentary axis (MASTER-SPEC, USER-DECISIONS, MEMORY, REPOMAP) and verifies structural coherence of the Knowledge Base (Kratos/Khaos node compliance, traceability, MECE integrity).
---

# Documentary Synchronization

This workflow ensures that project documentation and the Knowledge Base maintain structural coherence. Adapted for a planning repository governed by Kratos/Khaos methodology.

---

## Phase 1: Node-Template Compliance

**Objective:** Verify that all instantiated nodes conform to their canonical templates (MASTER-SPEC §7.5.2 for Khaos, §7.6.2 for Kratos).

### 1.1. Khaos Nodes

For each file in `knowledge-base/khaos/`:
1. Verify YAML frontmatter contains all mandatory fields: `estado`, `depende_de`, `se_descompone_en`, `se_relaciona_con`, `cssclasses`.
2. Verify `cssclasses` contains `kb-node`.
3. Verify Markdown body contains all mandatory sections: `## Qué es`, `## Por qué existe`, `## Lógica de descomposición`, `## Compromisos`, `## Relaciones Horizontales`, `## Se descompone en`, `## Qué falta`, `## Justificación de estado`.
4. Verify `## Compromisos` contains a table with columns: Actor, Acción en el sistema, Sustento.
5. Verify `## Qué falta` is NOT empty (desplegar-khaos Phase 3 Step 7 mandates hypotheses even if no gaps are evident).
6. Flag missing sections or malformed structure.

### 1.2. Kratos Nodes

For each file in `knowledge-base/kratos/`:
1. Verify YAML frontmatter contains: `estado`, `tipo`, `vigencia`, `depende_de`, `se_descompone_en`, `se_relaciona_con`, `cssclasses`.
2. Verify `cssclasses` contains `kb-node`.
3. Verify `tipo` is one of: `norma_legal`, `decision_del_humano`, `regla_de_negocio`, `requisito_tecnico`, `factor_externo`, `hecho_negativo`.
4. Verify Markdown body contains all mandatory sections: `## Qué dice`, `## Por qué existe`, `## Lógica de descomposición`, `## Relaciones Horizontales`, `## Fuente original`, `## Evidencia`, `## Justificación de estado`.
5. Flag nodes with empty `## Evidencia` as unverified (factualidad 100% constraint §4.3).

**Output:** Compliance report table.

---

## Phase 2: Traceability & Graph Integrity

**Objective:** Verify that all cross-references are valid and the graph topology is sound.

### 2.1. Khaos → Kratos References

1. Extract all wikilinks from Khaos nodes that point to Kratos nodes (typically in `## Por qué existe` and `## Compromisos` Sustento column).
2. For each wikilink, verify the target file exists in `knowledge-base/kratos/`.

### 2.2. Bidirectional Hierarchy (Both Domains)

1. Extract all wikilinks from `depende_de` and `se_descompone_en` fields in both Khaos and Kratos.
2. Verify all parent/child references are bidirectional (parent lists child, child references parent).

### 2.3. Cross-Domain Contamination (§4.5)

1. For each Kratos node, verify `depende_de` does NOT point to a Khaos node.
2. For each Kratos node, verify `se_relaciona_con` does NOT reference Khaos nodes.
3. Kratos nodes may only reference other Kratos nodes in their YAML fields and body.

### 2.4. Name Collision Detection

1. Enumerate all filenames in `kratos/` and `khaos/`.
2. Flag any filename that exists in BOTH directories. Obsidian resolves wikilinks globally by filename; shared names create ambiguous links.

### 2.5. Lateral Symmetry

1. For each node (Kratos or Khaos), extract `se_relaciona_con` entries.
2. Verify each lateral is reciprocated: if A lists B in `se_relaciona_con`, B must list A.
3. Verify each YAML lateral has a corresponding narrative paragraph in `## Relaciones Horizontales`.

| Type | Detection | Severity |
|---|---|---|
| Broken Kratos reference | Khaos node references a Kratos node that doesn't exist | High — missing factual backing |
| Topological Orphan | ANY node with an empty `depende_de` that is NOT a legitimate root entity | High — disconnected from hierarchy |
| Unidirectional link | Parent lists child but child doesn't reference parent (or vice versa) | High — graph integrity |
| Cross-domain contamination | Kratos `depende_de` or `se_relaciona_con` pointing to Khaos | High — §4.5 violation |
| Name collision | Same filename in both `kratos/` and `khaos/` | High — ambiguous wikilinks |
| Asymmetric lateral | A→B exists but B→A does not in `se_relaciona_con` | Medium — incomplete graph |
| Circular self-reference | Node's body or YAML contains `[[own name]]` | Medium — logical error |
| Unused Kratos node | Kratos node exists but no Khaos node references it | Low — unused fact (may be fine) |

**Output:** Traceability and Topological Integrity report.

---

## Phase 3: MECE Integrity

**Objective:** Verify structural soundness of the Khaos hierarchy.

For each Khaos node that has children (`se_descompone_en` is non-empty):
1. **Mutual Exclusivity:** Do any two sibling nodes cover overlapping responsibilities? Flag overlaps.
2. **Collective Exhaustiveness:** Does the sum of children's responsibilities cover the parent's responsibility? Flag gaps.
3. **Estado consistency:** If all children are `completo`, is the parent also `completo`? If any child is `con_vacios`, is the parent at most `con_vacios`?

For each Kratos node that has children (`se_descompone_en` is non-empty):
1. Verify children are ME (no two siblings cover the same factual scope).
2. Verify children are CE (the sum of children covers the parent's factual scope).

**Output:** MECE integrity report.

---

## Phase 4: Temporal Coherence

**Objective:** Detect temporal inconsistencies where dates referenced in node content have already elapsed but are described using future tense, conditional mood, or as pending events.

**Context:** The agent resolves the current date from the session metadata (e.g., `2026-05-11T13:30:12-04:00`). All date comparisons use this value dynamically.

### 4.1. Date Extraction

1. Scan all node bodies (Kratos and Khaos) for explicit date references matching patterns: month + year (e.g., "junio 2025", "agosto 2026"), full dates, or temporal markers (e.g., "a contar del 1 de enero de 2025").
2. For each extracted date, determine if it is **in the past** relative to the current session date.

### 4.2. Tense Verification

For each date that is in the past, verify the surrounding prose does NOT:
1. Use future tense (e.g., "entrarán", "se habilitará", "deberá").
2. Use conditional mood framing it as pending (e.g., "tiene su fecha fijada", "está prevista para").
3. Describe the event as a planning consideration rather than an accomplished fact (e.g., "el MVP debe dimensionar" when the event already occurred).

### 4.3. Remediation Criteria

For each flagged anachronism:
- Rewrite the prose to reflect the event as a **past fact** with present-day operational implications.
- Quantify the elapsed time when relevant (e.g., "activa desde junio 2025, casi un año de deuda acumulada").
- Preserve the original date as historical reference; do not remove it.
- Update `## Qué falta` sections in Khaos nodes if the gap was framed as future-conditional but is now a present-day constraint.

| Type | Detection | Severity |
|---|---|---|
| Future tense for past date | Node describes an elapsed date using future or conditional mood | High — factual inaccuracy |
| Pending framing for active obligation | An obligation that is already in force is described as a planning consideration | Medium — understates operational urgency |
| Hardcoded temporal reference | A node contains a phrase like "a la fecha (mayo 2026)" that will become stale | Low — cosmetic, but flag for awareness |

**Output:** Temporal coherence report listing all anachronisms found and remediated.

---

## Phase 5: USER-DECISIONS Currency

**Objective:** Verify that operational memory is current.

1. Read `docs/USER-DECISIONS.md`.
2. For each deferral (⏸️), check if its reopening condition has been met based on current KB state.
3. For each active decision (💡), verify it's not contradicted by current node content.
4. For each resolved decision (✅), verify it was actually applied in the KB.
5. Flag expired deferrals, contradicted decisions, and unapplied resolutions.

**Output:** Memory currency report.

---

## Phase 6: MASTER-SPEC Coherence

**Objective:** Verify that MASTER-SPEC reflects the actual state of the Knowledge Base.

1. Does §7.1 "Estado actual" reflect the actual contents of `knowledge-base/kratos/` (node count, root entities, frameworks)?
2. Does §7.2 "Estado actual" reflect the actual contents of `knowledge-base/khaos/` (node count, root, responsibilities)?
3. Are §4 constraints consistent with `.agents/rules/05-constraints.md`?
4. Do §5 trade-offs reflect current USER-DECISIONS?
5. Does §7.5.2 (Khaos template) match the actual node structure used in `khaos/`?
6. Does §7.6.2 (Kratos template) match the actual node structure used in `kratos/`?

**Output:** Coherence report.

---

## Phase 7: REPOMAP Synchronization

The `/repomap` workflow executes and overwrites `docs/REPOMAP.md` to match the repository's current physical state.

After execution, verify that:
1. Kratos node count in REPOMAP matches `ls knowledge-base/kratos/*.md | wc -l`.
2. Khaos node count in REPOMAP matches `ls knowledge-base/khaos/*.md | wc -l`.
3. Khaos responsibility names in REPOMAP match actual filenames.

---

## Consolidated Report

Generate a single summary:

| Area | Status | Issues |
|---|---|---|
| Node-template compliance (Khaos) | ✅ / ⚠️ | [count] non-compliant nodes |
| Node-template compliance (Kratos) | ✅ / ⚠️ | [count] non-compliant nodes |
| Traceability Khaos→Kratos | ✅ / ⚠️ | [count] broken links |
| Bidirectional hierarchy | ✅ / ⚠️ | [count] unidirectional links |
| Cross-domain contamination | ✅ / ⚠️ | [count] violations |
| Name collisions | ✅ / ⚠️ | [count] collisions |
| Lateral symmetry | ✅ / ⚠️ | [count] asymmetric pairs |
| Circular self-references | ✅ / ⚠️ | [count] self-referencing nodes |
| MECE integrity (Khaos) | ✅ / ⚠️ | [count] ME overlaps, [count] CE gaps |
| MECE integrity (Kratos) | ✅ / ⚠️ | [count] ME overlaps, [count] CE gaps |
| Temporal coherence | ✅ / ⚠️ | [count] anachronisms |
| USER-DECISIONS currency | ✅ / ⚠️ | [count] expired deferrals |
| MASTER-SPEC coherence | ✅ / ⚠️ | [count] discrepancies |
| REPOMAP | ✅ | Synchronized |
