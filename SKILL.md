---
name: team-agents
description: >
  Edit a git-backed page-builder team agent by updating assets/team-agent.json
  and assets/task-orchestration.json while keeping the skill scaffold files together.
  Use this skill to orchestrate multiple nodes (native agents, MCP tools, loops, 
  councils, forks, memory) into a full Page Builder workflow endpoint.
---

# Page Builder Team Agent Skill

## Goal
Maintain one page-builder team agent endpoint per repository.
This skill defines the high-level workflow orchestration of multiple tools, agents, and logic nodes. Unlike `workflow-builder` (which handles low-level browser automation steps), this skill wires up entire Agents, APIs, and control flow nodes.

## Canonical Files
- `/SKILL.md`
- `/scripts/`
- `/references/`
- `/assets/team-agent.json` — The source of truth for the parent endpoint workflow (nodes and edges).
- `/assets/task-orchestration.json` — The source of truth for child skill refs and todo mappings.
- `/nodes/` — Directory containing individual skill definitions for all 14 page builder node types.

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
This file maps the literal `workflowNodeId` from the above `assets/team-agent.json` to the underlying child skill (the agent or action to run). 
**Rule:** When adding an `agent` node to `team-agent.json`, you MUST add its corresponding orchestration mapping here.

```json
{
  "appId": "<app-id>",
  "endpointId": "<endpoint-id>",
  "masterSkill": {
    "agentId": "<app-id>",
    "actionId": "<endpoint-id>"
  },
  "childSkills": [
    {
      "workflowNodeId": "<node-id-from-team-agent-json>",
      "agentId": "<child-agent-id>",
      "actionId": "<child-action-id>",
      "todoMappings": []
    }
  ],
  "orchestratorCompletion": {
    "agentId": "<app-id>",
    "actionId": "completion-action"
  }
}
```

---

## Supported Nodes (Actions)

To understand how to write and configure individual nodes, please refer to the explicit schemas generated in their subdirectories:

- `nodes/node-start/SKILL.md`
- `nodes/node-agent/SKILL.md`
- `nodes/node-condition/SKILL.md`
- `nodes/node-end/SKILL.md`
- `nodes/node-aggregate/SKILL.md`
- `nodes/node-database/SKILL.md`
- `nodes/node-fork/SKILL.md`
- `nodes/node-join/SKILL.md`
- `nodes/node-council/SKILL.md`
- `nodes/node-memory/SKILL.md`
- `nodes/node-loop/SKILL.md`
- `nodes/node-endpoint/SKILL.md`
- `nodes/node-generate-media/SKILL.md`
- `nodes/node-knowledge-base/SKILL.md`

## Validation
To ensure the JSON files are properly structured before committing:
- `$ npx tsx scripts/validate-team-agent.ts assets/team-agent.json`
- `$ npx tsx scripts/validate-task-orchestration.ts assets/task-orchestration.json`

## Common Edits & Rules
1. **Adding an Agent**: 
   - Add the `agent` Node to `team-agent.json`.
   - Add the Edge to wire it up.
   - Add the `childSkills` entry mapping to `task-orchestration.json`.
2. **Variable References**: Strings can use mustache syntax `{{node_1.output.key}}` or `{{start.inputParam}}` to reference other nodes.
3. **Keep IDs intact**: Never change `appId`, `endpointId`, `masterSkill`, or `endpoint.id` unless the repository binding changes.
