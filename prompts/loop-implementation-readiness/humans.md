# humans.md — loop-implementation-readiness

## What this is

A loop prompt that validates an implementation against a source-of-truth planning document and drives the gap to zero (or surfaces exactly what blocks it). Each round picks the single highest-risk unresolved requirement, maps it to real code evidence, classifies it, and defines the smallest action that closes the gap. Stops with a tri-state verdict when every requirement is evidence-backed, or blocks with exact missing decisions/inputs when P0/P1 unknowns remain.

It is the inverse of `loop-prd-readiness`: that loop edits the doc until it is build-ready; this loop edits the implementation (or surfaces a doc amendment) until the code matches the doc.

## Why it works

Four structural choices carry most of the value.

**Build the requirement list once, in round 0, from the doc only.** This is the rubric. Every subsequent round re-runs the same check against the same list. If the agent re-derives the list per round, the check is meaningless — you cannot compare round N to round N-1 against a moving target. Round 0 is the only round that creates structure; the rest only act and re-check.

**Highest-risk-first, with explicit ordering.** P0 before P1, conflict before missing before partial. This prevents the agent from racking up cheap `partial → covered` wins on low-risk items while a P0 conflict sits unresolved and contaminates everything downstream.

**Smallest action per round, one item, one diff.** Same rationale as `loop-prd-readiness`'s smallest-change rule: bundling destroys traceability. One item, one action, one round delta recorded. The agent cannot retry classify later rounds without knowing exactly what each prior round changed.

**Evidence anchor required for every classification.** `covered` is not a feeling — it is a file path plus a symbol/line/test name that a reviewer can independently open. The loop is explicitly forbidden from asserting coverage without an anchor. Without this rule, the most common failure mode is the agent declaring everything covered and returning READY without doing the work.

## Design decisions

- **Two inputs plus budget, all three required.** `{{DOC}}`, `{{CODEBASE}}`, `{{BUDGET}}`. Budget is treated as a first-class input rather than an optional cap, because per the loop-engineering safety rules a loop without a hard limit has unlimited authority — which is forbidden. Refusing to start without it is the correct behavior, not a usability issue.
- **Doc gaps are flagged, not adopted.** If a requirement "should" exist in the doc but does not, the loop flags it as a doc gap rather than inferring one. This is the inverse of `loop-prd-readiness`'s "don't fork the product unilaterally" rule — here the agent does not fork the spec. Inferred requirements would silently expand scope past what the doc author intended.
- **The ask-gate covers more than `loop-prd-readiness`'s "product fork" gate.** Implementation work touches real systems, so the escalation list is concrete: schema changes, data migrations, public endpoints, secret rotation, force-push, dependency bumps. This is not exhaustive — "anything that touches production data or external callers" is the actual rule; the list are examples. If the agent hesitates on whether an action is sensitive, it should ask — over-asking is cheap, under-asking is a production incident.
- **Tri-state verdict instead of binary.** READY_WITH_CONDITIONS exists because a codebase with all P0 covered and a few enumerated P1 unknowns is shippable with documented caveats — collapsing that into NOT_READY loses useful information, and collapsing it into READY hides the unknowns. Each P1 blocker must be paired with its required decision, not just listed.
- **No-op is a real stop state, not a courtesy.** Per the Forward Future loop library conventions — a loop that produces no classification change in a round is idling, and idling is not progress. Stopping with the current verdict is more honest than looping again hoping something moves.
- **Self-contained runtime.** No required dependency on `experiments/` or any other folder. The three files are the artifact. Cross-links to `loop-prd-readiness` are contextual, not runtime dependencies.

## Origin

Built as a direct complement to `loop-prd-readiness` after a session where the doc was build-ready but there was no equivalent loop to validate that the resulting code matched it. The user wrote the core prompt in one pass (the source text this artifact refines); the structure was modeled on `loop-prd-readiness` and the loop engineering conventions in `docs/references/loop-engineering/`.

Concept grounded in loop prompt engineering — see `docs/references/loop-engineering/`.

## Maintenance

- **Premature READY verdicts.** If the agent returns READY without anchors on every item, the prompt failed on the evidence-anchor rule. Tighten the session: require the agent to dump the evidence-anchor table before pronouncing the verdict. If it still asserts coverage without one, the loop's value is exhausted — switch to manual review.
- **Rubric drift.** If round 5's requirement list looks materially different from round 0's without explicit add/remove reasons logged, the round-0 rule was not enforced. Mitigation: require the agent to print the round-0 list verbatim at the top of every round and reconcile any delta out loud before acting.
- **Silent regression.** If an item classified `covered` in round 3 reappears as `partial` in round 5 without a logged change, the rubric re-check is decorative. Add a session rule: regressing classifications require an explicit reason and re-flag the item at its new risk tier.
- **Ask-gate never fires.** If the agent performs destructive actions without asking across a multi-round run, the prompt's safety language is too soft. Promote "should ask" to "must stop and ask" in the session override, or scope `{{CODEBASE}}` to a sandbox so real production is unreachable.
- **Multi-doc sets.** If `{{DOC}}` is a set, scope to one primary per run. Cross-doc conflicts are a `loop-prd-readiness` problem (fix the docs), not this loop's problem — this loop validates against one source of truth.

## Known gaps

- Not yet validated by a real run. The evidence section in `README.md` documents the planned validation protocol; until it runs, treat the prompt as a draft and the verdicts it produces as unreviewed.
- Does not specify how to handle a codebase with a large autogenerated surface (e.g. heavy codegen, compiled output) where "covered by evidence" may be trivially true at the generator level but vacuous at the logic level. If hit in practice, add an exclusion rule in the session start (e.g. "skip files matching `**/generated/**`") and document it here.
- No explicit handling of nondeterministic tests or flaky coverage as evidence. If classification depends on tests that pass intermittently, the verdict is unreliable. Mitigation left to the session for now; document any failures here.