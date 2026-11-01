---
title: "ai-stuff-artifact-router — Evaluation Plan"
status: draft
confidence: medium
last_tested: 2026-10-21
scope: personal
tooling:
  - "opencode"
  - "claude-code"
tags:
  - experiment
  - evals
  - skills
  - router
owner: "@emb715"
---

# ai-stuff-artifact-router — evaluation plan

## Context / Problem

Written **before** any run, per `skills/skill-authoring/SKILL.md` Step 10 ("Select at least three representative task prompts before drafting extensive instructions. Define ground truth and verifiable correctness/safety assertions") and following the precedent in `skills/issues-to-roadmap/evals/plan.md`.

A router has two independently falsifiable properties. They are graded separately and never averaged together:

- **Discovery** — does the harness activate the skill from the `description` alone, and does it stay quiet under the two stated non-activation conditions (user already named a playbook; no playbook covers the task)?
- **Routing correctness** — given a task, is the playbook it names the right one?

A skill can pass discovery and fail routing. That combination is worse than not shipping it, because it inserts a confident wrong answer where an unaided session would have read the READMEs.

## Constants

| Setting | Value |
|---|---|
| Executor | OpenCode `general` subagent, one independent session per run, no cross-contamination |
| Model | harness default for the `general` agent, not independently verified as identical across runs — recorded as a limitation |
| Directory | the `ai-stuff` repo, `main`, baseline commit `ae9343daa894e4e9638e89b5c1a50c92cc85ce69`, identical in every run |
| Skill delivery | project-level symlink `.opencode/skills/ai-stuff-artifact-router` → `experiments/ai-stuff-artifact-router`. Never named in any prompt |
| Repeats | one run per cell. Variance is therefore **untested** — no reliability claim follows |
| Output cap | every prompt asks for a short answer plus a `SKILLS_USED:` self-report line |

The `issues-to-roadmap` symlink stays present and unchanged in **every** condition. Only the router's availability changes between conditions. This matters for case R4, where that skill is the artifact that actually covers the task.

### Conditions

| Condition | Router available | SKILL.md |
|---|---|---|
| `baseline` | no — symlink moved aside | n/a |
| `old` | yes | pre-revision snapshot, sha256 `0463a757a7e3041728c2cedae7dbaf906138ef8f6f767e81bf3e5244c16a7090` |
| `candidate` | yes | revised, hash recorded in `comparison.json` |

Baselines run **before** the revision is written. The `old` condition runs on the frozen snapshot above, before any edit. Per Step 10 the candidate is frozen before its runs; any later substantive edit invalidates the affected cells.

`old` runs only on the four cases where the planned fixes should discriminate (R4, R6, R7, R10), to attribute any delta to the fixes rather than to the skill merely existing. The other cells are not run in `old` and are reported as not executed, not as passes.

### Execution constraint (added in plan revision 2 — see below)

Every prompt in both halves ends with a read-only constraint, identical across all conditions:

> Do not edit, create, delete or commit anything, and do not run any git command that changes state.

Because it is constant across conditions it cannot confound the comparison. It has a cost, recorded as a limitation rather than hidden: a session told not to act is more likely to describe a procedure than to start one, which flatters **both** conditions on "did it name a route" and makes the baseline look more route-aware than an unconstrained session would.

The two halves then diverge, deliberately:

- **Half B (routing)** prompts add "how would you approach it, and with what procedure" — the dependent variable is *which* route is named, so both conditions must be asked for one.
- **Half A (discovery)** prompts add only "don't do it yet, just tell me how you'd start" and never say procedure, playbook, skill or vault. Activation has to come from the `description` alone; naming the artifact class in the prompt would test obedience, not discovery.

Half B therefore cannot be read as evidence about activation, and Half A cannot be read as evidence about route quality.

Half B prompts also supply the task's object **inline** (notes pasted in the prompt, the issue described in prose) and state that the scenario is hypothetical. Earlier prompts referenced objects that do not exist in this repo — issue #214, an unattached notes file, a feature branch — and sessions correctly spent the run hunting for them and then blocking on missing input, which measures nothing about routing.

### Plan revisions

**Revision 2, 2026-10-21, after six baseline runs, before any scored result was recorded.** The six runs are discarded, not graded. Three defects in revision 1, all in the method rather than the skill:

1. **No read-only constraint.** The prompts were phrased as work orders. The R2 baseline session read "this internal template repo" as *this* repo, judged it unpublishable because it redistributes nine copyrighted books in full, deleted 141,148 lines across 123 files, wrote a `LICENSE`, and committed the result as `7a67eaf` — sweeping unrelated untracked files into the commit. It also restored the parked symlink, contaminating every baseline run dispatched after it. The tracked tree was restored to `ae9343d` and verified byte-identical; the commit is kept reachable as tag `eval-accident-7a67eaf`. Root cause: dispatching open-ended prompts with write permissions into a live repo. Fixed by the constraint above.
2. **Missing objects.** See the inline-object rule above.
3. **Unverified condition integrity.** Revision 1 checked the symlink once, before the batch. Revision 2 verifies the symlink state and `git status` **after every batch**, and any run whose condition cannot be confirmed is discarded rather than graded.

The findings in defect 1 are an incidental result about this repo, not about the router, and are recorded in `results.md` under incidental findings. They do not count for or against promotion.

### Feasibility probe (not an eval case)

One throwaway probe ("retro on a finished sprint") was run before this plan existed, purely to establish that a dispatched session can discover the skill at all. It activated and self-reported `SKILLS_USED: ai-stuff-artifact-router`. It is excluded from all scoring because its ground truth was not pre-registered.

## Bias risk, stated up front

The same session writes this plan and the revision it evaluates. Two controls:

1. Ground truth for every case is quoted verbatim from the target playbook's own `README.md` (`When to use` / `Not for` / `Purpose`), decided from those files and nothing else. A case's correct answer does not depend on anything the revision says.
2. Grading a route is near-mechanical — the output either names playbook X or it does not — so author grading is lower-risk here than on prose quality. It is still weaker than the separate grader subagents used in `skills/skill-authoring/evals/comparison.json`, and is recorded as a limitation.

What this does **not** control for: case *selection*. Cases were chosen to probe known defects, so the set is adversarial toward the old skill by construction. The baseline column is the guard against reading too much into that — if the baseline also passes a case, the case proves nothing about the skill.

## Procedure / Steps

Run Half A, then Half B. Each case is one fresh session: issue the stated prompt, record whether the skill activated, record the playbook it named, and grade against the case's ground truth. Record `baseline` (no skill loaded) and `candidate` (skill loaded) for the same prompt before moving to the next case. Score with the Grading section; apply the blocking conditions before proposing any promotion.

## Half A — Discovery

Eight probes, in `trigger-evals.json`. No probe mentions the skill, a skill, or the vault's artifact layout. Activation is the harness's decision from the `description` alone; forcibly loading it would test behaviour, not activation.

| # | Probe shape | Expected |
|---|---|---|
| T1 | task that maps to a playbook domain, no playbook named | trigger |
| T2 | explicit "which playbook should I use" | trigger |
| T3 | about to start multi-step work, right procedure non-obvious | trigger |
| T4 | explicit "I need an implementation-ready spec" with no playbook named | trigger |
| T5 | user already named the playbook — stated non-activation condition | no trigger |
| T6 | vault lifecycle operation — owned by `_meta/framebook/`, not this skill | no trigger |
| T7 | repo tooling bug in an adjacent domain, shares no playbook object | no trigger |
| T8 | documentation question about the vault, not a task to route | no trigger |

Four positive, four negative, matching the balance in `skills/skill-authoring/evals/trigger-evals.json`.

Activation is inferred from two signals, both weak, agreeing or not:
1. The `SKILLS_USED:` self-report line. A model can misreport this.
2. Output fingerprints: the intent vocabulary (`ideate`/`plan`/`implement`/`review`/`capture`/`release`), the confirm-before-invoking question, the status caveat, the `playbooks/<name>/` path form.

Neither is harness instrumentation. Recorded as such.

T5–T8 failure is more serious than T1–T4 failure. A router that misses a route costs one README read; a router that fires on a vault-lifecycle operation or on a named playbook actively overrides a correct decision the user already made.

## Half B — Routing correctness

Eleven cases, in `evals.json`. Ground truth and evidence below, pre-registered.

### R1 — footgun: verb `review`, object = git diff

**Prompt:** "Say I've got a diff sitting on a feature branch in another project — six files, a new caching layer, plus its tests. Tear it apart before I merge it."

**Ground truth:** `playbooks/adversarial-code-review/`

Evidence: its `When to use` — "when you have a git diff or set of changed files that need quality validation before merge". `readiness-cycle`'s `Not for` explicitly excludes it: "A one-off review without fixes — use adversarial-code-review".

| # | Assertion | Discriminating? |
|---|---|---|
| R1.1 | Names `adversarial-code-review` | to be determined from baseline |
| R1.2 | Does not name `readiness-cycle` | to be determined |

### R2 — footgun: verb `review`/`ready`, object = existing repo + readiness question

**Prompt:** "I want to open-source an internal template repo of ours — a different repo, not this one. Is it actually ready, and I want whatever isn't ready fixed, not just a list of problems."

**Ground truth:** `playbooks/readiness-cycle/`

Evidence: its `When to use` — "an existing artifact (template, repo, package, document) and a readiness question (e.g. 'is this ready to share / release / open-source / hand off?'), and you want the full path to a verified-ready verdict or a fix plan — not just a review".

| # | Assertion | Discriminating? |
|---|---|---|
| R2.1 | Names `readiness-cycle` | to be determined |
| R2.2 | Does not stop at `adversarial-code-review` or `review-release-candidate` alone — the task asks for fixes, not a review | to be determined |

R1 and R2 are the footgun pair: same verb, different object, opposite answers. They are only meaningful read together.

### R3 — footgun: verb `break down`, object = GitHub issue

**Prompt:** "In another project I have GitHub issue #214: *'Users can't export reports to CSV. Add export with column selection and a background job for large accounts.'* Break it down into implementable work items with acceptance criteria."

**Ground truth:** `playbooks/issue-to-ready-specs/`

Evidence: its `When to use` — "when the user says 'spec this issue', 'break down issue #N', or when a GitHub issue needs to become implementable work items with acceptance criteria, file-level tasks, and test plans".

| # | Assertion | Discriminating? |
|---|---|---|
| R3.1 | Names `issue-to-ready-specs` | to be determined |
| R3.2 | Does not name `issue-to-pr` — the task asks for work items, not a merged PR | to be determined |

### R4 — the known coverage gap: verb `break down`, object = session notes, direction notes → issues

**Prompt:** "Notes from today's planning session on another project: *we're committing to self-serve billing this quarter; the PDF endpoint 500s on invoices over 200 lines; p95 on the invoice list has to stay under 400ms; still undecided whether dunning emails are in scope.* Break this down into issues in our tracker."

**Ground truth:** **no playbook covers this.** The correct output is to say so and stop.

Evidence: `issue-to-ready-specs` runs in the opposite direction — its own README says the related skill "runs in the opposite direction: session notes → issues in a tracker, where this playbook runs issue → spec documents". Its input is an existing issue; this task has none. No other playbook takes session notes to tracker issues. The artifact that does cover it is `skills/issues-to-roadmap/`, which is outside this router's declared scope (playbooks only).

| # | Assertion | Discriminating? |
|---|---|---|
| R4.1 | Does **not** route to `issue-to-ready-specs` | yes — primary safety assertion |
| R4.2 | States that no playbook covers this | yes |
| R4.3 | Observation only, not scored: does anything surface `skills/issues-to-roadmap/`, and does it come from the router or from that skill self-activating? | n/a |

R4.1 is the assertion that can block promotion. Routing notes→issues work into an issue→specs playbook sends the user into a procedure whose first step demands an input they do not have.

### R5 — chain, where a chain playbook already exists

**Prompt:** "In another project I've got GitHub issue #88, well-scoped, and I want it to end up as a merged PR — but I want to approve each phase before it moves on."

**Ground truth:** `playbooks/issue-to-pr/`, gated mode.

Evidence: its `Purpose` — "chains issue-to-ready-specs → raa → implementation-orchestration into a single full-cycle playbook that takes a GitHub issue to a merged PR", and `When to use` — "Gated (default): human review gates after specs, after the plan, and before PR merge".

| # | Assertion | Discriminating? |
|---|---|---|
| R5.1 | Names `issue-to-pr` rather than the three underlying playbooks individually | to be determined |
| R5.2 | Identifies gated mode | to be determined |

### R6 — chain, where no single playbook spans entry → exit

**Prompt:** "A brainstorm on another project threw out about forty ideas for the onboarding revamp. I need to get from that pile to something structured I can hand to planning."

**Ground truth:** a **chain of two playbooks** — `decision-making` → `product-brief`. No single playbook spans forty raw options to a structured brief.

Evidence: `decision-making`'s `Purpose` — "takes N options (typically from brainstorming...) and produces a ranked shortlist... hands off a robustness-verdicted shortlist ready to feed product-brief. Fills the brainstorming → product-brief gap". `product-brief`'s `Purpose` — "turns brainstorm output or a rough idea into a structured product brief". `brainstorming` is excluded: the ideas already exist, and its `Not for` includes "sessions where the user already knows what they want".

| # | Assertion | Discriminating? |
|---|---|---|
| R6.1 | Names both playbooks, in order | yes |
| R6.2 | Does not route to `product-brief` alone with forty unranked options as its input | yes |
| R6.3 | Does not route to `brainstorming` | to be determined |

### R7 — misfiled intent: installer build

**Prompt:** "I need to ship a CLI that installs our agent definitions into Claude Code, Cursor and OpenCode. Interactive, but it also has to work in CI."

**Ground truth:** `playbooks/agent-installer/`

Evidence: its `When to use` — "when you need to ship a CLI that: asks the user a few questions (which tool? project or global?...)... copies agent definitions into the right place per platform... works interactively (TUI) **and** non-interactively (args, CI)".

This case exists because the old manifest files `agent-installer` under intent `ideate`. The task is unambiguously build work, so an intent-first router has to cross its own category boundary to reach the right answer.

| # | Assertion | Discriminating? |
|---|---|---|
| R7.1 | Names `agent-installer` | to be determined |
| R7.2 | Does not route to `brainstorming`, `product-brief` or `decision-making` — the other `ideate` entries | to be determined |

### R8 — paradigm ambiguity

**Prompt:** "A change request came in on another project. I genuinely don't know whether this wants a spec or a plan."

**Ground truth:** `playbooks/request-triage/`

Evidence: its `When to use` — "when a request arrives and the consumer doesn't know which playbook to run. When the vault's two planning paradigms (spec vs plan) need disambiguation before work can begin".

This case also probes a self-reference hazard: `request-triage` is itself a router. A router that answers the paradigm question directly instead of naming `request-triage` has silently replaced a playbook with its own judgement.

| # | Assertion | Discriminating? |
|---|---|---|
| R8.1 | Names `request-triage` | to be determined |
| R8.2 | Does not answer the spec-vs-plan question itself in place of routing | yes |

### R9 — insufficient routing signal

**Prompt:** "I want to plan something."

**Ground truth:** **ask a clarifying question; do not route.** Intent is present (`plan`), object is absent.

Evidence: SKILL.md Step 0 names this exact string as an insufficient-signal example. The assertion is therefore testing a rule the old skill already states — it is a regression guard, not a new-fix probe.

| # | Assertion | Discriminating? |
|---|---|---|
| R9.1 | Asks what the object is before naming any playbook | to be determined |
| R9.2 | Does not name a single playbook as the answer | to be determined |

### R10 — orchestrator vs. the sub-playbook it embeds (the status-priority trap)

**Prompt:** "For another project I have a validated phased plan with file-level scope and ordered dependencies. I want a fleet of agents to implement it, and the code adversarially reviewed before anything merges."

**Ground truth:** `playbooks/implementation-orchestration/`

Evidence: its `When to use` — "when a validated plan exists (phased, file-scoped, dependency-ordered) and you need to turn it into code" — and "the mandatory review phase uses adversarial-code-review internally". `adversarial-code-review`'s README confirms the subordinate role: "when used inside implementation-orchestration, the orchestration playbook invokes this as its review phase".

This case is the direct test of defect 2. The task mentions adversarial review explicitly. `adversarial-code-review` is `validated`; `implementation-orchestration` is `draft`. The old priority rule's tier 1 (`vetted > validated > draft`, applied first) prefers the `validated` sub-playbook over the `draft` orchestrator that is supposed to invoke it. If the old skill lands on `adversarial-code-review`, tier 1 is not merely dead — it is actively wrong.

| # | Assertion | Discriminating? |
|---|---|---|
| R10.1 | Names `implementation-orchestration` as the route | yes |
| R10.2 | Treats `adversarial-code-review` as the embedded review phase, not as the route | yes |

### R11 — `Not for` exclusion

**Prompt:** "I need an implementation-ready spec for adding CSV export to the reports page of another project. One feature, one session, one implementer."

**Ground truth:** `playbooks/quick-spec/`

Evidence: `issue-to-ready-specs`'s `Not for` — "single-feature quick specs (use `quick-spec` directly)". `quick-spec`'s `When to use` — "when a feature or change needs an implementation-ready spec before development starts".

This is the only case that tests disambiguation step 3 ("if `Not for` in one candidate excludes the task, drop it") in isolation.

| # | Assertion | Discriminating? |
|---|---|---|
| R11.1 | Names `quick-spec` | to be determined |
| R11.2 | Does not name `issue-to-ready-specs` | to be determined |

## Grading

Every assertion is pass/fail against the produced text, with the deciding quote recorded in `results.md`. "Discriminating?" is filled in **after** the baseline runs, not guessed now: an assertion the baseline already satisfies proves nothing about the skill and is flagged as non-discriminating.

Scoring is per condition: `baseline` vs `old` vs `candidate`, reported as a matrix, never as a single number.

### What blocks promotion regardless of total score

1. **R4.1 fails in `candidate`** — a confidently wrong route into a playbook whose required input the user does not have.
2. **Any of T5–T8 triggers in `candidate`** — over-activation on a stated non-activation condition.
3. **`candidate` scores below `baseline` on routing correctness** — the skill is then worse than reading the READMEs, and the recommendation is against promotion no matter how clean the rest of the evidence looks.

Condition 3 is the one that matters most and the one most likely to be glossed over. It is written down here so it cannot be renegotiated after the numbers arrive.

## Failure Modes / Boundaries

- The eval grades two properties separately and never averages them; a combined score would hide the worst outcome (discovery passes, routing fails).
- The blocking conditions above are written before the numbers arrive precisely so they cannot be renegotiated after.
- Known bias risk in the design is stated in "Bias risk, stated up front" — the author of the skill is also the grader.
- Everything the eval does **not** establish is listed under "Out of scope for this eval". Treat those as unverified, not as passed.

## Out of scope for this eval

- **Variance.** One run per cell. No reliability claim.
- **Cost.** No token or duration measurement; the harness's completion notifications supply none.
- **Playbook execution.** The router surfaces `playbook.md`; whether the playbook then works is that playbook's eval, not this one.
- **Platform variance.** Only OpenCode skill discovery is exercised. The embedded manifest's portability claim (`humans.md`, "platform variance") is not tested on any other harness.
- **Manifest accuracy as a live property.** Statuses were verified by hand against the manifest on 2026-10-21 and all 14 matched. The eval does not re-derive that and does not test what happens after a future drift event.

## Round 3 — 2026-10-27, activation. Pre-registered before the fix was written

Rounds 1 and 2 agreed on one thing across 23 routing runs: **every case the skill demonstrably engaged on was routed correctly, and every failure was a case where it never engaged.** Round 3 changes the activation surface — the `description` — and nothing else. The manifest, priority rule, chain rule and boundaries are untouched.

### R3 is retired as a defective case

Before fixing anything, one of the two target failures turns out to be a bad test rather than a bug.

R3 asked: *"Break it down into implementable work items with acceptance criteria."* Pre-registered ground truth was `issue-to-ready-specs`, quoted from its README — which does claim exactly that phrasing. But:

- `issue-to-ready-specs` produces **repo spec documents** (a PRD plus N implementation specs).
- `skills/issues-to-roadmap` produces **tracker issues** with mechanical criteria, and its description claims "when asked to break work down, create issues". Its README cedes the other direction: "Not for writing repo-versioned spec documents — that is `playbooks/issue-to-ready-specs/`."

The boundary between them is **where the output lands**, and R3's prompt never says. Both artifacts are legitimate candidates, so the sessions that chose `issues-to-roadmap` three times out of three may simply have been right and the ground truth wrong.

R3 is therefore marked defective: ambiguous ground truth, no correct answer to score against. It is **not** a target for the description fix. Tuning the router to win a genuinely ambiguous case would make real sessions worse, by pulling tracker work into a repo-document playbook.

It is replaced by one disambiguated case:

**R3a** — *"In another project I have GitHub issue #214: 'Users can't export reports to CSV…'. Turn it into implementation spec documents in the repo — file-level tasks and test plans, not tracker tickets."*
Ground truth: `playbooks/issue-to-ready-specs/`. The output location is now stated, so the boundary is testable.

The underlying collision is a finding about the vault, not the router: two artifacts advertise the same verb and object, and only their READMEs disambiguate — not their descriptions, which are what the harness actually selects on. Recorded for the owner; not fixed here.

### Hypothesis

Activation keys on the **nouns** of the artifact names rather than the **situations** users describe. Evidence: T4 described `retrospective`'s situation precisely without saying "retro" and missed, while an earlier probe that said "run a retro" activated. R2 named no word in the current description's activation sentence ("planning, building, reviewing or shipping work") despite matching `readiness-cycle`'s entry exactly.

The fix rewrites the `description` to enumerate situations in the user's words, and to explicitly cede the notes-to-tracker direction it keeps losing and should lose.

### What changes

Only the `description` in frontmatter. Candidate becomes revision 4; hash recorded in `comparison.json`.

### Runs — repeats where variance is the known risk

Round 2 proved per-case results are unstable, so the activation-critical cells get repeats. 19 runs.

| Cell | Repeats | Why |
|---|---|---|
| R2 | 3 | Target failure. Clean case: the right playbook exists, nothing else claims the task |
| T4 | 3 | Target failure. Discovery miss on a situation-described task |
| R3a | 2 | New disambiguated case, never run |
| R1, R5 | 2 each | The cells that flipped between rounds 1 and 2. Measures stability, not just pass/fail |
| T1, T2, T3 | 1 each | Positive probes; guard against the rewrite breaking what worked |
| T5, T6, T7, T8 | 1 each | Negative probes. Over-activation guard |

Baseline is not rerun: it is skill-independent and already measured on identical prompts.

### Success criteria, fixed now

| # | Criterion | Consequence if missed |
|---|---|---|
| S1 | R2 passes ≥ 2/3 | Fix failed on its primary target |
| S2 | T4 triggers ≥ 2/3 | Fix failed on the discovery miss |
| S3 | **All of T5–T8 stay silent** | **Blocker.** Over-activation on a stated non-activation condition is worse than the miss being fixed |
| S4 | R1 and R5 each pass ≥ 1/2 | No regression on previously-passing routes |
| S5 | T1–T3 all trigger | No regression on working activation |
| S6 | R3a passes ≥ 1/2 | The disambiguated boundary is routable |

S3 is the one that can sink the round regardless of the others. A description broad enough to catch every situation is also broad enough to fire when the user already named a playbook, and that trade is not worth making.

Variance will still be unquantified at 2–3 repeats. The round can show a fix worked; it cannot establish reliability, and nothing here supports `vetted`.

## Results

See `results.md`, written after the runs.

## Round 7 — 2026-10-31, the QA-line routes. Pre-registered before any run

The QA line (merged 2026-10-31) added two playbooks, `acceptance-verification` and `incident-response`, a `respond` intent, a disambiguation line between `review-release-candidate` and `acceptance-verification`, and a **Covered elsewhere** row for `skills/test-authoring/`. None of it had been measured. This round measures only those additions plus two regression cells. The manifest, priority rule and chain rule are not edited for it.

### Constants for this round

| Setting | Value |
|---|---|
| Executor | Claude Code headless (`claude -p`), one fresh process per run. **Different from rounds 1 to 6**, which ran in OpenCode: results here describe Claude Code skill discovery and do not combine with earlier rounds for variance |
| Model | the harness default, recorded per run from the JSON output |
| Directory | a detached worktree of `main` at `f25c4ef`, one per condition, never the working repo |
| Skill delivery | project-level symlinks under `.claude/skills/`. Never named in any prompt |
| Competing skills, every condition | `issues-to-roadmap` and `test-authoring`, both symlinked. `test-authoring` is present because R18 and T11 are about its territory |
| SKILL.md under test | sha256 `70a072cd24cb007d875e0eb84d6b1a042657156f09664f32a422b368659342fc` (main at `f25c4ef`) |
| Suffixes | Half B: `shared_prompt_suffix` from `evals.json`, unchanged. Half A: "Don't do it yet, just tell me how you'd start." plus the same read-only sentence and `SKILLS_USED:` line |

### Cases

Ground truth is quoted from each target's own README.

**R14 — running build against its criteria.** *"On another project a PR is CI-green and deployed to a preview URL at commit a1b2c3d. Its issue lists five acceptance criteria: invites send within a minute, expired invites show an error, admins can revoke, non-admins see no invite button, and the invite list paginates at 25. Before I merge, I want to know whether the running build actually meets each one."*
Ground truth: `playbooks/acceptance-verification/`. Evidence: its `When to use`, "A branch is CI-green and about to merge, and the acceptance criteria need checking against real behavior"; its `Not for` excludes reviewing a diff.

| # | Assertion |
|---|---|
| R14.1 | Names `acceptance-verification` as the route |
| R14.2 | Does not route to `adversarial-code-review` |

**R15 — production broken by a shipped change.** *"On another project the checkout API's error rate went from 0.2% to 9% about twenty minutes after this morning's deploy. Customers are seeing failed payments right now. We have dashboards and a rollback."*
Ground truth: `playbooks/incident-response/`. Evidence: its `When to use`, "An alert, error-rate spike, or failed health check on a production system"; `Not for` excludes a failing CI check, which is `implementation-orchestration`'s fix loop.

| # | Assertion |
|---|---|
| R15.1 | Names `incident-response` as the route |
| R15.2 | Puts mitigation (rollback or equivalent) before root-cause diagnosis |
| R15.3 | Does not route to `implementation-orchestration` or `retrospective` |

**R16 — the footgun pair for R14: candidate to triage, fix and sign off.** *"Release candidate v2.3.0-rc1 on another project is tagged. The PRD has acceptance criteria for about thirty features. I need every user-facing surface inventoried against them, defects triaged by root cause, fixed in batches, re-verified and signed off before rollout."*
Ground truth: `prompts/review-release-candidate/`. Evidence: its `When to use`, "The prompt drives the full verification lifecycle: inventory → evidence capture → triage → fix batches → re-verification → sign-off"; the router's own disambiguation line gives fixing and sign-off to the prompt.

| # | Assertion |
|---|---|
| R16.1 | Names `review-release-candidate` as the route |
| R16.2 | Does not route to `acceptance-verification` alone, which observes and does not fix |

**R17 — after the incident.** *"The outage on another project last week is resolved; service has been stable for five days and the rollback held. I want to go over what happened and turn it into action items the team owns."*
Ground truth: `playbooks/retrospective/`. Evidence: its `When to use`, "after completing a significant body of work … turns them into actions"; `incident-response` runs only while users are affected and hands the causal record onward.

| # | Assertion |
|---|---|
| R17.1 | Names `retrospective` as the route (offering `knowledge-extraction` beside it, per the router's own tiebreak, still passes) |
| R17.2 | Does not route to `incident-response` |

**R18 — covered elsewhere: tests from a spec.** *"On another project the spec for bulk invite is approved: admins can paste up to 100 emails, duplicates are dropped with a count shown, and invalid addresses are listed without blocking the rest. Before anyone implements it, I want the tests written from the spec."*
Ground truth: no playbook or prompt. The router declines and names `skills/test-authoring/`, or `test-authoring` activates itself and the router stays out.

| # | Assertion |
|---|---|
| R18.1 | Does not route to any playbook or prompt (`quick-spec`, `acceptance-verification`, `implementation-orchestration` are the likely wrong ones) |
| R18.2 | Observation, not scored: does `test-authoring` self-activate, or does the router name it? |

**Discovery probes.**

| # | Probe | Expected |
|---|---|---|
| T9 | "Payments latency on our service jumped to 8 seconds right after we shipped this morning, and customers are complaining." | trigger |
| T10 | "My PR's preview build is up. I want to check it really does what the ticket says before I merge." | trigger |
| T11 | "Write unit tests for the parse_amount function in our billing module. It takes a string like '12.50' and returns cents." | **no trigger** (test-authoring or plain work, not the router) |

**Regression cells:** R1 (diff to tear apart) and T5 (playbook already named), one run each.

### Runs

| Cell | Baseline | Candidate |
|---|---|---|
| R14, R15 | 1 each | 2 each |
| R16, R17, R18 | 1 each | 1 each |
| T9, T10 | — | 2 each |
| T11, R1, T5 | — | 1 each |

19 runs. Discovery is not run on baseline: with the router absent there is nothing to activate.

### Success criteria, fixed now

| # | Criterion | Consequence if missed |
|---|---|---|
| S1 | R14 and R15 each pass ≥ 1/2 on their first assertion | The new routes are not reachable |
| S2 | R16 passes | The new disambiguation line does not hold |
| S3 | **T11 stays silent and R18.1 passes** | **Blocker.** The router would be claiming test-authoring's territory |
| S4 | T9 and T10 each trigger ≥ 1/2 | The new situations in the description do not activate |
| S5 | R1 passes and T5 stays silent | Regression |
| S6 | Candidate does not score below baseline on R14 to R18 | Blocks any status change, as in round 1 |

Variance stays unquantified at 1 to 2 repeats; nothing here supports `vetted`.

## Round 8 — 2026-10-31, request-triage retired. Pre-registered before any run

`playbooks/request-triage/` is deprecated (owner go-ahead, 2026-10-31). Its manifest row is removed, and the router now asks the paradigm question itself. A "which readiness check" table was added. SKILL.md under test: sha256 `a624c124927bd243bc40735ec073aac5f76503d7ffd5c1f7ba74ded21c52a8ef`, at `815f14e`. Constants as round 7.

**R8 is re-scored.** Its pre-registered ground truth ("names `request-triage`") no longer holds by design. R8.2 ("does not answer the spec-vs-plan question itself in place of routing") is reversed for the same reason. New ground truth, from the planning playbooks' `Paradigm` lines: ask whether one implementer in one session or a fleet in parallel will build it, and surface the spec pair (`quick-spec` / `issue-to-ready-specs`) or the plan pair (`raa` → `implementation-orchestration`) accordingly.

| # | Assertion |
|---|---|
| R8b.1 | Asks who implements (one session or a fleet), or an equivalent question, before committing to a paradigm |
| R8b.2 | Names the spec-paradigm and plan-paradigm playbooks as the candidates |
| R8b.3 | Does not route to `request-triage` |

**R19 — paradigm answered in the prompt.** *"A change request came in on another project: add SSO via SAML for enterprise accounts. Five agents will build it in parallel, and I want a plan they can split up."* Ground truth: `playbooks/raa/` (then `implementation-orchestration`). Evidence: `raa`'s `Paradigm` line, "Use the plan paradigm … when a fleet will implement in parallel".

| # | Assertion |
|---|---|
| R19.1 | Names `raa` as the route |
| R19.2 | Does not route to `quick-spec` or `request-triage` |

**Regression cells:** R14 and R16 (the readiness table sits beside their rows), one run each.

| Cell | Candidate runs |
|---|---|
| R8b | 2 |
| R19 | 1 |
| R14, R16 | 1 each |

5 runs. Success: R8b passes ≥ 1/2 on all three assertions, R19 passes, R14 and R16 still pass. A route to `request-triage` in any run is a blocker.

## Round 9 — 2026-10-31, the activation fix for Claude Code. Pre-registered before the edit

Rounds 7 and 8 missed activation in 5 of 16 Claude Code runs where the router should have loaded. Every miss had the same shape: the session said it would use the router, then followed `AGENTS.md`'s session-start step 4 ("scan `experiments/`, `prompts/`, `skills/`, `agents/`") and answered by hand. R17 also exposed a description gap: nothing names a resolved incident.

### What changes, and nothing else

1. `AGENTS.md`, session start: one new step between "Find the right procedure" and "Check for prior work". When the request is work to do rather than a vault operation, and no playbook or prompt is named, load the `ai-stuff-artifact-router` skill (or read its `SKILL.md` where skills are unsupported) instead of scanning by hand. Vault operations still go to the framebook.
2. The router's `description`: "work just finished that they want lessons or durable knowledge from" gains "or an outage or incident that is over".

The manifest, rules and examples are untouched. Hashes are recorded in `results.md`.

### Runs

Constants as round 7. Worktree at the commit that carries both edits.

| Cell | Runs | Expected |
|---|---|---|
| R1 diff to tear apart | 2 | `adversarial-code-review` |
| R17 after the incident | 2 | `retrospective` |
| R19 fleet stated | 2 | `raa` |
| T10 preview build vs ticket | 2 | trigger, `acceptance-verification` |
| T5 playbook already named | 1 | silent |
| T6 vault lifecycle operation | 1 | silent, framebook |
| T11 unit tests for a function | 1 | silent |

11 runs.

### Success criteria, fixed now

| # | Criterion | Consequence if missed |
|---|---|---|
| S1 | The router loads in ≥ 6 of the 8 positive runs | The fix did not move activation |
| S2 | Every run where it loads routes correctly | A routing regression |
| S3 | **T5, T6 and T11 stay silent** | **Blocker.** The `AGENTS.md` step must not make the router fire on named playbooks, vault operations or plain coding work |
