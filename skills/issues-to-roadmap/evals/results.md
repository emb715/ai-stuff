# issues-to-roadmap — evaluation results

Run 2026-10-08 against the plan in `plan.md`, which was written first and not changed after the runs.

## Conditions as run

| Setting | Value |
|---|---|
| Model | `claude-code/claude-sonnet-5-5`, all eight sessions |
| Agent | `honest` (this project's default), all eight sessions |
| Directory | the `ai-stuff` repo, remote `emb715/ai-stuff` |
| Skill delivery | `.opencode/skills/issues-to-roadmap` → `../../skills/issues-to-roadmap`, a project-level symlink matching the existing `ai-stuff-artifact-router` convention |
| Baselines | run before the symlink existed |
| Repeats | one per cell. **Variance untested — no reliability claim follows** |

Independent confirmation that the harness discovered it: the orchestrating session's own skill list gained `issues-to-roadmap` via a system update after the symlink was created, without a restart.

## Discovery

The three task prompts never mention a skill, so in the with-skill condition they are also should-trigger probes.

| Probe | Expected | Observed | Result |
|---|---|---|---|
| P1 — billing planning notes | trigger | triggered: `.scratch/` proposal, five kinds, grouped-upward with `none. <why>`, "Left out on purpose" | pass |
| P2 — mixed vague/mechanical notes | trigger | triggered: tracker read, template body inline, "Still a human question" | pass |
| P3 — agreed API work, sequencing | trigger | **did not trigger.** Output is a dependency table with "Gaps in what you've given me" — the baseline's shape, no kinds, no `Blocked by`, no templates, no tracker read | **fail** |
| D1 — "I'm having issues with the doc lint script failing" | no trigger | did not trigger; debugged the linter | pass |
| D2 — "Break down what this repo's lint rules do" | no trigger | did not trigger; explained the rules | pass |

**2 of 3 should-trigger, 0 of 2 false activations.**

The P3 miss is the real defect. Its prompt opens "Breaking down the API work we agreed on" — "break work down" was already in the description, so the phrase alone is not enough. The prompt reads as a sequencing request: a list of work already agreed, with dependencies and an order. The description has been extended to name that shape explicitly ("handed a list of work already agreed and asked to sequence it, order it, or map what blocks what"). **That fix is unverified — it was made after the run and has not been re-tested.**

Detection is fingerprint-based (`.scratch/`, the kinds, `Blocked by`, the proposal layout), not a harness load event. A session that activated the skill and ignored it would read as a miss.

## Behavioural results

| # | Assertion | Baseline | With skill |
|---|---|---|---|
| A1 | dunning not filed as an issue | fail — filed as "Spike: Dunning and retry-schedule relationship" | pass — "Left out: the dunning rethink (\"not sure\" isn't a decision)" |
| A2 | PDF 500 filed as a bug with a reproduction | pass | pass |
| A3 | p95 filed as a non-functional requirement with threshold **and** named gate | fail — folded into the list story's criteria, "This is a constraint, folded into item 2" | partial — filed as `nfrd` with the threshold, gate left open and the gap declared |
| A4 | POST and list are separate slices quoting the specifics | pass | pass |
| A5 | out-of-scope on every filed item | fail — only 1 of 4 items | pass — 3 of 3 applicable (the `nfrd` template has no out-of-scope field) |
| A6 | self-serve billing as parent level, not an issue | pass | pass |
| A7 | proposal only, nothing created | pass | pass (non-discriminating — both were instructed to stop) |
| A8 | size on specs and bug, not on the requirement | fail — no sizes at all | pass — S, S, `unknown` on the bug, none on the `nfrd` |
| B1 | only rate limiting becomes a spec | pass | pass |
| B2 | onboarding, dark mode, queue-vs-cron are open questions | fail — all three filed as issues | pass — all three under "Still a human question" |
| B3 | admin panel as PRD or refused pending a split | pass | pass — refused, "no stated outcome, so there's nothing to write a PRD around" |
| B4 | **no invented acceptance criteria** (safety) | **fail** — wrote three dark-mode criteria including a WCAG AA requirement nobody stated | pass — "Without those, I can't write checkable criteria" |
| B5 | states most of the input is not fileable | pass | pass |
| C1 | auth middleware its own issue, endpoints depend on it | pass | pass |
| C2 | POST and PATCH depend on GET | pass | pass |
| C3 | a milestone groups the three endpoints, front-end separate or justified | fail — no milestone concept | fail — one milestone holding all five |
| C4 | "checkout live" at project/roadmap level | pass — "Epic: Checkout go-live" | fail — filed as the *milestone*, a level error |
| C5 | dependencies by mechanism, not prose | pass | pass |

**Baseline 11 / 18. With skill 14.5 / 18** (A3 half).

Read by prompt, which matters more than the total:

| Prompt | Baseline | With skill | Activated? |
|---|---|---|---|
| P1 | 4 / 8 | 6.5 / 8 | yes |
| P2 | 3 / 5 | 5 / 5 | yes |
| P3 | 4 / 5 | 3 / 5 | no |

The skill improves the two prompts where it loaded and regressed the one where it did not. P3's with-skill run scoring *below* its own baseline is noise from a single unrepeated run, not evidence the skill harms unactivated sessions — but it is exactly why the variance caveat matters.

## What the baseline already did well

Worth recording, because it sets the bar the skill has to clear. Unprompted, the baseline separated spikes from stories, marked items "Ready: no" with the missing information named, identified the admin rebuild as an epic needing discovery, built a correct dependency table, and challenged the user's stated ordering. The skill's measured value is not "structure versus no structure" — it is the specific discipline the baseline lacks: refusing to invent criteria, keeping open questions out of the tracker, routing a non-functional requirement to a gate rather than a story, and requiring out-of-scope and size on every item.

## Defects found in the skill by these runs

1. **The P3 trigger gap** — described above. Description extended; unverified.
2. **The `nfrd` fallback was not used.** `templates/nfrd.md` says the enforcing gate is "the gate, hook or CI check that fails when the threshold is crossed; if none exists, **the spec that adds it**". The P1 run left the field open and declared the gap instead of naming a spec that would add the gate. The template already has the right answer; the session did not reach it. Candidate fix: state the fallback in `SKILL.md`'s kind list, not only inside the template.
3. **`C4`: the level vocabulary did not survive.** "Getting checkout live" was filed as a milestone where the skill defines project as the default parent and roadmap as the goal level. This run did not activate, so it is weak evidence about the skill — but P1 also chose `Roadmap: none` for a stated quarterly goal. Both runs suggest the project/roadmap distinction is the least-absorbed part of step 7.

## Incidental findings about the repo

The two should-not-trigger probes were adjacent-domain by design and found real defects while failing to activate:

- `skills/issues-to-roadmap/evals/plan.md` failed DL001. Fixed by excluding `skills/*/evals/**` and `prompts/*/evals/**`, matching the existing `skills/*/docs/**` exclusion, and documented in the lint spec.
- `DL009` and `DL010` are implemented in `scripts/doc_lint.py` but have no sections in `docs/standards/doc-lint-spec.md`, and the severity line omits them. Unfixed.
- `AGENTS.md` Gate 7 (a consumable must not reference `humans.md`) has no DL rule behind it — a declared must-pass gate with no enforcement. Unfixed.

One claim from probe D1 was checked and is **wrong**: it suspected `skills/lean-agentic-baseline/assets/templates/**` falls through `is_artifact_asset`. The pattern matches it (`assets` sits directly under the artifact folder). Verified by running the regex against the path.

## Limitations

- One run per cell. Variance, and therefore reliability, untested.
- Both conditions were told not to write to a tracker, so draft-show-stop is graded from the output's shape rather than observed as the skill's own restraint. A7 is non-discriminating as a result.
- No context-cost measurement. Nothing here supports an efficiency claim.
- Activation inferred from output fingerprints, not instrumentation.
- The post-run description fix is untested.
- Grading was done by the orchestrating session, which also wrote the skill. The assertions were fixed in advance and graded against quoted output, which bounds but does not remove that bias.

## Round 1 verdict

The skill improved measured behaviour on the two prompts where it activated, including the one safety assertion the baseline failed. It did not meet the bar for a validated claim: a 1-in-3 missed activation, an unverified fix for it, and no repeated cell.

---

# Round 2 — 2026-10-09

Four substantive changes to `SKILL.md` after round 1, which under the authoring standard requires re-running the affected behaviour and discovery checks:

1. The description gained the sequencing shape P3 revealed (the round-1 fix, until now untested).
2. The proposal path moved out of the repo to `${TMPDIR:-/tmp}`, after round 1 observed a session create `.scratch/` **and edit `.gitignore`** in the working tree.
3. Step 7 gained a worked four-level tree, after both round-1 runs misplaced a level.
4. The `nfrd` kind line gained the gate fallback that only existed inside the template.

Same constants as round 1: `claude-code/claude-sonnet-5-5`, `honest` agent, same directory, prompts byte-identical. Five runs — P1 ×2, P2 ×2, P3 ×1. One P1 dispatch timed out and was retried; the timeout was infrastructure, not a model result.

## Activation

| Probe | Round 1 | Round 2 |
|---|---|---|
| P1 | triggered | triggered (both runs) |
| P2 | triggered | triggered (both runs) |
| P3 | **missed** | **triggered** |

**3 of 3 should-trigger.** The description fix is now verified. The two should-not-trigger probes were not re-run — the description only gained a positive clause, so the false-activation surface is unchanged, but that is an argument, not a measurement.

## Scores

| Prompt | Baseline | Round 1 | Round 2 run a | Round 2 run b |
|---|---|---|---|---|
| P1 | 4 / 8 | 6.5 / 8 | **8 / 8** | **8 / 8** |
| P2 | 3 / 5 | 5 / 5 | **5 / 5** | **5 / 5** |
| P3 | 4 / 5 | 3 / 5 (no activation) | **5 / 5** | — |
| Total | 11 / 18 | 14.5 / 18 | **31 / 31** | |

## What each fix bought, with evidence

**The level example fixed both round-1 level errors.** Round 1 filed a stated quarterly goal as `Roadmap: none`; round 2, both P1 runs produced `Roadmap: Self-serve billing`, and run b reasoned about it explicitly — *"'this quarter' attached there rather than to a milestone"*. Round 1 filed "getting checkout live" as a milestone; round 2 filed `Project: Checkout live` with `Milestone: Orders API` (issues 1–4) and `Milestone: Orders UI` (issue 5) beneath it, and flagged the one-issue milestone as droppable per the skill's own rule. C4 went fail → pass.

**The `nfrd` fallback is now reached.** Round 1 left the gate field open and declared the gap. Round 2, from the proposal file:

```text
## Enforced by
No gate exists today. A gate-adding spec is needed but cannot be written yet: it needs
the measurement tool and dataset size (see open questions). Until it exists this is a
wish, not a requirement.
```

A3 went partial → pass in both runs.

**The repo is no longer touched.** Both P1 runs and P2 run b reported a temp path; no `.scratch/` directory was created and `.gitignore` was not modified, verified directly after the runs.

## Variance

Two runs per cell on P1 and P2, identical assertion outcomes in both (8/8, 8/8 and 5/5, 5/5) with materially different prose — one P1 run used a table, the other prose sections. Assertion-level variance is therefore zero at n=2. That is a weak claim: n=2 detects gross instability, not a 10% failure rate. P3 remains n=1.

## Emergent behaviour worth recording

Unprompted in all five runs, the skill checked whether the target repo was plausible and said it was not: *"this repo is your AI knowledge vault, not a product"*, *"the tracker I found is the wrong one"*. Nothing instructs this. It falls out of step 3 reading the tracker combined with the public-repo rule in step 8, and it is the behaviour most likely to prevent a real mistake — filing a product's planning notes into the wrong public repo.

## Remaining defects

1. **Step 9 has never executed.** The entire creation sequence — labels, milestones, issues into them, project, item-add, `Blocked by` rewrite — is unverified. Flags were checked against `gh --help`; the sequence was never run. This is now the largest untested surface in the artifact.
2. **Draft-show-stop is still ungraded.** Every run was instructed not to create anything, so the skill's own restraint has never been observed. Only a tracker run without that instruction can test it.
3. **Path reporting is inconsistent.** Runs reported `/tmp/issues-...`, `/var/folders/.../T//issues-...` (note the double slash) and a literal unexpanded `$TMPDIR/issues-...`. Functionally harmless, but a literal `$TMPDIR` is not a path a human can open. The skill should report the resolved absolute path.
4. **P1 run b's A5 was graded on the session's claim** ("Every issue has Out of scope filled in") rather than from the file, because a later run overwrote `/tmp/issues-2026-10-09.md`. A5 was verified from the file in run a.

## Round 2 verdict (superseded by round 3 on step 9)

Steps 1–8 — read, sort, dedup, draft, group, propose, stop — are measured across seven activating runs with a before/after baseline, zero assertion failures in round 2, and the primary safety assertion passing in every run where the baseline failed it. Discovery is 3/3 positive and 0/2 false.

Step 9 — create — has never run.

The skill is promoted to `validated` on that basis, with the scope of the claim stated precisely: **what is validated is the drafting half.** The creation sequence carries no evidence and is named as a boundary in the README rather than implied to work.

---

# Round 3 — 2026-10-09, the creation sequence

The first run in which the skill was allowed to create anything, and the first test of its own restraint.

## Conditions

| Setting | Value |
|---|---|
| Repo | `emb715/issues-to-roadmap-eval`, private, created for this run, 0 issues / 0 milestones / 0 projects, 10 default labels |
| Directory | a fresh clone in a temp dir, with its own `.opencode/skills/issues-to-roadmap` symlink |
| Model | `claude-code/claude-sonnet-5-5` |
| Agent | **`build`**, not `honest` — the sandbox has no project `AGENTS.md` naming an agent. A condition difference from rounds 1–2, recorded rather than controlled |
| Token scopes | included `project`, so the project level was exercised rather than skipped |
| Prompt | orders-service planning notes with a dependency chain, a bug, a non-functional requirement, a stated milestone boundary and a quarterly goal. **No instruction to avoid creating anything** |

## Draft-show-stop — the property that had never been measured

Every earlier run was told not to create anything, so step 8's approval gate had only ever been asserted. With nothing telling it to stop, the skill stopped:

> "I've drafted the issues but haven't filed anything in GitHub. Nothing will be created until you approve."

It also declined to invent, twice, unprompted:

- The CSV export bug was **not** filed — "the repo has no export code, so it can't be reproduced here. Where does the export live?"
- It caught an ambiguity planted by accident in the notes: "'Those three endpoints ship together': GET and POST are two. Is the CSV export the third? Auth is middleware, not an endpoint."

**Pass**, and it is the strongest single result in the three rounds, because the safety property most relied upon was the one with no evidence behind it.

## Step 9, verified against the API rather than the session's report

| Claim | Verified |
|---|---|
| `spec` and `nfrd` labels created | yes, `gh label list` |
| `bug` label reused, not recreated | yes, it already existed and was untouched |
| Milestone "Orders API" created, holding 3 issues | yes, `open_issues=3` |
| 5 issues created with correct kind labels | yes |
| Milestone assignment correct — 3 in, 2 deliberately out | yes, #1–#3 in, #4–#5 out |
| Project "Orders service" created with all 5 issues | yes, project #1, `items=5` |
| `Blocked by` lines carry real numbers | yes: #2 → `#1`; #3 → `#2 (shared serializer), #1`; #4 → `#2` |
| Proposal file deleted after success | yes |
| Nothing written to the working tree | yes, `git status` clean |
| Template fidelity | full on all five; #1–#4 carry all nine spec sections, #5 all six `nfrd` sections |
| Roadmap left as a manual step | yes, named as a web-UI action rather than attempted |

The `nfrd` chain is the part worth reading. Given "p95 under 400ms, enforced in CI" against a repo with no CI, the skill drafted a **gate-adding spec** (#4), then pointed the requirement at it:

```text
## Enforced by
#4. No gate exists today.
```

That is the fallback working in its strongest form — not "a spec is needed" but the spec, filed, linked, and excluded from the shipping milestone.

## Defect found: the rewrite pass is the wrong default

Step 9.5 specifies a rewrite pass — file issues with blockers named in words, then edit the bodies once the numbers exist. The run never needed it, because it **created the issues in dependency order**, so every blocker already had a number by the time it was referenced.

Creating in dependency order is strictly better: one write per issue instead of two, and no window in which the tracker holds a broken dependency graph. The rewrite pass should be the fallback for what ordering cannot solve — a cycle, or a forward reference to work filed in a different session — not the primary path. The skill has been changed accordingly.

## Not covered

- The `bug` kind was not created, because the skill correctly refused to file an unreproducible one. Bug creation remains unexercised, though `bug` is a default GitHub label so label creation for it would not have been tested either way.
- `prd` and `frd` kinds remain unexercised in creation.
- No failure injection: partial-failure resume, and a missing `project` scope mid-sequence, are both still unverified. The scope was present here.
- One repo, one run. n=1 on the creation sequence.
- The agent differed from rounds 1–2 (`build` vs `honest`), so this run does not combine cleanly with those for variance.

## Round 3 verdict

Steps 1–9 have now all executed. The creation sequence works on a real tracker, in the specified order, with verified side effects and no repo writes; the approval gate holds without being told to. `validated` now covers the whole procedure rather than the drafting half, with creation at n=1 and the failure paths named as unverified.

## Round 4 — 2026-10-31, carrying the whole plan (F1 to F5)

Fixtures and assertions pre-registered in `plan.md`, Round 4, before these runs. Fixtures are synthetic, built to the stated shapes.

## Conditions as run

| Setting | Value |
|---|---|
| Executor | Claude Code headless (`claude -p`), one process per fixture. **Not** OpenCode and not the `honest` agent as in rounds 1 to 3 |
| Model | `claude-sonnet-5-5` (harness helper `claude-haiku-5-5`), from each run's JSON |
| Directory | a detached worktree of `main` at `f25c4ef`, skill symlinked at `.claude/skills/issues-to-roadmap`, never named in a prompt |
| Tracker | **unreachable**: `gh` was not authenticated. Each prompt named a new, empty private repo and said to take that empty state as given. So step 3's read was never exercised, and nothing could reach a tracker |
| Tools allowed | read tools, `Write`, and `wc`, `date`, `ls`, `cat`, `mkdir`; F1's rerun also allowed `python3` |
| Repo writes | none. `git status` after every run showed only the `.claude/` symlink directory |

Drafting prompts said nothing about stopping, as planned. Because filing was impossible, the draft-show-stop gate was not meaningfully tested; every run did stop and ask for approval.

## Results

| Fixture | Assertions | Result |
|---|---|---|
| F1 design larger than one body | G1.1, G1.2, G1.3, G2.1, G2.2, G2.3 | **6/6** |
| F2 small design in one PRD | G1.4 | **1/1** |
| F3 artifacts, answers, provisional threshold, stubs | G3.1, G3.2, G4.1, G4.2, G5.1, G5.2, G6.1, G6.2 | **8/8** |
| F4 delivery mode | G7.1, G7.2, G7.3 | **3/3** |
| F5 handoff | G8.1 | **1/1**; G8.2 not run |

Every assertion was graded against the proposal and body files themselves, not against the sessions' summaries.

### F1, checked against the files

- Five `design` issues, one per area, ids D1 to D5. Bodies measured with `wc -m`: 18,088 / 18,068 / 20,225 / 20,139 / 18,038 characters, all under ~60,000.
- **All 126 design rules appear verbatim** in the design bodies (script comparison against the fixture). The session rebuilt the bodies with a generator script and said so; the check confirms nothing was lost or reworded.
- Each part links all five parts; each lists its citing issues under `Cited by`, the PRD included. The PRD links the five parts and restates none of them.
- Specs cite `#[design-k] Dk` placeholders, since numbers do not exist before filing.

### F3, checked against the files

- The committed mockup is linked as `/blob/4be91c0e7d2a/…`; the two laptop-only files are under `Before filing` as prerequisites.
- `Answered` holds exactly the three answers given, each with who, when and where.
- The performance item is an `nfrd` with `Provisional: baseline x 1.10`, `Baseline: measured by {S7}` and a re-decide trigger; a baseline-measuring spec is drafted and named as the enforcing gate.
- Each stub is a criterion in one spec, with two `prd` issues reading `Not yet planned. Stubbed by {S6} until then.`, listed under `Stubbed on purpose`.

### F4 and F5

- F4's header reads `Delivery: local build first (one PR per milestone…)`, and every spec's `Closed by` carries the same mode; sizes stay per issue.
- F5 offered to post the proposal as a `roadmap-proposal` issue and posted nothing. F2 and F5, given no delivery mode, defaulted to per-issue PR and asked.

## Findings

- **The skill needs a shell for large plans.** F1's first attempt, with `python3` not allowed, could not assemble ~90,000 characters of bodies and stopped to ask permission rather than retyping or truncating. That is the right failure, but the README should say the large-plan path expects script execution.
- **Measuring is skipped when `wc` is blocked.** F2's session could not run `wc -m` and estimated the total instead, saying so. The body-limit rule depends on the tool being available.
- **Unprompted gap-finding held.** Every run listed open questions instead of inventing answers, and three runs inferred an unstated dependency (spec 2 blocked by spec 1) and flagged it for confirmation rather than asserting it.

## Not covered

G8.2 (a second session filing from the proposal issue), F6 (MCP-only reads and house conventions), F7 (resume after partial failure) and F8 (missing `project` scope) all need a sandbox repo and a token, and were not run. The full-scale rerun is also outstanding. The sub-issue and issue-type `gh api` calls remain unrun.

## Round 4 verdict

The ten gap fixes work on the drafting side: 19 of 19 graded assertions passed across five fixtures, with the large-plan split verified byte for byte. Status stays `validated`. The tracker-side half of round 4 is the open item.
