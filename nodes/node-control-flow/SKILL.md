---
name: node-control-flow
description: Configure Mastra-native foreach, dowhile, or dountil control flow.
---

# node-control-flow

## Purpose
The `control_flow` node is the current toolbar node for loop-like execution. It replaces the legacy `loop` node for new workflow JSON and maps to Mastra-native `.foreach()`, `.dowhile()`, and `.dountil()` behavior.

## Schema: `ControlFlowNodeData`

### Foreach

```json
{
  "id": "node_control_foreach",
  "type": "control_flow",
  "position": { "x": 420, "y": 260 },
  "data": {
    "label": "Control Flow",
    "config": {
      "flowType": "foreach",
      "collection": "{{node_structured_output.response.result.items}}",
      "itemAlias": "item",
      "indexAlias": "index",
      "concurrency": 1,
      "maxIterations": 100
    }
  }
}
```

### Do While / Do Until

```json
{
  "id": "node_control_until",
  "type": "control_flow",
  "data": {
    "label": "Retry Until Complete",
    "config": {
      "flowType": "dountil",
      "condition": "{{node_status.response.complete}} === true",
      "maxIterations": 10
    }
  }
}
```

## Fields
- **config.flowType**: `"foreach"`, `"dowhile"`, or `"dountil"`.
- **config.collection**: Array variable reference for `"foreach"`.
- **config.itemAlias**: Name for the current item inside the loop body. Defaults to `"item"` in the editor.
- **config.indexAlias**: Name for the current index. Defaults to `"index"` in the editor.
- **config.concurrency**: Number of foreach items to process in parallel. Use `1` for sequential execution.
- **config.condition**: Boolean expression for `"dowhile"` or `"dountil"`.
- **config.maxIterations**: Safety limit. The editor default is `100`.

## Authoring Rules
- Use `control_flow` for new loop behavior.
- Use legacy `loop` only when documenting or preserving older saved workflows.
