# humans.md — liteparse

## What this is

A skill that teaches an agent how to use the `lit` CLI (liteparse) to parse PDFs and other documents locally. Covers the four most-used commands (`parse`, `is-complex`, `screenshot`, `batch-parse`), an output-format decision table, the one footgun (markdown reconstruction on complex documents), OCR setup, and image mode. Routes CLI depth into one `references/` file.

## Source

liteparse GitHub README (Apache 2.0), fetched 2026-08-04. CLI flags verified against the installed binary (`lit 2.11.0`, Python 3.11 wheel on macOS arm64) by running `lit <command> --help` for every subcommand. Where the README and the installed binary's help text disagreed in wording, the binary's help text was treated as authoritative — it is what the user actually sees.

## Why this structure

**Library-skill track applied.** liteparse is a CLI tool, not a library imported in code, but the skill-authoring process's library-skill track fits cleanly: the "library" is `lit`, the "APIs" are the subcommands, the footgun is a usage pattern, and the source of truth is the official README plus the installed binary's help output. The task-skill track (Core Principles + decision tables) does not fit — there is no multi-step procedure to encode.

**SKILL.md** holds the 80% case: identity, install, four commands with minimal examples, the format decision table, the footgun with wrong/correct pair, OCR, image mode, a checklist, and one routing link. ~95 lines — within the 100–180 target. Opens with library identity ("liteparse is a fast, local, open-source PDF/document parser..."), not agent identity. No "You are an expert" opener; no prose explanations; code over prose; tables over lists where structure is parallel.

**references/cli-reference.md** extracts the full `lit parse` flag table and the options for `batch-parse`, `screenshot`, and `is-complex` — everything beyond the 80% case. One concern (the CLI surface), one file. Advanced extraction flags (`--extract-annotations`, `--extract-form-fields`, `--extract-structure-tree`, `--extract-xfa-packets`, `--extract-content-bounds`, `--extract-vector-graphics`, `--complexity`, `--extract-text-metadata`) live here, not in SKILL.md — a first-time user does not need them, and including them would bloat the 80% case past the line target.

**Dropped from the source** — the WASM build notes (not relevant to CLI usage), the full list of supported image extensions (summarized as "images native"), the XMP/metadata extraction detail (advanced, in references/), and the architecture/internals description (not actionable for CLI users). These were prose that did not change what command the model runs next.

## Footgun rationale

The skill-authoring bar for a footgun is three-way: non-obvious, severe, natural. Markdown reconstruction on complex documents clears all three.

- **Non-obvious** — the output looks plausible. There is no error, no warning, no exception. A dense table rendered as broken markdown still reads as text; a multi-column layout flattened to wrong reading order still produces sentences. The failure is invisible without comparing against the source visually.
- **Severe** — the output feeds LLMs and RAG pipelines. Wrong-but-plausible text gets indexed, retrieved, and served as answers. The error propagates silently through every downstream stage. There is no traceback to follow.
- **Natural** — markdown is the default readable format. Users reach for `--format markdown` because it is human-readable and editable, and because most LLM tooling expects markdown. The path of least resistance produces the footgun.

The source README mentions reconstruction is heuristic but does not flag it as a footgun. The three-way bar elevates it: this is the one pattern a user will instinctively get wrong, with the worst downstream consequence. `is-complex` is the mitigation because it is cheap (a predicate, not a full parse) and decisive (exits non-zero when markdown is unsafe).

## Known gaps

- **LibreOffice dependency not in SKILL.md.** SKILL.md mentions it in one line under Install because it is a setup step. The full list of Office formats that require it lives in `references/cli-reference.md`. A user who reads only SKILL.md and tries to parse a DOCX without LibreOffice will hit a runtime error — the error message from `lit` is the backstop, not the skill.
- **WASM build not covered.** liteparse ships a WASM target for browser/in-process use. This skill documents only the CLI. A maintainer who needs the WASM API should add a `references/wasm.md` file with a routing link from SKILL.md.
- **XMP / metadata extraction flags not in SKILL.md.** `--extract-text-metadata`, `--extract-annotations`, `--extract-form-fields`, `--extract-structure-tree`, `--extract-xfa-packets`, `--extract-content-bounds`, `--extract-vector-graphics`, `--complexity` are all documented in `references/cli-reference.md`. They are advanced and rarely needed in an agent session; surfacing them in SKILL.md would push past the line target without serving the 80% case.
- **No version pin.** The skill documents the CLI as installed (`lit 2.11.0`) but does not pin a version in the install command. liteparse is actively developed and CLI flags may shift; see Maintenance notes.

## Maintenance notes

- **liteparse is actively developed.** As of 2026-08-04: 931 commits, 11.9k stars on GitHub. Check for breaking CLI changes on every major release. The `lit <command> --help` output is the authoritative reference — re-capture it on each upgrade and diff against `references/cli-reference.md`.
- **Re-verify the footgun on each major release.** Markdown reconstruction is heuristic and may improve over time. If a future release makes `--format markdown` faithful on complex documents (or adds a `--strict-markdown` flag that errors instead of producing broken output), the footgun section should be removed or rewritten. Run `lit is-complex` and `lit parse --format markdown` on a known-complex doc after each upgrade to check.
- **Check `last_tested` in README frontmatter.** If more than ~90 days old, re-verify the install command still works and the CLI flags still match. Python wheel availability on new OS/arch combinations is not guaranteed — note any platform-specific install failures in Evidence.
- **Office format support depends on LibreOffice.** If liteparse adds native Office parsing in a future release, the LibreOffice note in SKILL.md and `references/cli-reference.md` should be removed. Check the changelog on each release.
- **OCR engine coverage.** Tesseract is bundled today. If a future release unbundles it or switches the default engine, the OCR section in SKILL.md and the OCR setup in `references/cli-reference.md` need updating. The `--ocr-server-url` path (HTTP OCR servers) is stable and unlikely to change.