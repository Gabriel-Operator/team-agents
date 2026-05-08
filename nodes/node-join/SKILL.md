---
name: node-join
description: Legacy node that waits for and synchronizes parallel execution paths initiated by a fork node.
---

# node-join

## Status
`join` is a legacy/backward-compatible node. It remains registered for stored workflow definitions and in the properties panel, but it is removed from the visible toolbar palette. Prefer current council delegation and completion gates for new multi-member workflows.

## Purpose
The `join` node acts as a barrier that waits for parallel branches (from a `fork` node) to complete before proceeding. It consolidates the distinct runs back into a single execution thread.

## Schema: `JoinNodeData`

```json
{
  "id": "node_join",
  "type": "join",
  "data": {
    "label": "Wait for Experts",
    "config": {
      "forkNodeId": "node_fork",
      "joinMode": "all",
      "timeout": 60000,
      "onTimeout": "proceed",
      "aggregation": {
        "type": "list"
      }
    }
  }
}
```

## Fields
- **config.forkNodeId**: Strict string reference back to the original `fork` node ID.
- **config.joinMode**:
  - `"all"`: Wait for every branch.
  - `"any"`: Proceed as soon as ONE branch completes.
  - `"majority"`: Wait for > 50% of branches.
- **config.aggregation.type**: `"merge"`, `"list"`, or `"custom"` to dictate how parallel outputs are combined into the join node's final output.
- **config.onTimeout**: `"proceed"` ignores pending branches, `"fail"` fails the workflow.
