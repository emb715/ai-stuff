# ADR-001: Skill Structure and Authoring Conventions

**Status:** Accepted with revisions on 2026-10-07; superseded text is replaced below
**Date:** 2025-06  
**Context:** skill-authoring — the process skill for generating opencode skills from library documentation

---

## Context

When generating opencode skills for software libraries and frameworks, there are many valid choices: how to structure files, how much to put in SKILL.md vs. separate files, how to write descriptions, how to handle antipatterns, and what to document for maintainers. Without explicit decisions, each generated skill will make different choices, making the collection incoherent and hard to maintain.

This ADR records the decisions made for the skill-authoring process and the skills it generates.

---

## Decisions

### 1. Two audiences, two files

**Decision:** SKILL.md is written for a model. humans.md is written for a human maintainer.

**Rationale:** Skills are loaded as context tokens. Prose that helps a human understand a decision costs tokens that compete with actual instruction. Separating the two audiences means SKILL.md can be maximally dense without sacrificing maintainability.

**Consequences:**
- SKILL.md contains instructions, examples, and brief rationale when it changes interpretation, authorization, or recovery; unrelated maintenance prose stays separate
- humans.md contains rationale, source verification, known gaps, maintenance checklist, and decision log
- Neither file substitutes for the other

---

### 2. references/ for model-accessible references, docs/ for human research

**Decision:** Supplementary files the model may need to read during a session go in `references/`. Research, ADRs, and background documentation for human maintainers go in `docs/`.

**Rationale:** The model navigates the skill directory via bash. Files in `references/` are linked from SKILL.md and are part of the skill's operational surface. Files in `docs/` are not linked from SKILL.md and are never loaded as model context — they exist for the humans maintaining the skill collection. The directory name `references/` aligns with the official Agent Skills spec (agentskills.io), which uses `references/` as the optional documentation directory.

**Consequences:**
- Every runtime file in `references/` must be discoverable from SKILL.md with a useful loading condition; verify that installers deliver it and its dependencies
- Files in `docs/` have no routing link in SKILL.md — they are invisible to the model by design
- ADRs always go in `docs/`, never `references/`

---

### 3. No orphan rule — discoverable and deliverable references

**Decision (revised 2026-10-07):** Every runtime reference must be discoverable from SKILL.md through explicit loading guidance. More than one useful route is allowed. Remove, merge, or reclassify files with no runtime purpose.

**Rationale:** Conditional routing makes resources useful without loading all depth for every task. Exactly one link and a fixed placement do not establish discoverability or effectiveness. A correct link is still unusable if packaging omits its target.

**Consequences:**
- Use section-level links or a conditional top-level routing table, whichever makes selection clearer
- A references/ file with no natural home section is a signal the concern is not represented in SKILL.md — either add the section or eliminate the file
- State the loading condition and contents; resolve links from the installed package and test transitive resources

---

### 4. Description in third person, what + when

**Decision:** The `description` field must be written in third person and include both what the skill does and when to activate.

**Rationale (revised 2026-10-07):** A capability description should avoid self-referential assistant chatter such as "I can help you." An activation clause such as "Use when..." is compatible with a descriptive capability statement and appears in the supporting examples. Whether any phrasing improves discovery must be measured, not asserted from grammar alone.

**Consequences:**
- Description starts with a verb phrase: "Creates...", "Generates...", "Analyzes..."
- Description includes clear activation conditions; "Activates when..." and "Use when..." are both acceptable
- Include distinctive task language when useful; validate missed and false activation instead of relying on a phrase-count rule

---

### 5. Essential safeguards inline, secondary antipatterns in references/

**Decision (revised 2026-10-07):** Rank plausible failures by severity, likelihood, and natural misuse. Keep every safeguard essential to common tasks inline; group advanced cases by concern in references. No mandatory warning or item count.

**Rationale:** A fixed warning quota can hide essential protection when common operations have distinct consequences, such as deletion and remote export. Plausible wrong patterns should still name the failure and show the safe alternative; do not fabricate hazards.

**Consequences:**
- SKILL.md retains common-path correctness and safety requirements regardless of warning count
- Create references/antipatterns.md only when it is a useful concern, not when a numeric threshold is crossed
- Antipatterns that fail the inclusion test are not documented
- Every ✗ must be immediately followed by ✓ with the failure mode named — a ✗ without a paired ✓ and explanation is removed, not kept

---

### 6. Produced skills show domain usage; the meta-skill shows authoring style

**Decision (revised 2026-10-07):** Produced domain skills include valid usage examples. A bad-section/good-section authoring example belongs in skill-authoring itself, not as a required section of every generated skill.

**Rationale:** Authoring examples teach the author; domain examples teach the consumer. Requiring meta-authoring content in a domain skill wastes context and mixes audiences. Effectiveness of any example remains an evaluation question.

**Consequences:**
- Domain examples use verified signatures/commands
- Wrong/right pairs are optional and limited to plausible consequential domain mistakes
- Placeholder examples in the authoring skill are explicitly illustrative, not executable product claims

---

### 7. Evaluation before shipping

**Decision (revised 2026-10-07):** Check authoring quality separately from behavioral usefulness. Compare at least three identical representative prompts with and without the candidate; on revision also compare the immutable old skill. Test discovery separately using positive and adjacent negative prompts.

**Rationale:** Skills that close intended gaps but add noise to adjacent tasks are worse than no skill. Evaluation catches both failure modes. This mirrors the evaluation-driven development pattern from the Claude skill best practices.

**Consequences:**
- Critical factual/safety defects block shipping irrespective of average score; unmeasured behavior, discovery, or cost stays explicitly untested
- Failures are documented in humans.md under Known Gaps
- Keep model, tools, inputs, permissions, and prompts constant; forced loading measures behavior, not discovery
- Record actual outputs and grading evidence; repeat runs before reliability claims and use vault procedures for lifecycle changes
- Finalize the body and description before Step 10 evaluation; freeze the candidate and retest affected dimensions after substantive edits

---

### 8. Length diagnostics, not arbitrary acceptance gates

**Decision (revised 2026-10-07):** Remove the former 100–180-line target, 250-line hard cap, and combined 600-line quota as local acceptance rules. Diagnose relevance, duplication, conditional loading, and actual context cost. Honor concrete target-harness limits separately.

**Rationale:** Historical examples show that compact bodies are feasible; they do not establish an optimal length. Extracting depth helps only when the consumer can avoid loading it unnecessarily. Local source summaries mention 500 lines as guidance; do not represent guidance as a format-validity guarantee.

**Consequences:**
- A long skill prompts review, not automatic failure; a short skill can still be incomplete or wrong
- Split references by useful loading condition, not merely by size
- humans.md is exempt — it is never loaded as model context

---

### 9. Skill is harness-agnostic — no library-specific content in process steps

**Decision (revised 2026-10-07):** The authoring method is harness-neutral, but examples and declared prerequisites may be specific when clearly labeled. Do not assume the executor has a particular platform CLI or installation layout.

**Rationale:** Concrete examples can teach style without prescribing an ecosystem. Claims of portability must account for tooling, generated sources, and delivery differences.

**Consequences:**
- Mark illustrative placeholders explicitly; real product instructions need verified sources
- The "Applying this process" section is generic — it describes the shape of the application, not a specific one
- Real library examples that informed the process design live in docs/ or humans.md as historical context

---

### 10. Markdown decoration policy — strip separators, bold, and decorative arrows

**Decision (revised 2026-10-07):** Prefer economical structural markdown and remove decoration that adds no meaning. Do not reject useful emphasis or separators solely on assumed token savings; required YAML frontmatter is not decorative markdown.

**Rationale:** Markdown rendering is for humans reading in a UI. A model consuming a skill as context tokens sees raw text — `**bold**`, `---`, and `→` cost tokens and carry no instruction value. The words carry the meaning; the decorators do not. The exception is structural markdown (headings, tables, code fences, links) which the model uses for navigation and semantic parsing, not visual rendering.

**Consequences:**
- Preserve metadata syntax and clear navigation
- Prefer concise headings, tables, examples, and links; judge extra formatting by usefulness rather than a blanket prohibition
- humans.md is exempt — it is for human readers and may use any markdown freely
- docs/ files are exempt — they are human research documents, not model context

---

### 11. Headings over CAPS — hierarchy is load-bearing

**Decision:** Section labels use markdown headings (`##`, `###`) not ALL-CAPS text. Heading levels are preserved as written — do not flatten to a single level.

**Rationale:** A model consuming raw text parses `##` and `###` as structural signals, not visual decoration. Heading levels communicate nesting: `### Style props` under `## createComponent` tells the model style props are a sub-concern of createComponent, not a peer section. ALL-CAPS conveys the same information at the top level but loses hierarchy. The token cost difference between `## Color mode` and `COLOR MODE` is 1–2 tokens per heading — not a meaningful saving relative to the structural loss. Headings are kept; decorators are stripped.

**Consequences:**
- `##` for top-level sections in SKILL.md
- `###` for sub-sections (e.g. features within a top-level API)
- No ALL-CAPS section labels
- Heading levels must reflect actual nesting — do not use `###` for a section that is not a child of the preceding `##`

---

## Alternatives considered

**Single SKILL.md file, no references/**  
Rejected. A flat skill that contains the full API reference, all antipatterns, and all configuration options would approach or exceed 500 lines. Progressive disclosure requires splitting content so the model only loads what each task needs.

**Top-level routing index instead of section-level links**  
Rejected. A top-level index lists files with no context. A model that hasn't read the sections yet doesn't know which file is relevant. Section-level routing links appear after the model has read the section they relate to — by then the model knows whether to follow the link.

**docs/ for both research and model references**  
Rejected. Mixing human research with model-accessible references creates an unclear boundary. The model should never need to navigate docs/ — that's a signal it has the wrong purpose. references/ is the model's space; docs/ is the maintainer's space.

**Gerund naming only (processing-pdfs, building-skills)**  
Partially adopted. Gerund form is preferred but noun-phrase alternatives (pdf-processing, skill-authoring) are acceptable. The skill-authoring name itself uses noun-phrase form.

---

## Decision log

**2026-08-12 — Changed `refs/` to `references/` across all skills.** Decision #2 originally chose `refs/` as a shortened form of `references/`. The official Agent Skills spec (agentskills.io) uses `references/` as the optional documentation directory name. The shortened `refs/` was a vault convention that created divergence from the standard. Decision reversed: use `references/` to align with the official spec. All existing `refs/` folders renamed to `references/`; all routing links and documentation updated. The rationale, no-orphan rule, and one-concern-per-file convention are unchanged — only the directory name.

**2026-10-07 — Evidence-specific authoring revision.** Replaced the prose/warning/link/length quotas and mandatory domain-skill meta-authoring examples. Added matched evaluations, separate discovery/cost reporting, and installed-resource checks. The current decisions above supersede corresponding earlier constraints; the original rationale is historical, not proof of effectiveness. Keep skill-authoring draft pending sufficient real-world evidence and the vault promotion procedure.

---

## References

- agentskills.io/specification — format spec
- platform.claude.com/docs/en/agents-and-tools/agent-skills/overview — loading model
- platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices — authoring guidance
- docs/specification.md — local research distillation
- docs/claude-overview.md — local research distillation
- docs/claude-best-practices.md — local research distillation
