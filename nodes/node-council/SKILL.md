---
name: node-council
description: Create multi-agent supervised sub-networks using debate, voting, consensus, or delegation.
---

# node-council

## Purpose
The `council` node spawns an LLM orchestrator (Supervisor or Judge) that dynamically coordinates multiple parallel agent branches, delegating tasks or resolving conflicting outputs.

## Schema: `CouncilNodeData`

```json
{
  "id": "node_council",
  "type": "council",
  "data": {
    "label": "Research Supervisor",
    "config": {
      "role": "supervisor",
      "model": "claude-3-opus",
      "systemPrompt": "You are the manager overseeing 3 researchers.",
      "members": [
        { "nodeId": "node_researcher_1", "role": "Fact Checker" },
        { "nodeId": "node_researcher_2", "role": "Data Analyst" }
      ],
      "strategy": {
        "type": "delegate",
        "delegationRules": "Send raw numbers to Analyst, textual claims to Fact Checker."
      },
      "memoryAccess": "readwrite"
    }
  }
}
```

## Fields
- **role**: The orchestrator's role (`"supervisor"`, `"judge"`, or `"synthesizer"`).
- **members**: Array pointing to specific parallel agent nodes handling the work.
- **strategy.type**: `"debate"`, `"vote"`, `"consensus"`, `"delegate"`.
- **memoryAccess**: `"read"`, `"write"`, or `"readwrite"` to the global node memory scope.
