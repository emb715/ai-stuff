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

## Results

See `results.md`, written after the runs.
