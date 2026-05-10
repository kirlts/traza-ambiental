---
description: /repomap - Generates or updates docs/REPOMAP.md. Creates a dense routing matrix detailing what each project directory is and when it should be consulted.
---

# REPOMAP Generation Workflow

This workflow generates a routing matrix based on the project's physical topology, using MECE (Mutually Exclusive, Collectively Exhaustive) clustering to prevent context bloat.

## Phase 1: Topological Scan and Classification

1. The system scans the repository's root directory.
2. The system MUST classify every physical entity (file or directory) into the following hierarchy, ensuring MECE compliance:
   
   **Step 2a: Axiomatic Pre-Contextualization**
   - Identify files that define core business logic, database schemas, or immutable architectural rules (including the Kairós base documents like `MASTER-SPEC.md`).
   - Elevate these as isolated "Domain Axioms". Assign them individual rows with a high-priority consultation directive.

   **Step 2b: Architectural Modules**
   - Identify directories corresponding to system modules (e.g., `src/`, `tests/`).
   - Cross-reference with `docs/MASTER-SPEC.md §7` to extract their architectural nature.

   **Step 2c: MECE Compression (The "Noise" Clusters)**
   - Compress all remaining root files and unmapped directories into logical aggregates (e.g., `*.* (Root Configs)` for configuration files, `docs/*.md` for secondary documentation).
   - Single flat files MUST NOT be mapped individually unless they are Axioms.

## Phase 2: Matrix Assembly

1. The system reads the project name from `docs/MASTER-SPEC.md §1`.
2. The system loads `.agents/templates/repomap.md`.
3. The system replaces `[INSERT_PROJECT_NAME]`, `[INSERT_TIMESTAMP]`, and `[INSERT_VERSION]`.
4. The system generates routing rows for each physical item identified in Phase 1. Each row specifies the name, its nature, and a logical condition mapping when the AI is authorized to consult it.
5. **Language Directive:** The generated rows MUST be written entirely in English to strictly comply with the Translation Tax Suppression (English-Pivoted CoT) heuristic.
6. The system replaces `[INSERT_TOPOLOGY_ROWS]` with the generated rows.
7. The system overwrites `docs/REPOMAP.md` entirely.
8. The system logs a success message: "REPOMAP synchronized."
