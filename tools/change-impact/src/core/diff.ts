import { execFileSync } from "node:child_process";

export interface DiffResult {
	stat: string;
	full: string;
	truncated: boolean;
	baseSha: string;
	headSha: string;
}

export interface DiffOptions {
	base: string;
	head?: string;
	maxChars?: number; // truncate if full diff exceeds this (rough: 4 chars ≈ 1 token)
	cwd?: string;
}

const DEFAULT_MAX_CHARS = 200_000; // ~50k tokens

/**
 * Reject git refs containing shell metacharacters. Defense-in-depth: even
 * though execFileSync bypasses the shell, a malformed ref is never a valid
 * git object name and should fail fast with a clear error.
 */
function validateRef(ref: string): string {
	if (/[;|&$`\n\r\\]/.test(ref)) {
		throw new Error(`invalid git ref: ${JSON.stringify(ref)}`);
	}
	return ref;
}

/**
 * Get the git diff between base and head. Truncates if the full diff exceeds
 * maxChars, keeping the stat + file headers + files with >50 line changes.
 */
export function getDiff(opts: DiffOptions): DiffResult {
	const { head = "HEAD", maxChars = DEFAULT_MAX_CHARS, cwd } = opts;
	const base = validateRef(opts.base);
	const validatedHead = validateRef(head);

	const baseSha = execFileSync("git", ["rev-parse", "--short", base], {
		encoding: "utf8",
		cwd,
	}).trim();
	const headSha = execFileSync("git", ["rev-parse", "--short", validatedHead], {
		encoding: "utf8",
		cwd,
	}).trim();

	const stat = execFileSync("git", ["diff", `${base}...${validatedHead}`, "--stat"], {
		encoding: "utf8",
		cwd,
	});

	const full = execFileSync("git", ["diff", `${base}...${validatedHead}`], {
		encoding: "utf8",
		cwd,
	});

	if (full.length <= maxChars) {
		return { stat, full, truncated: false, baseSha, headSha };
	}

	// Truncate: keep stat + diffs for files with >50 changed lines.
	// The stat string is always included in the output, so its size must be
	// counted against the budget; otherwise a huge stat (hundreds of files)
	// could blow the token budget when combined with the kept file diffs.
	const statChars = stat.length;
	const remainingBudget = maxChars - statChars;
	if (remainingBudget <= 0) {
		// stat alone exceeds budget — return stat only
		return { stat, full: stat, truncated: true, baseSha, headSha };
	}

	const fileDiffs = full.split(/^diff --git /m).filter(Boolean);
	const keptDiffs: string[] = [];
	let keptChars = 0;

	for (const chunk of fileDiffs) {
		const diffBlock = "diff --git " + chunk;
		// Count changed lines in this file's diff
		const changedLines = (diffBlock.match(/^[+-]/gm) || []).length;
		if (changedLines > 50 && keptChars + diffBlock.length <= remainingBudget) {
			keptDiffs.push(diffBlock);
			keptChars += diffBlock.length;
		}
	}

	const truncatedFull = keptDiffs.join("\n\n");
	return {
		stat,
		full: truncatedFull || stat,
		truncated: true,
		baseSha,
		headSha,
	};
}
