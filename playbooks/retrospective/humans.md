# humans.md — retrospective

## What this is

A standalone playbook for running retrospectives on completed work. Extracts lessons, checks follow-through on previous action items, assesses readiness, detects significant discoveries, and produces SMART action items. Rewritten from a framework-specific workflow with all framework dependencies and role-play theater removed.

## Why it works

Four structural choices carry most of the value:

**Previous retro follow-through check.** Most retrospectives produce action items that are never checked again. This playbook explicitly reviews the previous retro's action items: completed, in progress, not addressed. This is where retrospectives earn their value — or expose their hollowness. If the team committed to changes and didn't make them, the retro needs to confront that, not pretend it didn't happen.

**Significant discovery detection.** Learnings from completed work can invalidate assumptions about what's next. This playbook explicitly checks for this: were architectural assumptions wrong? Did scope change? Were dependencies discovered? If yes, the next work plan needs review before starting. This prevents the next body of work from building silently on wrong assumptions.

**Readiness assessment before declaring complete.** "Done" is not the same as "ready to move on." The readiness assessment covers testing, deployment, stakeholder acceptance, technical health, and unresolved blockers. This catches the gap between "we finished the work" and "the work is actually production-ready and stakeholders are happy."

**SMART action items.** Specific, Measurable, Achievable, Relevant, Time-bound. Action items without these properties are aspirations that decay into nothing. The SMART check is the quality gate that separates "we should communicate better" (useless) from "add a daily 10-minute sync when a story spans multiple developers, starting next sprint" (actionable).

## Design decisions

- **No role-play theater.** The original workflow had 5+ agent personas (Bob the Scrum Master, Alice the Product Owner, Charlie the Senior Dev, Dana the QA Engineer, Elena the Junior Dev) speaking in character with scripted disagreements, emotional reactions, and interpersonal conflict. This was 90% of the file's bulk. Cut entirely. A retrospective is a conversation between the facilitator and the participant. Fake team dynamics add theater without insight.
- **No sprint-status.yaml parsing.** The original detected completed epics by parsing a sprint tracking file. Standalone version asks the user what they want to review. Simpler, more flexible, works on any project.
- **No agent manifests.** The original loaded agent configurations to determine which personas participated. No personas = no manifests needed.
- **No time estimates.** The original had a critical note: "ABSOLUTELY NO TIME ESTIMATES." This was a reaction to AI's tendency to estimate development time, which is unreliable. The standalone version preserves this implicitly — action items have success criteria, not time estimates.
- **Two-part format preserved in spirit.** The original had "Epic Review + Next Epic Preparation." The standalone version covers review (Steps 2-4) and preparation (Steps 5-6) without calling them separate parts. The structure is the same; the labeling is simpler.
- **Facilitator, not cast.** The agent is a facilitator asking questions, synthesizing answers, and structuring the conversation. The user is the participant providing answers. This is the correct relationship for a retrospective.

## Origin

Rewritten from a retrospective workflow. The original was a 1220+ line instructions file using a workflow execution engine, featuring 5+ agent personas in role-play, sprint-status parsing, epic-number detection logic, agent manifests, and config loading. The rewrite is ~120 lines of plain markdown with no framework dependencies.

Kept: the two-part structure (review + preparation), previous retro follow-through check, significant discovery detection, readiness assessment, SMART action items, the "no blame" principle, the "specific over general" principle. Cut: all role-play theater (90% of bulk), sprint-status parsing, epic-number detection, agent manifests, config loading, workflow.xml engine, party-mode protocol.

## Maintenance

- **If lessons are consistently general rather than specific**, the agent isn't probing deeply enough. Strengthen the session instruction: "Every lesson must reference a specific event, file, or task. 'We had communication issues' is not a lesson — 'Story 3 required 4 rounds of clarification because the spec didn't define the error response format' is a lesson."
- **If previous retro follow-through is skipped**, the agent is cutting corners. This step is non-negotiable when a previous retro exists. If no previous retro exists, say so — the follow-through check begins next time.
- **If significant discoveries are never flagged**, either the work is genuinely predictable (possible but rare) or the agent isn't checking thoroughly. Review Step 5's checklist explicitly in the session.
- **If action items lack owners or success criteria**, the SMART check failed. Re-validate before closing.
- **If the user dominates and the agent just transcribes**, the agent isn't facilitating. A facilitator asks probing questions, challenges vague answers, and synthesizes patterns. If the agent is just a scribe, it's not adding value.
- **Promote to `status: vetted`** only after 2-3 real runs with documented outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `playbooks/` — `vetted` is a frontmatter status, not a folder. Current state: based on externally-validated workflow, standalone rewrite not yet tested in this repo.
