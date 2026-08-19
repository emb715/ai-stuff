---
title: "LiteParse — Local PDF Parser"
status: validated
confidence: high
last_tested: 2026-08-04
scope: global
tooling:
  - "liteparse"
  - "lit-cli"
tags:
  - skill
  - pdf
  - parsing
  - ocr
  - liteparse
  - document-processing
owner: "@emb715"
---

# Purpose

Parse PDFs and other documents locally with `lit` — fast spatial text parsing with bounding boxes, OCR (Tesseract bundled), page screenshots, and text/markdown/JSON output. For agents and pipelines that need document text on-device without cloud APIs or keys.

# When to use

- An agent session needs text or structured content from a PDF, DOCX, PPTX, XLSX, or image file, and sending it to a cloud parser is not acceptable (offline, privacy, cost, air-gap).
- A RAG pipeline needs document content chunked, with bounding boxes or page numbers preserved for layout-aware retrieval.
- A vision-capable agent needs page screenshots to reason over a document's visual layout.
- Batch parsing a directory of documents into a uniform output format.

Not for: documents requiring near-perfect markdown fidelity on complex layouts (dense tables, multi-column scans) — `lit is-complex` flags these; use JSON output or a heavier parser (LlamaParse cloud) instead. liteparse is local-first, not fidelity-maximal.

# Inputs

- `{{file_or_dir}}` — a single document path (`lit parse`) or an input directory (`lit batch-parse`). Supported: PDF (native), images JPG/PNG/GIF/BMP/TIFF/WEBP/SVG (native), DOCX/PPTX/XLSX/ODT/etc via LibreOffice.
- `{{format}}` — `text` (default), `markdown`, or `json`. Chosen by downstream use case, not by default.
- `{{ocr_language}}` — Tesseract language code (default `eng`). Required for non-English scans.
- `{{target_pages}}` — page range string like `"1-5,10,15-20"` to parse a subset.

# Skill

Use [`SKILL.md`](SKILL.md) — identity, install, core commands (`parse`, `is-complex`, `screenshot`, `batch-parse`), output format decision table, the markdown-on-complex-doc footgun with wrong/correct pair, OCR setup, image mode, and a routing link to the full CLI reference.

# Evidence

Created 2026-08-04. liteparse installed via `pip install liteparse` (v2.11.0, Python 3.11, macOS arm64). CLI verified working: `lit --help` lists all five subcommands (parse, screenshot, batch-parse, is-complex, help); `lit -V` reports `lit 2.11.0`. Per-subcommand `--help` output captured for `parse`, `batch-parse`, `screenshot`, and `is-complex` — all flags documented in `references/cli-reference.md` match the installed binary. Source: liteparse GitHub README (Apache 2.0), fetched 2026-08-04.

# Failure Modes / Boundaries

- **Markdown reconstruction on complex documents is not faithful** — the documented footgun. Heuristic reconstruction produces plausible-looking but structurally wrong output for dense tables, multi-column layouts, and scans. Severe (silent wrong data fed to LLMs/RAG) and natural (markdown is the default readable format users reach for). Mitigation: run `lit is-complex` first; if complex, use JSON or a heavier parser. See `SKILL.md`.
- **LibreOffice dependency for non-PDF formats** — DOCX/PPTX/XLSX/ODT parsing shells out to LibreOffice. If LibreOffice is not installed (`brew install --cask libreoffice`), these formats fail. PDF and images are native and need nothing.
- **`--max-pages` defaults to 1000** — very large documents silently truncate at 1000 pages unless the flag is raised. Known limitation, not a bug.
- **OCR is on by default** — native-digital PDFs parse faster with `--no-ocr` when no scanned content is present. Leaving OCR on for clean digital PDFs wastes time without changing output.
- **HTTP OCR servers are unauthenticated by default** — `--ocr-server-header` exists but is optional. Do not expose an OCR server on an open network without auth.

# Related artifacts

- [`skills/skill-authoring/`](../skill-authoring/) — the vault skill-authoring process that produced this structure.