/**
 * Adversarial tests for manifest.ts — validation and path traversal (P0).
 *
 * Path traversal: the manifest must reject boundary dirs and surface paths
 * that escape the repo root or the boundary dir. These are the P0 fixes.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadManifest, ManifestError } from "../manifest.ts";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "boundary-manifest-"));
}

function writeManifest(root: string, yaml: string): void {
  writeFileSync(join(root, "boundaries.yaml"), yaml, "utf-8");
}

function makeBoundaryDir(root: string, dir: string): void {
  mkdirSync(join(root, dir), { recursive: true });
  // put a placeholder file so the dir is non-empty
  writeFileSync(join(root, dir, "index.ts"), "export const x = 1;\n", "utf-8");
}

describe("loadManifest — happy path", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should load a legitimate boundaries.yaml", () => {
    makeBoundaryDir(root, "src/api");
    writeFileSync(join(root, "src/api", "foo.ts"), "export const foo = 1;\n", "utf-8");
    writeManifest(
      root,
      [
        "maxLines: 40",
        "boundaries:",
        "  - dir: src/api",
        "    name: api",
        "    purpose: serves requests",
        "    surface:",
        "      - foo.ts",
      ].join("\n"),
    );
    const m = loadManifest(root);
    expect(m.boundaries).toHaveLength(1);
    expect(m.boundaries[0].name).toBe("api");
    expect(m.maxLines).toBe(40);
  });

  it("should default maxLines to 40 when omitted", () => {
    makeBoundaryDir(root, "b");
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: b",
        "    name: b",
        "    purpose: p",
        "    surface:",
        "      - index.ts",
      ].join("\n"),
    );
    expect(loadManifest(root).maxLines).toBe(40);
  });
});

describe("loadManifest — missing / malformed file", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should throw ManifestError when boundaries.yaml is absent", () => {
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw ManifestError when yaml is unparseable", () => {
    writeManifest(root, "  -: : :\n  ::invalid yaml: ][");
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw ManifestError when parsed value is not an object", () => {
    writeManifest(root, "just a string\n");
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw ManifestError when boundaries is not an array", () => {
    makeBoundaryDir(root, "b");
    writeManifest(root, "boundaries: notanarray\n");
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw ManifestError when boundaries array is empty", () => {
    writeManifest(root, "boundaries: []\n");
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });
});

describe("loadManifest — entry field validation", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should throw when dir is missing", () => {
    writeManifest(
      root,
      ["boundaries:", "  - name: x", "    purpose: p", "    surface: [a.ts]"].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw when dir is empty string", () => {
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: ''",
        "    name: x",
        "    purpose: p",
        "    surface: [a.ts]",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw when name is missing", () => {
    makeBoundaryDir(root, "b");
    writeManifest(
      root,
      ["boundaries:", "  - dir: b", "    purpose: p", "    surface: [index.ts]"].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw when purpose is missing", () => {
    makeBoundaryDir(root, "b");
    writeManifest(
      root,
      ["boundaries:", "  - dir: b", "    name: x", "    surface: [index.ts]"].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw when surface is empty array", () => {
    makeBoundaryDir(root, "b");
    writeManifest(
      root,
      ["boundaries:", "  - dir: b", "    name: x", "    purpose: p", "    surface: []"].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw when a surface entry is not a string", () => {
    makeBoundaryDir(root, "b");
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: b",
        "    name: x",
        "    purpose: p",
        "    surface:",
        "      - 123",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should throw when boundary dir does not exist on disk", () => {
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: ghost",
        "    name: x",
        "    purpose: p",
        "    surface: [index.ts]",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });
});

describe("loadManifest — path traversal (P0)", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should reject an absolute dir that escapes repo root (e.g. /etc/passwd)", () => {
    // /etc exists on darwin; the escape check fires before the existence check
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: /etc",
        "    name: x",
        "    purpose: p",
        "    surface: [passwd]",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
    try {
      loadManifest(root);
    } catch (e) {
      expect((e as ManifestError).message.toLowerCase()).toContain("escapes");
    }
  });

  it("should reject a relative dir that escapes repo root (../../../etc)", () => {
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: ../../../etc",
        "    name: x",
        "    purpose: p",
        "    surface: [hosts]",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
    try {
      loadManifest(root);
    } catch (e) {
      expect((e as ManifestError).message.toLowerCase()).toContain("escapes");
    }
  });

  it("should reject a surface path that escapes the boundary dir (../../../etc/passwd)", () => {
    // boundary dir is valid and exists; the surface path escapes it.
    makeBoundaryDir(root, "b");
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: b",
        "    name: x",
        "    purpose: p",
        "    surface:",
        "      - ../../../etc/passwd",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
    try {
      loadManifest(root);
    } catch (e) {
      expect((e as ManifestError).message.toLowerCase()).toContain("escapes");
    }
  });

  it("should reject an absolute surface path that escapes the boundary dir", () => {
    makeBoundaryDir(root, "b");
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: b",
        "    name: x",
        "    purpose: p",
        "    surface:",
        "      - /etc/passwd",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should reject a surface path using .. to reach a sibling outside the boundary dir", () => {
    makeBoundaryDir(root, "b");
    makeBoundaryDir(root, "secret"); // sibling dir outside boundary `b`
    writeFileSync(join(root, "secret", "token.ts"), "export const TOKEN = 'x';\n", "utf-8");
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: b",
        "    name: x",
        "    purpose: p",
        "    surface:",
        "      - ../secret/token.ts",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).toThrow(ManifestError);
  });

  it("should accept a surface path that stays inside the boundary dir", () => {
    makeBoundaryDir(root, "b");
    mkdirSync(join(root, "b", "sub"), { recursive: true });
    writeFileSync(join(root, "b", "sub", "deep.ts"), "export const d = 1;\n", "utf-8");
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: b",
        "    name: x",
        "    purpose: p",
        "    surface:",
        "      - sub/deep.ts",
      ].join("\n"),
    );
    const m = loadManifest(root);
    expect(m.boundaries[0].surface).toEqual(["sub/deep.ts"]);
  });

  it("should accept dir equal to repo root itself (no escape)", () => {
    // dir = '.' resolves to repoRoot; dirAbs === repoRoot passes the escape check
    writeFileSync(join(root, "top.ts"), "export const t = 1;\n", "utf-8");
    writeManifest(
      root,
      [
        "boundaries:",
        "  - dir: .",
        "    name: root",
        "    purpose: whole repo",
        "    surface: [top.ts]",
      ].join("\n"),
    );
    expect(() => loadManifest(root)).not.toThrow();
  });
});