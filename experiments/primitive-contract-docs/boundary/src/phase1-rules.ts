/**
 * Phase 1 rule-based mechanism-leakage detection — the single source of truth.
 *
 * Phase 1 catches obvious mechanism leakage via rules: file paths, library
 * versions, numeric counts, param shapes. Phase 2 (LLM-based) catches the
 * lines that pass Phase 1 but still read as mechanism.
 *
 * Both `cli.ts` (lint command) and `llm-lint.ts` (Phase 2 candidate
 * selection) consume this module so the rule set cannot diverge. Previously
 * they maintained separate regex arrays that drifted: cli.ts required
 * backticks around file paths, llm-lint.ts did not. We unify on the stricter
 * version — backticks required — which matches the mechanism-leakage regex
 * in `check.ts`.
 */

export interface Phase1Violation {
  rule: string;
  match: string;
}

interface CompiledRule {
  /** Human-readable rule name, e.g. "mechanism: file path". */
  rule: string;
  /** Compiled regex with the global flag (so exec can iterate). */
  re: RegExp;
}

// Backtick-wrapped file paths with extensions. Matches the mechanism-leakage
// regex in check.ts (which requires backticks). Captures the inner filename
// minus the backticks in group 1 for readability in reports.
const RULES: CompiledRule[] = [
  {
    rule: "mechanism: file path",
    re: /`[a-z][\w/-]*\.(ts|tsx|js|jsx|py|go|rs)`/gi,
  },
  {
    rule: "mechanism: library version",
    re: /\b[\w-]+@\d+\.\d+/g,
  },
  {
    rule: "mechanism: specific count",
    re: /\b\d+\s*(?:x|times|retries?|seconds?|ms|mb|kb|max)\b/gi,
  },
  {
    rule: "mechanism: param shape",
    re: /\{[^}]*:\s*[^}]+\}/g,
  },
];

/**
 * Flag a single (already-trimmed, HTML-comment-stripped) line for Phase 1
 * mechanism leakage. Returns one violation per match — a line can trip
 * multiple rules or the same rule multiple times.
 *
 * Each rule's regex is stateful (global flag); we reset lastIndex before each
 * use so callers may invoke flagLine on reused strings or in any order.
 */
export function flagLine(line: string): Phase1Violation[] {
  const violations: Phase1Violation[] = [];
  for (const { rule, re } of RULES) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      violations.push({ rule, match: m[0] });
    }
  }
  return violations;
}

/**
 * True if the line trips any Phase 1 rule. Cheaper than flagLine when only a
 * boolean is needed (Phase 2 candidate selection uses this to skip lines
 * already caught by the rule-based pass).
 */
export function flaggedByPhase1(line: string): boolean {
  for (const { re } of RULES) {
    re.lastIndex = 0;
    if (re.test(line)) return true;
  }
  return false;
}