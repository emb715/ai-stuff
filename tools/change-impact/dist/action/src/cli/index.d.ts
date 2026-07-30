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
/**
 * Run the CLI. Parses argv, branches into interactive or non-interactive mode,
 * runs the core pipeline, and delivers the result.
 */
export declare function runCli(): Promise<void>;
