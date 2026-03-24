---
name: node-agent
description: Execute a specific child agent, tool, or API connected through task-orchestration.json.
---

# node-agent

## Purpose
The `agent` node is the workforce of the team agent. It runs a native connector, MCP tool, or internal action. 

> **Important**: For every `agent` node you add to `team-agent.json`, you MUST add a matching `childSkills` entry to `task-orchestration.json` linking `workflowNodeId` to the `agentId` and `actionId`.

## Schema: `AgentNodeData`

```json
{
  "id": "node_agent_1",
  "type": "agent",
  "position": { "x": 300, "y": 100 },
  "data": {
    "label": "Extract Data Agent",
    "config": {
      "connectorType": "native",
      "connectorId": "<action-id>",
      "inputParams": [
        {
          "stepNumber": 1,
          "stepId": "step-123",
          "label": "Prompt",
          "value": "",
          "inputType": "text",
          "source": "variable",
          "variableRef": "{{start.userQuery}}"
        }
      ],
      "outputMappings": [],
      "exposeToAiAssistant": true
    }
  }
}
```

## Fields
- **config.connectorType**: `"native"`, `"mcp"`, or `"rest"`
- **config.connectorId**: The specific action/tool ID being run.
- **config.inputParams**: Maps variable references (`{{node.output}}`) into the agent's expected inputs.
- **config.outputMappings**: Database write rules performed immediately after the agent runs.
- **config.exposeToAiAssistant**: If `true`, the real-time execution logs/media stream back to the UI chat.
