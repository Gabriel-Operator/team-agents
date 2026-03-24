---
name: node-endpoint
description: Call and embed entirely separate Page Builder endpoints as sub-workflows.
---

# node-endpoint

## Purpose
The `endpoint` node allows modular composition. A team agent can invoke another fully orchestrated endpoint (with its own `team-agent.json`) as a single step inside the current workflow.

## Schema: `EndpointNodeData`

```json
{
  "id": "node_endpoint_1",
  "type": "endpoint",
  "data": {
    "label": "Notify HR Workflow",
    "config": {
      "endpointId": "<uuid>",
      "endpointName": "HR Notifier",
      "endpointMethod": "POST",
      "inputMappings": {
        "employeeId": "{{node_db_1.output.id}}"
      },
      "outputAlias": "hrResponse",
      "timeout": 10000
    }
  }
}
```

## Fields
- **config.endpointId**: UUID of the external endpoint being invoked.
- **config.inputMappings**: Key-value map assigning current workflow variables (`{{node.output}}`) to the required `inputSchema` fields of the target endpoint.
- **config.outputAlias**: Variable alias used to expose the output of the sub-workflow to subsequent nodes in the current workflow.
- **config.timeout**: Maximum run time in Ms.
