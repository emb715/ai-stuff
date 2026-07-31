# humans.md — boundary tool maintenance context

## Origin

This tool came out of the `primitive-contract-docs` experiment in the parent directory (`../README.md`). The experiment asked: do generated code docs rot because they describe the wrong thing? Its answer: docs that describe *mechanism* (params, signatures, file paths) rot at code speed; docs that describe *obligation* (what a caller must respect, what a module guarantees) rot far slower. The tool is what operationalizes that answer — it scaffolds obligation-only contracts and enforces that they stay obligation-only.

The warm-start instance is snapberry's `docs/contributing-boundaries.md` — the boundary protocol that already enforced three of the four load-bearing rules on a real repo. The tool codifies the fourth rule (content-rule enforcement) and makes the whole pattern bootstrappable from zero on a cold project.

## Design decisions

### Why obligation-only (not mechanism)

Mechanism rots at code speed. A contract that says "retries 3x with exponential backoff" is wrong the moment the retry policy changes. A contract that says "owns the set of retryable failures; callers must not retry themselves" survives a provider swap, a retry-policy change, and a sync→async swap. The tool enforces the obligation form via `lint` (mechanism-leakage detection) and `check` (Communication section must contain obligation language, must not contain file-path patterns). The rule is the load-bearing piece; the tool is what keeps it load-bearing at scale.

### Why not a generator

A generator that produces the contract from the implementation just regenerates param-docs with extra steps — the contract mirrors the code and rots with it. The contract has to come from the person who decided the intent, captured at decision time. The tool's `generate` command drafts obligation content by *emitting a prompt* for a human/LLM to fill, not by reading the code and producing prose. The human is the trust anchor; the tool is the scaffolder and enforcer. `generate --apply` writes the drafts only after a human has reviewed them, and `check` runs after apply to verify the result still passes the contracts.

### Why dry-run is the default

The experiment is in validation. The tool must be able to run the full analysis and report the outcome without writing files, so a target repo can be validated *before* any files are created. `init --dry-run` reports the would-be surface and would-pass/fail; `generate --dry-run --apply` reports what would be filled without writing; `map --dry-run` reports the would-be contents. Writing is opt-in (`--write` for init/map, `--apply` without `--dry-run` for generate). This makes the tool a pre-validation step, not just a scaffolder — wrong boundaries are caught before files exist.

### Why runner-independent check

`check` does not delegate to a test runner (vitest/jest/buntest). Three reasons: detecting the runner from `package.json` is unreliable in monorepos; running the runner makes the tool depend on the project's installed deps; the project already knows how to run its tests. Instead `check` reads AGENTS.md files and package exports directly and asserts the four contracts in-process. The tool works on a project with no test runner configured at all. The generated `*-boundary.test.ts` files are optional output for projects that want their existing CI to catch drift without installing `boundary` as a CI dependency.

## Relationship to snapberry's `contributing-boundaries.md`

Snapberry (a private repo) is the warm-start instance — a real repo that already enforced three of the four load-bearing rules via hand-written boundary tests. `docs/contributing-boundaries.md` documents the boundary protocol: draw boundaries, write enforcement tests first, then AGENTS.md, ADRs at decision time. The protocol's enforcement-test pattern (assert surface containment, Communication section presence, ADR status) is what made the contract authoritative (Trust model A) on snapberry. The tool codifies that pattern so a cold project can bootstrap it without hand-writing the test harness.

The snapberry run that proved the content rule works is recorded in `../README.md` under "First run — `src/shared/` boundary rewrite (2026-07-30)". The tool's `lint` Phase 1 regex is the generalized version of the mechanism-leakage check from that run's boundary test.

## Relationship to `repo-primitive-audit`

`prompts/repo-primitive-audit/prompt.md` is the boundary-list prompt step. It maps a repo's modules from source and produces a candidate boundary list. The tool's `discover` command does the mechanical version of this for package-based repos (scans `package.json` files, proposes `boundaries.yaml`). The gap the experiment named: a map says "here are modules"; a boundary decision says "this is a capability unit with one reason to change." `discover` produces the map; the human/agent makes the boundary decision by editing the proposed `boundaries.yaml` before passing it to `init`. The tool does not automate the judgment — that was an explicit scope decision (Gap 1, kept as a prompt step, not automated, because automating it risks "generator produces wrong boundaries" which is worse than manual).

## What this file is not

This is maintenance context for humans working on the tool. It is never loaded as agent context when the tool runs. The consumable contract for the tool itself is `README.md` in this directory; the experiment context is `../README.md`.