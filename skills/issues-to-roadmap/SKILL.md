---
name: issues-to-roadmap
description: File planning decisions as agent-ready issues in a tracker (GitHub, Linear or Jira), then group them upward into milestones, a project and a roadmap proposal. Use after a planning, brainstorming or decision session, when notes or a transcript are pasted, or when asked to break work down, create issues, or build a roadmap. Also use when handed a list of work already agreed and asked to sequence it, order it, or map what blocks what — dependencies between work items belong on the issues. Not for deciding what to build, not for writing spec documents in the repo, and not for implementing an issue.
user-invocable: true
argument-hint: "[notes file, transcript, or what was decided]"
---

Issues to roadmap. The issue is the building block; milestones, projects and the roadmap are how issues group upward, never a frame filled in from the top. The human decided in the session; this skill files the decisions so the next session starts from an issue number. It drafts, shows, and stops.

One canonical home per project — a home being somewhere a second reader finds the same current revision, amendments stay visible, a named human owns approval, and both humans and agents can reach it under granted authority. A tracker gives all four with no setup; reviewed repo documents give them through the repo's review process; a chat transcript gives none. When the criteria already live in such a home, the issue is still the work item but it **links** that home instead of restating them. Two copies of one spec is the failure this prevents, not a committed file.

Criteria reach the tracker; scratch notes do not. A criterion you cannot state mechanically is a design question for a human — ask, do not guess.

1. Read the input: the argument, a file, or pasted text. No input, ask for it. If the input cannot fill a template, ask before drafting; do not invent criteria.
2. Find the tracker. Remote on github.com: use `gh`. A Linear or Jira MCP present: use its equivalents for everything below. Neither: stop and say so.
3. Read what exists, so a second session on the same work updates instead of duplicates. Read, in any tracker:
   - the owner/repo or team identity that owns issue keys
   - every issue, open and closed, with its title, milestone and labels
   - every milestone, open and closed
   - the projects, and which kind and impact labels already exist
   - the repo's own decision index (`docs/decisions/INDEX.md`, `docs/adr/`). Templates or examples of ADRs are not decisions.

   Worked example, GitHub:
   ```sh
   gh repo view --json owner,name -q '.owner.login + "/" + .name'
   gh issue list --state all --limit 200 --json number,title,milestone,labels
   gh api "repos/<owner>/<repo>/milestones?state=all" --paginate
   gh label list
   gh project list --owner <owner>   # only with the `project` token scope
   ```
   `gh project list` needs the `project` scope — check `gh auth status`, and if it is absent, skip the project level and say so.

   Past ~200 issues, listing is no longer a reliable dedup source. Search per outcome instead, and say the read was partial:
   ```sh
   gh search issues --repo <owner>/<repo> --match title --match body --state all -L 30 \
     --json number,title,state "<the distinctive words from this outcome>"
   ```
4. Sort the input into three piles: decisions, open questions, and everything else. A decision is something you can state as a mechanically checkable criterion. An open question is anything you cannot. When a decision is mechanical for part of the input and not the rest, the mechanical part becomes an issue and the rest an open question. A criterion that is checkable but matches nothing today is an open question too. Open questions never become issues. "Discuss X" is not an issue.
5. Match each decision against what step 3 read, before drafting. Same work as an existing issue when **the outcome line describes the same user-visible change** — not when titles merely share words. Same outcome: `update #n`, and name which sections change. Different outcome touching the same files: a new issue. Cannot tell: ask, naming the candidate.
6. Write one issue per decision, from the template for its kind in `templates/` — `spec.md`, `bug.md`, `prd.md`, `frd.md`, `nfrd.md`, which ship with this skill and are required. If the file for a kind is not there, say which one is missing and stop; do not invent a shape for it.
   - `bug`: something that works wrong today. Observed, expected, how to reproduce.
   - `spec`: one vertical slice of new behaviour. One session, one PR.
   - `prd`: a product outcome too large for one slice. It names the specs it splits into. A PRD is never implemented directly.
   - `frd`: a functional requirement several specs must satisfy.
   - `nfrd`: a non-functional requirement with a measured threshold **and** the gate that enforces it. If no gate exists today, name the spec that adds one — a threshold nothing checks is a wish, not a requirement.

   Every section filled, briefly. Out of scope is required. Size on specs and bugs only (see below). An issue that depends on another starts with `Blocked by: #n`, or names the blocker in words when it has no number yet.
7. Group upward, as far as the issues justify:
   - **Project** is the default parent of every issue. Omit it only when the tracker makes an issue's home the repo or team anyway (GitHub does) *and* the work is a single issue.
   - **Milestone** is optional: the issues that ship and are verified together. One issue, or a boundary that carries no information, leaves it out.
   - **Roadmap** is the projects that together move the product toward its stated goal. On GitHub the roadmap is a *project roadmap view* — configured in the web UI, not creatable from the CLI. Propose it, name the projects in it, and say it is a manual step. In Linear it is an initiative, and it can be created.

   A level the issues do not justify reads `none. <why>` and nothing else. What the four levels look like when all of them are justified:

   ```text
   Roadmap: Self-serve billing            the product's stated goal
   └ Project: Usage-based invoicing       one outcome, the parent of its issues
     ├ Milestone: Invoice API             ships and is verified together
     │   ├ GET   /invoices                issue
     │   ├ POST  /invoices                issue
     │   └ PATCH /invoices/:id            issue
     └ Milestone: Invoice UI              a separate delivery boundary
         └ list, detail, download         issues
   ```

   Read it bottom-up, which is the direction it gets built: issues exist, milestones are the boundaries they ship across, the project is the outcome they add up to, the roadmap is the goal the projects serve. A quarterly goal named in the input is a roadmap entry, not a milestone.
8. Write the proposal to `${TMPDIR:-/tmp}/issues-<date>.md`, outside the repo, and report the resolved absolute path — not the unexpanded variable, which nobody can open. Nothing goes in the working tree: do not create a scratch directory in it, and do not edit `.gitignore` to accommodate one. Show the proposal in the layout below. Stop. Wait for approval. Create nothing in the tracker until the human says so. On a public repo, say so before creating: issue bodies are public the moment they exist, so anything in the input that should not be published gets left out or rewritten with synthetic values.
9. After approval, create in this order — labels, then milestones, then issues into them in dependency order, then the project, then any dependency still unresolved:
   1. Missing kind labels, and the project's impact label if it uses them — impact is what sets how much a picking-up agent may do unattended.
   2. Milestones, before issues, so an issue can be filed into one.
   3. Issues, each with its milestone, **in dependency order** — a blocker before the work it blocks — so every `Blocked by` names a real number as it is written and the tracker never holds a broken dependency graph.
   4. The project, then its issues.
   5. A rewrite pass, only for what step 3's ordering could not resolve — a dependency cycle, or a blocker filed in another session. Each such issue gets edited to the real number: `gh issue edit <n> --body-file <updated>`. An unresolved `Blocked by` is a broken dependency graph. Ordering usually leaves this step empty; say so rather than inventing work for it.

   Worked example, GitHub:
   ```sh
   gh label create spec                                   # --force to update an existing label
   gh api --method POST "repos/<owner>/<repo>/milestones" -f title="<name>"   # no `gh milestone` command exists
   gh issue create --title "<outcome>" --body-file <file> --label <kind> --milestone "<name>"
   gh project create --owner <owner> --title "<name>"
   gh project item-add <project-number> --owner <owner> --url <issue-url>
   gh issue edit <n> --body-file <updated>
   ```
   `gh issue create` also takes `--project <title>`, which replaces step 4 for an existing project.

   Report every number created. Delete the proposal file only after every object in it exists; on partial failure, keep it, report what exists and what does not, and resume from the first missing object.

## What makes an issue agent-ready

- **One issue, one session, one PR.** Judge size against the reviewer as well as the context window, and take the smaller. A session writes more than a person reviews carefully, so fitting one session is necessary and not sufficient.
- **Mechanically checkable criteria.** Not ready: "orders endpoint works correctly". Ready: "POST /orders with amount <= 0 returns 422, code INVALID_AMOUNT".
- **Out of scope is required.** It stops scope creep and answers the reviewer's "why didn't this also handle X".
- **Slice vertically.** One thin path through every layer that does one thing end to end, not a layer at a time. One criterion per issue, or a small group, so it merges and is checked on its own. An unfinished slice ships behind a feature flag. Criteria that cannot be cut that way are a design question for a human.
- **Agent-complete is not done.** The issue says who closes it: a human or a gate. The agent that implements it moves it to review and stops. This skill files issues; it does not move status, and it does not claim an issue is ready because it exists.

## Size

Two gates. The band is the lower of them.

- **Reviewer gate — changed lines.** Added and modified lines of hand-written source and test code. Generated, vendored, lockfile and snapshot output do not count; pure deletions count as zero. Write the counting rule down if the project's differs, or the band means nothing.
- **Session gate — files touched, interfaces changed, and named unknowns.** What ends a session is exploration, not production: a 30-line fix across eight call sites in unfamiliar code is a bigger session than a 300-line new file nothing calls yet.

Two phases, and they are not the same claim:

- **At filing (this skill):** an estimate from the criteria and the surface they touch, made without reading the codebase. `unknown — the pickup plan sets it` is a valid band, and it beats a confident guess; name what is unknown on one line.
- **At pickup (the implementing session):** write the plan first — files touched, interfaces changed, a test named against every criterion, and what is deliberately not being done, naming the specific criteria deferred. State the size that plan implies, *then* read the filed band and compare, out loud, both numbers. The order matters because an agent that starts from the band can narrow a plan to fit it, and a narrowed plan is indistinguishable from an honestly scoped one. Reading one issue body shows both numbers at once, so this does not prevent that — it obliges you to commit to a number first and leaves two numbers a human can compare. A plan over the band splits now, before any code exists: the cheapest place to catch it. A plan far under the band means the estimate was miscalibrated; say so, so the next one is better.

| Band | Changed lines | Shape |
|---|---|---|
| XS | — | one file, one criterion, no interface change |
| S | up to ~150 | a few files, one small group of criteria |
| M | ~150–400, target ~150 | one vertical slice. 400 is a ceiling, not a goal |
| L | over ~400 | does not fit as a spec unless it claims an exemption below |

Over ~400 changed lines is still one spec when it claims one of these on the issue, with the number of *decisions* a reviewer must check rather than lines: a mechanical change with the transformation stated (codemod, rename across call sites, dependency API rename); a net deletion; a new isolated file with no existing call sites; generated or declarative bulk; a contract change that cannot land in parts without breaking the trunk. No exemption: it is a PRD with specs under it, split before filing. If exemptions get claimed on more than roughly one issue in four, the lines gate is measuring the wrong thing — say that instead of relabelling.

The numbers come from the guide's trunk-based size budget, measured on human-authored changes. An agent-authored diff of the same length carries more review load, because the reviewer shares no mental model of the intent — treat 400 as generous. A project with its own size gate overrides all of this; use its numbers and say so.

## Proposal layout

```md
# Issues: <session name> · <date>

Tracker: <what was read: n issues, n milestones, n projects, decision index or none — and whether the read was partial>
Canonical home: <tracker, or the home the issues link to instead of restating>

## Issues
### <kind>: <outcome>   <size, spec and bug only>   new | update #12: <what changes>
<filled template>

## Grouped upward
- Project: <name>. <its milestones or issues>. <the outcome>
- Milestone: <name>. #a, #b. <why they ship together>
- Roadmap: <name>. <the projects in it>. <manual UI step on GitHub>

## Still a human question
- <question>. Blocks: <issue or nothing>.

## Left out on purpose
- <thing from the input that is not work, and why>
```

## Rules

- One canonical home. Do not restate a spec that already lives in a reviewed document — link it from the issue.
- Scope is two lines, not a file list. The pickup plan lists files.
- Do not close the open questions yourself, and do not pad a section. "None recorded" is a valid Governing decisions entry.
- Draft, show, stop. Nothing reaches the tracker before a human approves it.
