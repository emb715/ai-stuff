/**
 * Report printers — pure output formatters for each command's report struct.
 *
 * Each function takes a report struct (or violations list) and writes the
 * human-readable report to the console. Moved out of cli.ts so the CLI
 * module stays focused on arg parsing and command routing.
 */

import type { InitReport } from "./init.ts";
import type { CheckResult } from "./check.ts";
import type { LintViolation } from "./lint-phase1.ts";
import type { LintResult } from "./llm-lint.ts";
import type { DiscoverResult } from "./discover.ts";
import type { GenerateReport } from "./generate.ts";

export function printInitReport(report: InitReport): void {
  console.log(`\n═══ boundary init — ${report.boundaries.length} boundaries ═══\n`);

  for (const b of report.boundaries) {
    const status = b.agentsMdExists ? "exists" : "not created";
    const passStatus = b.agentsMdExists
      ? b.wouldPass
        ? "✓ would pass"
        : "✗ would fail"
      : "— (no contract yet)";

    console.log(`┌─ ${b.name} (${b.dir})`);
    console.log(`│  AGENTS.md: ${status}`);
    console.log(`│  Check: ${passStatus}`);
    console.log(`│  Surface (${b.surface.extractedSymbols.length} symbols from ${b.surface.entryFiles.length} files):`);

    if (b.surface.missingFiles.length > 0) {
      console.log(`│  ⚠ Missing entry files: ${b.surface.missingFiles.join(", ")}`);
    }
    if (b.surface.emptyFiles.length > 0) {
      console.log(`│  ⚠ Entry files with no exports: ${b.surface.emptyFiles.join(", ")}`);
    }

    // Print first 10 symbols, then count
    const syms = b.surface.extractedSymbols;
    if (syms.length <= 10) {
      for (const s of syms) console.log(`│    ${s}`);
    } else {
      for (let i = 0; i < 8; i++) console.log(`│    ${syms[i]}`);
      console.log(`│    ... ${syms.length - 8} more`);
    }

    console.log(`│  Would create:`);
    for (const c of b.wouldCreate) console.log(`│    ${c}`);

    // Print check failures if any
    if (b.checkResult && !b.checkResult.passed) {
      console.log(`│  Check failures:`);
      for (const a of b.checkResult.assertions) {
        if (a.status === "fail") {
          console.log(`│    ✗ ${a.name}: ${a.message}`);
          if (a.details) {
            for (const d of a.details) console.log(`│      ${d}`);
          }
        }
      }
    }

    console.log(`└─\n`);
  }

  console.log("--- Module map (docs/boundaries.md) ---");
  console.log(report.mapContents);
}

export function printCheckResult(result: CheckResult): void {
  console.log(`\n═══ boundary check — ${result.boundaryResults.length} boundaries ═══\n`);

  for (const b of result.boundaryResults) {
    const symbol = b.passed ? "✓" : "✗";
    console.log(`${symbol} ${b.boundaryName} (${b.boundaryDir})`);

    if (!b.agentsMdExists) {
      console.log(`    ✗ No AGENTS.md found. Run 'boundary init --write' to scaffold.`);
      console.log("");
      continue;
    }

    for (const a of b.assertions) {
      const sym = a.status === "pass" ? "✓" : a.status === "fail" ? "✗" : "—";
      console.log(`    ${sym} ${a.name}: ${a.message}`);
      if (a.details) {
        for (const d of a.details) console.log(`        ${d}`);
      }
    }
    console.log("");
  }

  console.log(`Total: ${result.totalPassed} passed, ${result.totalFailed} failed`);
}

export function printLintResult(violations: LintViolation[]): void {
  if (violations.length === 0) {
    console.log("✓ No mechanism leakage detected in Communication sections.");
    return;
  }

  console.log(`\n═══ boundary lint — ${violations.length} violations ═══\n`);

  for (const v of violations) {
    console.log(`✗ ${v.boundary}: ${v.rule} — ${v.match}`);
    console.log(`    ${v.line}`);
  }
}

export function printLintPhase2Result(result: LintResult): void {
  console.log(
    `\n═══ boundary lint (Phase 2) — ${result.failed} violations of ${result.total} classified ═══\n`,
  );

  if (result.violations.length === 0) {
    console.log("✓ No mechanism-classified lines detected by the LLM.");
    return;
  }

  for (const v of result.violations) {
    console.log(`✗ ${v.boundary}: mechanism`);
    console.log(`    ${v.lineText}`);
    if (v.reason) console.log(`    reason: ${v.reason}`);
  }

  console.log(
    `\nTotal: ${result.passed} obligation, ${result.failed} mechanism, ${result.total} classified.`,
  );

  if (result.skippedOutOfRange > 0) {
    console.log(
      `⚠ ${result.skippedOutOfRange} classifications skipped: line numbers out of range (re-run --emit-prompt to refresh)`,
    );
  }
}

export function printDiscoverResult(result: DiscoverResult): void {
  console.log(`\n═══ boundary discover — ${result.boundaries.length} boundaries found ═══\n`);

  for (const b of result.boundaries) {
    console.log(`┌─ ${b.name} (${b.dir})`);
    console.log(`│  Entry: ${b.surface.join(", ")}`);
    console.log(`│  Symbols: ${b.symbolCount}`);
    console.log(`└─\n`);
  }

  if (result.skippedNoEntry.length > 0) {
    console.log("Skipped (no entry file found):");
    for (const d of result.skippedNoEntry) console.log(`  ${d}`);
    console.log("");
  }
  if (result.skippedEmpty.length > 0) {
    console.log("Skipped (entry file has no exports):");
    for (const d of result.skippedEmpty) console.log(`  ${d}`);
    console.log("");
  }
}

export function printGenerateReport(report: GenerateReport): void {
  const mode = report.dryRun ? "DRY RUN" : "APPLIED";
  console.log(
    `\n═══ boundary generate (${mode}) — ${report.boundaries.length} boundaries ═══\n`,
  );

  for (const b of report.boundaries) {
    const status = b.agentsMdExisted ? "updated" : "created";
    const pass = b.passed ? "✓ pass" : "✗ fail";
    console.log(`┌─ ${b.name} (${b.dir})`);
    console.log(`│  AGENTS.md: ${status}`);
    console.log(
      `│  Filled: Does=${b.filled.does}, Does NOT=${b.filled.doesNot}, Communication=${b.filled.communication}`,
    );
    console.log(`│  Check: ${pass}`);
    if (!b.checkResult.passed) {
      for (const a of b.checkResult.assertions) {
        if (a.status === "fail") {
          console.log(`│    ✗ ${a.name}: ${a.message}`);
        }
      }
    }
    console.log(`└─\n`);
  }

  console.log(
    `Total: ${report.totalFilled} bullets filled, ${report.totalPassed} passed, ${report.totalFailed} failed`,
  );

  if (report.unmatchedDraftNames.length > 0) {
    console.log(
      `⚠ Unmatched draft names (not in manifest): ${report.unmatchedDraftNames.join(", ")}`,
    );
  }
  if (report.unfilledBoundaries.length > 0) {
    console.log(
      `⚠ Unfilled boundaries (not in draft): ${report.unfilledBoundaries.join(", ")}`,
    );
  }
}