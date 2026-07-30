/**
 * discover command — proposes a boundaries.yaml by scanning the repo.
 *
 * Discovery ≠ decision. The tool proposes a candidate boundary list;
 * the user confirms by editing the generated boundaries.yaml before `init`.
 *
 * v1 supports package-based discovery (monorepo with package.json per package).
 * Dir-based discovery (src/<module> without package.json) is parked — needs
 * heuristics that are less reliable than the package.json signal.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, basename, sep } from "node:path";
import { extractSurface } from "./surface.ts";
import type { Manifest } from "./manifest.ts";

export interface DiscoveredBoundary {
  dir: string;
  name: string;
  purpose: string;
  surface: string[];
  symbolCount: number;
}

export interface DiscoverResult {
  repoRoot: string;
  boundaries: DiscoveredBoundary[];
  /** Dirs that had a package.json but no findable entry file. */
  skippedNoEntry: string[];
  /** Dirs that had a package.json but zero exports. */
  skippedEmpty: string[];
}

/**
 * Discover candidate boundaries by scanning for package.json files.
 * Proposes one boundary per package. The user reviews and edits before `init`.
 */
export function discover(repoRoot: string): DiscoverResult {
  const packageDirs = findPackageDirs(repoRoot);
  const boundaries: DiscoveredBoundary[] = [];
  const skippedNoEntry: string[] = [];
  const skippedEmpty: string[] = [];

  for (const pkgDir of packageDirs) {
    // Skip the root package.json — it's the repo, not a boundary
    if (pkgDir === repoRoot) continue;

    const pkgJsonPath = join(pkgDir, "package.json");
    const hasPkgJson = existsSync(pkgJsonPath);
    let pkg: { name?: string; main?: string; exports?: unknown } = {};
    if (hasPkgJson) {
      try {
        pkg = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
      } catch {
        continue;
      }
    }

    // Name: prefer package.json name, fall back to dir name
    const relDir = relative(repoRoot, pkgDir);
    const name = pkg.name ?? basename(pkgDir);

    // Strip @scope/ prefix for the boundary name.
    // String.split() always returns a non-empty array, so .pop() can never
    // return undefined here — the ! assertion is safe-by-construction.
    // The ?? name fallback is defense-in-depth (handles empty/malformed names).
    let cleanName = name.includes("/") ? (name.split("/").pop() ?? name) : name;

    // Disambiguate nested packages that would collide with parent names
    // (e.g. packages/database and packages/database/prisma both named "database")
    const seenNames = new Set(boundaries.map((b) => b.name));
    if (seenNames.has(cleanName)) {
      // Use the last two path segments: "database/prisma" → "database-prisma"
      const segments = relDir.split("/");
      if (segments.length >= 2) {
        cleanName = `${segments[segments.length - 2]}-${segments[segments.length - 1]}`;
      } else {
        cleanName = relDir.replace(/\//g, "-");
      }
    }

    // Entry file: check package.json main/exports, then common defaults,
    // then app-structure dir fallback (returns a dir path ending with `/`).
    const entryFile = findEntryFile(pkgDir, pkg);
    if (!entryFile) {
      skippedNoEntry.push(relDir);
      continue;
    }

    const isAppBoundary = entryFile.endsWith("/");

    // Extract surface (extractSurface handles dir entries as app-mode)
    const surface = extractSurface(pkgDir, [entryFile]);

    // Skip only when the surface produced nothing AND the entry was a file,
    // not a directory. An app-mode directory with only subdirs (no top-level
    // .ts/.tsx files) is a real boundary — its modules live in the subdirs
    // and the user fills the surface manually. Skipping it with "entry file
    // has no exports" is misleading: the dir isn't empty, it's non-recursed.
    // Surface.ts notes unrecursed subdirs in emptyFiles as
    // "dir (has subdirs, not recursed)" — if we see that marker, the entry
    // was a directory, so we keep the boundary.
    const surfaceIsDir = isAppBoundary;
    const hasSubdirNote = surface.emptyFiles.some((f) =>
      f.includes("has subdirs, not recursed"),
    );
    if (
      surface.symbols.length === 0 &&
      surface.missingFiles.length === 0 &&
      !(surfaceIsDir && hasSubdirNote)
    ) {
      skippedEmpty.push(relDir);
      continue;
    }

    const purpose = isAppBoundary
      ? `<!-- app boundary: surface is a dir, not a single entry file --><!-- Fill: one-sentence purpose for ${cleanName} -->`
      : `<!-- Fill: one-sentence purpose for ${cleanName} -->`;

    boundaries.push({
      dir: relDir,
      name: cleanName,
      purpose,
      surface: [entryFile],
      symbolCount: surface.symbols.length,
    });
  }

  return { repoRoot, boundaries, skippedNoEntry, skippedEmpty };
}

/**
 * Generate a boundaries.yaml string from a discover result.
 */
export function generateManifestYaml(result: DiscoverResult): string {
  const lines: string[] = [];
  lines.push("# boundaries.yaml — discovered by `boundary discover`");
  lines.push("# REVIEW AND EDIT before running `boundary init`.");
  lines.push("# Each boundary needs a real one-sentence purpose (replace the <!-- --> comments).");
  lines.push("# Remove boundaries you don't want. Add any the scanner missed.");
  lines.push("");
  lines.push("maxLines: 40");
  lines.push("boundaries:");

  for (const b of result.boundaries) {
    lines.push(`  - dir: ${b.dir}`);
    lines.push(`    name: ${b.name}`);
    lines.push(`    purpose: "${b.purpose}"`);
    lines.push(`    surface:`);
    for (const s of b.surface) {
      lines.push(`      - ${s}`);
    }
  }

  if (result.skippedNoEntry.length > 0 || result.skippedEmpty.length > 0) {
    lines.push("");
    lines.push("# Skipped (review manually):");
    for (const d of result.skippedNoEntry) {
      lines.push(`#   ${d} — no entry file found`);
    }
    for (const d of result.skippedEmpty) {
      lines.push(`#   ${d} — entry file has no exports`);
    }
  }

  return lines.join("\n") + "\n";
}

/**
 * Find all directories containing a package.json (excluding node_modules, dist, .git).
 *
 * Also scans `apps/` for source-bearing dirs without package.json (some app
 * dirs may not ship one). A dir directly under `apps/` is collected if it
 * contains any of: `app/`, `pages/`, `src/app/`, `src/pages/`, `src/`,
 * `modules/`. These are returned alongside package.json dirs.
 */
function findPackageDirs(repoRoot: string): string[] {
  const dirs: string[] = [];
  const seen = new Set<string>();
  const skipDirs = new Set([
    "node_modules", "dist", ".git", ".next", ".turbo", "coverage",
    ".snapberry", ".sst", ".output", ".opencode", ".sst-kit",
    "__tests__", "tests", "test",
  ]);

  function walk(dir: string) {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      let stat;
      try {
        stat = statSync(fullPath);
      } catch {
        continue;
      }
      if (!stat.isDirectory()) continue;
      if (skipDirs.has(entry)) continue;

      // Check if this dir has a package.json
      if (existsSync(join(fullPath, "package.json"))) {
        if (!seen.has(fullPath)) {
          seen.add(fullPath);
          dirs.push(fullPath);
        }
      }

      // Recurse (even if this dir has package.json — nested workspaces)
      walk(fullPath);
    }
  }

  // Check root
  if (existsSync(join(repoRoot, "package.json"))) {
    dirs.push(repoRoot);
  }

  walk(repoRoot);

  // Also scan apps/ for source-bearing dirs without package.json.
  // These are app boundaries whose surface is a directory (app/src/pages).
  const appsDir = join(repoRoot, "apps");
  if (existsSync(appsDir)) {
    try {
      if (statSync(appsDir).isDirectory()) {
        let appEntries: string[];
        try {
          appEntries = readdirSync(appsDir);
        } catch {
          appEntries = [];
        }
        for (const name of appEntries) {
          const appDir = join(appsDir, name);
          let st;
          try {
            st = statSync(appDir);
          } catch {
            continue;
          }
          if (!st.isDirectory()) continue;
          if (skipDirs.has(name)) continue;
          // Skip if it already has a package.json — handled by the walker.
          if (existsSync(join(appDir, "package.json"))) continue;
          // Collect if it has an app-structure dir.
          if (hasAppStructure(appDir)) {
            if (!seen.has(appDir)) {
              seen.add(appDir);
              dirs.push(appDir);
            }
          }
        }
      }
    } catch {
      // ignore stat errors
    }
  }

  return dirs;
}

/**
 * Return true if the dir contains any recognized app-structure subdirectory.
 */
function hasAppStructure(dir: string): boolean {
  for (const candidate of ["app", "pages", "src/app", "src/pages", "src", "modules"]) {
    const p = join(dir, candidate);
    if (existsSync(p)) {
      try {
        if (statSync(p).isDirectory()) return true;
      } catch {
        // ignore
      }
    }
  }
  return false;
}

/**
 * Find the entry file for a package, checking package.json fields then defaults.
 */
function findEntryFile(
  pkgDir: string,
  pkg: { main?: string; exports?: unknown },
): string | null {
  // Check package.json "exports" field (modern)
  if (pkg.exports && typeof pkg.exports === "object") {
    const exportsObj = pkg.exports as Record<string, unknown>;
    // "." is the main export
    const mainExport = exportsObj["."];
    if (typeof mainExport === "string") {
      return normalizeEntry(mainExport, pkgDir);
    }
    if (typeof mainExport === "object" && mainExport !== null) {
      const importVal = (mainExport as Record<string, unknown>).import;
      const defaultVal = (mainExport as Record<string, unknown>).default;
      if (typeof importVal === "string") return normalizeEntry(importVal, pkgDir);
      if (typeof defaultVal === "string") return normalizeEntry(defaultVal, pkgDir);
    }
  }

  // Check package.json "main" field
  if (typeof pkg.main === "string") {
    const normalized = normalizeEntry(pkg.main, pkgDir);
    if (normalized) return normalized;
  }

  // Common defaults
  for (const candidate of ["index.ts", "index.tsx", "index.js", "index.jsx", "src/index.ts", "src/index.tsx"]) {
    if (existsSync(join(pkgDir, candidate))) {
      return candidate;
    }
  }

  // App-structure fallback: the surface is a dir, not a single entry file.
  // Covers Next.js App/Pages Router, Vite, Astro, and feature-module layouts.
  // The returned path ends with `/` so surface.ts treats it as a directory.
  //
  // `app`, `pages`, `src/app`, `src/pages` are strong app signals — applied
  // unconditionally. `src` and `modules` are weak signals — nearly every
  // package has a `src/` dir, so applying them unconditionally misclassifies
  // ordinary libraries as app-mode directory boundaries. They are only
  // applied when the package sits under an `apps/` directory (and only after
  // the common defaults above already failed to find an entry file).
  const underApps = pkgDir.includes(`${sep}apps${sep}`);
  const strongFallbacks = ["app", "pages", "src/app", "src/pages"];
  const weakFallbacks = ["src", "modules"];
  for (const candidate of strongFallbacks) {
    const p = join(pkgDir, candidate);
    if (existsSync(p)) {
      try {
        if (statSync(p).isDirectory()) return `${candidate}/`;
      } catch {
        // ignore
      }
    }
  }
  if (underApps) {
    for (const candidate of weakFallbacks) {
      const p = join(pkgDir, candidate);
      if (existsSync(p)) {
        try {
          if (statSync(p).isDirectory()) return `${candidate}/`;
        } catch {
          // ignore
        }
      }
    }
  }

  return null;
}

/**
 * Normalize an entry path from package.json exports/main.
 * - Strip leading `./`
 * - Strip file extension
 * - Reject any path containing `..` segments (path escape / traversal)
 * - Verify the file exists on disk (try common extensions)
 *
 * A malicious package.json in a scanned dir could set `main` or `exports`
 * to `../../etc/passwd`. We silently skip such entries (return null) rather
 * than throwing — discover is a proposal pass, not an enforcement point,
 * and a bogus package.json shouldn't crash the command. The boundary simply
 * won't be proposed.
 */
function normalizeEntry(path: string, pkgDir: string): string | null {
  let clean = path.replace(/^\.\//, "");
  clean = stripExtension(clean);

  // Reject any path containing a `..` segment. Split on both `/` and `\`
  // so Windows-style separators can't bypass the check.
  if (clean.split(/[\/\\]/).includes("..")) {
    return null;
  }

  // Try the path as-is, then with common extensions
  for (const ext of ["", ".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs"]) {
    if (existsSync(join(pkgDir, clean + ext))) {
      return clean + ext;
    }
  }

  return null;
}

function stripExtension(path: string): string {
  return path.replace(/\.(ts|tsx|js|jsx|mts|mjs)$/, "");
}