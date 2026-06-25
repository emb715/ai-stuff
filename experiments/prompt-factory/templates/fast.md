# fast — single-shot execution prompt

Shape: implement everything in one pass, validate at the end, no intermediate stops.

## What to include

**Opening line:** implement X end-to-end in one pass, then validate readiness.

**Source of truth block:** plan file + ADR. Paths from session context.

**Context resume:** one short paragraph or tight bullet list — current verdict, critical gaps only. Ruthlessly compressed. No history.

**Required implementation scope:** complete flat list of everything that must be done. No phases, no ordering ceremony — just what needs to exist when the agent is done. Group loosely by domain if it helps (schema / api / ui / tests).

**Execution constraints:** 2–4 lines max. Only the constraints that would change behavior — destructive action gate, no unrelated refactors, smallest test scope first.

**Validation and output requirements:** what to return at the end:
- changed files grouped by domain
- exact test commands run + results
- readiness rubric table (whatever the plan defines)
- final verdict
- remaining blockers with file/symbol if any

**Closing:** "Do all implementation + validation now." No ambiguity about whether to start.
