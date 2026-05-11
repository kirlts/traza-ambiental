---
trigger: ai_contextual
description: Activates when the human requests an audit, or when Antigravity detects critical mass of unaudited nodes. Traverses Khaos to find gaps, filters deferrals, resolves against Kratos.
---

# Auditar Vacíos

This workflow traverses the Khaos tree to detect structural gaps, filters them against deferred decisions, and attempts resolution using Kratos.

> **Activation:** AI-triggered. Antigravity activates this workflow when:
> - The human explicitly requests an audit ("audita", "qué falta", "revisa los vacíos").
> - Antigravity detects that multiple nodes have been created or modified without a subsequent audit.
> **Clarification principle:** If the human's request could be interpreted as something other than an audit, Antigravity confirms before proceeding.

---

## Phase 1: Traversal

**Objective:** Build a complete inventory of gaps across all Khaos nodes.

1. Traverse every node in `knowledge-base/khaos/`.
2. For each node, inspect:
   - `## Qué es` — empty?
   - `## Por qué existe` — empty or broken wikilink?
   - `## Compromisos` — empty rows? Rows with empty Actor, Acción, or Sustento cells?
   - `se_descompone_en` — listed children that don't exist as files?
   - `depende_de` — parent that doesn't exist as file?
3. Record every gap with its node, field, and nature (empty / broken link / missing file).

**Output:** Gap inventory table.

## Phase 2: Deferral Filter

**Objective:** Remove gaps that the human has explicitly deferred.

1. Read `docs/USER-DECISIONS.md`.
2. For each gap in the inventory, check:
   - Is this gap covered by a vigent deferral (⏸️)?
   - Has the deferral's reopening condition been met?
3. Classification:
   - Deferral vigent, condition NOT met → Mark as `aplazado`. Do NOT escalate to human.
   - Deferral vigent, condition MET → Mark as `reabierto`. Escalate with context from the original deferral.
   - No deferral found → Proceed to Phase 3.

**Output:** Filtered gap inventory (gaps without vigent deferrals).

## Phase 3: Kratos Resolution

**Objective:** Attempt to fill remaining gaps using factual information from Kratos.

For each non-deferred gap:
1. Search `knowledge-base/kratos/` for information relevant to the gap.
2. Apply the resolution protocol (MASTER-SPEC §7.5.3):

| Result | Action |
|---|---|
| Precise and sufficient information found | Fill the gap with a traceable Kratos reference |
| Partial information found | Fill what's available, flag what's still missing |
| Contradiction with the Khaos node | Deep audit: automated amendment if data is sufficient (may affect parent/children), or escalation to human |
| No information found | Record for human escalation |

3. For gaps filled or partially filled, update the Khaos node directly.
4. For contradictions requiring human input, document the conflict clearly.

**Output:** Resolution report per gap.

## Phase 4: Collective Exhaustiveness Check

**Objective:** Verify that the Khaos tree structure is complete at every level.

For each node that has children (`se_descompone_en` is non-empty):
1. Read the parent's `## Qué es` (its responsibility).
2. Read each child's `## Qué es`.
3. Evaluate: does the sum of children's responsibilities fully cover the parent's responsibility?
4. If NO → flag as CE gap. This means there are missing nodes (responsibilities that exist but haven't been instantiated).
5. If uncertain → flag for human review rather than assuming coverage.

**Output:** CE gap report.

## Phase 5: Consolidated Report

**Objective:** Present a single, actionable summary to the human.

Generate a consolidated table:

| Node | Field | Gap Type | Resolution | Status |
|---|---|---|---|---|
| `[[Node name]]` | compromisos.sustento | Empty cell | Found: `[[Kratos reference]]` | ✅ Resolved |
| `[[Node name]]` | que_es | Empty | No Kratos match | ❓ Needs human input |
| `[[Node name]]` | — | CE gap | Missing sibling responsibility | 🔍 Needs decomposition |
| `[[Node name]]` | compromisos.accion | Empty | Deferred (UD-003) | ⏸️ Aplazado |

**Output:** Report presented to human.

## Phase 6: Gate

Verify before completing:

| Check | Criterion |
|---|---|
| Deferrals respected | Were all vigent deferrals honored (not re-raised)? |
| Reopenings flagged | Were deferrals with met conditions properly escalated? |
| USER-DECISIONS proposals | Should any decision/deferral that emerged during this audit be proposed for registration? |
| No speculation | Did any resolution introduce speculative content? If yes → revert. |
| Kratos integrity | Were all Kratos references verified as existing nodes? |

If any check fails, correct before completing.

## Extended Operations (Working Document Pattern)

For audits spanning a large Khaos tree, Antigravity generates a working document (`audit_working.md`) that tracks:

| Column | Purpose |
|---|---|
| Node | Which node is being audited |
| Gaps found | Count and type |
| Resolution status | Pending / Resolved / Needs human / Deferred |
| Kratos nodes consulted | Which Kratos nodes were searched |
| Mutations triggered | Nodes modified as a result of contradiction resolution |

The working document lives in the session's artifact directory.
