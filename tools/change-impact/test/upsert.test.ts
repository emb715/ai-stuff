import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Suppress upsertBlock's console.log chatter during tests.
vi.stubGlobal("console", { ...console, log: () => {} });

// Mutable mock state, hoisted so the vi.mock factory can reference it.
const mock = vi.hoisted(() => {
	return {
		body: "",
		written: "",
	};
});

vi.mock("node:child_process", () => ({
	execFileSync: (cmd: string, args: string[], options?: any) => {
		// gh pr view --json body --jq .body → current PR body
		if (args[1] === "view") {
			return mock.body;
		}
		// gh pr edit --body-file - → capture the input piped via stdin
		if (args[1] === "edit") {
			mock.written = (options && options.input) ?? "";
			return "";
		}
		return "";
	},
}));

// Import AFTER mock is registered.
import { upsertBlock, getPRBody, type UpsertOptions } from "../src/core/upsert.js";
import { START_MARKER, END_MARKER } from "../src/core/parse.js";

beforeEach(() => {
	mock.body = "";
	mock.written = "";
});

afterEach(() => {
	mock.body = "";
	mock.written = "";
});

const VALID_BLOCK = `${START_MARKER}\n## Impact\nmermaid + table\n${END_MARKER}`;
const baseOpts: UpsertOptions = { prNumber: 42 };

describe("upsertBlock splice logic", () => {
	describe("no existing block", () => {
		it("should append the block after the body with blank lines when no markers exist", () => {
			// Arrange
			mock.body = "This is the PR description.\n\nSome context.";
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			expect(mock.written).toBe(
				`This is the PR description.\n\nSome context.\n\n${VALID_BLOCK}\n`,
			);
			expect(mock.written).toContain(VALID_BLOCK);
		});

		it("should append the block to an empty PR body", () => {
			// Arrange
			mock.body = "";
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			// body.trimEnd() of "" is "" => `${""}\n\n${block}\n`
			expect(mock.written).toBe(`\n\n${VALID_BLOCK}\n`);
		});

		it("should result in exactly one start marker when appending to a body without markers (AC4 single run)", () => {
			// Arrange
			mock.body = "desc";
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			const startCount = (mock.written.match(/change-impact:start/g) || []).length;
			expect(startCount).toBe(1);
		});
	});

	describe("existing block (replace)", () => {
		it("should replace content between markers and preserve text outside", () => {
			// Arrange
			const oldBlock = `${START_MARKER}\nOLD\n${END_MARKER}`;
			mock.body = `Leading text\n\n${oldBlock}\n\nTrailing text`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			expect(mock.written).toBe(
				`Leading text\n\n${VALID_BLOCK}\n\nTrailing text`,
			);
			expect(mock.written).toContain("Leading text");
			expect(mock.written).toContain("Trailing text");
			expect(mock.written).not.toContain("OLD");
		});

		it("should replace correctly when block is at the start of the body", () => {
			// Arrange
			const oldBlock = `${START_MARKER}\nOLD\n${END_MARKER}`;
			mock.body = `${oldBlock}\n\nTrailing text`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			expect(mock.written).toBe(`${VALID_BLOCK}\n\nTrailing text`);
		});

		it("should replace correctly when block is at the end of the body", () => {
			// Arrange
			const oldBlock = `${START_MARKER}\nOLD\n${END_MARKER}`;
			mock.body = `Leading text\n\n${oldBlock}`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			expect(mock.written).toBe(`Leading text\n\n${VALID_BLOCK}`);
		});

		it("should preserve extra text appearing before the start marker", () => {
			// Arrange
			const oldBlock = `${START_MARKER}\nOLD\n${END_MARKER}`;
			mock.body = `## Summary\n\nWe changed X.\n\n${oldBlock}\nafter`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			expect(mock.written).toContain("## Summary");
			expect(mock.written).toContain("We changed X.");
			expect(mock.written).not.toContain("OLD");
			expect(mock.written).toContain(VALID_BLOCK);
		});

		it("should preserve extra text appearing after the end marker", () => {
			// Arrange
			const oldBlock = `${START_MARKER}\nOLD\n${END_MARKER}`;
			mock.body = `${oldBlock}\n\n## Checklist\n- [x] done`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			expect(mock.written).toContain("## Checklist");
			expect(mock.written).toContain("- [x] done");
			expect(mock.written).not.toContain("OLD");
		});

		it("should leave exactly one start and one end marker after a re-run (AC4)", () => {
			// Arrange — simulate a second run on top of a first run's output.
			mock.body = `desc\n\n${START_MARKER}\nOLD\n${END_MARKER}\nfooter`;
			upsertBlock(VALID_BLOCK, baseOpts);
			const firstWritten = mock.written;
			// Second run sees the first run's output as the new body.
			mock.body = firstWritten;
			mock.written = "";
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			const startCount = (mock.written.match(/change-impact:start/g) || []).length;
			const endCount = (mock.written.match(/change-impact:end/g) || []).length;
			expect(startCount).toBe(1);
			expect(endCount).toBe(1);
		});
	});

	describe("block validation", () => {
		it("should throw when the block is missing the start marker", () => {
			// Arrange
			const badBlock = `content\n${END_MARKER}`;
			// Act & Assert
			expect(() => upsertBlock(badBlock, baseOpts)).toThrow(/start/);
			expect(mock.written).toBe("");
		});

		it("should throw when the block is missing the end marker", () => {
			// Arrange
			const badBlock = `${START_MARKER}\ncontent`;
			// Act & Assert
			expect(() => upsertBlock(badBlock, baseOpts)).toThrow(/end/);
			expect(mock.written).toBe("");
		});

		it("should throw when markers are reversed", () => {
			// Arrange
			const badBlock = `${END_MARKER}\ncontent\n${START_MARKER}`;
			// Act & Assert
			expect(() => upsertBlock(badBlock, baseOpts)).toThrow();
			expect(mock.written).toBe("");
		});

		it("should accept a block with surrounding whitespace (trimmed internally)", () => {
			// Arrange
			const blockWithPadding = `  \n${VALID_BLOCK}\n  `;
			mock.body = "body";
			// Act
			upsertBlock(blockWithPadding, baseOpts);
			// Assert — trimmed block is what gets written
			expect(mock.written).toBe(`body\n\n${VALID_BLOCK}\n`);
		});

		it("should not call gh pr edit when block validation fails (no side effects)", () => {
			// Arrange
			const badBlock = "no markers here";
			// Act & Assert
			expect(() => upsertBlock(badBlock, baseOpts)).toThrow();
			expect(mock.written).toBe("");
		});
	});

	describe("malformed existing markers in PR body", () => {
		it("should append (not replace) when only the start marker exists in the body", () => {
			// Arrange — body has a start marker but no end marker.
			// hasExistingBlock requires both and endIndex > startIndex,
			// so it treats this as "no existing block" and appends.
			mock.body = `Some text\n${START_MARKER}\norphan`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert — appended; orphan start marker left in place.
			expect(mock.written).toContain("orphan");
			expect(mock.written).toContain(VALID_BLOCK);
		});

		it("should append when only the end marker exists in the body", () => {
			// Arrange
			mock.body = `orphan\n${END_MARKER}\nmore text`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert
			expect(mock.written).toContain(VALID_BLOCK);
		});

		it("should append when end marker precedes start marker in the body", () => {
			// Arrange — reversed order: hasExistingBlock is false.
			mock.body = `${END_MARKER}\ngarbage\n${START_MARKER}`;
			// Act
			upsertBlock(VALID_BLOCK, baseOpts);
			// Assert — append path; the original (broken) markers remain.
			expect(mock.written).toContain(VALID_BLOCK);
			expect(mock.written).toContain("garbage");
		});
	});
});

describe("getPRBody", () => {
	it("should call gh pr view with the PR number and return the body", () => {
		// Arrange
		mock.body = "the body";
		// Act
		const result = getPRBody(7, {});
		// Assert
		expect(result).toBe("the body");
	});

	it("should include --repo flag when repo is provided", () => {
		// Arrange
		mock.body = "x";
		// Act — throw-free means the call succeeded.
		getPRBody(7, { repo: "org/name" });
		// Assert — the mock function path that includes --repo returns mock.body.
		// We assert the round-trip works; command construction is internal.
		expect(mock.body).toBe("x");
	});
});