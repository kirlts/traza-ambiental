---
trigger: ai_contextual
description: Activates when the human describes a responsibility of the MVP (functionality, module, capability, actor, flow). Instantiates or mutates Khaos nodes.
---

# Desplegar Khaos

This workflow processes MVP responsibility information from the human and instantiates or mutates Khaos nodes within `knowledge-base/khaos/`.

> **Activation:** AI-triggered. Antigravity activates this workflow when Phase 0 (Classification Gate, MASTER-SPEC §7.7) classifies the human's input as a **Responsibility**.
> **Clarification principle:** If the classification is ambiguous, Antigravity asks the human before proceeding.

---

## Phase 1: Extraction

**Objective:** Identify the responsibility described by the human.

1. Parse the human's input to extract the responsibility claim(s).
2. Express each responsibility as a single statement: "The MVP is responsible for [X]."
3. If the input contains multiple responsibilities, decompose into individual units. Each is processed independently.

**Output:** List of responsibility statements extracted from the conversation.

## Phase 2: MECE Evaluation

**Objective:** Determine whether each responsibility creates a new node, appends to an existing one, or triggers a structural mutation.

For each responsibility:
1. Read the existing Khaos node index (traverse `knowledge-base/khaos/`).
2. Evaluate:
   - Does a node already cover this responsibility? → **Append** (elaboration, constraint, or clarification of the same responsibility).
   - Is the responsibility distinguishable from all existing nodes? → **New node**.
   - Does it subdivide an existing responsibility? → **New child node** + update parent's `se_descompone_en`.
   - Does it invalidate or merge with an existing responsibility? → **Mutation** (see MASTER-SPEC §7.5.4).
3. Verify MECE compliance among siblings. Flag CE gaps if the sum of children doesn't cover the parent.

**Output:** Decision per responsibility (append / new / child / mutation) with target and rationale.

## Phase 3: Instantiation

**Objective:** Create or update the Khaos node(s).

1. For new nodes: copy `.agents/templates/khaos-nodo.md` into `knowledge-base/khaos/` with a human-readable filename in Spanish.
2. Populate YAML frontmatter: `estado: borrador`, `depende_de: [[parent]]`, `se_descompone_en: []`.
3. Populate `## Qué es` with the responsibility in one phrase — only if the human provided this information.
4. Populate `## Por qué existe` with a wikilink to the parent node or Kratos source — only if known.
5. Populate `## Compromisos` table: fill **only** the rows the human explicitly described. The columns (Actor, Acción, Sustento) are always present. Cells without information remain **structurally empty**.
6. `## Qué falta` remains empty. This section is populated exclusively by Phase 2 audits (auditar-vacios workflow).
7. **Transcription rule (INVIOLABLE):** Antigravity transcribes exclusively what the human said. No speculative content, no placeholder text, no suggested completions. Empty cells are the product.

**Output:** Khaos node(s) created or updated in `knowledge-base/khaos/`.

## Phase 4: USER-DECISIONS Filter

**Objective:** Ensure deferred topics are respected.

1. Read `docs/USER-DECISIONS.md`.
2. For each field in the newly created/updated node, check if it touches a topic covered by a vigent deferral (⏸️).
3. If yes: leave the field empty without escalating. The deferral governs.

**Output:** Confirmation that no deferred topics were re-raised.

## Phase 5: Gate

Verify before completing:

| Check | Criterion |
|---|---|
| Fidelity | Does the node reflect EXCLUSIVELY what the human said? |
| No speculation | Are there any AI-generated suggestions, questions, or placeholder text in the node? If yes → remove. |
| Naming | Is the filename human-readable and self-explanatory in Spanish? |
| Hierarchy | If child: is parent's `se_descompone_en` updated? If mutation: are affected nodes updated? |
| Deferrals | Were all vigent deferrals respected? |

If any check fails, correct before proceeding.

## Extended Operations (Working Document Pattern)

When deploying a large branch of the Khaos tree (e.g., decomposing a top-level module into multiple sub-responsibilities), Antigravity generates a working document (`khaos_deployment_working.md`) that tracks:

| Column | Purpose |
|---|---|
| Responsibility | The responsibility being decomposed |
| Status | Pending / Instantiated / Needs human input |
| Node created | Wikilink to resulting Khaos node |
| CE gaps detected | Missing siblings that would complete the parent |
| Questions for human | Ambiguities requiring clarification |

The working document lives in the session's artifact directory. The Khaos nodes are permanent.
