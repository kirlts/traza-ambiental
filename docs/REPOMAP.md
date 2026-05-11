# REPOMAP: traza-ambiental

> Generated: 2026-05-10 (session-2 update)  
> Purpose: Routing matrix. Defines when the AI is authorized to read each directory or file.

## Authoring Constraints (Read Before Populating)

- **Scope:** Map the host project only. Kairós governance files (`.agents/`) are invisible infrastructure. They MUST NOT appear as Domain Axioms or individual rows. If listed at all, compress them into a single noise cluster row labeled `Kairós Governance`. The documentary axis files in `docs/` are project documentation, not governance. `docs/MASTER-SPEC.md` receives an individual row as a Domain Axiom; the remaining axis files defined in `04-documentation.md` are grouped into a single row.
- **Abstraction level:** Source code files are always mapped at the directory level, never as individual rows. Only documentation and specification files qualify for individual rows as Domain Axioms, per the three-signal detection algorithm in the `/repomap` workflow.
- **Anti-recency bias:** The physical timestamp of a file is not a factor. Do not elevate recently modified files. Prominence is determined by architectural role defined in `MASTER-SPEC`, not by modification date.
- **MECE:** Every row must be Mutually Exclusive (no overlapping access conditions) and Collectively Exhaustive (every directory or logical cluster must be represented).
- **Language:** This document is written in English regardless of the host project's language.

## Routing Matrix

| Directory / File | Nature | When to Consult |
|---|---|---|
| `docs/MASTER-SPEC.md` | Domain Axiom — Foundational specification | **Always first.** Defines the Kratos/Khaos/Antigravity architecture, node templates (§7.5, §7.6), constraints (§4), operational workflows (§7.7), and the Classification Gate. Single source of truth. |
| `docs/USER-DECISIONS.md` | Domain Axiom — Operational memory | **Always second** (per `01-behavior.md` step 3). Active decisions, deferred decisions (with reopening conditions), human preferences. Must be consulted before escalating any gap during Phase 2 audits. |
| `docs/MEMORY.md` | Documentary axis | When recording or consulting transferable heuristics. Append-only. |
| `docs/REPOMAP.md` | Documentary axis | Self-referential. Regenerated via `/repomap` or `/document`. |
| `Docs/context.md` | Domain Axiom — Methodological foundation | When understanding the fundamental Kratos/Khaos/Antigravity methodology, the Knowledge Base architecture, or Obsidian compatibility requirements. Original vision document that MASTER-SPEC implements. |
| `Docs/conversation.md` | Domain Axiom — Origin narrative | When tracing the original conversation that gave birth to the planning system. Contains the raw ideation exchange between the human and the AI that preceded the formalization in MASTER-SPEC. |
| `knowledge-base/kratos/` | Architectural Module — Factual knowledge store | When executing Phase 2 audits (searching for factual backing), structuring raw information (Phase 1 Kratos), or verifying factual integrity. |
| `knowledge-base/kratos/external-research/` | Sub-module — Raw research dumps | When structuring Kratos nodes from external sources. Contains unprocessed research: `gemini-deep-research/` (9 AI research reports on NFU/Ley REP domain) and `other/` (reference datasets). Raw material awaiting Phase 1 structuring. |
| `knowledge-base/khaos/` | Architectural Module — MVP planning tree | When instantiating Khaos nodes (Phase 1), auditing gaps (Phase 2), or traversing the responsibility hierarchy. Contains 8 nodes: 1 root (`Trazambiental.md`) + 7 children. |
| `knowledge-base/.obsidian/snippets/` | Infrastructure — Obsidian styling | Version-controlled CSS snippets for KB rendering. `trazambiental.css` provides justified text for nodes with `cssclasses: [kb-node]`. |
| `work/` | Session input — Raw dumps | Transcripts and summaries from human sessions. Input material for Khaos Phase 1. Not part of the KB. |
| `info/` | Reference material — Research dumps | Raw research reports and domain information. Input material for Kratos Phase 1 structuring. |
| `.agents/` | Kairós Governance (noise cluster) | Internal infrastructure. 4 rules, 3 skills, 6 workflows, 6 templates. Not consulted directly except through Dynamic Context Load in `01-behavior.md`. |
