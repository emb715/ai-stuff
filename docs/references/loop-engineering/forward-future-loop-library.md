---
title: "How Agent Loops Work — Forward Future Loop Library"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - loop-engineering
  - forward-future
owner: "@ezequielbenitez"
---

# How Agent Loops Work — Forward Future Loop Library

**Source:** https://signals.forwardfuture.ai/loop-library/learn/
**Author:** Forward Future
**Captured:** 2026-06-24

---

## Core definition

> An agent loop is a task with a check. The agent does some work, checks the result, and then continues or stops.

Use a loop when the result of one step should change the next step. If it won't, use a one-time task instead.

---

## Four properties of a useful loop

1. **Clear measurable goal** — "Improve the code" is vague. "Make every page load under 50ms under the same test conditions" is a real finish line.
2. **Small bounded actions** — One change at a time. Smaller changes are easier to verify and undo.
3. **Fixed stable check** — The same test, benchmark, rubric, or approval step after every change. The check — not the agent's opinion — determines whether work improved.
4. **Explicit stop conditions** — Four states: success, no-op (nothing to do), ask for approval, blocked/out of budget.

---

## Loop prompt structure (copy-and-adapt template)

```
When [trigger], inspect [fresh inputs]. Choose one in-scope action using [criteria], then make the change.

Run [acceptance check] under the same conditions. Record what changed, the evidence, and the next step in [state file].

Repeat only while progress is measurable and [budget] remains. Stop when [success gate] passes. Stop without changes when [no-op condition] is true.

Ask for approval or report a blocker when [escalation condition] occurs. Never [forbidden action]. Finish with [pull request, report, artifact, or handoff].
```

Always run the prompt once by hand before scheduling. The first run reveals missing checks, unclear boundaries, or stop conditions that need sharpening.

---

## Stop conditions — all four must be defined

| Condition | Meaning |
|---|---|
| Success gate | The loop completed its goal — stop and hand off |
| No-op | Nothing to act on — stop without changes |
| Escalation | Decision needed, permission missing, or tool unavailable — ask |
| Budget exhausted | Time, cost, or iterations limit hit — stop and report |

---

## Safety rules

- **Set limits.** Every loop needs a maximum: time, cost, retry count, iteration count, or affected scope. Never interpret "keep going" as unlimited authority.
- **Keep the check stable.** Changing the benchmark after every result makes progress impossible to compare.
- **Leave a useful handoff.** Record goal, completed steps, evidence, blockers, and next action in `tmp/<file>.md`. Never store secrets there.
- **Keep consequential actions behind approval.** Production, destructive, financial, privacy-sensitive, or external-message actions require human approval. Blocked, exhausted, and stagnant runs are not successful runs.

---

## Loop library

The Forward Future Loop Library (https://signals.forwardfuture.ai/loop-library/) publishes ready-to-use loop prompts. Each entry separates:
- The full prompt body (copy-paste)
- The verify/stop signal (separate, short, checkable without re-reading the prompt)
- Context and guidance (when to use, how to run, why it works, related loops)

This format is the convention this repo follows for loop prompts.
