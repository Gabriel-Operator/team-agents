# Gabriel Operator Task Orchestrator Skills

These are the canonical skill scaffolds for the `page-builder-team-agent` (aka Task Orchestrator) workflows.
The folder defines JSON structures for `start`, `agent`, `council`, and 11 other parallel integration nodes.

## Installation

### Method 1: NPX (Recommended)
You can scaffold these skills directly into your directory with `npx`:

```bash
npx github:go-code-bot/go-task-orchestrator-skills
```

To install into a specific subdirectory:
```bash
npx github:go-code-bot/go-task-orchestrator-skills add ./my-team-agent
```

### Method 2: Curl
```bash
curl -fsSL https://raw.githubusercontent.com/go-code-bot/go-task-orchestrator-skills/main/install.sh | bash
```

## Documentation
Once installed, read `SKILL.md` (and `nodes/node-*/SKILL.md`) in your target directory to understand how to read and write `team-agent.json` data.
