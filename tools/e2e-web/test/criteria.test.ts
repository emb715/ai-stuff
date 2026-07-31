import { describe, expect, it } from "vitest";
import { compareIds, extractIds, parseCriteria } from "../src/core/criteria.js";
import { spliceBlock } from "../src/core/upsert.js";
import { END_MARKER, START_MARKER } from "../src/core/ledger.js";

describe("extractIds", () => {
	it("finds the id at the start of a title", () => {
		expect(extractIds("AC4: save is disabled")).toEqual(["AC4"]);
	});

	it("finds an id anywhere in the title", () => {
		expect(extractIds("save is disabled in flight (AC4)")).toEqual(["AC4"]);
	});

	it("accepts tag form", () => {
		expect(extractIds("completes checkout", ["@AC12"])).toEqual(["AC12"]);
	});

	it("accepts hyphen, underscore, and space spellings", () => {
		expect(extractIds("AC-4 and AC_5 and AC 6")).toEqual(["AC4", "AC5", "AC6"]);
	});

	it("handles a test covering several criteria", () => {
		expect(extractIds("AC1 and AC2: both")).toEqual(["AC1", "AC2"]);
	});

	it("deduplicates repeated mentions", () => {
		expect(extractIds("AC3: x", ["@AC3"])).toEqual(["AC3"]);
	});

	it("returns nothing for a title that names no criterion", () => {
		expect(extractIds("a smoke test")).toEqual([]);
	});

	it("does not match AC inside another word", () => {
		expect(extractIds("BACK4 and FACADE1")).toEqual([]);
	});
});

describe("parseCriteria", () => {
	it("pulls ids out of a markdown criteria document", () => {
		const doc = `
## Acceptance criteria

- **AC1** — the user can sign in
- **AC2** — an invalid password shows an error

| id | criterion |
|---|---|
| AC10 | session persists across reload |
`;
		expect(parseCriteria(doc)).toEqual(["AC1", "AC2", "AC10"]);
	});

	it("returns an empty list when the document names no criteria", () => {
		expect(parseCriteria("no identifiers here")).toEqual([]);
	});
});

describe("compareIds", () => {
	it("orders numerically, not lexically", () => {
		expect(["AC10", "AC9", "AC1"].sort(compareIds)).toEqual(["AC1", "AC9", "AC10"]);
	});
});

describe("spliceBlock", () => {
	const block = `${START_MARKER}\nnew content\n${END_MARKER}`;

	it("appends when no block is present", () => {
		expect(spliceBlock("existing body", block)).toBe(`existing body\n\n${block}\n`);
	});

	it("replaces an existing block in place", () => {
		const existing = `before\n\n${START_MARKER}\nold\n${END_MARKER}\n\nafter`;
		const result = spliceBlock(existing, block);
		expect(result).toContain("new content");
		expect(result).not.toContain("old");
		expect(result.startsWith("before")).toBe(true);
		expect(result.trimEnd().endsWith("after")).toBe(true);
	});

	it("rejects a block without markers rather than corrupting the body", () => {
		expect(() => spliceBlock("body", "bare text")).toThrow(/must start with/);
	});
});
