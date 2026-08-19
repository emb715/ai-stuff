---
name: ai-stuff-artifact-router
description: Routes the current task to the right playbook in the ai-stuff vault and surfaces playbook.md on confirmation. Activates when the user is about to start work and a playbook might apply, when they ask "which playbook" or "how do I do X", or when a task matches a playbook's domain and none is named.
---

# artifact-router

Routes the current task to the right playbook in the ai-stuff vault. On user confirmation, reads and surfaces the playbook's `playbook.md` as the active procedure. Scope is playbooks only — does not route to prompts, skills, agents, or tools.

## When to activate

- User describes a task that maps to a playbook's domain and names no playbook.
- User asks "which playbook should I use" / "how do I do X in this repo".
- User is about to start multi-step work and the right playbook is non-obvious.

Do not activate when the user already named a playbook. Do not activate for tasks no playbook covers — say so and stop.

## Routing procedure

0. **Signal sufficiency.** Check the task description for two signals: an *intent* (what kind of work) and an *object* (what it acts on). If either is missing or too vague to classify, ask the user for the missing piece before routing. Do not route on a guess. Examples:
   - "help" → no intent, no object. Ask: "What are you trying to do?"
   - "I want to plan something" → intent is `plan`, object is vague. Ask: "Plan what — a raw idea, a GitHub issue, or a feature request against a codebase?"
   - "I have GitHub issue #42 and want to ship it as a PR" → intent is `implement`, object is issue #42. Sufficient. Proceed.
1. Classify the task intent into one category below.
2. Match against the manifest. If multiple match, apply the disambiguation rule (see Footgun), then the priority rule.
3. State the recommendation: playbook name, why it fits, and what it produces.
4. **Confirm before invoking.** Ask the user whether to surface it. On yes, read `<playbook-folder>/playbook.md` from disk and surface it in the session as the active procedure. On no, stop — the recommendation alone is the output.
5. If no playbook matches, say "no playbook covers this" — do not improvise.

### Signal sufficiency — what to check and what not to

The skill checks for routing signal only: can intent and object be identified from the task description? It does not validate playbook-specific inputs (issue number format, doc path existence, budget value). Each playbook validates its own inputs — the router does not duplicate that. If the user provides enough to route but the playbook will need more, route and let the playbook ask.

The boundary: routing signal is the router's job. Input validation is the playbook's job.

### Intent categories

| Intent | Meaning |
|---|---|
| `ideate` | Starting from a rough idea, issue, or blank page |
| `plan` | Turning an idea/issue into an implementation-ready spec or plan |
| `implement` | Executing a validated plan against a codebase |
| `review` | Verifying code or a doc against reality |
| `capture` | Post-session: retro on completed work |
| `release` | Taking an existing artifact to verified-ready |

### Priority rule (when multiple playbooks match)

1. `vetted` > `validated` > `draft` — prefer higher lifecycle state.
2. Narrower trigger > broader trigger — a playbook scoped to the exact task beats a general one.
3. If two playbooks cover the same intent at the same state, surface both and let the user pick; do not pick silently.

## Manifest

| Playbook | Intent | Trigger | Status |
|---|---|---|---|
| `playbooks/brainstorming/` | `ideate` | Need to brainstorm before planning | validated |
| `playbooks/decision-making/` | `ideate` | Have N options; need a ranked shortlist with rationale | draft |
| `playbooks/product-brief/` | `ideate` | Turn brainstorm output or rough idea into a product brief | validated |
| `playbooks/request-triage/` | `plan` | Raw request; route to spec paradigm vs plan paradigm | draft |
| `playbooks/quick-spec/` | `plan` | Create implementation-ready spec via discovery + code investigation | validated |
| `playbooks/issue-to-ready-specs/` | `plan` | GitHub issue → full implementation-ready spec suite | draft |
| `playbooks/raa/` | `plan` | Research, Analyze, Assess a feature request against a codebase | draft |
| `playbooks/implementation-orchestration/` | `implement` | Execute a validated plan across a fleet of build agents | draft |
| `playbooks/build-to-release/` | `implement` | Idea → release-ready through 13-phase gated pipeline | draft |
| `playbooks/issue-to-pr/` | `implement` | GitHub issue → merged PR (gated or continuous) | draft |
| `playbooks/readiness-cycle/` | `release` | Existing artifact → verified-ready or blocked with fix plan | draft |
| `playbooks/adversarial-code-review/` | `review` | Adversarial code review on git changes; minimum 3 findings | validated |
| `playbooks/retrospective/` | `capture` | Retro on completed work; lessons, SMART action items | draft |
| `playbooks/agent-installer/` | `ideate` | Build a multi-platform agent installer with TUI | draft |

## Footgun — Overlapping triggers

Playbooks share trigger language. "Review a spec", "review a release", "review a PR" all contain "review" and route to different playbooks (`readiness-cycle`, `adversarial-code-review`). Trigger keywords are not a signal — the *object* of the trigger is.

Disambiguation rule when multiple playbooks match:

1. Read each candidate's `When to use` AND `Not for` sections in its `README.md`.
2. Match the task's object (the thing being acted on) against the playbook's stated scope, not the verb alone.
3. If `Not for` in one candidate excludes the task, drop it.
4. If two candidates still match, apply the priority rule.
5. If still tied, surface both with the disambiguating sentence from each `When to use` and let the user pick.

Example: "review this codebase against our spec"
- Candidate A: `readiness-cycle` — object: existing artifact → verified-ready. Task is codebase-vs-spec verification. Partial match — scope is artifact readiness, not spec compliance.
- Candidate B: `adversarial-code-review` — object: git changes. `Not for`: reviewing without a finite requirement list. Task has a doc as the requirement list. Match.
- Route: B.

## Routing examples

**Task:** "I have a GitHub issue and want to ship it as a PR."
→ `playbooks/issue-to-pr/` (intent: `implement`). Chains issue-to-ready-specs → raa → implementation-orchestration. Status: draft — confirm preconditions before starting.

**Task:** "I have three architecture options, can't decide."
→ `playbooks/decision-making/` (intent: `ideate`). MCDA-based ranking. Status: draft.

**Task:** "Run an adversarial review on this PR's diff."
→ `playbooks/adversarial-code-review/` (intent: `review`). Minimum 3 findings, fix menu. Status: validated.

**Task:** "Turn this brainstorm into a product brief."
→ `playbooks/product-brief/` (intent: `ideate`). Fills the brainstorm→plan gap. Status: validated.

**Task:** "We finished a project phase, want to retro."
→ `playbooks/retrospective/` (intent: `capture`). Lessons, SMART action items. Status: draft.

**Task:** "Take this existing spec from draft to verified-ready."
→ `playbooks/readiness-cycle/` (intent: `release`). Chains raa → implementation-orchestration → review. Status: draft.
