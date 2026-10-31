---
title: "test-authoring"
status: draft
confidence: low
last_tested: 2026-07-31
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "vitest|jest"
  - "testing-library/react"
  - "testing-library/react-native"
  - "playwright"
  - "maestro"
tags:
  - skill
  - qa
  - testing
  - verification
owner: "@emb715"
---

# Purpose

Authors tests from a specification or acceptance criteria rather than from the implementation, assigns each behavior to the cheapest layer that can falsify it, and verifies each test actually fails when the behavior breaks. Produces test files plus a spec-gap list. Web and React Native adapters ship with the skill.

# When to use

- A validated plan or spec is about to be implemented and the change needs test coverage derived from stated behavior (run before implementation).
- A diff has landed with no tests and the originating spec or issue still exists.
- An orchestration playbook is about to gate on "CI green" in a repo where that gate would otherwise pass vacuously.

Not for: debugging a specific failing test, raising a coverage number with no behavior to anchor to, testing native (Swift/Kotlin) modules, or performance/load testing.

# Inputs

- `{{SPEC}}` — the spec, PRD section, acceptance criteria, or issue that states the intended behavior. Required. Without it the skill runs in a degraded mode that marks every test `provenance: diff`.
- `{{PLATFORM}}` — `web` or `react-native`. Selects the adapter under `references/`.
- `{{REPO}}` — the codebase, for selectors, module paths, fixture shapes, and existing runner detection.
- `{{TEST_COMMAND}}` — how to run the suite, for the Step 4 mutation check. Optional; discoverable from `package.json` scripts.

# Skill

Use [`SKILL.md`](SKILL.md) — behavior extraction, the four-layer model, authoring rules, coverage-theater rejects, the mutation check, and output contract.

Platform adapters, loaded only after layer assignment:
- [`references/web.md`](references/web.md) — RTL, MSW, Playwright, axe
- [`references/react-native.md`](references/react-native.md) — RNTL, MSW, Maestro

# Evidence

**No runs yet.** Authored 2026-07-31 to close a documented structural gap: `playbooks/implementation-orchestration/` gates on "All CI checks green" and dispatches a Tester role, but no artifact in this repo authored tests. A grep for test-authoring language across `playbooks/`, `skills/`, and `prompts/` returned zero matches before this skill existed.

`status: draft` and `confidence: low` are honest. The four-layer model and the mutation check are borrowed from established practice, but this skill has not been run end-to-end here. Promote only per `docs/standards/vetting-rubric.md`, after 2–3 documented real runs recorded in this section.

First run should record: whether the behavior table survived contact with a real spec, how many spec gaps surfaced, and whether the mutation check caught any test that could not fail.

# Failure Modes / Boundaries

- **Thin spec in, thin tests out.** The skill's output quality is bounded by the spec's specificity. A spec with three vague ACs yields three vague tests. The intended response is the spec-gap list, not invented behavior — but a model under pressure to produce tests may invent anyway. Watch for tests whose `anchor` column is empty.
- **Mutation check skipped silently.** Step 4 is the step most likely to be reported as done without being run, because reasoning about it is easy and executing it is slow. Treat any output without per-test break/result rows as incomplete.
- **Flow-layer inflation.** Both adapters push work down to cheaper layers, but "write an E2E test" is the most legible-looking output. If a run produces more `flow` tests than `component` tests, the layer assignment failed.
- **React Native flow tests may not be runnable** in a container or CI without simulator infrastructure. The adapter says to mark the mutation check skipped in that case; the resulting flows are unverified gates.
- **Does not know your fixture conventions.** Repos with bespoke factories or seeded databases need `{{REPO}}` inspection to go well; on an unfamiliar repo the setup code is the weakest part of the output.

# Related artifacts

- Consumes the output of [`playbooks/quick-spec/`](../../playbooks/quick-spec/), [`playbooks/issue-to-ready-specs/`](../../playbooks/issue-to-ready-specs/), and [`playbooks/raa/`](../../playbooks/raa/) — any of which supply `{{SPEC}}`.
- Runs as a station inside [`playbooks/implementation-orchestration/`](../../playbooks/implementation-orchestration/), before the build streams, and supplies the substance behind its "CI green" gate.
- Feeds [`playbooks/acceptance-verification/`](../../playbooks/acceptance-verification/), which consumes test names as evidence anchors.
- Spec gaps route back to whichever planning artifact produced `{{SPEC}}`.
