---
name: node-memory
description: Legacy memory node retained for backward-compatible stored workflows.
---

# node-memory

## Status
`memory` is a legacy/backward-compatible node. It remains registered for stored workflow definitions and in the properties panel, but it is removed from the visible toolbar palette. Prefer explicit node outputs, `structured_output`, endpoint inputs, and persisted output mappings for new workflows.

## Purpose
The `memory` node coordinates read/write state access. It's particularly useful for `loop` counters, persistent `knowledge_base` staging, or passing implicit parameters to deep agent networks.

## Schema: `MemoryNodeData`

```json
{
  "id": "node_memory",
  "type": "memory",
  "data": {
    "label": "Save Temporary List",
    "config": {
      "operation": "write",
      "scope": "workflow",
      "writes": [
        {
          "key": "scraped_emails",
          "value": "{{node_agent_2.output.emails}}",
          "merge": true
        }
      ]
    }
  }
}
```

## Fields
- **operation**: `"read"`, `"write"`, `"update"`, `"delete"`, or `"list"`.
- **scope**:
  - `"workflow"`: Memory gets wiped when the run finishes.
  - `"session"`: Maintained for the duration of a chat user session.
  - `"persistent"`: Maintained forever at the endpoint level.
- **writes / reads**: Arrays defining the keys and alias assignments.
  - If `write`, `value` defines the var ref to store. `merge: true` appends arrays / objects instead of replacing.
