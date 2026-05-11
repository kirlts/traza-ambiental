---
description: /document - Synchronizes the documentary axis (MASTER-SPEC, USER-DECISIONS, MEMORY, REPOMAP) and verifies structural coherence of the Knowledge Base (Kratos/Khaos node compliance, traceability, MECE integrity).
---

# Documentary Synchronization

This workflow ensures that project documentation and the Knowledge Base maintain structural coherence. Adapted for a planning repository governed by Kratos/Khaos methodology.

---

## Phase 1: Node-Template Compliance

**Objective:** Verify that all instantiated nodes conform to their canonical templates.

### 1.1. Khaos Nodes

For each file in `knowledge-base/khaos/`:
1. Verify YAML frontmatter contains all mandatory fields: `estado`, `depende_de`, `se_descompone_en`.
2. Verify Markdown body contains all mandatory sections: `## Qué es`, `## Por qué existe`, `## Compromisos`, `## Se descompone en`, `## Qué falta`.
3. Verify `## Compromisos` contains a table with columns: Actor, Acción en el sistema, Sustento.
4. Flag missing sections or malformed structure.

### 1.2. Kratos Nodes

For each file in `knowledge-base/kratos/` (excluding `external-research/`):
1. Verify YAML frontmatter contains: `estado`, `tipo`, `vigencia`, `depende_de`, `se_descompone_en`.
2. Verify `tipo` is one of: `norma_legal`, `decision_del_humano`, `regla_de_negocio`, `requisito_tecnico`, `factor_externo`.
3. Verify Markdown body contains: `## Qué dice`, `## Fuente original`, `## Evidencia`.
4. Flag nodes with empty `## Evidencia` as unverified (factualidad 100% constraint).

**Output:** Compliance report table.

---

## Phase 2: Traceability Khaos → Kratos

**Objective:** Verify that all cross-references between Khaos and Kratos are valid.

1. Extract all wikilinks from Khaos nodes that point to Kratos nodes (typically in `## Por qué existe` and `## Compromisos` Sustento column).
2. For each wikilink, verify the target file exists in `knowledge-base/kratos/`.
3. Extract all wikilinks from `depende_de` and `se_descompone_en` fields in both Khaos and Kratos.
4. Verify all parent/child references are bidirectional (parent lists child, child references parent).

| Type | Detection | Severity |
|---|---|---|
| Broken Kratos reference | Khaos node references a Kratos node that doesn't exist | High — missing factual backing |
| Topological Orphan | ANY node (Khaos or Kratos) with an empty `depende_de` field that is NOT a legitimate root entity | High — disconnected from hierarchy |
| Unidirectional link | Parent lists child but child doesn't reference parent (or vice versa) in ANY node (Kratos or Khaos) | High — graph integrity |
| Unused Kratos node | Kratos node exists but no Khaos node references it | Low — unused fact (may be fine) |

**Output:** Traceability and Topological Integrity report with broken links, graph mismatches, and orphans.

---

## Phase 3: MECE Integrity

**Objective:** Verify structural soundness of the Khaos hierarchy.

For each Khaos node that has children (`se_descompone_en` is non-empty):
1. **Mutual Exclusivity:** Do any two sibling nodes cover overlapping responsibilities? Flag overlaps.
2. **Collective Exhaustiveness:** Does the sum of children's responsibilities cover the parent's responsibility? Flag gaps.
3. **Estado consistency:** If all children are `completo`, is the parent also `completo`? If any child is `con_vacios`, is the parent at most `con_vacios`?

**Output:** MECE integrity report.

---

## Phase 4: USER-DECISIONS Currency

**Objective:** Verify that operational memory is current.

1. Read `docs/USER-DECISIONS.md`.
2. For each deferral (⏸️), check if its reopening condition has been met based on current KB state.
3. For each active decision (💡), verify it's not contradicted by current node content.
4. Flag expired deferrals and contradicted decisions.

**Output:** Memory currency report.

---

## Phase 5: MASTER-SPEC Coherence

**Objective:** Verify that MASTER-SPEC reflects the actual state of the Knowledge Base.

1. Does §7.1 (Kratos state) reflect the actual contents of `knowledge-base/kratos/`?
2. Does §7.2 (Khaos state) reflect the actual contents of `knowledge-base/khaos/`?
3. Are §4 constraints consistent with `.agents/rules/05-constraints.md`?
4. Do §5 trade-offs reflect current USER-DECISIONS?

**Output:** Coherence report.

---

## Phase 6: REPOMAP Synchronization

The `/repomap` workflow executes and overwrites `docs/REPOMAP.md` to match the repository's current physical state.

---

## Consolidated Report

Generate a single summary:

| Area | Status | Issues |
|---|---|---|
| Node-template compliance | ✅ / ⚠️ | [count] non-compliant nodes |
| Traceability Khaos→Kratos | ✅ / ⚠️ | [count] broken links, [count] orphans |
| MECE integrity | ✅ / ⚠️ | [count] ME overlaps, [count] CE gaps |
| USER-DECISIONS currency | ✅ / ⚠️ | [count] expired deferrals |
| MASTER-SPEC coherence | ✅ / ⚠️ | [count] discrepancies |
| REPOMAP | ✅ | Synchronized |
