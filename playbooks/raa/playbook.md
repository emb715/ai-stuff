Research, Analyze, and Assess a feature request or change against a codebase. Produce a validated, file-scoped, implementation-ready plan that the [implementation-orchestration](../implementation-orchestration/playbook.md) playbook can consume directly. The output is a plan, not code.

## Trigger

A feature request, issue, bug report, or change request needs a plan before implementation. The input is a description of what to build. The output is a phased plan with file-level scope, named risks, a handoff ledger, and an effort estimate.

If a plan already exists, skip to the readiness loop ([loop-implementation-readiness](../../prompts/loop-implementation-readiness/) prompt) to validate it against the codebase.

## Preconditions

- A description of the feature/change (issue text, user request, PRD section, or verbal description)
- A codebase to research against (git repo, working directory)
- Access to at least one agent capable of reading files and searching code (or a human doing it manually)

## Principles

- **Evidence over assumption.** Base every conclusion on evidence with file:line anchors. Do not proceed on assumption; if evidence is insufficient, say so.
- **Three perspectives, one output.** Research (what exists), Analysis (what's wrong with what exists), Assessment (what to build and how). Each perspective feeds the next. Synthesize the output; do not concatenate.
- **The plan is the product.** ASCII diagrams, prose summaries, and estimates are presentation layers. The core output is: phases, file-level scope per phase, dependency graph, handoff ledger, risk register. If the plan cannot be consumed by [implementation-orchestration](../implementation-orchestration/playbook.md), it failed.
- **Stop at the plan.** Do not write code. Do not create branches. Do not modify files. The plan is the last artifact this playbook produces.
- **Agent-agnostic.** Operate by role, not by fleet. Each step names a role (Researcher, Analyst, Architect); dispatch that role to whatever agent your fleet provides for it, or run it yourself in solo mode (one agent or human doing the three perspectives sequentially in data-flow order).

## Step 1 — Research (what exists)

Map the codebase surface area relevant to the feature — every file, type, function, schema, and pattern the feature will touch or depend on.

### How to research

Read files. Search for symbols, types, imports. Trace data flow from DB → query → API → component → render. Do not guess — read the actual code.

### Research output contract

The research output is a structured map, not prose. The template below is the binding spec — each section carries what to find and how to record it:
```
## Research Map

### Entry points
// where does the feature's domain live? (components, routes, API endpoints, pages)
- [file:line] [symbol] — [what it does] — [reusable | modify | gap]

### Data layer
// schemas, models, queries, services, types the feature reads or writes
- [file:line] [symbol] — [what it does] — [reusable | modify | gap]

### Existing patterns (reusable)
// how does the codebase solve similar problems? (search, filtering, pagination, badges — whatever the feature needs)
- [file:line] [symbol] — [pattern it provides] — how the feature can reuse it

### Gaps (must build)
// what's missing that the feature requires? (no search procedure, no badge component, no route loader)
- [what's missing] — [why it's needed] — [where it should live]

### Constraints
// what patterns MUST be followed? (tRPC vs oRPC, Prisma vs Convex, zustand vs route context)
- [constraint] — [evidence: file:line]
```

### Parallel research

If a fleet is available, dispatch multiple research agents in parallel, each scoped to a different layer:
- Agent A: UI layer (components, routes, hooks)
- Agent B: Data layer (queries, services, types, schema)
- Agent C: Existing patterns (search, filter, pagination, badge — whatever the feature needs)

Merge the sections after all agents return.

If solo, read files in this order: schema → queries → services → types → API/router → components → routes (data flow downhill).

## Step 2 — Analyze (what's wrong with what exists)

Assess the quality of the files and patterns the research identified. Find blockers, tech debt, and structural issues that would complicate the feature — before the plan is written.

### Severity classification

| Tier | Meaning | Action |
|------|---------|--------|
| P0 | Blocks the feature — must be fixed in the plan | Plan must include a fix |
| P1 | Complicates the feature — should be fixed | Plan should include a fix or a workaround |
| P2 | Code quality — nice to fix | Plan may include as a phase 4+ item |
| P3 | Style — not blocking | Not in the plan |

### Analysis output contract

The template below is the binding spec — each section carries what to assess and how to record it. For each file in the research map:

```
## Analysis Findings

### P0 — Blockers
// does the file's current state prevent the feature? (unbounded query, missing type field, hardcoded value, no call site for an existing function)
- [file:line] [what's wrong] [why it blocks] [suggested fix]

### P1 — Complications
// will the feature require working around existing debt? (duplicated markup, inline components that should be shared, missing pagination)
- [file:line] [what's wrong] [impact] [suggested fix or workaround]

### P2 — Tech debt (address during feature)
// code quality issues nice to fix alongside the feature
- [file:line] [what's wrong] [suggested fix]

### Patterns to follow
// what conventions does the file establish? (how search inputs work, how badges render, how route loaders are structured)
- [pattern name] — [file:line] — [how it works] — [how the feature should use it]

### Files to extract/refactor
// what needs to be refactored before or during the feature? (shared component extraction, type extension)
- [file:line] [what to extract] [where to put it] [which phase]
```

### Parallel analysis

If a fleet is available, dispatch a review agent with the research map as context. The agent reads the files the research identified and produces the analysis findings. It does NOT re-discover files — it works from the research map.

If solo, re-read the files from the research map with a critical eye. Focus on: what would break if the feature were added today?

## Step 3 — Assess (what to build and how)

Synthesize the research and analysis into an implementation plan. Consume the research map and analysis findings and produce the plan.

### Architectural decision format

Each decision in the plan follows this structure:

```
### Decision: [name]
**Choice:** [what was chosen]
**Alternatives considered:** [what was rejected and why]
**Rationale:** [why this choice — cite research map evidence]
**Impact:** [what files/patterns this decision affects]
```

### Plan output contract

The plan MUST be structured so the [implementation-orchestration](../implementation-orchestration/playbook.md) playbook can parse it directly. The template below is the binding spec — each section carries what to produce and how to record it:

```
## Implementation Plan — [feature name]

### Phase 1 — [name] (estimate: X SP)
// ordered phases with dependencies: what changes, why this order, what runs in parallel, architectural decisions
**Why first:** [dependency reason]

#### Stream 1A — [name]
- Files: [file1], [file2]
- Changes: [what to do in each file]
- Depends on: [none | Stream 1B]

#### Stream 1B — [name]
- Files: [file3]
- Changes: [what to do]
- Depends on: [none | Stream 1A]

**Parallelism:** 1A ‖ 1B (disjoint files) | 1A → 1B (shared file or dependency)

### Phase 2 — [name] (estimate: X SP)
**Depends on:** Phase 1
...

### File-overlap matrix
// which streams within and across phases touch the same files — consumed by the orchestration playbook's parallelism rules
| File | Phases touching | Constraint |
|------|----------------|------------|
| [file] | P1, P3 | Serialize: P1 → P3 |

### Handoff ledger
// agents to dispatch after or during implementation: blocking (before next phase), conditional (if a risk materializes), non-blocking (batch after all phases)
| Agent | Source | Phase | Trigger | File | Description | Classification |
|-------|--------|-------|---------|------|-------------|----------------|
| tester | review | P1 end | after procedures exist | router.ts | coverage for new endpoints | non-blocking |
| optimizer | review | P1 end | if query is slow | queries.ts | add index | conditional |

### Risk register
// named risks with inflation estimates: risk description, impact (SP), probability, mitigation, handoff trigger
| Risk | Impact | Probability | Mitigation | Handoff trigger |
|------|--------|-------------|-----------|-----------------|
| [risk] | +X SP | medium | [what to do] | [which conditional handoff] |

### Effort estimate
// story points per phase (Fibonacci: 1, 2, 3, 5, 8, 13): phase totals, total, confidence level + reasoning, worst case (total + all risk inflations)
| Phase | SP |
|-------|-----|
| 1 | X |
| 2 | X |
| **Total** | **X** |
| **Worst case** | **X + Y** |

**Confidence:** [high/medium] — [reasoning]
```

Optional: an ASCII layout of the proposed UI (if UI changes) may be added. This is presentation, not specification — it helps humans visualize but is not consumed by the orchestration playbook.

### Parallel assessment

If a fleet is available, dispatch an architect agent with BOTH the research map and analysis findings as context. The architect does not re-read files unless it needs to verify a specific claim from research or analysis.

If solo, synthesize the research and analysis into the plan format above. At each decision point, ask "What does the research evidence say?" — not "What seems best?"

## Step 4 — Hand off

The plan is the final output. Route it to:

1. **Loop-implementation-readiness** — validate the plan against the codebase (confirm every claim has a real code anchor).
2. **Implementation-orchestration** — execute the plan across build agents.
3. **Human review** — if the feature is complex or high-stakes, route the plan to the human before any code is written.

Order: RAA → readiness loop → (human approval if needed) → orchestration.

## Stop conditions

- **PLAN READY:** The plan is complete (all sections filled), passes the verification checklist, and is ready for the readiness loop.
- **BLOCKED:** Research or analysis found a fundamental issue that prevents planning — the feature conflicts with an existing architectural decision, the request is infeasible (critical dependency doesn't exist and can't be built) OR already satisfied (feature already exists, wrong repo, impossible dependency). Surface the blocker with: what's missing or duplicated, why it blocks, and the smallest action that would unblock.
- **SCOPE TOO LARGE:** The feature is too complex for a single plan. Break it into sub-features and run RAA on each. Signal this with: what the sub-features are, which one to start with, and why the others depend on it.

## Never

- Let the architect re-do research or analysis work. The architect consumes the prior outputs; it does not regenerate them.
- Produce a plan without file-level scope. "Update the list component" is not file-level scope. "Modify `src/components/list.tsx` lines 35-44 to replace client-side filtering with a server query" is.
- Produce an estimate without a confidence level. "8 SP" is meaningless without "medium confidence because query performance at the expected row count is unknown."

## Agent fleet mapping

Dispatch per each step's Parallel subsection; solo mode runs steps sequentially in data-flow order. The steps dispatch by role.

## Verification checklist

Before declaring PLAN READY:

- [ ] Research map covers: entry points, data layer, existing patterns, gaps, constraints
- [ ] Every finding has a file:line anchor
- [ ] Analysis classified all findings (P0/P1/P2/P3)
- [ ] Every P0 has a suggested fix
- [ ] Plan has phases with ordered dependencies
- [ ] Each phase has streams with file-level scope
- [ ] File-overlap matrix is complete
- [ ] Handoff ledger has triggers and classifications
- [ ] Risk register has inflation estimates
- [ ] Effort estimate has confidence level + worst case
- [ ] Every gap from research is addressed in a phase
- [ ] Every P0 from analysis is fixed in a phase