---
name: node-llm-agent
description: Configure a standalone Mastra-style LLM agent with REST tools and input/output processors.
---

# node-llm-agent

## Purpose
The `llm_agent` node runs a configurable LLM agent directly in the workflow. It is not a native connector node and does not get a `task-orchestration.json` child skill.

## Schema: `LLMAgentNodeData`

```json
{
  "id": "node_llm_agent",
  "type": "llm_agent",
  "position": { "x": 520, "y": 260 },
  "data": {
    "label": "LLM Agent",
    "description": "Standalone LLM agent with configurable processors and tools",
    "config": {
      "prompt": "Investigate {{start.input.topic}} and call tools if needed.",
      "instructions": "You are a careful research assistant.",
      "model": "gpt-4.1",
      "maxSteps": 3,
      "temperature": 0.7,
      "maxTokens": 2000,
      "tools": [
        {
          "id": "tool_search",
          "name": "search",
          "description": "Search an internal endpoint.",
          "url": "https://api.example.com/search",
          "method": "POST",
          "headers": {
            "Content-Type": "application/json"
          },
          "inputSchema": "{\"type\":\"object\",\"properties\":{\"query\":{\"type\":\"string\"}},\"required\":[\"query\"]}"
        }
      ],
      "inputProcessors": [
        {
          "type": "prompt_injection_detector",
          "enabled": true,
          "config": {
            "threshold": 0.7,
            "strategy": "block"
          }
        }
      ],
      "outputProcessors": [],
      "maxProcessorRetries": 2
    }
  }
}
```

## Fields
- **config.prompt**: Optional task prompt. Supports `{{variable}}` interpolation.
- **config.instructions**: Required system instructions for the agent.
- **config.model / maxSteps / temperature / maxTokens**: LLM and loop settings.
- **config.tools**: REST tools with `id`, `name`, `description`, `url`, `method`, optional `headers`, and optional JSON Schema string `inputSchema`.
- **config.inputProcessors / outputProcessors**: Processor configs for token limits, Unicode normalization, prompt injection detection, language detection, moderation, PII detection, batch parts, system prompt scrubbing, or custom processor hooks.
- **config.maxProcessorRetries**: Retry limit when processors abort.

## Authoring Rules
- Do not create a `childSkills[]` mapping for this node. It is a standalone LLM workflow node, not a native browser connector.
- Put browser automations in top-level native `agent` nodes when they need task orchestration child skills.
