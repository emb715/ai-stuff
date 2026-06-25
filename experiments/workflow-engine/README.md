---
title: "workflow-engine"
status: draft
confidence: low
last_tested: 2026-06-25
scope: personal
tooling:
  - "opencode/claude-sonnet-4-6"
tags:
  - experiment
  - workflow
  - mcp
  - web
owner: "@ezequielbenitez"
---

# Context / Problem

AI development sessions are discrete and stateless. Each session starts from zero. The prompt-factory skill can generate the right prompt for any phase of a development cycle, but there is no engine to sequence phases, track what happened, hold state between sessions, or advance a plan end-to-end without manual coordination overhead.

A workflow engine would take a plan and a user-defined step sequence, execute each step using the right prompt, track state, review outputs, and surface the next action — removing the coordination burden from the user entirely.

# Scope

This experiment covers:
- Workflow schema: how steps are defined (type, shape, advancement rules, on-fail behavior)
- State model: what gets tracked per workflow, per phase, per session
- MCP server interface: tools exposed to sessions for state read/write
- Web UI surface: visual workflow builder, state inspector, tool/skill/module registry
- Composable module architecture: steps, tools, skills, and workflows as pluggable units

Out of scope:
- Building the actual implementation sessions (those still run in the AI tool of choice)
- Replacing prompt-factory (it becomes a component inside the engine)
- Hosting, auth, multi-user, or team features

# Hypothesis

A workflow engine with a web-based visual surface can reduce the coordination overhead of multi-session AI development cycles to near-zero by:
1. Holding state between sessions via an MCP server
2. Generating the right prompt for each phase via prompt-factory skill
3. Giving the user a visual view of workflow progress, phase outputs, and next actions
4. Allowing workflows to be composed from typed, pluggable step modules

Evidence basis: not yet tested. Success criteria defined in Next step section.

# Setup

## Architecture layers

### 1. Workflow schema
User-defined step sequence for a plan. Each step is typed:

```yaml
workflow:
  plan: path/to/plan.md
  steps:
    - type: plan-refine
      advancement: auto          # advance when stop condition met
    - type: implementation
      shape: strict
      advancement: require-review
      on-fail: stop
    - type: review
      advancement: require-approval
    - type: implementation
      shape: fast
      advancement: auto
      on-fail: retry
    - type: review
      advancement: require-approval
```

Advancement modes:
- `auto` — advance when phase output meets the type's stop condition
- `require-review` — engine runs a review check on output before advancing
- `require-approval` — user must explicitly approve before advancing

On-fail modes:
- `retry` — re-run the phase
- `stop` — halt workflow, surface blocker
- `escalate` — surface to user with context for manual decision

### 2. State model

Per workflow:
- workflow id
- plan path
- step sequence
- current step index
- workflow status: `pending | running | blocked | done`

Per step:
- step type + shape
- status: `pending | running | done | failed | skipped`
- prompt generated (output from prompt-factory)
- session output (what the session returned)
- advancement decision + rationale
- blockers surfaced

### 3. MCP server

Tools exposed to sessions:

| Tool | Purpose |
|---|---|
| `get_workflow` | Return current workflow state |
| `get_current_step` | Return current step + generated prompt |
| `report_step_output` | Session posts its output back |
| `advance_step` | Engine evaluates output and advances if conditions met |
| `block_workflow` | Surface a blocker that requires user decision |
| `get_next_prompt` | Return the next step's generated prompt |

### 4. Web UI

Visual surface — composable modules:

- **Workflow builder** — drag-and-drop step sequence, configure each step (type, shape, advancement, on-fail)
- **State inspector** — live view of workflow progress, current step, phase outputs
- **Prompt viewer** — view the generated prompt for each step before/after running
- **Tool registry** — browse available tools, skills, and step types; add to workflow
- **Session log** — per-step output history, advancement decisions, blockers
- **Module composer** — combine tools, skills, steps into reusable workflow templates

All modules are independently usable — not a monolithic dashboard. Each module can be mounted standalone or composed with others.

# Procedure

Not yet run. See Next step.

# Observations

Not yet collected.

# Results

Not yet measured.

# Conclusion

Inconclusive — experiment not yet run.

# Next step

1. Design MCP server tool interface in detail (input/output schemas for each tool)
2. Design workflow schema in full (all step types, advancement rules, validation)
3. Design web UI module architecture (component contracts, state sharing between modules)
4. Build minimal MCP server with `get_current_step` + `report_step_output` + `advance_step`
5. Run one real workflow manually against a real plan using the MCP server for state
6. Record: did state tracking eliminate re-investigation overhead? did advancement logic hold?
7. If successful: design web UI in detail and scope build

# Failure Modes / Boundaries

- MCP state model may be insufficient for complex branching workflows (conditional steps, parallel steps)
- Web UI composability depends on a clean state contract between modules — if state is coupled, modules are not truly independent
- prompt-factory integration assumes plan data is always extractable — fails if plan is poorly structured
- advancement logic for `auto` mode depends on evaluating session output against stop conditions — LLM-evaluated advancement may be inconsistent
- scope risk: web UI is large; must stay in experiment until MCP state model is validated first
