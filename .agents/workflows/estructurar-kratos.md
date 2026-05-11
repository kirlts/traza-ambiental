---
trigger: ai_contextual
description: Activates when the human provides factual information (legal text, business rule, CEO decision, technical requirement, external factor). Processes raw material into atomic Kratos nodes.
---

# Estructurar Kratos

This workflow processes raw factual information provided by the human and structures it into atomic, verifiable Kratos nodes within `knowledge-base/kratos/`.

> **Activation:** AI-triggered. Antigravity activates this workflow when Phase 0 (Classification Gate, MASTER-SPEC §7.7) classifies the human's input as a **Fact**.
> **Clarification principle:** If the classification between Fact and Responsibility is ambiguous, Antigravity asks the human before proceeding.

---

## Phase 1: Classification

**Objective:** Determine the type of fact being provided.

1. Parse the human's input to extract the factual claim(s).
2. Classify each claim into one of the canonical types defined in MASTER-SPEC §7.6.2:
   - `norma_legal` — Law, regulation, decree, normative article
   - `decision_del_humano` — Explicit decision by the human (CEO, founder, stakeholder)
   - `regla_de_negocio` — Operational business rule derived from practice
   - `requisito_tecnico` — Technical requirement from platforms, integrations, or systems
   - `factor_externo` — Market condition, competitive landscape, external constraint
3. If the input contains multiple facts, decompose into individual factual units. Each unit is processed independently.

**Output:** List of factual units with their classified type.

## Phase 2: MECE Evaluation

**Objective:** Determine whether each fact creates a new node or appends to an existing one.

For each factual unit:
1. Read the existing Kratos node index (traverse `knowledge-base/kratos/`).
2. Evaluate:
   - Does a node already cover this fact (same source, same scope)? → **Append** to that node.
   - Is the fact distinguishable from all existing nodes? → **New node**.
   - Does the fact decompose a broader existing fact (e.g., a specific article within a law)? → **New child node** + update parent's `se_descompone_en`.
3. Verify MECE compliance: the new/updated node must not overlap with sibling nodes (ME), and the set of siblings must cover the parent's scope (CE). Flag CE gaps if detected.

**Output:** Decision per factual unit (append / new node / child node) with target location.

## Phase 3: Instantiation

**Objective:** Create or update the Kratos node(s).

1. For new nodes: copy `.agents/templates/kratos-nodo.md` into `knowledge-base/kratos/` with a human-readable filename in Spanish.
2. Populate YAML frontmatter: `estado: borrador`, `tipo: [classified type]`, `vigencia: por_verificar`, `depende_de: [[parent]]`, `se_descompone_en: []`.
3. Populate `## Qué dice` with the factual claim in natural language. This is a synthesis, not a verbatim quote.
4. Populate `## Fuente original` with the source identification.
5. Populate `## Evidencia` with the link to raw material (PDF path, URL, image, or verbatim blockquote).
6. **Transcription rule:** Antigravity transcribes what the human provided. It does not interpret the scope, implications, or applicability of the fact. Interpretation belongs to Khaos.

**Output:** Kratos node(s) created or updated in `knowledge-base/kratos/`.

## Phase 4: Gate

Verify before completing:

| Check | Criterion |
|---|---|
| Fidelity | Does `que_dice` faithfully reflect the information provided by the human? |
| Evidence | Is `evidencia` linked to a concrete source (not empty)? |
| Type | Is `tipo` correctly classified? |
| Naming | Is the filename human-readable and self-explanatory in Spanish? |
| Hierarchy | If child node: is parent's `se_descompone_en` updated? |

If any check fails, correct before proceeding.

## Extended Operations (Working Document Pattern)

When processing large volumes (e.g., structuring the entire `external-research/` dump), Antigravity generates a working document (`kratos_structuring_working.md`) that tracks:

| Column | Purpose |
|---|---|
| Source document | Which file is being processed |
| Status | Pending / In progress / Completed |
| Nodes created | Wikilinks to resulting Kratos nodes |
| Questions for human | Ambiguities that require clarification |

The working document lives in the session's artifact directory. The Kratos nodes are permanent.
