import * as fs from 'fs';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npx tsx scripts/validate-task-orchestration.ts <path-to-task-orchestration.json>');
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
const parsed = JSON.parse(raw) as Record<string, unknown>;

if (typeof parsed.appId !== 'string' || !parsed.appId.trim()) {
  throw new Error('task-orchestration.json must include a non-empty appId');
}

if (typeof parsed.endpointId !== 'string' || !parsed.endpointId.trim()) {
  throw new Error('task-orchestration.json must include a non-empty endpointId');
}

if (!parsed.masterSkill || typeof parsed.masterSkill !== 'object') {
  throw new Error('task-orchestration.json must include a masterSkill object');
}

if (!Array.isArray(parsed.childSkills)) {
  throw new Error('task-orchestration.json must include childSkills[]');
}

if (!parsed.orchestratorCompletion || typeof parsed.orchestratorCompletion !== 'object') {
  throw new Error('task-orchestration.json must include orchestratorCompletion');
}

for (const [index, child] of (parsed.childSkills as unknown[]).entries()) {
  if (!child || typeof child !== 'object') {
    throw new Error(`childSkills[${index}] must be an object`);
  }
  const record = child as Record<string, unknown>;
  if (typeof record.workflowNodeId !== 'string' || !record.workflowNodeId.trim()) {
    throw new Error(`childSkills[${index}] must include workflowNodeId`);
  }
  if (typeof record.agentId !== 'string' || !record.agentId.trim()) {
    throw new Error(`childSkills[${index}] must include agentId`);
  }
  if (typeof record.actionId !== 'string' || !record.actionId.trim()) {
    throw new Error(`childSkills[${index}] must include actionId`);
  }
  if (!Array.isArray(record.todoMappings)) {
    throw new Error(`childSkills[${index}] must include todoMappings[]`);
  }
}

console.log(`Validated ${filePath}`);
