# humans.md — quick-spec

## What this is

A standalone playbook for creating implementation-ready technical specifications. Enforces a six-criterion Ready-for-Development standard before handoff. Investigates the existing codebase to ground specs in real files, patterns, and integration points. Rewritten from a framework-specific workflow with all framework dependencies removed.

## Why it works

Three structural choices carry most of the value:

**The Ready-for-Development standard.** Six criteria, all load-bearing. Actionable (file paths, specific actions), Logical (dependency-ordered), Testable (Given/When/Then with edge cases), Complete (no placeholders), Self-contained (fresh agent can implement), Consistent (all sections describe the same implementation). This is a checklist you can apply to any spec, not just ones produced by this playbook. The standard is the most reusable element — it works as a review gate on specs from any source.

The sixth criterion, Consistent, was added after a real session where a spec amendment fixed a Task but left the Test Plan mocking the old query — per-section validation passed, cross-section consistency failed.

**Codebase investigation before writing.** The spec is grounded in reality — real files, real patterns, real integration points. A spec written without investigating the codebase produces tasks that reference files that don't exist, patterns that aren't used, and dependencies that aren't present. Investigation first prevents this.

**Self-contained as a criterion.** The hardest criterion to satisfy and the most valuable. A spec that requires session history to understand is not a spec — it's a conversation log. Forcing the spec to be self-contained means all context is in the document, which means any agent can implement it, which means the spec is portable across sessions and teams.

## Design decisions

- **No step-file architecture.** The original used 4 separate step files for a 3-step process (understand, investigate, draft). The rewrite is a single file with 5 steps. Same functionality, no file-loading overhead.
- **No tech-spec template file.** The original referenced a separate template file in a framework-specific format. The template is embedded in the playbook — it's simple enough that a separate file adds indirection without value.
- **No advanced-elicitation checkpoint.** The original had a checkpoint that invoked a separate advanced-elicitation workflow for deep-diving on questions. Cut — if the agent needs to ask deeper questions, it asks them inline.
- **No party-mode.** The original had a "party mode" protocol where multiple agent personas would discuss the spec. Cut — spec writing is a focused activity, not a committee discussion.
- **Validation as a separate step.** Step 4 (Validate against the standard) is deliberately separate from Step 3 (Draft). This forces the author to review their own spec against the criteria rather than drafting and declaring it ready in the same breath.
- **Spec template is a starting point.** The template covers the common case. The playbook explicitly notes that some features need additional sections (data models, API contracts, migration plans). The template is not rigid — it's a floor, not a ceiling.

## Origin

Rewritten from a quick-spec workflow. The original was a multi-file workflow using step-file architecture, config loading, advanced-elicitation checkpoints, and a party-mode protocol. The rewrite is ~90 lines of plain markdown with no framework dependencies.

Kept: the Ready-for-Development standard (the core value), conversational discovery, codebase investigation, the self-contained principle. Cut: step-file architecture, config loading, advanced-elicitation checkpoint, party-mode, tech-spec template file, frontmatter state tracking.

## Maintenance

- **If specs consistently fail the Self-contained criterion**, the Context section is too thin. Add a reminder in the session: "Include enough context that someone who has never seen this codebase could understand the landscape."
- **If the Actionable criterion fails frequently**, the agent is writing vague tasks. Strengthen the session instruction: "Every task must name a specific file and describe a specific code change. If you can't name the file, investigate more."
- **If the codebase investigation is shallow**, the agent may not be searching effectively. Provide search hints or point to specific directories in the session.
- **The Ready-for-Development standard is reusable.** It can be extracted as a standalone checklist for reviewing specs from any source, not just this playbook. If this happens, cross-link the checklist here.
- **Promote to `status: vetted`** only after 2-3 real runs with documented outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `playbooks/` — `vetted` is a frontmatter status, not a folder. Current state: based on externally-validated workflow, standalone rewrite not yet tested in this repo.
