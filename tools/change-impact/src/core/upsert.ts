import { execFileSync } from "node:child_process";
import { START_MARKER, END_MARKER } from "./parse.js";

export interface UpsertOptions {
	/** PR number */
	prNumber: number;
	/** Repo in org/name format (for gh CLI: --repo flag) */
	repo?: string;
	/** Working directory for gh CLI */
	cwd?: string;
	/** Mode: "gh" shells out to gh CLI, "api" uses GitHub API token */
	mode?: "gh" | "api";
	/** GitHub token for API mode (required if mode is "api") */
	token?: string;
}

/**
 * Reject repo strings containing shell metacharacters. Defense-in-depth:
 * execFileSync bypasses the shell, but a malformed --repo value is never
 * a valid org/name and should fail fast.
 */
function validateRepo(repo: string): string {
	if (/[;|&$`\n\r\\]/.test(repo)) {
		throw new Error(`invalid repo: ${JSON.stringify(repo)}`);
	}
	return repo;
}

/**
 * Upsert a change-impact block into a PR description.
 * Replaces content between markers if they exist, appends if not.
 * Never touches text outside the markers.
 *
 * This is a port of skills/change-impact-diagram/scripts/upsert-impact-block.mjs
 * into a shared module. Same splice logic, callable from both Action and CLI.
 */
export function upsertBlock(block: string, opts: UpsertOptions): void {
	const { prNumber, repo, cwd, mode = "gh" } = opts;

	const trimmedBlock = block.trim();
	if (!trimmedBlock.startsWith(START_MARKER) || !trimmedBlock.endsWith(END_MARKER)) {
		throw new Error(
			`block must start with "${START_MARKER}" and end with "${END_MARKER}"`,
		);
	}

	const validatedRepo = repo ? validateRepo(repo) : undefined;

	// Fetch current PR body
	const viewArgs = ["pr", "view", String(prNumber)];
	if (validatedRepo) viewArgs.push("--repo", validatedRepo);
	viewArgs.push("--json", "body", "--jq", ".body");
	const body = execFileSync("gh", viewArgs, { encoding: "utf8", cwd });

	const startIndex = body.indexOf(START_MARKER);
	const endIndex = body.indexOf(END_MARKER);
	const hasExistingBlock =
		startIndex !== -1 && endIndex !== -1 && endIndex > startIndex;

	const nextBody = hasExistingBlock
		? body.slice(0, startIndex) + trimmedBlock + body.slice(endIndex + END_MARKER.length)
		: `${body.trimEnd()}\n\n${trimmedBlock}\n`;

	// Write back via gh pr edit with --body-file -
	const editArgs = ["pr", "edit", String(prNumber)];
	if (validatedRepo) editArgs.push("--repo", validatedRepo);
	editArgs.push("--body-file", "-");
	execFileSync("gh", editArgs, {
		input: nextBody,
		encoding: "utf8",
		cwd,
	});

	if (hasExistingBlock) {
		console.log(`updated change-impact block on PR #${prNumber}`);
	} else {
		console.log(`added change-impact block to PR #${prNumber}`);
	}
}

/**
 * Fetch the current PR body. Used for reading before upsert.
 */
export function getPRBody(prNumber: number, opts: { repo?: string; cwd?: string }): string {
	const validatedRepo = opts.repo ? validateRepo(opts.repo) : undefined;
	const viewArgs = ["pr", "view", String(prNumber)];
	if (validatedRepo) viewArgs.push("--repo", validatedRepo);
	viewArgs.push("--json", "body", "--jq", ".body");
	return execFileSync("gh", viewArgs, { encoding: "utf8", cwd: opts.cwd });
}
