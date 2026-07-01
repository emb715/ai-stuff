# humans.md — brainstorming

## What this is

A standalone playbook for facilitating interactive brainstorming sessions. Uses a CSV technique library (61 techniques across 10 categories) as a catalog, offers 4 selection modes, and runs a 4-step flow: setup → select → execute → organize. Rewritten from the bmad framework's brainstorming workflow with all framework dependencies removed.

## Why it works

Four structural choices carry most of the value:

**CSV-as-catalog.** The technique library is separate from the execution logic. Adding, editing, or reorganizing techniques requires touching only the CSV — the playbook never changes. This also lets the agent load techniques on-demand at Step 2 rather than embedding all 61 in the prompt context.

**Anti-bias pivot every 10 ideas.** LLMs naturally drift toward semantic clustering — ideas 1-20 are diverse, ideas 20-50 start converging on a theme, ideas 50+ are paraphrases of each other. The explicit pivot instruction ("review themes, name the dominant domain, shift to an orthogonal one") forces genuine divergence. This is the single most important quality mechanism in the playbook.

**100+ ideas before organizing.** The first 20 ideas are the obvious ones everyone would generate. Ideas 50-100 are where non-obvious connections emerge. Setting a quantity goal prevents premature convergence — the agent won't offer organization until the user has pushed past the easy answers.

**User controls the stop decision.** The agent defaults to "keep exploring." It only offers organization when the user asks, or when 100+ ideas AND 45+ minutes have elapsed, or when user energy is clearly depleted. This prevents the agent from cutting sessions short when it runs out of obvious ideas.

## Design decisions

- **No file writing.** Output lives in the conversation, not a file. Tradeoff: no persistent document, but no file system dependency. If the user wants to save, they save the conversation. This is the right tradeoff for a standalone artifact.
- **No config dependency.** No external config file. Language follows the user, greeting personalization is unnecessary, and there's no file output to configure. Nothing of value is lost by omitting a config layer.
- **4 selection modes in one step.** Each mode (user-pick, ai-recommend, random, progressive) is described in 3-5 lines within a single Step 2. Same functionality, no redundant near-identical files.
- **facilitation_prompts and best_for columns populated.** The CSV has 5 columns: `category`, `technique_name`, `description`, `best_for`, `facilitation_prompts`. The last two are operational — `best_for` enables real technique matching in ai-recommend mode, `facilitation_prompts` gives the agent runnable questions per technique instead of improvising from the description. Dropped `energy_level` and `typical_duration` — flavor, not functional. The agent estimates tone and time from the technique itself.
- **No continuation/resume logic.** Sessions are fresh each time — no state to resume.
- **No advanced-elicitation cross-reference.** If the user wants to go deeper on an idea, the agent can do that inline without a separate workflow.

## Origin

Rewritten from the bmad framework's brainstorming workflow at `_bmad/core/workflows/brainstorming/`. The original consisted of:

- `workflow.md` (58 lines) — framework entry point with config loading
- `template.md` (15 lines) — session document template with frontmatter
- `brain-methods.csv` (62 lines) — technique catalog (3 columns, claimed 7)
- `steps/step-01-session-setup.md` (197 lines)
- `steps/step-01b-continue.md` (continuation logic)
- `steps/step-02a-user-selected.md` (225 lines)
- `steps/step-02b-ai-recommended.md` (237 lines)
- `steps/step-02c-random-selection.md` (209 lines)
- `steps/step-02d-progressive-flow.md` (~260 lines)
- `steps/step-03-technique-execution.md` (399 lines)
- `steps/step-04-idea-organization.md` (303 lines)

Total original: ~2100 lines across 11 files. Rewrite: ~130 lines in playbook.md + 61-row CSV. Reduction comes from cutting redundancy (4 near-identical step-02 files), theater (emoji headers, success metric checklists, mandatory rules blocks), framework scaffolding (config loading, frontmatter state, file writing, continuation detection), and redundant guidance (principles that restate steps).

Kept: the CSV-as-catalog pattern, the 4 selection modes, the anti-bias protocol, the 100+ ideas goal, the 4-step flow, the idea capture format, the energy check, the user-controlled stop decision.

## Maintenance

- **CSV is the primary maintenance surface.** To add techniques: add rows to `brain-techniques.csv` with all 5 columns populated. To remove: delete rows. The playbook's Step 2 category list should be updated if categories change.
- **Correct technique count.** The CSV has 61 techniques across 10 categories. If techniques are added/removed, update the count in playbook.md and README.md.
- **If the anti-bias pivot produces superficial shifts** (same domain, different vocabulary), strengthen the pivot instruction in the session: "Name the domain you've been in. Pick a domain you have NOT touched. Generate ideas only in that new domain."
- **If sessions consistently produce <50 ideas in 45 minutes**, the techniques may be too structured for the user's style. Try random mode (Mode 3) for less constrained exploration.
- **Promote to `status: vetted`** only after 2-3 real runs with documented outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `playbooks/` — `vetted` is a frontmatter status, not a folder. Current state: based on externally-validated workflow, standalone rewrite not yet tested in this repo.
- **If `facilitation_prompts` feel too rigid** for certain techniques, the agent should treat them as starting points, not scripts. The playbook already states this principle — "CSV provides structure, not rigid scripts" was in the original and is preserved in spirit.
