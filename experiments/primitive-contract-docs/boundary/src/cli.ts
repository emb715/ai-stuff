#!/usr/bin/env node
/**
 * boundary CLI — scaffolder + enforcer for per-module obligation contracts.
 *
 * Commands:
 *   discover [--dry-run|--write]               Scan repo, propose boundaries.yaml
 *   init [--dry-run|--write] [--only <names>]  Scaffold the pattern
 *   check [--dry-run]                           Run enforcement checks
 *   map [--dry-run|--write]                     Regenerate the module map
 *   lint [--dry-run] [--phase 1]                Content-rule enforcer (Phase 1: rule-based)
 *   lint --phase 2 --emit-prompt                Phase 2: emit LLM classification prompt
 *   lint --phase 2 --apply <file>               Phase 2: apply LLM classification JSON
 *   lint --phase 2 --inline                     Phase 2: inline LLM call (not implemented)
 *   generate --emit-prompt                      Draft obligation content: emit LLM prompt
 *   generate --apply <file>                     Draft obligation content: apply JSON, write files
 *   generate --dry-run --apply <file>           Draft obligation content: report only, no writes
 *   install-hook                                Install pre-commit hook
 *   uninstall-hook                              Remove pre-commit hook
 *
 * Default mode is dry-run (report without writing).
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadManifest, type Manifest, ManifestError } from "./manifest.ts";
import { BoundaryError } from "./errors.ts";
import { runCheck } from "./check.ts";
import { initDryRun, initWrite } from "./init.ts";
import { discover, generateManifestYaml } from "./discover.ts";
import { installHook, uninstallHook } from "./hook.ts";
import {
  emitLintPrompt,
  applyLintResults,
  type LintResult,
} from "./llm-lint.ts";
import {
  emitGeneratePrompt,
  applyGeneratedDrafts,
} from "./generate.ts";
import { lintBoundaries } from "./lint-phase1.ts";
import {
  printInitReport,
  printCheckResult,
  printLintResult,
  printLintPhase2Result,
  printDiscoverResult,
  printGenerateReport,
} from "./report.ts";

const USAGE = `Usage: boundary <command> [options]

Commands:
  discover [--dry-run|--write]                Scan repo, propose boundaries.yaml
  init [--dry-run|--write] [--only <names>]   Scaffold the boundary pattern
  check [--dry-run]                            Run enforcement checks against AGENTS.md
  map [--dry-run|--write]                     Regenerate docs/boundaries.md from AGENTS.md files
  lint [--dry-run] [--phase 1]                Content-rule enforcer (Phase 1: rule-based)
  lint --phase 2 --emit-prompt                Phase 2: emit LLM classification prompt
  lint --phase 2 --apply <file>               Phase 2: apply LLM classification JSON
  lint --phase 2 --inline                     Phase 2: inline LLM call (not implemented)
  generate --emit-prompt                     Draft obligation content: emit LLM prompt
  generate --apply <file>                    Draft obligation content: apply JSON, write files
  generate --dry-run --apply <file>          Draft obligation content: report only, no writes
  install-hook                                Install pre-commit hook that runs 'boundary check'
  uninstall-hook                              Remove the boundary check pre-commit hook

Default mode is dry-run (report without writing).

Examples:
  boundary discover --dry-run          # Scan repo, propose boundaries
  boundary discover --write            # Write boundaries.yaml
  boundary init --dry-run              # Analyze, report what would be created
  boundary init --write                # Create files
  boundary check                       # Run enforcement checks
  boundary map --write                 # Write docs/boundaries.md
  boundary lint                        # Check Communication sections for mechanism leakage
  boundary lint --phase 2 --emit-prompt # Phase 2: emit LLM classification prompt
  boundary lint --phase 2 --apply c.json # Phase 2: apply LLM classifications
  boundary generate --emit-prompt         # Emit prompt to draft obligation content
  boundary generate --apply drafts.json   # Apply drafted obligation content
  boundary install-hook                    # Install pre-commit hook
`;

interface ParsedArgs {
  command: string;
  dryRun: boolean | undefined;
  write: boolean;
  only: string[] | null;
  phase: number;
  repoRoot: string;
  emitPrompt: boolean;
  apply: string | null;
  inline: boolean;
  force: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(USAGE);
    process.exit(0);
  }

  const command = args[0];
  let dryRun: boolean | undefined = undefined;
  let write = false;
  let only: string[] | null = null;
  let phase = 1;
  let repoRoot = process.cwd();
  let emitPrompt = false;
  let apply: string | null = null;
  let inline = false;
  let force = false;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--write") write = true;
    else if (arg === "--only") {
      only = (args[i + 1] ?? "").split(",").map((s) => s.trim());
      i++;
    } else if (arg === "--phase") {
      phase = parseInt(args[i + 1] ?? "1", 10);
      i++;
    } else if (arg === "--repo") {
      repoRoot = args[i + 1] ?? process.cwd();
      i++;
    } else if (arg === "--emit-prompt") {
      emitPrompt = true;
    } else if (arg === "--apply") {
      apply = args[i + 1] ?? null;
      i++;
    } else if (arg === "--inline") {
      inline = true;
    } else if (arg === "--force") {
      force = true;
    }
  }

  return { command, dryRun, write, only, phase, repoRoot, emitPrompt, apply, inline, force };
}

function filterManifest(manifest: Manifest, only: string[] | null): Manifest {
  if (!only) return manifest;
  return {
    ...manifest,
    boundaries: manifest.boundaries.filter((b) => only.includes(b.name)),
  };
}

/** Load the manifest and run `fn` with it. On a ManifestError, print and exit. */
function withManifest<T>(args: ParsedArgs, fn: (manifest: Manifest) => T): T {
  let manifest: Manifest;
  try {
    manifest = loadManifest(args.repoRoot);
  } catch (e) {
    if (e instanceof ManifestError) {
      console.error(`✗ ${e.message}`);
      process.exit(1);
    }
    throw e;
  }
  return fn(manifest);
}

// ── Commands ────────────────────────────────────────────────────────────────

function cmdInit(args: ParsedArgs): void {
  withManifest(args, (manifest) => {
    const filtered = filterManifest(manifest, args.only);

    const isDryRun = args.dryRun ?? true;
    if (isDryRun) {
      const report = initDryRun(filtered);
      printInitReport(report);
    } else {
      const report = initWrite(filtered);
      printInitReport(report);
      console.log("\n--- Files written ---");
      for (const b of report.boundaries) {
        console.log(`  ${b.dir}/`);
        for (const f of b.wouldCreate) {
          console.log(`    ${f}`);
        }
      }
      console.log(`  docs/boundaries.md`);
    }
  });
}

function cmdCheck(args: ParsedArgs): void {
  withManifest(args, (manifest) => {
    const filtered = filterManifest(manifest, args.only);
    const result = runCheck(filtered);
    printCheckResult(result);

    if (result.totalFailed > 0) process.exit(1);
  });
}

function cmdMap(args: ParsedArgs): void {
  withManifest(args, (manifest) => {
    const filtered = filterManifest(manifest, args.only);
    const report = initDryRun(filtered);

    const isDryRun = args.dryRun ?? true;
    if (isDryRun) {
      console.log(report.mapContents);
    } else {
      const docsDir = join(manifest.repoRoot, "docs");
      if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
      writeFileSync(join(docsDir, "boundaries.md"), report.mapContents, "utf-8");
      console.log(`✓ Wrote docs/boundaries.md (${report.boundaries.length} boundaries)`);
    }
  });
}

function cmdLint(args: ParsedArgs): void {
  withManifest(args, (manifest) => {
    const filtered = filterManifest(manifest, args.only);

    if (args.phase === 2) {
      cmdLintPhase2(filtered, args);
      return;
    }

    // Phase 1 (default): rule-based
    const violations = lintBoundaries(filtered, args.phase);
    printLintResult(violations);
    if (violations.length > 0) process.exit(1);
  });
}

// ── Lint Phase 2 (LLM-based: emit-prompt / apply / inline) ───────────────────

function cmdLintPhase2(manifest: Manifest, args: ParsedArgs): void {
  // Explicit sub-flags take precedence.
  if (args.inline) {
    // v1 stub — API client deps are not in package.json yet.
    console.log(
      "Inline LLM lint not implemented yet. Use --emit-prompt and --apply.",
    );
    return;
  }

  if (args.apply !== null) {
    let result: LintResult;
    try {
      result = applyLintResults(manifest, args.apply);
    } catch (e) {
      console.error(`✗ ${(e as Error).message}`);
      process.exit(1);
    }
    printLintPhase2Result(result);
    if (result.failed > 0) process.exit(1);
    return;
  }

  if (args.emitPrompt) {
    process.stdout.write(emitLintPrompt(manifest) + "\n");
    return;
  }

  // --phase 2 with no sub-flag: pick a sensible default based on env.
  const hasApiKey =
    process.env.ANTHROPIC_API_KEY !== undefined ||
    process.env.OPENAI_API_KEY !== undefined;

  if (hasApiKey) {
    console.log(
      "LLM API key detected. Use --inline to call the API directly (not implemented in v1), or --emit-prompt to generate a classification prompt.",
    );
  } else {
    // No key and no explicit choice → emit the prompt so the user can run it
    // anywhere. Print a short header so stdout isn't just a bare prompt.
    console.log(
      "No LLM API key detected (ANTHROPIC_API_KEY / OPENAI_API_KEY). Emitting classification prompt — pipe to a file or paste into an LLM, then run --apply with the JSON response.\n",
    );
    process.stdout.write(emitLintPrompt(manifest) + "\n");
  }
}

// ── Generate (draft obligation content: emit-prompt / apply) ─────────────────

function cmdGenerate(args: ParsedArgs): void {
  withManifest(args, (manifest) => {
    // Explicit sub-flags take precedence. generate uses --apply as the write
    // trigger; --dry-run --apply reports without writing.
    if (args.apply !== null) {
      // `generate --apply` defaults to WRITE mode (the user explicitly asked
      // to apply a draft). Only `--dry-run` opts out. parseArgs now leaves
      // dryRun undefined when neither flag is set, so each command picks its
      // own default; here we default to write (false).
      const effectiveDryRun = args.dryRun ?? false;

      let report;
      try {
        report = applyGeneratedDrafts(manifest, args.apply, effectiveDryRun, args.force);
      } catch (e) {
        console.error(`✗ ${(e as Error).message}`);
        process.exit(1);
      }
      printGenerateReport(report);
      if (report.totalFailed > 0 && !effectiveDryRun) process.exit(1);
      return;
    }

    if (args.emitPrompt) {
      process.stdout.write(emitGeneratePrompt(manifest) + "\n");
      return;
    }

    // No sub-flag: emit the prompt (same default as lint phase 2).
    console.log(
      "No action specified. Use --emit-prompt to generate a drafting prompt, or --apply <file> to apply drafted JSON.",
    );
    process.stdout.write(emitGeneratePrompt(manifest) + "\n");
  });
}

// ── Lint (Phase 1: rule-based) ──────────────────────────────────────────────
// lintBoundaries moved to ./lint-phase1.ts.

// ── Report printers ──────────────────────────────────────────────────────────
// print* functions moved to ./report.ts.

// ── Discover ──────────────────────────────────────────────────────────────────

function cmdDiscover(args: ParsedArgs): void {
  const result = discover(args.repoRoot);

  const isDryRun = args.dryRun ?? true;
  if (isDryRun) {
    printDiscoverResult(result);
    console.log("\n--- Proposed boundaries.yaml ---");
    console.log(generateManifestYaml(result));
  } else {
    const yamlContent = generateManifestYaml(result);
    const manifestPath = join(args.repoRoot, "boundaries.yaml");
    if (existsSync(manifestPath)) {
      console.error(`✗ boundaries.yaml already exists at ${manifestPath}`);
      console.error("  Review it first, or delete it and re-run to overwrite.");
      process.exit(1);
    }
    writeFileSync(manifestPath, yamlContent, "utf-8");
    console.log(`✓ Wrote ${manifestPath} (${result.boundaries.length} boundaries proposed)`);
    console.log("  Review and edit the purposes before running 'boundary init'.");
    if (result.skippedNoEntry.length > 0 || result.skippedEmpty.length > 0) {
      console.log("\n  Skipped (see comments in boundaries.yaml).");
    }
  }
}

// printDiscoverResult moved to ./report.ts.

// ── Hook ────────────────────────────────────────────────────────────────────

function cmdInstallHook(args: ParsedArgs): void {
  const result = installHook(args.repoRoot);
  console.log(result.message);
  if (result.action === "created") {
    console.log("  The hook runs 'boundary check' before every commit.");
    console.log("  If any boundary fails, the commit is blocked.");
  }
}

function cmdUninstallHook(args: ParsedArgs): void {
  const result = uninstallHook(args.repoRoot);
  console.log(result.message);
}

// ── Main ────────────────────────────────────────────────────────────────────

const args = parseArgs(process.argv);

switch (args.command) {
  case "discover":
    cmdDiscover(args);
    break;
  case "init":
    cmdInit(args);
    break;
  case "check":
    cmdCheck(args);
    break;
  case "map":
    cmdMap(args);
    break;
  case "lint":
    cmdLint(args);
    break;
  case "generate":
    cmdGenerate(args);
    break;
  case "install-hook":
    cmdInstallHook(args);
    break;
  case "uninstall-hook":
    cmdUninstallHook(args);
    break;
  default:
    console.error(`Unknown command: ${args.command}`);
    console.log(USAGE);
    process.exit(1);
}