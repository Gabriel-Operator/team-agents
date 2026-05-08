---
name: node-database
description: Schema-only database node; not currently registered in the workflow editor node map or properties panel.
---

# node-database

## Status
`database` exists in `WorkflowNodeType` and schema types, but it is not currently registered in the workflow editor node renderer or properties panel. Do not generate it for current Page Builder workflows unless the editor/runtime has been updated to support it.

## Purpose
The `database` node is a direct integration to the platform's user collections. It allows agents to autonomously log records, update existing entries, or fetch reference data without needing a separate API route.

## Schema: `DatabaseNodeData`

```json
{
  "id": "node_database",
  "type": "database",
  "data": {
    "label": "Save Customer Profile",
    "config": {
      "databaseOperations": [
        {
          "id": "op_123",
          "type": "create",
          "collectionId": "<collection-uuid>",
          "mappings": [
            {
              "outputPath": "$.email",
              "collectionId": "<collection-uuid>",
              "fieldKey": "contact_email",
              "operation": "set"
            }
          ]
        }
      ]
    }
  }
}
```

## Fields
- **config.databaseOperations[].type**: `"create"`, `"read"`, `"update"`, `"delete"`
- **config.databaseOperations[].collectionId**: UUID of the target collection.
- **config.databaseOperations[].recordId**: Required for update/delete/read.
- **config.databaseOperations[].mappings**: Array mapping JSONPath outputs from agent payload to DB fields.
