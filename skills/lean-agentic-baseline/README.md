---
title: "lean-agentic-baseline"
status: validated
confidence: medium
last_tested: 2026-10-08
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "python/3.10+"
  - "bash"
  - "claude-code/settings.json"
  - "github-actions"
tags: [skill, agentic-engineering, process, audit, assessment, governance]
owner: "@emb715"
---

# Context / Problem

An agent-ready project needs effective controls and useful context, not a collection of configuration files. Earlier presence checks could report PASS for empty directories, no-op validation and zero agent definitions. Template adoption also confused initial adaptation with subsequent local edits.

## Scope

Assess 26 Lean Agentic pillars, adapt relevant goals to a project's context, implement a bounded change, and track upstream versus locally adapted files. Configuration inventory is read-only and cannot certify safety or productivity. Business priorities, risk acceptance and independent control ownership remain with accountable humans.

Original templates retain their **guide v3.2** provenance. [VERSION.json](VERSION.json) separately records the skill revision and the newer guide repository revision reviewed for pillar coverage and assessment goals; this is not a claim that all legacy templates were freshly extracted or vendor-verified.

## Workflow / Inputs

Use [SKILL.md](SKILL.md). Inputs: target path, actual project pain, stack/harness, existing controls, team/concurrency, production exposure, access/authority and maintenance capacity. Ask only for missing material context.

1. Inventory supported configurations without running target code.
2. Assess applicability, feasibility, ownership, equivalent controls and acceptance evidence separately.
3. Agree one useful change; adapt, review, run authorized positive/negative tests.
4. Record upstream **and adapted-file** hashes after adoption.
5. Monitor outcome and upkeep cost; resolve drift without silent overwrites.

```bash
TARGET_REPO=/path/to/repo bash scripts/scorecard.sh --json
TARGET_REPO=/path/to/repo bash scripts/adopt.sh assets/templates/tier-0/AGENTS.md AGENTS.md
bash scripts/check-pinned-versions.sh /path/to/repo
python3 scripts/tests/test_baseline.py
```

These paths are relative to this skill folder. Python 3.10+ is required; no external Python packages or jq are needed. Shell wrappers remain available. A base ref is required for meaningful diff checks; `AGENT_LOGIN` is required for the CODEOWNERS check.

## Outputs / References

- Inventory schema v2: `MISSING`, `CONFIGURED`, `FAILED`, `UNKNOWN`; it never claims pillar-level `VERIFIED` without behavioral testing. Applicability begins `UNASSESSED` and is assessed separately.
- Default developer decision card: one recommendation, scoped evidence, system impact, ordered next steps, acceptance, owner/effort and approval; at most 250 words excluding compact source references. Follow-ups report only decision-relevant changes. Full candidate assessment is available on request.
- Target-owned `.lean-agentic-baseline/manifest.json`: template hash plus adapted-file baseline; backward-compatible reading of legacy records.
- Drift results: `PASS`, `DRIFT`, `EDITED`, `DRIFT_EDITED`, legacy baseline unknown, missing target/template, stale source manifest.
- [Reference index](references/README.md) and [26-pillar acceptance matrix](references/assessment.md).
- [Synthetic output examples](references/output-examples.md) and [four response-evaluation cases](evals/evals.json): prerequisite investigation, no-change judgment, safe protection verification and adoption-ready integration. Execution traces are checked against the permission boundary as well as final-answer claims.
- Templates: [Tier 0](assets/templates/tier-0/README.md), [Tier 1](assets/templates/tier-1/README.md), [Tier 2](assets/templates/tier-2/README.md), [Tier 3](assets/templates/tier-3/README.md).

## Evidence / Results

**2026-10-06 regression pass:** `python3 scripts/tests/test_baseline.py` passed 21 tests. Fixtures exercise all 26 unique pillar rows; empty directory/config rejection; configured-not-verified results; no target command execution; known no-op validation; malformed manifests/settings; missing prerequisites; adapted-file baseline correctness; independent upstream/local changes; legacy records; missing files; repository-escaping paths; immutable content history; and allow-rules not satisfying ask-first policy.

**2026-10-07 review pass:** all 25 tests passed after adding extensionless-template/guidance retention, advisory steering-budget handling, permission substring collisions and commented CODEOWNERS identities. A read-only inventory of the actual Astro guide application reported 26 rows (three CONFIGURED, sixteen MISSING, seven UNKNOWN), without pretending that its validate entrypoint had run or that hosting controls were verified.

**2026-10-08 developer-output regression:** all 26 script tests passed, including a new fixture confirming output examples and evaluation cases retain matching manifest hashes and exact content snapshots. Independent review found no critical implementation issue; two evaluation gaps (adoption-ready coverage and permission-trace checks) were added. The first four paired response replays on Claude Opus 5 reduced whitespace word counts from 673–1,200 to 272–306, but every revised answer still missed the 250-word ceiling and one omitted adoption-evidence recording. A second replay exposed unsupported actor/date claims. These failures drove tighter presentation and evidence rules; shorter output alone is not a successful result.

**Final paired replay, response length only:** revised full answers contained 177–300 whitespace-delimited words (mean 241.8), versus 664–1,586 (mean 1,164.3) with the preserved old skill. This is about 79% fewer visible words across four supplied-fact scenarios on Claude Opus 5, one successful run per scenario/configuration. It does not establish repeatability, comprehension by a real developer, triggering quality, full script-workflow adherence or live enforcement. Full-answer counts include any source references; the grading contract excludes only standalone source references. Permission/evidence correctness is assessed separately and can fail a shorter answer.

**Final independent correctness grading:** revised answers passed 31/36 individual assertions versus 27/36 for the old skill, but only **1/4 revised answers** passed the overall factual/safety gate (old: 0/4). Two revised responses exceeded 250 words. The roadmap response scored 10/10 assertions yet incorrectly inferred that CI had never seen the whole branch from 79 unpushed commits. Protection verification omitted the disposable-versus-real proof boundary and overstated review impact. The adoption response treated a disposable source branch as containment for a real merge target and omitted adoption-results recording. All eight execution-permission checks passed: the evaluated agents executed no fixtures, accessed no hosting accounts and changed no source files. **Developer-response workflow remains experimental; the script-level validated status is not certification of recommendation safety.** Revision 2026-10-08.2 records these results and the explicit hard-quality evaluation gate; evaluated runtime guidance is unchanged from 2026-10-08.1.

**Before/after observations:** the previous script returned nine PASS rows for a fixture with empty directories/configs and no-op validation. Current inventory does not label these controls verified and identifies no-op validation as FAILED. Previously, a freshly adapted file immediately reported EDITED; it now reports PASS against its actual adopted baseline. Combined upstream/local changes now report DRIFT_EDITED rather than hiding upstream movement.

The initial 2026-09-20 authoring pass exercised this vault, a stale-ADR fixture, missing-file outcomes, ticket-reference detection, and legacy hash tracking. These remain limited script-level observations. New acceptance/measurement guidance is explicitly proposed, not a claim of real-team outcomes.

Confidence remains medium. No real-team outcome comparison or end-to-end live pillar adoption has been established; regression tests do not establish lower rework or safer production.

## Failure Modes / Boundaries

- **Static inventory is not readiness.** Exit 0 means no detected failure. `--strict` intentionally cannot certify all pillars from static contents.
- **Detection is incomplete.** Unsupported filenames, CI providers and harnesses require investigation; MISSING is not confirmed absence or inapplicability. Candidate files may still be incomplete.
- **External evidence needs authority, not necessarily manual work.** Authorized APIs and safe probes can verify hosting settings or tool health; human owners approve policy and disruptive tests.
- **Diff and path checks are limited.** Equal assertion counts can conceal weakening. Permission checking compares exact Edit/Write rule paths only; broader rules, Bash, precedence and every alternate tool path require separate review. CODEOWNERS explicit owner tokens do not prove broader overriding patterns, human membership or required review.
- **Templates are old starting points.** Re-check installed tool versions and adapt placeholders before wiring them in. Containers, labels and workflows do not independently prove isolation, autonomy limits or approval gates.
- **Adoption is explicit.** Unrecorded copies cannot be tracked; malformed records are rejected rather than overwritten. Legacy adaptations without a recorded baseline remain unknown until reviewed and re-adopted.
- **Conciseness is not correctness.** Unsafe probes or unsupported enforcement claims fail a response regardless of length. Negative tests must remain safe if the control fails; aggregate CI/merge counts do not prove per-merge bypass. Required boundaries are not removed automatically because their checks become unreliable.
- **A prompt is not a hard length limiter.** Compact targets substantially shortened these replays but did not keep every full response under 250 words. The evaluation ceiling exposes violations; it is not a guarantee from the model or a deterministic renderer. Human consumption and safety remain validation gaps until observed.
- **History has a boundary.** Content snapshots support actual diffs from this skill revision onward. Legacy hash-only history cannot reconstruct old text. A guide pin does not automatically monitor the live website.

## Related artifacts

- [Skill authoring](../skill-authoring/).
- [Artifact structure](../../docs/standards/artifact-structure.md).
- Guide source: `Lean Agentic Baseline` v3.2 export; repository: https://github.com/emb715/lean-agile-agentic.
