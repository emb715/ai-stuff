import { existsSync, readFileSync } from "node:fs";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { parseCriteria } from "../core/criteria.js";
import { buildLedger, renderBlock, START_MARKER } from "../core/ledger.js";
import { parseReport } from "../core/report.js";
import { runSuite } from "../core/run.js";

async function run(): Promise<void> {
	try {
		const url = core.getInput("url") || undefined;
		const criteriaPath = core.getInput("criteria");
		const reportPath = core.getInput("report");
		const environment = core.getInput("environment") || undefined;
		const failOn = core.getInput("fail-on") || "fail";
		const token = core.getInput("github-token");

		const build =
			core.getInput("build") || github.context.payload.pull_request?.head?.sha ||
			github.context.sha;

		let declared: string[] = [];
		if (criteriaPath) {
			if (!existsSync(criteriaPath)) {
				core.setFailed(`criteria file not found: ${criteriaPath}`);
				return;
			}
			declared = parseCriteria(readFileSync(criteriaPath, "utf8"));
			if (declared.length === 0) {
				core.setFailed(
					`no AC<n> criteria found in ${criteriaPath}. Criteria must be identified as AC1, AC2, …`,
				);
				return;
			}
		}

		const reportJson = reportPath
			? readFileSync(reportPath, "utf8")
			: runSuite({ url });

		const ledger = buildLedger(parseReport(reportJson), { build, url, environment }, declared);
		const block = renderBlock(ledger);

		core.setOutput("verdict", ledger.verdict);
		core.setOutput("block", block);
		core.setOutput(
			"unverified",
			String(ledger.rows.filter((r) => r.state === "unverified").length),
		);
		core.summary.addRaw(block).write().catch(() => {});

		const prNumber = github.context.payload.pull_request?.number;
		if (token && prNumber) {
			const octokit = github.getOctokit(token);
			const { owner, repo } = github.context.repo;

			const { data: comments } = await octokit.rest.issues.listComments({
				owner,
				repo,
				issue_number: prNumber,
				per_page: 100,
			});
			const existing = comments.find((c) => (c.body ?? "").includes(START_MARKER));

			if (existing) {
				await octokit.rest.issues.updateComment({
					owner,
					repo,
					comment_id: existing.id,
					body: block,
				});
			} else {
				await octokit.rest.issues.createComment({
					owner,
					repo,
					issue_number: prNumber,
					body: block,
				});
			}
		}

		if (failOn === "never") return;
		if (ledger.verdict === "NOT_VERIFIED") {
			core.setFailed(`acceptance verification: ${ledger.verdict}`);
			return;
		}
		if (failOn === "unverified" && ledger.verdict !== "VERIFIED") {
			core.setFailed(
				`acceptance verification: ${ledger.verdict} — unverified criteria are not passes`,
			);
		}
	} catch (err) {
		core.setFailed((err as Error).message);
	}
}

void run();
