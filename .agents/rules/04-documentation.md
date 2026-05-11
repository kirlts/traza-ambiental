---
trigger: model_decision
description: Applies when creating, reading, or modifying project documentation within the docs/ directory (MASTER-SPEC, USER-DECISIONS, MEMORY) or verifying Knowledge Base node integrity.
---

# Documentation & Operational Cycle

## [RULE: REPOSITORY LOCALIZATION]

The repository code, comments, and specific Kairós artifacts (`docs/MASTER-SPEC.md`, `docs/USER-DECISIONS.md`, etc.) belong to the Project Domain. When creating, writing to, or editing these files, the system silently detects the dominant language of the target file (or the user's project context) and strictly appends or modifies content in that same language. Leaking English governance reasoning into localized project documentation is strictly forbidden.

## Documentary Axis

All guiding project documents reside in `/docs/`. The canonical templates reside in `.agents/templates/`. When creating a new document, copy the corresponding template and populate it with the project's content.

| Document | Template | Purpose |
|---|---|---|
| `docs/MASTER-SPEC.md` | `.agents/templates/master-spec.md` | Technical and architectural specification of the Kratos/Khaos/Antigravity system. |
| `docs/USER-DECISIONS.md` | `.agents/templates/user-decisions.md` | Operational memory. Decisions (active, deferred, preferences). Read on every session start. |
| `docs/MEMORY.md` | `.agents/templates/memory.md` | Transferable heuristics. Append-only. |
| `docs/REPOMAP.md` | `.agents/templates/repomap.md` | Routing matrix for AI context authorization. |

## Knowledge Base Axis

In addition to the documentary axis, the Knowledge Base itself is governed by node templates:

| Node Type | Template | Location |
|---|---|---|
| Khaos node | `.agents/templates/khaos-nodo.md` | `knowledge-base/khaos/` |
| Kratos node | `.agents/templates/kratos-nodo.md` | `knowledge-base/kratos/` |

## [RULE: OPERATIONAL MEMORY PROTOCOL]

`docs/USER-DECISIONS.md` is the persistent operational memory of the AI across sessions. Sessions are chaotic, parallel, and have no formal start/end. This protocol ensures continuity:

1. **Read on init:** The AI reads `docs/USER-DECISIONS.md` at the start of every session, immediately after the REPOMAP gate.
2. **Consult before escalation:** During Phase 2 audits (gap detection in Khaos), the AI checks USER-DECISIONS BEFORE escalating a gap to the human. If the gap is covered by a vigent deferral (⏸️), it is silently noted — not re-raised.
3. **Register on decision:** The AI proposes a USER-DECISIONS entry when:
   - The human makes a strategic decision affecting MVP scope, design, or priority.
   - The human explicitly defers a decision.
   - The human expresses an operational preference.
   - A prior decision is reverted.
4. **Human confirmation required:** The AI drafts the entry; the human confirms before it is written.

## Work Cycle

**BEFORE:** The AI classifies the human's input using the Classification Gate (MASTER-SPEC §7.7 Phase 0) to determine which workflow to activate.

**DURING:** If a decision arises with multiple valid options, MASTER-SPEC §5 is referenced to tie-break. If an ambiguity arises, the AI asks the human for clarification rather than assuming.

**AFTER:** The resulting nodes or documentation changes are validated against the node templates. The `/document` workflow can be executed as a coherence check.

## Anti-Bias Heuristics Protocol

Before writing a heuristic into `docs/MEMORY.md`:
1. A web search is executed to verify if the pattern is generalized and scientifically sound.
2. If external confirmation exists, it is written citing the source.
3. If no confirmation exists, the system declares to the user: "I observed pattern [X]. I found no external confirmation. Do you confirm this should be memorized?"
4. If the user confirms, it is written with the tag `[Confirmed by user - no external source]`.

## [RULE: MARKDOWN FORMATTING STANDARD FOR KB NODES]

All files in `knowledge-base/` must adhere to this formatting standard. The principles are derived from anti-convergence research on AI-generated content (ai-smell-research): every rule exists to prevent the node from looking machine-generated when rendered in Obsidian.

**Obsidian baseline:** Obsidian uses CommonMark + GitHub Flavored Markdown (GFM) with proprietary extensions (wikilinks, Properties). Files are plain `.md`. The graph detects `[[]]` patterns from the **note body only** — YAML frontmatter links are NOT detected by the graph natively. This distinction is critical and drives several rules below.

### Structural Hierarchy (anti Cat-2: Typographic Monotony)

- **H1** (`#`): Exactly one per file. The node name. Matches the filename.
- **H2** (`##`): Template sections only (`Qué es`, `Por qué existe`, `Compromisos`, `Se descompone en`, `Qué falta`).
- **H3** (`###`): Subsections within a template section, when the human's information warrants it.
- No heading level is skipped. No H4+ unless organically required by depth of decomposition.

### Semantic Spacing (anti Cat-4: Spacing Without Purpose)

- **One blank line** after every heading before its content.
- **One blank line** between rows of prose within the same section.
- **Two blank lines** between major sections (before the next `##`).
- Empty sections contain exactly one blank line after the heading — no more, no less.
- Rationale: related content stays visually grouped (Gestalt proximity); distinct sections breathe.

### Tables (anti Cat-5: Cards Everywhere)

- Tables use minimal GFM syntax: `|---|---|---|`. No column alignment padding.
- Empty cells are truly empty: `| |`, not `| — |`, not `|  |` (double space).
- Tables are the ONLY structure used for compromisos. Prose is never used for commitments.

### Cross-References (anti Cat-9: Flat Architecture)

- All references between nodes use wikilinks: `[[Node Name]]`.
- **No backticks around wikilinks:** Never wrap wikilinks in backticks (e.g., `[[Node]]`). Backticks format the text as inline code, which completely disables Obsidian's link detection and breaks the graph.
- **Body is authoritative for graph:** Wikilinks MUST appear in the Markdown body to be detected by Obsidian's graph view. YAML frontmatter links are metadata only — they are NOT rendered as graph edges.
- **Child nodes must link to parent in body:** Every child node's `## Por qué existe` section must contain `[[Parent Name]]`. An empty `Por qué existe` in a child node is a formatting violation — it breaks the bidirectional graph link between parent and child. This was a session-0 error that must not recur.
- **`## Se descompone en` lists wikilinks in body:** The body section mirrors the YAML `se_descompone_en` list. This redundancy is intentional: YAML serves machine parsing, body serves Obsidian graph.
- No Markdown links `[text](path)` within KB node bodies. Wikilinks exclusively.
- If a standard Markdown link is ever necessary (e.g., in governance docs referencing KB), use relative paths from `knowledge-base/`: `../kratos/name.md`. Never absolute paths.

### Language Precision (anti Cat-10: Corporate-Startup Tone)

- No filler adjectives ("importante", "fundamental", "clave") unless they carry specific meaning.
- No emojis in KB node content. Emojis are reserved exclusively for USER-DECISIONS status symbols (💡, ⏸️, ↩️).
- Compromisos descriptions are specific actions, not vague aspirations. "Registrar declaraciones de residuos por actor" ✓. "Gestionar eficientemente los datos" ✗.
- `Qué es` is one paragraph, maximum three sentences. If it needs more, the node should decompose.

### YAML Frontmatter

- Fields: `cssclasses`, `estado`, `depende_de`, `se_descompone_en`, `se_relaciona_con`.
- `cssclasses: [kb-node]` — **mandatory on every KB node.** Activates the Obsidian CSS snippet (`trazambiental.css`) that renders justified text without hyphenation. Omitting this field is a formatting violation.
- `estado` values: `borrador` · `con_vacios` · `completo` · `validado`.
- `depende_de`: wikilink string to parent (`"[[Parent Name]]"`) or empty for root.
- `se_descompone_en`: YAML list of wikilink strings, or `[]` if no children.
- No additional YAML fields without explicit human approval.
- **YAML is for machine parsing; body is for Obsidian.** The YAML frontmatter is read by Antigravity and displayed as Obsidian Properties. It does NOT generate graph edges. Every wikilink in YAML must also exist in the corresponding body section.

### Visual Rendering (Obsidian)

- All KB nodes render with **justified text, no hyphenation** via the CSS snippet at `knowledge-base/.obsidian/snippets/trazambiental.css`.
- The snippet is scoped to `cssclasses: [kb-node]` — it only affects KB nodes, not other vault files.
- Tables are excluded from justification (left-aligned for readability).
- The snippet must be enabled in Obsidian: **Settings > Appearance > CSS Snippets > trazambiental > ON**.

## Workflow Fidelity

Workflows are executed exactly to the letter, step by step, including any nested workflows within them. Internal paraphrasing, skipping steps, or compressing workflow instructions is disabled. Every step of a workflow must produce a verifiable artifact before advancing to the next.