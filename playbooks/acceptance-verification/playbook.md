Verify that a **running** build satisfies its acceptance criteria, and produce a runtime evidence anchor for every criterion. Input: a deployed or locally running build, plus the acceptance criteria it claims to satisfy. Output: a tri-state verdict with a per-criterion evidence ledger and a routed defect list.

This is the only playbook in the vault whose input is an executing program rather than text. Everything it produces is an observation of behavior, not a reading of source.

## Trigger

- A branch is CI-green and about to merge, and the acceptance criteria need verification against actual behavior rather than against the diff.
- `build-to-release` reaches its release-candidate gate and needs the runtime-check evidence its scorecard demands.
- A release candidate is deployed to a staging or preview environment and someone must decide whether it ships.

Not for: verifying a plan against a codebase (that is `loop-implementation-readiness` — it reads source, this runs software), reviewing a diff (`adversarial-code-review`), or exploratory testing with no stated criteria.

## Preconditions

- `{{BUILD}}` — a running target, identified unambiguously: a URL plus commit SHA, a build number, or an installed app build ID. **A target you cannot name precisely cannot be verified.**
- `{{CRITERIA}}` — the acceptance criteria, PRD "In MVP" list, or spec ACs the build claims to satisfy.
- `{{ENVIRONMENT}}` — which environment is running, and how it differs from production (data, auth, third-party services, feature flags).
- Ability to interact with the running target: a browser, a device or simulator, or an HTTP client.
- Optional but strongly preferred: an automated suite authored from the same criteria (see `skills/test-authoring/`), and a runner such as `tools/e2e-web/`.

## Principles

- **Runtime evidence or nothing.** A criterion is verified only by an observation of the running system. Source code, a passing type-check, and a convincing argument are all *not* evidence at this stage. No anchor means not verified — never "probably fine."
- **The target is frozen.** Record the build identifier before the first check and re-confirm it before the verdict. If the target was redeployed mid-run, every anchor collected before the redeploy is void. Verification against a moving target is theater.
- **Absence of a check is a finding, not a pass.** A criterion nothing exercised is `unverified`, which is a distinct state from `pass` and from `fail`. Most bad release decisions come from collapsing those three into two.
- **Adversarial on user-facing surfaces.** For every surface a user can reach, try the input the happy path did not anticipate: empty, enormous, hostile, duplicated, out-of-order, offline. A surface that was only exercised on its happy path is `unverified`.
- **Environment parity is part of the verdict.** A criterion verified in an environment that differs from production in a way that matters is verified *with a condition*, and the condition is named.
- **Defects route, they do not accumulate.** Every failure gets a severity and a destination the moment it is found.
- **Agent-agnostic.** Steps name roles (Verifier, Adversary, Reporter). Dispatch to whatever fleet exists, or run solo in sequence.

## Step 1 — Freeze and describe the target

Record, before touching anything:

- Build identifier: commit SHA, build number, or deployment ID
- URL or install target
- Environment name, and a parity table: what differs from production and whether the difference could change the outcome of any criterion

| Dimension | This environment | Production | Could change a verdict? |
|---|---|---|---|
| Data | seeded fixtures | real user data | yes — volume-dependent criteria |
| Auth | test accounts | SSO | yes — permission criteria |
| Third-party | sandbox keys | live | yes — payment criteria |
| Flags | all on | staged rollout | yes |

Any `yes` row becomes a candidate condition on the final verdict. Carry them forward; do not resolve them here.

## Step 2 — Build the criteria ledger

Extract a finite, numbered list. One row per criterion that could be false at runtime:

| Field | Content |
|---|---|
| `id` | `AC1`, `AC2`… |
| `criterion` | One sentence, observable from outside the system |
| `source` | Quoted line from `{{CRITERIA}}` with its location |
| `severity` | P0 (ship-blocking) / P1 / P2 / P3 |
| `observability` | `automated` / `instrumented` / `manual` — filled in Step 3 |
| `state` | `unverified` at the start. Never starts at `pass`. |

Rules:

- Every AC in the source produces at least one row. An AC that cannot be phrased as an outside-observable statement is itself a defect in the criteria — record it as `AC-n: unobservable` and route it back to the spec author.
- Do not invent criteria. Behavior you discover that no criterion covers goes to the **spec gap** list in the output, not into the ledger.
- Include the criteria the spec states negatively ("must not expose X", "must not allow Y"). These are the ones teams skip and attackers do not.

## Step 3 — Assign observability

For each row, decide how it will actually be observed:

- **`automated`** — an existing or newly authored test exercises it. Cheapest and re-runnable. Prefer this wherever possible.
- **`instrumented`** — observable only in logs, metrics, traces, or stored data. Name the exact query or log line in advance.
- **`manual`** — requires a human or an agent to drive the UI and look. Most expensive; reserve for what the other two cannot reach.

If a P0 criterion is `manual`, flag it now: a ship-blocking criterion with no automated coverage is a standing risk that recurs at every release. Note it for the spec-gap list even if this run verifies it by hand.

## Step 4 — Run the automated layer

Execute the suite against `{{BUILD}}`. For web, `tools/e2e-web/` runs Playwright against a URL and emits anchors in the required format; otherwise run the repo's own command.

For each `automated` row, record the anchor:

```
AC4  pass    e2e/checkout.spec.ts::completes checkout from a populated cart
             run 2026-07-31T10:14Z · build a1b2c3d · 1 passed
```

A green suite does **not** flip a row to `pass` unless a named test in that suite maps to that row. Suite-wide green with no per-criterion mapping is the exact false gate this playbook exists to prevent.

Any test that fails: capture the failure output verbatim, then go to Step 6.

## Step 5 — Probe what automation did not cover

Everything still `unverified` after Step 4 gets driven by hand. This is the step where real defects are found.

For each remaining row:

1. Perform the happy path. Record the anchor: what you did, what you observed, and where the observation is captured (screenshot path, response body, log line, screen recording).
2. Then attack the same surface. At minimum, for any input: empty, whitespace-only, maximum length, wrong type, duplicate submission, and rapid repeat. For any flow: interrupt it midway, navigate back, refresh, go offline and return.
3. For any criterion involving permissions: attempt it as the role that should be denied. A permission criterion verified only in the allowed direction is half-verified.

Record each probe even when it passes. The list of attacks that did *not* break it is part of the evidence.

## Step 6 — Classify and route defects

Every failure gets a severity and a destination in the same moment it is recorded:

| Severity | Definition | Destination |
|---|---|---|
| P0 | Ship-blocking: data loss, security, a P0 criterion unmet, a core flow broken | Blocks the verdict. Route to the fix loop immediately. |
| P1 | Significant: a P1 criterion unmet, a surface fails adversarial input | Blocks `VERIFIED`. Allowed under `VERIFIED_WITH_CONDITIONS` only with a named owner. |
| P2 | Degraded but usable | Documented with an owner; does not block. |
| P3 | Cosmetic or nice-to-have | Documented; does not block. |

For each defect record: the AC id it violates, exact reproduction steps against the frozen build, observed vs. expected, and the anchor. A defect without reproduction steps against the named build is a rumor.

**Do not fix defects in this playbook.** Verification that repairs what it finds cannot report honestly on what it found. Route P0/P1 to the fix loop (`build-to-release` Phase 10, or `implementation-orchestration`), then re-run this playbook against the new build — which is a *new frozen target*, so previously collected anchors for changed areas are void.

## Step 7 — Re-confirm the target and issue the verdict

Re-read the build identifier. If it changed during the run, declare `NOT_VERIFIED` with reason `target moved` and restart against the new build.

Otherwise total the ledger and issue one verdict.

## Stop conditions

- **VERIFIED** — every criterion has a runtime anchor and state `pass`; no P0 or P1 defects open; no `unverified` rows remain; no environment-parity row could change a verdict.
- **VERIFIED_WITH_CONDITIONS** — all P0 criteria pass with anchors. Remaining items are P1 or below, or environment-parity caveats. Each condition is stated with: what is unverified, why, the risk if it is wrong, and a named owner. A condition without an owner is not a condition, it is a P0.
- **NOT_VERIFIED** — any P0 criterion failed, any P0 criterion is `unverified`, the build could not be run, or the target moved mid-run. Surface per blocker: the AC id, what was observed, the reproduction, and the smallest action that would resolve it.

These map onto the vault's existing readiness triple (`READY` / `READY_WITH_CONDITIONS` / `NOT_READY`) so downstream gates can consume either vocabulary — the distinct names mark that this verdict was earned at runtime rather than by reading source.

## Never

- Mark a criterion `pass` from source inspection, a passing build, or a code review.
- Report a suite-wide green as per-criterion coverage.
- Collapse `unverified` into `pass`.
- Fix a defect mid-run and then report the criterion as passing.
- Carry anchors across a redeploy.
- Issue `VERIFIED_WITH_CONDITIONS` with an unowned condition.

## Output

1. **Target block** — build identifier, URL, environment, parity table.
2. **Criteria ledger** — every row with final state, observability, and anchor.
3. **Defect list** — severity, AC id, reproduction, observed vs. expected, destination.
4. **Adversarial log** — surfaces probed and the attacks applied, including those that held.
5. **Spec gaps** — behavior observed that no criterion covers, unobservable criteria, and any P0 criterion that is `manual`.
6. **Verdict** with its conditions and owners.

## Verification checklist

Before issuing any verdict:

- [ ] Build identifier recorded at start and re-confirmed at end, unchanged
- [ ] Every criterion in `{{CRITERIA}}` has a ledger row
- [ ] Every row has an anchor, or is explicitly `unverified` with a reason
- [ ] No row was flipped to `pass` on suite-wide green alone
- [ ] Every user-facing surface in scope was probed adversarially or is marked `unverified`
- [ ] Every negative criterion ("must not…") was tested in the denied direction
- [ ] Every defect has severity, reproduction, and a destination
- [ ] Every condition on the verdict has a named owner
- [ ] Environment-parity rows marked "could change a verdict" appear as conditions

## Rollback / Fallback

- **The build will not run** → `NOT_VERIFIED`, reason `build unusable`. This is a P0 against the release, not a verification problem to work around.
- **The environment differs from production in a way that voids a P0 criterion** → verify what can be verified, and issue `VERIFIED_WITH_CONDITIONS` naming that criterion as unverifiable here. Do not simulate the difference and call it verified.
- **The target was redeployed mid-run** → void affected anchors, re-freeze, re-run. Do not stitch results across builds.
- **Criteria are too vague to observe** → stop and route back to the spec author. Verification cannot invent the standard it verifies against.
- **A P0 criterion has no automated coverage and manual verification is impractical** → `NOT_VERIFIED` on that criterion, and record it as a standing gap for `skills/test-authoring/` to close before the next release, not this one.
- **Defects exceed what one pass can record** → stop at the first ten with full reproductions, issue `NOT_VERIFIED`, and say the list is partial. A truncated list presented as complete is worse than an obviously partial one.
