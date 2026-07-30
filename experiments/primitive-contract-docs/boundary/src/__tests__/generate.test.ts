/**
 * Adversarial tests for generate.ts — emitGeneratePrompt + applyGeneratedDrafts.
 *
 * Coverage targets:
 *   - emitGeneratePrompt: normal entry, directory surface (EISDIR fix via
 *     pickSampleFile), empty surface, missing entry file.
 *   - applyGeneratedDrafts: valid draft fill, unknown boundary name (skip),
 *     missing boundary in draft (report), --dry-run, "Does" vs "Does NOT"
 *     heading collision, boundary with no AGENTS.md (template then fill).
 *
 * fillSection / fillAgentsContent are NOT exported, so the heading-collision
 * case is driven through applyGeneratedDrafts (writes to disk, then we read
 * back the AGENTS.md and assert the sections did not clobber each other).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  emitGeneratePrompt,
  applyGeneratedDrafts,
  type GenerateReport,
} from "../generate.ts";
import type { Manifest, BoundaryEntry } from "../manifest.ts";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "boundary-gen-"));
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

/** Build a minimal manifest in-memory so we don't need boundaries.yaml on disk. */
function buildManifest(
  repoRoot: string,
  entries: Array<Partial<BoundaryEntry> & { dir: string; name: string; surface: string[] }>,
): Manifest {
  return {
    maxLines: 40,
    repoRoot,
    boundaries: entries.map((e) => ({
      dir: e.dir,
      name: e.name,
      purpose: e.purpose ?? "test purpose",
      surface: e.surface,
      maxLines: e.maxLines,
    })),
  };
}

describe("emitGeneratePrompt", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should include surface symbols + source sample for a boundary with a normal entry file", () => {
    writeFile(root, "pkg/index.ts", "export function alpha() {}\nexport const BETA = 1;\n");
    const manifest = buildManifest(root, [
      { dir: "pkg", name: "pkg", surface: ["index.ts"] },
    ]);
    const prompt = emitGeneratePrompt(manifest);
    // Surface symbols listed
    expect(prompt).toContain("Surface symbols (2):");
    expect(prompt).toContain("alpha");
    expect(prompt).toContain("BETA");
    // Source sample included
    expect(prompt).toContain("Source sample (index.ts");
    expect(prompt).toContain("export function alpha()");
    // JSON response template present
    expect(prompt).toContain("Respond as a single JSON object");
  });

  it("should not crash on a directory surface (src/) and use a fallback source file from surface symbols", () => {
    // Regression for EISDIR: declared entry `src/` is a directory; readFileSync
    // on a dir throws EISDIR. pickSampleFile must fall back to a real file.
    writeFile(root, "app/src/foo.ts", "export function real() {}\n");
    const manifest = buildManifest(root, [
      { dir: "app", name: "app", surface: ["src/"] },
    ]);
    // Must not throw.
    const prompt = emitGeneratePrompt(manifest);
    // Surface symbols extracted from the dir
    expect(prompt).toContain("Surface symbols (1):");
    expect(prompt).toContain("real");
    // Source sample came from the fallback file (foo.ts), not from `src/` dir.
    expect(prompt).toContain("Source sample (src/foo.ts");
    expect(prompt).toContain("export function real()");
    // Must NOT contain an EISDIR-related message (the missing-entry branch).
    expect(prompt).not.toContain("not readable");
  });

  it("should emit a prompt with an empty-surface note when the entry file has no exports", () => {
    writeFile(root, "pkg/index.ts", "// no exports here\nconst internal = 1;\n");
    const manifest = buildManifest(root, [
      { dir: "pkg", name: "pkg", surface: ["index.ts"] },
    ]);
    const prompt = emitGeneratePrompt(manifest);
    expect(prompt).toContain("Surface symbols: (none extracted)");
    // Source sample still emitted from the (empty-of-exports) file
    expect(prompt).toContain("Source sample (index.ts");
    expect(prompt).toContain("// no exports here");
  });

  it("should handle a missing entry file gracefully and still emit prompt structure", () => {
    const manifest = buildManifest(root, [
      { dir: "pkg", name: "pkg", surface: ["index.ts"] },
    ]);
    mkdirSync(join(root, "pkg"), { recursive: true });
    // No index.ts written — entry file missing.
    const prompt = emitGeneratePrompt(manifest);
    expect(prompt).toContain("Surface symbols: (none extracted)");
    // pickSampleFile returns undefined for a missing declared entry with no
    // fallback symbols → "(main entry file index.ts not readable)" branch.
    expect(prompt).toContain("Source sample:");
    expect(prompt).toContain("index.ts");
    // Prompt still has the JSON response template
    expect(prompt).toContain("Respond as a single JSON object");
  });

  it("should include existing AGENTS.md sections when one is present", () => {
    writeFile(root, "pkg/index.ts", "export function alpha() {}\n");
    writeFile(
      root,
      "pkg/AGENTS.md",
      [
        "# pkg",
        "**Purpose**: test",
        "## Does",
        "- May serve requests.",
        "",
        "## Does NOT",
        "- Must not persist.",
        "",
        "## Communication",
        "- Callers may poll.",
        "",
        "## Key entry point",
        "- `index.ts` — `alpha`",
        "",
      ].join("\n"),
    );
    const manifest = buildManifest(root, [
      { dir: "pkg", name: "pkg", surface: ["index.ts"] },
    ]);
    const prompt = emitGeneratePrompt(manifest);
    expect(prompt).toContain("Existing AGENTS.md sections:");
    expect(prompt).toContain("May serve requests.");
    expect(prompt).toContain("Must not persist.");
    expect(prompt).toContain("Callers may poll.");
  });

  it("should report existing AGENTS.md as none when absent", () => {
    writeFile(root, "pkg/index.ts", "export function alpha() {}\n");
    const manifest = buildManifest(root, [
      { dir: "pkg", name: "pkg", surface: ["index.ts"] },
    ]);
    const prompt = emitGeneratePrompt(manifest);
    expect(prompt).toContain("Existing AGENTS.md: (none");
  });
});

describe("applyGeneratedDrafts", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  /** Write a passing-shaped AGENTS.md so check doesn't fail on integrity. */
  function writePassingAgents(dir: string, name: string, entry: string, symbol: string): void {
    const agents = [
      `# ${name}`,
      `**Purpose**: test`,
      "## Does",
      "<!-- fill -->",
      "",
      "## Does NOT",
      "<!-- fill -->",
      "",
      "## Communication",
      "<!-- fill -->",
      "",
      "## Key entry point",
      `- \`${entry}\` — \`${symbol}\``,
      "",
      "## To touch this boundary",
      "1. Run `boundary check`.",
      "2. <!-- notes -->",
    ].join("\n");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "AGENTS.md"), agents, "utf-8");
  }

  it("should fill Does/Does NOT/Communication in AGENTS.md for a valid draft with 2 boundaries", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writeFile(root, "b/index.ts", "export function beta() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");
    writePassingAgents(join(root, "b"), "b", "index.ts", "beta");

    const draftPath = join(root, "drafts.json");
    writeFileSync(
      draftPath,
      JSON.stringify(
        {
          boundaries: [
            {
              name: "a",
              does: ["May serve alpha requests."],
              doesNot: ["Must not persist."],
              communication: ["Callers may poll."],
            },
            {
              name: "b",
              does: ["May serve beta requests.", "Must validate input."],
              doesNot: ["Must not call external APIs."],
              communication: ["Callers must retry on transient failure."],
            },
          ],
        },
        null,
        2,
      ),
    );

    const manifest = buildManifest(root, [
      { dir: "a", name: "a", surface: ["index.ts"] },
      { dir: "b", name: "b", surface: ["index.ts"] },
    ]);
    const report: GenerateReport = applyGeneratedDrafts(manifest, draftPath, false);

    expect(report.boundaries).toHaveLength(2);
    expect(report.totalFilled).toBe(7); // 1+1+1 + 2+1+1
    expect(report.boundaries[0].filled).toEqual({ does: 1, doesNot: 1, communication: 1 });
    expect(report.boundaries[1].filled).toEqual({ does: 2, doesNot: 1, communication: 1 });

    // Verify the file on disk for boundary "a" got the drafted content.
    const aAgents = readFileSync(join(root, "a", "AGENTS.md"), "utf-8");
    expect(aAgents).toContain("- May serve alpha requests.");
    expect(aAgents).toContain("- Must not persist.");
    expect(aAgents).toContain("- Callers may poll.");
  });

  it("should skip a draft boundary name not in the manifest with a warning (no crash)", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");

    const draftPath = join(root, "drafts.json");
    writeFileSync(
      draftPath,
      JSON.stringify({
        boundaries: [
          {
            name: "ghost", // not in manifest
            does: ["x"],
            doesNot: [],
            communication: [],
          },
          {
            name: "a",
            does: ["May serve alpha requests."],
            doesNot: ["Must not persist."],
            communication: ["Callers may poll."],
          },
        ],
      }),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a", surface: ["index.ts"] }]);
    const report = applyGeneratedDrafts(manifest, draftPath, false);

    // Only "a" boundary is reported — "ghost" silently skipped (no entry in
    // manifest to report against). No crash.
    expect(report.boundaries).toHaveLength(1);
    expect(report.boundaries[0].name).toBe("a");
    expect(report.totalFilled).toBe(3);
  });

  it("should report a manifest boundary missing from the draft as not filled", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writeFile(root, "b/index.ts", "export function beta() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");
    writePassingAgents(join(root, "b"), "b", "index.ts", "beta");

    // Draft only covers "a"; "b" is missing.
    const draftPath = join(root, "drafts.json");
    writeFileSync(
      draftPath,
      JSON.stringify({
        boundaries: [
          {
            name: "a",
            does: ["May serve alpha requests."],
            doesNot: ["Must not persist."],
            communication: ["Callers may poll."],
          },
        ],
      }),
    );

    const manifest = buildManifest(root, [
      { dir: "a", name: "a", surface: ["index.ts"] },
      { dir: "b", name: "b", surface: ["index.ts"] },
    ]);
    const report = applyGeneratedDrafts(manifest, draftPath, false);

    // Both boundaries reported; "b" filled counts are zero.
    expect(report.boundaries).toHaveLength(2);
    const bReport = report.boundaries.find((r) => r.name === "b")!;
    expect(bReport.filled).toEqual({ does: 0, doesNot: 0, communication: 0 });
    expect(report.totalFilled).toBe(3);
  });

  it("should not write files in --dry-run mode but still report filled counts", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");

    const draftPath = join(root, "drafts.json");
    writeFileSync(
      draftPath,
      JSON.stringify({
        boundaries: [
          {
            name: "a",
            does: ["May serve alpha requests."],
            doesNot: ["Must not persist."],
            communication: ["Callers may poll."],
          },
        ],
      }),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a", surface: ["index.ts"] }]);
    const before = readFileSync(join(root, "a", "AGENTS.md"), "utf-8");
    const report = applyGeneratedDrafts(manifest, draftPath, true /* dryRun */);

    expect(report.dryRun).toBe(true);
    expect(report.boundaries[0].filled).toEqual({ does: 1, doesNot: 1, communication: 1 });
    expect(report.totalFilled).toBe(3);
    // File on disk unchanged.
    const after = readFileSync(join(root, "a", "AGENTS.md"), "utf-8");
    expect(after).toBe(before);
    expect(after).not.toContain("- May serve alpha requests.");
  });

  it("should NOT clobber 'Does NOT' content when filling 'Does' (heading collision regression)", () => {
    // Regression: fillSection matches headings case-insensitively; "Does" is
    // a substring of "Does NOT". The code requires exact heading equality to
    // avoid matching "Does NOT" when filling "Does". If the guard breaks,
    // filling "Does" overwrites the "Does NOT" section.
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");

    const draftPath = join(root, "drafts.json");
    writeFileSync(
      draftPath,
      JSON.stringify({
        boundaries: [
          {
            name: "a",
            does: ["May serve alpha requests.", "Must validate input."],
            doesNot: ["Must not persist.", "Must not call external APIs."],
            communication: ["Callers may poll."],
          },
        ],
      }),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a", surface: ["index.ts"] }]);
    applyGeneratedDrafts(manifest, draftPath, false);

    const filled = readFileSync(join(root, "a", "AGENTS.md"), "utf-8");

    // Both Does and Does NOT sections must contain their own drafted bullets.
    // If the collision regressed, "Does NOT" would contain "Must validate input."
    // (a "Does" bullet) instead of its own content.

    // Slice out the Does section (between "## Does" and "## Does NOT")
    const doesMatch = filled.match(/## Does\n([\s\S]*?)## Does NOT/);
    const doesNotMatch = filled.match(/## Does NOT\n([\s\S]*?)## Communication/);
    expect(doesMatch).not.toBeNull();
    expect(doesNotMatch).not.toBeNull();

    const doesBody = doesMatch![1];
    const doesNotBody = doesNotMatch![1];

    expect(doesBody).toContain("- May serve alpha requests.");
    expect(doesBody).toContain("- Must validate input.");
    // Does section must NOT contain Does NOT bullets
    expect(doesBody).not.toContain("Must not persist.");
    expect(doesBody).not.toContain("Must not call external APIs.");

    expect(doesNotBody).toContain("- Must not persist.");
    expect(doesNotBody).toContain("- Must not call external APIs.");
    // Does NOT section must NOT contain Does bullets
    expect(doesNotBody).not.toContain("Must validate input.");
    expect(doesNotBody).not.toContain("May serve alpha requests.");
  });

  it("should create AGENTS.md from template then fill when no AGENTS.md exists", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    mkdirSync(join(root, "a"), { recursive: true });
    // No AGENTS.md written for "a".

    const draftPath = join(root, "drafts.json");
    writeFileSync(
      draftPath,
      JSON.stringify({
        boundaries: [
          {
            name: "a",
            does: ["May serve alpha requests."],
            doesNot: ["Must not persist."],
            communication: ["Callers may poll."],
          },
        ],
      }),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a", surface: ["index.ts"] }]);
    const report = applyGeneratedDrafts(manifest, draftPath, false);

    expect(report.boundaries[0].agentsMdExisted).toBe(false);
    // After apply, the file exists with drafted content.
    expect(existsSync(join(root, "a", "AGENTS.md"))).toBe(true);
    const created = readFileSync(join(root, "a", "AGENTS.md"), "utf-8");
    expect(created).toContain("- May serve alpha requests.");
    expect(created).toContain("- Must not persist.");
    expect(created).toContain("- Callers may poll.");
    // Template structure preserved: Key entry point pre-filled.
    expect(created).toContain("## Key entry point");
    expect(created).toContain("`index.ts`");
    expect(created).toContain("`alpha`");
  });

  it("should throw a descriptive error on malformed draft JSON", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");

    const draftPath = join(root, "drafts.json");
    writeFileSync(draftPath, "{ this is not valid json ]");

    const manifest = buildManifest(root, [{ dir: "a", name: "a", surface: ["index.ts"] }]);
    expect(() => applyGeneratedDrafts(manifest, draftPath, false)).toThrow(
      /failed to parse JSON/,
    );
  });

  it("should throw when draft JSON is not an object with a boundaries array", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");

    const manifest = buildManifest(root, [{ dir: "a", name: "a", surface: ["index.ts"] }]);

    const notObject = join(root, "drafts1.json");
    writeFileSync(notObject, '"just a string"');
    expect(() => applyGeneratedDrafts(manifest, notObject, false)).toThrow(/expected a JSON object/);

    const noBoundaries = join(root, "drafts2.json");
    writeFileSync(noBoundaries, '{"foo": 1}');
    expect(() => applyGeneratedDrafts(manifest, noBoundaries, false)).toThrow(
      /expected a 'boundaries' array/,
    );
  });

  it("should coerce non-array draft fields to empty (does/doesNot/communication)", () => {
    writeFile(root, "a/index.ts", "export function alpha() {}\n");
    writePassingAgents(join(root, "a"), "a", "index.ts", "alpha");

    const draftPath = join(root, "drafts.json");
    writeFileSync(
      draftPath,
      JSON.stringify({
        boundaries: [
          {
            name: "a",
            does: "not an array", // wrong type → coerced to []
            doesNot: null,
            communication: 42,
          },
        ],
      }),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a", surface: ["index.ts"] }]);
    const report = applyGeneratedDrafts(manifest, draftPath, false);
    expect(report.boundaries[0].filled).toEqual({ does: 0, doesNot: 0, communication: 0 });
    expect(report.totalFilled).toBe(0);
  });
});