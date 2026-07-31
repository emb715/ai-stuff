# test-authoring — maintenance context

## Origin

Built 2026-07-31 out of a floor survey of this vault. The survey asked how much of an agentic software factory the repo could actually run, and found four production lines with six dead ends. This skill closes dead end 02.

The specific finding: `playbooks/implementation-orchestration/` refuses to declare DONE until "All CI checks green" and dispatches a Tester role in its fleet mapping — but nothing in the vault authored a test. On a repo with a thin suite that gate passes *because there is nothing to fail*. The strictest gate on the floor was the easiest one to walk through. A grep for test-authoring language across `playbooks/`, `skills/`, and `prompts/` returned zero matches; the only hits were `humans.md` boilerplate reading "not yet tested in this repo," which is a different kind of finding entirely.

## Why a skill and not a playbook

Ran the routing table in `docs/standards/artifact-classification.md`. Test authorship is a reusable capability applied inside other procedures, not a procedure with its own triggers and failure paths — the playbook acceptance criteria ask for an explicit trigger and ordered decision points, and this has neither independent of the orchestration that calls it. Primary value is behavior packaging, so: `skills/`.

The counterpart that *is* a playbook is `playbooks/acceptance-verification/` — that one has its own trigger, gates, and tri-state verdict.

## Why the ordering rule is the top section

The single highest-leverage decision in the skill is: derive tests from the spec before reading the implementation. A model asked to "write tests for this diff" will read the diff and describe it back as assertions. Those tests pass forever and catch nothing, because they encode the implementation's understanding of the requirement rather than the requirement.

This is also why `test-authoring` is positioned *before* the build streams in `implementation-orchestration` rather than after. Placing it after would technically work, but it puts the spec and the implementation in front of the author simultaneously, and the implementation always wins that contest.

## Why four layers, and why the assignment step is separate

The layer model exists to fight a specific failure: every behavior getting an end-to-end test because end-to-end tests are the most legible-looking output. Separating "assign a layer" (Step 2) from "write the test" (Step 3) forces the cost decision to happen before any code is generated, when it is still cheap to change.

The four names — `unit` / `component` / `flow` / `contract` — were chosen to be platform-neutral so the adapters carry only syntax. `contract` is deliberately not folded into `unit`: boundary-shape bugs are a distinct and common production failure, and naming the layer makes the skill ask "what crosses a boundary here?" as its own question.

## Why the mutation check (Step 4) is non-negotiable

A generated test suite that has never been observed failing is indistinguishable from a suite that cannot fail. This is the step that makes the difference between this skill and prompting a model for test code, and it is also the step most likely to be quietly skipped — reasoning about it is cheap, running it is slow.

The README's Failure Modes section says to treat any output without per-test break/result rows as incomplete. That is the audit hook. If real runs show the step being skipped regularly, the fix is to make Step 4 emit a required table that is structurally obvious when empty, not to add more prose telling the model to do it.

## Design decisions and what was left out

- **One skill, two adapters — not two skills.** The judgment (what is worth testing, what is coverage theater, how to falsify) is identical across platforms; only libraries and selectors differ. Two skills would have duplicated the judgment and let the copies drift.
- **Adapters load late.** Step 3, not Step 1. Loading the platform adapter early biases behavior extraction toward what the tooling makes easy to assert.
- **`SPEC_CONFLICT` is a distinct stop condition.** Not folded into `BLOCKED`. When implementation and spec disagree, writing a test either way silently picks a winner on a question a human should decide. The tri-state shape mirrors `prompts/loop-implementation-readiness/`, which is already validated here — reusing a proven verdict vocabulary rather than inventing one.
- **Visual regression is explicitly deprioritized** in the web adapter and absent from React Native. High maintenance, high false-positive rate, and it tends to consume the appetite for testing before the layers that catch real bugs are in place.
- **Left out: coverage thresholds.** Deliberate. A coverage number is a proxy that this skill's spec-gap output supersedes. Adding a threshold would reintroduce the exact incentive the coverage-theater section exists to reject.
- **Left out: native module testing, device matrices, load testing.** Different skills if they are ever needed.

## Maintenance notes

When this ages, check three things:

1. **Do the adapters still match the libraries?** RNTL's `userEvent` surface and Maestro's CLI both move faster than the rest of the stack. The React Native adapter already carries a warning to verify Maestro against `docs/references/maestro/README.md` before wiring CI — keep that reference current, since it is the pre-flight gate required by `docs/standards/artifact-structure.md`.
2. **Is the layer table still catching flow inflation?** If real runs keep producing more `flow` tests than `component` tests, the table is not doing its job and the decisive question in Step 2 needs sharpening.
3. **Are spec gaps actually routing anywhere?** The output contract makes spec gaps a deliverable, but nothing in the vault currently consumes them automatically. If they are being produced and dropped, that is the same open-circuit problem this repo already has with retrospectives — worth wiring rather than worth deleting.

To extend it: add a platform adapter under `references/`, and add a row to the layer→tool table inside it. Do not add platform specifics to `SKILL.md` — the file is deliberately platform-free, and the first leak makes the rest inevitable.

## Known gaps

- No real runs. The skill is structurally sound and unproven. Everything in the README's Evidence section says so.
- The React Native flow layer may be unverifiable in this repo's CI environment, which means Maestro flows authored by this skill could ship as gates nobody has watched close. The adapter tells the model to mark it skipped; it does not solve the infrastructure problem.
- No guidance for monorepos with multiple apps and shared packages — the runner-detection instruction assumes a single `package.json` at a discoverable root.
- Mutation checking is manual and one-at-a-time. If this gets heavy use, the natural next artifact is a small mutation-testing tool under `tools/`, at which point Step 4 becomes a command rather than a procedure.
