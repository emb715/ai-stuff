/**
 * Adversarial tests for llm-lint.ts — applyLintResults.
 *
 * applyLintResults reads a JSON classification array (line numbers →
 * obligation/mechanism/ambiguous) and maps them back to boundary
 * Communication lines. extractCommunicationLines is not exported, so we
 * drive through applyLintResults with AGENTS.md files on disk.
 *
 * Line numbers in the classification file are 1-based indices into the
 * ordered list emitLintPrompt produces (extractCommunicationLines skips
 * lines that fail Phase 1 rules — file paths, param shapes, etc.). So we
 * craft Communication content that passes Phase 1 to get predictable
 * indices.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applyLintResults, emitLintPrompt } from "../llm-lint.ts";
import type { Manifest, BoundaryEntry } from "../manifest.ts";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "boundary-lint-"));
}

function buildManifest(
  repoRoot: string,
  entries: Array<Partial<BoundaryEntry> & { dir: string; name: string }>,
): Manifest {
  return {
    maxLines: 40,
    repoRoot,
    boundaries: entries.map((e) => ({
      dir: e.dir,
      name: e.name,
      purpose: e.purpose ?? "test",
      surface: e.surface ?? ["index.ts"],
      maxLines: e.maxLines,
    })),
  };
}

/** Write an AGENTS.md whose Communication section has the given lines. */
function writeAgents(
  root: string,
  dir: string,
  name: string,
  commLines: string[],
): void {
  const bdir = join(root, dir);
  mkdirSync(bdir, { recursive: true });
  // Also write the surface file so check-related calls don't blow up if
  // anything re-reads the surface.
  writeFileSync(join(bdir, "index.ts"), "export function alpha() {}\n", "utf-8");
  const lines: string[] = [
    `# ${name}`,
    "**Purpose**: test",
    "## Does",
    "<!-- fill -->",
    "",
    "## Does NOT",
    "<!-- fill -->",
    "",
    "## Communication",
  ];
  for (const c of commLines) lines.push(c);
  lines.push("");
  lines.push("## Key entry point");
  lines.push("- `index.ts` — `alpha`");
  lines.push("");
  lines.push("## To touch this boundary");
  lines.push("1. Run `boundary check`.");
  lines.push("2. <!-- notes -->");
  writeFileSync(join(bdir, "AGENTS.md"), lines.join("\n"), "utf-8");
}

describe("applyLintResults", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should map line numbers to violations correctly for a valid classification JSON", () => {
    // Two Communication lines that pass Phase 1 (no file paths/param shapes).
    // Line 1 = "Callers may poll." (obligation), Line 2 = "uses zod schemas." (mechanism).
    writeAgents(root, "a", "a", ["- Callers may poll.", "- uses zod schemas."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(
      resultsPath,
      JSON.stringify([
        { line: 1, classification: "obligation" },
        { line: 2, classification: "mechanism", reason: "mentions zod" },
      ]),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    const result = applyLintResults(manifest, resultsPath);

    expect(result.total).toBe(2);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].boundary).toBe("a");
    expect(result.violations[0].lineText).toContain("zod");
    expect(result.violations[0].classification).toBe("mechanism");
    expect(result.violations[0].reason).toBe("mentions zod");
  });

  it("should throw a descriptive error on malformed JSON (not crash silently)", () => {
    writeAgents(root, "a", "a", ["- Callers may poll."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(resultsPath, "{ broken json ]");

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    expect(() => applyLintResults(manifest, resultsPath)).toThrow(/failed to parse JSON/);
  });

  it("should throw when the JSON root is not an array", () => {
    writeAgents(root, "a", "a", ["- Callers may poll."]);

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);

    const notArray = join(root, "c1.json");
    writeFileSync(notArray, '{"line": 1, "classification": "obligation"}');
    expect(() => applyLintResults(manifest, notArray)).toThrow(/expected a JSON array/);
  });

  it("should skip line numbers out of range without crashing (stale classification file)", () => {
    // Only one Communication line. Classification references lines 1, 5, 999.
    writeAgents(root, "a", "a", ["- Callers may poll."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(
      resultsPath,
      JSON.stringify([
        { line: 1, classification: "obligation" },
        { line: 5, classification: "mechanism" }, // out of range
        { line: 999, classification: "mechanism" }, // way out of range
        { line: 0, classification: "obligation" }, // invalid (< 1) — normalized out
        { line: -3, classification: "mechanism" }, // invalid — normalized out
      ]),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    const result = applyLintResults(manifest, resultsPath);

    // Only line 1 matched. Out-of-range and invalid lines skipped, no crash.
    expect(result.total).toBe(1);
    expect(result.violations).toHaveLength(0);
    expect(result.failed).toBe(0);
    expect(result.passed).toBe(1);
  });

  it("should report ambiguous classifications as passed (warnings, not hard failures)", () => {
    // "ambiguous" is neither "obligation" nor "mechanism" — it does not produce
    // a violation. It counts toward matched.total but not toward failed.
    writeAgents(root, "a", "a", ["- Callers may poll.", "- unsure about this."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(
      resultsPath,
      JSON.stringify([
        { line: 1, classification: "obligation" },
        { line: 2, classification: "ambiguous", reason: "could go either way" },
      ]),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    const result = applyLintResults(manifest, resultsPath);

    expect(result.total).toBe(2);
    expect(result.failed).toBe(0); // ambiguous is not a mechanism violation
    expect(result.passed).toBe(2);
    expect(result.violations).toHaveLength(0);
  });

  it("should normalize unknown classification strings to ambiguous (not crash)", () => {
    writeAgents(root, "a", "a", ["- Callers may poll."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(
      resultsPath,
      JSON.stringify([
        { line: 1, classification: "totally-bogus-label" }, // unknown → ambiguous
      ]),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    const result = applyLintResults(manifest, resultsPath);

    // Unknown classification → ambiguous → not a violation, not a crash.
    expect(result.total).toBe(1);
    expect(result.failed).toBe(0);
    expect(result.violations).toHaveLength(0);
  });

  it("should skip non-object / non-number line entries without crashing", () => {
    writeAgents(root, "a", "a", ["- Callers may poll."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(
      resultsPath,
      JSON.stringify([
        null, // non-object → skipped
        "string entry", // non-object → skipped
        42, // non-object → skipped
        { line: 1, classification: "obligation" },
        { line: "not a number", classification: "mechanism" }, // line NaN → skipped
      ]),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    const result = applyLintResults(manifest, resultsPath);

    expect(result.total).toBe(1); // only the valid line:1 entry matched
    expect(result.passed).toBe(1);
  });

  it("should map violations back to the correct boundary when multiple boundaries exist", () => {
    // Boundary "a": line 1. Boundary "b": lines 2, 3 (indices are global
    // across boundaries in the order extractCommunicationLines walks them —
    // manifest.boundaries order).
    writeAgents(root, "a", "a", ["- Callers may poll."]);
    writeAgents(root, "b", "b", ["- uses fetch directly.", "- callers must retry."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(
      resultsPath,
      JSON.stringify([
        { line: 1, classification: "obligation" }, // a
        { line: 2, classification: "mechanism", reason: "uses fetch" }, // b line 1
        { line: 3, classification: "obligation" }, // b line 2
      ]),
    );

    const manifest = buildManifest(root, [
      { dir: "a", name: "a" },
      { dir: "b", name: "b" },
    ]);
    const result = applyLintResults(manifest, resultsPath);

    expect(result.total).toBe(3);
    expect(result.failed).toBe(1);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].boundary).toBe("b");
    expect(result.violations[0].lineText).toContain("fetch");
  });

  it("should return zero total when no Communication lines pass Phase 1", () => {
    // A Communication line with a file path (.ts) trips Phase 1 → skipped by
    // extractCommunicationLines → empty line list → all classifications
    // out of range.
    writeAgents(root, "a", "a", ["- Callers must use `helper.ts` directly."]);

    const resultsPath = join(root, "classifications.json");
    writeFileSync(
      resultsPath,
      JSON.stringify([{ line: 1, classification: "mechanism" }]),
    );

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    const result = applyLintResults(manifest, resultsPath);

    // No lines passed Phase 1 → line 1 doesn't exist → 0 matches.
    expect(result.total).toBe(0);
    expect(result.violations).toHaveLength(0);
  });
});

describe("emitLintPrompt — empty-case contract", () => {
  let root: string;

  beforeEach(() => {
    root = makeTempRoot();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("should emit a no-lines prompt when no Communication lines pass Phase 1", () => {
    writeAgents(root, "a", "a", ["- Callers must use `helper.ts`."]);

    const manifest = buildManifest(root, [{ dir: "a", name: "a" }]);
    const prompt = emitLintPrompt(manifest);

    expect(prompt).toContain("no Communication lines passed Phase 1");
    expect(prompt).toContain("Respond as JSON array: []");
  });
});