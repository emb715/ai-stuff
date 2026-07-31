# acceptance-verification — maintenance context

## Origin

Built 2026-07-31 from a floor survey of this vault, which found four production lines and six dead ends. This playbook closes the second half of dead end 02 and makes dead end 01 approachable.

The finding that produced it: `build-to-release` already demands "an evidence anchor for every AC (test name, file:line, or **runtime check**). No anchor = not verified." It specifies runtime checks as a valid evidence type, and nothing in the vault could produce one. The requirement had been written before the capability existed.

## The structural point this artifact makes

Before this playbook, all 24 artifacts in the vault took **text or a repo** as input — things that can be read. `raa` reads a codebase, `adversarial-code-review` reads a diff, `change-impact` reads a PR. Not one took an *executing program*.

That single missing input class explains three of the six dead ends at once: verification, deployment, and incident response all require something to be running. This playbook is the first artifact to cross that line, which is why it is worth more than its own scope — it establishes the pattern (freeze a target, observe it, anchor the observation) that the deploy and incident artifacts reuse.

## Why a playbook and not a prompt

`loop-implementation-readiness` is a prompt: a single loop with a rubric, no branching, no external state. This has an explicit trigger, ordered steps with decision points, defined outputs, and failure paths — all five playbook acceptance criteria in `docs/standards/artifact-classification.md`. It also dispatches roles and routes defects outward, which a prompt cannot coordinate.

## Design decisions

**Three states, not two.** `unverified` is deliberately a first-class state alongside `pass` and `fail`. Most bad release decisions come from a two-state model where anything not observed to fail counts as passing. Nearly every rule in the playbook exists to defend that third state — Step 3 assigns observability so gaps are visible early, Step 4 forbids flipping rows on suite-green, and the checklist asks for it explicitly.

**The target freeze (Step 1 and Step 7).** Two separate steps read the same build identifier because verification against a preview environment that redeploys on every push is the common real-world case, and stitched-together anchors are indistinguishable from real ones after the fact. Voiding anchors on redeploy is expensive and correct.

**Verdict vocabulary.** `VERIFIED` / `VERIFIED_WITH_CONDITIONS` / `NOT_VERIFIED` rather than reusing `READY` / `READY_WITH_CONDITIONS` / `NOT_READY` verbatim. Same shape, so downstream gates already written against the readiness triple can consume it, but the distinct tokens mark that this verdict was earned at runtime. If that distinction ever causes more friction than it buys, collapsing to the READY triple is a safe change — the mapping is stated in the playbook.

**Conditions require named owners.** "Verified with conditions" without an owner is how a P0 becomes a footnote. The rule that an unowned condition is a P0 is the enforcement.

**It does not fix anything.** Deliberate and worth defending. A verifier that repairs what it finds cannot report honestly on what it found — the incentive to make the ledger clean is too strong, and the re-run against a changed build is exactly the anchor-stitching the target freeze forbids. Defects route to the existing fix loops.

**Adversarial probing is a required step, not a suggestion.** `build-to-release` already asks that "every user-facing surface was adversarially tested or marked BLOCKED with a residual risk owner." Step 5 is the procedure that satisfies that line, and the adversarial log is a required output so its absence is visible.

## What was left out

- **Performance and load verification.** Different discipline, different tooling, different verdict shape. If needed, a sibling playbook rather than a section here.
- **Security verification.** Partially covered by the negative-criteria and permission-direction rules, but a real security pass is its own artifact. The harness `/security-review` covers diffs, not running systems — that is a genuine remaining gap.
- **A canned adversarial input catalogue.** Step 5 lists categories (empty, enormous, hostile, duplicated, out-of-order, offline) rather than specific payloads, because a fixed list gets run mechanically and stops finding things. If real runs show the probe being applied thinly, a catalogue under `references/` is the fix — accepting that cost.
- **Automatic ledger generation from the spec.** Tempting, but the extraction judgment in Step 2 (what is observable from outside) is the same judgment `skills/test-authoring/` makes in its behavior list. If both artifacts drift, unify them there rather than automating here.

## Maintenance notes

When this ages, check:

1. **Are `unverified` rows actually appearing in real output?** A run history where every ledger comes back fully anchored means the state is being rounded away, not that the builds are perfect. That is the health metric for this playbook.
2. **Does the adversarial log ever contain a finding the automated suite missed?** If not, after several runs, either Step 5 is being performed shallowly or `skills/test-authoring/` has gotten good enough that Step 5 can shrink. Those are opposite conclusions — check which by reading the logs, not the counts.
3. **Does the defect severity table still match the vocabulary in `implementation-orchestration` and `build-to-release`?** P0/P1/P2/P3 is shared across three artifacts now. If one drifts, routing breaks silently.
4. **Is the parity table being filled in?** It is the easiest section to leave empty and the source of the most expensive misses.

To extend it: add steps, not parallel tracks — same reasoning as `implementation-orchestration`. The sequence freeze → ledger → observe → probe → route → verdict is load-bearing; a parallel track that observes while the ledger is still being built reintroduces the moving-target problem.

## Known gaps

- No real runs. Structurally sound, unproven. The README says so.
- **No deploy artifact exists yet**, so the `{{BUILD}}` this playbook verifies has to be produced by hand or by a repo's existing CI. The line still has a hole immediately upstream of this station; this playbook narrows dead end 01 rather than closing it.
- React Native verification against a dev build cannot catch release-build-only behavior (Hermes, ProGuard). Named in the README boundaries, not solved.
- The `instrumented` observability class assumes the target emits usable logs, metrics, or traces. On a system with no instrumentation, those criteria silently become `manual` — and nothing here tells you the instrumentation is missing, which is itself a finding worth surfacing.
- Nothing consumes the spec-gap output automatically. Same open-circuit problem the vault already has with retrospectives.
