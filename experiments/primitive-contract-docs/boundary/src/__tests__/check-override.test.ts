/**
 * Adversarial tests for checkBoundary's `contentOverride` parameter.
 *
 * contentOverride lets the caller pass would-be AGENTS.md content as a string
 * instead of reading from disk. Added to fix P0-2 (dry-run --apply reported
 * on-disk state, not would-be state). Adversarial focus:
 *   - override works even when NO AGENTS.md exists on disk
 *   - override does NOT silently fall back to disk
 *   - regression guard: without override, "no AGENTS.md" signal is preserved
 *
 * Surface containment still reads the declared entry file from disk — the
 * override only replaces the AGENTS.md read, not the source-file read.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkBoundary, type BoundaryCheckResult } from "../check.ts";
import { type Manifest, type BoundaryEntry } from "../manifest.ts";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "boundary-override-"));
}

function find(result: BoundaryCheckResult, name: string) {
  const a = result.assertions.find((x) => x.name === name);
  if (!a) throw new Error(`assertion ${name} not found`);
  return a;
}

function buildManifest(repoRoot: string, entry: Partial<BoundaryEntry> & { dir: string }): {
  manifest: Manifest;
  entry: BoundaryEntry;
} {
  const e: BoundaryEntry = {
    dir: entry.dir,
    name: entry.name ?? "test-bnd",
    purpose: entry.purpose ?? "test",
    surface: entry.surface ?? ["index.ts"],
    maxLines: entry.maxLines,
  };
  return { manifest: { maxLines: 40, boundaries: [e], repoRoot }, entry: e };
}

/** Write a real surface file with an export so surface containment can pass. */
function writeSurfaceFile(root: string, dir: string, file: string, exportName: string): void {
  const bdir = join(root, dir);
  mkdirSync(bdir, { recursive: true });
  writeFileSync(join(bdir, file), `export function ${exportName}() { return 1; }\n`, "utf-8");
}

describe("checkBoundary — contentOverride", () => {
  let root: string;
  const dir = "bnd";
  const entryFile = "index.ts";
  const entrySymbol = "foo";

  beforeEach(() => {
    root = makeTempRoot();
    // Create the boundary dir + a real surface export so surface containment
    // can pass when the override content declares it.
    writeSurfaceFile(root, dir, entryFile, entrySymbol);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should PASS all four assertions when contentOverride has valid obligations (no AGENTS.md on disk)", () => {
    const validContent = `# test
**One-line purpose:** test

## Does
- Makes things safe

## Does NOT
- Own domain logic

## Communication
- Callers may use this and trust protection
- Callers must not bypass

## Key entry point
- \`${entryFile}\` — \`${entrySymbol}\`

## To touch this boundary
1. Run check
`;
    // Adversarial: confirm NO AGENTS.md exists on disk — the override must
    // work purely from the string.
    expect(existsSync(join(root, dir, "AGENTS.md"))).toBe(false);

    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry, validContent);

    // Override must report the file as "present" (it is checking would-be content).
    expect(result.agentsMdExists).toBe(true);
    expect(result.passed).toBe(true);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("pass");
    const surf = find(result, "Surface containment");
    expect(surf.status).toBe("pass");
    const integ = find(result, "AGENTS.md integrity");
    expect(integ.status).toBe("pass");
    const adr = find(result, "ADR status");
    expect(adr.status).toBe("pass");
  });

  it("should FAIL on Communication when contentOverride has only an HTML comment in that section", () => {
    const content = `# test
**One-line purpose:** test

## Does
- Makes things safe

## Does NOT
- Own domain logic

## Communication
<!-- obligation language goes here -->

## Key entry point
- \`${entryFile}\` — \`${entrySymbol}\`

## To touch this boundary
1. Run check
`;
    expect(existsSync(join(root, dir, "AGENTS.md"))).toBe(false);

    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry, content);

    const comm = find(result, "Communication section");
    expect(comm.status).toBe("fail");
    expect(comm.message.toLowerCase()).toContain("empty");
    expect(comm.message.toLowerCase()).toContain("comment");
    expect(result.passed).toBe(false);
  });

  it("should FAIL on Communication when contentOverride leaks a file path (mechanism leakage)", () => {
    const content = `# test
**One-line purpose:** test

## Does
- Makes things safe

## Does NOT
- Own domain logic

## Communication
- Callers must call \`foo.ts\` directly

## Key entry point
- \`${entryFile}\` — \`${entrySymbol}\`

## To touch this boundary
1. Run check
`;
    expect(existsSync(join(root, dir, "AGENTS.md"))).toBe(false);

    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry, content);

    const comm = find(result, "Communication section");
    expect(comm.status).toBe("fail");
    const leakage = (comm.details ?? []).find((d) => d.toLowerCase().includes("leakage"));
    expect(leakage).toBeDefined();
    expect(leakage).toContain("foo.ts");
    expect(result.passed).toBe(false);
  });

  it("should use contentOverride and NOT report 'no AGENTS.md found' when no AGENTS.md exists on disk", () => {
    // Minimal valid-ish content — enough to get past the "no AGENTS.md" early
    // return path and into the parsed-content assertions.
    const content = `# test
**One-line purpose:** test

## Does
- x

## Does NOT
- y

## Communication
- Callers may use this.

## Key entry point
- \`${entryFile}\` — \`${entrySymbol}\`

## To touch this boundary
1. Run check
`;
    expect(existsSync(join(root, dir, "AGENTS.md"))).toBe(false);

    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry, content);

    // The key adversarial assertion: with an override, the "AGENTS.md exists"
    // pre-validation signal must NOT fire even though the file is absent.
    const noAgents = result.assertions.find((a) => a.name === "AGENTS.md exists");
    expect(noAgents).toBeUndefined();
    // And the skip-family ("Skipped — no AGENTS.md.") assertions must NOT appear.
    const skipped = result.assertions.find((a) =>
      a.message?.toLowerCase().includes("no agents.md"),
    );
    expect(skipped).toBeUndefined();
    // Override is treated as if the file exists.
    expect(result.agentsMdExists).toBe(true);
  });

  it("should report 'No AGENTS.md found' when contentOverride is absent and no AGENTS.md exists on disk (regression guard)", () => {
    expect(existsSync(join(root, dir, "AGENTS.md"))).toBe(false);

    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);

    expect(result.agentsMdExists).toBe(false);
    expect(result.passed).toBe(false);
    const exists = result.assertions.find((a) => a.name === "AGENTS.md exists");
    expect(exists).toBeDefined();
    expect(exists?.status).toBe("fail");
    expect(exists?.message).toContain("No AGENTS.md found");
    // The other three must be skipped, not run.
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("skip");
    const surf = find(result, "Surface containment");
    expect(surf.status).toBe("skip");
    const adr = find(result, "ADR status");
    expect(adr.status).toBe("skip");
  });
});