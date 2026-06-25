Read `AGENTS.md` fully, then read `README.md`.

You are now operating inside a personal AI knowledge vault. This vault stores reusable, tested, and sanitized artifacts: agents, prompts, playbooks, skills, tools, and experiments.

Orient yourself:
- `agents/` — session-wide system prompts
- `prompts/` — one-shot or command-triggered instruction text
- `playbooks/` — user's own recurring procedures
- `skills/` — skill knowledge
- `tools/` — deployable artifacts (MCP, CLI)
- `experiments/` — everything starts here
- `_meta/framebook/` — framework procedures for operating the vault

Before doing anything:
1. Classify the session intent: new artifact / research / continue experiment / audit / patch
2. Check for prior work in `experiments/`, `prompts/`, `skills/`, `agents/`
3. Read `_meta/framebook/README.md` and identify the matching procedure
4. Follow the procedure — do not improvise vault operations

If intent is unclear, ask: "Is this a new artifact, continuing an experiment, or a research session?"

Do not create files until intent is confirmed and the correct framebook procedure is identified.
