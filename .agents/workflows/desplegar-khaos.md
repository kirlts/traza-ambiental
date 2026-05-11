---
trigger: ai_contextual
description: Activates when the human describes a responsibility of the MVP (functionality, module, capability, actor, flow). Instantiates or mutates Khaos nodes.
---

# Desplegar Khaos

This workflow processes MVP responsibility information from the human and instantiates or mutates Khaos nodes within `knowledge-base/khaos/`.

> **Activation:** AI-triggered. Antigravity activates this workflow when Phase 0 (Classification Gate, MASTER-SPEC §7.7) classifies the human's input as a **Responsibility**.
> **Clarification principle:** If the classification is ambiguous, Antigravity asks the human before proceeding.

---

## Phase 0: Propose and Confirm

**Objective:** Secure human authorization before any modification.

1. **Propose:** Present a complete inventory of ALL side effects to the user. The proposal MUST explicitly cover, for each responsibility:
   - **Action type:** New node / Append / Mutation.
   - **Target node(s):** Exact filename(s) that will be created or modified.
   - **Hierarchy changes:** Which parent's `se_descompone_en` will be updated (bidirectional).
   - **Lateral relations — new:** Any new `se_relaciona_con` entries to be added to the new or mutated node, with a brief description of the relation type.
   - **Lateral relations — inverse:** Any existing node whose `se_relaciona_con` YAML and `## Relaciones Horizontales` body must be updated to reflect the inverse link.
2. **Confirm:** Wait for the user to explicitly confirm ("sí", "dale", "ok"). 
> **[FATAL WARNING]** Proceeding to Phase 1 without explicit user confirmation is a severe protocol violation. Do NOT write to `knowledge-base/khaos/` until authorized.

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

1. For new nodes: copy `.agents/templates/khaos-nodo.md` into `knowledge-base/khaos/` with a human-readable filename in Spanish. **Naming rule (Namespacing Ontológico):** Filenames MUST be action-oriented phrases representing system responsibilities or capabilities (e.g., `Gestión de Generadores`, `Módulo de Trazabilidad`, `Validación de...`). NEVER use just the noun of the entity it manages. This prevents naming collisions with Kratos. Do not prefix child nodes with their parent's name. Hierarchy is maintained strictly via `depende_de`.
2. Populate YAML frontmatter: `estado: borrador`, `depende_de: [[parent]]`, `se_descompone_en: []`, `se_relaciona_con: []`, `cssclasses: [kb-node]` (mandatory for formatting).
3. **Formatting rule (INVIOLABLE):** NEVER wrap wikilinks in backticks (e.g., `[[Node]]`). Backticks format the text as inline code, breaking Obsidian's bidirectional graph detection. All links must be plain `[[Node]]`.
4. Populate `## Qué es` with the responsibility in one phrase — only if the human provided this information.
5. Populate `## Por qué existe` with a wikilink to the parent node or Kratos source — only if known.
6. Populate `## Compromisos` table: fill **only** the rows the human explicitly described. The columns (Actor, Acción, Sustento) are always present. Cells without information remain **structurally empty**.
7. **Exhaustividad Inducida (INVIOLABLE):** Rellenar la sección `## Qué falta` evaluando críticamente la responsabilidad descrita. Si no hay vacíos evidentes detectados por la auditoría, Antigravity DEBE proponer **hipótesis de vacíos** (ej. casos límite no contemplados, riesgos regulatorios latentes, integraciones futuras necesarias). Esta sección NUNCA debe quedar vacía.
8. **Transcription rule:** Antigravity transcribe fielmente lo que dice el humano para la esencia y los compromisos, pero **DEBE actuar como co-arquitecto crítico** en la redacción de la sección `## Qué falta`, aportando visión y especulación sobre lo que podría estar obviándose.

**Output:** Khaos node(s) created or updated in `knowledge-base/khaos/`.

## Phase 4: USER-DECISIONS Filter

**Objective:** Ensure deferred topics are respected.

1. Read `docs/USER-DECISIONS.md`.
2. For each field in the newly created/updated node, check if it touches a topic covered by a vigent deferral (⏸️).
3. If yes: leave the field empty without escalating. The deferral governs.

**Output:** Confirmation that no deferred topics were re-raised.

## Phase 5: Enriquecimiento Kratos y Reality Check

**Objective:** Ensure extreme architectural rigor by crossing the new Khaos node with the existing Kratos foundation and evaluating its pragmatic viability.

1. **Kratos Cross-Reference:** Antigravity MUST proactively search the existing `kratos/` directory for facts (laws, constraints, operational standards like `OIML R76-1` or `Ley 21.719`) that apply to the responsibility but were not explicitly mentioned by the human. Enrich the `## Compromisos` table with these findings.
2. **Deep Hypotheses (True Gaps):** When filling `## Qué falta` (Phase 3, Step 7), Antigravity MUST push past superficial gaps and formulate hypotheses about *true structural gaps* in Kratos (e.g., "Kratos does not specify the legal protocol if X fails"). Every hypothesis must be grounded in a Kratos reality.
3. **Pragmatic Reality Check:** Silently evaluate the updated Khaos architecture against 6 perspectives: Filosófica (Middleware purity), Económica (B2B value/cost), Técnica (AI buildability vs Deadline), Regulatoria (Strict compliance vs nice-to-have), Práctica (Field friction), and Pragmática (Scope creep).
4. **Challenge Rule:** If the Reality Check reveals severe scope creep, field friction, or risk to the timeline, Antigravity MUST challenge the human in the chat response, explicitly proposing simplifications or deferrals.

**Output:** Enriched node and critical evaluation ready for chat response.

## Phase 6: Gate

Verify before completing:

| Check | Criterion |
|---|---|
| Fidelity | Does the node reflect EXCLUSIVELY what the human said? |
| No speculation | Are there any AI-generated suggestions, questions, or placeholder text in the node? If yes → remove. |
| Naming | Is the filename an action-oriented phrase (responsibility/capability), NOT just a noun? |
| Phantom Nodes | Was the node created using the proper template and NOT as an empty 0-byte file? |
| Hierarchy (Orphans) | Is the node linked to a parent via `depende_de` (unless it is a legitimate root entity)? |
| Hierarchy (Bidirectional) | If child: is parent's `se_descompone_en` updated? If mutation: are affected nodes updated? |
| Lateral Relations (Outgoing) | Are all new `se_relaciona_con` entries captured in YAML and explained in `## Relaciones Horizontales`? |
| Lateral Relations (Incoming) | For every new lateral relation, has the REMOTE node's `se_relaciona_con` YAML and `## Relaciones Horizontales` been updated to reflect the inverse link? |
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
