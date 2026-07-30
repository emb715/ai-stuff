import { describe, it, expect } from "vitest";
import {
	extractBlock,
	validateBlock,
	START_MARKER,
	END_MARKER,
} from "../src/core/parse.js";

describe("extractBlock", () => {
	describe("valid input", () => {
		it("should return the block (with markers) when text contains a valid block", () => {
			// Arrange
			const text = `Some preamble\n${START_MARKER}\n## Impact\ncontent\n${END_MARKER}\nSome footer`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).not.toBeNull();
			expect(result).toBe(`${START_MARKER}\n## Impact\ncontent\n${END_MARKER}`);
		});

		it("should preserve mermaid and markdown content inside the block", () => {
			// Arrange
			const inner = `\`\`\`mermaid\nflowchart LR\n  A --> B\n\`\`\`\n\n| File | Impact |\n| --- | --- |\n| x.ts | high |\n`;
			const text = `before\n${START_MARKER}\n${inner}${END_MARKER}\nafter`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBe(`${START_MARKER}\n${inner}${END_MARKER}`);
		});

		it("should return only the block portion when text exists before and after", () => {
			// Arrange
			const before = "leading chatter\n\n";
			const after = "\n\ntrailing chatter";
			const text = `${before}${START_MARKER}\nx\n${END_MARKER}${after}`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBe(`${START_MARKER}\nx\n${END_MARKER}`);
			expect(result).not.toContain("leading");
			expect(result).not.toContain("trailing");
		});

		it("should return a block with empty content between markers (valid, just empty)", () => {
			// Arrange
			const text = `${START_MARKER}\n\n${END_MARKER}`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBe(`${START_MARKER}\n\n${END_MARKER}`);
		});
	});

	describe("multiple blocks", () => {
		it("should return the first block when multiple blocks exist in text", () => {
			// Arrange
			const first = `${START_MARKER}\nfirst\n${END_MARKER}`;
			const second = `${START_MARKER}\nsecond\n${END_MARKER}`;
			const text = `${first}\n\nmiddle\n\n${second}`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBe(first);
			expect(result).not.toContain("second");
		});
	});

	describe("missing or malformed markers", () => {
		it("should return null when no markers are present", () => {
			// Arrange
			const text = "just some plain text with no markers at all";
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBeNull();
		});

		it("should return null when only the start marker is present (no end)", () => {
			// Arrange
			const text = `preamble\n${START_MARKER}\norphaned content with no closer`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBeNull();
		});

		it("should return null when only the end marker is present (no start)", () => {
			// Arrange
			const text = `orphaned content with no opener\n${END_MARKER}\nfooter`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBeNull();
		});

		it("should return null when end marker appears before start marker", () => {
			// Arrange
			const text = `${END_MARKER}\nmisordered\n${START_MARKER}`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBeNull();
		});

		it("should return null on empty string input", () => {
			// Arrange & Act
			const result = extractBlock("");
			// Assert
			expect(result).toBeNull();
		});

		it("should return null when markers are malformed (typo in marker)", () => {
			// Arrange — missing the colon
			const text = `<!-- change-impact start -->\nx\n<!-- change-impact end -->`;
			// Act
			const result = extractBlock(text);
			// Assert
			expect(result).toBeNull();
		});
	});
});

describe("validateBlock", () => {
	it("should return true for a valid block starting and ending with markers", () => {
		// Arrange
		const block = `${START_MARKER}\ncontent\n${END_MARKER}`;
		// Act & Assert
		expect(validateBlock(block)).toBe(true);
	});

	it("should return false when the start marker is missing", () => {
		// Arrange
		const block = `content\n${END_MARKER}`;
		// Act & Assert
		expect(validateBlock(block)).toBe(false);
	});

	it("should return false when the end marker is missing", () => {
		// Arrange
		const block = `${START_MARKER}\ncontent`;
		// Act & Assert
		expect(validateBlock(block)).toBe(false);
	});

	it("should return true when block has extra surrounding whitespace (trimmed)", () => {
		// Arrange
		const block = `   \n\t${START_MARKER}\ncontent\n${END_MARKER}\n\t  \n`;
		// Act & Assert
		expect(validateBlock(block)).toBe(true);
	});

	it("should return false for an empty string", () => {
		// Act & Assert
		expect(validateBlock("")).toBe(false);
	});

	it("should return false when markers are reversed (end before start)", () => {
		// Arrange
		const block = `${END_MARKER}\ncontent\n${START_MARKER}`;
		// Act & Assert
		expect(validateBlock(block)).toBe(false);
	});

	it("should return false when only whitespace sits between markers and no real content", () => {
		// Arrange — technically valid per validateBlock (markers present, trimmed)
		const block = `${START_MARKER}\n${END_MARKER}`;
		// Act & Assert — validateBlock only checks markers, not content
		expect(validateBlock(block)).toBe(true);
	});
});