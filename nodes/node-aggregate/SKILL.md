---
name: node-aggregate
description: Legacy node that combines multiple variable outputs into a single JSON object or array.
---

# node-aggregate

## Status
`aggregate` is a legacy/backward-compatible node. It remains registered for stored workflow definitions and in the properties panel, but it is removed from the visible toolbar palette. Prefer `structured_output`, `end.responseConfig`, or downstream node mappings for new workflow JSON.

## Purpose
The `aggregate` node acts as an array/object builder. It takes outputs from prior nodes and builds a combined payload to pass forward to subsequent APIs or LLMs.

## Schema: `AggregateNodeData`

```json
{
  "id": "node_aggregate",
  "type": "aggregate",
  "data": {
    "label": "Consolidate Research",
    "config": {
      "sources": [
        "{{node_researcher_1.output}}",
        "{{node_researcher_2.output}}"
      ],
      "aggregationType": "list",
      "outputMappings": []
    }
  }
}
```

## Fields
- **config.sources**: Array of string variables pointing to node outputs.
- **config.aggregationType**:
  - `"list"`: Returns `[source1, source2]`
  - `"merge"`: Returns `{ ...source1, ...source2 }`
  - `"sum" | "count" | "average"`: Returns numbers.
- **config.outputMappings**: Optional database writes performed on the aggregated result.
