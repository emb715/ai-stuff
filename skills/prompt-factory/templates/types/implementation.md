# type: implementation

Generate a prompt that executes planned work end-to-end.

This type has three execution shapes. Select based on plan structure and risk:

- `default` → use `skills/prompt-factory/templates/default.md`
  When: plan is structured, blockers are known, execution can proceed but need hard gates on missing inputs.

- `fast` → use `skills/prompt-factory/templates/fast.md`
  When: plan is clear, blockers are non-blocking, speed matters, inline resolution is acceptable.

- `strict` → use `skills/prompt-factory/templates/strict.md`
  When: plan has explicit phases, checkpointing required, no proceeding past a failure.

Shape selection is required. Default shape is not assumed — user must choose.
