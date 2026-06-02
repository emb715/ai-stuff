---
name: library-skill-builder
description: Use when creating or rewriting an opencode skill for a software library, framework, or tool. Triggers on "create a skill for X", "write a skill for Y", "generate a skill from the docs", or "refactor this skill".
---

# library-skill-builder

A process for turning any library or framework into a well-structured opencode skill.

## Skill quality checklist

A good skill is:

- **Concise** — every line earns its place
- **Responsible for one thing** — not a multi-step workflow
- **Composable** — routes to `docs/` files instead of dumping everything inline
- **Progressively disclosed** — SKILL.md covers the 80% case, depth lives in `docs/`
- **Harness-agnostic** — works regardless of which AI tool loads it
- **Well-documented** — a `humans.md` companion explains the skill's structure, decisions, and how to maintain it; SKILL.md contains none of this — it is written for a model, not a reader
- **Portable** — no assumptions about the consumer's project structure
- **Secure** — never instructs the model to output secrets, tokens, or credentials; redacts sensitive values in examples
- **Affirmative** — describes what the library does, not what it doesn't have
- **Grounded** — antipatterns shown are patterns the model will naturally produce from plausible reasoning, not invented failure modes; each pairs the wrong version with the correct alternative

---

## Process

### Step 1 — Gather the source of truth

Start with official documentation. For most libraries it is the most accurate, most maintained, and most intentional representation of the API. Source code is a verification layer, not the starting point.

Priority order:
1. **Official docs** — reference pages, API docs, migration guides
2. **Changelog / release notes** — what changed recently, what was removed
3. **TypeScript definitions** — resolve ambiguities where docs and types conflict; types win on signatures
4. **Source code** — use when docs are absent, stale, or the library is local/private

What to capture:
- Every public export, grouped by entry point or subpath
- Exact signatures for the 5–10 most-used APIs
- Any subpath or module structure that affects how things are imported
- Version-specific behavior if the library is actively evolving

Treat anything you cannot verify from at least one of these sources as unconfirmed. Do not carry unconfirmed claims into the skill.

### Step 2 — Find the one footgun

Every non-trivial library has one pattern that looks harmless but causes catastrophic or subtle failure. This earns a warning in the skill. Everything else does not.

A real footgun has all three of:
- **Non-obvious** — it works initially, breaks later, or fails in ways that are hard to trace
- **Severe** — data loss, broken behavior, memory leaks, silent wrong output
- **Natural** — developers write the wrong version instinctively; the error is the path of least resistance

Examples by category:
- **Component lifecycle**: creating a component type inside a render function (new identity every render)
- **Async**: fire-and-forget mutations without error handling
- **Routing**: hardcoded path strings instead of typed routes (breaks silently at rename)
- **State**: reading a value once instead of subscribing to it
- **Types**: using a cast to bypass an `unknown` return without validating shape

One footgun per skill. If you find more than one, rank by severity and document only the worst in SKILL.md. The rest go in `docs/`.

### Step 3 — Identify grounded antipatterns (optional)

Antipatterns belong in a skill when the model will confidently produce the wrong version from plausible reasoning about the API. They do not belong when the model would only write them out of pure ignorance — that is a documentation gap, not an antipattern.

**The test for inclusion:** could the model write this wrong version while believing it is correct? If yes, it earns a place. If the model would only write it because it doesn't know the API at all, add a better example instead.

Each antipattern must:
- Show the wrong version with a one-line explanation of why it fails
- Immediately follow with the correct version
- Name the failure mode, not just the fix

```md
// ✗ — triggers a full remount on every render, destroying state and refs
// ✓ — define at module scope; use props for values that change at runtime
```

Where antipatterns live:
- **One severe case** → SKILL.md alongside the footgun (Step 2)
- **Longer tail** → `docs/antipatterns.md`, linked from SKILL.md

If you find fewer than three grounded antipatterns, skip the `docs/antipatterns.md` file and fold them into the relevant section of SKILL.md or the appropriate `docs/` file. A dedicated antipattern file only earns its place when the list is long enough to fragment the reading flow elsewhere.

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

**SKILL.md** covers:
- One-sentence identity — what the library does, for whom
- Install or import — the first thing any developer needs
- The 3–5 most-used APIs with minimal working examples
- The one footgun with a correct alternative shown
- Explicit `→ See docs/X.md` routes for anything requiring more depth

**`docs/` files** cover (one file per concern, not per API):
- Full export/API tables
- Detailed feature walkthroughs
- Configuration reference
- Patterns that only appear once a developer is already past the basics

Name files by concern:
- `docs/imports.md` — full export reference by entry point
- `docs/routing.md` — routing patterns
- `docs/data-fetching.md` — fetching and mutation patterns
- `docs/configuration.md` — config options and defaults
- `docs/testing.md` — testing utilities and patterns

### Step 6 — Write affirmatively

Every sentence describes what the library does and how to use it correctly.

Do not include:
- Lists of APIs or features that don't exist
- Warnings about removed features
- "Note: X is not supported" unless X is something developers will actively reach for and the absence is genuinely non-obvious

**The test:** if a developer has never used this library before, does the skill give them enough to write correct code? If yes, it is ready.

### Step 7 — Write for the model, not for a human reader

SKILL.md is consumed as context tokens by a language model. Every word that doesn't help the model produce correct output is waste that competes with actual instruction.

**Token efficiency rules:**

- Code over prose — a correct example teaches faster than a paragraph explaining it
- No transitional sentences ("Now that we've covered X, let's look at Y")
- No motivational framing ("This is important because...")
- No restating what a heading already says
- Tables over lists when structure is parallel
- One blank line between sections, not two
- Inline comments in code blocks instead of paragraphs before them

**What belongs in SKILL.md vs humans.md:**

| SKILL.md | humans.md |
|---|---|
| Import paths | Why subpaths exist |
| Working examples | How to extend the examples |
| Footgun + correct version | Why this specific pattern was chosen |
| Routing table links | How the docs/ structure was decided |
| API signatures | Where the signatures were verified |

**The compression test:** read a section and ask — does every sentence change what code the model writes next? If a sentence only helps a human understand the context, it goes in `humans.md`.

### Step 8 — Write the trigger description

The `description` field in the frontmatter controls when the skill auto-activates. It should name:
- The library's package name
- The 4–6 most common function, hook, or class names a developer would type
- The task contexts that indicate the library is in use

```yaml
description: Use when building with <library>. Triggers on <api-1>, <api-2>,
  <api-3>, or when <task-context>.
```

Specific enough to not false-trigger on unrelated sessions. Generic phrases like "when working with JavaScript" are too broad.

---

## Output structure

```
skills/<library-name>/
├── SKILL.md              ← model-facing: trigger, identity, install, 80% patterns, footgun, routes
├── humans.md             ← human-facing: structure rationale, maintenance guide, decision log
└── docs/
    ├── imports.md        ← full export reference by entry point
    ├── antipatterns.md   ← (optional) grounded antipatterns when list > 3
    ├── <concern-a>.md    ← depth for feature A
    ├── <concern-b>.md    ← depth for feature B
    └── ...
```

SKILL.md target: 100–180 lines — dense, token-efficient, no explanatory prose  
humans.md target: as long as needed — prose welcome, explains the why  
Each docs/ file target: 60–100 lines  
Total SKILL.md + docs/ cap: ~600 lines

---

## Routing table pattern

At the end of each section in SKILL.md that has a corresponding `docs/` file, add one line:

```md
→ See [docs/routing.md](docs/routing.md) for dynamic segments, layouts, and typed routes.
```

Points to the file. Describes what's there in 5–10 words so the model knows whether to follow it.

---

## humans.md — the companion file

`humans.md` sits alongside `SKILL.md` and is never loaded as model context. It exists for the person who writes, reviews, or maintains the skill.

What it contains:

- **Why this structure** — the reasoning behind what's in SKILL.md vs each docs/ file
- **Source of truth** — where the API signatures and examples were verified, and when
- **Footgun rationale** — why this specific pattern was chosen as the one footgun
- **Antipattern rationale** — why each antipattern passed the inclusion test
- **Known gaps** — APIs or behaviors not yet documented, and why
- **Maintenance notes** — what to check when the library releases a new version
- **Decision log** — any tradeoffs made (e.g. "left out X because it's deprecated in v4")

Format: plain prose. No token constraints. Written for a human who has never seen this skill before and needs to understand, extend, or audit it.

---

## Applying this to a library

**React 19**
1. Source: react.dev/reference, `@types/react`, react.dev/blog for recent changes
2. Footgun: calling `use()` conditionally — violates Rules of Hooks in a non-obvious way
3. Structure: SKILL.md covers hooks + `use()` + actions; docs/ covers server components, transitions, `useOptimistic`, `useFormStatus`

**Expo Router**
1. Source: docs.expo.dev/router, file-system routing conventions, `expo-router` package types
2. Footgun: `router.push()` with hardcoded strings — breaks silently at rename, no TS error without typed routes configured
3. Structure: SKILL.md covers file conventions + `Link` + `useRouter`; docs/ covers layouts, groups, dynamic segments, API routes, typed routes

**Any published npm library**
1. Source: official docs site → changelog → TypeScript definitions
2. Footgun: whatever pattern the docs warn about most, or whatever the library's own migration guide flags as a common mistake
3. Structure: mirror the library's own conceptual groupings — if the docs have sections, the docs/ files should match them
