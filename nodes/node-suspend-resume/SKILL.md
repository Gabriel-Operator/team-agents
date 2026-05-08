---
name: node-suspend-resume
description: Suspend a workflow for human resume data, or sleep for a duration or until an ISO datetime.
---

# node-suspend-resume

## Purpose
The `suspend_resume` node is the current toolbar node for Mastra-native suspend and sleep behavior. It replaces the legacy `delay` node for new workflow JSON.

## Schema: `SuspendResumeNodeData`

### Suspend

```json
{
  "id": "node_suspend",
  "type": "suspend_resume",
  "position": { "x": 520, "y": 380 },
  "data": {
    "label": "Suspend & Resume",
    "config": {
      "mode": "suspend",
      "suspendMessage": "Waiting for approval",
      "resumeDescription": "Pass { approved: true } to resume",
      "timeoutMs": 0,
      "resumeFields": [
        {
          "key": "approved",
          "label": "Approved",
          "type": "boolean",
          "required": true
        },
        {
          "key": "comment",
          "label": "Comment",
          "type": "textarea",
          "required": false
        }
      ]
    }
  }
}
```

### Sleep

```json
{
  "id": "node_sleep",
  "type": "suspend_resume",
  "data": {
    "label": "Sleep",
    "config": {
      "mode": "sleep",
      "sleepMs": 5000
    }
  }
}
```

## Fields
- **config.mode**: `"suspend"`, `"sleep"`, or `"sleep_until"`.
- **config.suspendMessage**: Message shown while waiting for resume.
- **config.resumeDescription**: Describes expected resume data.
- **config.timeoutMs**: Optional max wait before auto-fail. `0` means unlimited in the editor default.
- **config.resumeFields**: Structured form fields for resume data. Field types are `"text"`, `"textarea"`, `"number"`, `"boolean"`, and `"select"`.
- **config.sleepMs**: Milliseconds to sleep when `mode` is `"sleep"`.
- **config.untilIso**: ISO datetime string when `mode` is `"sleep_until"`.

## Authoring Rules
- Use `suspend_resume` for new waits, sleeps, and human resume points.
- Use legacy `delay` only to preserve older saved workflow definitions.
