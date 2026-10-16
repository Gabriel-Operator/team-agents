---
name: team-agents
description: "Edit a git-backed page-builder team agent by updating assets/team-agent.json and assets/task-orchestration.json while keeping the skill scaffold files together. Use this skill to orchestrate Page Builder workflow nodes, native browser agents, MCP tools, councils, human choices, media generation, and Mastra-native control nodes into a full workflow endpoint."
---

# Page Builder Team Agent Skill

## Offline model and node compatibility

Read [the embedded runtime and local-model contract](references/offline-runtime-v1.md). Classify every nested node and tool against the selected device model, repository adapters, device capabilities, and connectivity policy. Keep device model selection and execution ownership outside authored graph JSON. A missing capability blocks the graph; it never causes cloud fallback.

Root `gabriel.workspace.json` declares `assets/team-agent.json` validation as required and
task-orchestration validation as conditional on that asset being present. Team Agents are
same-environment workspace nodes, never portable registry rows. Commit and push this child
before the parent Persona publishes its declared-branch pin.
Unmarked legacy Team-Agent repos use the parent's loud conventional-validator fallback;
new marked repos fail on missing declared scripts. Team Agents never add portable Workflow
rows. If removed from the graph, parent `prune` removes only the validated gitlink and
`.gitmodules` section, preserving this physical checkout.

## Goal
Maintain one page-builder team agent endpoint per repository.
This skill defines the high-level workflow orchestration of multiple tools, agents, and logic nodes. Unlike `workflow-builder` (which handles low-level browser automation steps), this skill wires up whole Page Builder workflows: Start input contracts, connector nodes, council orchestration, AI nodes, control flow, and final endpoint outputs.

## Using this skill in coding agents

Gabriel Operator skills are designed for Claude Code, Codex, Cursor, Hermes, OpenClaw, and any agent that supports skill packs. Work in the git-backed team-agent repository connected to your Page Builder endpoint.

### Install the skill pack

| Agent | Install |
|-------|---------|
| **Claude Code** | `npx skills add go-code-bot/team-agents` |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins` then install the Gabriel Operator plugin |
| **Cursor** | `npx github:go-code-bot/team-agents add ./my-team-agent` or copy into `.cursor/skills/team-agents/` |
| **Hermes / generic CLI** | `npx github:go-code-bot/team-agents add ./my-team-agent` |
| **OpenClaw** | `npx skills add go-code-bot/team-agents` then `openclaw gateway connect --url https://your-openclaw-gateway` |
| **Gabriel Operator monorepo** | `cp -R server/skills/team-agents ./your-git-repo/` |

Alternative curl installer:

```bash
curl -fsSL https://raw.githubusercontent.com/go-code-bot/team-agents/main/install.sh | bash
```

### Modify with your coding agent

1. Open the git-backed team-agent repository.
2. Tell your agent: *"Read `SKILL.md` and update `assets/team-agent.json` (workflow nodes and edges) and `assets/task-orchestration.json` (child skill mappings) for \<describe the orchestration change\>. Consult `nodes/node-*/SKILL.md` for node-specific shapes."*
3. Validate before committing:
   ```bash
   npx tsx scripts/validate-team-agent.ts assets/team-agent.json
   npx tsx scripts/validate-task-orchestration.ts assets/task-orchestration.json
   ```
4. Commit and push to the default branch.

**Example prompts:**
- *"Add a native browser agent node and wire it to the council output."*
- *"Add an MCP tool node for Gmail and connect it after the start node."*
- **OpenClaw:** *"Update assets/team-agent.json and task-orchestration.json, validate both files, then run the endpoint via the apps API."*

### Deploy and run

1. Validate both JSON files (see above).
2. Commit and push to the default branch so Gabriel syncs the endpoint workflow.
3. **Invoke the endpoint** from scripts or your backend:
   ```bash
   curl -X POST "https://gabrieloperator.com/api/apps/{appId}/{endpointSlug}/run" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $GABRIEL_TOKEN" \
     -d '{}'
   ```
   Replace `{appId}` and `{endpointSlug}` with values from `assets/team-agent.json`. Shape the JSON body to match the start node `inputSchema`.
4. Preview and debug runs in the Page Builder workflow editor.

## Inside a Persona workspace

This repository is usually a **git submodule** of an AI Persona repository, at
`references/team-agents/<resource-key>/`, so one clone of the Persona reaches this skill
pack alongside its workflow, pipeline, and list repos. All links are depth 1 — this repo
is a direct submodule of the Persona, never nested under the pipeline that calls it.

Ownership split, matching the other builders:

| Location | Owns |
|---|---|
| Parent Persona `references/workspace.json` + `.gitmodules` | The depth-1 gitlink after workspace publish |
| This repository | `assets/team-agent.json`, `assets/task-orchestration.json`, and the node guides |

A Pipeline transition reaches this endpoint through `workflowEndpointId`, which is a
runtime id rather than a portable ref. Do **not** add this repository to the parent's
`references/registry.json` and do not write `"dependsOn": [{ "kind": "team_agent" }]`.
Bind the team agent in Gabriel; the parent records the edge in generated
`workspace.json` and checks out this repo under `references/team-agents/`.

**This definition is not portable.** `appId`, `endpointId`, and `data.config.actionId`
on native connector nodes are environment-local ids. They stay in Gabriel bindings and
must never be copied into `workspace.json`. Missing Git binding is an unresolved
workspace row and blocks parent publish.

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

## Persona integration references

Standalone `llm_agent` configs may set `personaPageId` and `integrationRefs` (registry IDs) to use a subset of that persona’s published integration bindings. The runtime resolves the acting user’s connection policy and tool permissions; it cannot expand them. Native agent/workflow actions keep their existing routing. Load `persona-integrations` for voice, vision, host, and offline requirements.


## Command governance and cost handoff

For slash-command authoring, read [command governance and estimated cost](references/command-governance.md). Report warnings and the selected review profile with cost comparisons before handing off the command.


## Required playbook team protocol

For an external specialist binding, read [external runtime contracts and readiness](references/external-runtimes.md). Keep private credentials and runtime consent outside the team definition.

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, Process Reviewer, Governance Agent, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Every playbook owns a versioned rulebook with stable IDs and playbook-specific obligations/prohibitions; the Governance Agent returns a finding and evidence for every applicable rule at the configured review gates. Missing, invented or uncertain checks fail closed to human review. Rulebook prose does not grant or remove permissions: reviewed capability envelopes, resource authorization and exact-effect human approvals stay enforced by Gabriel's server. The Auditor reconciles usage and costs; it does not decide rule compliance. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


### Finalization and review evidence

Task outputs may declare `output.ontology` projections and `recordOutputs` mappings. Each mapping uses JSON pointers, an existing List/pipeline resource key and a permitted create/update/delete operation. Map actual accepted values; updates/deletes require an observed runtime record ID. The server prepares encrypted intents and commits them only after final judging through existing authorization and exact-effect approval. Native action steps retain their original action-boundary controls. Do not claim a generated draft has been persisted or economically accepted.

Coordinator-directed revisions preserve the reviewed goal and capability envelope. Rejected drafts, accepted versions and source provenance remain auditable. The memory steward selects bounded facts/decisions/lessons from accepted evidence; server-copied values retain artifact/version references. Reuse requires finalized successful work with compatible actor/workspace/team/ontology semantics. Quality exceptions retain history without promoting new facts. Use the authenticated run UI to inspect saved evidence, provide human scores and reasons for every criterion, and review improvement drafts. Mock suites are not human reference results. Feedback drafts require renewed confirmation; persistence, accounting and authority failures cannot be waived as quality exceptions.

Real navigation and transformations require owned work products. An opaque capability that cannot enforce individual effect boundaries blocks confirmation with `TEAM_CAPABILITY_GOVERNANCE_REQUIRED`; replace it with governed tools rather than approving around the restriction.
