---
name: node-knowledge-base
description: Schema-only knowledge base capture node; not currently registered in the workflow editor node map or properties panel.
---

# node-knowledge-base

## Status
`knowledge_base` exists in `WorkflowNodeType` and schema types, but it is not currently registered in the workflow editor node renderer or properties panel. Do not generate it for current Page Builder workflows unless the editor/runtime has been updated to support it.

## Purpose
The `knowledge_base` node routes intermediate outputs into the vector DB for future workflows or chatbot retrievals.

## Schema: `KnowledgeBaseNodeData`

```json
{
  "id": "node_kb",
  "type": "knowledge_base",
  "data": {
    "label": "Ingest Report",
    "config": {
      "scope": "shared",
      "titleTemplate": "Supplier Report: {{node_aggregate.output.supplierName}}",
      "contentTemplate": "The full details: {{node_agent_1.output.reportText}}",
      "captureNodeIds": ["node_agent_1"],
      "tags": ["finance", "procurement"]
    }
  }
}
```

## Fields
- **config.scope**: `"personal"` (tied to user ID) or `"shared"` (accessible to entire team).
- **config.titleTemplate**: Template to name the document chunk.
- **config.contentTemplate**: Template for formatting the exact string pushed to the index.
- **config.captureNodeIds**: Optional explicit list of prior node IDs to include in the captured context.
- **config.tags**: Metatags added to the embedding for filtering.
