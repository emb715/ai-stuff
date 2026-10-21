# Write or Revise a Skill

## Trigger

Package verified library, framework, or tool knowledge into an agent skill, or revise an existing skill's accuracy, scope, delivery, or effectiveness.

## Preconditions

- Target capability, version, intended tasks, and harness are identified.
- Documentation, definitions/help, implementation, or reproducible observations are available to verify operational claims.
- For a revision, preserve an immutable copy of the original skill for comparison.

## Procedure / Steps

### 1. Load the canonical authoring procedure

Read [skill-authoring/SKILL.md](../../../skills/skill-authoring/SKILL.md). Execute its Steps 1–10 for source verification, safeguards, structure, examples, evaluation, and discovery. This framebook adds vault integration; it does not duplicate the authoring rules.

### 2. Establish scope and evidence

Record target version/date and a claim ledger. Select representative task prompts before extensive drafting. Resolve conflicting docs, signatures, defaults, and observed behavior explicitly. Do not publish unverified operational instructions.

### 3. Author or revise at the maintained source

Keep one coherent capability with common tasks and all essential safeguards inline. Link conditional `references/` resources; verify they are delivered to installed consumers. For generated skills, edit the canonical templates and update generation/installation paths rather than only installed copies.

Preserve the existing skill name on revision. Do not impose warning quotas, reference-link quotas, or arbitrary line-count gates. Retain rationale that changes decisions; remove duplication and irrelevant background.

### 4. Apply vault structure

Follow [artifact-structure.md](../../../docs/standards/artifact-structure.md) and the artifact's existing format. Keep lifecycle metadata in README.md, runtime instructions in SKILL.md, and maintenance context separate from runtime loading.

Create new uncertain work in `experiments/`; edit existing artifacts in place when revising. Keep records aligned with the executable artifact and record the evidence and known limitations.

### 5. Verify authoring and behavior separately

Run static checks for source accuracy, internal consistency, valid examples, resource delivery, safety, and metadata.

For behavioral evidence, use the authoring skill's matched comparisons and separate discovery checks. Record actual outputs, settings, and grading evidence. Mark missing runtime, discovery, or cost measurement untested; static review alone supports a draft, not validated effectiveness.

Use available evaluation tooling, adapting harness assumptions explicitly. Do not invent a successful evaluation or infer savings from line count.

### 6. Link, lint, and assess lifecycle

- Link new artifacts from a section index or root README.md; preserve existing links for revisions.
- Run `python3 scripts/doc_lint.py` and report exact failures, distinguishing pre-existing failures from new ones.
- Critical factual/safety defects block shipping regardless of average score.
- Promotion follows [promote-artifact](../promote-artifact/playbook.md) and the vault standards. Successful tests do not automatically change status.

## Workflow

Load canonical skill → verify versioned claims → select evals → draft common paths and safeguards → verify installed resources → compare behavior and discovery → record evidence → link/lint → assess lifecycle.

## Rollback / Fallback

When a correction regresses correctness or safety, revise it or restore the known baseline and report the defect. For inappropriate activation, narrow the description and retest adjacent prompts. If execution is unavailable, preserve the draft with explicit untested dimensions rather than claiming readiness.
