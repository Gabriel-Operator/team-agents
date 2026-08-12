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
- **config.resumeFields**: Structured form fields for resume data. Field types are `"text"`, `"textarea"`, `"number"`, `"boolean"`, `"select"`, and `"image"`.
- **config.resumeFieldsFrom**: Resolve the fields from an upstream node output instead of listing them here. See below.
- **config.sleepMs**: Milliseconds to sleep when `mode` is `"sleep"`.
- **config.untilIso**: ISO datetime string when `mode` is `"sleep_until"`.

## Runtime-resolved fields (`resumeFieldsFrom`)

`resumeFields` describes a question set known when the workflow is authored. When
the questions are only knowable at run time — filling a form discovered during
the run, for instance — point at an upstream node output instead:

```json
{
  "id": "node_collect",
  "type": "suspend_resume",
  "data": {
    "label": "Ask what to fill",
    "config": {
      "mode": "suspend",
      "suspendMessage": "I need a few details to complete this form.",
      "resumeFieldsFrom": "start.record.data.form_fields"
    }
  }
}
```

The value is a variable path, or a full `{{...}}` expression. Resolution is
**workflow-scoped**: `start.*` for the workflow's own inputs, `<nodeId>.*` for an
earlier node's output, or a workflow variable.

A pipeline `schema-form:discover:` transition writes `form_fields` onto the case
rather than into this workflow, so reach it through the workflow's inputs —
`start.record.data.form_fields`. A pipeline transition id is **not** a node id and
cannot be referenced directly.

Rules:

- `resumeFieldsFrom` wins when both it and `resumeFields` are set.
- Dynamic form collection should resolve the trusted fields from the pipeline
  record (for example `{{start.record.data.form_fields}}`). Do not regenerate or
  paraphrase the schema with an LLM. The same suspended node is resumed by chat,
  in-app voice, delegated phone, or secure email; channels must not create
  separate workflow attempts or write directly to List data.
- The resolved array is validated server-side before anyone is asked anything.
  Unknown field types, missing or duplicate keys, and selects without options
  **fail the run** rather than suspending with a schema that cannot be answered.
- Unrecognised properties on a resolved field are dropped.
- The field schema is server-authoritative. A resume request supplies answers
  only; any schema it sends is ignored, and answers are validated against the
  fields persisted at suspend time.

## Authoring Rules
- Use `suspend_resume` for new waits, sleeps, and human resume points.
- Use legacy `delay` only to preserve older saved workflow definitions.
