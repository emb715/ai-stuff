---
title: "Change Impact Checklist"
status: validated
confidence: medium
last_tested: 2026-06-27
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - reference
  - checklist
  - change-management
  - impact-analysis
owner: "@ezequielbenitez"
---

# Change Impact Checklist

## Context / Problem

When a significant change surfaces mid-project — a technical limitation, a new requirement, a misunderstanding, a strategic pivot, or a failed approach — the temptation is to react immediately. Without systematic impact assessment, changes ripple unpredictably through planned work, artifacts, and dependencies. This checklist forces a structured assessment before any changes are made.

## Scope

Use for significant changes that affect project direction. Not for minor task-level adjustments that don't ripple beyond the current work unit.

## When to use

A change trigger has been identified:
- Technical limitation discovered during implementation
- New requirement emerged from stakeholders
- Misunderstanding of original requirements
- Strategic pivot or market change
- Failed approach requiring different solution

## Checklist

### 1. Understand the trigger

- **1.1** Identify the triggering event — what surfaced this need for change? (task ticket, stakeholder feedback, technical discovery, failed implementation)
- **1.2** Define the core problem precisely. Categorize:
  - Technical limitation discovered during implementation
  - New requirement emerged from stakeholders
  - Misunderstanding of original requirements
  - Strategic pivot or market change
  - Failed approach requiring different solution
- **1.3** Gather supporting evidence — concrete examples, error messages, stakeholder feedback, technical constraints. No evidence = no analysis.

**Halt if:** trigger is unclear or no evidence provided.

### 2. Planned work impact

- **2.1** Can current work be completed as originally planned? If no, what modifications?
- **2.2** What work-unit-level changes are needed? (modify scope, add new work, remove/defer, redefine)
- **2.3** Review all remaining planned work for impact. Identify affected dependencies.
- **2.4** Does this change make any planned work obsolete? Are new work units needed to address gaps?
- **2.5** Should priorities or sequencing change based on this issue?

### 3. Artifact impact

- **3.1 Requirements docs** — does this conflict with core goals? Do requirements need modification, addition, or removal? Is the defined scope still achievable?
- **3.2 Architecture docs** — check each for impact: system components, patterns, tech stack, data models, API designs, integration points
- **3.3 UI/UX specs** — check: UI components, user flows, interaction patterns, accessibility
- **3.4 Other artifacts** — deployment scripts, infrastructure, monitoring, testing strategy, documentation, CI/CD

### 4. Path forward

- **4.1 Direct adjustment** — can the issue be addressed by modifying existing work? Can new tasks be added within the current structure? Effort: [H/M/L]. Risk: [H/M/L].
- **4.2 Rollback** — would reverting recently completed work simplify addressing this? Is the rollback effort justified? Effort: [H/M/L]. Risk: [H/M/L].
- **4.3 Scope review** — is the original scope still achievable? What gets deferred? Effort: [H/M/L]. Risk: [H/M/L].
- **4.4 Select path** — based on effort, risk, momentum, long-term sustainability, stakeholder expectations. Document rationale and trade-offs.

### 5. Change proposal

- **5.1** Issue summary — clear problem statement with discovery context
- **5.2** Impact summary — what changes are needed and why (from sections 2 + 3)
- **5.3** Recommended path with rationale — selected approach, alternatives considered, trade-offs
- **5.4** Action plan — major items, dependencies, sequencing
- **5.5** Responsibility assignment — who executes what

### 6. Final review

- **6.1** Verify all applicable sections addressed
- **6.2** Verify proposal is consistent, well-supported, and actionable
- **6.3** Obtain explicit approval — present proposal, get yes/no, document any conditions
- **6.4** Confirm next steps — review responsibilities, timeline, success criteria

**Halt if:** analysis incomplete, approval not obtained, or responsibilities unclear.

## Evidence / Results

Extracted from a sprint change management workflow. The original was coupled to a specific project management framework (story files, sprint-status tracking, agent manifests). The checklist structure — trigger understanding, work impact, artifact impact, path evaluation, proposal, approval — is the portable core. The bmad-specific tracking and artifact references were generalized.

## Failure Modes / Boundaries

- This checklist is for significant changes. Using it for minor task-level adjustments adds process overhead without value.
- Section 3 (Artifact impact) assumes specific artifact types exist (requirements docs, architecture docs, UI/UX specs). If a project lacks some of these, mark N/A rather than skipping the section — the act of confirming "no artifact affected" is itself valuable.
- The halt conditions are non-negotiable. Proceeding without a clear trigger, evidence, or approval produces analysis that looks thorough but is built on assumptions.
- This is a reference checklist, not an automated procedure. It requires a human (or agent with human oversight) to work through each section interactively.
