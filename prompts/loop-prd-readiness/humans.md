# humans.md — loop-prd-readiness

## What this is

A loop prompt that iteratively resolves gaps in a planning document until it is implementation-ready. The key mechanic: each round picks the single highest-risk unresolved item and makes the smallest doc change that reduces ambiguity. Stops on a dual-review gate, not on the agent's own opinion.

## Why it works

Two structural choices carry most of the value:

**Smallest change per round.** Prevents the agent from rewriting the entire doc in one pass, which destroys traceability and makes it impossible to know what changed and why. One item per round keeps the diff reviewable.

**Two independent reviews as the stop condition.** The agent that resolved the gaps is not the one that decides readiness. Two reviews with different instructions create genuine disagreement when something is still wrong. If they converge prematurely (identical phrasing), that's a signal to re-run with stronger separation instructions.

## Design decisions

- `{{DOC}}` is intentionally loose — file path or in-session context both work. The ambiguity is a feature: the agent should confirm doc visibility before starting, not assume it.
- "Ask before any product fork" is non-negotiable. The loop has no authority to make product decisions. If the user is unavailable, it blocks. That's correct behavior.
- Stop signal is separated from the prompt body deliberately — following the loop library convention. The stop condition should be checkable without re-reading the full prompt.

## Origin

Emerged from working through a planning document with multiple known conflicts. The iterative-smallest-change approach was intentional from the start; the dual-review gate was added after noticing that single-agent readiness assessments were overconfident.

Concept grounded in loop prompt engineering — see `docs/references/loop-engineering/`.

## Maintenance

If the prompt produces premature convergence in the two reviews: add an explicit instruction in the session to treat each review as adversarial to the other.

If the agent skips the cross-doc consistency check: make it explicit in the session that secondary docs must be listed before the first round starts.

Promote to `vetted` after 2–3 more real sessions with documented outcomes. Current evidence: one run.
