---
name: skill-authoring
description: Creates and maintains agent skills for software libraries, frameworks, and tools. Activates when the task involves writing a SKILL.md, generating a skill from documentation, or improving an existing skill's structure, token efficiency, or coverage.
---

# skill-authoring

A process for turning any library or framework into a well-structured agent skill.

## Skill quality checklist

A good skill is:

- Concise — every line earns its place
- Responsible for one thing — not a multi-step workflow
- Composable — routes to `refs/` files instead of dumping everything inline
- Progressively disclosed — SKILL.md covers the 80% case, depth lives in `refs/`
- Harness-agnostic — works regardless of which AI tool loads it
- Well-documented — a `humans.md` companion explains the skill's structure, decisions, and how to maintain it; SKILL.md contains none of this — it is written for a model, not a reader
- Portable — no assumptions about the consumer's project structure
- Secure — never instructs the model to output secrets, tokens, or credentials; redacts sensitive values in examples
- Affirmative — describes what the library does, not what it doesn't have
- Grounded — antipatterns shown are patterns the model will naturally produce from plausible reasoning, not invented failure modes; each pairs the wrong version with the correct alternative

## Process

### Step 1 — Gather the source of truth

Start with official documentation. For most libraries it is the most accurate, most maintained, and most intentional representation of the API. Source code is a verification layer, not the starting point.

Priority order:
1. Official docs — reference pages, API docs, migration guides
2. Changelog / release notes — what changed recently, what was removed
3. TypeScript definitions — resolve ambiguities where docs and types conflict; types win on signatures
4. Source code — use when docs are absent, stale, or the library is local/private

What to capture:
- Every public export, grouped by entry point or subpath
- Exact signatures for the 5–10 most-used APIs
- Any subpath or module structure that affects how things are imported
- Version-specific behavior if the library is actively evolving

Treat anything you cannot verify from at least one of these sources as unconfirmed. Do not carry unconfirmed claims into the skill.

### Step 2 — Find the one footgun

Every non-trivial library has one pattern that looks harmless but causes catastrophic or subtle failure. This earns a warning in the skill. Everything else does not.

A real footgun has all three of:
- Non-obvious — it works initially, breaks later, or fails in ways that are hard to trace
- Severe — data loss, broken behavior, memory leaks, silent wrong output
- Natural — developers write the wrong version instinctively; the error is the path of least resistance

Examples by category:
- Component lifecycle: creating a component type inside a render function (new identity every render)
- Async: fire-and-forget mutations without error handling
- Routing: hardcoded path strings instead of typed routes (breaks silently at rename)
- State: reading a value once instead of subscribing to it
- Types: using a cast to bypass an `unknown` return without validating shape

One footgun per skill. If you find more than one, rank by severity and document only the worst in SKILL.md. The rest go in `refs/`.

### Step 3 — Identify grounded antipatterns (optional)

Antipatterns belong in a skill when the model will confidently produce the wrong version from plausible reasoning about the API. They do not belong when the model would only write them out of pure ignorance — that is a documentation gap, not an antipattern.

The test for inclusion: could the model write this wrong version while believing it is correct? If yes, it earns a place. If the model would only write it because it doesn't know the API at all, add a better example instead.

Each antipattern must:
- Show the wrong version with a one-line explanation of why it fails
- Immediately follow with the correct version
- Name the failure mode, not just the fix

Never show ✗ without ✓. A wrong example with no correction and no explanation of the failure risks the model retrieving the wrong pattern in a different context. The pairing is the protection — omit either half and the antipattern becomes a liability.

```md
// ✗ — triggers a full remount on every render, destroying state and refs
// ✓ — define at module scope; use props for values that change at runtime
```

Where antipatterns live:
- One severe case → SKILL.md alongside the footgun (Step 2)
- Longer tail → `refs/antipatterns.md`, linked from SKILL.md

If you find fewer than three grounded antipatterns, skip the `refs/antipatterns.md` file and fold them into the relevant section of SKILL.md or the appropriate `refs/` file. A dedicated antipattern file only earns its place when the list is long enough to fragment the reading flow elsewhere.

### Step 4 — Audit existing docs or skill (if rewriting)

If a skill or documentation already exists, compare every claim against the source of truth gathered in Step 1.

Look for:
- APIs documented that no longer exist
- APIs that exist but are undocumented
- Type signatures that don't match reality
- Warnings about things that don't exist — the model now knows to try them
- Version or size claims that are stale
- Examples that use removed or renamed APIs

Do not carry forward any claim you cannot verify.

### Step 5 — Decide the structure

SKILL.md covers:
- One-sentence identity — what the library does, for whom
- Install or import — the first thing any developer needs
- The 3–5 most-used APIs with minimal working examples
- The one footgun with a correct alternative shown
- Explicit `→ See refs/X.md` routes for anything requiring more depth

`refs/` files cover (one file per concern, not per API):
- Full export/API tables
- Detailed feature walkthroughs
- Configuration reference
- Patterns that only appear once a developer is already past the basics

Name files by concern:
- `refs/imports.md` — full export reference by entry point
- `refs/routing.md` — routing patterns
- `refs/data-fetching.md` — fetching and mutation patterns
- `refs/configuration.md` — config options and defaults
- `refs/testing.md` — testing utilities and patterns

### Step 6 — Write affirmatively

Every sentence describes what the library does and how to use it correctly.

Do not include:
- Lists of APIs or features that don't exist
- Warnings about removed features
- "Note: X is not supported" unless X is something developers will actively reach for and the absence is genuinely non-obvious

The test: if a developer has never used this library before, does the skill give them enough to write correct code? If yes, it is ready.

### Step 7 — Add at least one skill output example

Provide one before/after pair showing a bad SKILL.md section and its corrected version. Output quality in skill writing depends on seeing the target style — this is the examples pattern from the Claude skill best practices.

The pair must be drawn from the library being documented, not invented:

```markdown
## Bad — prose that doesn't change model output

authenticate() initiates the OAuth flow. It accepts a config object with
your client ID, redirect URI, and scopes. The function is asynchronous,
so you will need to await it. It returns a session object if successful.

## Good — code that shows the same thing in fewer tokens

```ts
const session = await authenticate({ clientId, redirectUri, scopes });
```
```

One pair is sufficient. The goal is to anchor the model's output style, not provide exhaustive documentation.

### Step 8 — Evaluate before shipping

Before committing a skill, run the model on three representative tasks *without* the skill loaded. Document what it gets wrong or what context it repeatedly asks for. The skill should close exactly those gaps — nothing more.

Minimum evaluation:
1. Run a representative task without the skill — note failures and missing context
2. Run the same task with the skill — confirm the gaps close
3. Run a different task in the same domain — confirm the skill doesn't over-trigger or inject irrelevant context

A skill that passes all three is ready. A skill that helps task 1 but adds noise to task 3 needs to be narrowed.

### Step 9 — Write for the model, not for a human reader

SKILL.md is consumed as context tokens by a language model. Every word that doesn't help the model produce correct output is waste that competes with actual instruction.

Token efficiency rules:

- Code over prose — a correct example teaches faster than a paragraph explaining it
- No transitional sentences ("Now that we've covered X, let's look at Y")
- No motivational framing ("This is important because...")
- No restating what a heading already says
- Tables over lists when structure is parallel
- One blank line between sections, not two
- Inline comments in code blocks instead of paragraphs before them

What belongs in SKILL.md vs humans.md:

| SKILL.md | humans.md |
|---|---|
| Import paths | Why subpaths exist |
| Working examples | How to extend the examples |
| Footgun + correct version | Why this specific pattern was chosen |
| Routing table links | How the refs/ structure was decided |
| API signatures | Where the signatures were verified |

The compression test: read a section and ask — does every sentence change what code the model writes next? If a sentence only helps a human understand the context, it goes in `humans.md`.

### Step 10 — Write the trigger description

The `description` field in the frontmatter controls when the skill auto-activates. It should name:
- The library's package name
- The 4–6 most common function, hook, or class names a developer would type
- The task contexts that indicate the library is in use

```yaml
description: <Verb phrase describing what the skill does>. Activates when working with <library>, calling <api-1>, <api-2>, or <api-3>, or when <task-context>.
```

Specific enough to not false-trigger on unrelated sessions. Generic phrases like "when working with JavaScript" are too broad.

## Output structure

```
skills/<library-name>/
├── SKILL.md              ← model-facing: trigger, identity, install, 80% patterns, footgun, routes
├── humans.md             ← human-facing: structure rationale, maintenance guide, decision log
└── refs/
    ├── imports.md        ← full export reference by entry point
    ├── antipatterns.md   ← (optional) grounded antipatterns when list > 3
    ├── <concern-a>.md    ← depth for feature A
    ├── <concern-b>.md    ← depth for feature B
    └── ...
```

SKILL.md target: 100–180 lines — dense, token-efficient, no explanatory prose  
humans.md target: as long as needed — prose welcome, explains the why  
Each refs/ file target: 60–100 lines  
Total SKILL.md + refs/ cap: ~600 lines

## Routing table pattern

At the end of each section in SKILL.md that has a corresponding `refs/` file, add one line:

```md
See [refs/routing.md](refs/routing.md) for dynamic segments, layouts, and typed routes.
```

Points to the file. Describes what's there in 5–10 words so the model knows whether to follow it.

No orphan rule: every `refs/` file must have exactly one routing link in SKILL.md. A docs file with no link is undiscoverable — the model reads SKILL.md in one pass and has no other mechanism to find it. Before committing a skill, verify the mapping is complete:

```
refs/imports.md        → linked from ## Installation / Import paths
refs/auth.md           → linked from ## Authentication
refs/data-fetching.md  → linked from ## Data fetching
refs/configuration.md  → linked from ## Configuration
refs/antipatterns.md   → linked from ## <relevant section>
```

If a docs file has no natural section to link from, that is a signal the file's concern is not represented in SKILL.md at all — either add the section or merge the content into an existing docs file.

## humans.md — the companion file

`humans.md` sits alongside `SKILL.md` and is never loaded as model context. It exists for the person who writes, reviews, or maintains the skill.

What it contains:

- Why this structure — the reasoning behind what's in SKILL.md vs each refs/ file
- Source of truth — where the API signatures and examples were verified, and when
- Footgun rationale — why this specific pattern was chosen as the one footgun
- Antipattern rationale — why each antipattern passed the inclusion test
- Known gaps — APIs or behaviors not yet documented, and why
- Maintenance notes — what to check when the library releases a new version
- Decision log — any tradeoffs made (e.g. "left out X because it's deprecated in v4")

Format: plain prose. No token constraints. Written for a human who has never seen this skill before and needs to understand, extend, or audit it.

## Applying this process

For any library or framework, the process is the same:

1. Source: official docs → changelog → type definitions → source (when local/private)
2. Footgun: the pattern the docs warn about most, or what the migration guide flags as a common mistake
3. Structure: mirror the library's own conceptual groupings — if the official docs have sections, the refs/ files should match them

The process produces the same output structure regardless of language, ecosystem, or library size.
