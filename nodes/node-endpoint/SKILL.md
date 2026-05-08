---
name: node-endpoint
description: Call another Page Builder AI orchestrator endpoint as a sub-workflow.
---

# node-endpoint

## Status
`endpoint` nodes are created from the Workflow Toolbar AI Orchestrators section. They are not part of the generic node palette.

## Purpose
The `endpoint` node allows modular composition. A team agent can invoke another fully orchestrated Page Builder endpoint as a single step inside the current workflow.

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
      "endpointSlug": "hr-notifier",
      "endpointMethod": "POST",
      "inputMappings": {
        "employeeId": "{{start.input.employeeId}}"
      },
      "outputAlias": "hrResponse",
      "timeout": 10000,
      "inputSchema": []
    }
  }
}
```

## Fields
- **config.endpointId**: UUID of the external endpoint being invoked.
- **config.endpointName / endpointSlug / endpointMethod**: Endpoint display and request metadata copied from the target endpoint.
- **config.inputMappings**: Key-value map assigning current workflow variables (`{{node.output}}`) to the required `inputSchema` fields of the target endpoint.
- **config.outputAlias**: Variable alias used to expose the output of the sub-workflow to subsequent nodes in the current workflow.
- **config.timeout**: Maximum run time in milliseconds.
- **config.inputSchema**: Cached input schema from the target endpoint for UI mapping.
