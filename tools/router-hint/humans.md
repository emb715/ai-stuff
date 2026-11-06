# router-hint — maintenance context

## Origin

Built 2026-11-06 after the router's round 10 eval showed the same pattern as every round before it: when the router loads, it routes correctly; the misses are sessions that never open it. Description rewrites had already taken activation as far as they would go. The fix had to act before the session reads the turn, which in Claude Code means a `UserPromptSubmit` hook.

The design is the "skill suggestion" cookbook from the TypeSafe docs, applied to the router's 20 manifest rows. It ran as `experiments/router-hint/` for two eval rounds (174 headless runs), then moved here once the owner accepted a third-party API in the session loop.

## The one rule everything else serves

**Silence is always safe; a wrong hint is not.** Without the hint the session behaves as it did before, so every uncertain path ends in no output: a failed call, a missing key, a malformed manifest, a low-confidence winner. The code never turns an error into a "no" answer that could be cached or reasoned on, and never into a hint.

## Design decisions

**Judgments from the model, decisions in code.** Jev answers typed questions with probabilities; the gates (0.7 to skip, 0.3 to stop, 0.5 to fit) live in `suggest()`. They are the docs' defaults and were deliberately not tuned to the eval cases, so the eval numbers are not fitted.

**The hint names the router, not just the route.** It tells the session to load the router to confirm. The router keeps its chain, decline and silence rules; the hint only fixes activation. A hint that named a playbook alone would bypass those rules, and one run shows it can happen anyway (README, Failure Modes).

**The roster is read from the router on every turn.** No copy of the manifest lives here, so the hint cannot drift from the router. The cost is a regex coupling to the manifest table's shape; below 15 parsed rows it throws, which in hook mode means silence.

**Never a router row.** `experiments/` items are not registered in the router, and a hook is not a playbook or prompt either. The router does not know this tool exists, by design.

**No cache in hook mode.** The cache made the eval replayable and cheap, but in hook mode it would store every user turn on disk beside the code. `ROUTER_HINT_CACHE` turns it back on for testing.

**The key stays in a file.** The installer writes the key file's path into the hook command, never the key, so settings files can be shared or committed without leaking it.

**Project-local install by default.** `settings.local.json` in one repo is the smallest blast radius for sending turns to a third party. `--global` exists for when that is wanted on purpose.

## Maintenance notes

1. **If the router's manifest table changes shape** (columns, path prefixes), update the regex in `roster()` and replay `node hint.mjs --eval cases.json`; it should match `eval-results.json` except where the change was intended.
2. **Question wording lives in one object, `Q`.** Any change to it changes every payload hash, so the cache stops replaying and the eval needs live calls (cheap: both rounds cost under one cent).
3. **Model pin.** `jev-1.14.0` by default; a new model is a new eval round, not a drop-in.
4. **`eval/` and `docs/round2-plan.md` are the record behind the README's numbers.** `eval/run.sh` expects condition worktrees with the hook installed; it was written for the experiment and is kept as is.

## Known gaps

- OpenCode: no equivalent hook tested.
- Adversarial prompts aimed at request 1 have not been run.
- Latency per turn is unmeasured.
