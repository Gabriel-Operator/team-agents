# Page Builder Team Agent References

This scaffold stores one page-builder endpoint per repository.

- `assets/team-agent.json` is the source of truth for the parent endpoint workflow.
- `assets/task-orchestration.json` is the source of truth for child skill refs, todo mappings, and final completion rules.
- The `endpoint` object should contain the full persisted endpoint definition used by the page-builder editor and runtime.
- `task-orchestration.json` child skills should reference only native connector `agent` workflow nodes. MCP connectors, inline LLM agents, AI nodes, and control-flow nodes stay inside `team-agent.json` only.
