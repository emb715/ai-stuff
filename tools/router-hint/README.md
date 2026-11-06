---
title: "Router Hint"
status: validated
confidence: medium
last_tested: 2026-11-06
scope: personal
tooling:
  - "claude-code"
  - "node18"
  - "typesafe-jev"
tags:
  - tool
  - routing
  - hooks
  - evals
owner: "@emb715"
---

# Purpose

Before each Claude Code turn, ask a small typed-question model (TypeSafe Jev) whether the turn is work the [`ai-stuff-artifact-router`](../../skills/ai-stuff-artifact-router/) skill routes, and if so add one line naming the router and its likely route. The session decides; the hint only makes it open the router.

# Problem

The router routes correctly whenever it loads, and loading is its weak half: sessions say they will use it and then answer without it. In the evidence below, every routing miss without the hint was a session that never opened the router.

# Scope

Use it when:
- you work in Claude Code with the router skill installed, and
- sending each user turn to a third-party API (`api.typesafe.ai`) is acceptable for the repos you install it in.

Not for:
- choosing the route. The router stays the authority; the hint is a nudge the session is told it may ignore.
- the router's manifest. This is a hook, never a router row.
- OpenCode or other harnesses, and models other than the one tested (see Failure Modes).

# Install

1. Put the TypeSafe API key in a file only you can read, e.g. `~/.secrets/jev.key` (`chmod 600`).
2. From a vault checkout, run one of:

```sh
node tools/router-hint/install.mjs --project <repo>   # <repo>/.claude/settings.local.json (default: current dir)
node tools/router-hint/install.mjs --global           # ~/.claude/settings.json, every project
node tools/router-hint/install.mjs --settings <file>  # any settings file
```

   Options: `--key-file <path>` (default `~/.secrets/jev.key`), `--dry-run` (print the result, write nothing), `--uninstall` (remove the hook, keep everything else).

3. Start a new Claude Code session there. Turns the router covers get an `<artifact_relevance>` line; others get nothing.

The installer writes one `UserPromptSubmit` hook whose command points at this checkout's `hint.mjs` by absolute path and names the key file; the key never enters the settings file. Re-running replaces the entry, and other hooks are untouched. The hint reads the router's manifest from this checkout on every turn, so it follows the router as it changes. Behind a proxy, Node's fetch needs `NODE_USE_ENV_PROXY=1` in the session's environment.

# Procedure

What `hint.mjs` does with each turn, after the "skill suggestion" pattern in the TypeSafe docs ([cookbook](https://docs.typesafe.ai/cookbooks/skill_suggestion)):

1. Read the 20 rows of the router's two manifests from `skills/ai-stuff-artifact-router/SKILL.md`, plus each artifact's README `Purpose` and `When to use`.
2. Request 1: a Choice over the 20 rows (each by its Entry and Exit), and three Nouls: is this work to route, did the user name an artifact, is it a vault operation.
3. Stop with no hint if an artifact is named or it is a vault operation (Noul above 0.7), or it is not work (below 0.3).
4. Request 2: the top 3 with their README text, a Choice between them, and one "does this start from what the user has and produce what they want?" Noul each.
5. Stop with no hint if the winner fits below 0.5. Otherwise print the hint line.

Thresholds are the docs' defaults and were not tuned to the eval cases. Any failure (no key, network, a non-200, over 12 s) prints nothing and the turn goes on unhinted. Hook mode keeps no cache, so user turns are not stored on disk.

Other modes: `node hint.mjs "<turn>"` prints the decision as JSON; `node hint.mjs --eval cases.json` replays the eval cases from `cache.json` without calling the API. Model `jev-1.14.0`, about $0.042 per million input tokens; two requests per routed turn, one per unrouted turn.

# Evidence

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

**Round 2, 2026-11-06** (plan in `docs/round2-plan.md`, committed before any run). B and D only, on `main` with the routing table. Every round 1 cell was topped up to 3 runs per condition, and 6 new cells written to sit between two routes were added. 90 new runs; B and D now hold 66 runs each.

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

All four success criteria in `docs/round2-plan.md` are met. S3 (wrong hints) was never tested in practice, because no hint was wrong.

## Install check, 2026-11-06

`install.mjs` run against a settings file holding other hooks and permissions: installing twice left one entry, `--uninstall` restored the file, other hooks untouched. Then one headless Claude Code run of cell N2 in a fresh `main` worktree with only the installed hook: the hint fired (from the cached answer, `ROUTER_HINT_CACHE=cache.json`), the session loaded the router and named `playbooks/acceptance-verification/`, the ground truth. With no key and no cache, the hook printed nothing and exited 0.

## Observations

- **The effect holds at 3 runs per cell.** D routed every positive run correctly and loaded the router in 47 of 48 runs where it should load, against B's 45 of 54 and 37 of 48.
- **The hint helps most where routing is hardest.** On the between-routes cells, B routed 9 of 15 correctly and D 15 of 15. The misses B made were not wrong routes but no route: the session never opened the router.
- **No wrong hint in 45 hinted runs, and no hint on any silent cell.** The cost of a wrong hint remains unmeasured, because it never happened. Prompts built to fool the first request, not the session, would be the next test of that.
- **Its misses are quiet, not wrong.** On R17 and R6 it says nothing, and the session loads the router on its own.
- **One model, one harness.** Every run used `claude-sonnet-5-5` in Claude Code. Nothing here says how OpenCode or another model behaves with the hint.

# Failure Modes

- **Every turn goes to a third-party API.** The user's turn text and the router's manifest rows are sent to `api.typesafe.ai`. Install it only where that is acceptable; `--project` limits it to one repo.
- **One model, one harness.** All runs used one Claude model in Claude Code. OpenCode has no `UserPromptSubmit` hook in this form and is untested.
- **The cost of a wrong hint is unmeasured.** No hint was wrong in 45 hinted runs, so how a session handles one is unknown. Prompts built to fool the first request are the next test.
- **A hint can stand in for the router.** In one run the session took the hinted route without opening the router. Correct there, but it skips the router's chain and decline logic.
- **Quiet misses.** On some cells (R6, a two-playbook sequence; R17, a resolved outage) the hint says nothing; sessions loaded the router on their own there.
- **Manifest parsing.** Rows are read with a regex over the manifest table. If the table's shape changes, `hint.mjs` throws below 15 rows and the hook goes silent rather than hinting from a partial roster.
- **Latency.** Two sequential requests add latency to every routed turn. It was not measured; the 12 s abort bounds the worst case.

# Related artifacts

- [`skills/ai-stuff-artifact-router/`](../../skills/ai-stuff-artifact-router/): the skill the hint points at, and its round 10 eval.
- [`humans.md`](humans.md): why it is built this way.
