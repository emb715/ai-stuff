# Skill Authoring Best Practices — Claude Platform

Source: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices  
Captured: 2025-06

---

## Core principle: concise is key

The context window is shared between system prompt, conversation history, other skills' metadata, and the user's request. Every token in SKILL.md competes with all of these.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge every piece of information:
- Does Claude really need this explanation?
- Can I assume Claude knows this?
- Does this paragraph justify its token cost?

**Concise vs. verbose:**

```markdown
# Good (~50 tokens)
## Extract PDF text
Use pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

# Bad (~150 tokens)
## Extract PDF text
PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available...
```

The concise version assumes Claude knows what PDFs are and how libraries work.

---

## Degrees of freedom

Match specificity to task fragility.

### High freedom — text instructions
Use when multiple approaches are valid, decisions depend on context, or heuristics guide the work.

```markdown
## Code review process
1. Analyze code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability
4. Verify project conventions
```

### Medium freedom — pseudocode or parameterized scripts
Use when a preferred pattern exists but some variation is acceptable.

```markdown
## Generate report
```python
def generate_report(data, format="markdown", include_charts=True):
    # Process data
    # Generate output in specified format
```

### Low freedom — exact scripts, no parameters
Use when operations are fragile, consistency is critical, or a specific sequence must be followed.

```markdown
## Database migration
Run exactly:
```bash
python scripts/migrate.py --verify --backup
```
Do not modify the command or add flags.
```

**Analogy:** Claude is a robot on a path.
- Narrow bridge with cliffs → only one safe way → exact instructions (low freedom)
- Open field → many paths work → general direction (high freedom)

---

## Naming conventions

Use **gerund form** (verb + -ing) for clarity. `name` field: lowercase, numbers, hyphens only.

```yaml
# Preferred (gerund)
name: processing-pdfs
name: analyzing-spreadsheets
name: managing-databases

# Acceptable alternatives
name: pdf-processing
name: process-pdfs

# Avoid
name: helper     # too vague
name: utils      # too generic
name: documents  # no action
```

---

## Writing effective descriptions

The `description` is injected into the system prompt. Claude uses it to select the right skill from potentially 100+ available.

**Always write in third person** — inconsistent point-of-view causes discovery problems.
```yaml
# Good
description: Processes Excel files and generates reports

# Bad
description: I can help you process Excel files
description: You can use this to process Excel files
```

**Include both what it does and when to use it:**

```yaml
# PDF skill
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Git commit skill
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.

# Vague (bad)
description: Helps with documents
description: Processes data
```

---

## Progressive disclosure patterns

SKILL.md is a table of contents. Keep it under 500 lines. Split content into files loaded only when needed.

### Pattern 1: High-level guide with references

```markdown
# PDF Processing

## Quick start
[minimal example here]

## Advanced features
**Form filling**: See [FORMS.md](FORMS.md)
**API reference**: See [REFERENCE.md](REFERENCE.md)
```

Claude loads FORMS.md or REFERENCE.md only when the task requires it.

### Pattern 2: Domain-specific organization

Organize by domain so Claude only reads what's relevant to the task:

```
bigquery-skill/
├── SKILL.md
└── refs/
    ├── finance.md
    ├── sales.md
    ├── product.md
    └── marketing.md
```

```markdown
# BigQuery Data Analysis

**Finance**: Revenue, ARR → See [refs/finance.md](refs/finance.md)
**Sales**: Pipeline, accounts → See [refs/sales.md](refs/sales.md)
```

### Pattern 3: Conditional details

```markdown
**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

### No orphan rule (library-skill-builder addition)

Every `refs/` file must have exactly one routing link in SKILL.md. A file with no link is undiscoverable.

### Avoid deeply nested references

Claude may partially read nested files using `head -100` rather than reading them fully.

```markdown
# Bad — too deep
SKILL.md → advanced.md → details.md → actual content

# Good — one level
SKILL.md → advanced.md (actual content here)
SKILL.md → reference.md (actual content here)
```

### Reference file table of contents

For reference files longer than 100 lines, include a ToC at the top. Claude can see scope even on partial reads.

```markdown
# API Reference

## Contents
- Authentication and setup
- Core methods (create, read, update, delete)
- Advanced features
- Error handling
- Code examples
```

---

## Workflows and feedback loops

### Complex workflows — use checklists

For multi-step processes, provide a checklist Claude can copy and track:

```markdown
## Migration workflow

Copy this checklist:
```
- [ ] Step 1: Analyze the form (run analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run validate_fields.py)
- [ ] Step 4: Execute migration
- [ ] Step 5: Verify output
```
```

### Feedback loops — validate → fix → repeat

```markdown
## Document editing process

1. Make edits to `word/document.xml`
2. **Validate immediately**: `python ooxml/scripts/validate.py unpacked_dir/`
3. If validation fails: review error, fix, run validation again
4. **Only proceed when validation passes**
5. Rebuild: `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
```

The loop catches errors before they propagate.

---

## Content guidelines

### Avoid time-sensitive information

```markdown
# Bad
If you're doing this before August 2025, use the old API.

# Good
## Current method
Use the v2 API: `api.example.com/v2/messages`

## Old patterns
<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>
The v1 API used: `api.example.com/v1/messages`
</details>
```

### Consistent terminology

Pick one term and use it everywhere. Mixing `endpoint`/`URL`/`route`/`path` for the same concept forces Claude to reconcile ambiguity.

---

## Common patterns

### Template pattern

**Strict (exact format required):**
```markdown
ALWAYS use this exact template:
# [Analysis Title]
## Executive summary
[One paragraph]
## Key findings
- Finding with data
## Recommendations
1. Specific action
```

**Flexible (adapt to context):**
```markdown
Here is a sensible default — use judgment based on the analysis:
# [Title]
## Executive summary
## Key findings
[Adapt sections based on what you discover]
```

### Examples pattern

For output quality that depends on style, provide input/output pairs:

```markdown
## Commit message format

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
```
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

**Example 2:**
Input: Fixed bug where dates displayed incorrectly
Output:
```
fix(reports): correct date formatting in timezone conversion
```
```

### Conditional workflow pattern

```markdown
## Document modification

1. Determine type:
   **Creating new?** → Follow "Creation workflow"
   **Editing existing?** → Follow "Editing workflow"

2. Creation: use docx-js, build from scratch, export .docx
3. Editing: unpack, modify XML, validate each change, repack
```

---

## Evaluation-driven development

**Build evaluations before writing extensive documentation.**

Process:
1. Run Claude on representative tasks *without* a skill — document specific failures
2. Create 3 test scenarios targeting those gaps
3. Establish baseline (Claude without the skill)
4. Write minimal instructions to pass evaluations
5. Iterate: run evaluations, compare to baseline, refine

```json
{
  "skills": ["pdf-processing"],
  "query": "Extract all text from this PDF and save to output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Reads PDF using appropriate library",
    "Extracts text from all pages",
    "Saves to output.txt in readable format"
  ]
}
```

---

## Iterative development with two Claude instances

**Claude A** = the expert who helps write and refine the skill  
**Claude B** = the agent using the skill for real tasks

Process:
1. Complete a task with Claude A using normal prompting — notice what context you repeatedly provide
2. Ask Claude A: "Create a skill capturing this pattern"
3. Review for conciseness: "Remove explanations Claude already knows"
4. Improve information architecture: "Move the schema to a separate ref file"
5. Test with Claude B on similar tasks
6. Observe failures → return to Claude A: "Claude B forgot to filter test accounts — the rule isn't prominent enough"
7. Refine → test → repeat

> Claude models understand the skill format natively. No special system prompt needed to get Claude to write a skill — just ask.

---

## Advanced patterns

### Structured tool use

Make tool calls deterministic by specifying exact structure:

```markdown
## Field extraction

Use this exact JSON structure for extracted fields:
```json
{
  "fields": [{"name": "...", "type": "...", "location": {"page": 1, "x": 100, "y": 200}}]
}
```
```

### Plan → validate → execute

For batch operations or high-stakes changes:

1. Have Claude produce a structured plan (JSON, YAML, etc.)
2. Validate the plan with a script before executing
3. Only execute after validation passes

Makes errors machine-verifiable and operations reversible.

### Visual analysis

When inputs can be rendered as images (PDFs, diagrams):

```markdown
1. Convert to images: `python scripts/pdf_to_images.py form.pdf`
2. Analyze each page image to identify form fields
3. Claude can see field locations and types visually
```

---

## Alignment with library-skill-builder principles

| Best practice doc says | library-skill-builder enforces |
|---|---|
| Concise is key | Token efficiency step (Step 7), compression test |
| Description = what + when, third person | Trigger description step (Step 8) |
| Progressive disclosure, one level deep | No orphan rule, refs/ structure |
| Evaluation-driven development | humans.md: known gaps + maintenance checklist |
| Test with Claude A, evaluate with Claude B | Implicit in the iterative process |
| Avoid time-sensitive content | Part of audit step (Step 4) |
| Consistent terminology | Covered in affirmative writing step (Step 6) |
| Feedback loop / validate → fix → repeat | Grounded antipatterns step (Step 3) |
