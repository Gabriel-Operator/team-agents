---
name: node-structured-output
description: Call an LLM and return a typed JSON object using visual fields or raw JSON Schema.
---

# node-structured-output

## Purpose
The `structured_output` node extracts or transforms information into a typed JSON object. It is a current toolbar AI node and is useful before an `end` node or output integration mapping.

## Schema: `StructuredOutputNodeData`

```json
{
  "id": "node_structured_output",
  "type": "structured_output",
  "position": { "x": 520, "y": 220 },
  "data": {
    "label": "Structured Output",
    "description": "Extract structured data using an LLM",
    "config": {
      "prompt": "Extract the customer's request from {{start.input.emailBody}}.",
      "systemPrompt": "Return only data that is supported by the source text.",
      "model": "gpt-4.1-mini",
      "temperature": 0.3,
      "maxTokens": 1200,
      "schemaMode": "visual",
      "fields": [
        {
          "key": "customerName",
          "type": "string",
          "description": "Customer full name",
          "required": true
        },
        {
          "key": "items",
          "type": "array",
          "itemType": "object",
          "itemFields": [
            {
              "key": "name",
              "type": "string",
              "required": true
            },
            {
              "key": "quantity",
              "type": "number"
            }
          ]
        }
      ]
    }
  }
}
```

## Fields
- **config.prompt**: LLM prompt. Supports `{{variable}}` interpolation.
- **config.systemPrompt**: Optional system instructions.
- **config.model / temperature / maxTokens**: LLM settings.
- **config.schemaMode**: `"visual"` for the field builder or `"raw"` for `rawJsonSchema`.
- **config.fields**: Visual schema fields. Field types are `"string"`, `"number"`, `"boolean"`, `"array"`, and `"object"`.
- **config.rawJsonSchema**: Freeform JSON Schema string when `schemaMode` is `"raw"`.

## Variable References
- Structured response: `{{node_structured_output.response}}`
- Typed result: `{{node_structured_output.response.result}}`
