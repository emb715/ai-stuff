import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
export function runSuite(opts: RunOptions = {}): string {
	const { cwd, url, args = [] } = opts;

	const outDir = mkdtempSync(join(tmpdir(), "e2e-web-"));
	const outFile = join(outDir, "report.json");

	const env: NodeJS.ProcessEnv = {
		...process.env,
		PLAYWRIGHT_JSON_OUTPUT_NAME: outFile,
	};
	if (url) env.PLAYWRIGHT_TEST_BASE_URL = url;

	const [bin, ...baseArgs] = (opts.command ?? "npx playwright test").split(" ");

	try {
		execFileSync(bin, [...baseArgs, "--reporter=json", ...args], {
			cwd,
			env,
			encoding: "utf8",
			stdio: ["ignore", "inherit", "inherit"],
			maxBuffer: 64 * 1024 * 1024,
		});
	} catch {
		// Test failures exit non-zero. The report still gets written; read it below.
	}

	if (!existsSync(outFile)) {
		throw new Error(
			`Playwright wrote no JSON report to ${outFile}. The suite likely failed to start — ` +
				"check that the project builds and that a playwright config is present.",
		);
	}

	return readFileSync(outFile, "utf8");
}
