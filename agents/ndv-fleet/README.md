---
title: "neurodiveragents Fleet"
status: validated
confidence: high
last_tested: 2026-07-31
scope: global
tooling:
  - "opencode"
  - "claude-code"
  - "cursor"
  - "github-copilot"
tags:
  - external
  - agent
  - fleet
  - orchestration
  - neurodiveragents
owner: "@emb715"
---

# neurodiveragents Fleet

A fleet of 18 neurotype-based specialist agents that decompose, route, and execute work across domains. Each agent has a distinct cognitive profile optimized for a specific task type. The orchestrator (`ndv-flow`) decomposes multi-step work and routes subtasks to the right specialist.

**External source:** https://github.com/emb715/neurodiveragents

## Context / Problem

A single general-purpose agent accumulates context across an entire session — every file read, every tangent, every dead end persists in the conversation. Token costs grow quadratically; attention degrades. Specialist agents that handle one task and return a bounded summary keep the orchestrator's context clean.

## Scope

Global — works across any project. Installed via `npx neurodiveragents install <platform>`. The routing table is injected into the project's agent config (e.g. `~/.config/opencode/rules/ndv.md` for OpenCode). The fleet does not live in this repo; this entry documents its usage and evidence.

## When to use

- Any session involving code review, debugging, architecture, testing, security, performance, refactoring, design, or documentation
- Multi-task workloads that benefit from decomposition and parallel execution
- Sessions where token efficiency matters (specialist subagents have bounded context; the orchestrator never implements)

## Fleet members

| Agent | Domain | Cognitive profile |
|---|---|---|
| ndv-review | Code review, PR, quality | Total perception — registers every inconsistency |
| ndv-diagnose | Bugs, stack traces, root cause | Skeptical — assumes nothing, confirms causes |
| ndv-build | Implementation from spec | Contract-first, merge-surface-aware |
| ndv-refactor | Rename, restructure, modernize | Pattern-following, minimal-change |
| ndv-tester | Tests, coverage, correctness | Adversarial — assumes code is lying |
| ndv-secure | Security, OWASP, auth | Hypervigilant — treats every input as attack vector |
| ndv-optimize | Performance, latency, bundle | Waste-intolerant — measures before and after |
| ndv-telemetry | Logging, metrics, tracing | Detached observation — additive only |
| ndv-architect | System design, SOLID | Structural — needs internal consistency |
| ndv-explain | Docs, API reference, notes | Reader-modeling — bridges knowledge gaps |
| ndv-design | UI structure, visual hierarchy | Perceptual — reads code as rendered output |
| ndv-accessibility | WCAG, ARIA, a11y | Universal design — exclusion is intolerable |
| ndv-honest | Direct answers, no filler | Zero-filler communication |
| ndv-flow | Orchestration, decomposition | Routes work, never implements |
| ndv-scope | Scope enforcement | Boundary intolerance |
| ndv-forecast | Estimation, timelines | Temporal dysphoria — "almost done" is a trap |
| ndv-signal | Metrics, KPIs, OKRs | Goodhart's Law — measures vs targets |

## Routing

Conflict resolution uses highest-priority match:
1. Stack trace / exception / failing test → ndv-diagnose (even if code is auth/payment)
2. Explicit vulnerability/audit/exploit language → ndv-secure
3. Explicit performance/latency/slow language → ndv-optimize
4. Ambiguous → diagnose first, then hand off
5. No specialist match → ndv-honest (pure communication, not a router)

## Evidence / Results

- Used across 20+ sessions in this repo and others. Observed: orchestrator context stays bounded; subagent summaries return 200-400 tokens vs. thousands for equivalent monolithic sessions.
- Parallel dispatch of independent tasks (e.g. 3 file reviews) completes in one round-trip vs. three sequential ones — ~64% input token reduction on a representative 18-turn session.
- The fleet's routing table (in `~/.config/opencode/rules/ndv.md`) auto-routes based on task signal without user intervention — stack traces trigger ndv-diagnose, "it's slow" triggers ndv-optimize, PRs trigger ndv-review.

## Failure Modes / Boundaries

- Subagents have no conversation history — every dispatch must pass full context in the prompt. Omitting context produces incorrect or incomplete results.
- The orchestrator (ndv-flow) never implements; routing implementation work to it wastes a round-trip.
- Some agents overlap (ndv-honest vs ndv-direct skill) — the routing table resolves most cases, but ambiguous tasks may need explicit agent selection.
- Fleet updates are external; this entry documents a snapshot. Check the source repo for current agent list and routing rules.

## Related Links

- Source: https://github.com/emb715/neurodiveragents
- Token efficiency analysis: https://github.com/ezequielbenitez/neurodiveragents/blob/main/docs/token-efficiency.md
- Installation: `npx neurodiveragents install <platform>` (claude, opencode, cursor, copilot)