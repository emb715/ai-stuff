/**
 * Phase 2 LLM-based lint — emit classification prompt + apply results.
 *
 * Phase 1 (rule-based, regex) catches obvious mechanism leakage: file paths,
 * library versions, numeric counts, param shapes. Phase 2 catches the lines
 * that pass Phase 1 but still read as mechanism — the ones that need judgement.
 *
 * Design: the tool does NOT call an LLM API directly (no anthropic/openai deps).
 * It emits a structured prompt for a human or LLM agent to run anywhere, then
 * reads the returned JSON classification back with --apply.
 */

import { join } from "node:path";
import type { Manifest, BoundaryEntry } from "./manifest.ts";
import { parseAGENTS, getSection } from "./markdown.ts";
import { flaggedByPhase1 } from "./phase1-rules.ts";
import { readJsonFile } from "./json-apply.ts";
import { BoundaryError } from "./errors.ts";

// ── Types ───────────────────────────────────────────────────────────────────

/** A single LLM classification entry, as returned by the agent. */
export interface LLMClassification {
  /** 1-based index into the prompt's "Lines to classify" list. */
  line: number;
  classification: "obligation" | "mechanism" | "ambiguous";
  reason?: string;
}

/** A resolved violation — line text mapped back to its boundary. */
export interface LLMViolation {
  boundary: string;
  lineText: string;
  classification: string;
  reason?: string;
}

/** Aggregate result of applying an LLM classification file. */
export interface LintResult {
  violations: LLMViolation[];
  total: number;
  passed: number;
  failed: number;
  /** Classifications skipped because their line numbers were out of range
   *  (stale classification file — lines added/removed since the prompt was
   *  emitted). Re-run --emit-prompt to refresh. */
  skippedOutOfRange: number;
}

// ── Phase 1 rule set (shared with cli.ts) ──────────────────────────────────
// Phase 1 rules live in ./phase1-rules.ts — the single source of truth. Both
// cli.ts (lint command) and this module import `flaggedByPhase1` from there so
// the rule set cannot diverge. Phase 2 uses it to decide which Communication
// lines already passed the rule-based pass and therefore need LLM judgement.

// ── Internal: extract Communication lines per boundary ─────────────────────

interface BoundaryLine {
  boundary: string;
  /** The trimmed, HTML-comment-stripped line text. */
  text: string;
}

/**
 * Walk every boundary's AGENTS.md, extract the Communication section, strip
 * HTML comments (same as check.ts), and return the non-blank lines that
 * passed Phase 1 rules. These are the candidates for LLM classification.
 */
function extractCommunicationLines(manifest: Manifest): BoundaryLine[] {
  const out: BoundaryLine[] = [];

  for (const entry of manifest.boundaries) {
    const lines = readBoundaryCommunication(manifest, entry);
    for (const text of lines) {
      if (text.length === 0) continue;
      if (flaggedByPhase1(text)) continue; // already caught by rules
      out.push({ boundary: entry.name, text });
    }
  }

  return out;
}

/**
 * Read a single boundary's Communication section and return its non-blank,
 * HTML-comment-stripped lines. Returns [] if no AGENTS.md or no section.
 */
function readBoundaryCommunication(
  manifest: Manifest,
  entry: BoundaryEntry,
): string[] {
  const agentsPath = join(manifest.repoRoot, entry.dir, "AGENTS.md");
  const parsed = parseAGENTS(agentsPath);
  if (!parsed) return [];

  const comm = getSection(parsed, "Communication");
  if (!comm) return [];

  // Strip HTML comments — same approach as check.ts. Comments are template
  // instructions, not obligation content, and must not be classified.
  const stripped = comm.body.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (stripped.length === 0) return [];

  const lines: string[] = [];
  for (const raw of stripped.split("\n")) {
    const trimmed = raw.trim();
    if (trimmed.length === 0) continue;
    lines.push(trimmed);
  }
  return lines;
}

// ── emitLintPrompt ──────────────────────────────────────────────────────────

/**
 * Build the classification prompt. Includes every Communication line that
 * passed Phase 1 rules, numbered, tagged with its boundary name.
 *
 * The prompt is provider-agnostic plain text — paste it into any LLM, or
 * feed it to an agent. The LLM responds with a JSON array of classifications,
 * which --apply then reads back.
 */
export function emitLintPrompt(manifest: Manifest): string {
  const lines = extractCommunicationLines(manifest);

  if (lines.length === 0) {
    return [
      "Classify each line as obligation or mechanism.",
      "",
      "Obligation: what a caller must respect, what the module guarantees, what the module owns. Uses: may, must, must not, owed, owns, guarantees, rejects, never, always. No file paths, no library names, no param shapes, no specific counts.",
      "Mechanism: how the module does it. Specific tools, library names, file paths, param shapes, numeric counts, error codes, implementation detail.",
      "",
      "Lines to classify:",
      "(none — no Communication lines passed Phase 1 and require classification)",
      "",
      'Respond as JSON array: []',
    ].join("\n");
  }

  const promptLines: string[] = [
    "Classify each line as obligation or mechanism.",
    "",
    "Obligation: what a caller must respect, what the module guarantees, what the module owns. Uses: may, must, must not, owed, owns, guarantees, rejects, never, always. No file paths, no library names, no param shapes, no specific counts.",
    "Mechanism: how the module does it. Specific tools, library names, file paths, param shapes, numeric counts, error codes, implementation detail.",
    "",
    "Lines to classify:",
  ];

  for (let i = 0; i < lines.length; i++) {
    const idx = i + 1;
    const { boundary, text } = lines[i];
    // Quote the line text so the LLM sees the exact string. JSON.stringify
    // gives safe, unambiguous quoting with escaping for embedded quotes.
    promptLines.push(`${idx}. [boundary: ${boundary}] ${JSON.stringify(text)}`);
  }

  promptLines.push("");
  promptLines.push(
    'Respond as JSON array: [{"line": 1, "classification": "obligation"}, {"line": 2, "classification": "mechanism", "reason": "mentions Better Auth + Prisma adapter"}]',
  );

  return promptLines.join("\n");
}

// ── applyLintResults ────────────────────────────────────────────────────────

/**
 * Read the JSON classification file produced by an LLM (or human) in response
 * to emitLintPrompt, map line numbers back to boundaries, and report
 * violations (lines classified as "mechanism").
 *
 * Line numbers in the classification file are 1-based indices into the same
 * ordered list emitLintPrompt produced. We rebuild that list here so the
 * mapping is stable regardless of which boundary each line came from.
 *
 * Throws if the file cannot be parsed or is not the expected shape.
 */
export function applyLintResults(manifest: Manifest, resultsPath: string): LintResult {
  const parsed = readJsonFile(resultsPath, "applyLintResults");

  if (!Array.isArray(parsed)) {
    throw new BoundaryError(
      `applyLintResults: expected a JSON array at ${resultsPath}, got ${typeof parsed}`,
      "LINT_ERROR",
    );
  }

  const classifications = normalizeClassifications(parsed as unknown[]);
  const lines = extractCommunicationLines(manifest);

  const violations: LLMViolation[] = [];
  let skippedOutOfRange = 0;
  for (const c of classifications) {
    const idx = c.line - 1;
    const entry = lines[idx];
    if (!entry) {
      // Line number out of range — skip, but do not throw. A stale
      // classification file (lines added/removed since the prompt was
      // emitted) should not crash the apply pass; it just yields fewer
      // matches. Count it so the report can surface the staleness.
      skippedOutOfRange++;
      continue;
    }
    if (c.classification === "mechanism") {
      violations.push({
        boundary: entry.boundary,
        lineText: entry.text,
        classification: c.classification,
        reason: c.reason,
      });
    }
  }

  // `total` = lines that were classified and matched a known line.
  // `failed` = mechanism classifications. `passed` = the rest.
  const matched = classifications.filter((c) => lines[c.line - 1] !== undefined);
  const failed = violations.length;
  const passed = matched.length - failed;

  return {
    violations,
    total: matched.length,
    passed,
    failed,
    skippedOutOfRange,
  };
}

/**
 * Coerce a raw parsed JSON array into LLMClassification[] with validation.
 * Unknown classification strings are normalized to "ambiguous" rather than
 * rejected, so a slightly-off LLM response does not crash the apply pass.
 */
function normalizeClassifications(raw: unknown[]): LLMClassification[] {
  const out: LLMClassification[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i] as Record<string, unknown> | null;
    if (!item || typeof item !== "object") continue;

    const line = typeof item.line === "number" ? item.line : NaN;
    if (!Number.isFinite(line) || line < 1) continue;

    const rawClass = typeof item.classification === "string" ? item.classification : "";
    const classification = (
      rawClass === "obligation" || rawClass === "mechanism" || rawClass === "ambiguous"
        ? rawClass
        : "ambiguous"
    ) as LLMClassification["classification"];

    const reason = typeof item.reason === "string" && item.reason.length > 0 ? item.reason : undefined;

    out.push({ line, classification, reason });
  }
  return out;
}