# humans.md — review-release-candidate

## What this is

A one-shot prompt that drives the full release-candidate verification lifecycle: inventory every user-facing surface, verify each against acceptance criteria with real evidence, triage by shared root cause, gate fix batches with regression tests, and re-verify until the candidate passes or is blocked. The agent maintains a living release scorecard across the run.

## Why it works

Three structural choices carry most of the value:

**Inventory-first.** The agent cannot verify what it has not enumerated. The prompt forces a complete surface inventory before any verification runs. This catches the most common release failure: forgetting to check a state, an edge case, or a workflow that wasn't in the obvious path.

**Evidence-captured, not asserted.** Each finding requires concrete evidence (steps, expected vs. actual, severity, logs, traces). "It works" without evidence is not verification. The evidence layer is what makes the scorecard auditable later — a reviewer can re-check any finding without re-running the whole release.

**Re-verification after each fix batch.** Fixing one defect can introduce or expose another. The prompt requires re-running the full verification inventory after each batch, not just the affected surface. Skipping this is the path to shipping regressions.

## Design decisions

- `{{CANDIDATE}}` and `{{ACCEPTANCE_CRITERIA}}` are the only required inputs. The ambiguity over whether they are file paths or in-session context is intentional — the agent should confirm visibility before starting, not assume it.
- "Ask before touching production, real customer data, paid infrastructure, or any destructive or irreversible action" is non-negotiable. The prompt defaults to read-only verification. If the agent starts making changes without asking, the contract is broken.
- The release scorecard is living, not regenerated. Each fix batch updates it incrementally. Regenerating from scratch destroys traceability.
- Triage by shared root cause, not by symptom. Multiple findings with one root cause fix together; treating them as independent wastes fix batches and misses blast radius.

## Origin

Unknown — no run evidence captured. The prompt exists in `prompt.md` but has no documented validation. Status is `draft` pending at least one real run with outcomes recorded in `README.md`.

If you know where this prompt came from or have used it, fill in the Evidence section of `README.md` and reassess status.

## Maintenance

- If the prompt produces a scorecard that regenerates per batch instead of updating: re-inject and require incremental updates. Traceability across batches is the point.
- If the agent skips re-verification after a fix batch: make it explicit in the session that the full inventory must re-run, not just the affected surface.
- If findings lack concrete evidence (steps, expected vs. actual): treat as unverified, not as pass. The evidence layer is non-optional.
- Promote to `validated` after one real run with documented outcomes. Promote to `vetted` after 2–3 runs across different release shapes (web, CLI, library) with consistent behavior.