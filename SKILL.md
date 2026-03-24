---
name: page-builder-team-agent
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
      "nodes": [],      // List of WorkflowNode objects (documented below)
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

The `endpoint.workflow.nodes` array in `team-agent.json` contains the actual logic steps. Every node follows this structure:

```json
{
  "id": "node_1",
  "type": "<node-type>",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "My Node",
    "config": { ... } // Schema below depends on type
  }
}
```

### 1. `start` — Workflow Entry
Defines the inputs the endpoint expects.
- **data.inputSchema**: Array of `CollectionField` dicts (`{ key, label, type }`).

### 2. `agent` — Native Connectors / MCP / REST
Executes a specific action.
- **config.connectorType**: `"native"`, `"mcp"`, or `"rest"`
- **config.connectorId**: The ID of the action
- **config.inputParams**: Array of mappings `{ stepNumber, label, value, source, variableRef }`
- **config.outputMappings**: Array of DB write rules
- **config.exposeToAiAssistant**: `boolean` (if true, streams raw runtime output to chat)

### 3. `condition` — Branching
Splits flow based on data. Edges from this node should use `condition: "true" | "false"`.
- **config.conditionType**: `"simple"` or `"llm"`
- **config.simpleCondition**: `{ leftOperand, operator, rightOperand }`
- **config.llmCondition**: `{ prompt, contextVariables }`

### 4. `loop` — Iteration
- **config.loopType**: `"for"`, `"while"`, or `"forEach"`
- **config.iterations**: Number of loops (if `for`)
- **config.condition**: Variable expression to check (if `while`)
- **config.collection**: Variable ref to array (if `forEach`)

### 5. `fork` and `join` — Parallel Execution
Executes multiple branches at once.
- **fork config**: `{ branches: [{ id, label, condition? }], forkMode: "all"|"conditional", timeout? }`
- **join config**: `{ forkNodeId, joinMode: "all"|"any"|"majority", onTimeout: "proceed"|"fail", aggregation: { type: "merge"|"list" } }`

### 6. `council` — Multi-Agent Coordination
Spawns an LLM supervisor to orchestrate other agents.
- **config.role**: `"supervisor"`, `"judge"`, or `"synthesizer"`
- **config.strategy**: `{ type: "debate"|"vote"|"consensus"|"delegate" }`
- **config.members**: `[{ nodeId, role, weight? }]` pointing to parallel agent nodes.
- **config.memoryAccess**: `"read"`, `"write"`, or `"readwrite"`

### 7. `memory` — Shared Context
Reads/writes short-term or persistent state across the workflow.
- **config.operation**: `"read"`, `"write"`, `"update"`, `"delete"`, `"list"`
- **config.scope**: `"workflow"`, `"session"`, or `"persistent"`
- **config.writes**: `[{ key, value, merge? }]`
- **config.reads**: `[{ key, alias? }]`

### 8. `generate_media` — Image/Video/Audio AI
- **config.mediaType**: `"image"`, `"video"`, or `"audio"`
- **config.prompt**: The generation prompt (supports `{{variables}}`)
- **config.imageCondition**: `{ imageMode, firstFrameImageUrl, lastFrameImageUrl, referenceImageUrls }`
- **config.options**: Config map for resolution, duration, style, etc.

### 9. `knowledge_base` — Document Output Capture
Saves workflow results silently to the user's RAG knowledge base.
- **config.scope**: `"personal"` or `"shared"`
- **config.titleTemplate**: Template (supports `{{variables}}`)
- **config.contentTemplate**: Content (supports `{{node_id.output}}`)
- **config.tags**: Array of strings

### 10. `aggregate`, `database`, `endpoint`, `end`
- **aggregate**: Merge multiple variable refs into one object/list.
- **database**: CRUD operations mapping variables to Collections.
- **endpoint**: Execute a sub-workflow.
- **end**: Terminal node defining the explicit response schema or success/failure status.

---

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
