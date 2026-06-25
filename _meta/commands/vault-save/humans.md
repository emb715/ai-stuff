# humans.md — vault-save

## Design decisions

- Interactive by design — classification and sanitization require human confirmation at each step.
- Classification happens before writing anything. Prevents creating files in the wrong location and then having to move them.
- Sanitization is step 2, not step 6. Sensitive data caught early cannot accidentally land in git history.
- Status is set by asking about real usage, not by assumption. Forces honest assessment.

## Maintenance notes

- If new artifact types are added (e.g., a new top-level folder), update the classification routing table in command.md.
