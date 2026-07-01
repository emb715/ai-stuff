# humans.md — product-brief

## What this is

A standalone playbook for creating product briefs from rough ideas or brainstorm output. Research-first: the agent researches the problem space and drafts the brief, the user corrects what's wrong. 15-20 minutes. Four sections — problem, users, success, scope — confirmed in one or two rounds. Stays in the same session if the user wants to continue into a plan.

## Why it works

**Research-first, correct-fast.** The original model interrogated the user — five sub-questions per section, seven steps, 45-60 minutes. That's a PRD session, not a brief session. The better model: agent researches the problem space, drafts a brief with assumptions marked, user corrects what's wrong. One round of corrections beats five rounds of sub-questions. The user's cognitive load drops because they're reacting to a draft, not constructing from nothing. The agent's research grounds the brief in real market context the user may not have surfaced during brainstorming.

**The out-list gate.** Scope defined only by what's in is a wish, not a scope. The out-list gate requires at least two named exclusions with rationale before the brief is confirmed. This is the single mechanic that prevents scope creep from entering the plan as ambiguity. It survives the compression from 7 steps to 5 steps.

**Inline continuation.** After the brief is confirmed, the user can keep going in the same session — no tool switch, no separate prompt, no "now go use X." The brief becomes the starting document and the agent runs plan refinement inline. This is the right model: a 20-minute brief session that optionally extends into 40 minutes of planning is better than two separate sessions.

## Design decisions

- **Research before drafting.** The original asked questions first and drafted from answers. The rewrite researches first and drafts from findings. The user's one input (the idea) is enough to start research. Research produces a draft that's grounded rather than generic.
- **One question before research, one question after draft.** The entire brief runs on two questions: "What's the idea?" and "What's wrong, what's missing, what needs to change?" Everything else is agent work, not user work.
- **Four sections, not five.** Constraints folded into scope. A constraint is just a feature that's out of scope by external requirement rather than product decision. Treating it as a separate section added a step without adding structure.
- **Two-persona limit.** Brief-level persona proliferation is scope creep by another name. Two personas forces prioritization. Override only when a third persona has genuinely distinct needs — not a variation on the first two.
- **No file writing.** The brief lives in the conversation. User copies what they need.
- **No advanced-elicitation or party-mode.** Removed in the initial rewrite. Not re-added.
- **Inline continuation replaces tool handoff.** The original's completion step suggested running `create-prd` next as a separate workflow. The rewrite keeps the session open — if the user wants to continue, keep going. The brief is the starting document for inline plan refinement.

## Origin

First version (v1) was a faithful rewrite of the create-product-brief workflow — 7 steps, 45-60 min, interview-driven. Revised immediately after because the model was wrong: too long, too many questions, no research phase. The current version (v2) is research-first, 15-20 min, two-question structure. The out-list gate and the four-section structure survived. The interview model was replaced with the research-draft-correct model.

## Maintenance

- **If research produces nothing useful** — tools unavailable or the domain is very niche — state assumptions explicitly before drafting. The draft should still be presented; the user corrects assumptions rather than answering from scratch.
- **If the out-list stays empty after prompting** — use the cut-half question: "If you had to cut half the features right now, what goes first?" This almost always unlocks the out-list.
- **If the user wants a longer, more thorough brief** — the playbook doesn't block this. Stay in the session, ask more targeted questions on specific sections. The 15-20 min target is the floor, not the ceiling.
- **If inline continuation into plan refinement breaks down** — the agent loses the brief context mid-session. Reassert the brief as a reference document: "Working from the brief we confirmed: [paste sections]."
- **Promote to `status: vetted`** only after 2-3 real runs with documented outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `playbooks/` — `vetted` is a frontmatter status, not a folder.

## Origin

Rewritten from the create-product-brief workflow. The original was a 6-step file-based workflow using config loading, step-file architecture, append-only document building, frontmatter state tracking, advanced-elicitation checkpoints, party-mode integration, and file output to a planning artifacts folder. The rewrite is ~120 lines of plain markdown with no framework dependencies.

Kept: the section sequence (problem → users → success → scope), the one-section-at-a-time confirmation discipline, the out-list gate, the push-toward-specific facilitation pattern, the specific persona development approach. Cut: file writing, config loading, advanced-elicitation, party-mode, frontmatter tracking, step-file architecture, the completion workflow (create-prd suggestion replaced with a plain note about plan refinement).

## Maintenance

- **If the out-list gate is consistently bypassed**, the model isn't enforcing it. Strengthen the session instruction: "Do not proceed to Step 6 until the user has named at least two items that are explicitly out of scope with rationale for each."
- **If Success section produces vanity metrics**, add a session instruction: "For each proposed metric, ask: 'What user behavior does this measure? What threshold tells you it's working?' If the user can't answer, the metric is not accepted."
- **If the brief consistently skips the two-persona limit**, the agent is prioritizing user satisfaction over discipline. Reinforce: "A third persona is only acceptable if it has needs that are meaningfully different from both existing personas — not just a variation on them."
- **Promote to `status: vetted`** only after 2-3 real runs with documented outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `playbooks/` — `vetted` is a frontmatter status, not a folder. Current state: based on externally-validated workflow, standalone rewrite not yet tested in this repo.
