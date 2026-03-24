---
name: node-fork
description: Split the workflow into multiple concurrent execution paths (parallel branches).
---

# node-fork

## Purpose
The `fork` node initiates parallel execution. It creates distinct branches that execute simultaneously until they hit a corresponding `join` node.

## Schema: `ForkNodeData`

```json
{
  "id": "node_fork",
  "type": "fork",
  "data": {
    "label": "Parallel Kickoff",
    "config": {
      "forkMode": "all",
      "timeout": 30000,
      "branches": [
        { "id": "branch_1", "label": "Sales Checks" },
        { "id": "branch_2", "label": "Marketing Checks", "condition": "{{start.marketingEnabled}}" }
      ]
    }
  }
}
```

## Fields
- **config.forkMode**: `"all"` or `"conditional"`
- **config.branches**: Array defining the parallel paths.
  - **id**: Branch identifier.
  - **condition**: Only run this branch if condition is truthy.
- **config.timeout**: Maximum execution time (ms) for all branches before terminating.
