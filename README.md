# Gabriel Operator — Team agents skill pack

Canonical skill scaffolds for **page-builder team-agent** (task orchestrator) workflows: JSON shapes for workflow nodes, `team-agent.json`, and task orchestration.

Published from: **[go-code-bot/team-agents](https://github.com/go-code-bot/team-agents)**.

The installed root `gabriel.workspace.json` requires team-agent validation and declares
task-orchestration validation only when that optional asset exists. Team agents retain
same-environment runtime IDs and are not portable Persona registry rows.
Commit and push a Team-Agent child before publishing its parent Persona. The parent checks
the declared branch and canonical origin. Unmarked legacy repos use a loud fallback, while
marked repos require declared validators. Parent `prune` removes only stale Git metadata;
the physical Team-Agent checkout is never deleted automatically.

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
