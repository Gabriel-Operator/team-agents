---
name: node-end
description: Terminate the workflow definitively and set explicit output variables.
---

# node-end

## Purpose
The `end` node signifies final completion of the team agent workflow, determines final success/failure status, and standardizes the output JSON payload sent back to the caller.

## Schema: `EndNodeData`

```json
{
  "id": "node_end",
  "type": "end",
  "data": {
    "label": "Success End",
    "config": {
      "status": "success",
      "responseConfig": {
        "fields": [
          {
            "key": "finalReport",
            "value": "{{node_aggregate_1.output}}"
          }
        ]
      }
    }
  }
}
```

## Fields
- **config.status**: `"success"`, `"failure"`, or `"custom"`
- **config.customStatus**: Required if `status` is `"custom"`
- **config.responseConfig.fields**: Determines the exact JSON structure returned to the original request trigger. Use `{{variable}}` substitution.
