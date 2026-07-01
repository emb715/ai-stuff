---
description: Start a vault session — classifies intent and routes to the correct framebook procedure
---

Read `_meta/framebook/start-session/playbook.md` fully.

Then:
1. Ask the user: "What kind of session is this? (new artifact / research / continue experiment / audit / patch)"
2. Based on the answer, route to the correct framebook procedure:
   - New artifact or import → `_meta/framebook/save-artifact/playbook.md`
   - Research → create `experiments/<topic>/README.md` using `templates/experiment-template.md`
   - Continue experiment → read the experiment README, surface current state and next step
   - Audit → `_meta/framebook/audit-experiments/playbook.md`
   - Patch existing artifact → identify the file, confirm the change, run lint after
3. Before building anything new, scan and report what already exists in `experiments/`, `prompts/`, `skills/`, `agents/`

Do not proceed past step 1 without a confirmed session type.
