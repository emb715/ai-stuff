---
name: ai-stuff-artifact-router
description: Routes the current task to the right playbook in the ai-stuff vault — brainstorming, product brief, decision, triage, spec, plan, fleet implementation, installer build, code review, release readiness, retrospective — and surfaces that playbook's playbook.md on confirmation. Activates when the user describes planning, building, reviewing or shipping work and names no playbook, or asks which playbook fits. Stays silent when the user already named a playbook, when the task is a vault lifecycle operation, and when no playbook covers the task.
---

# artifact-router

Routes the current task to the right playbook in the ai-stuff vault. On user confirmation, reads and surfaces the playbook's `playbook.md` as the active procedure. Scope is playbooks only — does not route to prompts, skills, agents, or tools.

## When to activate

- User describes a task that maps to a playbook's domain and names no playbook.
- User asks "which playbook should I use" / "how do I do X in this repo".
- User is about to start multi-step work and the right playbook is non-obvious.

Do not activate when the user already named a playbook. Do not activate for vault lifecycle operations (promote, lint, audit, archive, save an artifact) — those are `_meta/framebook/`. For tasks no playbook covers, say so and stop.

## Routing procedure

0. **Signal sufficiency.** Check the task description for two signals: an *intent* (what kind of work) and an *object* (what it acts on). If either is missing or too vague to classify, ask the user for the missing piece before routing. Do not route on a guess. Examples:
   - "help" → no intent, no object. Ask: "What are you trying to do?"
   - "I want to plan something" → intent is `plan`, object is vague. Ask: "Plan what — a raw idea, a GitHub issue, or a feature request against a codebase?"
   - "I have GitHub issue #42 and want to ship it as a PR" → intent is `implement`, object is issue #42. Sufficient. Proceed.
1. **Name the entry and the exit.** What does the user already have, and what do they want to end up with? Both come from the task description, not from a category guess. Every manifest row is indexed by these two things.
2. **Match.** Find the row whose `Entry` the user already has and whose `Exit` is what they want. One row matching both is the route. If no single row spans entry to exit, apply the chain rule.
3. **Disambiguate.** If several rows match, apply the disambiguation rule (see Footgun), then the priority rule.
4. State the recommendation: playbook name, why it fits, what it produces, and its status as a caveat.
5. **Confirm before invoking.** Ask the user whether to surface it. On yes, read `<playbook-folder>/playbook.md` from disk and surface it in the session as the active procedure. On no, stop — the recommendation alone is the output.
6. If no playbook matches, say "no playbook covers this" — do not improvise and do not substitute the nearest-looking playbook.

### Signal sufficiency — what to check and what not to

The skill checks for routing signal only: can intent and object be identified from the task description? It does not validate playbook-specific inputs (issue number format, doc path existence, budget value). Each playbook validates its own inputs — the router does not duplicate that. If the user provides enough to route but the playbook will need more, route and let the playbook ask.

The boundary: routing signal is the router's job. Input validation is the playbook's job.

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

Intent is a coarse filter, not the route. Two playbooks sharing an intent are separated by `Entry`, never by intent.

### Priority rule (when multiple playbooks match)

Apply in order. Stop at the first step that leaves one candidate.

1. **Entry match.** Drop every candidate whose `Entry` the user does not have. Routing someone into a playbook whose first step demands an input they lack is the most common wrong route and the most expensive.
2. **`Not for` exclusion.** Read each surviving candidate's `Not for` in its `README.md`. If it excludes this task, drop it.
3. **Narrower scope wins.** A playbook scoped to the exact task beats a general one.
4. **Containment.** If one candidate embeds another (see Chains), and the task's exit is the container's exit, route to the container and name the embedded playbook as its phase. Do not route to a sub-playbook that the right chain already runs.
5. **Final tiebreak — unconditional.** If two or more candidates survive steps 1-4, surface all of them with one disambiguating sentence each, taken from their `When to use`, and let the user pick. Never pick silently.

**Status is not a fit criterion.** The vault has zero `vetted` playbooks and 10 of 14 are `draft`, so lifecycle state cannot discriminate on most routes, and where it can it is measuring maturity, not fit. Preferring a `validated` playbook over a `draft` one actively misroutes when the `draft` playbook is the one that matches the entry — the `validated` candidate is often a *phase* of the `draft` one. Report status alongside the route as a caveat ("status `draft` — confirm preconditions before starting"), never as a reason for the route.

## Manifest

Indexed by `Entry` (what the user must already have) and `Exit` (what the playbook produces). These two columns are the disambiguation — intent alone does not route.

| Playbook | Intent | Entry — what you must already have | Exit — what it produces | Status |
|---|---|---|---|---|
| `playbooks/brainstorming/` | `ideate` | a topic, and 30-60+ min of interactive time | 100+ ideas, themed and prioritised | validated |
| `playbooks/product-brief/` | `ideate` | a rough idea, or brainstorm output already converged | structured brief: problem, users, success, scope, constraints | validated |
| `playbooks/decision-making/` | `decide` | N existing options and no clear winner | ranked top 3-5 with per-criterion rationale and a robustness verdict | draft |
| `playbooks/request-triage/` | `decide` | a raw request, and no idea whether it wants a spec or a plan | a routing decision between paradigms; executes nothing | draft |
| `playbooks/quick-spec/` | `plan` | one feature or change, one implementer, one session | one implementation-ready spec, 6-criterion gated | validated |
| `playbooks/issue-to-ready-specs/` | `plan` | an existing tracked issue, big enough for several stories | a PRD plus N implementation-ready specs | draft |
| `playbooks/raa/` | `plan` | a feature/change/readiness request against a real codebase | a validated phased plan with file-level scope, risks, handoffs | draft |
| `playbooks/implementation-orchestration/` | `implement` | a validated plan: phases, file scope, named risks, handoff list | a committed, reviewed, CI-green branch | draft |
| `playbooks/issue-to-pr/` | `implement` | an existing tracked issue, well-scoped | a merged PR (gated or continuous mode) | draft |
| `playbooks/build-to-release/` | `implement` | an idea or proof-of-concept, work worth 3+ stories | a released implementation, through 13 gated phases | draft |
| `playbooks/agent-installer/` | `implement` | a requirement to ship a multi-platform installer CLI | an installer with TUI and CI mode, idempotent, config-driven | draft |
| `playbooks/adversarial-code-review/` | `review` | a git diff, and a finite list of claims or acceptance criteria | ≥3 categorised findings plus a fix menu | validated |
| `playbooks/readiness-cycle/` | `release` | an existing artifact and a readiness question | a verified-ready verdict or a fix plan, looped until ship | draft |
| `playbooks/retrospective/` | `capture` | a completed body of work | lessons, follow-through check, SMART action items | draft |

Treat the manifest as a cache, not a source of truth. If a route seems wrong, read the playbook's own `README.md` — that is authoritative.

## Chains — when the answer is more than one playbook

Several playbooks are themselves chains. Their rows above are correct, but the chain matters for routing: never route to a step of a chain when the user's exit is the chain's exit.

| Chain playbook | What it runs internally | Entry → Exit |
|---|---|---|
| `issue-to-pr` | `issue-to-ready-specs` → `raa` → `implementation-orchestration` | tracked issue → merged PR |
| `readiness-cycle` | `raa` → `implementation-orchestration` → `review-release-candidate` (a prompt) | artifact + readiness question → verified ready, looped |
| `build-to-release` | `product-brief` → `quick-spec` → implementation → `adversarial-code-review` → release review | idea or PoC → released, 13 gated phases |
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

## Known coverage gaps — decline, do not substitute

These task shapes look routable and have no playbook. Say "no playbook covers this" and stop. Do not substitute the nearest-direction match.

- **Session notes, brainstorm output, or a planning transcript → issues in a tracker.** No playbook runs this direction. `issue-to-ready-specs` runs the opposite direction and its entry is a tracked issue the user does not have yet.
- **Authoring or revising an agent skill, prompt, command, or tool.**
- **Vault lifecycle operations** — promote, deprecate, lint, audit, archive, save an artifact from another project. Those are `_meta/framebook/`.

This router is playbooks-only by design. A task that would be served by a prompt, skill, agent, or tool gets a decline, not a near-miss playbook.

## Routing examples

**Task:** "I have a GitHub issue and want to ship it as a PR."
→ `playbooks/issue-to-pr/` (intent: `implement`). Entry: tracked issue. Exit: merged PR. A chain playbook — prefer it over running its three steps by hand. Status: draft — confirm preconditions before starting.

**Task:** "I have a validated phased plan, want a fleet to build it, reviewed before merge."
→ `playbooks/implementation-orchestration/` (intent: `implement`). Entry: validated plan. `adversarial-code-review` is its mandatory review phase, not the route — containment rule 4. Its `validated` status is not a reason to prefer it over this `draft` orchestrator.

**Task:** "Forty brainstormed ideas, I need something structured for planning."
→ a sequence: `playbooks/decision-making/` then `playbooks/product-brief/`. No single playbook spans it. Start at `decision-making`; re-enter at `product-brief` with the ranked shortlist.

**Task:** "Break down these planning notes into issues in our tracker."
→ No playbook covers this. The direction is notes → issues; the vault's playbooks run issue → specs. Decline and stop.

**Task:** "Ship a CLI that installs our agents into Claude Code, Cursor and OpenCode, interactive and CI-safe."
→ `playbooks/agent-installer/` (intent: `implement`). Entry: a requirement to ship a multi-platform installer. Building an installer is build work — do not read "a new installer" as a blank-page `ideate` task.

**Task:** "A change request came in; I don't know if it wants a spec or a plan."
→ `playbooks/request-triage/` (intent: `decide`). Entry: a raw request and paradigm uncertainty. Route to it rather than answering the paradigm question directly — it is the playbook that owns that decision.

**Task:** "Run an adversarial review on this PR's diff."
→ `playbooks/adversarial-code-review/` (intent: `review`). Entry: a diff plus acceptance criteria. Minimum 3 findings, fix menu. Status: validated.

**Task:** "We finished a project phase, want to retro."
→ `playbooks/retrospective/` (intent: `capture`). Lessons, SMART action items. Status: draft.

**Task:** "Take this existing spec from draft to verified-ready."
→ `playbooks/readiness-cycle/` (intent: `release`). Entry: existing artifact + readiness question. Chains `raa` → `implementation-orchestration` → release review; loops until ship.
