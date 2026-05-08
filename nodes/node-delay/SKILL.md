---
name: node-delay
description: Legacy wait node retained for backward compatibility; use node-suspend-resume for new workflows.
---

# node-delay

## Status
`delay` is deprecated and removed from the visible toolbar palette. It remains in `WorkflowNodeType` and the properties panel for backward compatibility with stored workflow definitions. Use `suspend_resume` for new workflow JSON.

## Purpose
The `delay` node waits for a fixed duration or until a specific ISO datetime before continuing.

## Schema: `DelayNodeData`

```json
{
  "id": "node_delay",
  "type": "delay",
  "data": {
    "label": "Delay",
    "description": "Wait before continuing",
    "config": {
      "delayMs": 5000,
      "untilIso": "2026-05-08T10:00:00.000Z"
    }
  }
}
```

## Fields
- **config.delayMs**: Milliseconds to wait when `untilIso` is not set.
- **config.untilIso**: ISO datetime string to wait until.

## Replacement
Use `node-suspend-resume` with:

- `mode: "sleep"` and `sleepMs` for fixed waits.
- `mode: "sleep_until"` and `untilIso` for scheduled waits.
