import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(__dirname, "../../workflow-state.json");

export type StepType = "plan-refine" | "implementation" | "review";
export type StepShape = "default" | "strict" | "fast";
export type AdvancementMode = "auto" | "require-review" | "require-approval";
export type OnFail = "retry" | "stop" | "escalate";
export type StepStatus = "pending" | "running" | "done" | "failed" | "skipped";
export type WorkflowStatus = "pending" | "running" | "blocked" | "done";

export interface Step {
  type: StepType;
  shape: StepShape;
  advancement: AdvancementMode;
  on_fail: OnFail;
  status: StepStatus;
  prompt: string;
  output: string | null;
  advancement_decision: string | null;
  blockers: string[];
}

export interface Workflow {
  id: string;
  plan_path: string;
  current_step_index: number;
  status: WorkflowStatus;
  steps: Step[];
}

export type State = Record<string, Workflow>;

export function loadState(): State {
  if (!existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8")) as State;
  } catch {
    return {};
  }
}

export function saveState(state: State): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function getWorkflow(state: State, workflow_id: string): Workflow | null {
  return state[workflow_id] ?? null;
}
