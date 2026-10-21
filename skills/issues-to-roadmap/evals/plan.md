# issues-to-roadmap — evaluation plan

Written **before** any run, per `skills/skill-authoring/SKILL.md` Step 10: "Select at least three representative task prompts before drafting extensive instructions. Define ground truth and verifiable correctness/safety assertions."

## Constants

| Setting | Value |
|---|---|
| Model | `claude-code/claude-sonnet-5-5`, identical in every run |
| Directory | the `ai-stuff` repo (remote `emb715/ai-stuff`), identical in every run |
| Sessions | independent, one per run, no cross-contamination |
| Skill delivery | project-level symlink at `.opencode/skills/issues-to-roadmap`, discovered by the harness. Never named in a prompt |
| Repeats | one run per cell. Variance is therefore **untested** — no reliability claim follows from this |

Baselines run **before** the symlink exists; with-skill runs after. Only the skill's availability changes between conditions.

## Safety constraint

Every prompt says "do not create anything in any tracker — proposal only". This is constant across conditions, so it does not confound, and it prevents the eval from writing junk into a real repo.

**Cost:** it partly neuters the skill's draft-show-stop discipline, since both conditions are told to stop. Assertion A7 is graded on whether the output is a proposal awaiting approval, which is weaker than observing the skill stop on its own. Recorded as a limitation, not a pass.

## Discovery

The three task prompts never mention the skill, a skill, or this repo's vault. In the with-skill condition they therefore double as **should-trigger** probes: activation is the harness's decision from the `description` alone.

Two further **should-not-trigger** probes run in adjacent domains after the symlink exists:

- D1: "I'm having issues with the doc lint script failing on templates — can you work out why?" (the word "issues", unrelated domain)
- D2: "Break down what this repo's lint rules do, section by section." (the verb "break down", unrelated domain)

Activation is inferred from fingerprints in the output (`.scratch/`, the five kinds, `Blocked by`, the two size gates, the proposal layout), not from harness instrumentation. That is weaker than reading a skill-load event and is recorded as such.

## Prompt 1 — common use

Realistic planning notes: four mechanical decisions, one bug, one non-functional requirement, one undecided question, one stated goal.

| # | Assertion | Discriminating? |
|---|---|---|
| A1 | The dunning item is **not** filed as an issue — no mechanical criterion exists for it | yes |
| A2 | The PDF 500 is filed as a **bug**, with a reproduction | no |
| A3 | The p95 item is filed as a non-functional requirement with a threshold **and** a named enforcing gate — not as a spec | yes |
| A4 | POST /invoices and the paginated list are **separate** vertical slices, each quoting the specifics (422 / `INVALID_AMOUNT`, 50 per page) | partly |
| A5 | Every filed item carries an explicit out-of-scope line | yes |
| A6 | "self-serve billing" is treated as the parent level (project/roadmap), not as an issue | yes |
| A7 | Output is a proposal awaiting approval; nothing is created | no (see safety constraint) |
| A8 | Size appears on specs and the bug, and **not** on the non-functional requirement | yes |

## Prompt 2 — edge / failure case

Input that is mostly *not* mechanical. The correct behaviour is to file little and refuse to invent.

| # | Assertion | Discriminating? |
|---|---|---|
| B1 | Only the rate-limiting item becomes a spec | yes |
| B2 | Clunky onboarding, dark mode, and queue-vs-cron are open questions, not issues; queue-vs-cron is named as an undecided decision | yes |
| B3 | The admin-panel rebuild is filed as a PRD, or refused as needing a split first — **not** as one spec | yes |
| B4 | **No invented acceptance criteria** for any vague item | yes — primary safety assertion |
| B5 | The output states that most of the input is not fileable | yes |

## Prompt 3 — distinct in-scope task: dependencies and grouping

| # | Assertion | Discriminating? |
|---|---|---|
| C1 | The auth middleware becomes its own issue, and the endpoints declare a dependency on it | yes |
| C2 | POST and PATCH declare a dependency on GET | partly |
| C3 | A milestone groups the three endpoint issues; the front-end screen is a separate boundary or explicitly justified | yes |
| C4 | "checkout live" is the project/roadmap level, not an issue | yes |
| C5 | Dependencies use a mechanism (`Blocked by: #n`, or a named placeholder) rather than prose | yes |

## Grading

Each assertion is pass/fail against the produced proposal text, with the quoted evidence recorded. Non-discriminating assertions (ones both conditions satisfy) are flagged, since they prove nothing about the skill.

Critical factual or safety defects block shipping regardless of score. B4 is the assertion that can block: inventing acceptance criteria for a vague intention produces an issue an agent will implement against a requirement no human ever stated.

## Results

See `results.md`, written after the runs.
