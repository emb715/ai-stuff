# humans.md — knowledge-extraction

## What this is

A one-shot prompt that mines a completed work session and proposes durable knowledge writes. The user approves before anything is written. Agnostic — works with any AI tool and any project type.

## Why it works

Three structural choices carry most of the value:

**Mine before synthesize.** Phase 1 forbids any output until the session is read completely. This prevents the agent from anchoring on the first notable event and missing patterns that only emerge across the whole session.

**Fixed triage labels.** The eight-label table forces every finding into a named bucket with a target surface. This makes proposals actionable — each one names where it would land — instead of a vague "you should remember this." The `uncategorized` escape hatch prevents silent loss of signal that doesn't fit.

**Propose, don't push.** The agent never writes. It produces a reviewable build plan. This keeps the user as the gatekeeper on what enters the knowledge system, which is the only way durable knowledge stays trustworthy.

## Design decisions

- **Agnostic surfaces.** The triage table names surface *types* (skill file, ADR section, global rules) not specific file paths. This is what makes the prompt portable. Tradeoff: the agent cannot verify a surface exists — it proposes against an assumed target system. The Failure Modes section flags this.
- **`discard` is a first-class label.** Explicitly naming "nowhere" as a valid destination lets the agent throw things away honestly rather than forcing every finding into a proposal. The DISCARDED summary makes discards auditable.
- **"Skills beat docs" tiebreaker.** When a finding fits two surfaces, the more active one wins. An auto-triggering skill changes behavior; a doc waits to be found. This is a bias toward behavior change over documentation.
- **No input variable by design.** The prompt operates on whatever session context the agent can see — transcript, file, or in-session history. It does not declare a `{{VARIABLE}}` because the input is ambient, not a named slot. If nothing is visible, the agent surfaces that as a blocker. Forcing a `{{SESSION}}` placeholder would suggest the user must substitute a path before running, which is not how it works.

## Origin

Created and validated outside this repo. Imported via the save-artifact procedure. The original framed itself as a "system prompt" — that usage note is preserved in the README "When to use" section.

The body was rewritten on import. The original was ~104 lines with agent-introduction framing ("You are a knowledge extraction agent. Your sole purpose is to..."), `---` dividers between phases, and a 7-item Principles section that largely restated the phases. The rewrite (~40 lines) opens with the task directly, drops the framing, removes dividers, compresses Phase 1 from bullets to prose, trims Surface-column descriptions, and cuts Principles to the 3 that aren't redundant with the phases. Load-bearing structure kept: the 8-label triage table, the `uncategorized` escape hatch, the "twice or more: propose it" rule, the PROPOSED WRITE format, and the DISCARDED/UNCATEGORIZED summaries.

## Maintenance

- If the target knowledge system uses different surface names than the triage table, update the table labels and Surface column to match. The eight-way classification is the load-bearing structure; the surface names are adaptable.
- If the agent produces proposals with no `Evidence` field, the prompt's contract is broken — re-inject the Propose section, where the `PROPOSED WRITE` format requires `Evidence: <observed in this session>`. The Evidence requirement lives in the output format, not the Principles section.
- If `UNCATEGORIZED` count is consistently high across runs, the label set is incomplete for the target domain. Add a label rather than letting `uncategorized` become a dumping ground.
- Promote to `status: vetted` only after documenting at least 2–3 real runs with outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `prompts/` — `vetted` is a frontmatter status, not a folder. Current state: externally validated, evidence specifics pending in-repo documentation.
