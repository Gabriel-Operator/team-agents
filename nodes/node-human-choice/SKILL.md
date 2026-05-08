---
name: node-human-choice
description: Pause a workflow for a human to choose one of several explicit options.
---

# node-human-choice

## Purpose
The `human_choice` node pauses execution and asks the user to answer a prompt. It is a current toolbar node and is useful when the workflow must branch on human judgment instead of an automated condition.

## Schema: `HumanChoiceNodeData`

```json
{
  "id": "node_human_choice",
  "type": "human_choice",
  "position": { "x": 420, "y": 180 },
  "data": {
    "label": "Human Choice",
    "config": {
      "prompt": "Which option should the workflow use?",
      "description": "Pick the safest next action.",
      "outputKey": "choice",
      "answerVariable": "selectedAction",
      "required": true,
      "options": [
        { "id": "option_1", "label": "Approve", "value": "approve" },
        { "id": "option_2", "label": "Reject", "value": "reject" }
      ]
    }
  }
}
```

## Fields
- **config.prompt**: Prompt shown to the human.
- **config.description**: Optional helper text.
- **config.outputKey**: Key used in this node's response payload.
- **config.answerVariable**: Optional variable alias for the selected answer.
- **config.required**: When `true`, the workflow cannot proceed without an answer.
- **config.options**: Explicit choices with `id`, `label`, and `value`.

## Edges
Human choice branch edges can use the selected option value as their branch condition. Keep option values stable, because downstream branches and logs depend on them.

## Variable References
- Choice response: `{{node_human_choice.response}}`
- Selected value: `{{node_human_choice.response.choice}}` when `outputKey` is `"choice"`.
