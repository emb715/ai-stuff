# humans.md — RAA (Research, Analyze, Assess)

## What this is

A playbook that turns a feature request into a validated, file-scoped implementation plan. It sits between the request and [implementation-orchestration](../implementation-orchestration/playbook.md): orchestration requires a plan with file-level scope as input, and RAA is the thing that produces it. Three perspectives run in sequence — Research (what exists), Analyze (what's wrong with what exists), Assess (what to build and how) — and the output is a phased plan with a file-overlap matrix, handoff ledger, risk register, and effort estimate. RAA never writes code.

## Why it works

Three structural choices carry most of the value:

**Three perspectives as separate steps, not one combined "plan the feature" step.** The most common failure mode in feature planning is jumping to a plan without evidence — an agent or human reads two files, forms a theory, and starts sequencing work. Splitting Research → Analyze → Assess forces each perspective to complete before the next begins, and each one feeds the next: the research map is the input to analysis (no re-discovering files), analysis findings are the input to assessment (no re-reading files unless verifying a claim). The architect consumes prior outputs; it does not regenerate them. Combining them collapses this chain and the first failure mode returns.

**Output-contract templates as binding specs, not prose.** The Research Map, Analysis Findings, and Plan output contracts are code-fence templates with `// what to find` comments. This is deliberate: the templates are machine-parseable by the implementation-orchestration playbook downstream. Prose contracts drift — an agent fills in what it remembers and skips what it doesn't. A template with a slot per finding and a `// comment` describing what belongs there gives the orchestration playbook a predictable structure to consume. The templates are the interface between RAA and orchestration.

**File-level scope as a hard requirement.** The plan prohibition — never produce a plan without file-level scope, with the `src/components/list.tsx` lines 35-44 synthetic example — exists because "update the component" produces unparseable plans and "modify `src/components/list.tsx` lines 35-44 to replace client-side filtering with a server query" produces executable ones. The orchestration playbook's parallelism rules depend on knowing which files each stream touches; without file-level scope, the file-overlap matrix is fiction and parallelism cannot be planned safely.

## Design decisions

- **Step 4 (Self-validation) was deleted in a prior trim.** The 13-checkbox verification checklist already covered all five self-validation checks the deleted step performed. Two validation passes that check the same things signal permission for drift, not rigor — the second pass becomes theater. One checklist, enforced once.

- **Agent fleet mapping reduced to one line.** The original was a full table mapping Researcher/Analyst/Architect roles to ndv, BMAD, and Solo modes. It was reduced to one line because each step's "Parallel X" subsection already names the actors for that step — the table restated what the steps already specified. The one-line pointer preserves the role mapping (Researcher=ndv-research, Analyst=ndv-review, Architect=ndv-architect) without the duplication.

- **"Never" trimmed from 8 to 3 in a prior pass.** Five of the eight original prohibitions restated the Principles section verbatim. Kept only the three that add information beyond Principles: the architect-doesn't-redo-work rule (operational, not a principle), the file-level-scope definition with the synthetic example (concrete, not abstract), and the confidence-with-estimate requirement (specific output shape, not a value). Prose that restates principles is noise the reader has already processed once.

- **Project-agnostic examples.** The playbook was deprojectized in a prior pass: `chat-history-rail.tsx` → `src/components/list.tsx`, `Part.text_text`/`Message.content` → a generic schema example, "message-content search" → "query performance at expected row count." A generic playbook with project-specific examples leaks the origin project into every downstream read and breaks the agent-agnostic principle. The generic examples carry the same lesson without the leakage.

- **Project-agnostic, agent-agnostic.** No dependency on a specific framework (tRPC vs oRPC, Prisma vs Convex are listed as constraint examples, not requirements), no dependency on a specific fleet (ndv, BMAD, custom, or solo all work). The playbook operates with whatever reads files and searches code. This is what makes it reusable across projects; binding it to a stack would make it a project artifact, not a playbook.

## Origin

This playbook was created to fill the gap between a feature request and implementation-orchestration. implementation-orchestration requires a validated, file-scoped plan as input; nothing in the repo produced that plan. RAA was authored to be that thing.

It was written in this repo (ai-stuff). Lifecycle of the file:

1. First draft: 311-line single file, mixed prose and directive.
2. Trim pass: 240 lines, redundancy removed.
3. Directive-form conversion (ndv-refactor): 238 lines, all rationale prose moved out of the directive body.
4. Three-file split: `README.md` (repo record), `playbook.md` (pure directive form), `humans.md` (this file — the rationale the directive form removed).

The rationale removed in step 3 lives in this file, not in the playbook. The playbook is what the agent loads; the why is what the maintainer reads.

## Maintenance

- **The output contracts are the interface.** If you change the Research Map, Analysis Findings, or Plan template structure, check whether [implementation-orchestration](../implementation-orchestration/playbook.md) still parses it. The templates are the contract between these two playbooks — changing one without the other breaks the handoff.

- **The verification checklist is the gate.** Every "PLAN READY" declaration depends on all 13 checkboxes passing. If you add a new output section to the plan contract, add a checkbox for it. A contract section with no verification entry is unenforced.

- **The "Never" list is intentionally short.** Resist adding prohibitions that restate Principles. The test: does the prohibition add information beyond what Principles already states? If no, it belongs in Principles (or nowhere). If yes, it belongs in "Never."

- **Deprojectize new examples.** If you add or update examples, keep them generic. A concrete project filename in a generic playbook is a leak — future readers will assume the playbook is project-specific and skip it or misuse it.

- **Promotion gate.** Move to `status: vetted` only after 2-3 real runs with documented outcomes in the README Evidence section and a pass against `docs/standards/vetting-rubric.md`. The playbook stays in `playbooks/`; `vetted` is a frontmatter status on README.md, not a folder move.

- **Aging signal.** If real runs start producing plans that orchestration rejects (wrong structure, missing sections, unparseable scope), the output contracts have drifted from what orchestration consumes. Re-align the templates to what orchestration expects, then re-run the checklist.

## Known gaps

- **No explicit estimate-calibration guidance.** The effort-estimate contract requires a confidence level and a worst case, but the playbook does not tell the agent how to calibrate story points against actual effort. This is deliberate — calibration is project-specific and belongs in a project's own conventions, not in a generic playbook. If estimates are consistently wrong, the fix is calibration data from past phases, not a playbook change.

- **No explicit human-in-the-loop checkpoint inside RAA.** The handoff step routes to human review for complex or high-stakes features, but there is no mandatory human sign-off between Research and Analyze, or Analyze and Assess. For high-stakes work a human can insert a checkpoint manually; the playbook does not enforce it. Enforcing it would slow down low-stakes runs that don't need it.

- **Solo mode is underspecified relative to fleet mode.** Each step has a "Parallel X" subsection for fleet dispatch and a one-line solo path. The solo path is correct but thinner — it assumes the solo agent already knows how to read a codebase in data-flow order. A newer solo agent may need more guidance than the playbook provides. Not yet addressed because solo mode is the fallback, not the primary mode.

## Fleet role mapping (reference)

This playbook was authored under the ndv fleet. The role names in the steps (Researcher, Analyst, Architect) are functions, not fleet members; the steps dispatch by role. If you are wiring a concrete fleet, this is the role→agent mapping for the originating fleet — construct the equivalent for yours.

| Role | ndv agent |
|------|-----------|
| Researcher | ndv-research |
| Analyst | ndv-review |
| Architect | ndv-architect |

Solo mode needs no mapping: one agent or human performs all three roles sequentially in data-flow order (schema → queries → services → types → API → components → routes).
