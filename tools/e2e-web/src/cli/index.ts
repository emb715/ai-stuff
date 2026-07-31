#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { parseCriteria } from "../core/criteria.js";
import { buildLedger, renderBlock } from "../core/ledger.js";
import { parseReport } from "../core/report.js";
import { runSuite } from "../core/run.js";
import { upsertBlock } from "../core/upsert.js";

const USAGE = `
e2e-web — run a Playwright suite and emit a criteria ledger with runtime evidence anchors

Usage:
  e2e-web [options]

Options:
  --url <url>             Base URL to run against (sets PLAYWRIGHT_TEST_BASE_URL)
  --build <id>            Build identifier: commit SHA, build number, deployment id.
                          Defaults to the current git SHA. Required by the playbook —
                          a target you cannot name cannot be verified.
  --env <name>            Environment name recorded in the output (e.g. preview)
  --criteria <path>       Criteria document; every AC<n> in it becomes a ledger row
  --report <path>         Use an existing Playwright JSON report instead of running
  --pr <number>           Upsert the block onto this PR (requires gh CLI)
  --repo <org/name>       Repo for the gh CLI
  --destination <where>   'comment' (default) or 'body'
  --out <path>            Write the markdown block to a file
  --json                  Print the ledger as JSON instead of markdown
  --fail-on <level>       Exit non-zero on 'fail' (default) | 'unverified' | 'never'
  -h, --help              Show this help

Exit codes:
  0  verdict acceptable under --fail-on
  1  verdict unacceptable under --fail-on
  2  the run could not produce a ledger at all
`;

interface Args {
	[key: string]: string | boolean | undefined;
}

function parseArgs(argv: string[]): Args {
	const args: Args = {};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg.startsWith("--") && arg !== "-h") continue;
		const key = arg === "-h" ? "help" : arg.slice(2);
		const next = argv[i + 1];
		if (next && !next.startsWith("--")) {
			args[key] = next;
			i++;
		} else {
			args[key] = true;
		}
	}
	return args;
}

function currentSha(): string {
	try {
		return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
			encoding: "utf8",
		}).trim();
	} catch {
		return "unknown";
	}
}

function main(): void {
	const args = parseArgs(process.argv.slice(2));

	if (args.help) {
		console.log(USAGE);
		process.exit(0);
	}

	const build = typeof args.build === "string" ? args.build : currentSha();
	if (build === "unknown") {
		console.error(
			"warning: no --build given and git SHA unavailable. The target is unnamed, " +
				"which makes these anchors unciteable. Pass --build.",
		);
	}

	let declared: string[] = [];
	if (typeof args.criteria === "string") {
		if (!existsSync(args.criteria)) {
			console.error(`criteria file not found: ${args.criteria}`);
			process.exit(2);
		}
		declared = parseCriteria(readFileSync(args.criteria, "utf8"));
		if (declared.length === 0) {
			console.error(
				`no AC<n> criteria found in ${args.criteria}. Criteria must be identified ` +
					"as AC1, AC2, … for tests to anchor to them.",
			);
			process.exit(2);
		}
	}

	let reportJson: string;
	try {
		reportJson =
			typeof args.report === "string"
				? readFileSync(args.report, "utf8")
				: runSuite({
						url: typeof args.url === "string" ? args.url : undefined,
					});
	} catch (err) {
		console.error(`could not obtain a Playwright report: ${(err as Error).message}`);
		process.exit(2);
	}

	let ledger;
	try {
		ledger = buildLedger(
			parseReport(reportJson),
			{
				build,
				url: typeof args.url === "string" ? args.url : undefined,
				environment: typeof args.env === "string" ? args.env : undefined,
			},
			declared,
		);
	} catch (err) {
		console.error(`could not parse the report: ${(err as Error).message}`);
		process.exit(2);
	}

	const block = renderBlock(ledger);

	if (args.json) {
		console.log(JSON.stringify(ledger, null, 2));
	} else {
		console.log(block);
	}

	if (typeof args.out === "string") {
		writeFileSync(args.out, block);
	}

	if (typeof args.pr === "string") {
		try {
			upsertBlock(block, {
				prNumber: Number.parseInt(args.pr, 10),
				repo: typeof args.repo === "string" ? args.repo : undefined,
				destination: args.destination === "body" ? "body" : "comment",
			});
		} catch (err) {
			console.error(`PR upsert failed: ${(err as Error).message}`);
			process.exit(2);
		}
	}

	const failOn = typeof args["fail-on"] === "string" ? args["fail-on"] : "fail";
	if (failOn === "never") process.exit(0);
	if (ledger.verdict === "NOT_VERIFIED") process.exit(1);
	if (failOn === "unverified" && ledger.verdict !== "VERIFIED") process.exit(1);
	process.exit(0);
}

main();
