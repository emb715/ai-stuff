---
name: skill-authoring
description: Creates, audits, and maintains agent skills for software libraries, frameworks, and tools. Use when authoring a SKILL.md from verified documentation or reviewing an existing skill's accuracy, scope, reference delivery, trigger precision, or effectiveness. Not for ordinary library usage or standalone operational playbooks.
---

# skill-authoring

A process for turning verified library, framework, or tool knowledge into a useful agent skill. Use one coherent capability per skill; a multi-step workflow is acceptable when its steps serve that capability.

This procedure is self-contained: it requires target source material and available authoring/evaluation tools, not another skill or a particular repository layout.

## Skill quality checklist

A good skill is:

- Accurate — operational claims are traceable to the target version's sources
- Cohesive — common tasks share a capability and explicit scope boundaries
- Concise — remove duplication and familiar background, not decision-relevant rationale
- Progressively disclosed — common paths and essential safeguards inline; depth loaded conditionally
- Portable — prerequisites are explicit and resource links work after installation
- Secure — protect credentials, data, and permissions; distinguish advice from authorized execution
- Grounded — warnings cover plausible failures and show safe alternatives
- Evaluated — separate static authoring quality from measured behavioral benefit

## Process

### Step 1 — Gather the source of truth

Record the target version, verification date, sources, intended tasks, and execution prerequisites. Start with official docs to identify intended usage; consult release notes for version changes.

Verify claims using the source appropriate to the claim:

| Claim | Verification source |
|---|---|
| API signature, import, CLI flag | Target-version definitions, exports, or CLI help |
| Defaults, side effects, failure behavior | Implementation and reproducible observations |
| Intended usage and migration | Version-matched official docs and release notes |
| Recommendation or performance benefit | Observed comparison or bounded rationale labeled as provisional |

Capture the public surface relevant to the skill's scope, common signatures, and configuration affecting correct use. Avoid exhaustive coverage unrelated to the intended tasks.

Maintain a claim ledger in the authoring report, not necessarily the runtime body:

| Claim | Version / source locator | Verification result | Action |
|---|---|---|---|
| Exact statement | File + symbol, help section, or URL | Verified / conflicting / unverified | Keep / correct / qualify / omit |

Where sources disagree, explain which source establishes the signature, intended behavior, or observed behavior. Do not silently choose whichever supports the draft. Omit unverified operational instructions; explicitly label remaining uncertainty and do not invent a safe default.

### Step 2 — Prioritize failure modes and safeguards

Identify plausible mistakes from documentation, implementation, or observed baseline failures. Rank by severity, likelihood, and how naturally the wrong pattern arises.

Keep safeguards essential to common tasks in SKILL.md, even when more than one is needed. Put advanced or secondary cases in `references/` with explicit loading conditions. Do not invent a footgun to fill a template.

For destructive operations, permission changes, indexing sensitive files, or network egress: state the consequence, scope, authorization needed, and safer recovery path. Treat error hints as evidence to interpret, not automatically executable commands.

### Step 3 — Identify grounded antipatterns (optional)

Antipatterns belong in a skill when the model will confidently produce the wrong version from plausible reasoning about the API. They do not belong when the model would only write them out of pure ignorance — that is a documentation gap, not an antipattern.

The test for inclusion: could the model write this wrong version while believing it is correct? If yes, it earns a place. If the model would only write it because it doesn't know the API at all, add a better example instead.

Each antipattern must:
- Show the wrong version with a one-line explanation of why it fails
- Immediately follow with the correct version
- Name the failure mode, not just the fix

Never show ✗ without ✓. A wrong example with no correction and no explanation of the failure risks the model retrieving the wrong pattern in a different context. The pairing is the protection — omit either half and the antipattern becomes a liability.

```md
// ✗ — triggers a full remount on every render, destroying state and refs
// ✓ — define at module scope; use props for values that change at runtime
```

Put common, consequential cases beside the relevant instruction. Use a separate reference when it forms a useful concern, not because the list crosses an arbitrary item count.

### Step 4 — Audit existing docs or skill (if rewriting)

If a skill or documentation already exists, compare every claim against the source of truth gathered in Step 1.

Look for:
- APIs documented that no longer exist
- APIs that exist but are undocumented
- Type signatures that don't match reality
- Warnings about things that don't exist — the model now knows to try them
- Version or size claims that are stale
- Examples that use removed or renamed APIs

Also inspect contradictory precedence rules, inaccessible resource links, implicit prerequisites, and trigger overlap with adjacent skills.

For generated skills, identify the maintained template, wrappers, generator, installer, and installed copies. Edit the source of truth and regenerate downstream output; do not patch only installed copies. Verify all supported installation paths deliver any bundled resources.

Do not carry forward unverified operational claims. Report omissions and unresolved conflicts separately from verified corrections.

### Step 5 — Decide the structure

SKILL.md covers:
- Capability, scope, and execution prerequisites
- Install or import when needed, using verified commands
- Common task-selection rules with unambiguous precedence
- Minimal valid examples for the intended tasks
- Essential safety constraints, important limitations, and failure recovery
- Conditional routes to deeper resources

`references/` covers exhaustive API/configuration tables, advanced variants, detailed response contracts, and migration history. Organize by concern. Use `scripts/` for verified deterministic work that otherwise repeats, and `assets/` for output resources.

Bundle required resources with the skill or declare an explicit, supported dependency. Resolve relative links from the installed skill directory, not the author's repository. Check transitive dependencies as well as direct links; a bundled file pointing at missing templates is still broken. Do not assume that writing SKILL.md also installs sibling files.

### Step 6 — Write affirmatively

Lead with the correct action. State limitations, removed behavior, or unsupported operations when a consumer would plausibly reach for them and the distinction affects correctness or safety. Avoid unrelated lists of absent features.

Use imperative instructions and brief rationale when it changes a decision or prevents misapplication. Distinguish recommending a command from being authorized to execute it.

Check that a new consumer has enough information to perform the intended task safely. This establishes authoring completeness, not behavioral validation.

### Step 7 — Demonstrate domain usage, not meta-authoring

A produced skill needs minimal valid examples of its domain tasks. It does not need a before/after example of SKILL.md writing. Use wrong/right pairs only for plausible, consequential domain mistakes.

The following authoring example demonstrates the target style; `tool` is a placeholder, not a runnable command:

Less useful section: "The reset command is useful when things go wrong. It removes cached data."

Improved section:
```text
For a confirmed corrupt index, inspect `tool status` first.
`tool reset` deletes the local index and cached data; obtain authorization before running it.
Rebuild with `tool reindex`, then verify `tool status` reports a usable index.
```

The improvement makes the condition, side effect, permission boundary, and recovery observable. Replace placeholders with verified commands in a real skill.

### Step 8 — Write for the model, not for a human reader

Prefer examples for exact usage and tables for parallel choices. Remove repeated activation rules, routing tables, background the model already knows, and transitions that add no action.

Retain short explanations that change interpretation, authorization, or recovery. Evaluate each section by whether it changes the consumer's next action correctly, not only the code it writes.

Line counts are compression diagnostics, not acceptance gates. When a body grows, inspect relevance and duplication before extracting references. Measure actual loaded-context cost where possible; moving text into a file always loaded on every task does not establish a saving.

### Step 9 — Write the trigger description

The `description` field drives skill discovery. Name the package/tool, capability, task contexts, and distinctive APIs or commands when useful. There is no required API-name count. Put positive triggers and important adjacent-skill boundaries here rather than repeating an activation list in the body.

```yaml
description: <Verb phrase describing what the skill does>. Activates when working with <library>, calling <api-1>, <api-2>, or <api-3>, or when <task-context>.
```

Avoid generic triggers such as "when working with JavaScript". Test both missed activations and false activations; a clear description is not proof of correct harness discovery.

### Step 10 — Evaluate before shipping

Finalize the body, resources, and description before evaluation and freeze the candidate. Any subsequent substantive change requires rerunning the affected behavior or discovery checks. Run two separate checks; report both outcomes.

Static authoring check:
- Required format/metadata valid for the target harness; preserve the existing skill name on revision
- Operational claims verified; uncertain recommendations labeled
- Instructions internally consistent, safeguards present, and examples valid
- Resources discoverable and installed; triggers scoped; duplicate content removed

Behavioral check:
1. Select at least three representative task prompts before drafting extensive instructions. Include common use, an edge/failure case, and a distinct task in scope. Define ground truth and verifiable correctness/safety assertions.
2. Run each identical prompt without the skill and with the candidate skill. On revision, also compare against an immutable snapshot of the old skill. Keep model/variant, tools, inputs, permissions, and task prompts constant; use independent sessions to avoid cross-run contamination.
3. Test discovery separately with should-trigger prompts and adjacent-domain should-not-trigger prompts. Leave loading to the harness; forcibly loading a skill tests behavior, not activation. Record expected and observed activation. Expand boundary cases when failures appear.
4. Compare correctness, unsupported claims, unsafe recommendations, tool misuse, recovery, and total context cost including skill loading and tool results. Record model, versions, settings, repeat count, outputs, and grading evidence. Repeat runs before making reliability claims; flag non-discriminating assertions and variance.

Use isolated comparison runs, evidence-backed grading, and human review of outputs. Grade against the predefined assertions using the produced artifacts and observed execution evidence, not the executor's self-assessment. Record each assertion's pass/fail result with its supporting evidence. Adapt execution tools to the target harness; report unavailable checks explicitly.

Critical factual or safety defects block shipping regardless of average score. Accept only when observed gaps close without correctness/safety regression or inappropriate activation; do not claim efficiency gains from line counts or incomplete usage counters.

If execution, discovery, or cost measurement is unavailable, mark that dimension untested. Static review permits a draft, not a claim of validated effectiveness. Keep evaluation evidence in an authoring report with verified claims, changes, results, and remaining limitations. Apply any explicitly supplied project lifecycle rules as additional constraints; no external policy document is required by this procedure. Do not infer general readiness from this checklist alone.

## Output structure

Installed runtime package (repository records are separate):

```
<skill-name>/
├── SKILL.md              ← model-facing: metadata, common tasks, safeguards, routes
└── references/
    ├── imports.md        ← full export reference by entry point
    ├── antipatterns.md   ← optional; grouped by useful concern
    ├── <concern-a>.md    ← depth for feature A
    ├── <concern-b>.md    ← depth for feature B
    └── ...
```

For installed Agent Skills, retain required `name` and `description` frontmatter and declare compatibility requirements when needed. If a project requires repository lifecycle metadata, keep it in a separate record using that project's format; otherwise no repository-specific record is required to use this procedure. Keep maintainer-only rationale separate from runtime resources and never make it a loading dependency.

## Routing table pattern

Use a section-level route or a conditional routing table. For example:

```md
See [references/routing.md](references/routing.md) for dynamic segments, layouts, and typed routes.
```

State when to load the file and what it provides. Every runtime reference must be discoverable from SKILL.md; multiple useful routes to the same concern are acceptable. Keep routing shallow. Before shipping, verify the mapping and installed resources:

```
references/imports.md        → linked from ## Installation / Import paths
references/auth.md           → linked from ## Authentication
references/data-fetching.md  → linked from ## Data fetching
references/configuration.md  → linked from ## Configuration
references/antipatterns.md   → linked from ## <relevant section>
```

If a reference has no useful loading condition, reconsider its runtime purpose or keep it as maintainer research. A top-level conditional routing table is acceptable when it makes selection clear.

## Applying this process

For any library or framework, the process is the same:

1. Establish versioned claims and baseline gaps.
2. Prioritize common tasks and essential safeguards.
3. Draft a cohesive core with conditional, deliverable resources.
4. Verify authoring quality, then behavior and discovery separately.
5. Record observed results and remaining uncertainty; revise or defer shipping when checks fail.

The method is harness-neutral; execution tools, packaging requirements, and scope remain explicit for each target.
