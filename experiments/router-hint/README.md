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

**In Claude Code, 84 headless runs over 16 cells (21 runs per condition)**, four conditions with the same prompts. A and B are router eval round 10 (`skills/ai-stuff-artifact-router/evals/results.md`); C and D add the hint hook. Loading is over the 16 runs where the router should load; correctness over all 18 positive runs.

| Condition | Routed correctly | Router loaded | T10 (stubborn cell) | Silent cells silent |
|---|---|---|---|---|
| A: router on `main` | 15 / 18 | 13 / 16 | 0 / 2 | 3 / 3 |
| B: router with the yes/no routing table | 16 / 18 | 14 / 16 | 1 / 2 | 3 / 3 |
| C: A plus the hint | 17 / 18 | 15 / 16 | 2 / 2 | 3 / 3 |
| D: B plus the hint | **18 / 18** | **16 / 16** | 2 / 2 | 3 / 3 |

Every run that got a hint loaded the router and routed to the hinted route. C's one miss is R17 run 2, a cell where the hint stayed quiet. D's R17 runs got no hint either and loaded on their own.

Run records: `eval/` (cells, runner, grader, graded outputs per condition, the hint decision for every C and D run).

**Round 2, 2026-11-06** (plan in `plan.md`, committed before any run). B and D only, on `main` with the routing table. Every round 1 cell was topped up to 3 runs per condition, and 6 new cells written to sit between two routes were added. 90 new runs; B and D now hold 66 runs each.

| Cells | Measure | B: routing table | D: plus hint |
|---|---|---|---|
| Round 1 cells, 3 runs each | routed correctly | 36 / 39 | **39 / 39** |
| | router loaded | 30 / 33 | **33 / 33** |
| Between-routes cells N2 to N6 | routed correctly | 9 / 15 | **15 / 15** |
| | router loaded | 7 / 15 | **14 / 15** |
| N7, T5, T6, T11 | silent, no hint | 12 / 12 | 12 / 12 |
| **All positive runs** | **routed correctly** | **45 / 54** | **54 / 54** |

The hint named a route in 45 D runs and every one was the ground truth, including all 15 between-routes runs. It gave no hint on any silent cell. B's misses are all one shape: the session did not load the router and either named no route or guessed. On N2 to N6 that happened 6 times in 15. In one D run (N2 run 1) the session took the hinted route without loading the router; it is counted correct because it named the right route, and it shows a hint can stand in for the router's own reasoning.

The hint alone, replayed on the new cells (`node hint.mjs --eval cases.json`), named the ground truth on all 5 between-routes cases and stayed quiet on N7. Total Jev cost for both rounds: under one cent (124 cached requests).

All four success criteria in `plan.md` are met. S3 (wrong hints) was never tested in practice, because no hint was wrong.

# Observations

- **The effect holds at 3 runs per cell.** D routed every positive run correctly and loaded the router in 47 of 48 runs where it should load, against B's 45 of 54 and 37 of 48.
- **The hint helps most where routing is hardest.** On the between-routes cells, B routed 9 of 15 correctly and D 15 of 15. The misses B made were not wrong routes but no route: the session never opened the router.
- **No wrong hint in 45 hinted runs, and no hint on any silent cell.** The cost of a wrong hint remains unmeasured, because it never happened. Prompts built to fool the first request, not the session, would be the next test of that.
- **Its misses are quiet, not wrong.** On R17 and R6 it says nothing, and the session loads the router on its own.
- **One model, one harness.** Every run used `claude-sonnet-5-5` in Claude Code. Nothing here says how OpenCode or another model behaves with the hint.

# Next

- Decide whether a third-party API in the session loop is acceptable for the vault. If it is, promotion means a `tools/` entry with an install step for the hook, never a router row.
- Before promotion: a round in OpenCode, and adversarial prompts aimed at the hint itself.
