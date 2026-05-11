# REPOMAP: traza-ambiental

> Generated: 2026-05-11T14:28:24-04:00 (Kairós v0.1.0)  
> Purpose: Routing matrix. Defines when the AI is authorized to read each directory or file.

## Authoring Constraints (Read Before Populating)

- **Scope:** Map the host project only. Kairós governance files (`.agents/`, `README-KAIROS.md`, `kairos-version.txt`) are invisible infrastructure. They MUST NOT appear as Domain Axioms or individual rows. If listed at all, compress them into a single noise cluster row labeled `Kairós Governance`. The documentary axis files in `docs/` are project documentation, not governance. `docs/MASTER-SPEC.md` receives an individual row as a Domain Axiom; the remaining axis files defined in `04-documentation.md` are grouped into a single row.
- **Abstraction level:** Source code files are always mapped at the directory level, never as individual rows. Only documentation and specification files qualify for individual rows as Domain Axioms, per the three-signal detection algorithm in the `/repomap` workflow.
- **Anti-recency bias:** The physical timestamp of a file is not a factor. Do not elevate recently modified files. Prominence is determined by architectural role defined in `MASTER-SPEC`, not by modification date.
- **MECE:** Every row must be Mutually Exclusive (no overlapping access conditions) and Collectively Exhaustive (every directory or logical cluster must be represented).
- **Language:** This document is written in English regardless of the host project's language.

## Routing Matrix

| Directory / File | Nature | When to Consult |
|---|---|---|
| `docs/MASTER-SPEC.md` | Domain Axiom | Consult FIRST to verify architectural constraints, limits, and exact logic before altering KB structure. |
| `docs/*.md` | Documentary Axis | Consult to load operational memory (USER-DECISIONS) before escalating gaps or making design decisions. |
| `knowledge-base/kratos/` | Architectural Module | Consult to verify factual ground truth, domain laws, rules, and external constraints (Source of Truth). |
| `knowledge-base/khaos/` | Architectural Module | Consult to understand MVP responsibilities and capabilities, or to audit structural gaps. |
| `info/` | Raw Data | Consult to process raw research into Kratos nodes using structured workflows. NOT a source of verified truth. |
| `work/` | Ephemeral Work | Consult for temporary scratchpads or draft materials. |
| `*.*` & `.git/` | Root Configs | Consult only when modifying repository-level configs like ignore rules. |
| `.agents/` | Kairós Governance | Invisible infrastructure. Consult only when explicitly instructed to modify agent rules or templates. |
