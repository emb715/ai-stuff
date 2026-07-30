# humans.md — retrospective

## What this is

A standalone playbook for running retrospectives on completed work. Redesigned from a pure-extractive facilitation flow into a **Socratic-extractive hybrid**: the user owns all lessons, discoveries, and priorities; the agent owns bookkeeping (status tables, checklists, SMART drafting, recaps). Rewritten from a framework-specific workflow with all framework dependencies and role-play theater removed.

## Redesign rationale — pure-extractive → Socratic-extractive hybrid

The original standalone playbook was pure-extractive: the agent reviewed the work, extracted lessons, presented them ("here's what I'm seeing"), and the user validated. That structure has a known failure mode — lessons the agent extracts and hands back are not owned by the user. Unowned lessons do not stick; they become retro theater where the user nods at the agent's synthesis and changes nothing.

The redesign keeps extraction where extraction is correct and replaces it with Socratic probing where ownership matters.

**Why lessons and discoveries must be user-owned (Socratic):** a lesson the user states in their own words is a belief they've updated. A lesson the agent states and the user agrees with is a belief the user is politely performing. The same applies to a discovery's significance — if the agent asserts "this is significant because X", the user has not decided it matters and will not act on it. Steps 2 (Lessons) and 5 (Discoveries) are Socratic for this reason. The agent asks the gap-probing question ("you said X surprised you; if you'd believed the opposite, what would you have done differently?"), mirrors contradictions, and asks the avoided question. It does not synthesize-then-present.

**Why bookkeeping stays extractive:** status tables (Step 3 status), readiness checklists (Step 4), SMART drafting (Step 6b), and the recap (Step 7) are not insights — they are structure. Asking the user Socratic questions about whether a previous action item is ✅/⏳/❌ wastes their cognitive budget on categorization. The agent lists the status extractively; the Socratic probe in Step 3 is reserved for the *reason* an item went unaddressed, which is where ownership actually lives.

**Why scaling forces triage at N > 15:** the Socratic chain is expensive per item. Run it on 20 lessons and the user depletes by item 6 and the rest get performative answers. The triage rule — agent extractively surfaces candidates, user selects ≤5 for the Socratic chain, remainder get one-line extractive summary — preserves the ownership benefit where it's reachable and accepts extractive summary where it isn't. Action items are capped at the Socratic top 3 because more than 3 action items from one retro don't get done.

**Decision rule:** Socratic where ownership determines whether the output sticks (lessons, discovery significance, priorities). Extractive where the output is structure, not insight (status, checklists, SMART drafting, recap). Hybrid at Step 6 because prioritization is ownership but SMART formatting is structure.

**Fallback is per-step, not per-session.** A depleted user at Step 2 does not forfeit the Socratic method for the rest of the session. The drop is logged inline, extractive runs for that step, and Socratic resumes at the next step boundary unless the condition persists. This prevents a single depleted moment from quietly converting the whole retro back into the pure-extractive flow the redesign was built to replace.

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
- **Facilitator, not cast.** The agent is a facilitator asking questions, mirroring answers, and structuring the conversation. The user is the participant providing answers. This is the correct relationship for a retrospective.

## Origin

Rewritten from a retrospective workflow. The original was a 1220+ line instructions file using a workflow execution engine, featuring 5+ agent personas in role-play, sprint-status parsing, epic-number detection logic, agent manifests, and config loading. The rewrite is ~120 lines of plain markdown with no framework dependencies.

Kept: the two-part structure (review + preparation), previous retro follow-through check, significant discovery detection, readiness assessment, SMART action items, the "no blame" principle, the "specific over general" principle. Cut: all role-play theater (90% of bulk), sprint-status parsing, epic-number detection, agent manifests, config loading, workflow.xml engine, party-mode protocol.

## Maintenance

- **If lessons are consistently general rather than specific**, the agent isn't probing deeply enough. Strengthen the session instruction: "Every lesson must reference a specific event, file, or task. 'We had communication issues' is not a lesson — 'Story 3 required 4 rounds of clarification because the spec didn't define the error response format' is a lesson."
- **If previous retro follow-through is skipped**, the agent is cutting corners. This step is non-negotiable when a previous retro exists. If no previous retro exists, say so — the follow-through check begins next time.
- **If significant discoveries are never flagged**, either the work is genuinely predictable (possible but rare) or the agent isn't checking thoroughly. Review Step 5's checklist explicitly in the session.
- **If action items lack owners or success criteria**, the SMART check failed. Re-validate before closing.
- **If the user dominates and the agent just transcribes**, the agent isn't facilitating. A facilitator asks probing questions, challenges vague answers, and mirrors patterns. If the agent is just a scribe, it's not adding value.
- **Promote to `status: vetted`** only after 2-3 real runs with documented outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `playbooks/` — `vetted` is a frontmatter status, not a folder. Current state: based on externally-validated workflow, standalone rewrite not yet tested in this repo.
