# prompt-factory

Generate ready-to-paste prompts from a plan source. Guides the user to pick a type and shape in one interaction, then generates output.

## Trigger

Use when the task is to generate a fresh-session prompt from a plan doc or current session plan context.

## Input contract

- Optional: plan doc path/reference (as argument or in session context)
- Optional: shorthand `[type]-[shape]` to skip the menu entirely (e.g. `implementation-fast`)

## Execution flow

### Step 1 — Plan source gate

Resolve plan source before showing any menu:

1. If an explicit plan path was provided (argument or current message), use it.
2. If no explicit path, use the best available plan reference in session context.
3. If multiple conflicting plans exist, stop and ask:

```text
Multiple plans found. Which one should I use?
[list found plans numbered]
```

4. If no plan is found anywhere, stop and return:

```text
No plan found. Provide a plan path:
/prompt-factory path/to/plan.md
```

5. If explicit path is unreadable/missing, stop and return a concise missing-context checklist.

Once plan is confirmed, extract silently:
- Objective/scope
- Current status/readiness
- Blockers
- Phase or structure if present

### Step 2 — Combined type + shape menu

Present one combined menu. Types with shape options show their shapes inline as letter suffixes.
Types with no shape variants need only a number.

```text
Plan: <plan name or path>

Choose a prompt type — and shape if shown:

1) implementation   D) default   F) fast   S) strict
2) handoff
3) review
4) debug
5) plan-refine

Reply with number + letter for shaped types (e.g. 1F), or just the number for others.
```

Wait for one reply. Valid inputs:
- `1D` or `1d` → implementation, default shape
- `1F` or `1f` → implementation, fast shape
- `1S` or `1s` → implementation, strict shape
- `2` → handoff
- `3` → review
- `4` → debug
- `5` → plan-refine
- Type names also accepted: `implementation-default`, `implementation-fast`, `handoff`, `plan-refine`, etc.

If `1` alone (no shape letter) is given for implementation, respond:

```text
Implementation requires a shape:
  D) default — structured execution with readiness report
  F) fast    — single-pass, everything in one go
  S) strict  — phased, checkpoint after each phase
```

If `1S` is chosen, proceed to generate using the strict shape.

If input is invalid, repeat the menu once with:

```text
Invalid choice. Use number + letter for implementation (e.g. 1F), or just number for other types.
```

### Step 3 — Generate

Load template based on type + shape:

| Type              | Shape   | Template |
|-------------------|---------|----------|
| implementation    | default | `skills/prompt-factory/templates/default.md` |
| implementation    | fast    | `skills/prompt-factory/templates/fast.md` |
| implementation    | strict  | `skills/prompt-factory/templates/strict.md` |
| handoff           | —       | `skills/prompt-factory/templates/types/handoff.md` |
| review            | —       | `skills/prompt-factory/templates/types/review.md` |
| debug             | —       | `skills/prompt-factory/templates/types/debug.md` |
| plan-refine       | —       | `skills/prompt-factory/templates/types/plan-refine.md` |

Populate all required sections from extracted plan data.
Return exactly one fenced markdown code block.
No text before or after the code block.

## Shorthand argument behavior

If `$1` is a file path (contains `/` or ends in `.md`) → use as plan path, then show menu.

If `$1` is a valid shorthand (`implementation-default`, `implementation-fast`, `handoff`, etc.) → skip menu and generate directly.

If `$1` is a valid shorthand and `$2` is a file path → use both, skip menu, generate.
