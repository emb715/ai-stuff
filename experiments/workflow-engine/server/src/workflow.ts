import { type Workflow, type Step } from "./state.js";

/**
 * Hardcoded 3-step MVP workflow definition.
 * This is the only workflow shape for the validation run.
 * No builder, no UI, no dynamic config.
 */
export function createWorkflow(id: string, plan_path: string): Workflow {
  const steps: Step[] = [
    {
      type: "plan-refine",
      shape: "default",
      advancement: "require-approval",
      on_fail: "stop",
      status: "pending",
      prompt: buildPrompt("plan-refine", plan_path),
      output: null,
      advancement_decision: null,
      blockers: [],
    },
    {
      type: "implementation",
      shape: "default",
      advancement: "require-review",
      on_fail: "stop",
      status: "pending",
      prompt: buildPrompt("implementation", plan_path),
      output: null,
      advancement_decision: null,
      blockers: [],
    },
    {
      type: "review",
      shape: "default",
      advancement: "require-approval",
      on_fail: "stop",
      status: "pending",
      prompt: buildPrompt("review", plan_path),
      output: null,
      advancement_decision: null,
      blockers: [],
    },
  ];

  return {
    id,
    plan_path,
    current_step_index: 0,
    status: "running",
    steps,
  };
}

function buildPrompt(type: string, plan_path: string): string {
  const prompts: Record<string, string> = {
    "plan-refine": `Read the plan at ${plan_path}. Identify gaps, ambiguities, and missing acceptance criteria. Produce a refined plan with explicit implementation order and success criteria. Output the refined plan.`,
    "implementation": `Read the plan at ${plan_path}. Implement all requirements in order. Run relevant tests after each change. Output: changed files, test results, and a readiness verdict.`,
    "review": `Read the plan at ${plan_path}. Review all changes produced by the implementation step. Check for correctness, coverage, and alignment with plan. Output: pass/fail verdict with specific findings.`,
  };
  return prompts[type] ?? `Execute ${type} step for plan at ${plan_path}.`;
}
