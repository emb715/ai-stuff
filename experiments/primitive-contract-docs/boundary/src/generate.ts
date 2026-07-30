/**
 * generate command — drafts obligation-level content by emitting an LLM prompt.
 *
 * Same pattern as `lint --phase 2`: emit-prompt + apply. No API key at build time.
 *
 * The human is the trust anchor. Drafts are reviewed before finalizing.
 *
 * - `--emit-prompt`: read each boundary's surface + source sample, emit a prompt
 *   the user pastes into an LLM. The LLM returns JSON with drafted
 *   Does / Does NOT / Communication bullets per boundary.
 * - `--apply <file>`: read that JSON, fill each boundary's AGENTS.md (creating
 *   from template if absent), then run `boundary check` to verify.
 * - `--dry-run --apply <file>`: same, but no writes — report what would be filled
 *   and whether the would-be contracts would pass check.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync, openSync, readSync, closeSync } from "node:fs";
import { join } from "node:path";
import type { Manifest, BoundaryEntry } from "./manifest.ts";
import { boundaryDir } from "./manifest.ts";
import { extractSurface } from "./surface.ts";
import { parseAGENTS, getSection, type ParsedAGENTS, type MarkdownSection } from "./markdown.ts";
import { generateAgentsTemplate } from "./template.ts";
import { checkBoundary, type BoundaryCheckResult } from "./check.ts";
import { readJsonFile } from "./json-apply.ts";

// ── Types ───────────────────────────────────────────────────────────────────

/** A single boundary's drafted content, as returned by the LLM. */
export interface BoundaryDraft {
  name: string;
  does: string[];
  doesNot: string[];
  communication: string[];
}

/** The shape of the JSON file passed to `--apply`. */
export interface GenerateDraftFile {
  boundaries: BoundaryDraft[];
}

/** Per-boundary outcome of an apply pass. */
export interface GenerateBoundaryReport {
  name: string;
  dir: string;
  /** True if AGENTS.md existed before apply; false if it would be created. */
  agentsMdExisted: boolean;
  /** Number of bullets written per section (0 if section missing from draft). */
  filled: { does: number; doesNot: number; communication: number };
  /** Sections skipped because they already had human content (force=false). */
  skipped: string[];
  /** Whether the boundary passed check after filling. */
  passed: boolean;
  /** The full check result, for detail reporting. */
  checkResult: BoundaryCheckResult;
}

/** Aggregate report of an apply pass. */
export interface GenerateReport {
  manifest: Manifest;
  dryRun: boolean;
  boundaries: GenerateBoundaryReport[];
  totalFilled: number;
  totalPassed: number;
  totalFailed: number;
  /** Draft boundary names not found in the manifest (warned, not applied). */
  unmatchedDraftNames: string[];
  /** Manifest boundaries not present in the draft (warned, left untouched). */
  unfilledBoundaries: string[];
}

// ── emitGeneratePrompt ──────────────────────────────────────────────────────

/** Cap source sample at this many lines per file — keeps the prompt manageable. */
const MAX_SOURCE_LINES = 200;

/**
 * Build the generate prompt. For each boundary, reads:
 *   1. The extracted surface (exported symbols from entry files)
 *   2. The existing AGENTS.md if present (so the LLM sees what's already filled)
 *   3. A sample of the main entry file's source (first 200 lines)
 *
 * Emits a single prompt asking the LLM to draft Does / Does NOT / Communication
 * bullets per boundary, returned as a single JSON object.
 */
export function emitGeneratePrompt(manifest: Manifest): string {
  const lines: string[] = [];

  lines.push("Draft obligation-level content for each boundary's AGENTS.md.");
  lines.push("");
  lines.push("Content rule: Obligation only — no file paths, no library names, no param shapes, no specific counts. Use: may, must, must not, owed, owns, guarantees.");
  lines.push("");
  lines.push("For each boundary, draft:");
  lines.push("- Does: 3-5 obligation-level bullets — what this boundary does.");
  lines.push("- Does NOT: 2-3 bullets — what is explicitly out of scope, what neighboring boundaries own.");
  lines.push("- Communication: 3-5 bullets using may/must/must not/owed — caller obligations + owed invariants.");
  lines.push("");
  lines.push("Boundaries:");
  lines.push("");

  for (const entry of manifest.boundaries) {
    appendBoundarySection(lines, manifest, entry);
  }

  lines.push("Respond as a single JSON object:");
  lines.push("```json");
  lines.push(JSON.stringify(
    {
      boundaries: [
        {
          name: "<boundary name>",
          does: ["bullet 1", "bullet 2"],
          doesNot: ["bullet 1"],
          communication: ["Callers may ...", "Callers must ..."],
        },
      ],
    },
    null,
    2,
  ));
  lines.push("```");

  return lines.join("\n");
}

/**
 * Append a single boundary's context block to the prompt lines.
 */
function appendBoundarySection(
  lines: string[],
  manifest: Manifest,
  entry: BoundaryEntry,
): void {
  const bDir = boundaryDir(manifest, entry);
  lines.push(`### Boundary: ${entry.name}`);
  lines.push(`Purpose: ${entry.purpose}`);
  lines.push("");

  // 1. Extracted surface symbols
  const surface = extractSurface(bDir, entry.surface);
  const symbolCount = surface.symbols.length;
  if (symbolCount > 0) {
    lines.push(`Surface symbols (${symbolCount}):`);
    const byFile = new Map<string, string[]>();
    for (const s of surface.symbols) {
      if (!byFile.has(s.file)) byFile.set(s.file, []);
      byFile.get(s.file)!.push(s.name);
    }
    for (const [file, syms] of byFile) {
      lines.push(`- ${file}: ${syms.join(", ")}`);
    }
  } else {
    lines.push("Surface symbols: (none extracted)");
  }
  lines.push("");

  // 2. Existing AGENTS.md (if any)
  const agentsPath = join(bDir, "AGENTS.md");
  if (existsSync(agentsPath)) {
    const parsed = parseAGENTS(agentsPath);
    if (parsed) {
      lines.push("Existing AGENTS.md sections:");
      appendExistingSection(lines, parsed, "Does");
      appendExistingSection(lines, parsed, "Does NOT");
      appendExistingSection(lines, parsed, "Communication");
    }
  } else {
    lines.push("Existing AGENTS.md: (none — will be created from template)");
  }
  lines.push("");

  // 3. Source sample from the main entry file (first in the surface list).
  // For dir surfaces (e.g. `src/`), entry.surface[0] is a directory and
  // readFileSync throws EISDIR — fall back to the file of the first extracted
  // surface symbol, which is always a real file.
  const declaredEntry = entry.surface[0];
  const sampleFile = pickSampleFile(bDir, declaredEntry, surface.symbols);
  if (sampleFile) {
    const mainPath = join(bDir, sampleFile);
    const sourceLines = readSourceLinesCapped(mainPath, MAX_SOURCE_LINES);
    const capped = sourceLines.join("\n");
    lines.push(`Source sample (${sampleFile}, first ${Math.min(sourceLines.length, MAX_SOURCE_LINES)} lines):`);
    lines.push("```");
    lines.push(capped);
    lines.push("```");
  } else if (declaredEntry) {
    lines.push(`Source sample: (main entry file ${declaredEntry} not readable)`);
  } else {
    lines.push(`Source sample: (no entry file declared)`);
  }
  lines.push("");
}

/**
 * Pick the file to sample source from. Prefers the declared entry if it's a
 * readable file; if the declared entry is a directory (dir surfaces like
 * `src/`), falls back to the first extracted surface symbol's file.
 * Returns the file path relative to the boundary dir, or undefined if no
 * readable file is available.
 */
function pickSampleFile(
  bDir: string,
  declaredEntry: string | undefined,
  symbols: { file: string }[],
): string | undefined {
  if (declaredEntry) {
    const p = join(bDir, declaredEntry);
    if (existsSync(p)) {
      try {
        if (statSync(p).isFile()) return declaredEntry;
      } catch {
        // not a file or missing — fall through
      }
    }
  }
  if (symbols.length > 0) {
    const symFile = symbols[0].file;
    const p = join(bDir, symFile);
    if (existsSync(p)) {
      try {
        if (statSync(p).isFile()) return symFile;
      } catch {
        // missing — fall through
      }
    }
  }
  return undefined;
}

/**
 * Read the first N lines of a file without loading the whole file into memory
 * when it is large. For files under ~50KB (roughly 200 lines × ~250 chars/line),
 * read the entire file (fast path). For larger files, read only the first 50KB
 * using a bounded buffer, then split by newline and take up to `maxLines`.
 * Returns the raw lines (no trailing newline join) — caller joins as needed.
 */
function readSourceLinesCapped(path: string, maxLines: number): string[] {
  const LARGE_FILE_THRESHOLD = 50 * 1024; // ~50KB

  let size = 0;
  try {
    size = statSync(path).size;
  } catch {
    return [];
  }

  let raw: string;
  if (size <= LARGE_FILE_THRESHOLD) {
    raw = readFileSync(path, "utf-8");
  } else {
    // large file: read first 50KB only
    const fd = openSync(path, "r");
    try {
      const buf = Buffer.alloc(LARGE_FILE_THRESHOLD);
      const bytesRead = readSync(fd, buf, 0, LARGE_FILE_THRESHOLD, 0);
      raw = buf.subarray(0, bytesRead).toString("utf-8");
    } finally {
      closeSync(fd);
    }
  }

  const lines = raw.split("\n");
  return lines.slice(0, maxLines);
}

/**
 * Append an existing AGENTS.md section's body to the prompt, stripped of
 * HTML comments. Empty sections are noted as "(empty)".
 */
function appendExistingSection(
  lines: string[],
  parsed: ParsedAGENTS,
  sectionName: string,
): void {
  const section = getSection(parsed, sectionName);
  if (!section) {
    lines.push(`- ${sectionName}: (section missing)`);
    return;
  }
  const stripped = stripHtmlComments(section).trim();
  if (stripped.length === 0) {
    lines.push(`- ${sectionName}: (empty — only HTML comment instructions)`);
    return;
  }
  lines.push(`- ${sectionName}:`);
  for (const bodyLine of stripped.split("\n")) {
    lines.push(`    ${bodyLine}`);
  }
}

// ── applyGeneratedDrafts ────────────────────────────────────────────────────

/**
 * Read the draft JSON, fill each boundary's AGENTS.md, and run check.
 *
 * - If AGENTS.md doesn't exist, create it from the template (pre-filled Key
 *   entry point) before filling the obligation sections.
 * - Replaces the Does / Does NOT / Communication section bodies with the
 *   drafted bullets, preserving the headings.
 * - Keeps Key entry point and To touch sections as-is.
 * - Runs checkBoundary to verify.
 *
 * When `dryRun` is true, no files are written; the report reflects what
 * *would* be filled and whether the would-be contracts *would* pass check.
 * (Implementation: builds the filled document in memory and passes it to
 * `checkBoundary` as a `contentOverride`, so the check reflects the post-apply
 * state without writing to disk.)
 */
export function applyGeneratedDrafts(
  manifest: Manifest,
  draftsPath: string,
  dryRun: boolean,
  force: boolean = false,
): GenerateReport {
  const drafts = readDraftFile(draftsPath);
  const draftsByName = new Map<string, BoundaryDraft>();
  for (const d of drafts.boundaries) {
    draftsByName.set(d.name, d);
  }

  const manifestNames = new Set(manifest.boundaries.map((b) => b.name));
  const unmatchedDraftNames: string[] = [];
  for (const d of drafts.boundaries) {
    if (!manifestNames.has(d.name)) unmatchedDraftNames.push(d.name);
  }

  const boundaryReports: GenerateBoundaryReport[] = [];
  let totalFilled = 0;
  let totalPassed = 0;
  const unfilledBoundaries: string[] = [];

  for (const entry of manifest.boundaries) {
    const draft = draftsByName.get(entry.name);
    if (!draft) {
      unfilledBoundaries.push(entry.name);
    }
    const bDir = boundaryDir(manifest, entry);
    const agentsPath = join(bDir, "AGENTS.md");
    const agentsMdExisted = existsSync(agentsPath);

    let filled = { does: 0, doesNot: 0, communication: 0 };
    let skipped: string[] = [];
    let contentToCheck: string | null = null;

    if (draft) {
      // Build or read the AGENTS.md content
      let currentContent: string;
      if (agentsMdExisted) {
        currentContent = readFileSync(agentsPath, "utf-8");
      } else {
        // Create from template — pre-filled Key entry point
        const surface = extractSurface(bDir, entry.surface);
        currentContent = generateAgentsTemplate(entry, surface.symbols);
      }

      const { content, skippedSections } = fillAgentsContent(currentContent, draft, force);
      skipped = skippedSections;
      filled = {
        does: skippedSections.includes("Does") ? 0 : draft.does.length,
        doesNot: skippedSections.includes("Does NOT") ? 0 : draft.doesNot.length,
        communication: skippedSections.includes("Communication") ? 0 : draft.communication.length,
      };
      totalFilled += filled.does + filled.doesNot + filled.communication;

      const filledContent = content;
      if (!dryRun) {
        // Ensure dir exists (template path may not have been scaffolded)
        if (!agentsMdExisted) {
          mkdirSync(bDir, { recursive: true });
        }
        writeFileSync(agentsPath, filledContent, "utf-8");
        contentToCheck = null; // check reads from disk
      } else {
        contentToCheck = filledContent;
      }
    }

    // Run check. In dry-run with a draft, pass the would-be filled content
    // as a contentOverride so checkBoundary reports the post-apply state
    // rather than the current on-disk state. Without an override (no draft
    // for this boundary, or non-dry-run where we already wrote to disk),
    // checkBoundary reads from disk as before.
    let checkResult: BoundaryCheckResult;
    if (dryRun && contentToCheck !== null) {
      checkResult = checkBoundary(manifest, entry, contentToCheck);
    } else {
      checkResult = checkBoundary(manifest, entry);
    }

    if (checkResult.passed) totalPassed++;

    boundaryReports.push({
      name: entry.name,
      dir: bDir,
      agentsMdExisted,
      filled,
      skipped,
      passed: checkResult.passed,
      checkResult,
    });
  }

  return {
    manifest,
    dryRun,
    boundaries: boundaryReports,
    totalFilled,
    totalPassed,
    totalFailed: boundaryReports.length - totalPassed,
    unmatchedDraftNames,
    unfilledBoundaries,
  };
}

/**
 * Read and validate the draft JSON file.
 * Throws on parse failure or wrong shape.
 */
function readDraftFile(draftsPath: string): GenerateDraftFile {
  const parsed = readJsonFile(draftsPath, "applyGeneratedDrafts");

  if (!parsed || typeof parsed !== "object") {
    throw new Error(
      `applyGeneratedDrafts: expected a JSON object at ${draftsPath}, got ${typeof parsed}`,
    );
  }

  const obj = parsed as Record<string, unknown>;
  if (!Array.isArray(obj.boundaries)) {
    throw new Error(
      `applyGeneratedDrafts: expected a 'boundaries' array at ${draftsPath}`,
    );
  }

  const boundaries: BoundaryDraft[] = [];
  for (let i = 0; i < obj.boundaries.length; i++) {
    const item = obj.boundaries[i] as Record<string, unknown> | null;
    if (!item || typeof item !== "object") continue;

    const name = typeof item.name === "string" ? item.name : "";
    if (name.length === 0) continue;

    const does = toStringArray(item.does);
    const doesNot = toStringArray(item.doesNot);
    const communication = toStringArray(item.communication);

    boundaries.push({ name, does, doesNot, communication });
  }

  return { boundaries };
}

/**
 * Coerce an unknown value into a string array (empty if not an array of strings).
 */
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === "string" && v.length > 0) out.push(v);
  }
  return out;
}

/**
 * Fill the Does / Does NOT / Communication sections of an AGENTS.md content
 * string with drafted bullets. Preserves headings and all other sections.
 *
 * The drafted bullets are formatted as `- <text>` markdown list items. The
 * HTML comment placeholders from the template are replaced by the bullets.
 *
 * When `force` is false (the default), a section whose body — stripped of
 * HTML comments — already contains real content is left untouched and its
 * name is added to `skippedSections`. This protects hand-written bullets
 * from being clobbered by a stale draft on re-apply. With `force` true the
 * previous behavior is restored (every section is overwritten).
 *
 * Returns the filled content plus the list of section names that were
 * skipped (for the report).
 */
function fillAgentsContent(
  currentContent: string,
  draft: BoundaryDraft,
  force: boolean,
): { content: string; skippedSections: string[] } {
  const lines = currentContent.split("\n");
  const skippedSections: string[] = [];

  fillSection(lines, "Does", draft.does, force, skippedSections);
  fillSection(lines, "Does NOT", draft.doesNot, force, skippedSections);
  fillSection(lines, "Communication", draft.communication, force, skippedSections);

  return { content: lines.join("\n"), skippedSections };
}

/**
 * Replace a section's body with drafted bullets in-place.
 *
 * Strategy: find the `## <headingName>` line (case-insensitive, partial match
 * — matches "Does NOT" for name "Does NOT", and also matches "Does" as a
 * substring of "Does NOT"; so we use exact match on the heading for the
 * Does NOT case, and for "Does" we require the heading to be exactly "Does"
 * to avoid matching "Does NOT").
 *
 * The section body extends from the line after the heading to the line
 * before the next `## ` heading (or EOF). We replace that body range with
 * the drafted bullets (each as `- <text>`).
 *
 * Protection: when `force` is false and the existing body — stripped of HTML
 * comments — is non-empty (i.e. already has real content), the section is
 * left untouched and `headingName` is pushed onto `skippedSections`. This
 * stops a re-run of `--apply` with a stale draft from destroying
 * hand-written bullets. With `force` true the section is always replaced.
 */
function fillSection(
  lines: string[],
  headingName: string,
  bullets: string[],
  force: boolean,
  skippedSections: string[],
): void {
  // Find the heading line. Match case-insensitively, but for "Does" avoid
  // matching "Does NOT" by requiring exact heading equality.
  let headingIdx = -1;
  const target = headingName.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(.+)$/);
    if (!m) continue;
    const heading = m[1].trim().toLowerCase();
    if (heading === target) {
      headingIdx = i;
      break;
    }
  }
  if (headingIdx === -1) return;

  // Find the next `## ` heading after this one (section body end).
  let bodyEnd = lines.length;
  for (let i = headingIdx + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      bodyEnd = i;
      break;
    }
  }

  // Protection: if the existing body (HTML comments stripped, trimmed) is
  // non-empty, the section already has real content. Skip it unless forced.
  if (!force) {
    const bodySlice = lines.slice(headingIdx + 1, bodyEnd).join("\n");
    const stripped = bodySlice.replace(/<!--[\s\S]*?-->/g, "").trim();
    if (stripped.length > 0) {
      skippedSections.push(headingName);
      return;
    }
  }

  // Build the new body: drafted bullets as `- <text>`, or keep empty if no bullets.
  const newBody: string[] = [];
  for (const b of bullets) {
    const text = b.trim().replace(/^-\s+/, ""); // strip a leading "- " if present
    if (text.length > 0) newBody.push(`- ${text}`);
  }

  // Replace the body range [headingIdx+1, bodyEnd) with the new body.
  // Preserve a single blank line between the heading and the bullets, and
  // a single blank line before the next heading (matches template format).
  const replacement: string[] = [];
  replacement.push(""); // blank line after heading
  for (const b of newBody) replacement.push(b);
  replacement.push(""); // blank line before next heading

  lines.splice(headingIdx + 1, bodyEnd - (headingIdx + 1), ...replacement);
}

/**
 * Strip HTML comments from a section body.
 */
function stripHtmlComments(section: MarkdownSection): string {
  return section.body.replace(/<!--[\s\S]*?-->/g, "");
}