import { execFileSync } from "node:child_process";
import { END_MARKER, START_MARKER } from "./ledger.js";

export interface UpsertOptions {
	/** PR number */
	prNumber: number;
	/** Repo in org/name format (for gh CLI: --repo flag) */
	repo?: string;
	/** Working directory for gh CLI */
	cwd?: string;
	/** Where to write: the PR body, or a sticky comment */
	destination?: "body" | "comment";
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
 * Splice a marked block into existing text: replace between markers if present,
 * append otherwise. Never touches anything outside the markers.
 *
 * Exported for tests — this is the logic worth pinning, not the gh plumbing.
 */
export function spliceBlock(existing: string, block: string): string {
	const trimmed = block.trim();
	if (!trimmed.startsWith(START_MARKER) || !trimmed.endsWith(END_MARKER)) {
		throw new Error(
			`block must start with "${START_MARKER}" and end with "${END_MARKER}"`,
		);
	}

	const start = existing.indexOf(START_MARKER);
	const end = existing.indexOf(END_MARKER);
	const hasExisting = start !== -1 && end !== -1 && end > start;

	return hasExisting
		? existing.slice(0, start) + trimmed + existing.slice(end + END_MARKER.length)
		: `${existing.trimEnd()}\n\n${trimmed}\n`;
}

function gh(args: string[], opts: { cwd?: string; input?: string }): string {
	return execFileSync("gh", args, {
		encoding: "utf8",
		cwd: opts.cwd,
		input: opts.input,
	});
}

/** Fetch the current PR body. */
export function getPRBody(prNumber: number, opts: { repo?: string; cwd?: string }): string {
	const repo = opts.repo ? validateRepo(opts.repo) : undefined;
	const args = ["pr", "view", String(prNumber)];
	if (repo) args.push("--repo", repo);
	args.push("--json", "body", "--jq", ".body");
	return gh(args, { cwd: opts.cwd });
}

/**
 * Upsert the verification block onto a PR.
 *
 * Default destination is a sticky comment rather than the PR body: a
 * verification result changes on every run, and rewriting the author's
 * description on each CI run is more intrusive than this tool needs to be.
 * Pass `destination: "body"` to match the change-impact tool's behaviour.
 */
export function upsertBlock(block: string, opts: UpsertOptions): void {
	const { prNumber, cwd, destination = "comment" } = opts;
	const repo = opts.repo ? validateRepo(opts.repo) : undefined;

	if (destination === "body") {
		const body = getPRBody(prNumber, { repo, cwd });
		const next = spliceBlock(body, block);
		const args = ["pr", "edit", String(prNumber)];
		if (repo) args.push("--repo", repo);
		args.push("--body-file", "-");
		gh(args, { cwd, input: next });
		console.log(`upserted verification block into PR #${prNumber} body`);
		return;
	}

	// Sticky comment: find an existing comment carrying our marker, edit it if
	// found, otherwise create one.
	const listArgs = ["pr", "view", String(prNumber)];
	if (repo) listArgs.push("--repo", repo);
	listArgs.push("--json", "comments");
	const raw = gh(listArgs, { cwd });

	let existingId: string | undefined;
	let existingBody = "";
	try {
		const parsed = JSON.parse(raw) as {
			comments?: { id?: string; url?: string; body?: string }[];
		};
		const hit = (parsed.comments ?? []).find((c) => (c.body ?? "").includes(START_MARKER));
		if (hit) {
			existingId = hit.url ?? hit.id;
			existingBody = hit.body ?? "";
		}
	} catch {
		// A malformed comments payload is not worth failing the run over —
		// fall through and post a fresh comment.
	}

	if (existingId) {
		const args = ["pr", "comment", String(prNumber)];
		if (repo) args.push("--repo", repo);
		args.push("--edit-last", "--body-file", "-");
		gh(args, { cwd, input: spliceBlock(existingBody, block) });
		console.log(`updated verification comment on PR #${prNumber}`);
	} else {
		const args = ["pr", "comment", String(prNumber)];
		if (repo) args.push("--repo", repo);
		args.push("--body-file", "-");
		gh(args, { cwd, input: block.trim() });
		console.log(`added verification comment to PR #${prNumber}`);
	}
}
