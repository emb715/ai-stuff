---
title: "Router Hint"
status: draft
confidence: low
last_tested: 2026-11-06
scope: personal
tooling:
  - "claude-code"
  - "typesafe-jev"
tags:
  - experiment
  - routing
  - hooks
  - evals
owner: "@emb715"
---

# Hypothesis

The artifact router routes correctly whenever it loads, and loading is its weak half: sessions say they will use it and then answer without it. A small typed-question model can read the user's turn before the session does and add one line naming the router and its likely route. If that line is right often enough and silent when nothing fits, the session loads the router more often without loading it where it should stay out.

The design copies the "skill suggestion" pattern from the TypeSafe docs ([cookbook](https://docs.typesafe.ai/cookbooks/skill_suggestion)): two requests per turn, judgments from the model, the decision in code, at most one suggestion, and a hint the session is told it may ignore.

# Setup

- `hint.mjs`, no dependencies, Node 18+. Needs `TYPESAFE_API_KEY`; behind a proxy, Node's fetch also needs `NODE_USE_ENV_PROXY=1`.
- Roster: the 20 rows of the router's two manifests, read from `skills/ai-stuff-artifact-router/SKILL.md` at run time, plus each artifact's README `Purpose` and `When to use`.
- Request 1: a Choice over all 20 rows (each described by its Entry and Exit), and three Nouls: is this work to route, did the user name an artifact, is it a vault operation.
- Request 2: the top 3 again with their README text, a Choice between them, and one "does this start from what the user has and produce what they want?" Noul each.
- Code decides: no hint if an artifact is named or it is a vault operation (Noul above 0.7), or it is not work (below 0.3), or the winner fits below 0.5. Thresholds are the docs' defaults and were not tuned to the cases.
- Delivered as a Claude Code `UserPromptSubmit` hook in a worktree's `.claude/settings.json`:

```json
{"hooks":{"UserPromptSubmit":[{"hooks":[{"type":"command","command":"node --no-warnings <repo>/experiments/router-hint/hint.mjs --hook","timeout":60}]}]}}
```

- A failed API call prints nothing in hook mode, so the turn proceeds unhinted. Every payload and answer is cached in `cache.json`, so `--eval` replays without the API.
- Model `jev-1.14.0`. The 91 requests behind every number here cost about half a cent.

# Results

**Hint alone, 36 router eval cases** (`node hint.mjs --eval cases.json`, results in `eval-results.json`):

| Outcome | Cases |
|---|---|
| Hint named the ground-truth route | 20 of 22 hints |
| Hint debatable | R3 (contested case, ground truth "none") and T1 (`build-to-release` where the probe expected a planning route) |
| Correctly quiet (ask, decline, named, vault, plain work) | 10, including all 7 must-stay-silent probes |
| Quiet where a route existed | R6 (a two-playbook sequence), R17 (resolved outage), T2, T3 |

No hint ever fired on a case where the router should stay out.

**In Claude Code, 84 headless runs over 21 cells**, four conditions with the same prompts. A and B are router eval round 10 (`skills/ai-stuff-artifact-router/evals/results.md`); C and D add the hint hook. Loading is over the 16 runs where the router should load; correctness over all 18 positive runs.

| Condition | Routed correctly | Router loaded | T10 (stubborn cell) | Silent cells silent |
|---|---|---|---|---|
| A: router on `main` | 15 / 18 | 13 / 16 | 0 / 2 | 3 / 3 |
| B: router with the yes/no routing table | 16 / 18 | 14 / 16 | 1 / 2 | 3 / 3 |
| C: A plus the hint | 17 / 18 | 15 / 16 | 2 / 2 | 3 / 3 |
| D: B plus the hint | **18 / 18** | **16 / 16** | 2 / 2 | 3 / 3 |

Every run that got a hint loaded the router and routed to the hinted route. C's one miss is R17 run 2, a cell where the hint stayed quiet. D's R17 runs got no hint either and loaded on their own.

Run records: `eval/` (cells, runner, grader, graded outputs per condition, the hint decision for every C and D run).

# Observations

- **The hint moves loading where it fires, and it never fired wrongly here.** T10 went from 0 of 2 to 2 of 2. That is the cell that resisted rounds 7 to 9.
- **Its misses are quiet, not wrong.** On R17 the second request split between `retrospective` and `incident-response` and every fit scored low, so it said nothing. A quiet miss costs nothing over no hint; a wrong hint would.
- **The two changes stack.** B's routing table and the hint touch different halves: the table helps a session that has loaded the router, the hint gets it loaded.
- **Small n.** One or two runs per cell, one model. The direction is consistent; the size is not established.

# Next

- Repeat C and D at 3 runs per cell before calling the effect real.
- Measure what the hint costs on turns where it is wrong, with prompts written to sit between two routes.
- Decide whether a third-party API in the session loop is acceptable for the vault. If it is, promotion means a `tools/` entry and an install step, never a router row.
