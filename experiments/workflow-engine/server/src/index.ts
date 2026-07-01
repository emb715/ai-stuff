import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadState, saveState, getWorkflow } from "./state.js";
import { createWorkflow } from "./workflow.js";

const server = new McpServer({
  name: "workflow-engine",
  version: "0.1.0",
});

// ---------------------------------------------------------------------------
// Tool: create_workflow
// Initialize a new workflow from a plan path.
// ---------------------------------------------------------------------------
server.registerTool(
  "create_workflow",
  {
    description: "Create a new 3-step workflow (plan-refine → implementation → review) from a plan file path.",
    inputSchema: {
      workflow_id: z.string().describe("Unique workflow identifier"),
      plan_path: z.string().describe("Path to the plan file this workflow executes"),
    },
  },
  async ({ workflow_id, plan_path }) => {
    const state = loadState();
    if (state[workflow_id]) {
      return {
        content: [{ type: "text", text: `Workflow ${workflow_id} already exists. Use get_workflow_status to inspect it.` }],
      };
    }
    state[workflow_id] = createWorkflow(workflow_id, plan_path);
    saveState(state);
    return {
      content: [{ type: "text", text: `Workflow ${workflow_id} created. 3 steps: plan-refine → implementation → review.\nRun get_current_step to get the first prompt.` }],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_current_step
// Returns the current step type, status, and generated prompt.
// ---------------------------------------------------------------------------
server.registerTool(
  "get_current_step",
  {
    description: "Return the current step type, status, and generated prompt for the active workflow.",
    inputSchema: {
      workflow_id: z.string().describe("Workflow identifier"),
    },
  },
  async ({ workflow_id }) => {
    const state = loadState();
    const workflow = getWorkflow(state, workflow_id);
    if (!workflow) {
      return { content: [{ type: "text", text: `Workflow ${workflow_id} not found. Create it first with create_workflow.` }] };
    }
    if (workflow.status === "done") {
      return { content: [{ type: "text", text: `Workflow ${workflow_id} is complete. All steps done.` }] };
    }
    if (workflow.status === "blocked") {
      const step = workflow.steps[workflow.current_step_index];
      return {
        content: [{
          type: "text",
          text: `Workflow ${workflow_id} is BLOCKED at step ${workflow.current_step_index} (${step.type}).\nBlockers:\n${step.blockers.join("\n")}`,
        }],
      };
    }

    const step = workflow.steps[workflow.current_step_index];
    // Mark running if still pending
    if (step.status === "pending") {
      step.status = "running";
      saveState(state);
    }

    return {
      content: [{
        type: "text",
        text: [
          `Step ${workflow.current_step_index + 1} of ${workflow.steps.length}: ${step.type}`,
          `Shape: ${step.shape}`,
          `Status: ${step.status}`,
          `Advancement: ${step.advancement}`,
          ``,
          `--- PROMPT ---`,
          step.prompt,
          `--- END PROMPT ---`,
        ].join("\n"),
      }],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool: report_step_output
// Session posts its output back for the current step.
// ---------------------------------------------------------------------------
server.registerTool(
  "report_step_output",
  {
    description: "Post the session output for the current step. Marks the step as done and ready for advancement.",
    inputSchema: {
      workflow_id: z.string().describe("Workflow identifier"),
      step_index: z.number().int().describe("Index of the step being reported (0-based)"),
      output: z.string().describe("Full output text produced by the session for this step"),
    },
  },
  async ({ workflow_id, step_index, output }) => {
    const state = loadState();
    const workflow = getWorkflow(state, workflow_id);
    if (!workflow) {
      return { content: [{ type: "text", text: `Workflow ${workflow_id} not found.` }] };
    }
    if (step_index !== workflow.current_step_index) {
      return {
        content: [{
          type: "text",
          text: `Step index mismatch. Current step is ${workflow.current_step_index}, you reported step ${step_index}.`,
        }],
      };
    }

    const step = workflow.steps[step_index];
    step.output = output;
    step.status = "done";
    saveState(state);

    return {
      content: [{
        type: "text",
        text: `Step ${step_index} (${step.type}) output recorded. Run advance_step to proceed.`,
      }],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool: advance_step
// Evaluates current step output and advances to next step if conditions met.
// ---------------------------------------------------------------------------
server.registerTool(
  "advance_step",
  {
    description: "Evaluate the current step output and advance the workflow to the next step.",
    inputSchema: {
      workflow_id: z.string().describe("Workflow identifier"),
      approved: z.boolean().describe("Whether the step output is approved. Required for require-approval steps."),
      blocker: z.string().optional().describe("Optional blocker description if not approved."),
    },
  },
  async ({ workflow_id, approved, blocker }) => {
    const state = loadState();
    const workflow = getWorkflow(state, workflow_id);
    if (!workflow) {
      return { content: [{ type: "text", text: `Workflow ${workflow_id} not found.` }] };
    }

    const step = workflow.steps[workflow.current_step_index];

    if (step.status !== "done") {
      return {
        content: [{
          type: "text",
          text: `Step ${workflow.current_step_index} (${step.type}) is not done yet. Report output first with report_step_output.`,
        }],
      };
    }

    if (!approved) {
      const blockerText = blocker ?? "No blocker description provided.";
      step.blockers.push(blockerText);
      step.status = "failed";
      workflow.status = "blocked";
      step.advancement_decision = `blocked: ${blockerText}`;
      saveState(state);
      return {
        content: [{
          type: "text",
          text: `Workflow ${workflow_id} BLOCKED at step ${workflow.current_step_index} (${step.type}).\nBlocker: ${blockerText}`,
        }],
      };
    }

    step.advancement_decision = "approved";
    workflow.current_step_index += 1;

    if (workflow.current_step_index >= workflow.steps.length) {
      workflow.status = "done";
      saveState(state);
      return {
        content: [{
          type: "text",
          text: `Workflow ${workflow_id} COMPLETE. All ${workflow.steps.length} steps done.`,
        }],
      };
    }

    saveState(state);
    const next = workflow.steps[workflow.current_step_index];
    return {
      content: [{
        type: "text",
        text: `Advanced to step ${workflow.current_step_index + 1} of ${workflow.steps.length}: ${next.type}.\nRun get_current_step to get the prompt.`,
      }],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_workflow_status
// Full state snapshot for the workflow.
// ---------------------------------------------------------------------------
server.registerTool(
  "get_workflow_status",
  {
    description: "Return a full snapshot of the workflow state: all steps, statuses, outputs, and blockers.",
    inputSchema: {
      workflow_id: z.string().describe("Workflow identifier"),
    },
  },
  async ({ workflow_id }) => {
    const state = loadState();
    const workflow = getWorkflow(state, workflow_id);
    if (!workflow) {
      return { content: [{ type: "text", text: `Workflow ${workflow_id} not found.` }] };
    }

    const stepLines = workflow.steps.map((step, i) => {
      const current = i === workflow.current_step_index ? " ← current" : "";
      const blocker = step.blockers.length ? `\n    blockers: ${step.blockers.join("; ")}` : "";
      const output = step.output ? `\n    output: ${step.output.slice(0, 120)}${step.output.length > 120 ? "..." : ""}` : "";
      return `  Step ${i + 1}: ${step.type} [${step.status}]${current}${blocker}${output}`;
    });

    const summary = [
      `Workflow: ${workflow.id}`,
      `Plan: ${workflow.plan_path}`,
      `Status: ${workflow.status}`,
      `Progress: step ${workflow.current_step_index + 1} of ${workflow.steps.length}`,
      ``,
      ...stepLines,
    ].join("\n");

    return { content: [{ type: "text", text: summary }] };
  },
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("workflow-engine MCP server running (stdio)");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
