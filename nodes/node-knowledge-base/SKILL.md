---
name: node-knowledge-base
description: Capture unstructured outputs and store them natively in the Gabriel RAG indices.
---

# node-knowledge-base

## Purpose
The `knowledge_base` node silences explicitly routes intermediate outputs straight into the vector DB for future workflows or chatbot retrievals. 

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
