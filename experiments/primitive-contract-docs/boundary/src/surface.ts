/**
 * Surface extractor — reads a boundary's entry files and extracts exported symbols.
 *
 * Follows barrel re-exports (`export * from "./mod"`) one hop deep.
 * Direct exports + named re-exports are extracted in full.
 *
 * Limitation: only follows relative paths (`./` or `../`), not package imports.
 * A barrel that re-exports from a package (`export * from "foo"`) is not chased.
 *
 * Cycles: tracked to prevent infinite recursion on `export * from "./a"` ↔ `export * from "./b"`.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";

export interface SurfaceSymbol {
  /** Symbol name as it appears in `export function X` / `export const X` / etc. */
  name: string;
  /** The file (relative to boundary dir) where the export was found. */
  file: string;
}

export interface ExtractedSurface {
  boundaryDir: string;
  entryFiles: string[];
  symbols: SurfaceSymbol[];
  /** Files that were read but had no exports (still valid, just empty). */
  emptyFiles: string[];
  /** Files declared in surface but not found on disk. */
  missingFiles: string[];
}

/** Max depth for barrel re-export chasing. 1 hop covers the common case. */
const MAX_BARREL_DEPTH = 1;

/**
 * Return true if the entry is a directory surface — either it ends with `/`
 * or it resolves to a directory on disk (relative to the boundary dir).
 *
 * App-mode surfaces (e.g. `src/`, `app/`, `pages/`) are directories: the
 * surface is the collection of top-level TS files in the dir, not a single
 * entry file.
 */
function isDirSurface(boundaryPath: string, entry: string): boolean {
  if (entry.endsWith("/")) return true;
  const full = join(boundaryPath, entry);
  try {
    return statSync(full).isDirectory();
  } catch {
    return false;
  }
}

/**
 * List top-level `.ts`/`.tsx` files in a directory (non-recursive).
 * Subdirectories are returned in a separate list so the caller can note
 * them as "has subdirs, not recursed" — the user must add them manually
 * if they want their exports on the surface.
 */
function listDirSurface(dirAbs: string): { files: string[]; subdirs: string[] } {
  const files: string[] = [];
  const subdirs: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dirAbs);
  } catch {
    return { files, subdirs };
  }
  for (const entry of entries) {
    const full = join(dirAbs, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      subdirs.push(entry);
    } else if (st.isFile()) {
      const ext = extname(entry);
      if (ext === ".ts" || ext === ".tsx") {
        files.push(entry);
      }
    }
  }
  return { files, subdirs };
}

/**
 * Extract exported symbols from a boundary's surface entry files.
 * Entry files are relative to the boundary directory.
 *
 * An entry may be a directory (ends with `/` or resolves to a dir). In that
 * case the surface is the set of top-level `.ts`/`.tsx` files in the dir —
 * "app mode". Subdirectories are not recursed; they are noted in
 * `emptyFiles` as `dir (has subdirs, not recursed)` so the user knows to
 * add them manually if their exports should be on the surface.
 */
export function extractSurface(boundaryPath: string, entryFiles: string[]): ExtractedSurface {
  const symbols: SurfaceSymbol[] = [];
  const emptyFiles: string[] = [];
  const missingFiles: string[] = [];

  for (const entryFile of entryFiles) {
    // Directory surface — app mode: list top-level TS files in the dir.
    if (isDirSurface(boundaryPath, entryFile)) {
      const dirRel = entryFile.replace(/\/$/, "");
      const dirAbs = join(boundaryPath, dirRel);
      if (!existsSync(dirAbs)) {
        missingFiles.push(entryFile);
        continue;
      }
      const { files, subdirs } = listDirSurface(dirAbs);
      for (const f of files) {
        const fileRel = `${dirRel}/${f}`;
        const full = join(dirAbs, f);
        const source = readFileSync(full, "utf-8");
        const found = extractExports(source, full, new Set(), 0);
        if (found.length === 0) {
          emptyFiles.push(fileRel);
        }
        for (const name of found) {
          symbols.push({ name, file: fileRel });
        }
      }
      // Note subdirs without recursing — the user adds them manually.
      for (const sd of subdirs) {
        emptyFiles.push(`${dirRel}/${sd}/ (dir — has subdirs, not recursed)`);
      }
      continue;
    }

    const fullPath = join(boundaryPath, entryFile);

    if (!existsSync(fullPath)) {
      missingFiles.push(entryFile);
      continue;
    }

    const source = readFileSync(fullPath, "utf-8");
    const found = extractExports(source, fullPath, new Set(), 0);

    if (found.length === 0) {
      emptyFiles.push(entryFile);
    }

    for (const name of found) {
      symbols.push({ name, file: entryFile });
    }
  }

  return {
    boundaryDir: boundaryPath,
    entryFiles,
    symbols,
    emptyFiles,
    missingFiles,
  };
}

/**
 * Extract export names from TS/JS source via regex.
 *
 * Catches:
 *   export function foo
 *   export async function foo
 *   export const foo
 *   export let foo
 *   export class Foo
 *   export interface Foo
 *   export type Foo
 *   export { foo, bar }            (re-export / named exports)
 *   export { foo as bar }          (aliased — takes the alias `bar`)
 *   export * from "./mod"          (barrel re-export — chased one hop deep)
 *
 * Does NOT catch:
 *   export default ...            (default export — no stable name)
 *   export * from "package-name"   (package imports — not relative, not chased)
 *   dynamic exports
 */
export function extractExports(
  source: string,
  fromPath: string,
  visited: Set<string>,
  depth: number,
): string[] {
  const names = new Set<string>();

  // Direct exports: `export function|const|let|class|interface|type Name`
  const directRe =
    /^export\s+(?:async\s+)?(?:function|const|let|var|class|interface|type)\s+([A-Za-z_$][\w$]*)/gm;
  let m: RegExpExecArray | null;
  while ((m = directRe.exec(source)) !== null) {
    names.add(m[1]);
  }

  // Named export list: `export { foo, bar as baz }` (with or without `from`)
  const listRe = /^export\s+\{([^}]+)\}\s*(?:from\s+['"]([^'"]+)['"])?\s*;?/gm;
  while ((m = listRe.exec(source)) !== null) {
    const list = m[1];
    // Split by comma, extract the name (alias if `as` is present).
    // Strip a leading `type ` keyword — `export { type Foo }` is a type-only
    // named export; the symbol is `Foo`, not `type`. Also handles
    // `export { type Foo as Bar }` (alias takes `Bar`).
    for (const item of list.split(",")) {
      let trimmed = item.trim();
      if (!trimmed) continue;
      trimmed = trimmed.replace(/^type\s+/i, "");
      if (!trimmed) continue;
      const asMatch = trimmed.match(/^[\w$]+\s+as\s+([\w$]+)/);
      if (asMatch) {
        names.add(asMatch[1]);
      } else {
        const nameMatch = trimmed.match(/^([A-Za-z_$][\w$]*)/);
        if (nameMatch) {
          names.add(nameMatch[1]);
        }
      }
    }
  }

  // Barrel re-exports: `export * from "./mod"` — chase one hop deep
  if (depth < MAX_BARREL_DEPTH) {
    const barrelRe = /^export\s+\*\s+from\s+['"](\.[^'"]+)['"]\s*;?/gm;
    while ((m = barrelRe.exec(source)) !== null) {
      const target = m[1];
      // Only chase relative paths
      if (!target.startsWith(".")) continue;

      // Resolve the target file
      const targetDir = dirname(fromPath);
      const targetBase = join(targetDir, target);
      const targetFile = resolveTsExtension(targetBase);

      // Cycle guard
      if (visited.has(targetFile)) continue;
      const newVisited = new Set(visited);
      newVisited.add(targetFile);

      if (!existsSync(targetFile)) continue;

      const barrelSource = readFileSync(targetFile, "utf-8");
      const barrelExports = extractExports(barrelSource, targetFile, newVisited, depth + 1);
      for (const name of barrelExports) {
        names.add(name);
      }
    }
  }

  return [...names];
}

/**
 * Resolve a base path to a TS/JS file, trying common extensions.
 * If the path already has an extension, return it as-is.
 */
function resolveTsExtension(basePath: string): string {
  if (extname(basePath).length > 0) return basePath;
  for (const ext of [".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs"]) {
    const candidate = basePath + ext;
    if (existsSync(candidate)) return candidate;
  }
  // Fallback to .ts — the caller will check existence
  return basePath + ".ts";
}