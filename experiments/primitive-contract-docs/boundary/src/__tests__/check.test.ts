/**
 * Adversarial tests for check.ts — focus on the Communication section
 * assertion: HTML comment stripping, obligation language, mechanism leakage.
 *
 * checkCommunicationSection is not exported, so we drive it through
 * checkBoundary + a minimal on-disk manifest + AGENTS.md fixture.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkBoundary, type BoundaryCheckResult } from "../check.ts";
import { loadManifest, type Manifest, type BoundaryEntry } from "../manifest.ts";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "boundary-check-"));
}

function find(result: BoundaryCheckResult, name: string) {
  const a = result.assertions.find((x) => x.name === name);
  if (!a) throw new Error(`assertion ${name} not found`);
  return a;
}

/** Build a minimal manifest in-memory so we don't need boundaries.yaml on disk. */
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
  return {
    manifest: { maxLines: 40, boundaries: [e], repoRoot },
    entry: e,
  };
}

/** Write AGENTS.md into a boundary dir and ensure it has enough lines to pass integrity. */
function writeAgents(root: string, dir: string, content: string): void {
  const bdir = join(root, dir);
  mkdirSync(bdir, { recursive: true });
  // Pad to >5 lines if needed so integrity doesn't fail and mask the Comm result.
  let body = content;
  const lines = body.split("\n").length;
  if (lines <= 5) {
    body = body + "\n" + Array(6 - lines + 1).join("<!-- padding line -->\n");
  }
  writeFileSync(join(bdir, "AGENTS.md"), body, "utf-8");
}

describe("checkBoundary — Communication section", () => {
  let root: string;
  const dir = "bnd";

  beforeEach(() => {
    root = makeTempRoot();
    mkdirSync(join(root, dir), { recursive: true });
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should FAIL when Communication section has only an HTML comment (empty after strip)", () => {
    const agents = [
      "# Test Boundary",
      "**Purpose**: test",
      "## Communication",
      "<!-- Use: may / must / must not / owed -->",
      "",
      "## Key entry point",
      "",
    ].join("\n");
    writeAgents(root, dir, agents);
    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("fail");
    expect(comm.message.toLowerCase()).toContain("empty");
    expect(comm.message.toLowerCase()).toContain("comment");
  });

  it("should PASS when Communication section has real obligation content and no comments", () => {
    const agents = [
      "# Test Boundary",
      "**Purpose**: test",
      "## Communication",
      "Consumers may call exported functions.",
      "You must not import internal helpers.",
      "## Key entry point",
      "",
    ].join("\n");
    writeAgents(root, dir, agents);
    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("pass");
  });

  it("should NOT flag mechanism leakage when a file path appears only inside an HTML comment", () => {
    const agents = [
      "# Test Boundary",
      "**Purpose**: test",
      "## Communication",
      "<!-- example: see `helper.ts` for reference -->",
      "Consumers may use the public API.",
      "## Key entry point",
      "",
    ].join("\n");
    writeAgents(root, dir, agents);
    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("pass");
    // No mechanism leakage detail should mention helper.ts
    const leakage = (comm.details ?? []).find((d) =>
      d.toLowerCase().includes("leakage"),
    );
    expect(leakage).toBeUndefined();
  });

  it("should flag mechanism leakage when a file path appears in real (non-comment) content", () => {
    const agents = [
      "# Test Boundary",
      "**Purpose**: test",
      "## Communication",
      "Consumers must call `helper.ts` directly.",
      "## Key entry point",
      "",
    ].join("\n");
    writeAgents(root, dir, agents);
    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("fail");
    const leakage = (comm.details ?? []).find((d) =>
      d.toLowerCase().includes("leakage"),
    );
    expect(leakage).toBeDefined();
    expect(leakage).toContain("helper.ts");
  });

  it("should FAIL with 'no section found' when there is no Communication section", () => {
    const agents = [
      "# Test Boundary",
      "**Purpose**: test",
      "## Key entry point",
      "",
    ].join("\n");
    writeAgents(root, dir, agents);
    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("fail");
    expect(comm.message.toLowerCase()).toContain("no");
    expect(comm.message.toLowerCase()).toContain("communication");
  });

  it("should FAIL when Communication has content but no obligation language", () => {
    const agents = [
      "# Test Boundary",
      "**Purpose**: test",
      "## Communication",
      "This boundary exposes a public API surface.",
      "It wraps the internal fetch layer.",
      "## Key entry point",
      "",
    ].join("\n");
    writeAgents(root, dir, agents);
    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("fail");
    const obligation = (comm.details ?? []).find((d) =>
      d.toLowerCase().includes("obligation"),
    );
    expect(obligation).toBeDefined();
  });

  it("should strip multiple HTML comments and still detect obligation + block leakage flagging", () => {
    const agents = [
      "# Test Boundary",
      "**Purpose**: test",
      "## Communication",
      "<!-- a comment with `leak.ts` -->",
      "<!-- another comment -->",
      "Agents may request changes via PR.",
      "## Key entry point",
      "",
    ].join("\n");
    writeAgents(root, dir, agents);
    const { manifest, entry } = buildManifest(root, { dir });
    const result = checkBoundary(manifest, entry);
    const comm = find(result, "Communication section");
    expect(comm.status).toBe("pass");
  });
});