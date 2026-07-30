import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mutable mock state, hoisted so vi.mock factory can reference it.
const mock = vi.hoisted(() => {
	return {
		stat: "",
		full: "",
	};
});

vi.mock("node:child_process", () => ({
	execFileSync: (cmd: string, args: string[]) => {
		if (args.includes("rev-parse")) return "abc1234\n";
		if (args.includes("--stat")) return mock.stat;
		return mock.full;
	},
}));

// Import AFTER mock is registered.
import { getDiff, type DiffOptions } from "../src/core/diff.js";

beforeEach(() => {
	mock.stat = "";
	mock.full = "";
});

afterEach(() => {
	mock.stat = "";
	mock.full = "";
});

// Helpers to build synthetic diff chunks.
// diff.ts splits full on /^diff --git /m, so each chunk must NOT include the
// leading "diff --git " prefix (it re-prepends it).
function makeFileDiff(path: string, changedLinePairs: number): string {
	const lines: string[] = [];
	lines.push(`a/${path} b/${path}`);
	lines.push(`index 111111..222222 100644`);
	lines.push(`--- a/${path}`);
	lines.push(`+++ b/${path}`);
	lines.push(`@@ -1,${changedLinePairs} +1,${changedLinePairs} @@`);
	for (let i = 0; i < changedLinePairs; i++) {
		lines.push(`-old line ${i}`);
		lines.push(`+new line ${i}`);
	}
	return lines.join("\n");
}

// Lines matching /^[+-]/gm in a single-file block built above:
// "--- a/...", "+++ b/..." (2) + 2*changedLinePairs (removed+added)
// diff.ts uses `changedLines > 50`, so "large" requires 2 + 2*pairs > 50
//  => pairs >= 25 gives 52 > 50 => kept. pairs = 24 => 50, not kept.
const LARGE_PAIRS = 30; // 2 + 60 = 62 > 50 => kept
const SMALL_PAIRS = 5; // 2 + 10 = 12, not > 50 => dropped

describe("getDiff truncation logic", () => {
	describe("small diff (under maxChars)", () => {
		it("should return truncated:false and preserve the full diff when under maxChars", () => {
			// Arrange
			mock.stat = " file.ts | 10 +-\n 1 file changed, 5 insertions(+), 5 deletions(-)\n";
			mock.full = "diff --git " + makeFileDiff("file.ts", SMALL_PAIRS);
			const opts: DiffOptions = { base: "main", maxChars: 1_000_000 };
			// Act
			const result = getDiff(opts);
			// Assert
			expect(result.truncated).toBe(false);
			expect(result.full).toBe(mock.full);
			expect(result.stat).toBe(mock.stat);
		});

		it("should not truncate when full length equals maxChars exactly (<=)", () => {
			// Arrange
			mock.stat = "stat\n";
			mock.full = "diff --git " + makeFileDiff("file.ts", SMALL_PAIRS);
			// Act
			const result = getDiff({ base: "main", maxChars: mock.full.length });
			// Assert
			expect(result.truncated).toBe(false);
			expect(result.full).toBe(mock.full);
		});
	});

	describe("large diff (over maxChars)", () => {
		it("should return truncated:true, keep stat, and keep only files with >50 changed lines", () => {
			// Arrange
			mock.stat = " big.ts | 999 +-\n small.ts | 10 +-\n";
			const bigChunk = makeFileDiff("big.ts", LARGE_PAIRS);
			const smallChunk = makeFileDiff("small.ts", SMALL_PAIRS);
			mock.full = `diff --git ${bigChunk}\n\ndiff --git ${smallChunk}`;
			const opts: DiffOptions = { base: "main", maxChars: mock.full.length - 1 };
			// Act
			const result = getDiff(opts);
			// Assert
			expect(result.truncated).toBe(true);
			expect(result.stat).toBe(mock.stat);
			expect(result.full).toContain("big.ts");
			expect(result.full).not.toContain("small.ts");
		});
	});

	describe("diff with all small files (no file >50 lines)", () => {
		it("should return truncated:true and fall back to stat only (full === stat)", () => {
			// Arrange
			mock.stat = " small1.ts | 5 +-\n small2.ts | 6 +-\n";
			const small1 = makeFileDiff("small1.ts", SMALL_PAIRS);
			const small2 = makeFileDiff("small2.ts", SMALL_PAIRS);
			mock.full = `diff --git ${small1}\n\ndiff --git ${small2}`;
			const opts: DiffOptions = { base: "main", maxChars: mock.full.length - 1 };
			// Act
			const result = getDiff(opts);
			// Assert
			expect(result.truncated).toBe(true);
			// keptDiffs empty => full falls back to stat
			expect(result.full).toBe(mock.stat);
		});
	});

	describe("mixed file sizes", () => {
		it("should keep large files and drop small ones when over maxChars", () => {
			// Arrange
			mock.stat = "stat\n";
			const big1 = makeFileDiff("big1.ts", LARGE_PAIRS);
			const big2 = makeFileDiff("big2.ts", LARGE_PAIRS);
			const small1 = makeFileDiff("small1.ts", SMALL_PAIRS);
			const small2 = makeFileDiff("small2.ts", SMALL_PAIRS);
			mock.full = `diff --git ${small1}\n\ndiff --git ${big1}\n\ndiff --git ${small2}\n\ndiff --git ${big2}`;
			const opts: DiffOptions = { base: "main", maxChars: mock.full.length - 1 };
			// Act
			const result = getDiff(opts);
			// Assert
			expect(result.truncated).toBe(true);
			expect(result.full).toContain("big1.ts");
			expect(result.full).toContain("big2.ts");
			expect(result.full).not.toContain("small1.ts");
			expect(result.full).not.toContain("small2.ts");
		});
	});

	describe("empty diff (no changes)", () => {
		it("should return empty stat, empty full, and truncated:false", () => {
			// Arrange
			mock.stat = "";
			mock.full = "";
			const opts: DiffOptions = { base: "main" };
			// Act
			const result = getDiff(opts);
			// Assert
			expect(result.truncated).toBe(false);
			expect(result.stat).toBe("");
			expect(result.full).toBe("");
		});
	});

	describe("truncation budget enforcement", () => {
		it("should not exceed maxChars in the truncated full even with multiple large files", () => {
			// Arrange — two large files that together exceed maxChars.
			// maxChars is set so only one fits; the second is dropped by the
			// `keptChars + diffBlock.length <= remainingBudget` guard.
			// The stat string is always included in the output, so it counts
			// against the budget (remainingBudget = maxChars - stat.length).
			mock.stat = "stat\n";
			const big1 = makeFileDiff("big1.ts", LARGE_PAIRS);
			const big2 = makeFileDiff("big2.ts", LARGE_PAIRS);
			const big1Block = `diff --git ${big1}`;
			const big2Block = `diff --git ${big2}`;
			mock.full = `${big1Block}\n\n${big2Block}`;
			// diff.ts splits on /^diff --git /m, so the "\n\n" separator stays
			// attached to big1's chunk, inflating its diffBlock length by 2.
			// Set maxChars so stat + big1 (N1+2) fits but stat + big1 + big2
			// does not. stat (5 chars) is subtracted from maxChars first.
			const maxChars = mock.stat.length + big1Block.length + 2;
			const opts: DiffOptions = { base: "main", maxChars };
			// Act
			const result = getDiff(opts);
			// Assert
			expect(result.truncated).toBe(true);
			expect(result.full.length).toBeLessThanOrEqual(maxChars);
			expect(result.full).toContain("big1.ts");
			expect(result.full).not.toContain("big2.ts");
		});

		it("should count the stat against the budget (huge stat shrinks the file-diff budget)", () => {
			// Arrange — a stat large enough that, combined with one large file,
			// it pushes the pair over maxChars even though the file alone would
			// fit under the old (stat-ignorant) budget.
			mock.stat = "x".repeat(50); // 50 chars of stat
			const big1 = makeFileDiff("big1.ts", LARGE_PAIRS);
			const big2 = makeFileDiff("big2.ts", LARGE_PAIRS);
			const big1Block = `diff --git ${big1}`;
			const big2Block = `diff --git ${big2}`;
			mock.full = `${big1Block}\n\n${big2Block}`;
			// Pick maxChars so:
			//   - full.length > maxChars  (truncation triggered)
			//   - big1Block.length <= maxChars  (old logic would keep big1)
			//   - stat.length + big1Block.length > maxChars  (new logic drops big1)
			// => maxChars = big1Block.length + 1 satisfies all three (stat=50).
			const maxChars = big1Block.length + 1;
			const opts: DiffOptions = { base: "main", maxChars };
			// Act
			const result = getDiff(opts);
			// Assert — new behavior: stat eats the budget, big1 is dropped,
			// full falls back to stat only.
			expect(result.truncated).toBe(true);
			expect(result.full).toBe(mock.stat);
			expect(result.full).not.toContain("big1.ts");
		});

		it("should return stat only when stat alone exceeds maxChars", () => {
			// Arrange — stat bigger than the whole budget.
			mock.stat = "x".repeat(100);
			const big1 = makeFileDiff("big1.ts", LARGE_PAIRS);
			mock.full = `diff --git ${big1}`;
			const maxChars = 50; // < stat.length
			const opts: DiffOptions = { base: "main", maxChars };
			// Act
			const result = getDiff(opts);
			// Assert
			expect(result.truncated).toBe(true);
			expect(result.full).toBe(mock.stat);
		});
	});
});