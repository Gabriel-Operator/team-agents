---
name: node-agent-approval
description: Run an LLM agent whose external tool call requires human approval before execution.
---

# node-agent-approval

## Purpose
The `agent_approval` node lets an LLM prepare a tool call, pause for human approval, and then execute or decline the call. It is a current toolbar node for human-in-the-loop tool execution.

## Schema: `AgentApprovalNodeData`

```json
{
  "id": "node_agent_approval",
  "type": "agent_approval",
  "position": { "x": 520, "y": 300 },
  "data": {
    "label": "Agent Approval",
    "description": "Agent tool call requires human approval",
    "config": {
      "prompt": "Create a ticket for {{start.input.customerName}}.",
      "systemPrompt": "You are a helpful agent. Use your tool to complete the task.",
      "model": "gpt-4.1",
      "temperature": 0.3,
      "reviewPrompt": "Approve this tool call?",
      "rejectBehavior": "error",
      "tool": {
        "toolName": "create_ticket",
        "toolDescription": "Create a customer support ticket.",
        "actionUrl": "https://api.example.com/tickets",
        "actionMethod": "POST",
        "actionHeaders": {
          "Authorization": "Bearer {{secrets.ticket_api_key}}"
        },
        "actionBody": "{\"customer\":\"{{tool.args.customer}}\",\"summary\":\"{{tool.args.summary}}\"}",
        "inputFields": [
          {
            "name": "customer",
            "type": "string",
            "description": "Customer name",
            "required": true
          },
          {
            "name": "summary",
            "type": "string",
            "description": "Ticket summary",
            "required": true
          }
        ]
      }
    }
  }
}
```

## Fields
- **config.prompt**: Task prompt for the agent. Supports `{{variable}}` interpolation.
- **config.systemPrompt**: Optional system instructions.
- **config.model / temperature**: LLM settings.
- **config.reviewPrompt**: Message shown to the human reviewer.
- **config.rejectBehavior**: `"error"` or `"skip"` when the reviewer declines.
- **config.tool**: The single tool this agent can request.
  - **toolName / toolDescription**: Tool identity shown to the model.
  - **actionUrl / actionMethod / actionHeaders / actionBody**: HTTP action to run after approval.
  - **inputFields**: Tool arguments the model should produce before review.

## Authoring Rules
- This node is not a native connector node and does not get a `task-orchestration.json` child skill.
- Use `{{tool.args.fieldName}}` only inside the tool action body/template.
