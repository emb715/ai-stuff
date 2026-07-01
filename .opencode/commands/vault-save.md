---
description: Interactive walkthrough for saving an artifact from another project
---

Read `_meta/framebook/save-artifact/playbook.md` fully before proceeding.

Walk the user through the intake procedure interactively:

Step 1 — Classify
Ask: "What is this artifact? Describe what it does and where it came from."
Then classify its primary value:
- Reusable instruction text → `prompts/`
- Packaged capability or behavior → `skills/` or `tools/`
- Recurring procedure with trigger/steps/outputs → `playbooks/`
- Session-wide LLM behavior config → `agents/`
- Policy, standard, or reference → `docs/`
- Untested or unclear → `experiments/`

State your classification and ask the user to confirm before continuing.

Step 2 — Sanitize
Ask: "Does this contain any project-specific paths, client names, credentials, or personal data?"
If yes: identify and remove or replace with `<placeholder>` before writing any files.

Step 3 — Structure
Determine if the artifact has a standalone consumable form (copy-paste ready).
- Yes → three-file folder: `README.md` + `<thing>.md` + `humans.md`
- No → single file with frontmatter

Step 4 — Status
Ask: "Has this been used in a real session with a documented outcome?"
- Yes, once → `status: validated`
- Yes, multiple times → consider `status: vetted` after rubric check
- Not yet → `status: draft`

Step 5 — Write
Use the appropriate template from `templates/`. Create files in the correct location.

Step 6 — Link and lint
Add to section README. Run `python scripts/doc_lint.py`. Confirm PASS before closing.
