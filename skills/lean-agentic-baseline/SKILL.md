---
name: lean-agentic-baseline
description: Assess and adapt a repo's AI-engineering setup against 26 Lean Agentic pillars. Use for agent-readiness audits, configuration inventories, pillar feasibility, human-versus-agent responsibilities, context-sensitive adoption plans, behavioral acceptance checks, and template drift. Also use when asked whether a pillar fits a project or whether its maintenance earns its cost. Not for reviewing one PR's code or replacing library documentation.
---

# lean-agentic-baseline

Help a project achieve relevant engineering goals, not accumulate configuration files. Cover 26 pillars across four tiers; preserve the distinction between sourced tool behavior and the guide's own proposals.

## Source and scope

Read `VERSION.json` first. Original templates remain pinned to guide **v3.2**; `skill_revision` versions this skill's changes independently. `reviewed_guide` identifies the repository revision checked for the 26-pillar inventory and assessment goals, not a claim that every old template was re-extracted. Newer guide content requires an explicit source review.

This skill provides static inventory, context-based assessment, bounded implementation, and adoption tracking. It does not certify security, choose business priorities, grant itself authority, or prove productivity from a scorecard.

## 1. Inventory without executing target code

Resolve `SKILL_DIR` to the folder containing this file; supply the target explicitly. All script/reference paths below are relative to `SKILL_DIR`, not the target repository.

```bash
TARGET_REPO=/path/to/repo bash "$SKILL_DIR/scripts/scorecard.sh" --json
```

Requires Python 3.10+. Paths below are relative to this skill's folder. The inventory reads supported files; it does not install tools, execute repository commands, call hosting APIs, or modify files.

| Evidence | Meaning |
|---|---|
| `MISSING` | No supported meaningful configuration detected; alternatives may exist |
| `CONFIGURED` | Candidate configuration detected; operation and goal achievement untested |
| `VERIFIED` | A named acceptance test was observed passing, with scope/date/source |
| `FAILED` | A named check found a concrete violation; report exactly what failed |
| `UNKNOWN` | Available access or supported detection cannot establish a result |

Static inventory never emits `VERIFIED` for a pillar. Its exit 0 means only **no detected failure**, not readiness. `--strict` exits 1 unless all rows are verified, so this static-only inventory intentionally cannot satisfy it. Schema v2 replaces legacy PASS/FAIL/SKIP/UNVERIFIABLE output.

Every inventory row starts with applicability `UNASSESSED`. Assess it separately: `APPLICABLE`, `DEFERRED`, or `NOT_APPLICABLE`, each with a reason; deferred work needs a revisit trigger. Missing is not inapplicable, and external is not inherently human-only. Authorized APIs, git history and safe probes can provide evidence after permission is established.

## 2. Assess fit before proposing changes

Collect only missing context: project pain, stack/harness, team/agent concurrency, deployment exposure, hosting access, existing equivalent controls, risk tolerance and maintenance capacity. Read `references/assessment.md` for the 26-pillar acceptance matrix and output contract; read only the relevant tier for deeper examples.

Assess each requested or material pillar, but present only what changes the decision:
- **Goal and fit:** actual problem, applicability, equivalent implementation if appropriate.
- **Feasibility:** prerequisites, available authority/access, blockers and dependencies.
- **Ownership:** agent implementation/verification versus human decisions/approvals.
- **Evidence:** current state, exact acceptance test, source/date and remaining limits.
- **Cost and outcome:** upkeep owner, observable benefit, comparison method and removal/revisit criterion.

Before selecting a control, resolve any requirement that could disqualify it: bypass tolerance, gate reliability, actual trigger frequency, platform availability and policy authority. If evidence or permission is missing, recommend investigation rather than a ready-to-implement control. External or untracked configuration limits portability, not applicability.

Recommend the smallest useful next step, including no change. Tier order guides dependencies, not a mandate to install everything or wait an arbitrary number of weeks. A production approval boundary may be urgent even in a solo project; orchestration or a team memory service may add no value there.

## Developer-facing response

The developer needs a decision, its system impact and the next action—not a transcript of the investigation. Aim for 120–170 words in one decision card; 250 is the ceiling, including headings, inline citations and lists (only standalone source references are excluded). One short sentence per field usually suffices; next actions can share one line. Expand only when the user requests detail. Prioritize material limits over filling every field. Keep the full assessment available for follow-up; do not create report files without permission.

```text
Decision: Adopt / Investigate / Defer / No change — one recommendation and reason.
Evidence: strongest observed facts with source; separate inference and unknowns.
System impact: behavior/components/files/settings changed; what stays; disruption/bypasses.
Next: up to three ordered actions → expected result; prerequisites before enforcement.
Acceptance: positive + isolated negative test and expected results, or missing proof.
Owner / effort: accountable owner; bounded estimate with assumptions, or unknown.
Approval: one concrete decision/access request; at most two blocking questions.
```

Fold rollback, residual limits and upkeep/revisit criteria into the relevant lines when adoption is proposed. Compare at most three candidates only when useful; do not print the 26-row inventory unless an audit is requested. On follow-up, report changed evidence, revised decision/impact and next action, normally within 150 words. Give progress updates only for a material discovery, blocker or change of direction. Read `references/output-examples.md` when calibrating the response; examples are synthetic, not evidence.

## Evidence and test safety

- Missing filename matches are detection gaps until equivalents are checked. Configuration presence, workflow token permissions and an agent's own policy edits do not establish effective enforcement or independent ownership.
- Scope enforcement to actor, operation, environment and observed test. A verified bypass actor does not invalidate enforcement against every other actor. Unknown actors are unassessed, not proven unconstrained. Administrator authority to edit/delete policy is different from permission to bypass the current policy; do not invent bypass membership. Use “administrator bypass status unknown” when no actor/policy evidence establishes it.
- Aggregate failed runs and merge counts do not establish that those merges bypassed failed checks. Correlate each relevant merge with its applicable check result and time before making that claim. Use only supplied or observed evidence dates; today's date is not the date of an undated fixture.
- A negative test is safe only if it remains safe when the control is absent or broken. Use isolated fixtures or a disposable repository/environment. Never propose force-pushing the real default branch as a protection probe. Draft-PR UI state alone cannot isolate required-check enforcement from draft restrictions.
- Confirm a test's intended boundary before changing exclusions; broad ignore rules can weaken the invariant. Do not equate passing locally with passing CI.
- Separate known setup cost from unknown diagnosis and ongoing exceptions. If a failure's cause is unknown, its diagnosis cost is unknown; do not replace that with a guessed hours/minutes bound or invent zero upkeep. Unreliable CI calls for repair and owner-approved exception handling, not automatic removal of a required boundary. Account/plan support requires current platform evidence. Keep unsupported platform defaults and causal explanations out of the decision card; flag decision-relevant uncertainty instead.

## 3. Implement one agreed pillar

1. Read its tier section and relevant acceptance row. Agree scope, prerequisites, authority and success evidence before writes.
2. Reuse existing controls where they achieve the goal. Adapt a template to the installed stack/harness; do not overwrite policy, customizations or unrelated work. Consult installed-version documentation for tool syntax.
3. Review the diff. Run authorized positive and safe negative tests; demonstrate that a violation is rejected and a legitimate case still works. Production rehearsals require the owner's explicit authorization.
4. Record adoption **after adaptation**:
   ```bash
    TARGET_REPO=/path/to/repo bash "$SKILL_DIR/scripts/adopt.sh" assets/templates/tier-0/AGENTS.md AGENTS.md
   ```
   It records both upstream template and actual adopted-file hashes. Target must exist; stale source hashes and repository-escaping paths are rejected.
5. Re-run inventory, but report `VERIFIED` only from the behavioral evidence, scoped to what was tested. Unchecked hosting settings or secrets/egress controls remain open.
6. Record outcome baseline, upkeep owner and revisit trigger. An installed file alone is not a successful adoption.

Standalone checks return 0 pass / 1 fail / 2 missing prerequisite. They prove only their named check, not an entire pillar. Diff checks need a real base ref:
```bash
bash "$SKILL_DIR/scripts/checks/no-ticket-refs.sh" <base-ref> "ENG|PROJ"
bash "$SKILL_DIR/scripts/checks/no-test-weakening.sh" <base-ref>
```
Assertion counts are a warning proxy, not semantic integrity. A softened assertion can keep the same count; use mutation tests, targeted negative tests or review. The permission check compares exact Edit/Write paths in ask/deny rules; broader rules, Bash, precedence, other tools and independent ownership need separate review.

## 4. Review adoption drift without overwriting

```bash
bash "$SKILL_DIR/scripts/check-pinned-versions.sh" /path/to/repo
```

| Result | Meaning |
|---|---|
| `PASS` | Adopted adaptation unchanged; upstream unchanged |
| `DRIFT` | Upstream changed; adaptation unchanged |
| `EDITED` | Local file changed after adoption; upstream unchanged |
| `DRIFT_EDITED` | Both changed; preserve customization while reviewing |
| `BASELINE_UNKNOWN` / `DRIFT_BASELINE_UNKNOWN` | Legacy manifest lacks the adapted-file baseline; review and re-adopt |
| `GONE` / `TEMPLATE_GONE` / `MANIFEST_STALE` | Missing target/template or mismatched current source hashes; repair explicitly |

No drift checker silently updates a target. Legacy manifests are readable; an unknown adaptation baseline is not invented. Content snapshots in `references/version-history/*.contents.json` support actual diffs from this revision onward; older hash-only archives cannot reconstruct lost text.

## 5. Maintain and evaluate

For source updates, inspect the pinned and newer repository revisions, all 26 pillar goals, affected references and templates. Keep old template provenance if a full re-extraction was not performed. Update constants in `scripts/versioning.py`, bump `SKILL_REVISION` for changed shipped files, then run `scripts/generate-version-manifest.sh`; history keys and content snapshots are immutable.

Run `python3 "$SKILL_DIR/scripts/tests/test_baseline.py"`. Use `evals/evals.json` to compare decision clarity, impact, sequencing, no-change judgment, evidence accuracy and test safety against a previous snapshot on the same model. Unsafe probes and unsupported enforcement claims fail the response regardless of brevity. Measure response length separately from correctness; one successful replay is not repeatability. Test the workflow on a real application separately before claiming field effectiveness. Proposed outcomes: lower attributed follow-up fix rate, less retrieval effort with equal correctness, reliable enforcement and manageable review/upkeep cost. Compare similar tasks and record methods; don't infer benefit from more passing rows.

Tier references:
- `references/tier-0-groundwork.md`: steering, validation, commits, hooks, permissions.
- `references/tier-1-guardrails.md`: CI, branching, skills, comments, integrity, architecture, containers.
- `references/tier-2-memory-context.md`: decisions, handoffs, indexing, versioned docs, memory, supply chain, fact homes.
- `references/tier-3-scale.md`: agents, review, planning, deploy controls, metrics, drift, people.
