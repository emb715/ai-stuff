/**
 * GitHub Action entry point for the change-impact tool.
 *
 * Runs the change-impact-diagram skill on a pull request:
 *   1. Read Action inputs (llm, api-key, skill-path, max-tokens, github-token)
 *   2. Read PR context from the event payload (number, base.ref, head.ref)
 *   3. Set the LLM API key env var if an explicit key was provided
 *   4. getDiff → loadSkill → assemblePrompt → detectLLM
 *   5. If an LLM provider is available: call it, extract the marker block,
 *      and upsert the block into the PR body via the GitHub API
 *      (Octokit `pulls.update`), replacing any existing block.
 *   6. If no LLM is available: post a comment with the self-contained prompt
 *      bundle (system + user) via Octokit `issues.createComment`.
 *   7. On error: core.setFailed. On success: core.setOutput('block', ...).
 */
import * as core from "@actions/core";
import * as github from "@actions/github";
import { getDiff } from "../core/diff.js";
import { assemblePrompt } from "../core/prompt.js";
import { detectLLM } from "../core/llm.js";
import { extractBlock, START_MARKER, END_MARKER } from "../core/parse.js";
import { loadSkill } from "../skill-fallback.js";

/**
 * Map the `llm` input to the env var name that holds its API key.
 * Returns null for providers that need no key (ollama, claude CLI, none).
 */
function apiKeyEnvForLLM(llm: string): string | null {
	switch (llm) {
		case "anthropic":
		case "claude":
			return "ANTHROPIC_API_KEY";
		case "openai":
			return "OPENAI_API_KEY";
		case "fuelix":
			return "FUELX_API_KEY";
		case "omniroute":
			return "OMNIROUTE_API_KEY";
		case "auto":
			// auto-detect priority 1 is Anthropic; set that env so detection
			// picks it up when an explicit key was provided.
			return "ANTHROPIC_API_KEY";
		default:
			return null; // ollama, none — no API key env
	}
}

/**
 * Splice the block into the PR body via the GitHub API.
 * Replaces content between markers if present, appends otherwise.
 * Never touches text outside the markers.
 */
async function upsertBlockViaApi(
	octokit: ReturnType<typeof github.getOctokit>,
	owner: string,
	repo: string,
	prNumber: number,
	block: string,
): Promise<void> {
	const { data: pr } = await octokit.rest.pulls.get({
		owner,
		repo,
		pull_number: prNumber,
	});

	const body = pr.body ?? "";
	const startIndex = body.indexOf(START_MARKER);
	const endIndex = body.indexOf(END_MARKER);
	const hasExistingBlock =
		startIndex !== -1 && endIndex !== -1 && endIndex > startIndex;

	const trimmedBlock = block.trim();
	const nextBody = hasExistingBlock
		? body.slice(0, startIndex) +
			trimmedBlock +
			body.slice(endIndex + END_MARKER.length)
		: `${body.trimEnd()}\n\n${trimmedBlock}\n`;

	await octokit.rest.pulls.update({
		owner,
		repo,
		pull_number: prNumber,
		body: nextBody,
	});

	core.info(
		hasExistingBlock
			? `updated change-impact block on PR #${prNumber}`
			: `added change-impact block to PR #${prNumber}`,
	);
}

/**
 * Post a comment with the self-contained prompt bundle when no LLM is
 * available. The comment contains the system prompt (skill) and the user
 * prompt (diff + instructions) so a human can paste them into any session.
 */
async function postPromptBundleComment(
	octokit: ReturnType<typeof github.getOctokit>,
	owner: string,
	repo: string,
	prNumber: number,
	system: string,
	user: string,
): Promise<void> {
	const commentBody = [
		"## change-impact — no LLM available",
		"",
		"No LLM provider was detected. Below is the self-contained prompt bundle.",
		"Paste the **System prompt** into your LLM session, then the **User prompt**,",
		"and run the skill manually.",
		"",
		"<details>",
		"<summary>System prompt (SKILL.md)</summary>",
		"",
		"```markdown",
		system,
		"```",
		"",
		"</details>",
		"",
		"<details>",
		"<summary>User prompt (diff + instructions)</summary>",
		"",
		"```markdown",
		user,
		"```",
		"",
		"</details>",
	].join("\n");

	await octokit.rest.issues.createComment({
		owner,
		repo,
		issue_number: prNumber,
		body: commentBody,
	});

	core.info(
		`posted prompt-bundle comment on PR #${prNumber} (no LLM available)`,
	);
}

async function run(): Promise<void> {
	try {
		// 1. Read inputs
		const llm = core.getInput("llm") || "auto";
		const apiKey = core.getInput("api-key");
		const skillPath =
			core.getInput("skill-path") || "skills/change-impact-diagram/SKILL.md";
		const maxTokensStr = core.getInput("max-tokens") || "50000";
		const maxTokens = Number.parseInt(maxTokensStr, 10);
		if (!Number.isFinite(maxTokens) || maxTokens <= 0) {
			throw new Error(
				`invalid max-tokens input "${maxTokensStr}"; expected a positive integer`,
			);
		}

		// 2. PR context
		const payload = github.context.payload.pull_request;
		if (!payload) {
			throw new Error(
				"no pull_request in event payload; this Action must run on pull_request events",
			);
		}
		const prNumber = payload.number;
		const baseRef = payload.base?.ref;
		const headRef = payload.head?.ref;
		if (!prNumber || !baseRef || !headRef) {
			throw new Error(
				`incomplete pull_request payload: number=${prNumber}, base.ref=${baseRef}, head.ref=${headRef}`,
			);
		}

		// 3. Set API key env var if provided
		if (apiKey) {
			if (llm === "auto") {
			process.env.ANTHROPIC_API_KEY = apiKey;
			process.env.OPENAI_API_KEY = apiKey;
			process.env.FUELX_API_KEY = apiKey;
			process.env.FUELIX_API_KEY = apiKey;
			process.env.OMNIROUTE_API_KEY = apiKey;
			core.info(
				"api-key provided with llm=auto; setting all provider env vars — detection will use whichever is valid",
			);
			} else {
				const envName = apiKeyEnvForLLM(llm);
				if (envName) {
					process.env[envName] = apiKey;
					core.info(`set ${envName} from api-key input`);
				} else {
					core.info(
						`api-key input ignored; llm="${llm}" does not use an API key env var`,
					);
				}
			}
		}

		// 4. Core pipeline: diff → skill → prompt → detect
		const diff = getDiff({
			base: baseRef,
			head: headRef,
			maxChars: maxTokens * 4,
		});
		if (diff.truncated) {
			core.info(
				`diff truncated to ${diff.full.length} chars (max-tokens=${maxTokens})`,
			);
		}

		const skillContent = loadSkill(skillPath);
		const { system, user } = assemblePrompt(skillContent, diff);
		const provider = await detectLLM({ force: llm });

		// Octokit for API upsert / comment
		const token =
			core.getInput("github-token") || process.env.GITHUB_TOKEN || "";
		if (!token) {
			throw new Error(
				"no GITHUB_TOKEN available; set the github-token input or ensure GITHUB_TOKEN is in the env",
			);
		}
		const octokit = github.getOctokit(token);
		const { owner, repo } = github.context.repo;

		// 5. LLM path: call, extract, upsert
		if (provider) {
			core.info(`using LLM provider: ${provider.name}`);
			// AC1: block in PR description within 60s. The LLM call gets a 55s
			// timeout, leaving ~5s for extraction + upsert. A slow LLM that
			// would silently exceed 60s instead rejects here and propagates
			// to the catch block which calls core.setFailed.
			const LLM_TIMEOUT_MS = 55_000;
			const output = await Promise.race([
				provider.call(system, user),
				new Promise<never>((_, reject) =>
					setTimeout(
						() => reject(new Error("LLM call timed out after 55s")),
						LLM_TIMEOUT_MS,
					),
				),
			]);
			const block = extractBlock(output);
			if (!block) {
				throw new Error(
					"LLM output did not contain a valid change-impact block (missing start/end markers)",
				);
			}
			await upsertBlockViaApi(octokit, owner, repo, prNumber, block);
			core.setOutput("block", block);
			return;
		}

		// 6. No-LLM path: post prompt bundle as a comment
		await postPromptBundleComment(octokit, owner, repo, prNumber, system, user);
		core.setOutput("block", "");
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		} else {
			core.setFailed(String(error));
		}
	}
}

void run();