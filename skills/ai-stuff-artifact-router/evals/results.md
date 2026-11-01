# ai-stuff-artifact-router — evaluation results

Round 1, 2026-10-21. Written after the runs. The plan, including every case's ground truth, was pre-registered in `plan.md` and committed as `c93d472` before the candidate existed.

## Conditions as run

| Condition | Router | SKILL.md sha256 | Cases run |
|---|---|---|---|
| `baseline` | symlink moved aside | n/a | all 11 routing |
| `old` | discovered via symlink | `0463a757…` | R4, R6, R7, R10 |
| `candidate` | discovered via symlink | `95fa5a46…` | all 11 routing, 8 discovery |

Executor: OpenCode `general` subagent, one independent session per run, model = harness default. The skill was never named in any prompt; activation was always the harness's decision. Condition integrity (symlink state, `git status`) was verified before and after every batch.

The candidate was frozen at `95fa5a46…` before its first run and was still at that hash after the last one.

## Discovery — 7 of 8

| Probe | Expected | Observed | Evidence |
|---|---|---|---|
| T1 feature request → shipped | trigger | **trigger** | "Routing via the artifact router (playbooks only) … **Entry:** a feature request against a real codebase. **Exit:** shipped." |
| T2 "which playbook" | trigger | **trigger** | "Routing via the vault's artifact-router (playbooks-only)." |
| T3 multi-step change | trigger | **trigger** | "That router indexes on two things: the **entry** … and the **exit**" — then stopped and asked for the object |
| T4 capture Q3 learnings | trigger | **miss** | Went to `_meta/framebook/` and `experiments/`; `playbooks/retrospective/` never named |
| T5 playbook already named | silent | **silent** | Went straight to `quick-spec`; `SKILLS_USED: none` |
| T6 promote a skill | silent | **silent** | Routed to `_meta/framebook/promote-artifact/` |
| T7 lint rule bug | silent | **silent** | Read-only debugging plan, no routing |
| T8 paradigm question | silent | **silent** | Offered to read the two playbooks and report; no route issued |

**Zero false activations**, including on the two conditions where over-activation is most expensive: a user who already named the playbook (T5) and a vault lifecycle operation (T6). That is the single most reassuring result in this round, because over-activation overrides a decision the user already made correctly.

**The miss is informative.** T4 describes `retrospective`'s domain precisely — completed body of work, capture lessons before the next thing starts — and never uses the word "retro". The session went to the framebook instead. An earlier throwaway probe that *did* say "run a retro" activated the skill. One run each, so this is a hypothesis, not a measurement: activation looks dependent on the task reusing the playbook's own vocabulary rather than describing its situation. The revised `description` lists "retrospective" as a noun; it does not describe the *situation* that calls for one.

## Routing correctness — candidate 8/11 cases, baseline 3/11

Assertion level: baseline 15/23, candidate 20/23. Only **5 of 23 assertions discriminate** between conditions at all; all 5 favour the candidate, and nothing regressed.

| Case | Ground truth | baseline | old | candidate |
|---|---|---|---|---|
| R1 review-verb / diff-object | `adversarial-code-review` | ✗ no playbook | — | **✓** |
| R2 review-verb / artifact-readiness | `readiness-cycle` | ✗ no playbook | — | **✗ no playbook** |
| R3 breakdown-verb / issue-object | `issue-to-ready-specs` | ✗ → `issues-to-roadmap` | — | **✗ → `issues-to-roadmap`** |
| R4 coverage gap, notes → issues | no playbook covers this | partial | partial | **partial** |
| R5 chain playbook exists | `issue-to-pr` gated | ✗ no playbook | — | **✓** |
| R6 chain, no single playbook spans | `decision-making` → `product-brief` | ✗ → `issues-to-roadmap` | ✗ → `issues-to-roadmap` | **✓** |
| R7 misfiled intent, installer | `agent-installer` | ✗ → `tools/change-impact` | ✓ (not via router) | **✓** |
| R8 paradigm ambiguity | `request-triage` | ✓ | — | **✓** |
| R9 insufficient signal | ask, don't route | ✓ | — | **✓** |
| R10 containment / status trap | `implementation-orchestration` | ✗ no playbook | ✓ | **✓** |
| R11 `Not for` exclusion | `quick-spec` | ✓ | — | **✓** |

### The four cases that carry the result

**R6 is the clearest win, and the only case where the candidate beats both other conditions.** Baseline and `old` both routed forty raw brainstorm ideas to `skills/issues-to-roadmap`. The candidate answered:

> "Route: a two-playbook sequence — no single playbook spans forty raw ideas to a planning handoff. 1. `playbooks/decision-making/` … Forty unranked ideas are *not* converged, so this convergence step comes first. 2. Re-enter at `playbooks/product-brief/` with that shortlist."

`SKILLS_USED: ai-stuff-artifact-router`. The chain rule produced an answer neither other condition could express, because neither had a way to say "the answer is two playbooks in order".

**R7 confirms the intent audit was worth doing, and complicates the attribution.** The baseline missed `agent-installer` entirely and proposed copying the `tools/change-impact` pattern instead — the playbook that exists for exactly this task was invisible to an unaided session. The candidate found it and justified it on entry/exit grounds. But the `old` snapshot *also* found it, with `SKILLS_USED: none` — by reading the repo, not by routing. So the manifest's `ideate` misfiling did not demonstrably block the route; the honest claim is that the candidate routes correctly and states *why*, not that the old manifest caused a miss here.

**R10 did not fail the way the plan predicted, and the prediction is worth retracting precisely.** The plan expected the old status-first priority rule to prefer `validated` `adversarial-code-review` over `draft` `implementation-orchestration`. It did not: the `old` run routed to `implementation-orchestration` with `adversarial-code-review` "at the review gate". Tier 1 of the old priority rule is therefore **dead, not actively harmful** — at n=1. The rule change is justified as specification hygiene (a tier that cannot discriminate on 10 of 14 playbooks is not a rule), not by an observed failure it prevented.

**R4 failed in all three conditions, and the failure mode is not the predicted one.** The prediction was that the router would either decline or wrongly route to `issue-to-ready-specs`. Observed, three times out of three: the router never activated at all. `skills/issues-to-roadmap` self-activated and handled the task correctly, every time, including in the `candidate` run where SKILL.md now names this exact shape in its coverage-gap list. R4.1 (do not wrongly route) passed in all conditions; R4.2 (say "no playbook covers this") failed in all conditions.

This matters for the scope question. The concrete cost of the playbooks-only boundary is **smaller than it looked on paper**: in a session where `issues-to-roadmap` is installed, that skill wins activation on notes→issues tasks and no wrong route occurs. The boundary's cost is not a misroute; it is that the router is silent and contributes nothing, and the correct outcome depends entirely on another skill being installed and winning. The declared decline behaviour was never exercised, so the coverage-gap section added in this revision is **untested text**.

### Where the candidate lost

- **R2 — `readiness-cycle` not found.** The candidate improvised an open-source readiness checklist and wrote "I'd check this vault for a matching release-readiness playbook before improvising" — then didn't. The router did not activate. `readiness-cycle`'s entry ("an existing artifact and a readiness question") matches the task exactly. This is a genuine failure of the half of the footgun pair that was supposed to be the harder one, and R1/R2 were only meaningful read together: the pair scored 1/2.
- **R3 — activation lost to `issues-to-roadmap`.** "Break it down" plus "issue" pulled the other skill, whose description says "when asked to break work down". Both skills legitimately claim adjacent territory; the other one's description is more specific about the verb.

Both losses are activation failures, not reasoning failures. In all four candidate cases where the router demonstrably activated (R6, R7, R8, R11 self-reported it; R1, R5, R10 showed manifest-specific reasoning while self-reporting `none`), the route was correct. Every candidate failure is a case where the skill never got to reason.

**That is the finding with the most consequence for the next round:** the routing rules are in better shape than the activation is. Further work on the manifest will not fix R2 or R3.

## The embedded-manifest decision, re-tested on evidence

`humans.md` rejected a generated index for three reasons. Reason 3 — "drift is cheap to fix" — was nominated as newly testable because the vault has grown since 2026-08-04. Checked against git:

| Check | Result |
|---|---|
| Playbook folders now | 14 |
| Playbook folders added since 2026-08-04 | **0** |
| Playbook `status:` values changed since 2026-08-04 | **0** |
| Commits touching `playbooks/` since 2026-08-04 | 3, all to `playbook.md` bodies or a cross-link line |
| Manifest statuses matching reality on 2026-10-21 | 14 of 14 |
| Artifacts added elsewhere since 2026-08-04 | 4 skills (`lean-agentic-baseline`, `issues-to-roadmap`, `design-system-first-styles`, `liteparse`) |

**Reason 3 did not hold, and it did not fail. It was never exercised.** The manifest is accurate after 78 days because nothing in its scope changed — not because drift happened and was cheaply repaired. Zero drift events means zero data on repair cost. Anyone citing "the manifest stayed accurate for 78 days" as support for the hand-maintained design is citing the absence of a test as a passed test.

The vault *did* grow by four artifacts in that window — all of them skills, all outside the manifest's scope. The growth that happened produced no manifest drift and one **scope** defect instead: `issues-to-roadmap` arrived and now contests activation on two of eleven routing cases (R3, R4). The risk that materialised in 78 days was not staleness inside the boundary; it was competition outside it.

Reasons 1 (platform variance) and 2 (trigger summarisation) remain untested and untestable by this round — only OpenCode discovery was exercised, and no generated alternative was built to compare trigger text against.

## Round 1b — 2026-10-23, the experiments boundary

Owner instruction: "nothing from experiments should be routed." Candidate revision 2, sha256 `c4a0f976…` (revision 1 was `95fa5a46…`).

The rule was already true of the manifest — all 14 rows are `playbooks/` — but unstated, and two facts made that a live gap:

- `experiments/arch-design-pipeline/` carries a `playbook.md`, a `playbook` tag, and a PRD → RFD → NRFD → tech-spec purpose that collides with the `plan` intent. It is indexed in `experiments/README.md`, so one read finds it.
- `SKILL.md` instructed the agent to treat the manifest as a cache and verify against each playbook's README — correct for checking a listed row, but an unbounded discovery licence as written.

The fix states the boundary in three places and closes the mechanism: verification can confirm or drop a row, never add one.

**R12, one run, candidate revision 2 — pass on both assertions.** Prompt paraphrased the experiment's own purpose ("a PRD, then a review-gated technical spec"). Response:

> "No single vault playbook spans 'rough feature → PRD → review-gated spec.' The shortest sequence: 1. `playbooks/product-brief/` … 2. Re-enter at `playbooks/quick-spec/` … One caveat: an experiment in this vault describes a PRD→RFD→NRFD→spec pipeline matching your wording. It's not routable — untested, unsanitized, outside `playbooks/`."

`SKILLS_USED: ai-stuff-artifact-router`. It identified the colliding experiment by name-shape, declined it with the stated reason, and answered with a valid two-playbook sequence instead — the chain rule and the new boundary working together. n=1.

**Not rerun:** R1–R11 were run against revision 1 and were not repeated on revision 2. Per skill-authoring Step 10 a substantive change invalidates affected cells; the edit adds a boundary and a discovery restriction without altering any listed row's entry, exit or priority order, so the 11 earlier routes are reported as **run against revision 1**, not as revision-2 results. A full rerun is the honest way to restore that, and it has not been done.

This also retires one speculative argument in favour of the hand-maintained manifest with a concrete one: a generator scanning for `playbook.md` would have picked up `arch-design-pipeline` and routed real tasks into a draft experiment.

## Round 2 — 2026-10-26, the full rerun against the shipped file

Round 1's headline numbers were measured against candidate revision 1 (`95fa5a46…`), but the experiments-boundary edit shipped revision 2 (`c4a0f976…`). Only R12 had ever run against what was on disk. This round reruns R1–R11 on revision 2, identical prompts, so the recorded evidence describes the artifact the vault actually carries.

**It did not reproduce.**

| Case | Ground truth | baseline | rev 1 | **rev 2** |
|---|---|---|---|---|
| R1 | `adversarial-code-review` | ✗ | ✓ | **✗ regressed** |
| R2 | `readiness-cycle` | ✗ | ✗ | ✗ |
| R3 | `issue-to-ready-specs` | ✗ | ✗ | ✗ |
| R4 | decline | partial | partial | partial |
| R5 | `issue-to-pr` gated | ✗ | ✓ | **✗ regressed** |
| R6 | `decision-making` → `product-brief` | ✗ | ✓ | ✓ |
| R7 | `agent-installer` | ✗ | ✓ | ✓ |
| R8 | `request-triage` | ✓ | ✓ | ✓ |
| R9 | ask, don't route | ✓ | ✓ | ✓ |
| R10 | `implementation-orchestration` | ✗ | ✓ | ✓ |
| R11 | `quick-spec` | ✓ | ✓ | ✓ |
| R12 | never `experiments/` | — | — | ✓ |

| Measure | baseline | rev 1 | **rev 2 (shipped)** |
|---|---|---|---|
| Cases fully correct | 3 / 11 | 8 / 11 | **6 / 11** |
| Assertions passed | 15 / 23 | 20 / 23 | **18 / 23** |
| Regressions vs baseline | — | 0 | **0** |

### What the two regressions were, and what they were not

Neither failure mentions the experiments boundary, declines on scope grounds, or cites the tightened verification rule. Both are plain non-engagement:

- **R1** — "Code review in another repo — outside this vault's framebook, so no vault procedure applies," then a generic cache-review checklist routed to `ndv-*` specialists. That is a misread about *other repositories*, not about `experiments/`. `adversarial-code-review` explicitly works on "any git repository".
- **R5** — a six-step gated PR flow with no vault playbook named at all. `SKILLS_USED: none`.

The tempting hypothesis was that revision 2's three blocks of "never route / decline / do not widen" language chilled routing into over-declining. The transcripts do not support it: a chilled router would decline *citing the boundary*, and neither did. Both look like the failure mode already identified as dominant in round 1 — the skill never got invited, so it never reasoned.

Causation cannot be separated from variance at n=1 per cell either way. What can be stated: **per-case results are not stable across runs**, and round 1 already contained a hint of this that was recorded and then under-weighted — R7 passed in the `old` condition and failed in `baseline` on the identical prompt.

### Consequence for what this artifact may claim

The honest summary of routing correctness is **6–8 of 11 across two runs, with activation as the unstable element**, not the single best figure. The 8/11 from round 1 is a revision-1 measurement and is not reproducible on demand.

This changes the lifecycle ceiling, not the lifecycle floor:

- `validated` is "tested at least once with documented result" (root `README.md`). Satisfied, now against the shipped hash, twice over, with the baseline beaten on identical prompts in both runs and zero regressions against it in either.
- `vetted` requires "repeatable". **Explicitly contradicted by this round.** Two runs of the same eleven cases on near-identical files disagreed on two of them. No path to `vetted` exists until activation is made reliable and variance is measured with repeats per cell.

Every case the skill demonstrably engaged on was routed correctly, in both runs. That has now held across 23 routing runs and remains the most durable finding: the routing rules work; being reached is the problem.

## Round 3 — 2026-10-27, the activation fix

Candidate revision 4, `7503824d…`. **Only the `description` changed** — manifest, priority rule, chain rule and boundaries untouched. Plan and success criteria pre-registered and committed (`63677ca`) before the rewrite was written.

Hypothesis: activation keys on the **nouns of artifact names** rather than the **situations users describe**. The old description listed "release readiness, retrospective" as a noun catalogue; the rewrite enumerates situations in the user's own words ("an existing repo, template, package or document they want checked and fixed before sharing, releasing, handing off or open-sourcing it"), and explicitly cedes the notes-to-tracker direction the skill kept losing and should lose.

19 runs, repeats on the activation-critical cells because round 2 proved per-case results unstable.

| # | Criterion | Result | |
|---|---|---|---|
| S1 | R2 passes ≥ 2/3 | **3 / 3** | met |
| S2 | T4 triggers ≥ 2/3 | **1 / 3** clear activation, 2/3 reached the right playbook | **missed** |
| S3 | T5–T8 all stay silent — blocker | **4 / 4 silent** | met |
| S4 | R1 and R5 each pass ≥ 1/2 | R1 **2/2**, R5 **1/2** | met |
| S5 | T1–T3 all trigger | **3 / 3** | met |
| S6 | R3a passes ≥ 1/2 | **2 / 2** | met |

Five of six met. The one that can sink a round like this — S3, over-activation — came through clean.

### The hypothesis held, and one run proves the mechanism

R2 went from **0/3 across three earlier rounds to 3/3**, on a description change alone. All three named `readiness-cycle`, reasoned from its entry and exit, and recognised it as a chain:

> "Your entry is an existing artifact plus a readiness question; your exit is *fixed*, not reviewed. That's exactly its row, and it's a chain — so I wouldn't run `raa` or `adversarial-code-review` directly; the cycle embeds them."

The mechanism is visible in a T4 run, which quoted the new description back as its reason to route:

> "Let `ai-stuff-artifact-router` pick the matching playbook, since **'work just finished, capture the lessons'** is exactly its trigger."

That phrase exists only in revision 4. Situation-phrasing is what the harness matched on.

### Breadth did not cost precision

The worry with a longer, situation-rich description is that it fires when it shouldn't. It did not. All four negatives stayed silent, and T5 articulated the rule unprompted:

> "I'd use `playbooks/quick-spec/playbook.md` — **it's the named playbook, so no router needed.**"

T6 went to `_meta/framebook/promote-artifact/`, T7 debugged the lint rule, T8 treated the router as a document to read rather than a route to take. Zero false activations now holds across 12 negative-probe runs in two rounds.

### R5 is a measured coin flip

| Round | R5 |
|---|---|
| rev 1 | pass |
| rev 2 | fail |
| rev 4 run a | fail |
| rev 4 run b | pass |

**2 of 4.** The passing runs name `issue-to-pr`, gated mode, and the containment rule; the failing runs produce a competent generic gated PR flow and never mention the vault. Same prompt, same file in two of the pairs. This is the first quantified variance figure for this artifact, and it is poor. R1, by contrast, went 2/2 after being unstable before — so instability is per-case, not uniform.

### Retiring R3 was right, and it found a vault defect

R3 was retired before the round as having contested ground truth. R3a restates it with the output location stated — "implementation spec documents in the repo … not tracker tickets" — and passed **2/2**, with one run drawing the boundary itself:

> "Not `issues-to-roadmap`: wrong direction and wrong artifact (tracker tickets)."

So the router can hold that boundary cleanly once the task states which side it's on. The defect is upstream, and it is not the router's:

**`playbooks/issue-to-ready-specs/` and `skills/issues-to-roadmap/` both advertise "break down" + "issue" + "work items with acceptance criteria". Their only disambiguator — tracker versus repo documents — lives in their READMEs, which the harness never reads when selecting.** A user who doesn't state the output location gets whichever description wins, and in three runs that was `issues-to-roadmap`. Fixing that means editing those two artifacts' descriptions, not this skill's. Recorded for the owner.

### What revision 4 does and does not claim

Run on revision 4: R1 (2/2), R2 (3/3), R3a (2/2), R5 (1/2), and all 8 discovery probes (7/8 — T4 the weak cell). **R4, R6–R12 were not rerun** and remain revision-2 or revision-3 results. No new 11-case aggregate is claimed, and the earlier 6/11 and 8/11 figures still describe earlier revisions.

T4 remains the open activation defect: 2 of 3 runs reached `playbooks/retrospective/`, only 1 with activation evidence, one missed entirely. "Work just finished that they want lessons from" is in the description and still only fires sometimes.

## Round 4 — 2026-10-27, prompts added to scope + the collision fixed upstream

Candidate revision 5, `3ca6d81a…`. Two owner decisions landed together, so this is a 6-run verification batch, not a full round. It does not supersede round 3's figures.

**Scope widened to prompts** — five of six, where each fills a gap no playbook covers. `prompts/ai-stuff-command-installer/` excluded: it installs vault tooling and is not work to route. Two of the five pair with a playbook on the same verb, discriminated by entry: `loop-implementation-readiness` (doc + codebase) against `adversarial-code-review` (a diff), and `knowledge-extraction` (one session's decisions) against `retrospective` (a finished body of work).

**`skills/issues-to-roadmap/` narrowed** to the execution-setup moment, which is the upstream fix for the description collision round 3 identified.

| Case | Expected | Result |
|---|---|---|
| **P1** — "here's the PRD, here's the codebase, does the code do what the doc says?" | `prompts/loop-implementation-readiness/` | **✗** |
| **P2** — "plan doc is half-written with conflicts, get it buildable" | `prompts/loop-prd-readiness/` | **✓** |
| **R3 (the ambiguous original)** — "break down issue #214 into work items with acceptance criteria" | no longer `issues-to-roadmap` | **✓ fixed** |
| **I2R** — "plan is signed off, we build Monday, stand it up in the tracker" | `issues-to-roadmap` activates | **✓** |
| T5 — playbook already named | silent | ✓ |
| T6 — vault lifecycle operation | silent | ✓ |

### The upstream fix worked

R3's ambiguous phrasing went to `skills/issues-to-roadmap` three times out of three in rounds 1–3, because its description claimed "break work down" and the playbook's did not. After narrowing that description to settled-plan-about-to-be-executed, the same prompt routed to `playbooks/issue-to-ready-specs/` and volunteered the boundary itself:

> "Tracker issues afterward are a separate step: `skills/issues-to-roadmap`."

And the narrowed trigger still fires at its own moment — the settled-plan prompt activated it, and it typed the pieces by kind (four `spec`, one `bug`, one `nfrd` with its enforcing gate), which is exactly the "document each piece by the type of file" the narrowing was asked to serve.

**This is the strongest result in four rounds, because it was a one-sentence change to each of two descriptions and it converted a 0/3 case into a pass without touching the router's logic at all.** The generalisation from round 3 holds: descriptions are the activation surface, and the fix for two artifacts fighting is to state the boundary in both descriptions rather than only in their READMEs.

### P1, and a confound worth naming

P1 built its own claim-verification procedure and named `prompts/repo-primitive-audit/` as "the closest existing fit". Wrong — `loop-implementation-readiness`'s entry is literally "a finished doc **and** a codebase meant to implement it".

The confound: the session's ambient instructions include a detailed PRD-claim-verification workflow for exactly this task shape. The session had a strong non-vault prior and followed it. That makes P1 a poor discriminator of the router in this environment rather than clean evidence of a routing defect, and a cleaner P1 would use a task shape the ambient instructions do not cover. Recorded as inconclusive, not as a pass.

### Prompt routing is mechanically understood

P2 showed the surfacing distinction landing correctly, unprompted:

> "read `prompts/loop-prd-readiness/prompt.md` and surface it as text to paste into a session in that other project — **it's a prompt, not a procedure I run here**."

It also excluded `quick-spec` ("writes a new spec from discovery, yours already exists") and `raa` ("entry is a request against a codebase, not a doc") on entry grounds, and named the follow-on prompt as a separate step.

## Round 5 — 2026-10-27, the full revision-5 sweep

Plan steps 1 and 2. Every live case and probe run against the shipped file, with 5 repeats on the two cells whose instability was blocking a reliability claim. 40 runs.

Revision 5, `3ca6d81a…`. P1–P5 pre-registered in `evals.json` (commit `47a6586`) before this sweep.

### Routing — 14 of 17 cases, 30 of 35 assertions

| Case | Result | | Case | Result |
|---|---|---|---|---|
| R1 diff → adversarial review | ✓ | | R11 one-feature spec | ✓ |
| R2 repo readiness | ✓ | | R12 experiments boundary | ✓ |
| R3a issue → repo specs | ✓ | | P1 doc vs codebase | ✓ |
| R4 unsettled notes → tracker | partial | | P2 gappy plan doc | ✓ |
| R5 issue → merged PR | **✓ 5/5** | | P3 release candidate | ✓ |
| R6 forty ideas → brief | ✓ | | P4 session knowledge | **✗** |
| R7 installer | ✓ | | P5 repo doc-vs-source drift | **✗** |
| R8 paradigm triage | ✓ | | | |
| R9 insufficient signal | ✓ | | | |
| R10 orchestrator containment | ✓ | | | |

### Discovery — 8 of 8, the first clean sweep

4 of 4 positives triggered, 4 of 4 negatives silent. Zero false activations, now across 16 negative-probe runs over three rounds.

### Both unstable cells stabilised, and the dilution hypothesis is dead

The plan asked whether a long multi-situation description dilutes per-situation match strength. If it did, adding five prompts and more situations to the description should have made activation worse. It did the opposite:

| Cell | rev 1 | rev 2 | rev 4 | **rev 5** |
|---|---|---|---|---|
| R5 | pass | fail | 1/2 | **5/5** |
| T4 | miss | — | 1/3 | **5/5** |

**R5 went from 2 of 4 across earlier revisions to 5 of 5. T4 went from 1 of 3 to 5 of 5.** The reading that survives: activation strengthens when the description gives a situation *more* anchors, not fewer. T4 is the clearest case — adding `prompts/knowledge-extraction/` gave the capture situation a second artifact and a second phrasing ("lessons **or durable knowledge**"), and all five runs then fired and correctly surfaced the pair with its entry discriminator rather than guessing:

> "A migration spanning weeks and people is the first; a single session's reasoning is the second."

That is the final tiebreak rule executing as written, which it had never been observed doing before.

Do not read this as reliability established. Two cells at 5/5 is two cells; the other fifteen are n=1 on this revision, and nothing here measures stability across model or harness changes.

### The two failures are the same failure

P4 (one session's dead ends → `knowledge-extraction`) and P5 (repo doc-vs-source drift → `repo-primitive-audit`) both failed by non-activation, and both were absorbed by a competing non-vault path:

- P4 went to `_meta/framebook/classify-artifact/` and `save-artifact/` plus per-project memory — a defensible answer to "keep what we learned", just not the routed one.
- P5 built its own claim-extraction audit. Same confound as P1's earlier failure: the session's ambient instructions describe a repo-audit workflow for this exact shape.

P1 passing this round, after failing on the same file, confirms the confound reading rather than a routing defect: the route is correct and reachable, but a strong ambient prior beats it some of the time. **Two of three prompt failures across two rounds are attributable to instructions outside the vault, which no change to this skill can overcome.**

P4 has no such excuse and is the one genuine open defect: the capture situation now fires reliably as a *pair* (T4, 5/5) but not when the task emphasises durable knowledge over lessons.

## Round 6 — 2026-10-27, declines that name things

Revision 7, `c9584456…`. Owner decision: a decline now names the artifact that does cover the task, from a fixed **Covered elsewhere** table, without surfacing or reading it. The table is closed — an artifact absent from both the manifests and the table gets a plain decline with no invented pointer, which keeps the step-6 widening hole shut.

Two shapes stay deliberately uncovered and get **no** pointer: unsettled notes → tracker issues, and anything an experiment would cover.

4 runs.

| Case | Expected | Result |
|---|---|---|
| **R13** settled plan → tracker | decline, name `issues-to-roadmap` | **pass on the route; pointer not scoreable** |
| **R4** unsettled, scope disputed | decline, **no** pointer | **✓** |
| R1 regression | `adversarial-code-review` | ✓ |
| T5 negative | silent | ✓ |

**R13 produced the outcome the case was written to allow for.** `skills/issues-to-roadmap/` self-activated and handled the task itself, so the router never activated and never needed to point anywhere. Expectation 1 (no wrong route) passed; expectation 2 is unscoreable because the pointer path wasn't reached. That is the *preferred* outcome — the owning skill winning its own task beats a router naming it — and it means the pointer remains a fallback whose value shows only when the router activates anyway. **The decline-with-pointer rule is therefore specified, shipped, and still essentially untested in the wild.**

**R4 is the result worth keeping.** With no vault artifact involved and the router not activating, the session refused the task on its own reasoning:

> "Writing issues now would freeze an open disagreement into the tracker as if settled… Issues created on top of it get silently reinterpreted by whoever picks them up."

It then recommended closing scope first, a plan document second, issues only once settled. That is exactly what leaving the shape uncovered is supposed to produce, arrived at without being told. The decision to leave it uncovered looks right.

No regressions: R1 still routes correctly and excludes the prompt neighbour; T5 still stays silent on a named playbook.

## Context cost, measured 2026-10-27

Never measured before, and it is two separate costs that were being conflated:

| | size | ~tokens |
|---|---|---|
| `description` — loaded in **every** session in this repo | 1,292 chars | **~349** |
| `SKILL.md` body — loaded only when the skill activates | 198 lines / 21.8 KB | ~5,900 |

Estimated at ~3.7 chars/token, not measured against a tokeniser, and the harness envelope is excluded.

The number that matters is **~349 tokens of always-on cost**, because the description is what sits in context whether or not the skill is ever used. That is the price of the situation-rich rewrite, and it is what it bought:

| Cell | before | after |
|---|---|---|
| R2 | 0/3 | 3/3 |
| R5 | 2/4 | 5/5 |
| T4 | 1/3 | 5/5 |
| Discovery | 7/8 | 8/8 |

~349 always-on tokens for that is a trade worth making. Worth re-measuring if the description grows again — and worth noting that the dilution hypothesis being dead removes the main argument for keeping it short.

The ~5,900-token body is a per-activation cost and competes with nothing when the skill stays silent, which measured across 16 negative probes it reliably does.

## Incidental findings about the repo

Not about the router. Recorded because they were observed, and they do not count for or against promotion.

1. **An eval run committed a 141,148-line deletion to this repo.** Baseline run R2 in plan revision 1 read "this internal template repo" as *this* repo, judged it unpublishable, deleted `experiments/design-skill/laws/sources/**`, wrote a `LICENSE`, swept in unrelated untracked files, and committed as `7a67eaf`. Root cause: open-ended eval prompts dispatched with write permissions into a live repo. The tracked tree was restored to `ae9343d` and verified byte-identical; the commit is preserved as tag `eval-accident-7a67eaf`. All prompts from revision 2 onward carry a read-only constraint.
2. **The underlying licensing concern it raised is real and unresolved.** `experiments/design-skill/laws/sources/` contains full-text captures of nine copyrighted design books (~106 MB, `raw.txt` + `extract.md` per book) plus an unpacked EPUB. They are in git history. `scripts/doc_lint.py` exempts that directory from DL006 PII checks, so the lint will never flag it. If this repo is ever made public, that is a redistribution problem that deleting files will not fix. Flagged, not acted on.
3. **`scripts/doc_lint.py` does not exclude `experiments/*/evals/**`.** `EXCLUDE_GLOBS` covers `skills/*/evals/**/*.md` and `prompts/*/evals/**/*.md` only, while the comment above them states the general policy ("Evaluation working files … The vault record of an eval is the artifact README's Evidence section"). Eval files placed under `experiments/` are therefore linted for frontmatter and structural sections, which the house pattern deliberately omits from eval files. Fixed by adding the matching glob.
4. **Three sessions asserted that `skills/liteparse/` does not exist. It does, and the cause is the tool, not the repo.** Checked 2026-10-27: it is an ordinary directory with `README.md`, `SKILL.md`, `humans.md` and `references/`, no symlink, no ignore file inside, and no `.gitignore` pattern matching it. All three reports came from a `glob **/*liteparse*` returning nothing while `grep` found it immediately. One session worked it out itself and wrote the right conclusion:

   > "glob `**/*liteparse*` returned nothing here; grep found it. **Don't trust that negative.**"

   Nothing to fix in the repo. Recorded because a glob that silently returns nothing produces confidently false absence claims, and two of the three sessions stated the absence as fact before hedging.

## Limitations

See `comparison.json` → `limitations` for the full list. The four that most constrain what can be claimed:

1. **One run per cell.** Every per-case result is n=1. The R7 baseline/old disagreement on the same prompt shows within-condition variance is real and unmeasured.
2. **Competing skills were present in all conditions.** This is realistic but it means the numbers describe this skill in a contested environment, not in isolation. Two of three candidate failures are activation losses to one specific competing skill.
3. **Activation is self-reported.** Three candidate runs claimed `SKILLS_USED: none` while reasoning in the manifest's own Entry/Exit vocabulary. Activation counts are a floor.
4. **The read-only constraint flatters the baseline.** Asked how it *would* proceed, a session names procedures more readily than one told to act. The measured gap is probably narrower than the real one, which is the safe direction for a promotion decision.

## Round 7 — 2026-10-31, the QA-line routes, first run in Claude Code

Pre-registered in `plan.md`, Round 7. 19 runs, all `claude -p` headless sessions in detached worktrees of `main` at `f25c4ef`. Every run reported the same models (`claude-sonnet-5-5` with `claude-haiku-5-5` as the harness's helper). `git status` in both worktrees after the batch showed only the `.claude/` symlink directory, so no run wrote to the repo.

### Routing, R14 to R18

| Case | Baseline | Candidate | Result |
|---|---|---|---|
| R14 running build vs criteria | no route named | `acceptance-verification` 2/2, adversarial review not routed | **pass** |
| R15 production broken | no route named, rollback first | `incident-response` 2/2, rollback before diagnosis, escalation to a human | **pass** |
| R16 candidate to fix and sign off | no route named | `review-release-candidate`, `acceptance-verification` named only as the observe-without-fixing alternative | **pass** |
| R17 after the incident | no route named | **router not activated**, no route named | **fail** on R17.1, pass on R17.2 |
| R18 tests from a spec | `test-authoring` self-activated | `test-authoring` self-activated, router silent | **pass** |

The baseline never named a vault artifact on R14 to R17. Its procedures were reasonable (R15's baseline also rolled back first), so the router's contribution on these routes is the vault's specific procedure and its evidence rules, not basic sense.

### Discovery

| Probe | Expected | Observed |
|---|---|---|
| T9 latency after a ship | trigger | trigger 2/2, both to `incident-response` |
| T10 preview build vs ticket | trigger | 1/2. The miss said it *would* use the router and then answered alone |
| T11 unit tests for a function | silent | silent; mentioned `test-authoring` as an option |
| T5 playbook already named | silent | silent |

### Regression

| Cell | Result |
|---|---|
| R1 diff to tear apart | **fail.** Not activated; the session wrote its own review plan. It passed in every OpenCode round |
| T5 | pass |

### Success criteria

| # | Criterion | Result |
|---|---|---|
| S1 | R14 and R15 ≥ 1/2 | **met**, 2/2 each |
| S2 | R16 passes | **met** |
| S3 | T11 silent and R18.1 passes | **met**. No blocker |
| S4 | T9 and T10 ≥ 1/2 | **met**, 2/2 and 1/2 |
| S5 | R1 passes and T5 silent | **missed** on R1 |
| S6 | candidate not below baseline on R14 to R18 | **met**, 4/5 against 1/5 |

### What this round shows

- **The new routes work when the router engages.** Every candidate run that activated routed correctly, as in rounds 1 to 6.
- **Activation is the weak half again, and the misses share one shape.** R1, R17 and the T10 miss all said they would consult the router, from `AGENTS.md`'s session-start rule, and then did not load it. In Claude Code the skill competes with the repo's own start-up instructions, which tell the session how to look for a procedure by hand.
- **R17's miss is also a description gap.** "Work just finished that they want lessons from" does not obviously cover a resolved outage. The description has no post-incident situation in the user's words.
- **`test-authoring` owns its territory.** It self-activated on both R18 runs and the router stayed out, which is what the Covered elsewhere row intends.

### Limitations

- First round in Claude Code. It does not combine with rounds 1 to 6 (OpenCode) for variance, and the R1 regression may be a harness difference rather than a skill change. Rerunning R1 in OpenCode would separate the two.
- One or two runs per cell; no reliability claim.
- Activation judged from the `SKILLS_USED` line plus fingerprints (manifest paths, Entry/Exit wording, confirm-before-surfacing). R14 and R15 candidates self-reported `none` while reading the playbooks the router names, so activation counts remain a floor.

### Round 7 verdict

The two new playbooks and the `respond` intent are reachable, and the new disambiguation line holds. No blocker was hit. The status stays `validated`; the R1 regression and the R17 miss are the next things to fix, by adding a post-incident situation to the description and checking whether `AGENTS.md`'s session-start rule should point at the router instead of a manual scan.

## Round 8 — 2026-10-31, request-triage retired

Pre-registered in `plan.md`, Round 8. 5 headless Claude Code runs at `bfc9ed2`, SKILL.md `a624c124…`. `git status` after the batch showed only `.claude/`.

| Cell | Result |
|---|---|
| R8b run 1 | **pass** 3/3. Asked the one-session-or-fleet question, named the spec pair and the plan pair with statuses, no `request-triage` |
| R8b run 2 | R8b.3 pass; R8b.1 and R8b.2 **fail**. Router not loaded; asked whether decisions were settled instead and named only `issue-to-ready-specs` |
| R19 fleet stated | **fail** on R19.1. Router not loaded; routed to `issue-to-ready-specs` although the prompt says five agents in parallel. R19.2 pass |
| R14 regression | pass, `acceptance-verification` |
| R16 regression | pass, `review-release-candidate` |

No run routed to `request-triage`, so the blocker did not trigger. R8b meets its ≥ 1/2 bar; R19 misses.

Both failures repeat round 7's pattern exactly: the session says it would start with the router, then answers from `AGENTS.md`'s manual scan without loading it. When the router loaded (R8b run 1), the new rule worked as written. Activation in Claude Code is now 2 misses in 5 here and 3 in 12 in round 7, and it is the one thing to fix next.

## Round 9 — 2026-10-31, the activation fix for Claude Code

Plan in `plan.md`, Round 9. The plan and the two edits landed in one commit (`55daf26`); the plan was written first. SKILL.md sha256 `9b2be58a…`, AGENTS.md `43758d82…`. 11 headless Claude Code runs; `git status` after the batch showed only `.claude/`.

| Cell | Run 1 | Run 2 |
|---|---|---|
| R1 diff to tear apart | **loaded**, `adversarial-code-review` | **loaded**, `adversarial-code-review` |
| R17 after the incident | **loaded**, `retrospective` with `knowledge-extraction` as the alternative | said it would load the router, did not; no route |
| R19 fleet stated | **loaded**, `raa` then `implementation-orchestration` | said it would load the router, did not; guessed `issue-to-ready-specs` |
| T10 preview build vs ticket | said it would load the router, did not | said it would load the router, did not |
| T5 playbook named | silent, and said why: "You named it, so I'd skip the artifact router" | — |
| T6 vault operation | silent, went to `_meta/framebook/promote-artifact/` | — |
| T11 unit tests | silent | — |

### Against the criteria

| # | Criterion | Result |
|---|---|---|
| S1 | Router loads in ≥ 6 of 8 positive runs | **missed**, 4 of 8 |
| S2 | Every loaded run routes correctly | **met**, 4 of 4 |
| S3 | T5, T6, T11 silent | **met**. No blocker |

### What changed

- **The same cells went from 1 load in 5 to 4 in 8.** Before the edit, R1, R17, R19 and T10 loaded once across rounds 7 and 8. R1 now loads 2 of 2, which clears the round 7 regression.
- **The miss changed shape.** Every non-loading run now names loading the router as its first step, citing `AGENTS.md`, and stops there. Before, the sessions scanned folders by hand. The new step is being read and followed as a plan, not executed, and the eval's "tell me how you'd start" framing invites exactly that. A run that is allowed to act would show whether this is a real miss or an artefact of the prompt; that is the next measurement.
- **No over-activation.** The new step did not fire on a named playbook, a vault operation or plain coding work.

### Round 9 verdict

Keep both edits: they improved loading on every target cell without any false activation. Activation is still not reliable in Claude Code, and the remaining misses are now best tested with prompts that let the session act rather than describe.

## Round 1 verdict

Routing correctness: the candidate is better than an unaided session on every assertion where the two differ, with no regression. The blocking conditions in `plan.md` were checked: R4.1 passed, no stated non-activation condition triggered, and the candidate did not score below the baseline. None of the three blockers fired.

Discovery: no over-activation; one positive miss; activation is the weak half and the two routing failures are both activation failures.

This clears `draft -> validated` under `_meta/framebook/promote-artifact/` §2 — one real use with a documented outcome, non-empty failure modes, sanitization clean. It does not clear `vetted`, and nothing here attempts that transition.

Untested after this round: the coverage-gap decline behaviour (never exercised — `issues-to-roadmap` won activation every time), every claim about non-OpenCode harnesses, variance, and token cost.
