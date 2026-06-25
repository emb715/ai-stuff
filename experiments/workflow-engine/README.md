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

# Dependency artifacts

| Dependency | Location | Purpose |
|---|---|---|
| MCP architecture | `docs/references/mcp/architecture.md` | Protocol concepts, tool schema, lifecycle |
| MCP TypeScript SDK | `docs/references/mcp/typescript-server.md` | Scaffold, tool registration, stdio transport |
| prompt-factory skill | `skills/prompt-factory/` | Generates prompts per workflow step |

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

## MVP scope (validate core hypothesis with minimum code)

Web UI, module composer, tool registry, schema validation, multi-workflow support, and parallel/conditional steps are all deferred. None of them validate the core hypothesis.

### Before writing code

1. Fetch and save MCP official docs → `docs/references/mcp/`
2. Fetch and save MCP TypeScript SDK docs + scaffolding template → `docs/references/mcp/`
3. Define MCP tool interface (input/output schemas for all 4 tools) in this file
4. Define workflow schema (step definition format, advancement rules) in this file
5. Confirm state model is sufficient for a linear 3-step workflow

### Build

6. Scaffold MCP server using TypeScript SDK (stdio transport, local JSON state file)
7. Implement 4 tools only:
   - `get_current_step` → returns step type + generated prompt
   - `report_step_output` → session posts result
   - `advance_step` → evaluates output, advances or blocks
   - `get_workflow_status` → returns full state snapshot
8. Hardcode one workflow definition in a local JSON/YAML file — no builder, no UI

### Validate

9. Run one real workflow end-to-end through the MCP server:
   - Step 1: plan-refine
   - Step 2: implementation (default)
   - Step 3: review
10. Record after each step:
    - Did the session receive the right prompt without manual work?
    - Did state persist correctly between sessions?
    - Did advancement logic hold?
    - Did re-investigation overhead drop?

### Decision gate

- If all 3 steps pass → hypothesis confirmed → scope web UI design
- If state or advancement breaks → iterate on state model before web UI
- If prompt quality degrades through MCP → investigate prompt-factory integration path

# Failure Modes / Boundaries

- MCP state model may be insufficient for complex branching workflows (conditional steps, parallel steps)
- Web UI composability depends on a clean state contract between modules — if state is coupled, modules are not truly independent
- prompt-factory integration assumes plan data is always extractable — fails if plan is poorly structured
- advancement logic for `auto` mode depends on evaluating session output against stop conditions — LLM-evaluated advancement may be inconsistent
- scope risk: web UI is large; must stay in experiment until MCP state model is validated first
