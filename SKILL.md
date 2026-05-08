---
name: team-agents
description: >
  Edit a git-backed page-builder team agent by updating assets/team-agent.json
  and assets/task-orchestration.json while keeping the skill scaffold files together.
  Use this skill to orchestrate Page Builder workflow nodes, native browser
  agents, MCP tools, councils, human choices, media generation, and Mastra-native
  control nodes into a full workflow endpoint.
---

# Page Builder Team Agent Skill

## Goal
Maintain one page-builder team agent endpoint per repository.
This skill defines the high-level workflow orchestration of multiple tools, agents, and logic nodes. Unlike `workflow-builder` (which handles low-level browser automation steps), this skill wires up whole Page Builder workflows: Start input contracts, connector nodes, council orchestration, AI nodes, control flow, and final endpoint outputs.

## Canonical Files
- `/SKILL.md`
- `/scripts/`
- `/references/`
- `/assets/team-agent.json` - The source of truth for the parent endpoint workflow (nodes and edges).
- `/assets/task-orchestration.json` - The source of truth for child skill refs and todo mappings.
- `/nodes/` - Node-specific writing guides. Current editor nodes, special-created nodes, legacy nodes, and schema-only nodes are separated below.

## Payload Contracts

### 1. `/assets/team-agent.json`
This file contains the core `WorkspaceDefinition` for the endpoint.

```json
{
  "appId": "<app-id>",
  "endpointId": "<endpoint-id>",
  "endpoint": {
    "id": "<endpoint-id>",
    "name": "Team Agent",
    "slug": "team-agent",
    "method": "POST",
    "workflow": {
      "id": "<workflow-id>",
      "name": "Team Agent Workflow",
      "nodes": [],      // List of WorkflowNode objects (documented in nodes/)
      "edges": [],      // List of WorkflowEdge objects
      "variables": [],  // Global workflow variables
      "createdAt": 1710000000000,
      "updatedAt": 1710000000000
    }
  },
  "commitMessage": "Update team agent"
}
```

### 2. `/assets/task-orchestration.json`
This file maps a literal native connector `workflowNodeId` from `assets/team-agent.json` to the underlying child skill/action that the orchestrator may inspect and track.

**Rule:** Add `childSkills[]` entries only for native connector `agent` workflow nodes whose `data.config.connectorType` is `"native"` and that have both `agentId` and `actionId`. Do not add child skill mappings for MCP `agent` nodes, `llm_agent`, `agent_approval`, `council` members that are inline agents, or non-agent nodes.

```json
{
  "appId": "<app-id>",
  "endpointId": "<endpoint-id>",
  "masterSkill": {
    "title": "Team Agent Master Skill",
    "purpose": "Coordinate the child skills needed to complete the task.",
    "successCriteria": ["Complete the requested goal."]
  },
  "childSkills": [
    {
      "workflowNodeId": "<node-id-from-team-agent-json>",
      "title": "Child Browser Agent",
      "agentId": "<child-agent-id>",
      "actionId": "<child-action-id>",
      "todoMappings": []
    }
  ],
  "orchestratorCompletion": {
    "id": "orchestrator-completion",
    "title": "Verify overall task completion",
    "requireAllRequiredTodos": true
  }
}
```

---

## Supported Nodes

Use the editor implementation as the source of truth. The current toolbar does not expose every `WorkflowNodeType`; several types remain only for saved workflow compatibility.

### Current Toolbar Nodes

These can be created directly from the node palette and should have current node docs:

- `nodes/node-start/SKILL.md`
- `nodes/node-end/SKILL.md`
- `nodes/node-human-choice/SKILL.md`
- `nodes/node-council/SKILL.md`
- `nodes/node-generate-media/SKILL.md`
- `nodes/node-structured-output/SKILL.md`
- `nodes/node-llm-agent/SKILL.md`
- `nodes/node-control-flow/SKILL.md`
- `nodes/node-agent-approval/SKILL.md`
- `nodes/node-suspend-resume/SKILL.md`

### Special-Created Nodes

These are supported by the editor/runtime but are not simple palette items:

- `nodes/node-agent/SKILL.md` - created by dragging a native or MCP connector from the Connectors section.
- `nodes/node-endpoint/SKILL.md` - created by dragging another workflow endpoint from the AI Orchestrators section.
- `nodes/node-condition/SKILL.md` - supported as a condition node; the toolbar currently hides it from the visible palette.

### Legacy / Backward-Compatible Nodes

These may exist in stored workflows and have panels/components for compatibility, but are no longer recommended for new authoring:

- `nodes/node-aggregate/SKILL.md`
- `nodes/node-fork/SKILL.md`
- `nodes/node-join/SKILL.md`
- `nodes/node-memory/SKILL.md`
- `nodes/node-loop/SKILL.md`
- `nodes/node-delay/SKILL.md`

### Schema-Only / Not Current Editor Nodes

These appear in shared schema types but are not currently registered as React Flow node components in the Page Builder workflow editor. Do not add them manually unless the runtime/editor has been updated:

- `database` - legacy/schema-only direct collection operations; prefer agent output mappings unless this node is explicitly re-enabled.
- `knowledge_base` - schema-only KB capture node; not currently creatable/registered in the editor.
- `approval` - older generic approval node; use `agent_approval` or `suspend_resume`.
- `transform` - schema-only mapping node; use `structured_output`, `end.responseConfig`, or explicit agent/endpoint mappings.

## Validation
To ensure the JSON files are properly structured before committing:
- `$ npx tsx scripts/validate-team-agent.ts assets/team-agent.json`
- `$ npx tsx scripts/validate-task-orchestration.ts assets/task-orchestration.json`

The task orchestration validator reads sibling `team-agent.json` when present and verifies child mappings reference native connector `agent` workflow nodes only. If the files are not siblings, pass the team-agent path as a second argument.

## Common Edits & Rules
1. **Adding an Agent**: 
   - Add the connector-backed `agent` node to `team-agent.json`.
   - Add the edge to wire it up.
   - Add a `childSkills` mapping only when the node is a native connector with `agentId` and `actionId`.
2. **MCP Tools**: MCP connector nodes are still `type: "agent"` but use `connectorType: "mcp"`, `mcpServerId`, `mcpToolName`, and MCP input values. They do not get `childSkills` mappings.
3. **Variable References**: Prefer current editor references such as `{{start.input.fieldKey}}`, `{{node_id.output}}`, `{{node_id.response}}`, `{{node_id.response.result}}`, or node-specific references documented in `nodes/`.
4. **Keep IDs intact**: Never change `appId`, `endpointId`, `masterSkill`, or `endpoint.id` unless the repository binding changes.
5. **Keep runtime overlays out of JSON**: Do not persist runtime-only fields such as `lastOutput`, `lastExecutionTime`, `lastStatus`, `isAnimating`, `memberStatuses`, `memberProgress`, or `councilRunLogs`.
