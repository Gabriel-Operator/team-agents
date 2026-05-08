---
name: node-end
description: Finish the workflow, shape the endpoint response, and optionally persist output to collections or output integrations.
---

# node-end

## Purpose
The `end` node marks final workflow completion. It sets the final status, shapes the JSON response returned to the caller, and can optionally persist selected outputs into a native collection or a page output integration.

## Schema: `EndNodeData`

```json
{
  "id": "node_end",
  "type": "end",
  "position": { "x": 820, "y": 160 },
  "data": {
    "label": "Success End",
    "config": {
      "status": "success",
      "responseConfig": {
        "fields": [
          {
            "key": "finalReport",
            "value": "{{node_structured_output.response.result}}",
            "type": "object"
          }
        ]
      },
      "outputToCollection": {
        "collectionId": "<collection-id>",
        "mappings": []
      },
      "outputIntegration": {
        "enabled": true,
        "fieldMappings": [
          {
            "integrationFieldName": "Final Report",
            "sourceVariable": "{{node_structured_output.response.result}}",
            "fieldType": "rich_text"
          }
        ]
      }
    }
  }
}
```

## Fields
- **config.status**: `"success"`, `"failure"`, or `"custom"`.
- **config.customStatus**: Required when `status` is `"custom"`.
- **config.responseConfig.fields**: Exact response fields returned to the original request trigger.
  - **key**: Output property name.
  - **value**: Static value or `{{variable}}` reference.
  - **type**: Optional output type hint.
- **config.outputToCollection**: Optional native collection persistence using `collectionId` and `OutputMapping[]`.
- **config.outputIntegration**: Optional persistence to the page's configured output integration.
  - **enabled**: Enables output integration writes.
  - **fieldMappings[].integrationFieldName**: Target Airtable column, Notion property, or native field name.
  - **fieldMappings[].sourceVariable**: Variable reference to write.
  - **fieldMappings[].fieldType**: Optional type hint such as `"text"`, `"number"`, `"url"`, `"date"`, `"boolean"`, `"rich_text"`, or `"select"`.
