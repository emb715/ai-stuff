---
title: "prompt-factory"
status: validated
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "opencode/claude-sonnet-4-6"
tags:
  - experiment
  - prompts
  - workflow
owner: "@ezequielbenitez"
---

# Context / Problem

Switching between implementation sessions requires manually reconstructing context — plan state, blockers, and phase structure — every time. This is error-prone and wastes tokens. A parameterized command that reads a provided plan doc (or falls back to session context) and generates a ready-to-paste prompt could eliminate that overhead.

# Scope

This experiment covers a single OpenCode command (`/prompt-gen`) and three shaped templates (default, strict, fast), plus explicit mode/doc-source gating (`auto` selection only when requested).
Out of scope: multi-agent coordination, automatic plan parsing, or integration with external task trackers.

# Hypothesis

A small set of shaped prompt templates (default, strict, fast) can be generated contextually from an active session — without manual variable filling — and produce ready-to-paste prompts for fresh implementation sessions with sufficient context to proceed without re-investigation.

Evidence basis: partially tested (`default` and `fast` pass; `strict` pending). Success criteria for full-mode validation are defined in the Next step section.

# Setup

- OpenCode with a skill or command loaded in a session that contains an implementation plan
- Plan exists either as a file reference or in-session context
- User invokes `/prompt-gen [mode] [plan-doc-path]`
- LLM prefers a plan doc from message/arguments; falls back to session context if none is provided
- LLM extracts plan path, status, blockers and writes the prompt in the requested shape

# Procedure

1. Load the skill or command in an OpenCode session
2. Have an active implementation plan in context (file or in-session)
3. Run `/prompt-gen default [plan-doc-path]`, `/prompt-gen strict [plan-doc-path]`, `/prompt-gen fast [plan-doc-path]`, and `/prompt-gen auto [plan-doc-path]`
4. Evaluate output: is it self-contained, correctly shaped, free of hallucinated context?
5. Paste generated prompt into a fresh session and execute
6. Record whether the fresh session had enough context to proceed without re-investigation

# Mode Selection Gate

Use this decision gate before generating output:

1. If user explicitly provides mode (`default|strict|fast`), use it.
2. If mode is omitted, do not auto-run; return a deterministic numbered gate message with 4 choices: `1) default`, `2) strict`, `3) fast`, `4) auto`.
3. If user selects `auto`, then select:
   - `strict` when the plan has explicit phases/checkpoints.
   - `default` when there is at least one hard blocker that must be resolved before execution.
   - `fast` when blockers are non-critical and can be resolved inline while proceeding.
4. If auto-selection evidence is ambiguous, default to `default`.

# Plan Source Gate

1. Prefer explicit plan doc in user message or `[plan-doc-path]` argument.
2. If no explicit plan doc is provided, use the best available plan reference from session context.
3. If multiple conflicting plan docs exist and no explicit choice is provided, stop and ask the user to select one.
4. If explicit plan doc is provided but unreadable/missing, stop and return a concise missing-context checklist.

# Pre-flight Gate

Before generating output, confirm all three are extractable from current session context:

- At least one concrete plan reference/path
- Objective/scope
- Blockers or readiness state

If any pre-flight item is missing, do not generate final prompt output; return a concise missing-context checklist.

# Observations

Tested `default` and `fast` modes against `shareable-template-plan.md` in a live session (2026-06-24). Plan was fully in context — file was read and all fields were extractable without prompting the user.

- `default` mode: extracted plan path, source-of-truth docs, one unresolved blocker (target path not in plan), ordered delivery steps, and done criteria. Surfaced the missing target path as a hard gate in step 1 rather than hallucinating a value.
- `fast` mode: produced a compressed single-pass version. Correctly identified the same target path gap and converted it to an inline "one question then proceed" instruction rather than a hard stop. Context resume was tighter — one paragraph vs a structured blockers list.
- Both outputs were self-contained and paste-ready without manual editing.
- Key difference: `default` gates hard on the missing input; `fast` asks inline and proceeds. `default` is safer when the missing input is truly blocking; `fast` is appropriate when the session can resolve it on the fly.

`strict` mode not yet tested — plan lacked explicit phases, which is the precondition for strict mode to produce meaningful checkpoint structure.

# Results

- `default` mode: **pass** — output is paste-ready, correctly shaped, no hallucinated context, blocker surfaced correctly
- `fast` mode: **pass** — output is paste-ready, correctly shaped, appropriately compressed
- `strict` mode: **not tested** — requires a phased plan to evaluate meaningfully
- Fresh session execution: verified end-to-end (2026-06-24) — session ran successfully without re-investigation

# Conclusion

Promote to `validated`. Two of three modes produced usable output from a well-structured plan on first run. The command correctly extracts context without prompting and handles missing inputs appropriately per mode.

End-to-end verified: generated prompt pasted into a fresh session — session executed successfully without re-investigation (2026-06-24).

Remaining for `validated → vetted`: test `strict` mode against a phased plan.

# Next step

Run `strict` mode against at least one phased implementation plan and record outcomes (shape quality, blocker handling, and fresh-session execution quality).
If `strict` mode passes and rubric threshold is met, run `_meta/framebook/promote-artifact/` for `validated -> vetted` and move to the correct permanent destination (`tools/` if classified as a tool/command).
If output is inconsistent or requires too much manual correction, iterate on shape guides or add a pre-flight variable check and keep status at `validated`.

Canonical reusable artifact now lives at `skills/prompt-factory/` with command wrapper at `skills/prompt-factory/commands/prompt-factory.md`.

# Failure Modes / Boundaries

- LLM may hallucinate plan paths if the plan was never explicitly referenced in session
- Context resume may be too compressed (loses critical blocker detail) or too verbose (wastes tokens)
- `strict` mode's phase structure depends on the plan already having logical phases — if the plan is flat, the generated output will be weak
- Command reads template files by path — breaks if run from a repo root where `skills/prompt-factory/` no longer exists (post-move, paths need updating)
