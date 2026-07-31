# EXPLAIN — a tour of what's in this vault

You're looking at a curated AI knowledge base. Not a notes dump — a vault of artifacts (prompts, playbooks, skills, tools, agents) that have been tested in real sessions, tagged with status and confidence, and gated by a linter that rejects anything without evidence.

This document is a tour. For operational use (browse → pick → consume), see [USAGE.md](USAGE.md). For the full index, see [README.md](README.md).

---

## The story

Every artifact here solves a real problem I hit in AI-assisted work: planning docs that weren't ready to build from, code that didn't match the spec, sessions that produced knowledge but didn't capture it, PRs that shipped without adversarial testing. The vault is the durable output of fixing those problems — not the fixes themselves, but the reusable procedures and prompts that prevent them next time.

Artifacts progress through a lifecycle: `experiments/` (untested) → `validated` (tested once with documented result) → `vetted` (repeatable, bounded, approved for reuse). The status on each artifact tells you how much to trust it.

---

## Agents

### [honest](agents/honest/) — `validated`

A system prompt that strips out social filler. No "I understand", no "that's interesting", no emotional cushioning. Direct answers, challenge wrong assumptions, accuracy over agreeableness. Load it at session start when you need unfiltered signal, not a yes-man.

---

## Prompts

Copy-paste instruction text scoped to a task or a few turns.

### [loop-prd-readiness](prompts/loop-prd-readiness/) — `validated`

Takes a planning document (PRD, spec, ADR) that's not ready to build from and loops it to readiness. Each round finds the highest-risk gap and fixes it with the smallest possible edit. Two independent reviews must agree before it stops. Use when the doc exists but you keep finding unknowns mid-implementation.

### [loop-implementation-readiness](prompts/loop-implementation-readiness/) — `validated`

The inverse of the above. Takes a codebase and verifies it against a source-of-truth planning doc. Each round picks the highest-risk unresolved requirement, maps it to code evidence, and defines the smallest action to close the gap. Run `loop-prd-readiness` first to make the doc solid, then this to verify the build matches it.

### [knowledge-extraction](prompts/knowledge-extraction/) — `validated`

Mines a completed work session for durable knowledge — skills, ADRs, gotchas, security constraints. Doesn't summarize what happened; extracts what should change how future sessions behave. You approve before anything is written. Run this at the end of a session that produced real learning.

### [repo-primitive-audit](prompts/repo-primitive-audit/) — `validated`

Maps a repo's primitives from source code, breaks down each section, then runs an adversarial review against the map. Forces a complete map before any review — so the review operates against the actual structure, not an assumed one. Use when you need to understand a codebase before changing it.

### [review-release-candidate](prompts/review-release-candidate/) — `draft`

Builds a release-candidate review harness. Inventories every user-facing surface against its acceptance criteria, verifies each as a real user would, captures concrete evidence for defects and deviations, triages by root cause, and gates fix batches with regression tests until all P0/P1 criteria pass. Use before shipping anything with user-facing surfaces.

### [ai-stuff-command-installer](prompts/ai-stuff-command-installer/) — `validated`

Registers `/ai-stuff` as a command in your LLM harness so you can browse this vault without pasting USAGE.md every time. Remote (fetch from GitHub) or local (read from a clone). Tested in OpenCode. Use when you want permanent access to the vault from any project.

---

## Playbooks

Multi-step procedures for recurring operational tasks.

### Planning and decisions

#### [brainstorming](playbooks/brainstorming/) — `validated`

Facilitates interactive brainstorming with 61 techniques across 10 categories. Keeps you in generative mode, aims for 100+ ideas before organizing, produces themed and prioritized action plans. Standalone — no dependencies on other artifacts. Use at the start of any new feature or problem.

#### [decision-making](playbooks/decision-making/) — `draft`

Takes N options (from brainstorming or anywhere) and produces a ranked shortlist using multi-criteria decision analysis. Scores each option against your criteria, computes weighted totals, runs a sensitivity check. Fills the gap when brainstorming produces too many options and you need structured convergence.

#### [product-brief](playbooks/product-brief/) — `validated`

Turns brainstorm output or a rough idea into a structured product brief. Five sections — problem, users, success, scope, constraints — each confirmed before moving on. The output feeds directly into spec writing. Use after brainstorming, before specs.

#### [quick-spec](playbooks/quick-spec/) — `validated`

Creates one implementation-ready spec through discovery and code investigation. Enforces a six-criterion Ready-for-Development standard: Actionable, Logical, Testable, Complete, Self-contained, Consistent. A spec that fails any criterion is not handed off. Use when a single feature needs a spec.

#### [issue-to-ready-specs](playbooks/issue-to-ready-specs/) — `draft`

Turns a GitHub issue into a complete spec suite — PRD plus N implementation specs — in one session. Chains product-brief and quick-spec with research, architecture, handoff resolution, and a readiness audit. Use when an issue needs the full spec treatment, not just one spec.

### Implementation and release

#### [raa](playbooks/raa/) — `draft`

Research, Analyze, Assess. Takes a feature request or change description and produces a validated, file-scoped, implementation-ready plan. The output is a plan, not code. Use when the work is complex enough to need phased planning before implementation.

#### [implementation-orchestration](playbooks/implementation-orchestration/) — `draft`

Executes a validated plan across a fleet of build agents. The plan is the input — readiness is assumed. The output is a committed, reviewed, CI-green branch ready for merge. Use after raa or any process that produces a phased, file-scoped plan.

#### [build-to-release](playbooks/build-to-release/) — `draft`

The full pipeline: idea → proof-of-concept → brief → specs → readiness → implement → handoffs → review → fix-loop → adversarial → release. 13 phases, each gating the next. An orchestrator that chains the playbooks and prompts above rather than replacing them. Use for large work that spans the full path from risk verification through shipped, adversarially-proven implementation.

#### [issue-to-pr](playbooks/issue-to-pr/) — `draft`

Chains issue-to-ready-specs → raa → implementation-orchestration into one full-cycle playbook: GitHub issue to merged PR. Optional human review gates between phases (gated mode) or trust the chain end-to-end (continuous mode). Use when you want the full cycle automated.

#### [readiness-cycle](playbooks/readiness-cycle/) — `draft`

Takes an existing artifact (template, repo, package) from "is it ready to share?" to "verified ready or blocked with a fix plan." Chains raa → implementation-orchestration → review-release-candidate. Loops until the verifier says ship, or you explicitly defer the remaining gaps. Use before open-sourcing or releasing anything.

#### [request-triage](playbooks/request-triage/) — `draft`

Routes a raw request to the correct planning artifact. Two paradigms: spec (quick-spec, issue-to-ready-specs) or plan (raa, build-to-release). Does not execute — only routes. Use when a request arrives and you don't know which playbook to run.

### Review and reflection

#### [adversarial-code-review](playbooks/adversarial-code-review/) — `validated`

Adversarial review on git changes. Cross-references git reality against task/AC claims, validates implementation, checks code and test quality, produces categorized findings with a fix menu. Minimum-3-findings rule — no lazy "looks good" reviews. Use on any PR before merge.

#### [retrospective](playbooks/retrospective/) — `draft`

Socratic-extractive retrospective on completed work. The agent facilitates ownership of lessons (you state them, it asks) and handles bookkeeping (follow-through status, readiness, recap). Produces SMART action items. Use after a milestone or project phase.

---

## Skills

Capability packages that shape LLM behavior for a specific domain.

### [prompt-factory](skills/prompt-factory/) — `validated`

Generates ready-to-paste prompts from plan docs or session context. Guides through plan-source confirmation, type selection, and style selection before generating output. Supports shorthand arguments to skip menus. Use when you need a prompt for a specific task and want it structured correctly the first time.

### [skill-authoring](skills/skill-authoring/) — `draft`

Process for turning any library, framework, or tool into a well-structured agent skill. Covers the full lifecycle: gather the source of truth, find the footgun, decide structure, write affirmatively for a model reader, evaluate before shipping. Use when you want to create a skill for a tool you use regularly.

### [change-impact-diagram](skills/change-impact-diagram/) — `validated`

Diagrams how a code change impacts the system and its primitives. Four diagram types — system map, decision graph, state map, endpoint interaction — rendered in mermaid + tables. Three output modes: PR description (recap), repo markdown (plan), chat message (chat). Use when you need to communicate what a change touches.

---

## Tools

Deployable technical artifacts.

### [change-impact](tools/change-impact/) — `validated`

Runs the change-impact-diagram skill automatically on PRs or locally. Produces a marker-delimited visual impact block and upserts it into the PR description. LLM-agnostic — detects and uses whatever LLM is available (Anthropic, OpenAI, Fuelix, Omniroute, Ollama, claude CLI, or a self-contained prompt bundle fallback). Use when you want impact diagrams on every PR without manual invocation.

---

## How they connect

The artifacts form a pipeline. Not every project needs every stage, but the stages are ordered:

```
brainstorming → decision-making → product-brief → quick-spec / issue-to-ready-specs
                                                              ↓
                                              loop-prd-readiness (make doc build-ready)
                                                              ↓
                                              raa (plan) or build-to-release (full pipeline)
                                                              ↓
                                              implementation-orchestration → adversarial-code-review
                                                              ↓
                                              review-release-candidate / readiness-cycle
                                                              ↓
                                              retrospective → knowledge-extraction
```

Entry points by situation:
- **New feature, no plan yet:** brainstorming → product-brief → quick-spec
- **GitHub issue, need specs:** issue-to-ready-specs
- **Plan exists, not ready to build:** loop-prd-readiness
- **Build done, does it match the doc?:** loop-implementation-readiness
- **Ready to ship?:** review-release-candidate or readiness-cycle
- **Session produced real learning:** knowledge-extraction
- **Don't know where to start?:** request-triage

---

## Trust levels

| Status | Meaning |
|---|---|
| `validated` | Tested at least once with documented result |
| `draft` | Early idea; incomplete or untested |
| `vetted` | Repeatable, bounded, sanitized, approved for reuse |
| `deprecated` | No longer recommended |

The `last_tested` date on each artifact tells you when it was last confirmed working. Flag anything older than 90 days as stale before relying on it.

---

## Start here

- **Browse and consume:** paste [USAGE.md](USAGE.md) into any LLM session
- **Permanent command:** run the [installer prompt](prompts/ai-stuff-command-installer/prompt.md) to get `/ai-stuff` in your harness
- **Full index:** [README.md](README.md)