---
name: node-database
description: Execute create, read, update, or delete operations on local collections directly from the workflow.
---

# node-database

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
