---
name: node-condition
description: Branch the workflow execution path based on variable values or LLM decisions.
---

# node-condition

## Purpose
The `condition` node evaluates data arriving from previous nodes. It outputs boolean edges (`condition: "true" | "false"`).

## Schema: `ConditionNodeData`

### Simple Condition
Evaluates `leftOperand` vs `rightOperand`.
```json
{
  "id": "node_condition_1",
  "type": "condition",
  "data": {
    "label": "Check Status",
    "config": {
      "conditionType": "simple",
      "simpleCondition": {
        "leftOperand": "{{node_agent_1.output.status}}",
        "operator": "equals",
        "rightOperand": "success"
      }
    }
  }
}
```

### LLM Condition
Uses an LLM prompt to compute the true/false routing dynamically based on context.
```json
{
  "id": "node_condition_1",
  "type": "condition",
  "data": {
    "label": "Is this a refund?",
    "config": {
      "conditionType": "llm",
      "llmCondition": {
        "prompt": "Determine if the user's intent is to ask for a refund.",
        "model": "gpt-4o",
        "contextVariables": ["{{start.emailBody}}"]
      }
    }
  }
}
```

## Edges
Edges originating from a Condition node must have the `condition` property:
```json
{
  "id": "edge_true",
  "source": "node_condition_1",
  "target": "node_next",
  "condition": "true"
}
```
