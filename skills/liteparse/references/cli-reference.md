# references/cli-reference.md — liteparse CLI

Full CLI surface for `lit` (v2.11.0). Verified against `lit <command> --help` on 2026-08-04.

## `lit parse [OPTIONS] <FILE>`

| Flag | Default | Purpose |
|---|---|---|
| `-o, --output <OUTPUT>` | stdout | Write output to file |
| `--format <FORMAT>` | `text` | `text` · `markdown` · `json` |
| `--no-ocr` | (ocr on) | Disable OCR; native text only |
| `--ocr-language <LANG>` | `eng` | Tesseract language code (`fra`, `deu`, `fra+eng`) |
| `--ocr-server-url <URL>` | — | HTTP OCR server (EasyOCR, PaddleOCR) |
| `--ocr-server-header "Name: Value"` | — | Extra header for OCR server (repeatable) |
| `--tessdata-path <PATH>` | bundled | Custom tessdata directory |
| `--max-pages <N>` | `1000` | Hard cap on pages parsed |
| `--target-pages "1-5,10,15-20"` | all | Parse a page subset |
| `--dpi <N>` | `150` | Render DPI for OCR/screenshot |
| `--preserve-small-text` | off | Keep small text fragments |
| `--password <PW>` | — | Password-protected PDFs |
| `-q, --quiet` | off | Suppress progress output |
| `--num-workers <N>` | auto | Parallel worker count |
| `--image-mode <MODE>` | `placeholder` | `off` · `placeholder` · `embed` (markdown only) |
| `--extract-images` | off | Extract image bytes (needs `--image-output-dir` to write files) |
| `--image-output-dir <DIR>` | — | Write extracted images to DIR (needs `--extract-images`) |
| `--no-links` | off | Disable hyperlink extraction; emit plain anchor text |
| `--keep-headers-footers` | off | Keep running headers/footers (stripped by default) |
| `--extract-annotations` | off | PDF annotations as page-scoped structured data (JSON) |
| `--extract-form-fields` | off | AcroForm widget fields and values (JSON) |
| `--extract-structure-tree` | off | Tagged-PDF logical structure tree (JSON) |
| `--extract-xfa-packets` | off | Raw XFA packets — name + XML (JSON) |
| `--extract-content-bounds` | off | Per-page content_bounds union bbox (JSON) |
| `--complexity` | off | Per-page complexity signals as `complexity` object (JSON) |
| `--extract-text-metadata` | off | Rich PDF text metadata in text items + JSON |
| `--extract-vector-graphics` | off | Page-scoped vector shapes + merged H/V lines (JSON) |

## `lit batch-parse [OPTIONS] <INPUT_DIR> <OUTPUT_DIR>`

| Flag | Default | Purpose |
|---|---|---|
| `--format` · `--no-ocr` · `--ocr-language` · `--ocr-server-url` · `--ocr-server-header` · `--tessdata-path` · `--max-pages` · `--dpi` · `--password` · `-q` · `--num-workers` | — | same semantics as `lit parse` |
| `--recursive` | off | Descend into subdirectories |
| `--extension <EXT>` | all supported | Filter by extension (e.g. `pdf`) |
| `--complexity` · `--extract-text-metadata` · `--extract-images` | off | Same as `lit parse` |

No `--target-pages` in batch — every file parsed in full (subject to `--max-pages`).

## `lit screenshot [OPTIONS] <FILE>`

| Flag | Default | Purpose |
|---|---|---|
| `-o, --output-dir <DIR>` | `./screenshots` | Output directory (created if missing) |
| `--target-pages "1-5,10"` | all | Page subset |
| `--dpi <N>` | `150` | Render DPI (higher = sharper, larger files) |
| `--password <PW>` | — | Password-protected PDFs |
| `-q, --quiet` | off | Suppress progress |

Outputs one PNG per page, named by page number. Use for vision-model input or human spot-check of parsing fidelity.

## `lit is-complex [OPTIONS] <FILE>`

| Flag | Default | Purpose |
|---|---|---|
| `--compact` | off | Dense one-line JSON (still `jq`-parseable) |
| `--max-pages <N>` | `1000` | Page cap for the check |
| `--target-pages "1-5,10"` | all | Check a subset |
| `--password <PW>` | — | Password-protected PDFs |
| `-q, --quiet` | off | Suppress output, rely on exit code only |

Exit code: `0` if simple, non-zero if OCR/advanced parsing needed. Cheap — run before choosing output format. Conditional parse:

```bash
lit is-complex doc.pdf && lit parse doc.pdf --format markdown -o doc.md \
  || lit parse doc.pdf --format json -o doc.json
```

## OCR setup

**Tesseract (bundled, default).** Zero config. Languages via `--ocr-language fra`; multiple via `--ocr-language "fra+eng"`. Air-gapped: `export TESSDATA_PREFIX=/opt/tessdata` or `--tessdata-path /opt/tessdata`.

**HTTP OCR servers** (handwriting, low-quality scans, non-Latin scripts Tesseract handles poorly):

```bash
lit parse scan.pdf --ocr-server-url http://localhost:8501/v1/ocr
lit parse scan.pdf --ocr-server-url http://localhost:8501/v1/ocr \
  --ocr-server-header "Authorization: Bearer $TOKEN"
```

Server must implement the liteparse OCR HTTP spec. EasyOCR and PaddleOCR server wrappers are the common choices.

## Multi-format input

| Format | Support | Notes |
|---|---|---|
| PDF | native | primary target; all flags apply |
| JPG/PNG/GIF/BMP/TIFF/WEBP/SVG | native | treated as single-page images |
| DOCX/PPTX/XLSX/ODT/RTF/etc | via LibreOffice | `brew install --cask libreoffice` (macOS); `apt install libreoffice` (Debian) |

If a non-PDF/non-image format fails with a converter error, LibreOffice is missing or not on PATH. Verify: `libreoffice --version`.