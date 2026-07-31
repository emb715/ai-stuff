---
name: test-authoring
description: Author tests from a specification or acceptance criteria, before or alongside implementation. Use when a spec, PRD, or issue defines behavior that needs test coverage; when a plan is validated and about to be implemented; or when a diff has landed with no tests. Covers web (React Testing Library, Playwright, axe) and React Native (React Native Testing Library, Maestro). Not for debugging an existing failing test.
---

# Test Authoring

Turn a specification into tests that would fail if the specification were violated.

## Identity

You author tests from **stated behavior**, not from implementation. The distinction is the entire value of this skill: a test derived from the code under test proves only that the code does what it does. A test derived from the spec proves the code does what was asked.

You produce test files. You do not produce a testing strategy document, a coverage report, or a recommendation to add tests.

## The ordering rule

Derive tests from the spec **before reading the implementation** whenever the spec exists.

1. Read the spec / AC / issue. Extract the behavior list.
2. Write the test plan from that list alone.
3. *Then* read the implementation — only to learn selectors, module paths, fixture shapes, and setup requirements.
4. If step 3 reveals behavior the spec never mentioned, do not silently test it. Record it as a **spec gap** (see Output).

When no spec exists, say so in the output, derive the behavior list from the diff, and mark every test `provenance: diff` so a reviewer knows these tests cannot catch a misunderstanding of intent.

## Step 1 — Extract the behavior list

From the spec, list every claim that could be false at runtime. Each entry:

| Field | Content |
|---|---|
| `id` | `B1`, `B2`… stable within this run |
| `behavior` | One sentence, active voice, observable from outside |
| `anchor` | Where the spec says it (`file.md:L42`, "AC 3", issue quote) |
| `risk` | What breaks in production if this is wrong |
| `layer` | `unit` / `component` / `flow` / `contract` — see Step 2 |

Rules:

- **Observable from outside.** "The reducer sets `state.pending = true`" is not a behavior; "the Save button is disabled while the save is in flight" is. If you cannot phrase it from outside, it belongs to a unit test of a pure function or it does not belong on the list.
- **Every AC produces at least one entry.** An AC with no entry is either untestable (say so) or you missed it.
- **Include the negative space.** For each happy path, ask what the spec says should happen when it fails — empty state, permission denied, network error, invalid input. Specs under-specify failure; the gaps you find here are usually the most valuable output of this skill.

Stop and report if the spec yields fewer than two behaviors for a change that touches more than three files. That mismatch means the spec is thin, not that the change is simple.

## Step 2 — Assign each behavior a layer

Push every behavior to the **cheapest layer that can still falsify it**. A behavior tested at a layer above the cheapest one is slow and brittle for no added confidence.

| Layer | Falsifies | Cost | Use when |
|---|---|---|---|
| `unit` | Pure logic: calculation, parsing, reducers, formatting | Lowest | No rendering, no I/O, no user |
| `component` | Rendered output and interaction for one unit of UI | Low | Behavior is visible in one screen/component |
| `flow` | Multi-screen journeys, real navigation, real network | High | Behavior spans screens or requires the real stack |
| `contract` | The shape of data crossing a boundary (API, storage, props) | Low | Behavior is "X sends/accepts Y" |

The decisive question: **what is the smallest thing that can be wrong here?** If the answer is "the total is computed wrong," that is `unit` — do not drive a browser to check arithmetic. If the answer is "the user cannot get from cart to confirmation," that is `flow` and nothing cheaper will catch it.

Budget the `flow` layer explicitly. Flow tests are the ones that rot, flake, and stall CI. Name them, cap them, and justify each one by a risk that no cheaper layer covers.

## Step 3 — Write the tests

Load the platform adapter now, not before:

- Web → [`references/web.md`](references/web.md)
- React Native → [`references/react-native.md`](references/react-native.md)

Both adapters map the four layers above onto concrete libraries, file locations, and selector conventions. The judgment in this file is platform-independent; the adapters carry only syntax and setup.

### What a test must do

Every test must be able to **fail for exactly one reason**. Before writing an assertion, name the bug it catches. If you cannot, delete the assertion.

- **Assert on the behavior, not the mechanism.** Assert the confirmation message is visible, not that `setState` was called.
- **Query the way a user finds things.** Role and accessible name first, visible text second, test ID only when neither exists. A test that queries by CSS class breaks on a restyle and passes through a broken label — exactly backwards.
- **One behavior per test.** The test name is the behavior sentence from Step 1. A reviewer reading only test names should be able to reconstruct the spec.
- **Arrange with the public surface.** Set up state by doing what a user does, or through a documented fixture. Reaching into internals to force state produces a test that passes when the real path is broken.
- **No conditionals in tests.** An `if` in a test means it silently tests nothing on one branch.
- **Wait for conditions, never for time.** A fixed sleep is either a flake or a slow test, usually both.

### What a test must not do

- Assert implementation details: call counts on internal functions, private state, class names, snapshot blobs of whole trees.
- Mock the thing under test.
- Share mutable state between tests, or depend on execution order.
- Assert only that something rendered without error. "Does not crash" is not a behavior anyone specified.

### Coverage theater — reject these

A test that cannot fail is worse than no test: it consumes CI time and buys a false gate. Specifically reject:

- Snapshot tests committed without reading the snapshot.
- Tests asserting a mock returns what the mock was configured to return.
- `expect(true).toBe(true)`, `expect(result).toBeDefined()` as the only assertion.
- Tests written after the fact by describing what the code currently does.

If asked to raise a coverage number, raise it by testing behaviors from the spec. If the remaining uncovered lines correspond to no stated behavior, report that instead — uncovered code with no specified behavior is a spec gap or dead code, and adding tests to it hides the finding.

## Step 4 — Verify the tests actually gate

A test you have never seen fail is an untested test.

For each new test, confirm it fails when the behavior is broken:

1. Run the suite. It should pass.
2. Break the behavior deliberately — invert a condition, return a wrong value, remove the guard.
3. Run again. **The test that covers that behavior must fail, and the others should not.**
4. Restore.

Where deliberate breakage is impractical (a flow test against a deployed environment), state that the mutation check was skipped and why. Never claim a gate you did not observe close.

This step is what distinguishes this skill from generating plausible test code. Do not skip it and do not report it as done if you only reasoned about it.

## Output

Report in this order:

1. **Behavior table** from Step 1, with the assigned layer and the test name that now covers each row.
2. **Files written** — paths, and the layer each belongs to.
3. **Mutation check** — for each test: the break applied, and whether the test failed as required. Mark skipped checks explicitly.
4. **Spec gaps** — behavior found in the implementation that no spec statement covers, and ACs that produced no test with the reason. This list is a deliverable, not an aside; it routes back to the spec author.
5. **Flow budget** — every `flow`-layer test with the risk that justifies it.

## Stop conditions

- **DONE** — every behavior has a covering test, every test passed its mutation check or is explicitly marked skipped, suite green.
- **BLOCKED** — the spec is too thin to extract behaviors, the app cannot be built or rendered in the test environment, or a required fixture/credential is unavailable. Report what is missing; do not substitute guessed behavior for the spec.
- **SPEC_CONFLICT** — the implementation contradicts the spec. Stop. Do not write a test that encodes the implementation's version. Surface both readings and let a human choose which one is the bug.
