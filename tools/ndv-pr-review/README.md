---
title: "ndv PR Review"
status: validated
confidence: medium
last_tested: 2026-11-27
scope: personal
tooling:
  - "claude-code"
  - "claude-code-action/v1"
  - "neurodiveragents/1.8"
tags:
  - tool
  - code-review
  - plugin
  - change-impact
owner: "@emb715"
---

# ndv PR Review

## Context / Problem

A pull request review gets better signal for the same cost when the reviewers are chosen by what the change does to the system. A frontend change that extends a form needs accessibility and design eyes. A backend change that adds an endpoint needs security, architecture and tests. This plugin classifies each touched primitive by layer (frontend, backend, data, spec, infra, build, docs, test) and op (composes, extends, adds, removes), hands that map to ndv-flow, which picks reviewers from the ndv fleet, then verifies the findings and has ndv-explain write one summary a reader can act on.

The plugin owns no agents. It uses whatever fleet is installed, and installs the latest when none is, so it cannot drift from the real fleet.

## Scope

- Reviews a GitHub PR, a branch or the staged changes. Read-only on the reviewed repository: tests run in throwaway worktrees.
- Reports only problems the change introduces. Problems already on the base go to a collapsed "Already on base" block.
- Every Critical gets its own verifying agent; one more agent checks all Warnings together. Suggestions are not verified.
- With `--post`: one PR comment (updated on later pushes) plus verified Criticals inline. A head that already has a review comment is skipped.
- Surfaces: Claude Code (CLI, desktop, IDE), headless `claude -p`, and GitHub Actions through `claude-code-action`.

## Procedure / Steps

### Files

| Part | File |
|---|---|
| Manifest | `.claude-plugin/plugin.json` |
| The review (10 steps) | `skills/ndv-pr-review/SKILL.md` |
| Layer, op and routing matrix | `skills/ndv-pr-review/references/classify.md` |
| Summary format | `skills/ndv-pr-review/references/summary-format.md` |
| Fleet check (on PATH while the plugin is on) | `bin/ndv-fleet-check` |
| Copy of the vault's change-impact skill | `skills/change-impact-diagram/`, kept in sync by `sync-skills.sh` |
| GitHub workflow | `templates/ndv-pr-review.yml` |
| Local pre-push hook | `templates/pre-push` |

Installed plugins cannot read files outside their own folder and do not follow a symlink that leaves it. So the plugin carries a copy of `skills/change-impact-diagram/` (`SKILL.md` and `scripts/` only). Run `./sync-skills.sh` after changing the vault skill, and `./sync-skills.sh --check` to confirm they match.

### Local

```
/plugin marketplace add emb715/ai-stuff
/plugin install ndv-pr-review@ai-stuff
/ndv-pr-review 123                 # review PR 123, print here
/ndv-pr-review --staged            # review what is staged
/ndv-pr-review 123 --impact=small  # add badges and the primitives table
/ndv-pr-review 123 --post          # post one comment and inline Criticals
/ndv-pr-review 123 --label         # post, then set an ndv-review:<verdict> label
```

While testing a local copy: `claude --plugin-dir tools/ndv-pr-review`.

Headless (any CI, hooks): `claude -p "/ndv-pr-review --staged"`. See `templates/pre-push`.

The fleet must be installed for Claude Code. If it is missing, the review runs `npx -y neurodiveragents@latest install claude --global --all`, which writes to your home config, not to the repository.

### GitHub Actions

1. Copy `templates/ndv-pr-review.yml` to `.github/workflows/` in the reviewed repo and merge it to the default branch. `claude-code-action` skips a run whose workflow file differs from the default branch's copy.
2. Run `claude setup-token` and save the token as the repository Actions secret `CLAUDE_CODE_OAUTH_TOKEN`, on one line. Reviews then bill the Claude subscription.
3. Add the toolchain the repo's tests need (setup-go, setup-python, ...) and allow its test command in `claude_args`, so the review can compare base and head.
4. On a self-hosted runner, make sure `unzip` is installed (the action needs it). The template fetches `gh` itself when it is missing.

To review a PR, add the label `ndv-review`. When the review is posted, the label is replaced by one result label:

| Verdict | Label |
|---|---|
| Ready to merge | `ndv-review:approved` |
| Merge after fixes | `ndv-review:fixes-needed` |
| Fix before merge | `ndv-review:changes-requested` |

Add `ndv-review` again to review the PR again, on the same head or a new one. The labels are created on first use. If the review stops early or fails, the trigger label is removed and no result label is set. To review every PR automatically instead, see the comment at the top of the template; in that mode a head that already has a review comment is skipped.

Locally, `/ndv-pr-review 123 --label` does the same: it posts and sets the result label.

Workload identity federation also signs the action in, but the run then bills the organization's API credit as Claude Code usage, and promotional API credit does not cover Claude Code. If you use it, note that a personal account's OIDC subject has the ID form `repo:<owner>@<owner-id>/<repo>@<repo-id>:<event>`, so a subject-prefix rule must match `repo:<owner>@<owner-id>/*`.

## Results / Evidence

### GitHub Action, 2026-11-27

A test PR in a separate repository changed a rate limiter's gate from `tokens >= 1` to `tokens > 0`. The workflow above ran on a self-hosted runner with the OAuth token, on the action's default model (Sonnet).

| | v0.8 (Flow optional) | v0.9 (Flow, test evidence and explain required) |
|---|---|---|
| Agents | ndv-review only | ndv-flow, then ndv-review, ndv-secure, ndv-architect, ndv-explain |
| Base vs head tests | not run | run on both |
| Action time | about 2 min | about 6.6 min |
| Cost (list price) | 0.31 USD | 0.66 USD |
| Findings | 0 Critical, 2 Warning, 1 Suggestion | the same, plus 3 already on base |

- Both runs caught the planted change: Retry-After still used the whole-token formula, and no test covered a partial refill (the suite passed under both gates). Both were verified as Warnings.
- v0.9 also found, through ndv-architect, that a caller who rotates the Authorization header gets a fresh bucket each time, so the limiter can be bypassed. It was correctly filed as already on base.
- The explain pass added structure and one filler paragraph on this one-line change; it did not make the text clearer. On a small PR it is the weakest step.
- Two headless failures found on the way and fixed in v0.9: an agent dispatched in the background ended the run before its result arrived (no comment was posted), and Sonnet skipped Flow, the base-vs-head test run and explain when they were optional.

### Local rounds, 2026-11-24 to 2026-11-25

Smoke run, 2026-11-24, headless (`claude -p "/ndv-pr-review review" --plugin-dir ...`, read-only tool allowlist) on a past fleet installer PR: 3 files, +161/-215.

- Every step ran in order: fleet check (1.8.0 found), classification into 5 primitives (infra adds, infra extends x2, test extends, docs extends; medium confidence), Flow dispatched review, architect, secure and tester in one parallel group, then ndv-explain.
- 21 findings: 1 Critical, 11 Warning, 9 Suggestion. The explain pass kept all 21. The Critical was two writers to one directory, each with opposite keep/delete rules. Handoffs asking for fixes were recorded as withheld.
- About 4 minutes, 33 turns, about 2.3 USD. The reviewed repo was not modified.
- Seen: an installer CLI was classed `infra`. The layer list has no slot for developer tooling, so the routing matrix may need one. The gate couldn't check PR state with no GitHub remote, and the summary said so.

#### Comparison, 2026-11-24

Three past fleet PRs: a site WCAG and CSS change (frontend, 8 files), an installer routing fix (backend, 3 files) and a new CLI alias (adds a primitive, 3 files). Three arms, all local and read-only: this plugin, `ndv-review` alone, and the official `pr-review-toolkit` (`/pr-review-toolkit:review-pr all parallel`). The official `code-review` plugin was left out because it needs a GitHub PR. The judge was a blind pairwise one: a Claude session that read the diff, checked each review's high-severity findings against the code, and picked the review more useful for a merge decision. Every pair was judged in both orders.

| Round | vs ndv-review alone | vs pr-review-toolkit | False alarms per PR (plugin) | Cost per review |
|---|---|---|---|---|
| v0.1 | 0 of 6 | 0 of 6 | 2 to 10 | 2.0 to 3.3 USD |
| v0.2 | 5 of 6 | 1 of 6 | 0 to 1 | 2.4 to 3.3 USD |
| v0.3 | 4 of 6 | 2 of 6 | 0 to 1 | 2.5 to 4.3 USD |
| v0.4 | 6 of 6 | 5 of 6 | 0 to 2 | 2.9 to 4.1 USD |

The other arms cost 0.6 to 1.1 USD (ndv-review alone) and 2.6 to 2.8 USD (pr-review-toolkit).

- **v0.1 lost on noise, not on finding problems.** It found as many or more real problems as the others, but it also counted problems already on main, repeated one issue across two or three specialists, and rated design opinions Critical.
- **v0.2** limits findings to what the change introduces, adds a severity rubric, merges duplicates, and verifies locally as well. False alarms fell to 0 or 1 per PR, and it now beats ndv-review alone.
- **Against pr-review-toolkit, v0.2 still loses.** The judge cited concrete fixes, a fix order, a test run as evidence, and less process text (handoff and dispatch metadata) in the toolkit's reviews. v0.2 also rated one real frontend problem (the grid lost under reduced motion) as only a Suggestion.
- **Routing did its job.** The frontend PR pulled in accessibility and design, and the installer PRs pulled in secure, architect and tester. Each arm found at least one real problem no other arm found, such as a canvas painting over cards, or a `.bak` written through a symlink.
- No run modified the reviewed repository.

- **v0.3** adds a verdict line, a numbered fix order, a concrete fix on every finding, and a read-only test run. Process text moved into a collapsed Run details block, and regressions for any group of users became at least Warning.

Results by PR for v0.3:

| PR | vs ndv-review alone | vs pr-review-toolkit |
|---|---|---|
| Frontend (site, WCAG) | 2 of 2 | 2 of 2 |
| Backend (installer fix) | 0 of 2 | 0 of 2 |
| Adds a primitive (CLI alias) | 2 of 2 | 0 of 2 |

- **Frontend now wins every comparison.** The judge cited no false alarms, correct severities, the bug the toolkit rated too low, and the fix order.
- **The backend PR loses everywhere** on two counts. A fix PR was headed "high risk" because the change added a helper, which the classification counts as `adds`. One pre-existing problem was still reported as a new Warning. The headline risk follows the op, which reads wrong on a small fix.
- **The CLI alias PR loses to the toolkit on depth.** Both found the same Criticals, but the toolkit found two more real problems and backed them with execution evidence.
- **Test evidence:** the plugin ran `npm test` but reported "not run": dependencies were not installed, and the skill forbids installing them. The toolkit's subagents ran the same suite and used its output.
- Cost rose to 2.5 to 4.3 USD per review. The toolkit costs 2.6 to 2.8 USD, and ndv-review alone 0.6 to 1.1 USD.

- **v0.4** takes the risk headline from the verified findings rather than the op. It checks "already on base" against `git show <base>:<file>`, runs the test suite on base and head in throwaway worktrees with dependencies installed, and lets specialists run side-effect-free checks there.
- **v0.4 beat ndv-review alone 6 of 6 and pr-review-toolkit 5 of 6.** The judge cited reproduced evidence (test runs, probes), separating base problems from new ones, and the fix order. The one loss was on the CLI alias PR in one order: the toolkit found two more real problems. The frontend review reproduced the Critical by running the routing test with the env flag that turns it on, which showed it failing 18 of 18. Worktrees were removed, and the reviewed repo was untouched.
- **Cost** is 2.9 to 4.1 USD per review, about 30% more than the toolkit.
- **Caveat:** v0.2 to v0.4 were tuned on these same 3 PRs, and one judge model decided every pair.

#### Held-out rounds

Every arm got the same tool allowlist, including test runs and dependency installs into scratch copies.

| Round | PRs | vs ndv-review alone | vs pr-review-toolkit | Plugin cost per review |
|---|---|---|---|---|
| v0.4 held-out | 3 unseen (flow prompt fix, installer fix, large flow feature) | 3 of 6 | 4 of 6 | 3.0 to 5.5 USD |
| v0.5 on the same 3 (now seen) | as above | 4 of 6 | 4 of 6 | 3.1 to 9.6 USD |
| v0.5 fresh | 2 unseen (tiered agent prompts, routing table to every target) | 3 of 4 | 0 of 4 | 2.9 to 6.2 USD |
| v0.6 fresh | 3 unseen (output-style install, release eval gate, agent-vs-plain-model eval with 24 files) | 3 of 6 | 4 of 6 | 3.2 to 5.3 USD |

- **v0.4 lost on agent and protocol files.** No layer fitted "text a model follows as rules", so those files were routed as backend and missed contradictions between rules. v0.5 adds a `spec` layer: whole-file consistency checks by architect, and tester on goldens.
- **v0.5 found more real problems on large changes:** 20 against 10 to 14 on the flow feature, and 15 against 6 to 8 on the tiered prompts. Its weakness on fresh PRs is the single most important behavioural problem. pr-review-toolkit caught a release gate that passes when it should fail, and a test suite that now needs `npm install`. The plugin missed both, so it lost those comparisons despite more findings.
- **Cost** grows with the size of the change: up to 9.6 USD on a 16-file PR, against 4.3 USD for the toolkit.
- **v0.6** adds a purpose task to every review (does the change do what it says, does a check now always pass, does it add an unstated setup requirement) and caps large diffs at 4 specialists with diff-only depth for `extends`. It won all 4 comparisons on the small install PR, and both against the toolkit on the 24-file PR, where it caught rule contradictions in agent text the toolkit missed. On the release gate PR it still missed the most important hole: retries can hide an escalation, so the gate passes a regression. The toolkit and ndv-review alone each found problems it missed there.
- **Cost:** the cap held. The 24-file PR cost 5.2 USD, against 9.6 USD for a 16-file PR in v0.5. The toolkit costs 2.8 to 3.7 USD on the same PRs.
- **Overall, on PRs not used for tuning (v0.4 to v0.6, 8 PRs):** the plugin beats ndv-review alone in 9 of 16 comparisons and the toolkit in 8 of 16. It is slightly ahead of ndv-review alone and about even with pr-review-toolkit, at higher cost than both.

#### Manual Flow baseline, 2026-11-25

The plugin started as a manual routine: ask ndv-flow to review the PR with the fleet, collect the reports, consolidate, and have ndv-explain write the posted text. That routine had never been measured. This round ran it on the 8 unseen PRs, next to a "full fleet" variant of the plugin (13 read-only agents, no cap, all the plugin's checks) and to v0.6. Every pair was judged blind in both orders, and the manual routine and full fleet were also judged against pr-review-toolkit.

| Pair | Wins for the first |
|---|---|
| Manual Flow vs plugin v0.6 | 9 of 16 |
| Manual Flow vs full fleet | 11 of 16 |
| Manual Flow vs pr-review-toolkit | 8 of 15 |
| Full fleet vs plugin v0.6 | 10 of 15 |
| Full fleet vs pr-review-toolkit | 12 of 16 |

| Arm | Cost per review | Agents dispatched | False alarms per review (judge) |
|---|---|---|---|
| Manual Flow | 1.2 to 3.7 USD | 2 to 6, chosen by Flow | 0.7 |
| Plugin v0.6 | 3.2 to 5.5 USD | 3 to 4 plus one verifier per finding | 0.2 |
| Full fleet | 5.2 to 12.9 USD | 13 plus verifiers | 0.9 |
| pr-review-toolkit | 2.7 to 5.1 USD | its own 6 | 0.9 |

- **The manual routine is at least as good as the plugin, for about half the cost**, and about even with pr-review-toolkit at lower cost. Flow already picks a few specialists by itself; it does not send the diff to the whole fleet.
- **The plugin's clearest gain is fewer false alarms** (about 0.2 per review against 0.7 to 0.9), and that comes from the per-finding verify pass, which is also most of its cost.
- **Full fleet beat the toolkit 12 of 16 but lost to the manual routine 11 of 16.** The results are not transitive, so a gap of 2 or 3 in 16 is within the judge's noise.

#### v0.7: a thin wrapper around the manual routine, 2026-11-25

v0.7 lets Flow pick the agents, as in the manual routine, with the primitives table and the routing matrix as context instead of a rule. Every brief keeps the only-new-problems rule, the base check and the severity rubric. Only Criticals get a second, verifying agent. It ran on the 8 PRs of the previous round plus 3 fresh ones (a7428d0, 12a550b, 26ae8d3), and the manual routine and pr-review-toolkit also ran on the fresh ones.

| Pair | 8 PRs from last round | 3 fresh PRs | Total |
|---|---|---|---|
| v0.7 vs manual Flow | 7 of 16 | 4 of 6 | 11 of 22 |
| v0.7 vs pr-review-toolkit | 12 of 16 | 6 of 6 | 18 of 22 |

- **v0.7 beats pr-review-toolkit in 18 of 22 comparisons**, the first version with a clear lead. Against the manual routine it is even (11 of 22).
- **Cost:** 2.2 to 4.2 USD per review, against 1.2 to 3.7 USD for the manual routine and 1.8 to 5.1 USD for the toolkit. Flow dispatched 4 to 6 agents.
- **False alarms rose back** to about 1.0 per review (v0.6: 0.2; manual: 0.6; toolkit: 1.0), because Warnings are no longer verified.

#### v0.8: one check for all Warnings, 2026-11-25

v0.8 adds one `ndv-review` agent that checks every Warning together, next to the per-Critical checks. Same 11 PRs as v0.7.

| Pair | Wins for v0.8 |
|---|---|
| vs v0.7 | 10 of 20 |
| vs manual Flow | 12 of 21 |
| vs pr-review-toolkit | 16 of 22 |

- **False alarms fell from 0.85 to 0.33 per review** (manual Flow 0.67, toolkit 0.95).
- **The judge's picks did not move:** v0.8 is even with v0.7, so the cleaner output is not yet buying wins on these PRs. It matters more when the review is posted on a PR, where a false alarm costs the author's trust.
- **Cost:** 2.7 to 7.1 USD per review, 3.8 on average, against 3.2 for v0.7.

## Failure Modes / Boundaries

- **Subagents cannot dispatch subagents.** Flow runs as a skill in the main session, never as a subagent.
- **Bare `/ndv-pr-review`** works only while no other command has that name. The namespaced form is `/ndv-pr-review:ndv-pr-review`.
- **The layer comes from a heuristic.** Path signals are confirmed by what the code does, but shared modules can still be misread. The summary says when the map was built on the spot.
- **Cost grows with the number of agents Flow picks.** From v0.7 Flow chooses them, as in a manual review; each Critical gets a verifying agent, and one more agent checks all Warnings together.
- **The fleet version** is read from the npm global root or the npx cache, and prints `unknown` when neither has it.
- **Not covered:** OpenCode (no plugin format), Cursor and Copilot (no subagent dispatch).
- **Headless runs end with the main turn.** Every agent runs in the foreground; a background agent's result never arrives.
- **Small changes still run every step.** Flow, the base-vs-head tests and explain are required, which doubled time and cost on a one-line change for one extra (base) finding.
- **One automatic review per head.** Outside label mode the gate skips a head that already has a review comment.

## Related

- `skills/change-impact-diagram/`: the classification this review routes on.
- `tools/change-impact/`: the Action that writes the impact block into a PR description. This plugin does not replace it.
- The ndv fleet: `neurodiveragents` on npm.
