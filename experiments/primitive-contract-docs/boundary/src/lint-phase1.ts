/**
 * Phase 1 lint — rule-based mechanism-leakage detector.
 *
 * Walks each boundary's AGENTS.md Communication section and flags lines
 * that match the Phase 1 rule set (file paths, library versions, param
 * shapes, numeric counts). The rules themselves live in ./phase1-rules.ts
 * and are shared with llm-lint.ts so the rule set cannot diverge.
 */

import { join } from "node:path";
import type { Manifest } from "./manifest.ts";
import { parseAGENTS, getSection } from "./markdown.ts";
import { flagLine } from "./phase1-rules.ts";

export interface LintViolation {
  boundary: string;
  line: string;
  rule: string;
  match: string;
}

export function lintBoundaries(manifest: Manifest, phase: number): LintViolation[] {
  const violations: LintViolation[] = [];

  for (const entry of manifest.boundaries) {
    const agentsPath = join(manifest.repoRoot, entry.dir, "AGENTS.md");
    const parsed = parseAGENTS(agentsPath);
    if (!parsed) continue;

    const comm = getSection(parsed, "Communication");
    if (!comm) continue;

    for (const line of comm.body.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("<!--")) continue;

      // Phase 1 rules live in ./phase1-rules.ts (shared with llm-lint.ts).
      for (const v of flagLine(trimmed)) {
        violations.push({
          boundary: entry.name,
          line: trimmed,
          rule: v.rule,
          match: v.match,
        });
      }
    }
  }

  return violations;
}