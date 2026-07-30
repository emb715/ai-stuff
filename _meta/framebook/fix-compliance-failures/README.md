---
title: "Fix Compliance Failures"
status: draft
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - compliance
  - lint
  - gates
owner: "@emb715"
---

# Fix Compliance Failures

Procedural response when an artifact receives a BLOCKED status from gate checks or doc_lint.py.

## Context / Problem

AGENTS.md defines the required response format for compliance failures (BLOCKED / FAILED_GATES / EVIDENCE / FIXES_REQUIRED) but not the procedure for actually fixing them. After a BLOCKED result, it's unclear what to do first, what counts as resolved, and when to re-run checks. Without a procedure, people either ignore the failure or make ad-hoc fixes that don't address the root cause.

## Scope

Applies to any BLOCKED artifact from any gate check (Gate 1–6 from AGENTS.md) or from `doc_lint.py`. Covers both LLM-generated BLOCKED responses and manual lint output.

## Trigger

An artifact returns `COMPLIANCE: BLOCKED`, or `doc_lint.py` returns failures for any artifact.

## Outputs

- Each failing gate resolved or explicitly accepted with documented reason
- Re-run check passes (COMPLIANCE: PASS)
- No new failures introduced during fixes

## Verification

- `python scripts/doc_lint.py` passes for the artifact
- All FAILED_GATES from the original BLOCKED report are cleared
- If a gate was accepted-with-reason rather than fixed, the reason is documented

## Evidence / Results

Drafted 2026-06-24. Gate enforcement exists in AGENTS.md; procedural response did not exist. No run history yet — status `draft` until first real execution.

## Failure Modes / Boundaries

- Do not fix multiple gates simultaneously if they interact — fix one, re-run, then fix the next
- Some gates cannot be fixed without new evidence (Gate 3 — evidence threshold requires a real test run)
- If a gate failure is accepted rather than fixed, document the explicit reason — do not silently skip
- The linter does not cover all gates; a linter pass does not mean all 6 gates pass

## Related Links

- `AGENTS.md` — Gate definitions (Gate 1–6)
- `docs/standards/doc-lint-spec.md` — lint rule reference
- `docs/standards/vetting-rubric.md` — rubric for Gate 3 evidence threshold
- `_meta/framebook/promote-artifact/` — calls this playbook when gates fail during promotion
