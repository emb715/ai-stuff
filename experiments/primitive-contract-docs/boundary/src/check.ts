/**
 * Check engine — asserts the four boundary contracts against AGENTS.md files.
 *
 * Runner-independent. Reads files directly. No test runner invocation.
 *
 * The four assertions:
 *   1. AGENTS.md integrity — exists, non-empty, fits on one screen (≤ maxLines)
 *   2. Communication section — present, non-empty, obligation language, no mechanism leakage
 *   3. Surface containment — every symbol declared in "Key entry point" is exported from the named file
 *   4. ADR status — every referenced ADR exists and is not terminal (superseded/deprecated) without replacement
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseAGENTS, parseAGENTSContent, getSection, type ParsedAGENTS } from "./markdown.ts";
import { extractSurface, extractExports, type ExtractedSurface } from "./surface.ts";
import type { BoundaryEntry, Manifest } from "./manifest.ts";
import { boundaryDir } from "./manifest.ts";

export type AssertionStatus = "pass" | "fail" | "skip";

export interface AssertionResult {
  name: string;
  status: AssertionStatus;
  message: string;
  details?: string[];
}

export interface BoundaryCheckResult {
  boundaryName: string;
  boundaryDir: string;
  agentsMdExists: boolean;
  assertions: AssertionResult[];
  passed: boolean;
}

export interface CheckResult {
  manifest: Manifest;
  boundaryResults: BoundaryCheckResult[];
  totalPassed: number;
  totalFailed: number;
}

/**
 * Run all boundary checks against a manifest. In dry-run mode, reports
 * what would pass/fail. If AGENTS.md doesn't exist yet, reports the
 * pre-validation signal ("would fail: no contract").
 */
export function runCheck(manifest: Manifest): CheckResult {
  const boundaryResults: BoundaryCheckResult[] = [];

  for (const entry of manifest.boundaries) {
    const result = checkBoundary(manifest, entry);
    boundaryResults.push(result);
  }

  const totalPassed = boundaryResults.filter((r) => r.passed).length;
  const totalFailed = boundaryResults.length - totalPassed;

  return { manifest, boundaryResults, totalPassed, totalFailed };
}

/**
 * Check a single boundary against the four contracts.
 *
 * When `contentOverride` is provided, it is parsed as the AGENTS.md content
 * instead of reading from disk. Used by `generate --dry-run --apply` to check
 * the *would-be* filled content rather than the current on-disk state.
 */
export function checkBoundary(
  manifest: Manifest,
  entry: BoundaryEntry,
  contentOverride?: string,
): BoundaryCheckResult {
  const bDir = boundaryDir(manifest, entry);
  const agentsPath = join(bDir, "AGENTS.md");
  const agentsMdExists = existsSync(agentsPath);
  const maxLines = entry.maxLines ?? manifest.maxLines;

  const assertions: AssertionResult[] = [];

  if (!agentsMdExists && contentOverride === undefined) {
    // Pre-validation signal — no contract exists yet
    assertions.push({
      name: "AGENTS.md exists",
      status: "fail",
      message: "No AGENTS.md found. Run `boundary init --write` to scaffold.",
    });
    assertions.push({
      name: "Communication section",
      status: "skip",
      message: "Skipped — no AGENTS.md.",
    });
    assertions.push({
      name: "Surface containment",
      status: "skip",
      message: "Skipped — no AGENTS.md.",
    });
    assertions.push({
      name: "ADR status",
      status: "skip",
      message: "Skipped — no AGENTS.md.",
    });
    return {
      boundaryName: entry.name,
      boundaryDir: bDir,
      agentsMdExists: false,
      assertions,
      passed: false,
    };
  }

  // parseAGENTS returns null only when the file is missing; existence is
  // already verified by agentsMdExists above, so parsed is non-null here.
  // When a content override is provided, parse it directly (no disk read).
  const parsed =
    contentOverride !== undefined ? parseAGENTSContent(contentOverride) : parseAGENTS(agentsPath)!;

  // Assertion 1: AGENTS.md integrity
  assertions.push(checkIntegrity(parsed, maxLines));

  // Assertion 2: Communication section
  assertions.push(checkCommunicationSection(parsed));

  // Assertion 3: Surface containment
  assertions.push(checkSurfaceContainment(bDir, entry, parsed));

  // Assertion 4: ADR status
  assertions.push(checkADRStatus(parsed, bDir));

  const passed = assertions.every((a) => a.status === "pass" || a.status === "skip");

  return {
    boundaryName: entry.name,
    boundaryDir: bDir,
    agentsMdExists: true,
    assertions,
    passed,
  };
}

/**
 * Assertion 1: AGENTS.md integrity — exists, non-empty, fits on one screen.
 */
function checkIntegrity(parsed: ParsedAGENTS, maxLines: number): AssertionResult {
  const details: string[] = [];

  if (parsed.lineCount <= 5) {
    details.push(`Too short: ${parsed.lineCount} lines (must be > 5)`);
  }
  if (parsed.lineCount > maxLines) {
    details.push(`Too long: ${parsed.lineCount} lines (must be ≤ ${maxLines})`);
  }

  if (details.length > 0) {
    return {
      name: "AGENTS.md integrity",
      status: "fail",
      message: `Line count check failed (${parsed.lineCount} lines, limit ${maxLines}).`,
      details,
    };
  }

  return {
    name: "AGENTS.md integrity",
    status: "pass",
    message: `${parsed.lineCount} lines (≤ ${maxLines}), non-empty.`,
  };
}

/**
 * Assertion 2: Communication section — present, non-empty, obligation language, no mechanism leakage.
 */
function checkCommunicationSection(parsed: ParsedAGENTS): AssertionResult {
  const comm = getSection(parsed, "Communication");

  if (!comm) {
    return {
      name: "Communication section",
      status: "fail",
      message: "No `## Communication` section found in AGENTS.md.",
    };
  }

  // Strip HTML comments before checking — instructional comments in the
  // template (e.g. "Use: may / must / must not / owed") must not satisfy
  // the obligation-language check on an unfilled template. Comments are
  // instructions, not content, so mechanism leakage in comments is also
  // not flagged.
  const strippedBody = comm.body.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (strippedBody.length === 0) {
    return {
      name: "Communication section",
      status: "fail",
      message: "Communication section is empty (only HTML comments found).",
    };
  }

  const body = strippedBody;
  const details: string[] = [];

  // Obligation language check
  const obligationRe = /\b(may|must\s+not|must|owed)\b/i;
  if (!obligationRe.test(body)) {
    details.push("No obligation language found (expected: may / must / must not / owed).");
  }

  // Mechanism leakage check — no file paths with extensions in the Communication body.
  // The character class includes `/` so path-containing filenames (e.g. `src/foo.ts`)
  // are caught, not just bare filenames (`foo.ts`).
  const mechanismRe = /`[a-z][\w/-]*\.(ts|tsx|js|jsx|py|go|rs)`/i;
  if (mechanismRe.test(body)) {
    const matches = [...body.matchAll(/`([a-z][\w/-]*\.(ts|tsx|js|jsx|py|go|rs))`/gi)];
    details.push(
      `Mechanism leakage: file paths found in Communication — ${matches.map((m) => m[1]).join(", ")}`,
    );
  }

  if (details.length > 0) {
    return {
      name: "Communication section",
      status: "fail",
      message: "Communication section content rule violations.",
      details,
    };
  }

  return {
    name: "Communication section",
    status: "pass",
    message: "Section present, non-empty, obligation language found, no mechanism leakage.",
  };
}

/**
 * Assertion 3: Surface containment — every symbol declared in "Key entry point"
 * is exported from the named file.
 */
function checkSurfaceContainment(
  bDir: string,
  entry: BoundaryEntry,
  parsed: ParsedAGENTS,
): AssertionResult {
  if (parsed.keyEntryPoints.length === 0) {
    return {
      name: "Surface containment",
      status: "fail",
      message: "No `## Key entry point` declarations found, or none parsed.",
    };
  }

  const details: string[] = [];
  let allFound = true;

  for (const decl of parsed.keyEntryPoints) {
    const filePath = join(bDir, decl.file);
    if (!existsSync(filePath)) {
      details.push(`Declared file not found: ${decl.file}`);
      allFound = false;
      continue;
    }

    const source = readFileSync(filePath, "utf-8");
    const exports = extractExports(source, filePath, new Set(), 0);

    for (const symbol of decl.symbols) {
      if (!exports.includes(symbol)) {
        details.push(`${symbol} declared in ${decl.file} but not exported.`);
        allFound = false;
      }
    }
  }

  if (!allFound) {
    return {
      name: "Surface containment",
      status: "fail",
      message: "Declared surface does not match code.",
      details,
    };
  }

  const totalSymbols = parsed.keyEntryPoints.reduce((sum, d) => sum + d.symbols.length, 0);
  return {
    name: "Surface containment",
    status: "pass",
    message: `All ${totalSymbols} declared symbols exported from ${parsed.keyEntryPoints.length} files.`,
  };
}

/**
 * Assertion 4: ADR status — every referenced ADR exists and is not terminal without replacement.
 */
function checkADRStatus(parsed: ParsedAGENTS, bDir: string): AssertionResult {
  if (parsed.adrRefs.length === 0) {
    return {
      name: "ADR status",
      status: "pass",
      message: "No ADRs referenced (section may be omitted).",
    };
  }

  const details: string[] = [];
  let allOk = true;

  for (const ref of parsed.adrRefs) {
    const adrPath = join(bDir, ref.path);
    if (!existsSync(adrPath)) {
      details.push(`Referenced ADR not found: ${ref.path}`);
      allOk = false;
      continue;
    }

    const adrContent = readFileSync(adrPath, "utf-8");
    const statusMatch = adrContent.match(/\*\*Status:\*\*\s*(.+)/);
    const status = statusMatch?.[1]?.trim() ?? "";

    if (status.startsWith("superseded") || status === "deprecated") {
      // Check if a replacement is referenced
      if (!/superseded by/i.test(status)) {
        details.push(`${ref.label} (${ref.path}) is ${status} — no replacement referenced.`);
        allOk = false;
      }
    }
  }

  if (!allOk) {
    return {
      name: "ADR status",
      status: "fail",
      message: "ADR reference issues found.",
      details,
    };
  }

  return {
    name: "ADR status",
    status: "pass",
    message: `All ${parsed.adrRefs.length} ADR references resolve and are active.`,
  };
}