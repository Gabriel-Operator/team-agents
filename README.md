# Gabriel Operator — Team agents skill pack

Canonical skill scaffolds for **page-builder team-agent** (task orchestrator) workflows: JSON shapes for workflow nodes, `team-agent.json`, and task orchestration.

Published from: **[go-code-bot/team-agents](https://github.com/go-code-bot/team-agents)**.

## Current node model

See `README` sections in repo root `SKILL.md` for the latest toolbar vs legacy vs schema-only nodes.

## Installation

### Method 1: NPX (recommended)

```bash
npx github:go-code-bot/team-agents
```

Install into a subdirectory:

```bash
npx github:go-code-bot/team-agents add ./my-team-agent
```

### Method 2: Curl

```bash
curl -fsSL https://raw.githubusercontent.com/go-code-bot/team-agents/main/install.sh | bash
```

## Documentation

After install, read **`SKILL.md`** and **`nodes/node-*/SKILL.md`** for how to edit `team-agent.json` and related assets.
