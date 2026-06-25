# Write a Skill

## Trigger

You want to package knowledge about a library or framework into a SKILL.md an agent can load.

## Preconditions

- You have access to the library's official documentation
- You have a clear sense of what context problem this skill solves (what does the model get wrong without it?)

## Procedure / Steps

### 1. Gather the source of truth

Priority order:
1. Official docs (reference pages, API docs, migration guides)
2. Changelog / release notes
3. TypeScript definitions (resolve ambiguities; types win on signatures)
4. Source code (only when docs are absent or the library is internal)

Capture:
- Every public export, grouped by entry point or subpath
- Exact signatures for the 5–10 most-used APIs
- Any subpath or module structure that affects imports
- Version-specific behavior if the library is evolving

Do not carry unverified claims into the skill.

### 2. Find the one footgun

A footgun requires all three:
- **Non-obvious** — works initially, breaks later, or fails in hard-to-trace ways
- **Severe** — data loss, broken behavior, memory leak, silent wrong output
- **Natural** — developers write the wrong version instinctively

If you find more than one: rank by severity, put only the worst in SKILL.md, the rest in `refs/antipatterns.md`.

### 3. Identify grounded antipatterns (optional)

Only include if the model would confidently produce the wrong version from plausible reasoning.

Each antipattern must:
- Show wrong version with one-line explanation of why it fails
- Immediately follow with the correct version
- Name the failure mode

Never show `✗` without `✓`.

### 4. Decide the structure

SKILL.md covers:
- One-sentence identity
- Install / import
- 3–5 most-used APIs with minimal working examples
- One footgun with correct alternative
- Routing links to `refs/` files for depth

`refs/` files (one per concern, not per API):
- `refs/imports.md` — full export reference
- `refs/routing.md` — routing patterns
- `refs/data-fetching.md` — fetching and mutation patterns
- `refs/configuration.md` — config options
- Add others only when the concern is large enough to fragment reading flow

### 5. Write SKILL.md

Rules:
- Code over prose — examples teach faster than paragraphs
- No transitional sentences, no motivational framing
- Inline comments in code blocks instead of paragraphs before them
- Tables over lists when structure is parallel
- One blank line between sections

Target: 100–180 lines.

For every `refs/` file, add one routing line at the end of the relevant section:
```md
See [refs/data-fetching.md](refs/data-fetching.md) for mutations, optimistic updates, and pagination.
```

### 6. Write the trigger description

The `description` frontmatter field controls auto-activation. It must name:
- The library's package name
- 4–6 most common function/hook/class names
- Task contexts that indicate the library is in use

```yaml
description: <Verb phrase>. Activates when working with <library>, calling <api-1>, <api-2>, or when <task-context>.
```

Specific enough to not false-trigger on unrelated sessions.

### 7. Write humans.md

Cover:
- Why this structure (what's in SKILL.md vs each refs/ file)
- Source of truth (where signatures were verified, when)
- Footgun rationale (why this specific pattern was chosen)
- Antipattern rationale (why each passed the inclusion test)
- Known gaps (what's not documented and why)
- Maintenance notes (what to check on new library versions)

Prose, no token constraints. Written for whoever maintains this skill next.

### 8. Evaluate before shipping

Run the model on 3 representative tasks *without* the skill loaded. Document what it gets wrong. Then:

1. Run the task without the skill — note failures and missing context
2. Run the same task with the skill — confirm the gaps close
3. Run a different task in the same domain — confirm the skill doesn't over-trigger or inject irrelevant context

A skill that passes all three is ready. A skill that helps task 1 but adds noise to task 3 needs its trigger narrowed.

### 9. Link and record

- Add folder to `skills/` section (if a skills index exists)
- Add entry to root `README.md` artifact inventory under Skills
- Record evaluation results in `humans.md` or artifact Evidence section

## Workflow

```
gather source of truth (docs → changelog → types → source)
  → identify one footgun
  → identify grounded antipatterns (optional)
  → decide SKILL.md vs refs/ structure
  → write SKILL.md (100–180 lines, code-first)
  → write trigger description
  → write humans.md
  → evaluate: 3 tasks (without / with / different domain)
  → link from section index + root README
```

- If footgun is unclear → ship without it; add when found
- If evaluation shows over-triggering → narrow trigger description, remove noisy sections
- If refs/ file has no routing link in SKILL.md → do not commit it; it's an orphan

## Rollback / Fallback

If the skill degrades model output on task 3 (over-triggering): narrow the description field. If that's not enough, move the noisy content to a `refs/` file and add a routing link only from a specific section — not from the intro. An over-broad skill that loads everywhere is worse than no skill.
