# prompt-factory — usage handbook

## What it is

A prompt generator. You give it a plan, it asks what you need, it produces a ready-to-paste prompt tailored to that moment in your work.

It does not execute work. It generates the instruction that starts the next session.

---

## When to reach for it

The rule is simple: any time you are about to start a new session and need to tell an AI what to do, use `/prompt-factory` instead of writing the prompt by hand.

Hand-written prompts are inconsistent, miss context, and waste the first few turns re-establishing state. This skill eliminates that.

---

## Where it fits in a development cycle

```
idea → plan → refine plan → implement → review → handoff/continue → debug (if broken)
               ↑              ↑             ↑        ↑                  ↑
         plan-refine    implementation   review   handoff             debug
```

Each arrow is a moment where `/prompt-factory` produces the right prompt for that transition.

---

## Type selection guide

### `plan-refine`
**Before you start building.**

Use when you have a plan that needs to reach implementation readiness. The generated prompt drives the doc through iterative rounds — each round resolves the highest-risk gap with the smallest change, runs two independent reviews, and stops only when both agree and no P0/P1 unknowns remain.

When to use:
- Plan was just written and has known gaps or conflicts
- You are inheriting someone else's spec and need to validate it
- You sense something is off but can't name it
- You want to confirm a plan is truly implementation-ready before starting

Do not use when the plan is already solid and you just want to build — go straight to `implementation`.

---

### `implementation`
**When you are ready to build.**

Use when the plan is solid, blockers are known, and you want a session that executes. Choose a shape:

- **`D` default** — use when there are hard blockers or missing inputs that must be resolved before proceeding. The prompt gates explicitly on those. Best for first implementation sessions on a new plan.

- **`F` fast** — use when the plan is clear, blockers are minor, and you want maximum velocity. Single pass, validate at the end. Best for well-understood tasks or small scoped work.

- **`S` strict** — use when the plan has explicit phases, risk is high, or you need a checkpoint record at each step. One phase at a time, hard stop after each. Best for large or risky changes where partial failure is expensive.

When in doubt between `D` and `F`: if there is any missing input that would cause the session to halt or guess, use `D`. If everything is known, use `F`.

---

### `handoff`
**When you need to continue in a different session.**

Use when:
- Context window is full and work is not done
- You are switching from planning to implementation
- You want another agent/session to pick up exactly where you left off
- You are pausing and will resume later

The generated prompt packages current state — what is done, what is in progress, what is blocked, locked decisions, and the exact next step. The receiving session needs zero re-investigation.

Do not use to start work from scratch. Use `implementation` for that.

---

### `review`
**After changes exist.**

Use when you have a diff, a set of changed files, or a completed implementation and want structured quality assessment before calling it done.

The generated prompt reviews for correctness, scope adherence, maintainability, and risk. Every finding is cited with evidence and severity (P0–P3). Pass only when no P0/P1 remain.

Use before merging, before handing off to QA, or before promoting an artifact.

---

### `debug`
**When something is broken.**

Use when you have a failure — error trace, wrong output, broken test, unexpected behavior — and need a session focused on root cause, not guessing.

The generated prompt enforces diagnosis before code changes. Hypothesis ranked and falsified. Fix tied to confirmed cause. Verification required before done claim.

Do not use for planned refactors or improvements. That is `implementation`. Debug is only for active failures.

---

## A complete development cycle with prompt-factory

**1. You have a plan.**
Run `/prompt-factory plan.md` → select `1` (plan-refine).
Loop runs until no P0/P1 remain and both reviews agree.
When done: proceed to implementation.

**2. Start implementation.**
Run `/prompt-factory plan.md` → select `2D` (first session, blockers likely).
Paste into fresh session. Execute.

**3. Context window fills mid-task.**
Run `/prompt-factory plan.md` → select `4` (handoff).
Paste into fresh session. Continue from exact state.

**4. Implementation complete. Want to verify.**
Run `/prompt-factory plan.md` → select `3` (review).
Paste into fresh session. Review the diff.

**5. Something breaks.**
Run `/prompt-factory plan.md` → select `5` (debug).
Paste into fresh session. Diagnose and fix.

**6. Risky phase coming up.**
Run `/prompt-factory plan.md` → select `2S` (strict, phased).
Paste into fresh session. One phase at a time.

---

## Shorthand for experienced use

Once you know what you want, skip the menu:

```
/prompt-factory implementation-fast plan.md
/prompt-factory handoff plan.md
/prompt-factory debug plan.md
```

---

## What it is not

- Not a plan writer. It reads plans, does not create them.
- Not a task tracker. It generates prompts, does not track execution.
- Not a substitute for a good plan. Garbage in, garbage out. Run `plan-refine` first if the plan is uncertain.
- Not for one-off questions. If you can type the instruction in one sentence, just type it.

---

## Installation

```bash
mkdir -p .opencode/commands
ln -sf ../../skills/prompt-factory/commands/prompt-factory.md .opencode/commands/prompt-factory.md
```

Then use `/prompt-factory` from any OpenCode session in this repo.
