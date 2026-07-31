import { describe, expect, it } from "vitest";
import { buildLedger, renderBlock } from "../src/core/ledger.js";
import type { ParsedReport, TestOutcome } from "../src/core/report.js";

function outcome(partial: Partial<TestOutcome>): TestOutcome {
	return {
		title: "untitled",
		file: "e2e/x.spec.ts",
		line: 1,
		status: "pass",
		durationMs: 10,
		project: "chromium",
		tags: [],
		...partial,
	};
}

function report(outcomes: TestOutcome[]): ParsedReport {
	return {
		outcomes,
		stats: {
			expected: outcomes.filter((o) => o.status === "pass").length,
			unexpected: outcomes.filter((o) => o.status === "fail").length,
			flaky: outcomes.filter((o) => o.status === "flaky").length,
			skipped: outcomes.filter((o) => o.status === "skipped").length,
			durationMs: 100,
			startedAt: null,
		},
	};
}

const target = { build: "a1b2c3d", url: "https://preview.example", environment: "preview" };

describe("buildLedger", () => {
	it("anchors a criterion to the test that names it", () => {
		const ledger = buildLedger(
			report([outcome({ title: "AC4: save is disabled in flight", line: 12 })]),
			target,
			["AC4"],
		);
		expect(ledger.rows[0]).toMatchObject({ id: "AC4", state: "pass" });
		expect(ledger.rows[0].anchors[0].line).toBe(12);
	});

	it("leaves a declared criterion unverified when no test claims it", () => {
		const ledger = buildLedger(
			report([outcome({ title: "AC1: something else" })]),
			target,
			["AC1", "AC2"],
		);
		const ac2 = ledger.rows.find((r) => r.id === "AC2");
		expect(ac2?.state).toBe("unverified");
		expect(ac2?.note).toMatch(/no test claims/);
	});

	// The rule this whole tool exists to enforce.
	it("does not pass a criterion on the strength of other tests passing", () => {
		const ledger = buildLedger(
			report([
				outcome({ title: "AC1: covered" }),
				outcome({ title: "some unrelated smoke test" }),
			]),
			target,
			["AC1", "AC7"],
		);
		expect(ledger.rows.find((r) => r.id === "AC7")?.state).toBe("unverified");
		expect(ledger.verdict).toBe("VERIFIED_WITH_CONDITIONS");
	});

	it("treats a skipped test as absence of evidence, not a pass", () => {
		const ledger = buildLedger(
			report([outcome({ title: "AC3: x", status: "skipped" })]),
			target,
			["AC3"],
		);
		expect(ledger.rows[0].state).toBe("unverified");
		expect(ledger.rows[0].note).toMatch(/skipped/);
	});

	it("treats a flaky test as a question, not evidence", () => {
		const ledger = buildLedger(
			report([outcome({ title: "AC3: x", status: "flaky" })]),
			target,
			["AC3"],
		);
		expect(ledger.rows[0].state).toBe("flaky");
		expect(ledger.verdict).toBe("VERIFIED_WITH_CONDITIONS");
	});

	it("lets any failure dominate a criterion covered by several tests", () => {
		const ledger = buildLedger(
			report([
				outcome({ title: "AC5: happy path" }),
				outcome({ title: "AC5: empty state", status: "fail" }),
			]),
			target,
			["AC5"],
		);
		expect(ledger.rows[0].state).toBe("fail");
		expect(ledger.verdict).toBe("NOT_VERIFIED");
	});

	it("reads criterion ids from tags as well as titles", () => {
		const ledger = buildLedger(
			report([outcome({ title: "completes checkout", tags: ["@AC12"] })]),
			target,
			["AC12"],
		);
		expect(ledger.rows[0].state).toBe("pass");
	});

	it("collects tests that name no criterion without counting them as evidence", () => {
		const ledger = buildLedger(report([outcome({ title: "a smoke test" })]), target, ["AC1"]);
		expect(ledger.unmapped).toHaveLength(1);
		expect(ledger.rows.find((r) => r.id === "AC1")?.state).toBe("unverified");
	});

	it("surfaces a test claiming a criterion the document never declared", () => {
		const ledger = buildLedger(
			report([outcome({ title: "AC99: invented" })]),
			target,
			["AC1"],
		);
		const ac99 = ledger.rows.find((r) => r.id === "AC99");
		expect(ac99?.note).toMatch(/not present in the criteria document/);
	});

	it("orders criteria numerically", () => {
		const ledger = buildLedger(report([]), target, ["AC10", "AC2", "AC1"]);
		expect(ledger.rows.map((r) => r.id)).toEqual(["AC1", "AC2", "AC10"]);
	});

	it("refuses to call an empty ledger verified", () => {
		expect(buildLedger(report([]), target, []).verdict).toBe("NOT_VERIFIED");
	});

	it("returns VERIFIED only when every declared criterion has a passing anchor", () => {
		const ledger = buildLedger(
			report([outcome({ title: "AC1: a" }), outcome({ title: "AC2: b" })]),
			target,
			["AC1", "AC2"],
		);
		expect(ledger.verdict).toBe("VERIFIED");
	});
});

describe("renderBlock", () => {
	it("wraps output in the upsert markers", () => {
		const block = renderBlock(buildLedger(report([outcome({ title: "AC1: a" })]), target, ["AC1"]));
		expect(block.startsWith("<!-- e2e-web:start -->")).toBe(true);
		expect(block.trimEnd().endsWith("<!-- e2e-web:end -->")).toBe(true);
	});

	it("states the verdict and names the build", () => {
		const block = renderBlock(buildLedger(report([outcome({ title: "AC1: a" })]), target, ["AC1"]));
		expect(block).toContain("**Verdict: VERIFIED**");
		expect(block).toContain("a1b2c3d");
		expect(block).toContain("https://preview.example");
	});

	it("calls out unverified criteria explicitly", () => {
		const block = renderBlock(buildLedger(report([]), target, ["AC1", "AC2"]));
		expect(block).toContain("2 criteria unverified");
		expect(block).toContain("Absence of a check is not a pass");
	});

	it("escapes pipes so a title cannot break the table", () => {
		const block = renderBlock(
			buildLedger(report([outcome({ title: "AC1: a | b" })]), target, ["AC1"]),
		);
		expect(block).toContain("a \\| b");
	});

	it("says plainly when nothing anchored at all", () => {
		const block = renderBlock(buildLedger(report([]), target, []));
		expect(block).toContain("not evidence for anything");
	});
});
