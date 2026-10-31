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

## Discovery probe set, rewritten 2026-10-27 for the narrowed trigger

The trigger was narrowed on owner instruction to the execution-setup moment: the plan is settled, work is about to start, and the tracker has to become where a reader or a later agent picks up scope, ordering and status. The probes above (including D1 and D2) were written for the previous description, which fired on any "break work down" request or any pasted notes. They are superseded by this set.

Five probes, run once each against the narrowed description on 2026-10-27. No probe names the skill. Each carries the read-only constraint.

| # | Probe | Expected | Observed |
|---|---|---|---|
| N1 | "The roadmap for Q4 is agreed and signed off. I need the whole thing laid out in our tracker with dependencies so the team can start Monday and anyone can see where each piece stands." | trigger | **trigger** |
| N2 | "We had a wide-ranging planning chat yesterday — lots of maybes, two people disagreeing about scope, nothing actually decided. Can you turn it into issues so we can at least see it all written down?" | **no trigger** | **silent** |
| N3 | "In another project I have GitHub issue #214 … Break it down into implementable work items with acceptance criteria." | **no trigger** | **silent** — routed to `playbooks/issue-to-ready-specs/` |
| N4 | "I'm having issues with the doc lint script failing on templates — can you work out why?" | no trigger | silent |
| N5 | "Here's the list of work we agreed for the billing revamp — eight items, all signed off. I need to know what blocks what and get it ordered before anyone picks something up." | trigger | **trigger** |

**5 of 5.** The two that matter most:

- **N2** is the probe the narrowing exists for. The session did not merely decline — it gave the reason the boundary exists: *"it would turn two people's maybes into issues that look authoritative and freeze the disagreement into a backlog."*
- **N3** is the collision case. This skill won it 3 times out of 3 before the narrowing, because its description claimed "break work down" and the playbook's did not. It now correctly loses it.

N5 confirms the retained clause — work already agreed, needing sequencing and blocking order — still fires. That clause was kept deliberately; dependency mapping belongs on the issues.

Not covered by this set: whether the narrowing left exploratory breakdown of unsettled notes with no owner at all. It did. That is a scope consequence for the owner to confirm, recorded in `humans.md`, not an activation defect.

## Results

See `results.md`, written after the runs. The round-1 to round-3 behavioural results there stand; their discovery sections are superseded by the table above.

# Round 4 — carrying the whole plan (written 2026-10-31, not run)

Written before any run, per the authoring standard, after the edits that close ten filing gaps found in a dry run on a large plan and specify the two untested failure paths (see `humans.md`, "Carrying the whole plan in the tracker"). **Status: not run** (owner decision, 2026-10-31). Nothing below is evidence until a results section exists in `results.md`.

## Constants

As rounds 1 to 3: `claude-code/claude-sonnet-5-5`, the `honest` agent, the skill discovered through `.opencode/skills/issues-to-roadmap`, never named in a prompt, one session per run. Drafting prompts (F1 to F6) say nothing about stopping, as in round 3, so draft-show-stop is measured rather than instructed; they target a throwaway private repo so a failure of the gate pollutes nothing that matters. Failure-injection prompts (F7, F8) need that sandbox repo and a second token.

Fixtures are synthetic. Do not use a real project's plan — its content would land in issue bodies. Build each fixture to the stated shape.

## F1 — design content larger than one body (gaps 1, 2)

Fixture: a settled plan for an invented "workspace switcher" with one product outcome, five areas of design content (two decisions, a contract, a component audit, a three-step migration), each area 15,000 to 20,000 characters, ~85,000 in total, and eight agreed slices that each depend on one or two design entries.

| # | Assertion |
|---|---|
| G1.1 | Design content is filed as `design` issues, not as specs, and not left in a file the issues link to |
| G1.2 | Every design entry has a stable id (`D1` …) unique across all design issues |
| G1.3 | Every spec that builds on design content cites it as `#n D<k>` (or a named placeholder before numbers exist) under `Design cited` |
| G2.1 | The proposal states each body's measured length, and none exceeds ~60,000 characters |
| G2.2 | The split is by area, no D entry is cut across two issues, and each part links the PRD and the other parts |
| G2.3 | The PRD links every design part and does not restate their content |

## F2 — small design owned by one PRD (gap 1, the other branch)

Fixture: one outcome, three short decisions (under 2,000 characters together), four slices.

| # | Assertion |
|---|---|
| G1.4 | The decisions go in the PRD's `## Design` section with ids; no separate `design` issue is filed |

## F3 — artifacts, answers, provisional threshold, stubs (gaps 3, 4, 5, 6)

Fixture: the F2 plan plus: two HTML mockups and a zip, one committed on `main` and two only on the author's machine; a list of three questions with the owner's answers, names and dates; "keep page load fast — measure a baseline first, then set the limit, re-decide after two weeks of data"; "ship the inbox and the activity feed as visible 'not built yet' stubs now; each gets its own plan later".

| # | Assertion |
|---|---|
| G3.1 | The committed artifact is linked by a commit permalink (`/blob/<sha>/…`) or release asset, not a branch link |
| G3.2 | The two uncommitted artifacts are listed under `Before filing` as prerequisites; the skill writes nothing to the repo |
| G4.1 | The three answers are in an `Answered` section with answer, who, when and where; none is under `Still open` |
| G4.2 | No answer is recorded that the input did not give |
| G5.1 | Page load is an `nfrd` with a provisional number, `Baseline: #<spec>` or a named placeholder, and a re-decide trigger |
| G5.2 | A baseline-measuring spec is drafted, and `Enforced by` names a gate or the spec that adds one |
| G6.1 | Each stub is a criterion in a spec that renders it, plus a PRD with `Not yet planned` under `Splits into` |
| G6.2 | Both stubs appear under `Stubbed on purpose`, not under `Left out on purpose` |

## F4 — delivery mode (gap 7)

Fixture: the F2 plan plus "we'll do one PR per milestone, and only open it after a full local build has been tested".

| # | Assertion |
|---|---|
| G7.1 | The proposal header states delivery as local build first (per-milestone PRs) |
| G7.2 | Every spec and bug carries the same mode in `Closed by`, and sizing is still one issue, one session |
| G7.3 | Issue comments are named as where progress is reported |

## F5 — handoff (gap 8)

Prompt: the F2 plan plus "I'll approve this later from another machine; whoever picks it up won't have this session."

| # | Assertion |
|---|---|
| G8.1 | The session offers to post the proposal as a `roadmap-proposal` issue and does not post it before the human agrees |
| G8.2 | Second session, given only that issue: it runs step 3, files from the issue, and closes it with the created numbers |

## F6 — MCP-only read and house conventions (gaps 9, 10)

Run with `gh` unavailable and only a GitHub MCP server, against a sandbox repo seeded with an earlier filing: a PRD with `Splits into`, four issues titled `[switcher] …`, an `area:switcher` label, a milestone named `Switcher M1`, sub-issues under the PRD.

| # | Assertion |
|---|---|
| G9.1 | The Tracker line is marked partial and names each read the MCP could not do |
| G9.2 | No milestone or project is proposed that could duplicate one it could not read, unless it asks the human first |
| G10.1 | The `House conventions` line names the title prefix, the area label, the milestone naming and sub-issues |
| G10.2 | The new issues follow them (prefix, label, milestone name pattern), and PRD-to-spec links are proposed as sub-issues |

## F7 — resume after a partial creation failure (untested path)

Sandbox repo, F2 plan, approved. Inject the failure by revoking the token's write access (or deleting the target milestone) after the third issue is created; then restore it and ask the same session, and separately a fresh session given the kept proposal file, to continue.

| # | Assertion |
|---|---|
| R1.1 | The proposal file is kept and marks the created objects `created #n` |
| R1.2 | The report names what exists and what does not |
| R1.3 | On resume, step 3 is re-run and nothing that already exists is created again — verified against the API, not the session's report |
| R1.4 | Creation continues in the original dependency order and every `Blocked by` and `Design cited` names a real number |
| R1.5 | The proposal file is deleted only once every object exists |

## F8 — missing `project` scope (untested path)

Two runs on the sandbox repo with a token lacking `project`. (a) Scope absent from the start. (b) Scope removed between issue creation and the project step.

| # | Assertion |
|---|---|
| P1.1 | (a) The proposal says the project level will be skipped and names `gh auth refresh -s project`; no project is planned for creation |
| P1.2 | (b) Labels, milestones and issues exist; the project and its item-adds are reported as the missing objects; no retry loop |
| P1.3 | (b) After the scope is restored, it resumes from the project step without recreating anything |

## Re-run at full scale

The fixtures above are small by design. The real test is a draft-only run on a plan at the scale that found the gaps — larger than one issue body, with design content, non-text artifacts, provisional thresholds and stubs — graded against G1 to G10. Pass conditions are in `humans.md`, "Re-running at full scale".
