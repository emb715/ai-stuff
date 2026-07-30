/**
 * Adversarial tests for surface.ts — directory surface handling ("app mode"),
 * barrel re-export chasing, and named export parsing edge cases.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, rmSync as rm } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extractSurface, extractExports } from "../surface.ts";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "boundary-surface-"));
}

function writeFile(root: string, rel: string, content: string): void {
  const parts = rel.split("/");
  const dirs = parts.slice(0, -1);
  let acc = root;
  for (const d of dirs) {
    acc = join(acc, d);
    mkdirSync(acc, { recursive: true });
  }
  writeFileSync(join(root, rel), content, "utf-8");
}

describe("extractSurface — directory surface (app mode)", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should extract exports from each top-level .ts/.tsx file in a directory surface", () => {
    writeFile(root, "src/foo.ts", "export function foo() {}\n");
    writeFile(root, "src/bar.tsx", "export const bar = 1;\n");
    const result = extractSurface(root, ["src/"]);
    const names = result.symbols.map((s) => s.name).sort();
    expect(names).toEqual(["bar", "foo"]);
    expect(result.symbols.map((s) => s.file).sort()).toEqual(["src/bar.tsx", "src/foo.ts"]);
    expect(result.missingFiles).toEqual([]);
  });

  it("should return empty symbols and note subdirs in emptyFiles when a dir has only subdirs", () => {
    mkdirSync(join(root, "src", "sub"), { recursive: true });
    const result = extractSurface(root, ["src/"]);
    expect(result.symbols).toEqual([]);
    expect(result.missingFiles).toEqual([]);
    // subdirs are noted in emptyFiles as "not recursed"
    expect(result.emptyFiles.some((f) => f.includes("sub") && f.includes("not recursed"))).toBe(true);
  });

  it("should return empty symbols when a directory contains only .js files (app mode reads .ts/.tsx only)", () => {
    writeFile(root, "src/legacy.js", "export function legacy() {}\n");
    const result = extractSurface(root, ["src/"]);
    expect(result.symbols).toEqual([]);
    // .js is neither a .ts/.tsx file nor a subdir, so it is not noted at all
    expect(result.emptyFiles).toEqual([]);
  });

  it("should report a missing directory in missingFiles", () => {
    const result = extractSurface(root, ["does-not-exist/"]);
    expect(result.symbols).toEqual([]);
    expect(result.missingFiles).toEqual(["does-not-exist/"]);
  });

  it("should follow a symlinked file inside a directory surface", () => {
    writeFile(root, "real/foo.ts", "export const real = 1;\n");
    mkdirSync(join(root, "link"), { recursive: true });
    // Symlink link/foo.ts -> real/foo.ts (a file, not a dir).
    symlinkSync(join(root, "real", "foo.ts"), join(root, "link", "foo.ts"), "file");
    // listDirSurface statSyncs the symlink, follows it (statSync follows by
    // default), sees a file with .ts ext → reads it → extracts `real`.
    const result = extractSurface(root, ["link/"]);
    expect(result.symbols.map((s) => s.name)).toEqual(["real"]);
  });

  it("should treat a symlinked directory entry (resolves to a dir) as a dir surface", () => {
    writeFile(root, "real/foo.ts", "export const real = 1;\n");
    // link -> real (directory symlink)
    symlinkSync(join(root, "real"), join(root, "link"), "dir");
    const result = extractSurface(root, ["link/"]);
    expect(result.symbols.map((s) => s.name)).toEqual(["real"]);
  });

  it("should treat an entry that resolves to a directory (no trailing slash) as a dir surface", () => {
    writeFile(root, "src/a.ts", "export const a = 1;\n");
    const result = extractSurface(root, ["src"]);
    expect(result.symbols.map((s) => s.name)).toEqual(["a"]);
  });

  it("should report a missing file entry (non-dir) in missingFiles", () => {
    const result = extractSurface(root, ["nope.ts"]);
    expect(result.missingFiles).toEqual(["nope.ts"]);
    expect(result.symbols).toEqual([]);
  });
});

describe("extractExports — barrel re-export chasing", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should chase `export * from './mod'` one hop and include mod's exports", () => {
    writeFile(root, "index.ts", "export * from './mod';\n");
    writeFile(root, "mod.ts", "export function deep() {}\nexport const DEEP = 1;\n");
    const found = extractExports(
      "export * from './mod';\n",
      join(root, "index.ts"),
      new Set(),
      0,
    );
    expect(found.sort()).toEqual(["DEEP", "deep"]);
  });

  it("should NOT chase two hops (max depth 1) when a barrel re-exports another barrel", () => {
    writeFile(root, "a.ts", "export * from './b';\n");
    writeFile(root, "b.ts", "export * from './c';\nexport const B = 1;\n");
    writeFile(root, "c.ts", "export const C = 2;\n");
    const found = extractExports(
      "export * from './a';\n",
      join(root, "root.ts"),
      new Set(),
      0,
    );
    // root (depth 0) chases a (depth 1). At depth 1, the barrel guard
    // `depth < MAX_BARREL_DEPTH` (1 < 1) is false, so a.ts's `export * from
    // './b'` is NOT chased at all — b.ts is never read. Only a.ts's own
    // direct exports (none here) would be included.
    expect(found).toEqual([]);
    expect(found).not.toContain("B");
    expect(found).not.toContain("C");
  });

  it("should not infinite loop on circular barrel re-exports", () => {
    writeFile(root, "a.ts", "export * from './b';\nexport const A = 1;\n");
    writeFile(root, "b.ts", "export * from './a';\nexport const B = 2;\n");
    // Calling on a.ts at depth 0: chases b (depth 1). b re-exports a — a is
    // visited, so the recursion stops. b's own `B` is returned. a's own `A`
    // is returned at the top level. No infinite loop.
    const found = extractExports(
      "export * from './b';\nexport const A = 1;\n",
      join(root, "a.ts"),
      new Set([join(root, "a.ts")]),
      0,
    );
    expect(found).toContain("A");
    expect(found).toContain("B");
    // No exception thrown, no hang — proves cycle guard works.
  });

  it("should NOT chase non-relative (package) imports", () => {
    const found = extractExports(
      "export * from 'some-package';\nexport const local = 1;\n",
      join(root, "index.ts"),
      new Set(),
      0,
    );
    expect(found).toEqual(["local"]);
  });

  it("should skip a barrel target that does not exist on disk", () => {
    const found = extractExports(
      "export * from './missing';\nexport const here = 1;\n",
      join(root, "index.ts"),
      new Set(),
      0,
    );
    expect(found).toEqual(["here"]);
  });
});

describe("extractExports — named export list parsing", () => {
  const fromPath = "/tmp/x.ts";

  it("should extract a single named export", () => {
    expect(extractExports("export { foo };\n", fromPath, new Set(), 0)).toEqual(["foo"]);
  });

  it("should extract multiple comma-separated named exports", () => {
    expect(
      extractExports("export { foo, bar, baz };\n", fromPath, new Set(), 0).sort(),
    ).toEqual(["bar", "baz", "foo"]);
  });

  it("should take the alias for `export { foo as bar }`", () => {
    expect(extractExports("export { foo as bar };\n", fromPath, new Set(), 0)).toEqual(["bar"]);
  });

  it("should strip `type ` prefix and extract Foo from `export { type Foo }`", () => {
    // Regression for the named-export `type Foo` bug. Previously the parser
    // matched `type` as the symbol name.
    expect(extractExports("export { type Foo };\n", fromPath, new Set(), 0)).toEqual(["Foo"]);
    expect(extractExports("export { type Foo };\n", fromPath, new Set(), 0)).not.toContain("type");
  });

  it("should handle mixed `type` and value exports in one list", () => {
    const found = extractExports(
      "export { type Foo, bar, type Baz as Qux };\n",
      fromPath,
      new Set(),
      0,
    ).sort();
    expect(found).toEqual(["Foo", "Qux", "bar"]);
    expect(found).not.toContain("type");
  });

  it("should strip `type ` before alias: `export { type Foo as Bar }` yields Bar", () => {
    expect(extractExports("export { type Foo as Bar };\n", fromPath, new Set(), 0)).toEqual([
      "Bar",
    ]);
  });

  it("should handle empty export list `export {}`", () => {
    expect(extractExports("export {};\n", fromPath, new Set(), 0)).toEqual([]);
  });

  it("should extract named re-exports with `from`", () => {
    expect(
      extractExports("export { foo, bar } from './mod';\n", fromPath, new Set(), 0).sort(),
    ).toEqual(["bar", "foo"]);
  });
});

describe("extractExports — direct export forms", () => {
  const fromPath = "/tmp/x.ts";

  it("should extract export function", () => {
    expect(extractExports("export function foo() {}\n", fromPath, new Set(), 0)).toEqual(["foo"]);
  });

  it("should extract export async function", () => {
    expect(
      extractExports("export async function foo() {}\n", fromPath, new Set(), 0),
    ).toEqual(["foo"]);
  });

  it("should extract export const / let / var / class / interface / type", () => {
    const src = [
      "export const C = 1;",
      "export let L = 2;",
      "export var V = 3;",
      "export class Cls {}",
      "export interface Iface {}",
      "export type T = number;",
    ].join("\n");
    expect(
      extractExports(src, fromPath, new Set(), 0).sort(),
    ).toEqual(["Cls", "Iface", "L", "T", "V", "C"].sort());
  });

  it("should NOT capture `export default` (no stable name)", () => {
    expect(
      extractExports("export default function () {}\n", fromPath, new Set(), 0),
    ).toEqual([]);
  });
});