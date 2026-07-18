# humans.md — repo-primitive-audit

## What this is

A one-shot prompt that maps a repo's primitives from source, breaks down each section, then runs an adversarial review against a named playbook. The user authored it for their own repo-audit workflow and validated it across several weeks of real use before importing it here.

## Why it works

Three structural choices carry the value:

**Source-first, not tree-first.** "Use the source code" forces the agent to read actual files (READMEs, standards, frontmatter, lint scripts) rather than narrating structure from `ls` output. This is what makes the map truthful — primitives come from what the repo declares about itself, not from folder names.

**Map before review.** "So before review start we need the mapping and the breakdown" is the load-bearing ordering rule. It prevents the agent from jumping to findings against an assumed structure. Every model tested respected this sequence — the two-paragraph form is enough to hold the ordering without an explicit numbered checklist.

**Parameterized review target.** The playbook path is the only variable. The prompt does not hardcode a review procedure, so it adapts to whatever review playbook the target repo exposes. This is what makes it portable across repos with different review conventions.

## Design decisions

- **Compressed form over explicit steps.** Longer versions with more steps were tested and did not outperform this two-paragraph form. The terse framing lets the agent adapt map depth to the repo's actual complexity instead of running a rigid checklist that over-shoots simple repos or under-shoots complex ones. The cost: weaker models may produce thinner maps — the Evidence section records that stronger models consistently held the ordering and depth.
- **Open-ended discrepancy clause.** "If is not the same" deliberately does not define what counts as a discrepancy. The agent decides. This is a feature for heterogeneous repos (different sections have different rules) and a risk for weaker models (may over- or under-flag). Flagged in Failure Modes.
- **Sanitization on import.** The original prompt hardcoded `/playbooks/adversarial-code-review/playbook.md` — a path specific to this repo. On import it was parameterized to `{{REVIEW_PLAYBOOK}}` per the save-artifact sanitization rule (project-specific paths → placeholder). The tested default is recorded in the README Inputs section so the original form is recoverable: set `{{REVIEW_PLAYBOOK}} = /playbooks/adversarial-code-review/playbook.md`.
- **Grammar preserved.** The original wording ("if is not the same") was left intact despite minor grammar quirks. The user reported this exact form produced the best outcomes across models — editing the prose risks changing the signal. The artifact is copy-paste clean as authored.

## Origin

Authored and validated outside this repo by the owner. Used for several weeks across multiple repositories and sessions before import. Imported via the `_meta/framebook/save-artifact/` procedure.

## Maintenance

- If the target repo's review playbook moves or changes name, update the `{{REVIEW_PLAYBOOK}}` value at run time — the prompt itself does not hardcode it.
- If a model consistently produces a thin map (skips sections, narrates from the tree only), the prompt may need an explicit "read each section's README and standards files" line. Do not add this preemptively — the compressed form is the validated one.
- Promote to `status: vetted` only after documenting 2–3 real runs with observed outcomes (repos reviewed, discrepancies found, accuracy of findings) in the README Evidence section and passing the vetting rubric. Current state: externally validated across multiple weeks and models; in-repo run documentation pending.