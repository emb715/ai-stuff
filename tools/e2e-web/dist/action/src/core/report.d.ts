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
/**
 * Parse the JSON produced by `playwright test --reporter=json`.
 *
 * Throws on anything that is not a JSON object with a `suites` array — a
 * silently empty ledger is the failure mode this tool exists to prevent, so an
 * unreadable report must be loud.
 */
export declare function parseReport(json: string): ParsedReport;
