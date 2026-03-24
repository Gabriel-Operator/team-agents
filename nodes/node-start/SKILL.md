---
name: node-start
description: Configure the entry point and input schema for a team agent workflow endpoint.
---

# node-start

## Purpose
The `start` node defines the entry point of the workflow and the schema of inputs the endpoint expects when called from the internet or other agents.

## Schema: `StartNodeData`
This corresponds to the `data` portion of the node in `team-agent.json`.

```json
{
  "id": "node_start",
  "type": "start",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "Start",
    "inputSchema": [
      {
        "key": "userQuery",
        "label": "User Query",
        "type": "text",
        "required": true
      }
    ]
  }
}
```

## Fields
- **label** (string): Human readable name.
- **inputSchema** (array): Defines requested variables.
  - **key**: Variable name
  - **label**: UI identifier
  - **type**: `"text"`, `"number"`, `"boolean"`, `"date"`, `"array"`, `"object"`, etc.
  - **required**: `true`/`false`
