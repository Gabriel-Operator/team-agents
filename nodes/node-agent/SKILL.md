---
name: node-agent
description: Execute a native browser automation connector or MCP tool connector created from the Workflow Toolbar Connectors section.
---

# node-agent

## Purpose
The `agent` node runs a connector from the Workflow Toolbar. It is created by dragging a native browser automation or an MCP connector from the Connectors section, not by the generic node palette.

Only native connector nodes are represented in `task-orchestration.json` `childSkills[]`. MCP connector nodes are still `type: "agent"` in `team-agent.json`, but they do not get child skill files or task orchestration mappings.

## Schema: `AgentNodeData`

### Native Connector

```json
{
  "id": "node_agent_1",
  "type": "agent",
  "position": { "x": 300, "y": 100 },
  "data": {
    "label": "Extract Data Agent",
    "config": {
      "connectorType": "native",
      "connectorId": "<connector-id-or-action-id>",
      "connectorName": "Extract Data",
      "agentId": "<child-agent-id>",
      "actionId": "<child-action-id>",
      "agentName": "Extract Data",
      "website": "https://example.com",
      "favicon": "https://www.google.com/s2/favicons?domain=example.com&sz=128",
      "inputParams": [
        {
          "stepNumber": 1,
          "stepId": "step-123",
          "label": "Prompt",
          "value": "",
          "inputType": "text",
          "source": "variable",
          "variableRef": "{{start.input.userQuery}}"
        }
      ],
      "stepOverrides": {
        "1": {
          "value": "Use {{start.input.userQuery}}",
          "selectorOverrides": {},
          "variableOverrides": {},
          "exportedVariableDefinitions": {}
        }
      },
      "outputMappings": [],
      "databaseOperations": [],
      "selectedCollectionIds": [],
      "exposeToAiAssistant": true,
      "guardianEnabled": false,
      "guardianId": "<optional-guardian-id>",
      "guardianProvider": "browserbase"
    }
  }
}
```

### MCP Connector

```json
{
  "id": "node_agent_mcp",
  "type": "agent",
  "position": { "x": 300, "y": 260 },
  "data": {
    "label": "MCP Tool",
    "config": {
      "connectorType": "mcp",
      "connectorId": "<connector-id>",
      "connectorName": "MCP Server",
      "agentName": "MCP Server",
      "mcpServerId": "<mcp-server-id>",
      "serverUrl": "https://mcp.example.com",
      "mcpToolName": "search",
      "mcpToolInputs": {
        "search.query": "{{start.input.userQuery}}"
      },
      "inputParams": [],
      "outputMappings": [],
      "exposeToAiAssistant": false
    }
  }
}
```

## Fields
- **config.connectorType**: `"native"` or `"mcp"` in the current toolbar. The shared type also contains `"rest"`, but the toolbar currently creates native and MCP connector nodes.
- **config.connectorId**: Connector registry ID or action ID from the toolbar payload.
- **config.agentId / config.actionId**: Required for native browser automation connectors. These are the IDs that `task-orchestration.json` child mappings must match.
- **config.agentName / connectorName / website / favicon**: Display and favicon metadata copied from the connector record.
- **config.inputParams**: Native connector input parameters. Values may use `source: "static"` or `source: "variable"` with `variableRef`.
- **config.stepOverrides**: Native step value, selector, and variable overrides keyed by step number.
- **config.mcpServerId / config.mcpToolName / config.serverUrl**: MCP server/tool identity and connection metadata.
- **config.mcpToolInputs**: MCP input values keyed by tool/parameter name.
- **config.outputMappings**: Collection field mappings from node output.
- **config.databaseOperations**: Optional create/read/update/delete operations configured from the output mappings panel.
- **config.selectedCollectionIds**: UI-persisted collection selection for mappings.
- **config.exposeToAiAssistant**: If `true`, this node's response streams directly in assistant chat during workflow runs.
- **config.guardianEnabled / guardianId / guardianProvider**: Denormalized guardian assignment for native connectors. The editor backfills these from the action's steps.

## Child Skill Rule
Add a `task-orchestration.json` `childSkills[]` entry only when all of the following are true:

- The workflow node has `type: "agent"`.
- `data.config.connectorType` is `"native"`.
- `data.config.agentId` is non-empty.
- `data.config.actionId` is non-empty.

Do not create child skills for MCP connector nodes, `llm_agent` nodes, `agent_approval` nodes, inline council LLM members, or non-agent workflow nodes.

## Variable References
- Native/MCP node response: `{{node_id.response}}`
- Common workflow variable list also exposes agent output as `{{node_id.output}}`.
