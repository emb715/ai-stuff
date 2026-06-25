# default — balanced plan execution prompt

Shape: one-pass execution with a structured readiness report at the end.

## What to include

**Opening line:** one action sentence — what to implement and where the plan lives.

**Read first block:** list the plan file and any ADR/doc that is the source of truth. Pull paths from session context.

**Context resume:** 2–5 lines max. Current readiness verdict, the critical blockers only — no history, no explanation. Extracted from session, not re-derived.

**Implementation order:** numbered list, highest-risk work first. Each item is one concrete deliverable, not a category.

**Constraints:** minimal — only the non-obvious ones specific to this work. Skip generic "write good code" noise.

**Done criteria:** what the fresh session must return when finished:
- changed files
- test commands run + results
- readiness verdict (use whatever rubric the plan defines)
- remaining blockers if any
