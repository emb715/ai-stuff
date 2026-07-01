---
title: "Loop Implementation Readiness"
status: draft
confidence: low
last_tested: 2026-06-29
scope: personal
tooling:
  - "opencode/claude-sonnet-4-6"
tags:
  - prompt
  - loop
  - validation
  - implementation-readiness
  - codebase-review
owner: "@ezequielbenitez"
---

# Purpose

Drives a codebase toward implementation readiness against a source-of-truth planning document (PRD, PLAN, ADR, or SPECS). Each round picks the highest-risk unresolved requirement, maps it to code evidence, classifies it, and defines the smallest action that closes the gap. Stops with a tri-state verdict when every requirement is evidence-backed, or blocks when P0/P1 unknowns remain without measurable progress.

This is the inverse of `loop-prd-readiness`: that loop edits the doc until it is build-ready; this loop tests the implementation until it satisfies the doc. Run them in sequence — `loop-prd-readiness` first to make the doc build-ready, then `loop-implementation-readiness` to verify the build matches it.

# When to use

You have a finished planning document and a codebase that is supposed to implement it. You want to know — with evidence — whether the code actually covers the doc's requirements, and where it does not, you want the smallest next-action to close each gap rather than a vague "needs work".

Not for: one-shot review without a finite requirement list, docs that are still being drafted (use `loop-prd-readiness` first), or codebases without a written source-of-truth doc (no doc = no rubric = nothing to validate against).

This is a static, copy-paste-ready version — `{{DOC}}`, `{{CODEBASE}}`, and `{{BUDGET}}` are the only variables. Run with explicit paths before starting; the loop must not infer the doc's location or hallucinate the codebase's structure.

# Inputs

- `{{DOC}}` — path to the source-of-truth planning document (PRD / PLAN / ADR / SPECS). May be a single file or an explicitly listed set. Must be readable by the agent before round 0.
- `{{CODEBASE}}` — path to the codebase root being validated against the doc. The agent must be able to enumerate files, symbols, and tests.
- `{{BUDGET}}` — explicit iteration cap expressed as rounds or wall-clock units (e.g. `10 rounds`, `30min`). Required — absent budget means unlimited authority, which is forbidden by the loop safety rules.

If any input is missing or vague, the loop must surface that as a blocker before round 0. Do not start blind.

# Prompt

See [`prompt.md`](prompt.md) — standalone copy-paste body.

# Stop signal

Four stop states, all checkable without re-reading the prompt body:

- **READY** — every requirement on the list is mapped to code evidence AND classified `covered` AND zero P0/P1 unknowns remain.
- **READY_WITH_CONDITIONS** — all P0 requirements are `covered`; remaining items are P1 unknowns with the exact user decision each one needs.
- **NOT_READY (blocked)** — measurable progress has stopped OR budget is exhausted AND P0/P1 unknowns remain. Output must list the exact missing decisions/inputs and which requirement each one blocks on.
- **NO-OP (start-of-round)** — if no requirement moved classification since the last round, do not loop again. Stop with current verdict rather than idle-cycling.

Escalation is separate from the stop states: any destructive, production, or sensitive action requires human approval before execution. The loop never proceeds past a block unilaterally.

# Evidence

Not yet validated — first real run pending.

Planned validation protocol:
1. Run against a codebase with a known partial-implementation state (some requirements covered, some missing, at least one conflict).
2. Confirm the agent: builds the requirement list from the doc without inferring extra requirements; picks the highest-risk item each round (P0 before P1); maps to real code anchors rather than asserting coverage; executes only safe actions and asks before destructive ones; stops with a clean tri-state verdict; reverses or amends a prior classification when new evidence contradicts it.
3. Record observed rounds-to-verdict, classification accuracy against a reviewer's manual check, and whether escalation fired correctly on any destructive action.

Until at least one run is documented, treat this prompt as unproven. Promote to `validated` after the first successful run; `vetted` after 2–3 documented runs across different doc/codebase pairs.

# Failure Modes / Boundaries

- **Inferred requirements.** If the doc is sparse, the agent may "helpfully" add requirements that are not in it. Round 0 must only enumerate what is traceable to a doc section; anything else is flagged as a doc gap, not as a codebase requirement. If this fails in practice, add an explicit "quote the source section per item" rule to the session.
- **Hallucinated evidence.** The agent may declare an item `covered` by pointing to a file/symbol that does not actually satisfy the requirement. Mitigation: every classification must include an evidence anchor (file path + symbol/line/test name). No anchor = `missing`, not `covered`.
- **Rubric drift across rounds.** The check must be the same rubric every round — same requirement list, same classification scheme. If the agent re-derives the rubric per round, comparisons become meaningless. The list is built once (round 0) and updated only by add/remove with explicit reasons, never silently restructured.
- **Action scope creep.** "Smallest action" is enforceable: one item, one action, one diff. If the agent bundles multiple requirements into a single change, traceability is lost and the next round's check is contaminated.
- **Unilateral destructive execution.** The ask-gate is non-negotiable. The loop has no authority to perform schema changes, data migrations, secret rotation, force-pushes, public endpoint changes, or dependency bumps without explicit user approval per action.
- **Multi-doc sets.** Cross-doc consistency degrades when `{{DOC}}` is a set rather than a single primary doc. Scope to one primary doc per run; reference secondaries explicitly and reject the run if cross-doc conflicts block classification.
- **Empty codebase / unreadable doc.** Both inputs must be confirmed before round 0. The loop must not start if it cannot enumerate either.

# Related prompts

- [`loop-prd-readiness`](../loop-prd-readiness/) — the upstream loop. Use first to make the doc build-ready; this loop validates the resulting implementation against it.
- [`knowledge-extraction`](../knowledge-extraction/) — one-shot extraction. Useful for converting an unstructured doc into the structured form `loop-implementation-readiness` requires as input.
- `skills/prompt-factory/` — if you want a session-customized version of this loop with the specific doc's requirements, status, and blockers inlined, use the factory's loop type instead of copy-pasting this static version.