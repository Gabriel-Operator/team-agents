# Embedded local models and offline nodes

Use this guidance only when the active runtime reports embedded offline contract version 1.

- Discover the active device capabilities before classifying a graph. Traverse nested agent nodes, tools, delays, memory, knowledge, database access, and suspend/resume paths.
- A local model manifest pins an immutable Hugging Face revision, compatible artifact format, SHA-256, size, runtime engine, and opaque installation ID. Credentials and model selections are device state and never belong in `assets/team-agent.json`.
- Treat chat, schema-constrained output, and verified tool use as separate capabilities. Downloaded or successfully loaded weights do not establish tool reliability.
- Desktop GGUF requires the packaged llama.cpp protocol sidecar. Mobile GGUF requires a build with its native llama.cpp adapter. Browser inference supports only trusted WebLLM MLC bundles with WebGPU. Older or unbundled runtimes must report the model unavailable.
- A local model tool loop is bounded, validates arguments, checks write permission, persists stable operation IDs, and exposes only registered local adapters. HTTP, MCP, hosted databases, notifications, browser actions, and SaaS tools still require their declared connected runtime.
- Database, memory, and knowledge nodes bind to the active local repository only when that adapter is reported. Delay and suspend/resume nodes must checkpoint durably. Applying sync must never resume a run or repeat a tool call.
- Include selected-model, structured-output, tool-use, device, and connectivity requirements in the graph compatibility report. Block before execution when any nested requirement is unavailable; never silently fall back to a hosted model.
