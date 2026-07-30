# USAGE — paste this into a fresh session to browse and use repo artifacts

You are operating a curated AI artifact vault. Follow these instructions exactly.

## Step 1 — Verify the inventory

Run:
```
ls prompts/ playbooks/ skills/ tools/
```

Each subdirectory (excluding `README.md`) is one artifact. Cross-check against the task map below:
- Artifact on disk but missing from the map → add it to your menu using the folder README's purpose
- Artifact in the map but no folder on disk → drop it

Then read the frontmatter of each artifact's `README.md` to get its real `status`:
```
head -10 prompts/*/README.md playbooks/*/README.md skills/*/README.md
```
Do not assume status. Do not default to `draft`. Read the frontmatter and use the value you find. If a README has no frontmatter or no `status` key, use `unknown`.

## Step 2 — Output the menu

Print the menu as markdown, grouped by domain. Use this exact structure:

```markdown
## Prompts — copy-paste instruction text
1. **name** — `status`
one-line purpose 
2. **name** — `status`
one-line purpose 

## Playbooks — multi-step procedures
3. **name** — `status`
one-line purpose 

## Skills — capability/behavior packages
4. **name** — `status`
one-line purpose 

## Tools — deployable technical artifacts
_(none)_
```

Rules:
- Global numbering across all groups (1, 2, 3… not restart per group)
- Skip empty groups entirely except Tools — show `_(none)_` so the user knows it was checked
- `status` comes from Step 1 frontmatter read — one of `draft` / `validated` / `vetted` / `unknown`. Render as inline code. Never assume, never default to `draft`
- One line per artifact — no wrap, no description longer than ~12 words
- End with: `**Reply with one or more numbers to consume.**`
- No other prose. The menu is the output.

## Step 3 — Wait for selection

After the menu, stop. The user will reply with one or more numbers. Do not proceed until they pick.

## Step 4 — Deliver

For each selected number:
1. Open the artifact's `README.md` for frontmatter and any inputs/stop signals
2. Read the consumable file:
   - `prompt.md` for prompts
   - `SKILL.md` for skills
   - `playbook.md` for playbooks
3. Output:
   - One line: name, status, staleness, required inputs
   - The full consumable file content in a code block
4. Never read `humans.md` — maintainer-only

## Task map (for Step 1 cross-check)

| Task | Artifact | Type | Consumable |
|---|---|---|---|
| Refine a planning doc to implementation readiness via iterative loop | `prompts/loop-prd-readiness/` | prompt | `prompt.md` |
| Verify a codebase implements a planning doc; tri-state verdict per round | `prompts/loop-implementation-readiness/` | prompt | `prompt.md` |
| Mine a finished session for durable knowledge writes; user approves | `prompts/knowledge-extraction/` | prompt | `prompt.md` |
| Map a repo's primitives from source, then adversarial-review the map | `prompts/repo-primitive-audit/` | prompt | `prompt.md` |
| Verify a release candidate against acceptance criteria; gate fix batches | `prompts/review-release-candidate/` | prompt | `prompt.md` |
| Generate ready-to-paste prompts from a plan doc or session context | `skills/prompt-factory/` | skill | `SKILL.md` |
| Author a new skill for a library, framework, or tool | `skills/skill-authoring/` | skill | `SKILL.md` |
| Run an interactive brainstorming session (61 techniques, 10 categories) | `playbooks/brainstorming/` | playbook | `playbook.md` |
| Take N options and produce a ranked shortlist with rationale (multi-criteria) | `playbooks/decision-making/` | playbook | `playbook.md` |
| Turn a rough idea or brainstorm output into a structured product brief | `playbooks/product-brief/` | playbook | `playbook.md` |
| Route a raw request to the correct planning artifact (spec vs plan paradigm) | `playbooks/request-triage/` | playbook | `playbook.md` |
| Turn a GitHub issue into implementation-ready specs (PRD + N specs) | `playbooks/issue-to-ready-specs/` | playbook | `playbook.md` |
| Create one implementation-ready spec via discovery + code investigation | `playbooks/quick-spec/` | playbook | `playbook.md` |
| Research, Analyze, Assess a feature request → validated file-scoped plan | `playbooks/raa/` | playbook | `playbook.md` |
| Execute a validated plan across a fleet → committed, reviewed, CI-green branch | `playbooks/implementation-orchestration/` | playbook | `playbook.md` |
| Chain a GitHub issue to a merged PR (gated or continuous mode) | `playbooks/issue-to-pr/` | playbook | `playbook.md` |
| Assess an existing artifact's readiness → fix → verify (RAA → fixes → review) | `playbooks/readiness-cycle/` | playbook | `playbook.md` |
| Take an idea from proof-of-concept to release-ready (13-phase pipeline) | `playbooks/build-to-release/` | playbook | `playbook.md` |
| Adversarial code review on git changes; minimum 3 findings | `playbooks/adversarial-code-review/` | playbook | `playbook.md` |
| Build a multi-platform agent installer CLI/TUI | `playbooks/agent-installer/` | playbook | `playbook.md` |
| Retrospective on completed work; lessons + SMART action items | `playbooks/retrospective/` | playbook | `playbook.md` |

## Trust order

`vetted` > `validated` > `draft`. Flag `draft` as unvalidated when delivering.

## Ignore

`agents/`, `experiments/`, `_meta/`, `docs/standards/`, `archive/`, `templates/`, `changelog/` — not part of the reusable surface.
