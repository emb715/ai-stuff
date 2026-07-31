# e2e-web — maintenance context

## Origin

Built 2026-07-31 alongside `skills/test-authoring/` and `playbooks/acceptance-verification/`, from a floor survey that found four production lines and six dead ends in this vault.

The specific hook: `playbooks/build-to-release/` requires "an evidence anchor for every AC (test name, file:line, or **runtime check**). No anchor = not verified." It named runtime checks as a valid evidence type before anything in the repo could produce one. This tool is the producer.

It is also the vault's second `tool`, which matters independently — it tests whether the `change-impact` anatomy (core logic + CLI entrypoint + Action entrypoint + committed `dist` + marker-based PR upsert) generalises beyond the artifact it was extracted from. It did, essentially unchanged.

## The one rule everything else serves

**A criterion passes only when a test naming it passed.**

Every design decision below follows from that. The failure this tool exists to prevent is the one documented in the floor survey: `implementation-orchestration` gates on "All CI checks green," and on a repo with thin coverage that gate passes *because there is nothing to fail*. A green suite is a statement about the tests that exist, not about the criteria that were promised. Collapsing those two is how a release gate becomes decorative.

So the ledger is built from the **criteria document**, not from the test run. Tests are matched onto it. A criterion nobody wrote a test for produces a row that says so, in bold, with a count line underneath.

## Design decisions

**`unverified` is a first-class state.** Same call as `acceptance-verification`, for the same reason: a two-state model rounds "not checked" up to "fine". Four states here (`pass` / `fail` / `flaky` / `unverified`) because flakiness needed separating too — a test that passed only on retry is a question, not evidence, and folding it into `pass` would launder exactly the signal worth keeping.

**The tool never issues `VERIFIED` while anything is unresolved.** It cannot know criterion severity — the playbook's P0/P1 vocabulary lives in a human's head or in the criteria document's prose. Rather than guess, it downgrades to `VERIFIED_WITH_CONDITIONS` and hands the severity call up. Under-claiming is the only safe direction for a gate; a tool that over-claims once is never trusted again.

**Skipped means unverified, not passed.** Non-obvious and worth defending: Playwright reports skipped tests as not-failing, and a naive mapping treats absence of failure as success. `test.skip` under a conditional is a normal, healthy pattern — and it means that criterion was not checked on this run.

**An unrecognised Playwright status maps to `fail`.** If the reporter format changes and emits a status this parser does not know, the safe default is loud, not quiet. Same reasoning behind `parseReport` throwing on a malformed payload instead of returning an empty ledger: a silently empty ledger renders as "no criteria found," which a tired reader could mistake for "nothing wrong."

**Sticky comment, not PR body, by default.** Divergence from `change-impact`, which writes the body. A change-impact diagram is stable across a PR's life; a verification result changes on every push. Rewriting the author's description on each CI run is more intrusive than this needs to be. `--destination body` is there for consistency when someone wants it.

**`--fail-on fail` is the default, and it is deliberately the lenient setting.** The honest gate is `--fail-on unverified`, which blocks on uncovered criteria. Defaulting to it would make the tool unadoptable on any existing repo — every first run would be red. The default lets a team install it, see the holes, and tighten later. The README says plainly that the default is the lenient one, because a lenient default that pretends to be strict is the same failure the tool was built to prevent.

**Criteria discovered only in test titles still appear.** A test claiming `AC99` when the document has no `AC99` produces a row flagged "not present in the criteria document." That is drift between tests and criteria, and hiding it would be the mirror image of the tool's core sin.

## Origin of the `AC<n>` convention

Chosen because it is the cheapest possible coupling: no config file, no mapping table to keep in sync, no annotation library. The test title already exists and is already read by humans; putting the criterion id in it means the mapping cannot silently rot — a renamed criterion breaks the anchor visibly.

The cost is that it is unenforced. Nothing makes a team adopt it, and a repo that does not produces a fully-`unverified` ledger. That is a legible failure rather than a wrong answer, which was the trade taken.

`skills/test-authoring/` owns the other half of this convention — it is the artifact that puts the id in the title in the first place. If the convention ever changes, both change together.

## Maintenance notes

1. **Playwright JSON shape.** The parser depends on `suites[].specs[].tests[].status` and on `spec.file` / `spec.line`. Reporter output has been stable for a long time, but this is the most likely thing to break on a major upgrade. `test/report.test.ts` pins the shape with fixtures — if a real run produces outcomes that do not match, fix the fixture first, then the parser.
2. **Pinned versions live in `docs/references/playwright/README.md`**, resolved from the npm registry rather than from docs pages (the docs hosts were unreachable behind this environment's egress policy). Re-resolve on upgrade.
3. **The upsert paths remain unexercised.** First real PR run should confirm both the `gh` shell-out and the Octokit comment path, then record it in the README Evidence section — that is the single biggest gap between `draft` and something trustworthy.
4. **If `acceptance-verification`'s ledger format changes, this changes with it.** The rendered block is that playbook's Step 4 output; drift between them would leave the playbook asking for a shape the tool no longer emits.
5. **`dist/` is committed on purpose.** The Action runs on `node20` with no build step, matching `change-impact`. Rebuild with `npm run build:all` and commit the result whenever `src/` changes, or the Action silently runs stale code — the nastiest failure mode in this layout.

## Known gaps

- **Never run against a real application.** Only synthetic Playwright reports. The scoring logic is well tested; the integration is not.
- **PR upsert untested end to end.** `spliceBlock` is unit-tested in isolation.
- **No target freeze.** The tool records whatever `--build` it is handed. Verifying against a preview environment that redeploys on every push will produce anchors that outlive their build, and nothing here detects it. The discipline lives in the playbook; a future version could capture the deployment id itself and re-check it after the run.
- **Playwright only.** A Jest/Cypress adapter would mean generalising `parseReport` behind an interface — worth doing on the second requesting repo, not the first.
- **No flake history.** A test that is flaky *this* run is marked flaky; a test that is flaky one run in ten reads as a clean pass nine times. Real flake detection needs run history, which needs storage, which is a much larger tool.
- **No accessibility or visual results in the ledger.** The web adapter in `skills/test-authoring/` recommends axe assertions, and they surface here only as ordinary pass/fail tests. Giving a11y findings their own ledger section would be a reasonable next increment.
