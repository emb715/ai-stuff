---
title: "e2e-web"
status: draft
confidence: medium
last_tested: 2026-07-31
scope: personal
tooling:
  - "node20"
  - "playwright"
  - "gh-cli"
  - "github-actions"
tags:
  - tool
  - qa
  - verification
  - playwright
  - release-gate
owner: "@emb715"
---

# Purpose

Runs a Playwright suite against a named build and emits a criteria ledger in which a criterion passes **only** when a test naming it passed. Produces the runtime evidence anchors that `playbooks/acceptance-verification/` requires and that `playbooks/build-to-release/` already demanded before anything here could generate them. Upserts the ledger onto a PR as a sticky comment, or runs locally.

# When to use

- A PR touches user-facing web behavior and its acceptance criteria need a runtime check, not just a green suite.
- `playbooks/acceptance-verification/` reaches Step 4 and needs the automated layer executed with per-criterion anchors.
- A preview deployment exists and someone must decide whether the criteria it claims to satisfy are actually satisfied.

Not for: React Native (see the Maestro path in `skills/test-authoring/references/react-native.md`), authoring the tests themselves (`skills/test-authoring/`), or non-Playwright runners.

# Inputs

- `{{URL}}` — base URL to run against. Sets `PLAYWRIGHT_TEST_BASE_URL`.
- `{{BUILD}}` — build identifier recorded on the ledger. Defaults to the short git SHA; the Action defaults to the PR head SHA.
- `{{CRITERIA}}` — path to a criteria document. Every `AC<n>` in it becomes a ledger row.
- `{{REPORT}}` — optional path to an existing Playwright JSON report, to score without running.
- `{{ENVIRONMENT}}` — environment name recorded on the ledger.
- For PR upsert: `gh` CLI authenticated (CLI path) or `github-token` (Action path).

# Tool

Use [`tool.md`](tool.md) — the `AC<n>` naming convention, CLI options, Action inputs, output format, verdict rules, and limits.

Source layout mirrors `tools/change-impact/`: `src/core/` for logic, `src/cli/` and `src/action/` for the two entrypoints, `dist/` committed so the Action runs on `node20` without a build step.

# Evidence

## Build and test run — 2026-07-31

Authored and verified in-session:

- `tsc --noEmit` clean.
- `vitest run` — **37 tests across 3 files, all passing.** Tests pin the rules that matter: suite-green never passes an unclaimed criterion, a skipped test is `unverified` rather than `pass`, a flaky test is `flaky` rather than `pass`, any failure dominates a multi-test criterion, an unrecognised Playwright status maps to `fail` rather than `pass`, and a malformed report throws instead of yielding an empty ledger.
- One real defect was caught by its own test during authoring: the unverified-count line pluralised to "2 criteriona". Fixed, test now green.
- `npm run build:all` — both `dist/cli/index.js` (23kB) and `dist/action/index.js` (1.1MB, ncc-bundled) built.
- **CLI smoke test against a synthetic report:** 3 declared criteria, 3 tests (one passing and named, one failing and named, one passing and unnamed). Output was correct on every axis — `AC1 pass` with a `file:line` anchor, `AC2 fail`, `AC3 unverified` with "no test claims this criterion", the unnamed test collected under "claimed no criterion", verdict `NOT_VERIFIED`, exit code 1.
- **Exit-code matrix verified:** `--fail-on unverified` exits 1 when a declared criterion is uncovered and 0 when all are covered; `--fail-on never` exits 0 on a failing run.

Not yet exercised: a real Playwright run against a real application (only synthetic reports), and the PR upsert path (`gh` CLI and Octokit) — neither could be run in this session. `status: draft` reflects those two gaps; `confidence: medium` rather than `low` reflects that the scoring logic itself is tested and demonstrated.

Promote per `docs/standards/vetting-rubric.md` after 2–3 real runs against a live suite, recorded here.

# Failure Modes / Boundaries

- **The `AC<n>` convention is load-bearing and unenforced.** A team that does not adopt it gets a ledger where everything is `unverified` and every test is unmapped. The output says so plainly, but the tool cannot infer intent from a test title.
- **Untested against a real Playwright run.** The report parser was built to Playwright's documented JSON shape and exercised with synthetic fixtures; field-level surprises from a real run are the most likely first failure.
- **PR upsert paths are unexercised.** The `spliceBlock` logic is unit-tested, but neither the `gh` CLI shell-out nor the Octokit comment path has run against a real PR.
- **Does not freeze the target.** It records the build identifier you pass. If the environment redeploys mid-run, the ledger asserts an anchor against a build that no longer exists — the target-freeze discipline lives in the playbook, not here.
- **Playwright JSON only.** No Jest, Cypress, or Vitest browser-mode support.
- **Sticky-comment detection is marker-based.** A user who edits the marker out gets a duplicate comment on the next run.
- **`--fail-on fail` is the default and it is the lenient setting.** It lets uncovered criteria through. `--fail-on unverified` is the honest gate; the default is lenient only so the tool can be adopted before coverage exists.

# Related artifacts

- Executes the automated layer of [`playbooks/acceptance-verification/`](../../playbooks/acceptance-verification/) (Step 4) and emits its ledger format.
- Consumes tests authored by [`skills/test-authoring/`](../../skills/test-authoring/), which owns the `AC<n>` naming convention on the test side.
- Supplies the runtime-check evidence required by [`playbooks/build-to-release/`](../../playbooks/build-to-release/) and [`prompts/review-release-candidate/`](../../prompts/review-release-candidate/).
- Source URLs and pinned versions in [`docs/references/playwright/`](../../docs/references/playwright/).
- Anatomy mirrors [`tools/change-impact/`](../change-impact/) — same `src/core` + two-entrypoint + committed-`dist` shape, same marker-based upsert approach.
