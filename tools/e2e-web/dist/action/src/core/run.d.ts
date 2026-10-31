export interface RunOptions {
    /** Working directory containing the Playwright project */
    cwd?: string;
    /** Base URL passed to Playwright as PLAYWRIGHT_TEST_BASE_URL */
    url?: string;
    /** Extra args forwarded to `playwright test` (e.g. ["--project=chromium"]) */
    args?: string[];
    /** Command to invoke instead of `npx playwright test` */
    command?: string;
}
/**
 * Run the Playwright suite and return the raw JSON report.
 *
 * A non-zero exit is expected whenever tests fail, so it is not treated as an
 * error — the report is the product, and a failing suite is a legitimate,
 * informative result. Only a missing or unreadable report is fatal.
 */
export declare function runSuite(opts?: RunOptions): string;
