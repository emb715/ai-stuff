---
title: "acceptance-verification"
status: draft
confidence: low
last_tested: 2026-07-31
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "playwright"
  - "maestro"
tags:
  - playbook
  - qa
  - verification
  - release-gate
owner: "@emb715"
---

# Purpose

Verifies that a running build satisfies its acceptance criteria, producing a runtime evidence anchor for every criterion and a tri-state verdict. The only playbook here whose input is an executing program rather than text — it observes behavior instead of reading source.

# When to use

- A branch is CI-green and about to merge, and the acceptance criteria need checking against real behavior.
- `build-to-release` reaches its release-candidate gate and needs the runtime-check evidence its scorecard already demands.
- A release candidate is deployed to staging or a preview environment and someone has to decide whether it ships.

Not for: validating a plan against a codebase (use [`loop-implementation-readiness`](../../prompts/loop-implementation-readiness/) — it reads source), reviewing a diff (use [`adversarial-code-review`](../adversarial-code-review/)), or exploratory testing with no stated criteria.

# Inputs

- `{{BUILD}}` — the running target, named unambiguously: URL + commit SHA, build number, or installed app build ID.
- `{{CRITERIA}}` — acceptance criteria, PRD "In MVP" list, or spec ACs the build claims to satisfy.
- `{{ENVIRONMENT}}` — which environment is running and how it differs from production (data, auth, third-party services, flags).
- Interaction access: browser, device/simulator, or HTTP client.
- Optional: an automated suite authored from the same criteria via [`skills/test-authoring/`](../../skills/test-authoring/), and [`tools/e2e-web/`](../../tools/e2e-web/) as the runner.

# Playbook

Use [`playbook.md`](playbook.md) — target freeze, criteria ledger, observability assignment, automated run, adversarial probe, defect routing, verdict.

# Stop signal

Tri-state, mapping onto the vault's existing readiness triple:

- `VERIFIED` — every criterion anchored and passing, no P0/P1 open, no `unverified` rows, no parity caveat that could change a verdict.
- `VERIFIED_WITH_CONDITIONS` — all P0 criteria anchored and passing; remaining items P1 or below, each condition stated with risk and a named owner.
- `NOT_VERIFIED` — a P0 failed or is unverified, the build could not run, or the target moved mid-run.

# Evidence

**No runs yet.** Authored 2026-07-31 against a documented gap: `playbooks/build-to-release/` requires "an evidence anchor for every AC (test name, file:line, or **runtime check**)" and nothing in the vault could produce a runtime check. A grep across `playbooks/`, `skills/`, and `prompts/` for deploy/staging/rollout stage definitions returned none — this playbook and `tools/e2e-web/` are the first artifacts here that take a running system as input.

`status: draft`, `confidence: low`. Promote per `docs/standards/vetting-rubric.md` after 2–3 documented runs recorded here. A first run should record: how many criteria turned out to be unobservable as written, how many rows ended `unverified` after the automated layer, and whether the adversarial probe (Step 5) found anything the suite missed — that last number is the playbook's whole justification.

# Failure Modes / Boundaries

- **`unverified` collapsing into `pass`.** The single most likely failure. A model totalling a ledger under pressure to produce a clean verdict will round up. The Verification checklist exists to catch it; treat any output whose ledger has no `unverified` rows *and* no per-row anchors as untrustworthy.
- **Suite-green mistaken for coverage.** Step 4 forbids flipping a row on suite-wide green, but "all tests passed" is a seductive anchor. Check that each `pass` row names a specific test.
- **Adversarial probe skipped under time pressure.** Step 5 is the expensive step and the one that finds real defects. A run that reports `VERIFIED` with an empty adversarial log did not run this playbook.
- **Environment parity hand-waved.** Verifying payments against sandbox keys and reporting `VERIFIED` is the classic version. Parity rows marked "could change a verdict" must appear as conditions.
- **Anchors stitched across builds.** If the target is redeployed mid-run, earlier anchors are void. Long runs against an actively deploying preview environment are where this breaks.
- **Cannot verify release-build-only behavior** when run against a dev build — relevant for React Native (Hermes, ProGuard) and for any bundler-optimized web build.
- **Does not fix anything.** By design. Defects route out; the fix loop lives elsewhere.

# Related artifacts

- Consumes tests authored by [`skills/test-authoring/`](../../skills/test-authoring/) and runs them via [`tools/e2e-web/`](../../tools/e2e-web/).
- Supplies the runtime-check evidence required by [`playbooks/build-to-release/`](../build-to-release/) at its release-candidate gate, and by [`prompts/review-release-candidate/`](../../prompts/review-release-candidate/).
- Sits after [`adversarial-code-review`](../adversarial-code-review/) and before merge/ship in [`playbooks/issue-to-pr/`](../issue-to-pr/).
- Routes P0/P1 defects to the fix loop in [`playbooks/implementation-orchestration/`](../implementation-orchestration/).
- Its spec-gap and defect output is the natural input to [`playbooks/retrospective/`](../retrospective/) and [`prompts/knowledge-extraction/`](../../prompts/knowledge-extraction/).
- When a verified build later fails in production, hand off to [`playbooks/incident-response/`](../incident-response/).
