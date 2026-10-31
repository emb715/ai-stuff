---
title: "issues-to-roadmap"
status: validated
confidence: medium
last_tested: 2026-10-27
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "gh-cli"
tags:
  - skill
  - planning
  - issues
  - tracker
  - roadmap
  - github
owner: "@emb715"
---

# Purpose

Turns a planning session into agent-ready issues in a tracker, then groups them upward into milestones, a project and a roadmap proposal. The issue is the building block; the levels above it are how issues group, not a frame filled in from the top. Drafts, shows, and stops — nothing reaches the tracker before a human approves it.

# Context / Problem

A planning session ends with decisions in a transcript. The next session cannot read a transcript, and neither can a reviewer. The decisions have to land somewhere canonical, with mechanical criteria, sized so one agent session and one reviewer can each finish the work. Doing that by hand is the step that gets skipped, and the decisions then get re-made.

The failure this skill is built against is not "no document" but "no shared home": criteria that exist only as prose in a chat are invisible to review and to the next session. A home qualifies when a second reader finds the same current revision, amendments stay visible, a named human owns approval, and both humans and agents can reach it under granted authority. A tracker supplies all four with no setup, which is why it is this skill's target; reviewed repo documents supply them through the repo's review process, which is why restating their criteria in an issue is duplication rather than filing.

# Scope / When to use

- **At the point where a settled plan becomes work about to start.** The decisions are made, execution is next, and the tracker has to become the home a human reader or a later agent uses to pick up scope, ordering and status. This is the trigger — narrowed on owner instruction 2026-10-27.
- When the outcome of a planning, brainstorming or decision session is a set of decisions ready to be filed and worked.
- When handed work already agreed and asked to sequence it or map what blocks what — dependencies belong on the issues.
- When a second session revisits work already filed — step 5 matches on outcome and proposes `update #n` rather than duplicating.
- Not for deciding *what* to build. It files decisions a human already made; an open question stays an open question.
- Not for breaking down notes whose decisions are **not settled yet**. Exploratory breakdown is not this skill's moment; come back when the plan is agreed and work is starting.
- Not for writing repo-versioned spec documents — that is [`playbooks/issue-to-ready-specs/`](../../playbooks/issue-to-ready-specs/). This skill's target home is the tracker.
- Not for implementing an issue. It writes no plan and no code.

# Inputs

- `{{INPUT}}` — the planning notes, transcript, or a one-line statement of what was decided. Supplied as the argument, a file path, or pasted text.
- A reachable tracker: `gh` authenticated against a github.com remote, or a Linear/Jira MCP server. Neither present, the skill stops.
- Optional: `project` scope on the `gh` token, needed to read or create GitHub Projects.
- Optional: the repo's decision index (`docs/decisions/INDEX.md`, `docs/adr/`), cited in each issue's Governing decisions.

# Skill

Use [`SKILL.md`](SKILL.md) — the nine-step procedure with its tracker-neutral read and create contracts plus the verified `gh` worked examples, the agent-ready rules, the two-gate two-phase size model, the proposal layout, and the creation order. Issue bodies come from [`templates/`](templates/): `spec.md`, `bug.md`, `prd.md`, `frd.md`, `nfrd.md`, `design.md`.

# Evidence / Results

> **Ten filing gaps closed in the text, not yet measured (2026-10-31).** A dry run on a plan larger than GitHub's issue-body limit, with design content and non-text artifacts, found ten gaps: no home for design content, tracker body limits, non-text artifacts, no record of answered questions, provisional thresholds, deliberate stubs, delivery modes other than one PR per issue, handoff after approval, reads without `gh`, and house conventions. The skill now covers them with a sixth kind (`design`, with citable `D` ids), a measured body-limit split, pinned artifact links, an `Answered` record, a provisional NFRD form, a stub pattern, a delivery-mode table, a `roadmap-proposal` handoff, a stop-and-name rule for missing reads, and a house-conventions read. The two failure paths left open below — resume after partial failure and a missing `project` scope — now have explicit procedures, with the proposal file as a ledger. **None of this has been run.** Round 4 in [`evals/plan.md`](evals/plan.md) holds the fixtures and assertions, written before any run; the evidence below predates these changes. Reasons per gap are in [`humans.md`](humans.md).

> **Trigger narrowed 2026-10-27 (owner instruction), and re-measured the same day.** Everything below the next paragraph was measured against the previous, broader trigger. The **behavioural** evidence still applies unchanged — the nine steps, the five kinds, the draft-show-stop discipline and the refusal to invent criteria were not touched. The **discovery** evidence was superseded and has been replaced.
>
> **Discovery after the narrowing: 5 of 5 correct.** Two positives fired — an agreed, signed-off roadmap with work starting Monday, and a list of eight agreed items needing dependency ordering. Three negatives stayed silent: an unsettled planning chat with open disagreement, the ambiguous "break down issue #214 into work items with acceptance criteria", and an adjacent-domain lint bug. The unsettled-notes run articulated the new boundary in its own words rather than merely declining:
>
> > "`issues-to-roadmap` is explicitly not for notes whose decisions aren't settled — it would turn two people's maybes into issues that look authoritative and freeze the disagreement into a backlog."
>
> The ambiguous issue-breakdown probe, which this skill won three times out of three before the narrowing, now goes to `playbooks/issue-to-ready-specs/`. That was the point of the change, and it is the clearest evidence of it working. Probe set and per-probe results are in `evals/plan.md`.

**`validated` across all nine steps.** Drafting is measured over seven activating runs against a baseline; the creation sequence ran once on a real private tracker with every side effect verified against the API. Confidence is `medium` rather than `high` because drafting variance is only n=2 per cell, creation is n=1 on one repo, and the failure paths — partial-failure resume, a missing `project` scope mid-sequence — are still unverified.

Provenance and internal consistency were verified by review on 2026-10-07 against the upstream source at revision `23d61db` (`content/pillars/22-tracker.mdx`, `content/details/22-tracker.mdx`):

| Checked | Before | After |
|---|---|---|
| Storage claim | "No spec, PRD, plan or roadmap file committed to the repo" | one canonical home, tracker is the default — matches current source |
| Agent-ready rules present | 3 of 5 | 5 of 5 (added slice-vertically, agent-complete-is-not-done) |
| Size definition | `M` = "the largest change one session can build and one reviewer can read carefully" — circular | two gates (lines for the reviewer, files/interfaces/unknowns for the session), band is the lower |
| Size evidence | "Confirmed by the plan's file list" — the plan does not exist at filing | two phases: estimate at filing, plan states its own size at pickup before reading the filed band |
| Grouping model | all three levels optional | project is the default parent; milestone optional, per source |
| Creation order | issues before milestones — `--milestone` unavailable | labels → milestones → issues → project → `Blocked by` rewrite pass |
| GitHub roadmap | "create the project, then add issues to both" | named as a project roadmap *view*, UI-only, flagged as a manual step |
| Dedup rule | `update #12` with no definition of "same work" | match on the outcome line, ask when ambiguous |

**Command verification (2026-10-08, `gh` 2.87.3).** Every CLI claim in the skill was checked against the installed CLI's own help, per the authoring standard's rule that a flag claim is verified against target-version help:

```text
gh project create --owner X --title "Y"                 verified
gh project item-add <n> --owner X --url <url>           verified
gh issue create --title --body-file --label --milestone verified  (--project <title> also available)
gh label create <name>                                  verified  (--force updates an existing label)
gh milestone <anything>                                 DOES NOT EXIST — replaced with gh api --method POST
```

The milestone defect was load-bearing: step 9 requires milestones before issues and had no command for it, so an agent would have reached for `gh milestone create` and improvised after it failed.

**Sizing model validated (2026-10-08)** by an independent forecasting review, which accepted the two-phase structure and found six weaknesses. Four are fixed in the skill: the single axis serving two different predictions, the undefined line-counting rule, the `XS`/`S` boundary at 50 that changed no decision, and the `L` rule misfiling legitimately atomic changes over 400 lines (codemods, net deletions, isolated new files, generated bulk, contract changes). One is mitigated rather than fixed: the pickup agent is now obliged to state its plan's size before reading the filed band, and both numbers are stated out loud. That cannot stop an agent anchoring — reading one issue body shows it both numbers — but it produces two independent-by-instruction figures a human can compare, where before the check could not fail at all. One is left open by design — see the terminal-check boundary below.

**Behavioural and discovery evaluation (2026-10-08).** Full plan, assertions and graded output in [`evals/`](evals/) — `plan.md` was written before any run, `results.md` after, and `run-p1-with-skill-proposal.md` is one run's raw artifact. Eight sessions, `claude-code/claude-sonnet-5-5` and the `honest` agent throughout, baselines run before the skill was installed anywhere the harness could find it.

Two rounds. Round 2 re-ran everything after four substantive edits, as the authoring standard requires.

| | Baseline | Round 1 | Round 2 |
|---|---|---|---|
| P1 — billing notes, mixed kinds | 4 / 8 | 6.5 / 8 | 8 / 8 and 8 / 8 |
| P2 — mostly non-mechanical input | 3 / 5 | 5 / 5 | 5 / 5 and 5 / 5 |
| P3 — agreed work, sequencing | 4 / 5 | 3 / 5 (no activation) | 5 / 5 |
| **Total** | **11 / 18** | **14.5 / 18** | **31 / 31** |

Activation: round 1 was 2 of 3 should-trigger; round 2 is **3 of 3** after the description gained the sequencing shape P3 revealed. False activations: **0 of 2** — "I'm having issues with the doc lint script" and "break down what this repo's lint rules do" both correctly stayed quiet. Variance is n=2 on P1 and P2, identical assertion outcomes with materially different prose; n=1 on P3.

The safety assertion is the one that matters most: given "users keep asking for dark mode", the baseline invented three acceptance criteria including a WCAG AA requirement nobody stated. With the skill: *"Without those, I can't write checkable criteria."* The baseline also filed every open question as an issue, folded a latency requirement into a story instead of routing it to a gate, and gave no sizes at all.

Three fixes were made between rounds and each is confirmed by round 2: the four-level worked example corrected both level errors (a quarterly goal now files as a roadmap entry, "checkout live" as a project rather than a milestone); the `nfrd` gate fallback is now reached (*"a gate-adding spec is needed but cannot be written yet… until it exists this is a wish, not a requirement"*); and the proposal no longer touches the repo, verified by inspection after the runs.

One behaviour nothing instructs, present in all five round-2 runs: the skill checked whether the target repo was plausible and said it was not — *"this repo is your AI knowledge vault, not a product"*. It falls out of step 3 plus the public-repo rule, and it is the behaviour most likely to prevent a real mistake.

**Round 3 ran the creation sequence** on a purpose-built private repo, with no instruction to hold back — the first test of the approval gate itself. It stopped on its own ("nothing will be created until you approve"), declined to file a bug it could not reproduce, and caught an ambiguity in the notes rather than guessing. After approval all nine steps executed, and every side effect was verified against the API rather than taken from the session's report: labels created, `bug` reused, the milestone holding the right three of five issues, the project holding all five, `Blocked by` lines carrying real numbers, the proposal file deleted, the working tree clean. Given "p95 enforced in CI" against a repo with no CI, it drafted the gate-adding spec and pointed the requirement at it.

That run also found a defect: the `Blocked by` rewrite pass was never needed, because creating issues in dependency order means every blocker already has a number. Ordering is strictly better — one write per issue, and no window where the tracker holds a broken graph — so it is now the specified path and the rewrite pass is the fallback for cycles and cross-session blockers.

Open gaps: drafting variance is n=2, which detects gross instability but not a 10% failure rate; creation is n=1 on one repo; failure injection (partial-failure resume, missing `project` scope mid-sequence) is unverified; activation is inferred from output fingerprints rather than a load event.

# Failure Modes / Boundaries

- **The creation sequence is n=1.** It ran once, on one empty private repo, with the `project` scope present. Verified: labels created, `bug` reused not recreated, milestone holding the right three issues, five issues with correct kinds, project with all five, `Blocked by` carrying real numbers, proposal file deleted, working tree clean. Unverified: partial-failure resume, a missing `project` scope mid-sequence, and creation of the `prd`, `frd` and `bug` kinds.
- **Failure injection has never been run.** The resume path is specified and untested. On a mid-sequence failure, read what it reports against the tracker before letting it resume.
- **GitHub's roadmap cannot be created.** The roadmap level is a project roadmap view, configured in the web UI. The skill proposes it and says so; it cannot finish the job on GitHub. Linear initiatives can be created.
- **`gh project` needs an extra token scope.** Without `project` scope, steps 3 and 9 skip the project level entirely and the grouping stops at milestones.
- **Size bands are a budget, not a measurement.** They come from the guide's trunk-based pillar, whose own evidence is human-authored change data. An agent-authored diff of the same length costs a reviewer more, because the reviewer shares no mental model of the intent, so 400 is probably generous. A project with its own size gate should override them.
- **No terminal size check, deliberately.** Nothing here catches an underestimate at PR time — the only control between filing and merge is the pickup plan, which the implementing agent writes itself. Enforcement at PR open belongs to the project's own size gate (the guide's trunk-based pillar), not to a filing skill. This is the model's worst unguarded failure: an underestimate that survives both filing and pickup produces an oversized PR, and by then splitting means unpicking a diff.
- **Dedup matches on language.** "Same outcome" is judged by reading, against at most 200 issues. Past that the skill is told to search by outcome wording and declare the read partial, but a repo with near-identical outcomes across components will still produce duplicates.
- **Only the GitHub path is verified.** The `gh` commands are checked against `gh` 2.87.3. Steps 3 and 9 state what must be read and created in tracker-neutral terms so a Linear or Jira MCP can serve them, but no MCP equivalent has been written or run — those tool signatures vary per server, and inventing them would be the unverified-claim failure the authoring standard forbids.
- **Issue bodies are public on a public repo.** The skill is told to say so before creating and to leave out or synthesise anything in the input that should not be published, but it is reading session notes it did not write — treat the pre-creation review as the real control.
- **Partial creation is reported, not rolled back.** On failure mid-sequence the proposal file is kept and the missing objects named. Nothing is deleted from the tracker automatically.
- **Nothing is written to the repo.** The proposal goes to `${TMPDIR:-/tmp}`, and the path is reported. No scratch directory, no `.gitignore` edit — an earlier draft caused both, on this vault's own repo, during the 2026-10-08 eval.
- **It does not move status.** Filing an issue is not readiness, and the skill makes no claim that an issue it created is ready to pick up — a human owner approves that.
- **Templates are fixed-shape.** A tracker with required custom fields (Jira in particular) will reject or mangle these bodies; the six templates assume a free-form markdown body.
- **Body limits are measured, not enforced.** GitHub caps a body at 65,536 characters and the skill splits design content to stay under ~60,000; Linear and Jira limits are looked up per instance, not built in.
- **Sub-issue and issue-type commands are unrun.** They are written from GitHub's REST documentation; `gh` 2.89 has no flag for either.
- **The templates are a hard dependency.** All six must be installed alongside `SKILL.md`. The skill stops and names the missing file rather than inventing a shape, so a partial install fails on first use instead of producing malformed issues.

# Related artifacts

- [`skills/lean-agentic-baseline/`](../lean-agentic-baseline/) — pillar 22 (`Lean workflow: issues to roadmap`) inventory and assessment; this skill executes what that one audits, and `references/tier-3-scale.md` holds the same pillar's distilled content
- [`playbooks/issue-to-ready-specs/`](../../playbooks/issue-to-ready-specs/) — the repo-document path for the same problem; runs *from* an issue, where this skill runs *to* one
- [`playbooks/request-triage/`](../../playbooks/request-triage/) — routes a raw request to the right planning artifact
- [`playbooks/brainstorming/`](../../playbooks/brainstorming/), [`playbooks/decision-making/`](../../playbooks/decision-making/) — produce the session output this skill consumes
- Source: `lean-agile-agentic` pillar 22, revision `23d61db` — https://emb715.github.io/lean-agile-agentic/guide/#tracker
