#!/usr/bin/env node
/**
 * change-impact CLI entry point.
 *
 * Two modes:
 * - **Non-interactive** — when the `CI` env var is set or `--pr` is provided,
 *   flags are used directly and no prompts are shown.
 * - **Interactive** — otherwise, `@clack/prompts` walks the user through LLM
 *   selection, base branch, and upsert-vs-output, then runs the core pipeline.
 *
 * Core pipeline in both modes:
 *   getDiff → loadSkill → assemblePrompt → detectLLM → call → extractBlock
 *   (or writePromptBundle when `--llm none`).
 */

import * as p from "@clack/prompts";
import { writeFileSync } from "node:fs";

import { getDiff } from "../core/diff.js";
import { assemblePrompt } from "../core/prompt.js";
import { detectLLM } from "../core/llm.js";
import { extractBlock } from "../core/parse.js";
import { upsertBlock } from "../core/upsert.js";
import { loadSkill } from "../skill-fallback.js";
import { writePromptBundle } from "../providers/fallback.js";

// Suppress Node deprecation warnings (punycode, url.parse, etc.) emitted by
// upstream SDK dependencies we can't fix. Intercepting process.emit drops
// "warning" events silently. This runs after ESM import resolution, so warnings
// triggered during module evaluation may still escape — see humans note.
const originalEmit = process.emit.bind(process) as (
	name: string,
	...args: unknown[]
) => boolean;
process.emit = function (name: string, ...args: unknown[]): boolean {
	if (name === "warning") {
		return false;
	}
	return originalEmit(name, ...args);
} as typeof process.emit;

/** Compact single-line progress — no bars, no blank lines. */
function step(msg: string): void {
	if (process.stdout.isTTY) {
		// Clear the current line before writing (in case a spinner was running),
		// then emit a clean `›` marker — no `│` bars, no blank line padding.
		process.stderr.write(`\r\x1b[K    › ${msg}\n`);
	} else {
		console.error(`› ${msg}`);
	}
}

/** Warning step — yellow ⚠ prefix. */
function stepWarn(msg: string): void {
	if (process.stdout.isTTY) {
		process.stderr.write(`\r\x1b[K    ⚠ ${msg}\n`);
	} else {
		console.error(`⚠ ${msg}`);
	}
}

/** Success step — green ✓ prefix. */
function stepOk(msg: string): void {
	if (process.stdout.isTTY) {
		process.stderr.write(`\r\x1b[K    ✓ ${msg}\n`);
	} else {
		console.error(`✓ ${msg}`);
	}
}

/**
 * Start an animated spinner for a long-running step. In a TTY, animates a braille
 * spinner on a single line via `\r` overwrites — no clack frames, so no `│`/`◇`
 * markers leak into the stepper aesthetic. In non-TTY (piped) environments,
 * degrades to a plain `›` message and returns a stop that logs the final result
 * with a `✓` marker.
 */
function startSpinner(msg: string): { stop: (finalMsg: string) => void } {
	if (process.stdout.isTTY) {
		const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
		let i = 0;
		const interval = setInterval(() => {
			process.stderr.write(`\r\x1b[K    ${frames[i]} ${msg}`);
			i = (i + 1) % frames.length;
		}, 80);
		return {
			stop: (finalMsg: string) => {
				clearInterval(interval);
				process.stderr.write(`\r\x1b[K    ✓ ${finalMsg}\n`);
			},
		};
	}
	console.error(`› ${msg}`);
	return {
		stop: (finalMsg: string) => {
			console.error(`✓ ${finalMsg}`);
		},
	};
}

/** CLI options parsed from argv. */
interface CliArgs {
	pr?: number;
	repo?: string;
	output?: string;
	llm:
		| "auto"
		| "claude"
		| "openai"
		| "fuelix"
		| "omniroute"
		| "ollama"
		| "none";
	base: string;
	head: string;
	maxTokens: number;
}

/** Default prompt-bundle filename when --output is not given. */
const DEFAULT_BUNDLE_PATH = "change-impact-prompt.md";

/** Rough char→token ratio used to convert --max-tokens into a char budget. */
const CHARS_PER_TOKEN = 4;

/**
 * Parse process.argv into a CliArgs object.
 * Unknown flags are ignored; missing flags fall back to defaults.
 */
function parseArgs(argv: string[]): CliArgs {
	const args: CliArgs = {
		llm: "auto",
		base: "main",
		head: "HEAD",
		maxTokens: 50_000,
	};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		const next = argv[i + 1];
		switch (arg) {
			case "--pr":
				if (next !== undefined) {
					args.pr = Number.parseInt(next, 10);
					i++;
				}
				break;
			case "--repo":
				if (next !== undefined) {
					args.repo = next;
					i++;
				}
				break;
			case "--output":
				if (next !== undefined) {
					args.output = next;
					i++;
				}
				break;
			case "--llm":
				if (next !== undefined) {
					args.llm = next as CliArgs["llm"];
					i++;
				}
				break;
			case "--base":
				if (next !== undefined) {
					args.base = next;
					i++;
				}
				break;
			case "--head":
				if (next !== undefined) {
					args.head = next;
					i++;
				}
				break;
			case "--max-tokens":
				if (next !== undefined) {
					args.maxTokens = Number.parseInt(next, 10);
					i++;
				}
				break;
			default:
				// Ignore unknown flags (e.g. --help, Node flags)
				break;
		}
	}

	return args;
}

/** True when the user wants non-interactive mode: CI, PR upsert, file output, or `--llm none`. */
function isNonInteractive(args: CliArgs): boolean {
	return (
		process.env.CI !== undefined ||
		args.pr !== undefined ||
		args.output !== undefined ||
		args.llm === "none"
	);
}

/** Run the core pipeline against the given args. Returns the block or null. */
async function runCore(args: CliArgs): Promise<string | null> {
	step("loading skill...");
	const skill = loadSkill();

	step(`getting diff (${args.base}...${args.head})...`);
	const diff = getDiff({
		base: args.base,
		head: args.head,
		maxChars: args.maxTokens * CHARS_PER_TOKEN,
	});

	if (diff.truncated) {
		stepWarn(`diff truncated to ${diff.full.length} chars`);
	}

	// Empty diff: produce a minimal "no changes" block locally, skip the LLM.
	if (diff.stat.trim() === "" && diff.full.trim() === "") {
		const emptyBlock = `<!-- change-impact:start -->

### Change impact

![risk](https://img.shields.io/badge/risk-low-green) ![op](https://img.shields.io/badge/op-none-green)

<details>
<summary>Change impact — <b>no changes</b> (low risk)</summary>

**Mode:** recap · **Base:** \`${args.base}\` @ \`${diff.baseSha}\` · **Head:** \`${diff.headSha}\`

**Classification:** composes — no changes were found in the diff.

</details>

<!-- change-impact:end -->`;
		stepOk("no changes detected — produced empty-impact block without LLM call");
		return emptyBlock;
	}

	const { system, user } = assemblePrompt(skill, diff, args.repo);

	// Fallback path: write the prompt bundle, no LLM call.
	if (args.llm === "none") {
		const outPath = args.output ?? DEFAULT_BUNDLE_PATH;
		await writePromptBundle(system, user, outPath);
		step(`prompt bundle written to ${outPath}`);
		return null;
	}

	const force = args.llm === "auto" ? undefined : args.llm;
	step("detecting LLM provider...");
	const provider = await detectLLM(force ? { force } : undefined);

	if (provider === null) {
		const outPath = args.output ?? DEFAULT_BUNDLE_PATH;
		await writePromptBundle(system, user, outPath);
		stepWarn(`no LLM provider available — prompt bundle written to ${outPath}`);
		return null;
	}

	// Long-running LLM call — animated spinner in TTY, plain step in non-TTY.
	const spinner = startSpinner(`calling ${provider.name}...`);
	const raw = await provider.call(system, user);
	spinner.stop(`called ${provider.name}`);

	step("parsing output...");
	const block = extractBlock(raw);
	if (block === null) {
		stepWarn("LLM output did not contain change-impact markers");
		console.error(raw);
	}
	return block;
}

/**
 * Interactive flow via @clack/prompts. Mutates `args` with the user's choices
 * and returns the (possibly updated) args, or exits on cancel.
 */
async function interactiveFlow(args: CliArgs): Promise<CliArgs> {
	p.intro("change-impact");

	// 1. LLM selection
	const llm = await p.select({
		message: "Which LLM?",
		options: [
			{ value: "auto" as const, label: "Auto-detect", hint: "default" },
			{ value: "claude" as const, label: "Claude (Anthropic)" },
			{ value: "openai" as const, label: "OpenAI" },
			{ value: "fuelix" as const, label: "Fuelix AI" },
			{ value: "omniroute" as const, label: "Omniroute" },
			{ value: "ollama" as const, label: "Ollama (local)" },
			{
				value: "none" as const,
				label: "None — output prompt bundle",
			},
		],
	});
	if (p.isCancel(llm)) {
		p.cancel("Cancelled");
		process.exit(0);
	}
	args.llm = llm as CliArgs["llm"];

	// 2. Base branch
	const base = await p.text({
		message: "Base branch",
		placeholder: "main",
		initialValue: "main",
	});
	if (p.isCancel(base)) {
		p.cancel("Cancelled");
		process.exit(0);
	}
	args.base = base.trim() || "main";

	// 3. Upsert to PR or output to file?
	const upsertToPr = await p.confirm({
		message: "Upsert the block to a PR description?",
	});
	if (p.isCancel(upsertToPr)) {
		p.cancel("Cancelled");
		process.exit(0);
	}

	if (upsertToPr) {
		const prInput = await p.text({
			message: "PR number",
			placeholder: "123",
			validate: (v) =>
				v.trim() === "" || Number.isNaN(Number.parseInt(v, 10))
					? "Enter a valid PR number"
					: undefined,
		});
		if (p.isCancel(prInput)) {
			p.cancel("Cancelled");
			process.exit(0);
		}
		args.pr = Number.parseInt(prInput.trim(), 10);
	} else {
		const outputPath = await p.text({
			message: "Output file (blank = stdout)",
			placeholder: "change-impact-block.md",
			initialValue: "",
		});
		if (p.isCancel(outputPath)) {
			p.cancel("Cancelled");
			process.exit(0);
		}
		args.output = outputPath.trim() || undefined;
	}

	// Confirmation summary before running
	const action = args.pr !== undefined
		? `upsert block to PR #${args.pr}`
		: args.output
			? `write block to ${args.output}`
			: "write block to stdout";

	const llmLabel = args.llm === "auto" ? "auto-detect LLM" : `LLM: ${args.llm}`;
	const confirmed = await p.confirm({
		message: `${llmLabel} on diff ${args.base}...${args.head}, then ${action}. Proceed?`,
		initialValue: true,
	});
	if (p.isCancel(confirmed)) {
		p.cancel("Cancelled");
		process.exit(0);
	}
	if (!confirmed) {
		p.cancel("Aborted");
		process.exit(0);
	}

	return args;
}

/** Deliver the block: upsert to PR, write to file, or print to stdout. */
function deliverBlock(block: string, args: CliArgs): void {
	if (args.pr !== undefined) {
		upsertBlock(block, {
			prNumber: args.pr,
			repo: args.repo,
			mode: "gh",
		});
		stepOk(`block upserted to PR #${args.pr}`);
		if (process.stdout.isTTY) {
			process.stderr.write(`\n    done\n`);
		}
		return;
	}

	if (args.output) {
		writeFileSync(args.output, block, "utf8");
		stepOk(`block written to ${args.output}`);
		if (process.stdout.isTTY) {
			process.stderr.write(`\n    done\n`);
		}
		return;
	}

	// stdout
	process.stdout.write(`${block}\n`);
	stepOk("block written to stdout");
	if (process.stdout.isTTY) {
		process.stderr.write(`\n    done\n`);
	}
}

/**
 * Run the CLI. Parses argv, branches into interactive or non-interactive mode,
 * runs the core pipeline, and delivers the result.
 */
export async function runCli(): Promise<void> {
	const args = parseArgs(process.argv.slice(2));

	// Clean header — no `│` bars, no blank-line padding.
	const mode = isNonInteractive(args) ? "non-interactive" : "interactive";
	const llmLabel = args.llm === "auto" ? "auto-detect" : args.llm;
	if (process.stdout.isTTY) {
		process.stderr.write(
			`\n  change-impact\n  ${"─".repeat(40)}\n  ${mode} · LLM: ${llmLabel} · diff: ${args.base}...${args.head}\n\n`,
		);
	} else {
		console.error(
			`change-impact — ${mode} mode, LLM: ${llmLabel}, diff: ${args.base}...${args.head}`,
		);
	}

	if (!isNonInteractive(args)) {
		await interactiveFlow(args);
	}

	const block = await runCore(args);

	if (block === null) {
		// Fallback path already wrote the bundle and logged.
		if (!isNonInteractive(args)) {
			stepOk("prompt bundle ready");
			if (process.stdout.isTTY) {
				process.stderr.write(`\n    done\n`);
			}
		}
		return;
	}

	if (!isNonInteractive(args)) {
		deliverBlock(block, args);
		return;
	}

	// Non-interactive delivery
	if (args.pr !== undefined) {
		upsertBlock(block, {
			prNumber: args.pr,
			repo: args.repo,
			mode: "gh",
		});
		stepOk(`block upserted to PR #${args.pr}`);
		return;
	}

	if (args.output) {
		writeFileSync(args.output, block, "utf8");
		stepOk(`block written to ${args.output}`);
		return;
	}

	process.stdout.write(`${block}\n`);
}

runCli().catch((err) => {
	console.error(err);
	process.exit(1);
});