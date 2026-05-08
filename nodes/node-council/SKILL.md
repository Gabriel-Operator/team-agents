---
name: node-council
description: Configure a supervisor, judge, or synthesizer that delegates work to connector members and inline LLM members.
---

# node-council

## Purpose
The `council` node runs an LLM coordinator that delegates work to a set of members. In the current implementation, the only persisted strategy type is `delegate`; older non-delegate strategy wording should not be generated for new workflows.

Council members can reference native connector members, MCP connector members, or inline LLM agents configured inside the council properties panel.

## Schema: `CouncilNodeData`

```json
{
  "id": "node_council",
  "type": "council",
  "position": { "x": 520, "y": 180 },
  "data": {
    "label": "Research Supervisor",
    "config": {
      "role": "supervisor",
      "avatar": "https://example.com/supervisor.png",
      "model": "gpt-4.1",
      "systemPrompt": "Coordinate the members and return a concise final answer.",
      "temperature": 0.7,
      "members": [
        {
          "nodeId": "member_native_research",
          "role": "Researcher",
          "label": "Web Researcher",
          "connectorName": "Research Browser Agent",
          "connectorWebsite": "https://example.com",
          "connectorFavicon": "https://www.google.com/s2/favicons?domain=example.com&sz=128",
          "agentId": "<agent-id>",
          "actionId": "<action-id>",
          "taskPrompt": "Find authoritative sources for {{start.input.topic}}.",
          "requiresPreflightApproval": true,
          "autoFillFromRoundOutputs": true,
          "supervisorInputIds": ["step-1.query"],
          "guardianEnabled": false
        },
        {
          "nodeId": "member_inline_summarizer",
          "role": "Summarizer",
          "label": "Inline Summarizer",
          "inlineAgent": {
            "prompt": "Summarize member results for {{start.input.topic}}.",
            "instructions": "Return the answer as short bullets.",
            "model": "gpt-4.1-mini",
            "maxSteps": 3,
            "temperature": 0.4,
            "tools": [],
            "inputProcessors": [],
            "outputProcessors": [],
            "maxProcessorRetries": 2
          }
        }
      ],
      "strategy": {
        "type": "delegate",
        "maxRounds": 3,
        "delegationRules": "Send research requests to the browser agent, then ask the summarizer for the final response.",
        "parallelGroups": [
          {
            "id": "group_1",
            "gateMemberId": "member_native_research",
            "parallelMemberIds": ["member_inline_summarizer"]
          }
        ],
        "completionGate": {
          "enabled": true,
          "requiredMemberIds": ["member_native_research", "member_inline_summarizer"],
          "requireSuccess": true,
          "onFail": "fail_workflow"
        }
      },
      "memoryAccess": "readwrite",
      "memoryKeys": []
    }
  }
}
```

## Fields
- **config.role**: `"supervisor"`, `"judge"`, or `"synthesizer"`.
- **config.avatar**: Optional display avatar for the council node.
- **config.model / systemPrompt / temperature**: LLM configuration for the coordinator.
- **config.members**: The members available for delegation.
  - **nodeId**: Unique member ID within the council. It may reference a connector-backed member or an inline member.
  - **role / label / avatar**: Member display metadata.
  - **connectorName / connectorWebsite / connectorFavicon / agentId / actionId / actionName**: Connector member metadata copied from toolbar connector records.
  - **taskPrompt**: Optional task prompt injected into that member's run. Supports `{{variable}}` interpolation.
  - **requiresPreflightApproval**: Pauses before member execution so a human can confirm or ignore proposed handoff values.
  - **autoFillFromRoundOutputs**: Allows the coordinator to fill missing handoff fields from prior member outputs.
  - **supervisorInputIds**: Inputs the supervisor does not need to fill manually. Key format is a step ID or `stepId.variableName`.
  - **inlineAgent**: Full `LLMAgentNodeConfig` when this member is a council-local LLM agent rather than an external connector.
  - **guardianEnabled / guardianId / guardianProvider**: Denormalized guardian assignment for connector members.
- **config.strategy.type**: Always `"delegate"` for current workflows.
- **config.strategy.maxRounds / delegationRules**: Delegation loop limits and routing instructions.
- **config.strategy.parallelGroups**: Deterministic member groups that run after a gate member completes.
- **config.strategy.completionGate**: Optional success gate requiring selected members before the council can finish.
- **config.memoryAccess / memoryKeys**: Memory read/write scope for the council.

## Variable References
- Council response: `{{node_council.response}}`
- Council result: `{{node_council.response.result}}`
- Member outputs: `{{node_council.memberOutputs}}`

## Authoring Rules
- Use `strategy.type: "delegate"` for new workflow JSON.
- Do not create `childSkills[]` for inline council members. Only native top-level `agent` workflow nodes get child skill mappings.
- Connector-backed council members can include `agentId` and `actionId`, but they are owned by the council config, not by a top-level workflow `agent` node.
