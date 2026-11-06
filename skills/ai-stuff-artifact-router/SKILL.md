---
name: ai-stuff-artifact-router
description: "Picks the right ai-stuff playbook or prompt for the work at hand and surfaces it on confirmation. Activates when none is named and the user has any of these: a topic or rough idea to shape; more options than they can choose between; a request, feature or tracked issue to turn into specs or a phased plan; a planning doc with gaps that has to become implementation-ready; a validated plan that needs building; a multi-platform installer CLI to ship; a diff to tear apart before merging; a doc to verify a codebase actually implements; a repo whose docs may have drifted from its source; a release candidate to sign off against acceptance criteria; a running build to verify against its acceptance criteria; a production system broken by a shipped change; work just finished, or an outage or incident that is over, that they want lessons or durable knowledge from; or an existing repo, template, package or document they want checked and fixed before sharing, releasing, handing off or open-sourcing it. Also activates on \"which playbook\", \"how do I do this here\", and \"what's the right way to start this\". Stays silent when the user already named the artifact to use, when the work is a vault lifecycle operation (promote, deprecate, lint, audit, archive, save an artifact), when the task is to author a skill or prompt rather than use one, when a settled plan is being stood up in a tracker, and when nothing in the vault covers the task."
---

# artifact-router

Routes the current task to the right playbook or prompt in the ai-stuff vault. On user confirmation, reads and surfaces that artifact's consumable file.

Scope is two hard boundaries:

- **Playbooks and prompts.** Routes to the playbooks and prompts listed in the two manifests below, and to nothing else. Does not route to skills, agents, or tools — those load themselves or are deployed, and routing to them duplicates a mechanism that already runs.
- **Never anything under `experiments/`**, whatever shape it has. An experiment with its own `playbook.md`, a `playbook` tag, or a plausible procedure is still an experiment: untested, unsanitized, and excluded from the vault's reusable inventory. The manifests below are the complete routable set.

A playbook is a procedure you execute step by step; its consumable file is `playbook.md`. A prompt is text you paste into a session; its consumable file is `prompt.md`. Surface whichever the route calls for.

## When to activate

- User describes a task that maps to a listed playbook's or prompt's domain and names neither.
- User asks "which playbook should I use" / "how do I do X in this repo".
- User is about to start multi-step work and the right artifact is non-obvious.

Do not activate when the user already named the artifact to use. Do not activate for vault lifecycle operations (promote, lint, audit, archive, save an artifact) — those are `_meta/framebook/`. Do not activate when a settled plan is being stood up in a tracker — `skills/issues-to-roadmap/` owns that and activates itself. For tasks nothing listed here covers, say so and stop.

## Routing procedure

0. **Signal sufficiency.** Check the task description for two signals: an *intent* (what kind of work) and an *object* (what it acts on). If either is missing or too vague to classify, ask the user for the missing piece before routing. Do not route on a guess. Examples:
   - "help" → no intent, no object. Ask: "What are you trying to do?"
   - "I want to plan something" → intent is `plan`, object is vague. Ask: "Plan what — a raw idea, a GitHub issue, or a feature request against a codebase?"
   - "I have GitHub issue #42 and want to ship it as a PR" → intent is `implement`, object is issue #42. Sufficient. Proceed.
1. **Name the entry and the exit.** What does the user already have, and what do they want to end up with? Both come from the task description, not from a category guess. Every manifest row is indexed by these two things.
2. **Match.** Walk the **Routing table** below from the top and stop at the first fact that is a clear yes; its outcome is the route. Then confirm it against the manifest row: the user has its `Entry` and wants its `Exit`. If no single row spans entry to exit, apply the chain rule.
3. **Disambiguate.** If several rows match, apply the disambiguation rule (see Footgun), then the priority rule.
4. State the recommendation: playbook name, why it fits, what it produces, and its status as a caveat.
5. **Confirm before invoking.** Ask the user whether to surface it. On yes, read the route's consumable file from disk — `<playbook-folder>/playbook.md` for a playbook, `<prompt-folder>/prompt.md` for a prompt — and surface it in the session: a playbook as the active procedure, a prompt as text to paste. On no, stop — the recommendation alone is the output.
6. If nothing in the manifests matches, decline — and if the task is one of the shapes in **Covered elsewhere** below, name the artifact that does cover it. Do not surface it, do not read its file, do not route into it. Say what it is, say it is out of scope here, and stop. Never improvise and never substitute the nearest-looking playbook.

### Signal sufficiency — what to check and what not to

The skill checks for routing signal only: can intent and object be identified from the task description? It does not validate playbook-specific inputs (issue number format, doc path existence, budget value). Each playbook validates its own inputs — the router does not duplicate that. If the user provides enough to route but the playbook will need more, route and let the playbook ask.

The boundary: routing signal is the router's job. Input validation is the playbook's job.

### Routing table — yes/no facts, first yes wins

Each row is one fact you can check against the user's own words: something they say they have, or something they say is happening. Answer it yes or no without guessing. Walk the rows in order; the first clear yes decides. A fact you cannot settle from the words is neither yes nor no: ask the one question that settles it, then continue. Every task ends at some row, because the last row always matches.

| # | Is this true, from the user's words? | Outcome |
|---|---|---|
| 1 | They named the playbook or prompt to use | Stay silent; let them proceed |
| 2 | The work is a vault lifecycle operation (promote, deprecate, lint, audit, archive, save an artifact) | Stay silent; `_meta/framebook/` owns it |
| 3 | The work is writing or revising a skill, prompt, command or tool | Decline; name `skills/skill-authoring/` |
| 4 | A production system is misbehaving right now, after a shipped change | `playbooks/incident-response/` |
| 5 | They have a release candidate and its acceptance criteria, and want defects fixed and a sign-off | `prompts/review-release-candidate/` |
| 6 | They have a running build (URL or build ID) and its acceptance criteria, and want it observed, not fixed | `playbooks/acceptance-verification/` |
| 7 | They have a diff or branch they want attacked before it merges | `playbooks/adversarial-code-review/` |
| 8 | They have a finished doc and the codebase meant to implement it, and ask whether the code does what the doc says | `prompts/loop-implementation-readiness/` |
| 9 | They suspect a repo's docs claim things its source does not do | `prompts/repo-primitive-audit/` |
| 10 | They have an existing repo, template, package or document to make ready to share, release, hand off or open-source | `playbooks/readiness-cycle/` |
| 11 | They have a planning doc with gaps, conflicts or partial sections to finish | `prompts/loop-prd-readiness/` |
| 12 | They have a validated plan (phases, file scope, risks, handoffs) and want it built | `playbooks/implementation-orchestration/` |
| 13 | They have a settled plan and want it stood up as issues in a tracker | Decline; name `skills/issues-to-roadmap/` |
| 14 | They want unsettled notes or a transcript turned into issues | Decline with no pointer; the decisions need settling first |
| 15 | They have a tracked issue and want it to end as a merged PR | `playbooks/issue-to-pr/` |
| 16 | They have a tracked issue big enough for several stories and want specs | `playbooks/issue-to-ready-specs/` |
| 17 | They need a multi-platform installer CLI shipped | `playbooks/agent-installer/` |
| 18 | They have an idea or proof of concept worth 3+ stories and want it released | `playbooks/build-to-release/` |
| 19 | They have one feature or change request to plan | One implementer in one session: `playbooks/quick-spec/`. A fleet in parallel: `playbooks/raa/`, then `playbooks/implementation-orchestration/`. Not stated: ask which |
| 20 | They have several existing options and no clear winner | `playbooks/decision-making/` (then `playbooks/product-brief/` if they want a brief: a sequence) |
| 21 | They have a rough idea to shape into a brief | `playbooks/product-brief/` |
| 22 | They have a topic and want many ideas generated | `playbooks/brainstorming/` |
| 23 | Work or an incident is over, and they want lessons or durable knowledge from it | A body of work, or lessons with owned actions: `playbooks/retrospective/`. One session's decisions and dead ends: `prompts/knowledge-extraction/`. Unclear: surface both |
| 24 | The intent or the object is missing | Ask for it (step 0) |
| 25 | None of the above | Decline. Name an artifact only if **Covered elsewhere** lists the task shape |

Order matters where two facts can both be true. Row 4 before row 23: an incident still affecting users is a response, not a retro. Rows 5 and 6 split on whether they want fixes. Rows 13 and 14 split on whether the decisions are settled. A row's wording is a check, not a keyword: "tear apart this branch" is row 7 although it never says "review".

### Intent categories

| Intent | Meaning |
|---|---|
| `ideate` | Starting from a blank page or a rough idea — generate or structure something that does not exist yet |
| `decide` | The options (or the candidate paradigms) already exist; converge on one. Produces a choice, not a document |
| `plan` | Turn an idea, issue, or request into an implementation-ready spec or plan |
| `implement` | Build — turn a plan, spec, or stated requirement into working code |
| `review` | Verify code against a finite requirement list |
| `release` | Take an existing artifact to verified-ready |
| `capture` | Post-session: retro on completed work |
| `respond` | Production is broken now; restore service before diagnosing |

Intent is a coarse filter, not the route. Two playbooks sharing an intent are separated by `Entry`, never by intent.

### Priority rule (when multiple playbooks match)

Apply in order. Stop at the first step that leaves one candidate.

1. **Entry match.** Drop every candidate whose `Entry` the user does not have. Routing someone into a playbook whose first step demands an input they lack is the most common wrong route and the most expensive.
2. **`Not for` exclusion.** Read each surviving candidate's `Not for` in its `README.md`. If it excludes this task, drop it.
3. **Narrower scope wins.** A playbook scoped to the exact task beats a general one.
4. **Containment.** If one candidate embeds another (see Chains), and the task's exit is the container's exit, route to the container and name the embedded playbook as its phase. Do not route to a sub-playbook that the right chain already runs.
5. **Final tiebreak — unconditional.** If two or more candidates survive steps 1-4, surface all of them with one disambiguating sentence each, taken from their `When to use`, and let the user pick. Never pick silently.

**Status is not a fit criterion.** The vault has zero `vetted` playbooks and 11 of 15 are `draft`, so lifecycle state cannot discriminate on most routes, and where it can it is measuring maturity, not fit. Preferring a `validated` playbook over a `draft` one actively misroutes when the `draft` playbook is the one that matches the entry — the `validated` candidate is often a *phase* of the `draft` one. Report status alongside the route as a caveat ("status `draft` — confirm preconditions before starting"), never as a reason for the route.

## Manifest

Indexed by `Entry` (what the user must already have) and `Exit` (what the playbook produces). These two columns are the disambiguation — intent alone does not route.

| Playbook | Intent | Entry — what you must already have | Exit — what it produces | Status |
|---|---|---|---|---|
| `playbooks/brainstorming/` | `ideate` | a topic, and 30-60+ min of interactive time | 100+ ideas, themed and prioritised | validated |
| `playbooks/product-brief/` | `ideate` | a rough idea, or brainstorm output already converged | structured brief: problem, users, success, scope, constraints | validated |
| `playbooks/decision-making/` | `decide` | N existing options and no clear winner | ranked top 3-5 with per-criterion rationale and a robustness verdict | draft |
| `playbooks/quick-spec/` | `plan` | one feature or change, one implementer, one session | one implementation-ready spec, 6-criterion gated | validated |
| `playbooks/issue-to-ready-specs/` | `plan` | an existing tracked issue, big enough for several stories | a PRD plus N implementation-ready specs | draft |
| `playbooks/raa/` | `plan` | a feature/change/readiness request against a real codebase | a validated phased plan with file-level scope, risks, handoffs | draft |
| `playbooks/implementation-orchestration/` | `implement` | a validated plan: phases, file scope, named risks, handoff list | a committed, reviewed, CI-green branch | draft |
| `playbooks/issue-to-pr/` | `implement` | an existing tracked issue, well-scoped | a merged PR (gated or continuous mode) | draft |
| `playbooks/build-to-release/` | `implement` | an idea or proof-of-concept, work worth 3+ stories | a released implementation, through 13 gated phases | draft |
| `playbooks/agent-installer/` | `implement` | a requirement to ship a multi-platform installer CLI | an installer with TUI and CI mode, idempotent, config-driven | draft |
| `playbooks/acceptance-verification/` | `review` | a running build (URL or build ID plus commit) **and** its acceptance criteria | a per-criterion evidence ledger and a tri-state verdict (VERIFIED, WITH_CONDITIONS, NOT_VERIFIED) | draft |
| `playbooks/adversarial-code-review/` | `review` | a git diff, and a finite list of claims or acceptance criteria | ≥3 categorised findings plus a fix menu | validated |
| `playbooks/readiness-cycle/` | `release` | an existing artifact and a readiness question | a verified-ready verdict or a fix plan, looped until ship | draft |
| `playbooks/retrospective/` | `capture` | a completed body of work | lessons, follow-through check, SMART action items | draft |
| `playbooks/incident-response/` | `respond` | a production system misbehaving after a shipped change, and access to its dashboards, logs or rollback | service restored or escalated, an incident timeline, owned follow-ups | draft |

### Prompts

Prompts are text you paste, not procedures you walk. These five fill gaps no playbook covers — mostly *verification against an existing artifact*, which every playbook either assumes already happened or delegates outward. `prompts/ai-stuff-command-installer/` is deliberately absent: it installs vault tooling and is not work to route.

| Prompt | Intent | Entry — what you must already have | Exit — what it produces | Status |
|---|---|---|---|---|
| `prompts/loop-prd-readiness/` | `plan` | a planning doc with known gaps, conflicts or partial sections | the same doc driven to implementation-ready, atomic and traceable | validated |
| `prompts/loop-implementation-readiness/` | `review` | a finished doc **and** a codebase meant to implement it | evidence-based coverage verdict, smallest next action per gap | validated |
| `prompts/review-release-candidate/` | `release` | a release candidate (branch, build, tag) **and** documented acceptance criteria | inventory → triage → fix batches → sign-off verdict | draft |
| `prompts/repo-primitive-audit/` | `review` | a repo or section to review, and suspected doc-vs-source drift | a primitive map from source, then an adversarial review against it | validated |
| `prompts/knowledge-extraction/` | `capture` | a finished substantive session with decisions, failures or constraints in it | proposed durable knowledge writes, user approves before any write | validated |

Two of these pair with a playbook on the same verb, and the entry discriminates:

- `loop-implementation-readiness` vs `adversarial-code-review` — a **doc to verify code against** versus a **diff to attack**. Doc and whole codebase: the prompt. Diff and acceptance criteria: the playbook.
- `review-release-candidate` vs `playbooks/acceptance-verification/` — **a candidate to triage, fix and sign off** versus **a running build to observe**. Inventory, fix batches and a sign-off verdict: the prompt. Runtime evidence for each criterion from the executing program, no fixing: the playbook.
- `knowledge-extraction` vs `retrospective` — **durable knowledge out of one session** versus **lessons and SMART actions out of a body of work**. One session's decisions and dead ends: the prompt. A finished sprint, feature or milestone, with ownership of the lessons: the playbook.

### Which readiness check

Five artifacts answer some form of "is it ready?". The object the user already has picks one:

| The user has | Route |
|---|---|
| a planning doc with gaps | `prompts/loop-prd-readiness/` |
| a codebase and the doc it should implement | `prompts/loop-implementation-readiness/` |
| a running build and its acceptance criteria, to observe | `playbooks/acceptance-verification/` |
| a release candidate to triage, fix and sign off | `prompts/review-release-candidate/` |
| an existing repo, template, package or document to make share-ready, fixes included | `playbooks/readiness-cycle/` |

Treat the manifests as a cache, not a source of truth. If a route seems wrong, read the playbook's own `README.md` — that is authoritative on *what a listed playbook does*.

It is not a licence to widen the set. Verifying a route against the filesystem can only confirm or drop a row, never add one. A folder found by scanning that is absent from this table is not a route — and a folder under `experiments/` is never a route. If the right answer looks like it lives in an unlisted folder, say no playbook covers this and name the gap; adding a row is a maintenance edit a human makes, not a routing decision.

## Chains — when the answer is more than one playbook

Several playbooks are themselves chains. Their rows above are correct, but the chain matters for routing: never route to a step of a chain when the user's exit is the chain's exit.

| Chain playbook | What it runs internally | Entry → Exit |
|---|---|---|
| `issue-to-pr` | `issue-to-ready-specs` → `raa` → `implementation-orchestration` | tracked issue → merged PR |
| `readiness-cycle` | `raa` → `implementation-orchestration` → `prompts/review-release-candidate/` | artifact + readiness question → verified ready, looped |
| `build-to-release` | `product-brief` → `quick-spec` → `prompts/loop-implementation-readiness/` → implementation → `adversarial-code-review` → `prompts/review-release-candidate/` | idea or PoC → released, 13 gated phases |
| `raa` | hands off to `prompts/loop-implementation-readiness/` when a plan already exists | request → validated plan → verified against code |
| `issue-to-ready-specs` | `product-brief` and `quick-spec` | tracked issue → PRD + specs |
| `implementation-orchestration` | `adversarial-code-review` as its mandatory review phase | validated plan → reviewed branch |

Chain rule:

1. If one row's `Entry` and `Exit` both match the task, route to it. Done — most tasks end here.
2. If no single row spans entry to exit, check this table for a chain playbook that does. Prefer it over composing the chain by hand; it carries the gates and handoffs that hand-composition drops.
3. If no chain playbook spans it either, name the **shortest sequence** of playbooks where each one's `Exit` satisfies the next one's `Entry`. Say explicitly that it is a sequence, route to the first one only, and tell the user where they re-enter.
4. If the task's stated exit is a chain's exit, do not route to a playbook that the chain embeds — route to the chain and name the embedded playbook as its phase.

Worked example of rule 3: "forty brainstormed ideas, I need something structured for planning." No row takes forty raw options to a brief — `product-brief`'s entry is a rough idea or *converged* brainstorm output, and forty unranked options are not converged. `decision-making` takes N options to a ranked shortlist; `product-brief` takes that shortlist to a brief. Route: `decision-making` first, then `product-brief`. Two playbooks, in that order.

## Footgun — Overlapping triggers

Playbooks share trigger language. "Review a spec", "review a release", "review a PR" all contain "review" and route to different playbooks (`readiness-cycle`, `adversarial-code-review`). Trigger keywords are not a signal — the *object* of the trigger is, and so is the *direction* the work runs.

Disambiguation rule when multiple playbooks match:

1. Read each candidate's `When to use` AND `Not for` sections in its `README.md`.
2. Match the task's object (the thing being acted on) against the playbook's stated scope, not the verb alone.
3. **Check the direction.** Two playbooks can act on the same object class and run opposite ways. `issue-to-ready-specs` runs issue → specs; a task that runs notes → issues shares the words "break down" and "issue" while being the reverse operation. A reversed match is a wrong route, not a partial one: its first step demands an input the user does not have.
4. If `Not for` in one candidate excludes the task, drop it.
5. If two candidates still match, apply the priority rule.

Example: "review this codebase against our spec"
- Candidate A: `readiness-cycle` — entry: existing artifact + readiness question. Task is codebase-vs-spec verification. Partial match — scope is artifact readiness, not spec compliance.
- Candidate B: `adversarial-code-review` — entry: git changes plus a finite requirement list. Task has a doc as the requirement list. Match.
- Route: B.

## Covered elsewhere — decline, and name it

These task shapes look routable and are not in the manifests. Decline, name the artifact below that does cover it, and stop. Naming is not routing: do not surface the artifact, do not read its file, do not start it. The user decides what to do with the name.

| Task shape | Covered by | Note |
|---|---|---|
| A settled plan to stand up in a tracker so work can start and be followed | `skills/issues-to-roadmap/` | A skill — it activates itself. Mention it and stop |
| Authoring or revising a skill, prompt, command or tool | `skills/skill-authoring/` | Routing *to* a prompt is in scope; *writing* one is not |
| Vault lifecycle — promote, deprecate, lint, audit, archive, save an artifact | `_meta/framebook/` | The matching procedure folder, not a playbook |
| Diagramming how a change ripples through a codebase | `skills/change-impact-diagram/` | A skill; activates itself |
| Assessing a repo's AI-engineering setup against the Lean Agentic pillars | `skills/lean-agentic-baseline/` | A skill; activates itself |
| Writing tests from a spec or acceptance criteria | `skills/test-authoring/` | A skill; activates itself |

This list is fixed. It is not permission to go looking: an artifact absent from both the manifests and this table gets a plain decline with no pointer invented for it.

### Genuinely uncovered

- **Unsettled notes or a transcript → issues in a tracker.** Nothing covers this, by design. The vault's playbooks run issue → specs, the opposite direction. `issues-to-roadmap` requires the decisions to be settled and work about to start, which is the point: unsettled work wants a human decision before it becomes a backlog. Decline with no pointer, and say the decisions need settling first.
- **Anything an experiment would cover.** `experiments/` holds procedure-shaped drafts — for example a document-driven design pipeline (PRD → RFD → NRFD → tech spec) tagged `playbook` with its own `playbook.md`. These collide hardest with `plan`-intent tasks, which is exactly when the temptation to reach for one is strongest. Decline, and do **not** name it: an experiment is not a thing to point a user at. It becomes routable by promotion into `playbooks/` plus a manifest row, never by being found.

This router routes the playbooks and prompts in its manifests, and nothing else. Everything else is a decline — with a name when the table above has one, without one when it does not.

## Routing examples

**Task:** "I have a GitHub issue and want to ship it as a PR."
→ `playbooks/issue-to-pr/` (intent: `implement`). Entry: tracked issue. Exit: merged PR. A chain playbook — prefer it over running its three steps by hand. Status: draft — confirm preconditions before starting.

**Task:** "I have a validated phased plan, want a fleet to build it, reviewed before merge."
→ `playbooks/implementation-orchestration/` (intent: `implement`). Entry: validated plan. `adversarial-code-review` is its mandatory review phase, not the route — containment rule 4. Its `validated` status is not a reason to prefer it over this `draft` orchestrator.

**Task:** "Forty brainstormed ideas, I need something structured for planning."
→ a sequence: `playbooks/decision-making/` then `playbooks/product-brief/`. No single playbook spans it. Start at `decision-making`; re-enter at `product-brief` with the ranked shortlist.

**Task:** "The plan's signed off — break it into issues in our tracker so we can start."
→ Nothing in the manifests covers this; the vault's playbooks run issue → specs, the opposite direction. Name it and stop: `skills/issues-to-roadmap/` covers standing a settled plan up in a tracker, and it is a skill that activates itself. Do not surface it.

**Task:** "We talked a lot yesterday, nothing's really decided — break it into issues anyway."
→ Decline with no pointer. The direction is notes → issues, which nothing runs, and the decisions are not settled, which is the one condition `issues-to-roadmap` refuses. Say the decisions need settling first.

**Task:** "Here's our PRD and here's the codebase. Does the code actually do what the doc says?"
→ `prompts/loop-implementation-readiness/` (intent: `review`). Entry: a finished doc plus the codebase meant to implement it. Not `adversarial-code-review` — that attacks a diff; this verifies a whole codebase against a requirement list. Surface `prompt.md` as text to paste.

**Task:** "This plan doc is half-written and full of holes. Get it to where a dev could build from it."
→ `prompts/loop-prd-readiness/` (intent: `plan`). Entry: an existing doc with known gaps. Not `quick-spec` — that writes a new spec from discovery; this drives an existing doc to ready.

**Task:** "We shipped a hard week. I want what we learned written down somewhere it'll be used."
→ Two candidates, discriminated by entry: `prompts/knowledge-extraction/` for durable knowledge out of one session's decisions and dead ends, `playbooks/retrospective/` for lessons and SMART actions out of a finished body of work. Surface both with their disambiguating sentences and let the user pick — priority rule, final tiebreak.

**Task:** "Ship a CLI that installs our agents into Claude Code, Cursor and OpenCode, interactive and CI-safe."
→ `playbooks/agent-installer/` (intent: `implement`). Entry: a requirement to ship a multi-platform installer. Building an installer is build work — do not read "a new installer" as a blank-page `ideate` task.

**Task:** "A change request came in; I don't know if it wants a spec or a plan."
→ Not enough signal to pick one route. Ask the one question the planning playbooks' `Paradigm` lines turn on: will one agent or human implement it in a single session, or a fleet in parallel? One session: the spec paradigm, `playbooks/quick-spec/` for one feature or `playbooks/issue-to-ready-specs/` for an issue that splits into several stories. A fleet: the plan paradigm, `playbooks/raa/` and then `playbooks/implementation-orchestration/`. Surface the pair that matches the answer. (`playbooks/request-triage/` used to own this choice; it is deprecated in favour of this rule.)

**Task:** "Run an adversarial review on this PR's diff."
→ `playbooks/adversarial-code-review/` (intent: `review`). Entry: a diff plus acceptance criteria. Minimum 3 findings, fix menu. Status: validated.

**Task:** "The PR is green and deployed to preview. Does it actually meet the acceptance criteria?"
→ `playbooks/acceptance-verification/` (intent: `review`). Entry: a running build plus criteria. Not `adversarial-code-review` — that attacks the diff; this observes the executing program. Status: draft.

**Task:** "Error rate spiked right after this morning's deploy."
→ `playbooks/incident-response/` (intent: `respond`). Mitigate first, diagnose second. Not the `implementation-orchestration` fix loop — that is for pre-merge failures. Status: draft.

**Task:** "We finished a project phase, want to retro."
→ `playbooks/retrospective/` (intent: `capture`). Lessons, SMART action items. Status: draft.

**Task:** "Take this existing spec from draft to verified-ready."
→ `playbooks/readiness-cycle/` (intent: `release`). Entry: existing artifact + readiness question. Chains `raa` → `implementation-orchestration` → release review; loops until ship.
