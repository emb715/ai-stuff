# humans.md — vault-start

## Design decisions

- Routes before building. The single most important behavior in a vault session.
- Asks session type explicitly — prevents the LLM from guessing and producing misplaced artifacts.
- Scans for prior work before suggesting anything new — enforces the "extend, don't duplicate" principle.
- Does not duplicate framebook procedure steps — delegates to the playbook file directly.

## Maintenance notes

- If new session types are added to start-session framebook procedure, add the corresponding route here.
