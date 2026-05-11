---
trigger: ai_contextual
description: Activates when the human provides factual information (legal text, business rule, CEO decision, technical requirement, external factor). Processes raw material into atomic Kratos nodes.
---

# Estructurar Kratos

This workflow processes raw factual information provided by the human and structures it into atomic, verifiable Kratos nodes within `knowledge-base/kratos/`.

> **Activation:** AI-triggered. Antigravity activates this workflow when Phase 0 (Classification Gate, MASTER-SPEC §7.7) classifies the human's input as a **Fact**.
> **Clarification principle:** If the classification between Fact and Responsibility is ambiguous, Antigravity asks the human before proceeding.

---

## Phase 0: Propose and Confirm

**Objective:** Secure human authorization before any modification.

1. **Propose:** Present a complete inventory of ALL side effects to the user. The proposal MUST explicitly cover, for each factual unit:
   - **Action type:** New node / Append / Mutation.
   - **Target node(s):** Exact filename(s) that will be created or modified.
   - **Hierarchy changes:** Which parent's `se_descompone_en` will be updated (bidirectional).
   - **Lateral relations — new:** Any new `se_relaciona_con` entries to be added to the new or mutated node, with a brief description of the relation type (e.g., Fricción, Complementariedad, Obligación).
   - **Lateral relations — inverse:** Any existing node whose `se_relaciona_con` YAML and `## Relaciones Horizontales` body must be updated to reflect the relation from the other side.
2. **Confirm:** Wait for the user to explicitly confirm ("sí", "dale", "ok").
> **[FATAL WARNING]** Proceeding to Phase 1 without explicit user confirmation is a severe protocol violation. Do NOT write to `knowledge-base/kratos/` until authorized.

## Phase 1: Classification

**Objective:** Determine the type of fact being provided.

1. Parse the human's input to extract the factual claim(s).
2. Classify each claim into one of the canonical types defined in MASTER-SPEC §7.6.2:
   - `norma_legal` — Law, regulation, decree, normative article
   - `decision_del_humano` — Explicit decision by the human (CEO, founder, stakeholder)
   - `regla_de_negocio` — Operational business rule derived from practice
   - `requisito_tecnico` — Technical requirement from platforms, integrations, or systems
   - `factor_externo` — Market condition, competitive landscape, external constraint
   - `hecho_negativo` — The explicit lack or absence of a capability, directory, or requirement in official systems. (CRITICAL: Negative facts justify business value and differentiators).
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
3. **Jerarquía Topológica:** Si el hecho pertenece a un cuerpo normativo o institución, instanciar primero los nodos contenedores correspondientes (ej. Ministerio, Ley, Artículo). Los hechos no deben flotar aislados.
4. Verify MECE compliance: the new/updated node must not overlap with sibling nodes (ME), and the set of siblings must cover the parent's scope (CE). Flag CE gaps if detected.

**Output:** Decision per factual unit (append / new node / child node) with target location.

## Phase 3: Instantiation

**Objective:** Create or update the Kratos node(s).

1. For new nodes: copy `.agents/templates/kratos-nodo.md` into `knowledge-base/kratos/` with a human-readable filename in Spanish. **Naming rule (Anti-solapamiento):** Filenames must be clean and concise. Do not prefix conceptual child nodes with their parent's name (e.g., use `Producto Prioritario.md`, not `Ley 20.920 - Producto Prioritario.md`). **Exception:** Structural nodes (Articles, Chapters) MUST include the parent prefix to ensure global uniqueness in the vault (e.g., `Ley 20.920 - Artículo 3.md`, NOT `Artículo 3.md`). Hierarchy is maintained strictly via `depende_de`.
2. Populate YAML frontmatter: `estado: borrador`, `tipo: [classified type]`, `vigencia: por_verificar`, `depende_de: [[parent]]`, `se_descompone_en: []`, `se_relaciona_con: []`, `cssclasses: [kb-node]` (mandatory for formatting).
3. **Formatting rule (INVIOLABLE):** NEVER wrap wikilinks in backticks (e.g., `[[Node]]`). Backticks format the text as inline code, breaking Obsidian's bidirectional graph detection. All links must be plain `[[Node]]`.
4. Populate `## Qué dice` with the factual claim in natural language. This is a synthesis, not a verbatim quote.
5. Populate `## Fuente original` with the source identification.
6. Populate `## Evidencia` with the link to REAL material (PDF path, official URL, image, or verbatim blockquote). **CRITICAL:** Kratos nodes MUST NEVER cite internal research reports (e.g., deep research) directly or indirectly. If no REAL source or evidence exists, this field MUST be left completely blank.
7. **Transcription rule:** Antigravity transcribes what the human provided. It does not interpret the scope, implications, or applicability of the fact. Interpretation belongs to Khaos.

**Output:** Kratos node(s) created or updated in `knowledge-base/kratos/`.

## Phase 4: Gate

Verify before completing:

| Check | Criterion |
|---|---|
| Fidelity | Does `que_dice` faithfully reflect the information provided by the human? |
| Evidence | Is `evidencia` linked to a REAL concrete source (not an internal report), or explicitly left blank if none exists? |
| Type | Is `tipo` correctly classified? |
| Naming | Is the filename human-readable and self-explanatory in Spanish? |
| Hierarchy (Orphans) | Is the node linked to a parent via `depende_de` (unless it is a legitimate root entity)? |
| Hierarchy (Bidirectional) | If child node: is parent's `se_descompone_en` updated to include this node? |
| Lateral Relations (Outgoing) | Are all new `se_relaciona_con` entries captured in YAML and explained in `## Relaciones Horizontales`? |
| Lateral Relations (Incoming) | For every new lateral relation, has the REMOTE node's `se_relaciona_con` YAML and `## Relaciones Horizontales` been updated to reflect the inverse link? |

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
