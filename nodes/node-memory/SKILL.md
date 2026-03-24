---
name: node-memory
description: Read and write intermediate state during short-term logic runs or persistent cross-run sessions.
---

# node-memory

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
