import { describe, expect, it } from "vitest";
import { parseReport } from "../src/core/report.js";

const nested = JSON.stringify({
	suites: [
		{
			title: "checkout.spec.ts",
			file: "e2e/checkout.spec.ts",
			specs: [
				{
					title: "AC12: completes checkout",
					file: "e2e/checkout.spec.ts",
					line: 14,
					tests: [
						{
							status: "expected",
							projectName: "chromium",
							results: [{ status: "passed", duration: 1200 }],
						},
					],
				},
			],
			suites: [
				{
					title: "guest flow",
					specs: [
						{
							title: "AC13: guest can check out",
							line: 40,
							tests: [
								{
									status: "unexpected",
									projectName: "chromium",
									results: [
										{ status: "failed", duration: 500 },
										{ status: "failed", duration: 400 },
									],
								},
							],
						},
					],
				},
			],
		},
	],
	stats: { expected: 1, unexpected: 1, flaky: 0, skipped: 0, duration: 2100 },
});

describe("parseReport", () => {
	it("flattens nested suites", () => {
		const { outcomes } = parseReport(nested);
		expect(outcomes).toHaveLength(2);
		expect(outcomes.map((o) => o.title)).toEqual([
			"AC12: completes checkout",
			"AC13: guest can check out",
		]);
	});

	it("inherits the file path into nested suites that omit it", () => {
		const { outcomes } = parseReport(nested);
		expect(outcomes[1].file).toBe("e2e/checkout.spec.ts");
	});

	it("sums duration across retries", () => {
		const { outcomes } = parseReport(nested);
		expect(outcomes[1].durationMs).toBe(900);
	});

	it("maps playwright statuses onto the four states", () => {
		const { outcomes } = parseReport(nested);
		expect(outcomes[0].status).toBe("pass");
		expect(outcomes[1].status).toBe("fail");
	});

	it("treats an unrecognised status as a failure, never a pass", () => {
		const json = JSON.stringify({
			suites: [
				{
					file: "a.spec.ts",
					specs: [{ title: "AC1: x", tests: [{ status: "who-knows" }] }],
				},
			],
		});
		expect(parseReport(json).outcomes[0].status).toBe("fail");
	});

	it("throws on a non-Playwright payload rather than returning an empty run", () => {
		expect(() => parseReport("{}")).toThrow(/missing top-level `suites`/);
		expect(() => parseReport("not json")).toThrow(/not valid JSON/);
	});
});
