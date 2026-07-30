/**
 * Adversarial tests for discover.ts — app-mode subdir skip override (P1 fix).
 *
 * The P1 fix changed skip logic so an app-mode dir whose `src/` contains
 * ONLY subdirs (no top-level .ts files) is PROPOSED as a boundary, not
 * skipped with "entry file has no exports". A non-app dir with `src/` and
 * no entry file still goes to skippedNoEntry (not app-mode).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discover } from "../discover.ts";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "boundary-discover-"));
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

describe("discover — app-mode subdir skip override", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should PROPOSE a dir under apps/ with src/ containing only subdirs (no top-level .ts files)", () => {
    // apps/web/src/components/Button.tsx lives in a subdir; no .ts file at
    // apps/web/src/ top level. Before the P1 fix this was skipped as "entry
    // file has no exports" — now it's proposed because the surface is a dir.
    writeFile(root, "apps/web/src/components/Button.tsx", "export function Button() {}\n");
    // A package.json at root so the walker has something to start from
    // (root is skipped as a boundary; apps/web has no package.json → app scan).
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root" }));

    const result = discover(root);

    // apps/web must be proposed, not skipped.
    const webBoundary = result.boundaries.find((b) => b.dir === "apps/web");
    expect(webBoundary).toBeDefined();
    expect(webBoundary!.surface).toEqual(["src/"]);
    // symbolCount is 0 (top-level src/ has no .ts files), but it's still
    // proposed — the user fills the surface manually.
    expect(webBoundary!.symbolCount).toBe(0);
    // Not in skipped lists.
    expect(result.skippedEmpty).not.toContain("apps/web");
    expect(result.skippedNoEntry).not.toContain("apps/web");
  });

  it("should put a dir NOT under apps/ with src/ but no entry file in skippedNoEntry (not app-mode)", () => {
    // packages/foo has a package.json and a src/ dir with only subdirs, no
    // index.ts. Weak fallbacks (src/, modules/) only apply under apps/, so
    // findEntryFile returns null → skippedNoEntry.
    writeFile(root, "packages/foo/package.json", JSON.stringify({ name: "foo" }));
    writeFile(root, "packages/foo/src/lib/util.ts", "export function util() {}\n");
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root" }));

    const result = discover(root);

    // packages/foo proposed? No — it should be in skippedNoEntry because
    // `src/` weak fallback is gated on underApps.
    const fooBoundary = result.boundaries.find((b) => b.dir === "packages/foo");
    expect(fooBoundary).toBeUndefined();
    expect(result.skippedNoEntry).toContain("packages/foo");
  });

  it("should PROPOSE a dir under apps/ with src/ containing .ts files (extracts symbols)", () => {
    writeFile(root, "apps/api/src/handler.ts", "export function handler() {}\n");
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root" }));

    const result = discover(root);

    const apiBoundary = result.boundaries.find((b) => b.dir === "apps/api");
    expect(apiBoundary).toBeDefined();
    expect(apiBoundary!.surface).toEqual(["src/"]);
    expect(apiBoundary!.symbolCount).toBe(1);
    expect(result.skippedEmpty).not.toContain("apps/api");
    expect(result.skippedNoEntry).not.toContain("apps/api");
  });

  it("should propose app dirs with strong fallbacks (app/, pages/) even outside apps/", () => {
    // Strong fallbacks apply unconditionally (not gated on underApps).
    writeFile(root, "packages/webapp/app/page.tsx", "export function Page() {}\n");
    writeFile(root, "packages/webapp/package.json", JSON.stringify({ name: "webapp" }));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root" }));

    const result = discover(root);

    const b = result.boundaries.find((x) => x.dir === "packages/webapp");
    expect(b).toBeDefined();
    expect(b!.surface).toEqual(["app/"]);
  });

  it("should skip a package with package.json but no exports and no subdir marker as skippedEmpty", () => {
    writeFile(root, "packages/empty/package.json", JSON.stringify({ name: "empty", main: "index.ts" }));
    writeFile(root, "packages/empty/index.ts", "// no exports\n");
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root" }));

    const result = discover(root);

    const b = result.boundaries.find((x) => x.dir === "packages/empty");
    expect(b).toBeUndefined();
    expect(result.skippedEmpty).toContain("packages/empty");
  });

  it("should reject a package.json main field with a path traversal segment (security)", () => {
    // A malicious package.json with main: '../../etc/passwd' must not escape.
    writeFile(
      root,
      "packages/evil/package.json",
      JSON.stringify({ name: "evil", main: "../../etc/passwd" }),
    );
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root" }));

    const result = discover(root);

    const b = result.boundaries.find((x) => x.dir === "packages/evil");
    expect(b).toBeUndefined();
    // normalizeEntry returns null for traversal → skippedNoEntry
    expect(result.skippedNoEntry).toContain("packages/evil");
  });

  it("should skip malformed package.json (not crashing) and not propose it", () => {
    writeFile(root, "packages/broken/package.json", "{ not valid json ]");
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root" }));

    const result = discover(root);

    const b = result.boundaries.find((x) => x.dir === "packages/broken");
    expect(b).toBeUndefined();
    // Malformed JSON → caught, continue. No crash, no proposal.
  });
});