/**
 * Markdown parser — extracts sections, Key entry point declarations,
 * and ADR references from an AGENTS.md file.
 *
 * This is the reader for the contract documents that `check` asserts against.
 */

import { readFileSync, existsSync } from "node:fs";

export interface MarkdownSection {
  /** Section heading text, e.g. "Does", "Communication", "Key entry point". */
  heading: string;
  /** Full section body (everything between this heading and the next ## or EOF). */
  body: string;
  /** Line number where the heading starts (1-based). */
  startLine: number;
}

export interface KeyEntryDeclaration {
  /** The file path mentioned, e.g. `url-safety.ts`. */
  file: string;
  /** The exported symbols listed after the dash, e.g. `["assertFetchSafe", "safeFetch"]`. */
  symbols: string[];
}

export interface ADRReference {
  /** The ADR label, e.g. "ADR-001". */
  label: string;
  /** The link target, e.g. "decisions/001-ssrf-canonical.md". */
  path: string;
}

export interface ParsedAGENTS {
  /** Raw file content. */
  raw: string;
  /** All `## Section` headings and their bodies. */
  sections: MarkdownSection[];
  /** The H1 title (first line, `# Boundary name`). */
  title: string | null;
  /** The one-line purpose (the bold line after the title). */
  purpose: string | null;
  /** Parsed "Key entry point" declarations, if the section exists. */
  keyEntryPoints: KeyEntryDeclaration[];
  /** ADR references found anywhere in the document. */
  adrRefs: ADRReference[];
  /** Total line count. */
  lineCount: number;
}

/**
 * Parse an AGENTS.md file from disk. Returns null if the file doesn't exist.
 */
export function parseAGENTS(filePath: string): ParsedAGENTS | null {
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, "utf-8");
  return parseAGENTSContent(raw);
}

/**
 * Parse AGENTS.md content from a string (for testing / dry-run with template strings).
 */
export function parseAGENTSContent(raw: string): ParsedAGENTS {
  const lines = raw.split("\n");
  const sections: MarkdownSection[] = [];
  let title: string | null = null;
  let purpose: string | null = null;

  // Title: first `# ` line
  for (const line of lines) {
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      title = line.slice(2).trim();
      break;
    }
  }

  // Purpose: first `**...**` line after the title
  for (const line of lines) {
    const purposeMatch = line.match(/^\*\*[^*]+\*\*:?\s*(.*)$/);
    if (purposeMatch && line.toLowerCase().includes("purpose")) {
      purpose = line.replace(/^\*\*[^*]+\*\*:?\s*/, "").trim();
      break;
    }
  }

  // Sections: every `## Heading` line, with body until the next `## ` or EOF
  let currentSection: MarkdownSection | null = null;
  const bodyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sectionMatch = line.match(/^##\s+(.+)$/);

    if (sectionMatch) {
      // Push the previous section
      if (currentSection) {
        currentSection.body = bodyLines.join("\n").trim();
        sections.push(currentSection);
      }
      currentSection = {
        heading: sectionMatch[1].trim(),
        body: "",
        startLine: i + 1,
      };
      bodyLines.length = 0;
    } else if (currentSection) {
      bodyLines.push(line);
    }
  }
  // Push the last section
  if (currentSection) {
    currentSection.body = bodyLines.join("\n").trim();
    sections.push(currentSection);
  }

  // Key entry point declarations
  const keyEntryPoints = parseKeyEntryPoints(sections);

  // ADR references anywhere in the doc
  const adrRefs = parseADRRefs(raw);

  return {
    raw,
    sections,
    title,
    purpose,
    keyEntryPoints,
    adrRefs,
    lineCount: lines.length,
  };
}

/**
 * Parse the "Key entry point" section into file → symbols declarations.
 * Each line is expected to be: `- \`file.ts\` — \`symbol1\`, \`symbol2\``
 */
function parseKeyEntryPoints(sections: MarkdownSection[]): KeyEntryDeclaration[] {
  const keySection = sections.find((s) => s.heading.toLowerCase().includes("key entry"));
  if (!keySection) return [];

  const declarations: KeyEntryDeclaration[] = [];

  for (const line of keySection.body.split("\n")) {
    // Match: - `file.ts` — `sym1`, `sym2`, `sym3`
    const match = line.match(/^-\s+`([^`]+)`\s*[—–-]\s*(.+)$/);
    if (match) {
      const file = match[1];
      const symbolsRaw = match[2];
      // Extract all backtick-wrapped symbol names
      const symbols = [...symbolsRaw.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      // If no backtick-wrapped symbols, try splitting by comma
      const finalSymbols = symbols.length > 0 ? symbols : symbolsRaw.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
      declarations.push({ file, symbols: finalSymbols });
    }
  }

  return declarations;
}

/**
 * Extract ADR references: `[ADR-NNN](path)` anywhere in the document.
 */
function parseADRRefs(raw: string): ADRReference[] {
  const refs: ADRReference[] = [];
  const re = /\[ADR-\d+\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const labelMatch = m[0].match(/\[(ADR-\d+)\]/);
    refs.push({
      label: labelMatch ? labelMatch[1] : "ADR-???",
      path: m[1],
    });
  }
  return refs;
}

/**
 * Get a specific section by heading. Default is exact case-insensitive match
 * on the heading; pass `exact: false` for substring (partial) matching.
 */
export function getSection(
  parsed: ParsedAGENTS,
  name: string,
  exact: boolean = true,
): MarkdownSection | null {
  const lower = name.toLowerCase();
  if (exact) {
    return parsed.sections.find((s) => s.heading.toLowerCase() === lower) ?? null;
  } else {
    return parsed.sections.find((s) => s.heading.toLowerCase().includes(lower)) ?? null;
  }
}