# e2e-web

Runs a Playwright suite against a named build and emits a criteria ledger in which **a criterion passes only when a test naming it passed**. Suite-wide green is never evidence for a criterion no test claimed.

Produces the runtime evidence anchors required by `playbooks/acceptance-verification/` and by the release scorecard in `playbooks/build-to-release/`.

## The convention

A test earns the right to be evidence for a criterion by naming it — an `AC<n>` token in the title, or an `@AC<n>` tag:

```ts
test('AC4: the Save button is disabled while the save is in flight', async ({ page }) => { /* … */ })
test('completes checkout from a populated cart', { tag: '@AC12' }, async ({ page }) => { /* … */ })
```

`AC4`, `AC-4`, `AC_4`, and `AC 4` all resolve to `AC4`. One test may name several criteria.

Criteria are declared in a document — any markdown where each criterion carries an `AC<n>` identifier:

```md
## Acceptance criteria
- **AC1** — a signed-in user can complete checkout
- **AC2** — an invalid card shows an inline error
- **AC3** — the cart survives a page reload
```

Every declared criterion becomes a ledger row. A row with no passing test is `unverified` — which is a distinct state from `pass` and from `fail`, and the reason this tool exists.

## Install

```bash
cd tools/e2e-web
npm install
npm run build:all
```

In a Claude Code web session, Chromium is pre-installed (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`). **Do not run `playwright install`.**

## CLI

```bash
# run the suite against a preview deployment and print the ledger
node dist/cli/index.js \
  --url https://preview.example.com \
  --criteria docs/specs/checkout.md \
  --build "$(git rev-parse --short HEAD)" \
  --env preview

# score a report you already have
node dist/cli/index.js --report playwright-report.json --criteria docs/specs/checkout.md

# post the ledger onto a PR as a sticky comment
node dist/cli/index.js --report report.json --criteria acs.md --pr 42 --repo org/name
```

| Option | Meaning |
|---|---|
| `--url <url>` | Base URL; sets `PLAYWRIGHT_TEST_BASE_URL` |
| `--build <id>` | Build identifier for the ledger. Defaults to the short git SHA. |
| `--env <name>` | Environment name recorded on the ledger |
| `--criteria <path>` | Criteria document; every `AC<n>` becomes a row |
| `--report <path>` | Score an existing Playwright JSON report instead of running |
| `--pr <n>` / `--repo <org/name>` | Upsert onto a PR via the `gh` CLI |
| `--destination body\|comment` | Sticky comment (default) or PR description |
| `--out <path>` | Write the markdown block to a file |
| `--json` | Emit the ledger as JSON |
| `--fail-on fail\|unverified\|never` | Exit policy. Default `fail`. |

Exit codes: `0` acceptable, `1` verdict unacceptable under `--fail-on`, `2` no ledger could be produced.

Use `--fail-on unverified` to make uncovered criteria block the build. That is the strict setting, and the one worth adopting once coverage exists.

## GitHub Action

```yaml
- uses: ./tools/e2e-web
  with:
    url: ${{ steps.deploy.outputs.preview-url }}
    criteria: docs/specs/checkout.md
    environment: preview
    fail-on: fail
```

Inputs: `url`, `build`, `environment`, `criteria`, `report`, `fail-on`, `github-token`.
Outputs: `verdict`, `block`, `unverified`.

The Action posts a sticky comment (one per PR, updated in place), writes the ledger to the job summary, and sets the check status per `fail-on`.

## Output

```md
## Acceptance verification

**Verdict: NOT_VERIFIED**

build `a1b2c3d` · against https://preview.example · env `preview` · 2 passed, 1 failed, 0 flaky, 0 skipped

| Criterion | State | Evidence anchor |
|---|---|---|
| AC1 | pass | `e2e/checkout.spec.ts:14` — AC1: a signed-in user can complete checkout (chromium) |
| AC2 | **fail** | `e2e/checkout.spec.ts:31` — AC2: an invalid card shows an inline error (chromium) |
| AC3 | **unverified** | _no test claims this criterion_ |

**1 criterion unverified.** Absence of a check is not a pass.
```

## Verdicts

| Verdict | Condition |
|---|---|
| `VERIFIED` | Every declared criterion has a passing anchor. No failures, no flakes, nothing unverified. |
| `VERIFIED_WITH_CONDITIONS` | No failures, but something is unverified or flaky. Needs a human severity call. |
| `NOT_VERIFIED` | A criterion failed, or the ledger is empty. |

The tool does not know criterion severity, so it never issues `VERIFIED` while anything is unresolved — it downgrades and leaves the call to whoever runs the playbook. Under-claiming is the only safe direction for a release gate.

Three further rules, each pinned by a test:

- A **skipped** test is absence of evidence, not a pass.
- A **flaky** test is a question, not evidence — it passed only on retry.
- A test naming a criterion the document never declared is surfaced, not hidden.

## Limits

- Reads Playwright JSON reports only.
- Cannot verify what no test covers — it reports the hole rather than filling it. Authoring the missing tests is `skills/test-authoring/`.
- `--pr` requires the `gh` CLI and an authenticated session; the Action path uses the API token instead.
- Does not freeze the target for you. If the environment redeploys mid-run, the build identifier on the ledger is a claim about a build that no longer exists.
