/**
 * Parse a Playwright JSON report into a flat list of test outcomes.
 *
 * Playwright's JSON reporter nests suites arbitrarily deep; every level may
 * carry `specs`. This module flattens that tree so the ledger only ever deals
 * with a list.
 */

export type OutcomeStatus = "pass" | "fail" | "flaky" | "skipped";

export interface TestOutcome {
	/** Test title as written in the spec file */
	title: string;
	/** Spec file path, relative to the Playwright rootDir */
	file: string;
	/** 1-indexed line of the test declaration, 0 when the report omits it */
	line: number;
	status: OutcomeStatus;
	/** Total duration across retries, in milliseconds */
	durationMs: number;
	/** Playwright project (browser/config) the test ran under */
	project: string;
	/** Tags declared on the spec, e.g. ["@AC4"] */
	tags: string[];
}

export interface RunStats {
	expected: number;
	unexpected: number;
	flaky: number;
	skipped: number;
	durationMs: number;
	startedAt: string | null;
}

export interface ParsedReport {
	outcomes: TestOutcome[];
	stats: RunStats;
}

/** Shapes we rely on from the Playwright JSON reporter. Everything else is ignored. */
interface RawResult {
	status?: string;
	duration?: number;
}
interface RawTest {
	status?: string;
	projectName?: string;
	results?: RawResult[];
}
interface RawSpec {
	title?: string;
	file?: string;
	line?: number;
	tags?: string[];
	tests?: RawTest[];
}
interface RawSuite {
	title?: string;
	file?: string;
	specs?: RawSpec[];
	suites?: RawSuite[];
}
interface RawReport {
	suites?: RawSuite[];
	stats?: {
		expected?: number;
		unexpected?: number;
		flaky?: number;
		skipped?: number;
		duration?: number;
		startTime?: string;
	};
}

/**
 * Map Playwright's per-test status onto our four states.
 *
 * Playwright reports `expected` / `unexpected` / `flaky` / `skipped` at the
 * test level, which already accounts for `expect.fail` annotations and retries.
 * We deliberately keep `flaky` distinct from `pass`: a flaky test is not
 * evidence, it is a question.
 */
function mapStatus(raw: string | undefined): OutcomeStatus {
	switch (raw) {
		case "expected":
			return "pass";
		case "flaky":
			return "flaky";
		case "skipped":
			return "skipped";
		case "unexpected":
			return "fail";
		default:
			// An unrecognised status must never silently count as a pass.
			return "fail";
	}
}

function walkSuite(suite: RawSuite, inheritedFile: string, out: TestOutcome[]): void {
	const file = suite.file ?? inheritedFile;

	for (const spec of suite.specs ?? []) {
		const specFile = spec.file ?? file;
		for (const test of spec.tests ?? []) {
			const durationMs = (test.results ?? []).reduce(
				(sum, r) => sum + (typeof r.duration === "number" ? r.duration : 0),
				0,
			);
			out.push({
				title: spec.title ?? "(untitled)",
				file: specFile,
				line: typeof spec.line === "number" ? spec.line : 0,
				status: mapStatus(test.status),
				durationMs,
				project: test.projectName ?? "",
				tags: spec.tags ?? [],
			});
		}
	}

	for (const child of suite.suites ?? []) {
		walkSuite(child, file, out);
	}
}

/**
 * Parse the JSON produced by `playwright test --reporter=json`.
 *
 * Throws on anything that is not a JSON object with a `suites` array — a
 * silently empty ledger is the failure mode this tool exists to prevent, so an
 * unreadable report must be loud.
 */
export function parseReport(json: string): ParsedReport {
	let raw: RawReport;
	try {
		raw = JSON.parse(json) as RawReport;
	} catch (err) {
		throw new Error(`report is not valid JSON: ${(err as Error).message}`);
	}

	if (!raw || typeof raw !== "object" || !Array.isArray(raw.suites)) {
		throw new Error(
			"report is not a Playwright JSON report (missing top-level `suites` array)",
		);
	}

	const outcomes: TestOutcome[] = [];
	for (const suite of raw.suites) {
		walkSuite(suite, suite.file ?? "", outcomes);
	}

	const s = raw.stats ?? {};
	return {
		outcomes,
		stats: {
			expected: s.expected ?? 0,
			unexpected: s.unexpected ?? 0,
			flaky: s.flaky ?? 0,
			skipped: s.skipped ?? 0,
			durationMs: s.duration ?? 0,
			startedAt: s.startTime ?? null,
		},
	};
}
