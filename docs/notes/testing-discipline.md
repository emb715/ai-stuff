---
title: "Testing Discipline Reference"
status: draft
confidence: high
last_tested: 2026-08-04
scope: universal
tooling:
  - "vitest/jest/pytest"
tags:
  - testing
  - unit-testing
  - code-review
  - regression
  - standards
  - reference
owner: "@emb715"
---

# Testing Discipline Reference

## Context / Problem

Agents that generate code or review PRs need a shared, framework-agnostic vocabulary for what counts as a real test, what a diff obligates, and what failure modes to refuse. Without one, "has tests" passes review while behavior ships untested, generated suites inflate coverage without catching bugs, and bug fixes land without regression cases. This reference consolidates two disciplines — unit test generation and PR test coverage review — into a single standard that both the writer and the reviewer apply.

## Scope

**Covers:** unit test case selection, test quality gates, mocking discipline, and PR diff-to-test-obligation mapping for unit and integration tests in `vitest` / `jest` / `pytest`.

**Does not cover:** E2E test selection (different cost model, different selection criteria), LLM eval methodology (metric-based, not behavior-based), integration test topology strategy (which services to wire vs stub), load/performance testing, accessibility testing. Those domains reuse some principles here but override others; do not extrapolate this reference onto them.

## Procedure / Steps

### 1. Case Selection Algorithm

For each public function, enumerate cases in this order. Each step produces behavior-named tests, one behavior per test.

| Step | Class | What to enumerate |
|---|---|---|
| 1 | Happy paths | One per meaningful input class (equivalence partitions) |
| 2 | Boundaries | Empty, one, many; zero, negative, max; exact limits ±1 |
| 3 | Error contract | Every documented throw / rejection / error return, asserted by TYPE and meaningful message |
| 4 | Special values | `null` / `undefined` / `None`, `NaN`, empty string vs whitespace, unicode, duplicates, unsorted input to order-sensitive code |
| 5 | State and idempotency | Repeated calls, call order, mutation of inputs (assert the function does NOT mutate arguments unless documented) |
| 6 | Concurrency / async | Rejected promises, timeout paths, out-of-order resolution where relevant |

Skip: private helpers (test through the public surface), trivial getters, framework glue.

### 2. Quality Gate — Prove the Tests Bite

A generated test that has not been seen failing is unverified. Apply the gate in order:

1. **Break-the-code pass.** Flip one operator in the unit under test; at least one test must fail. Repeat for each core branch.
2. **Coverage as gap-finder.** Run `vitest run --coverage` or `pytest --cov`. Inspect UNCOVERED branches and either add a behavior case or document why the branch is unreachable. Do not chase 100%.
3. **Mutation testing when it matters.** Stryker (JS/TS) or mutmut (Python) on critical modules. Surviving mutants = weak assertions.
4. **Determinism.** Run the new suite 5×. Any flake is a bug in the tests (shared state, real time, ordering).

### 3. Mocking Discipline

Mock ONLY at architectural boundaries. Mocking the module under test's own collaborators just to isolate lines produces a test that verifies the mock, not the behavior.

Architectural boundaries where mocking is correct:

| Boundary | Discipline |
|---|---|
| Network | MSW or `respx` at the HTTP layer, not stubbed client methods |
| Filesystem | Inject a fake fs or temp dir; no test should touch real user paths |
| Clock | Inject a clock or use `vi.useFakeTimers()` / `freezegun`; no test depends on real `now()` |
| Randomness | Seed it or inject it |
| Databases | Repository seam or test container; never mock the ORM internals |
| Third-party SDKs | Mock at the SDK's public entry point, not its internals |

Verify interactions only when the interaction IS the contract (sent the email, charged exactly once). Otherwise assert return values.

### 4. Common Mistakes in Generated Tests

- **Snapshot tests as a substitute for assertions on computed values.** Snapshots freeze the current output, including current bugs.
- **Tautological tests.** The expectation recomputes the implementation's logic inline (`expect(fn(x)).toBe(sameFormulaInline)`); the test passes even when the function is wrong in the same way twice.
- **Over-mocking.** The unit's own collaborators mocked, so the test verifies the mock, not behavior. Refactors fail the test without any behavior change.
- **One giant test per function.** Failures become unreadable; one `it` covering five cases produces one stack frame for five distinct behaviors.
- **Error-message-vs-type brittleness.** Asserting the exact error MESSAGE when only the TYPE is the contract (brittle), or asserting only the type when the message carries user-facing meaning (too loose).

### 5. PR Test Coverage Review — Change-Type → Testing Obligation

Map every behavior change in the diff to a testing obligation before reading the tests. The diff defines the obligation.

| Change type | Testing obligation |
|---|---|
| New function / endpoint | Happy path + boundaries + error contract |
| Changed conditional / branch | Both sides of the new or modified branch |
| Bug fix | Regression test reproducing the original bug, verified it fails on main |
| New error handling | Test that triggers the error path |
| Schema / type change | Serialization + validation + migration cases |
| Config / feature flag | Behavior with flag ON and flag OFF |
| Refactor (claimed no-behavior-change) | Existing tests pass UNCHANGED; edited assertions are a red flag |
| Concurrency / async change | Rejection, timeout, ordering cases |
| Removed code | Corresponding dead tests removed too |

Coverage tooling is evidence, not verdict. Diff coverage under ~80% almost always hides an untested branch worth naming; 100% diff coverage can still miss behavior (tautological tests, assertion-free tests, snapshots).

### 6. PR Review — Red Flags

A test that exhibits any of these is negative value — it raises coverage while reducing signal. Flag explicitly.

- **Tautology:** expectation recomputes the implementation (`expect(fn(x)).toBe(sameFormulaInline)`).
- **Over-mocking:** the unit's own collaborators mocked, so the test verifies the mock.
- **Assertion-free:** calls the function, asserts nothing (or only `toBeDefined`).
- **Snapshot dumping:** giant snapshots instead of targeted assertions on the changed behavior.
- **Edited assertions in a "refactor":** behavior changed silently; ask which is intended, old or new.
- **Happy-path-only for error-handling PRs:** the new `catch` / `except` is never triggered.
- **Flake bait:** real time, real network, order-dependent tests.

### 7. PR Review — Severity Ladder

| Severity | Definition |
|---|---|
| BLOCKER | Bug fix without a regression test; new error path untested on a money path |
| MAJOR | New branch one-sided; over-mocked core logic; assertion-free test on changed behavior |
| MINOR | Naming, missing boundary on a non-critical path, style |

Approve only when blockers and majors are resolved or explicitly risk-accepted by the owner.

### 8. PR Review — Principles

- **The diff defines the obligation.** Every behavior change creates a specific testing debt; enumerate it before reading the tests.
- **Presence is not coverage.** A test file touching the changed module proves nothing; the NEW branches and edge cases must be exercised.
- **Bug fixes REQUIRE a regression test.** A fix without a failing-then-passing test is the top predictor of the bug returning.
- **Judge tests as code.** Tautological, over-mocked, or assertion-free tests are negative value.

## Evidence / Results

Extracted from thetestingacademy QA skills (`unit-test-generation` v1.0.0 and `pr-test-coverage-review` v1.0.0, MIT licensed), assessed for accuracy against current SDET practice on 2026-08-04 and restructured to vault standards. The Case Selection Algorithm, the "Prove the Tests Bite" gate, and the change-type obligation table reproduce widely used SDET heuristics; the red flags and severity ladder reproduce common senior review practice.

Measurable signals encoded in the reference: diff coverage under ~80% almost always hides an untested branch (observed threshold from the source skill's review practice); the determinism gate requires 5 consecutive clean runs before a suite is considered stable; mutation testing (Stryker / mutmut) is applied on critical modules where surviving mutants correlate with weak assertions. These are heuristics from field practice, not controlled benchmarks.

## Failure Modes / Boundaries

- **E2E tests.** Case selection is cost-bound, not contract-bound; the algorithm above over-tests for the E2E budget. Use a different selection criteria (critical user journeys, not equivalence partitions).
- **LLM evals.** Metric-based, not behavior-based. "Pass/fail" is a score against a rubric, not an assertion against a contract. The mocking discipline and red flags do not transfer.
- **Integration test topology.** This reference defines what to test per change, not which services to wire vs stub. Topology is a separate decision driven by the system's trust boundaries.
- **Property-based / generative testing.** Complements the case selection algorithm but does not replace it; property tests cover input spaces the algorithm samples, not the contract assertions.
- **Mutation testing as a gate.** Useful on critical modules, expensive as a universal gate. Apply on the modules where a missed bug has the highest blast radius, not on every PR.

## Sources

Extracted and adapted from thetestingacademy QA skills (MIT, v1.0.0) — `unit-test-generation` and `pr-test-coverage-review`. Assessed for accuracy and restructured to vault standards.