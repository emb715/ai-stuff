Create an implementation-ready technical specification through conversational discovery, code investigation, and structured documentation. A spec is ready for development only when it meets five criteria: Actionable, Logical, Testable, Complete, Self-contained.

## Trigger

User says "create a quick spec", "generate a tech spec", or you have a feature or change that needs an implementation-ready spec before development starts.

## Preconditions

- A feature description or change request (can be rough — the playbook sharpens it)
- Access to the existing codebase (the spec must reference real files and patterns)
- The user is available for clarification questions

## The Ready-for-Development standard

A spec is ready for development ONLY if all five are true:

- **Actionable** — every task has a clear file path and specific action. No "implement the UI" — instead "add `handleSubmit` to `src/components/Form.tsx` that calls `api.submit()`".
- **Logical** — tasks are ordered by dependency. Lowest level first (data models before API endpoints, endpoints before UI calls).
- **Testable** — all acceptance criteria follow Given/When/Then. Cover happy path AND edge cases. No untestable criteria.
- **Complete** — all investigation results inlined. No placeholders, no "TBD", no "to be determined during implementation".
- **Self-contained** — a fresh agent with no session history can implement the feature by reading the spec alone. No implicit context from the conversation.

If any criterion fails, the spec is not ready. Fix it before handing off.

## Step 1 — Understand the request

Ask the user:

1. What feature or change do you want to spec?
2. What problem does it solve? (the "why", not just the "what")
3. Any constraints? (performance, compatibility, must-use / must-not-use technologies)
4. Any existing code or patterns to follow?

Summarize back: "You want [feature] that solves [problem], with constraints [list], following [patterns]. Correct?"

If the user's description is vague, ask sharper questions before proceeding. Don't move to investigation with a fuzzy understanding — the spec will inherit the fuzziness.

## Step 2 — Investigate the codebase

Before writing anything, investigate the existing code to ground the spec in reality:

- **Find related files** — search for existing implementations of similar features, the files they touch, the patterns they follow
- **Identify integration points** — where does this feature connect? What APIs, data models, components, routes already exist?
- **Check conventions** — naming, file structure, error handling patterns, test patterns used in the codebase
- **Identify dependencies** — what libraries, utilities, services will this feature use? What versions?
- **Find potential conflicts** — does anything already do part of this? Are there naming collisions? Architecture constraints?

Record findings. These get inlined into the spec — a fresh agent needs them.

## Step 3 — Draft the spec

Structure:

```
# [Feature Name] — Technical Specification

## Problem
[1-2 sentences. What problem this solves and why.]

## Scope
[What's included. What's explicitly excluded.]

## Context
[Codebase findings from Step 2: related files, integration points, conventions, dependencies. Everything a fresh agent needs to understand the landscape.]

## Acceptance Criteria
AC1: Given [precondition], When [action], Then [result]
AC2: Given [precondition], When [action], Then [result]
[Cover happy path AND edge cases. Each AC must be testable.]

## Tasks
[Ordered by dependency — lowest level first]

1. [File path]: [specific action]
2. [File path]: [specific action]
3. [File path]: [specific action]
[Each task references a real file and a specific action. No vague "implement X".]

## Test Plan
- [How to verify each AC]
- [Edge cases to test]
- [Existing test patterns to follow]
```

## Step 4 — Validate against the standard

Run the Ready-for-Development check:

- [ ] **Actionable** — read every task. Does it name a file? Does it describe a specific action? If any task is vague, rewrite it.
- [ ] **Logical** — are tasks ordered by dependency? Does any task depend on a later task? Reorder.
- [ ] **Testable** — read every AC. Does it follow Given/When/Then? Are edge cases covered? If any AC is untestable, rewrite it.
- [ ] **Complete** — any placeholders? Any "TBD"? Any missing investigation results? Fill them in.
- [ ] **Self-contained** — could a fresh agent implement this without asking questions? If not, add the missing context.

If any check fails, fix the spec. Do not hand off a failing spec.

## Step 5 — Present and hand off

Present the spec to the user. State explicitly: "This spec passes the Ready-for-Development standard: [confirm each criterion]."

If the user requests changes, update and re-validate.

Once approved, the spec is ready for implementation — by the current agent, a fresh agent, or a human developer.

## Verification

- Every task has a file path and specific action
- Tasks are ordered by dependency (lowest first)
- Every AC follows Given/When/Then with edge cases
- No placeholders or TBDs
- Codebase findings are inlined in the Context section
- A fresh agent could implement from the spec alone

## Rollback / Fallback

- If the codebase is too large to investigate thoroughly → scope the investigation to the files most likely to be affected, note what was not checked
- If the feature is too complex for a single spec → split into multiple specs, each self-contained, cross-referenced
- If the user's description is too vague to spec → ask sharper questions, don't guess. A spec built on assumptions fails the Self-contained criterion.
- If the Ready-for-Development check fails after drafting → identify which criterion failed and fix specifically. Don't rewrite the whole spec — patch the gap.

## References

- Pair with `prompts/loop-prd-readiness/` to drive planning docs to readiness before speccing
