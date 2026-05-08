---
name: node-start
description: Configure the entry point, input schema, image extraction mappings, and shared browser-agent settings for a team agent endpoint.
---

# node-start

## Purpose
The `start` node defines the workflow entry point. It stores the request input schema used by the run form, optional image-to-input extraction mappings, and optional shared browser session settings for native browser-agent connector nodes.

## Schema: `StartNodeData`
This corresponds to the `data` portion of the node in `team-agent.json`.

```json
{
  "id": "node_start",
  "type": "start",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "Start",
    "inputSchema": [
      {
        "key": "userQuery",
        "label": "User Query",
        "type": "text",
        "required": true
      },
      {
        "key": "shoppingItems",
        "label": "Shopping Items",
        "type": "array",
        "arrayItemType": "text",
        "required": false
      }
    ],
    "inputSources": [
      {
        "id": "source_image",
        "kind": "image",
        "label": "Input image",
        "enabled": true,
        "instructions": "Extract shopping items and quantities from the uploaded image."
      }
    ],
    "inputMappings": [
      {
        "sourceId": "source_image",
        "targetFieldKey": "shoppingItems",
        "mode": "string_array",
        "instructions": "Return one normalized item per entry."
      }
    ],
    "browserAgentConfig": {
      "enabled": true,
      "initialUrl": "https://example.com",
      "providerId": "<optional-browser-provider-id>"
    }
  }
}
```

## Fields
- **label**: Human-readable node label.
- **inputSchema**: Optional array of requested endpoint inputs. These are `CollectionField` entries from the Page Builder schema and commonly include `key`, `label`, `type`, `required`, `description`, and array/object metadata.
- **inputSources**: Optional runtime sources. The current editor supports image sources with `kind: "image"`.
- **inputMappings**: Optional mappings from an enabled image source into Start input fields.
  - **sourceId**: ID from `inputSources`.
  - **targetFieldKey**: Field key from `inputSchema`.
  - **mode**: One of `"text"`, `"number"`, `"boolean"`, `"rich_text"`, `"json_object"`, `"string_array"`, `"number_array"`, `"object_array"`, or `"image_ref"`.
  - **instructions**: Optional extraction instructions for this target field.
- **browserAgentConfig**: Optional shared browser workflow settings.
  - **enabled**: Opens a shared browser session for native browser-agent connector nodes.
  - **initialUrl**: Author-controlled starting URL. Workflow consumers do not change it from the run form.
  - **providerId**: Optional default live browser provider. Callers may override it with `_browserProvider`.

## Variable References
- Start inputs are exposed as `{{start.input.<fieldKey>}}`.
- If no input schema exists, downstream nodes can use `{{start.input}}`.
- Do not use the older `{{start.<fieldKey>}}` form in newly generated workflows.
