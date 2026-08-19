# liteparse

liteparse is a fast, local, open-source PDF/document parser with OCR, bounding boxes, and markdown output. Runs entirely on-device — no cloud, no API key. CLI command is `lit` across all installs.

## Install

```bash
pip install liteparse        # primary — Python wheel, no toolchain needed
# alternatives:
# npm i -g @llamaindex/liteparse
# cargo install liteparse
lit --help                   # verify; CLI is `lit`, not `liteparse`
```

OCR (Tesseract) is bundled — zero setup. Office formats (DOCX/PPTX/XLSX/ODT) require LibreOffice: `brew install --cask libreoffice`.

## Core commands

```bash
# parse → text (default), markdown, or json
lit parse report.pdf                              # text to stdout
lit parse report.pdf --format markdown -o out.md  # markdown (headings, tables, lists, links)
lit parse report.pdf --format json -o out.json    # structured JSON with bounding boxes
lit parse report.pdf --target-pages "1-5,10,15-20"  # specific pages only
lit parse scan.pdf --ocr-language fra             # French OCR (default eng)

# complexity predicate — cheap check before choosing a format
lit is-complex report.pdf                         # exits 0 if simple, non-zero if OCR/advanced needed
lit is-complex report.pdf --compact               # one-line JSON

# screenshots — page images for LLM agents / vision pipelines
lit screenshot report.pdf -o ./shots              # PNG per page (default ./screenshots)
lit screenshot report.pdf --target-pages "1,5,10" --dpi 300

# batch — directory in, directory out
lit batch-parse ./pdfs ./out --format markdown --recursive
lit batch-parse ./pdfs ./out --format json --num-workers 8
```

## Output format — choose before parsing

| Use case | Format | Why |
|---|---|---|
| Feed text to an LLM chat / RAG chunker | `text` | smallest, no markup noise |
| Preserve headings, tables, lists, links for human review or docs | `markdown` | readable, editable |
| Need bounding boxes, page numbers, structure for layout-aware pipelines | `json` | preserves spatial data markdown flattens |
| Page images for vision models or human spot-check | `screenshot` | PNG per page |

Rule of thumb: `text` for LLM input, `json` when structure matters, `markdown` only when a human will read it or the doc is simple.

## The footgun — trusting markdown output for a complex document

Markdown reconstruction is purely heuristic/rule-based. Complex documents (dense tables, multi-column layouts, scanned pages, mixed orientations) will NOT render faithfully — but the output looks plausible. Feeding plausible-wrong markdown to an LLM or RAG pipeline is silent data corruption: the model trusts the text, the retrieval indexes it, and no error surfaces.

```bash
# ✗ — trusts markdown for a doc that may be complex; broken tables/columns pass silently downstream
lit parse annual_report.pdf --format markdown -o report.md
# then feed report.md to a RAG chunker without checking

# ✓ — check complexity first, choose format by result
lit is-complex annual_report.pdf
# simple  → markdown is safe
# complex → use json (preserves structure) or fall back to a heavier parser (LlamaParse cloud)
lit parse annual_report.pdf --format json -o report.json
```

`is-complex` is cheap — run it before every markdown parse where the doc origin is unknown. The cost of the check is seconds; the cost of silent wrong output downstream is untraceable.

## OCR

Tesseract is bundled — works offline with no config. For non-English:

```bash
lit parse scan.pdf --ocr-language fra      # French; default eng
lit parse scan.pdf --no-ocr                # disable OCR (native text only)
```

HTTP OCR servers (EasyOCR, PaddleOCR) for models Tesseract handles poorly:

```bash
lit parse scan.pdf --ocr-server-url http://localhost:8501/v1/ocr
lit parse scan.pdf --ocr-server-url http://localhost:8501/v1/ocr \
  --ocr-server-header "Authorization: Bearer $TOKEN"
```

Air-gapped / custom tessdata: set `TESSDATA_PREFIX` or pass `--tessdata-path /path/to/tessdata`.

## Images in markdown output

```bash
lit parse doc.pdf --format markdown --image-mode off         # no images (default: placeholder)
lit parse doc.pdf --format markdown --image-mode embed       # base64-embed images inline
lit parse doc.pdf --format markdown --extract-images \
  --image-output-dir ./imgs                                  # write image files to disk (needs --extract-images)
```

## Checklist

- [ ] `lit --help` runs (install verified)
- [ ] Format chosen by use case, not by default (text vs markdown vs json)
- [ ] `lit is-complex` run before any markdown parse of unknown-origin docs
- [ ] OCR language set for non-English scans
- [ ] LibreOffice installed if parsing DOCX/PPTX/XLSX

→ See [references/cli-reference.md](references/cli-reference.md) for the full `lit parse` flag table, batch/screenshot options, multi-format input support, and advanced extraction flags (annotations, form fields, structure tree, XFA, vector graphics).