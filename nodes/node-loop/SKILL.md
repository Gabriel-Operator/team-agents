---
name: node-loop
description: Orchestrate iterative and recursive workflow branches.
---

# node-loop

## Purpose
The `loop` node allows portions of the workflow to be repeated based on a fixed counter, an array collection, or a dynamic while condition.

## Schema: `LoopNodeData`

```json
{
  "id": "node_loop",
  "type": "loop",
  "data": {
    "label": "Process Emails",
    "config": {
      "loopType": "forEach",
      "collection": "{{node_agent_emails.output.inbox}}",
      "itemAlias": "currentEmail",
      "indexAlias": "emailIndex"
    }
  }
}
```

## Fields
- **config.loopType**: `"for"`, `"while"`, or `"forEach"`
- **config.iterations**: Fixed integer (if `"for"`).
- **config.condition**: Variable ref or expression (if `"while"`).
- **config.maxIterations**: Safey break limit for `"while"` (default 100).
- **config.collection**: Variable ref pointing to an array (if `"forEach"`).
  - **itemAlias**: Variable alias emitted down the child nodes representing the current item.
  - **indexAlias**: Variable alias emitted representing the counter.
