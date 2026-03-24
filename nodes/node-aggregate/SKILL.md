---
name: node-aggregate
description: Combine multiple variable outputs from parallel branches or prior nodes into a single JSON object or array.
---

# node-aggregate

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
  - `"list"`: Retuns `[source1, source2]`
  - `"merge"`: Returns `{ ...source1, ...source2 }`
  - `"sum" | "count" | "average"`: Returns numbers.
- **config.outputMappings**: Optional database writes performed on the aggregated result.
