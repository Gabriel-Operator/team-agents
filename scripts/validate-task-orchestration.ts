import * as fs from 'fs';
import * as path from 'path';

const filePath = process.argv[2];
const teamAgentPath = process.argv[3] || (filePath ? path.join(path.dirname(filePath), 'team-agent.json') : undefined);

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

if (teamAgentPath && fs.existsSync(teamAgentPath)) {
  const teamAgentRaw = fs.readFileSync(teamAgentPath, 'utf8');
  const teamAgent = JSON.parse(teamAgentRaw) as Record<string, unknown>;
  const endpoint = teamAgent.endpoint as Record<string, unknown> | undefined;
  const workflow = endpoint?.workflow as Record<string, unknown> | undefined;
  const nodes = Array.isArray(workflow?.nodes) ? workflow.nodes : [];
  const nativeAgentNodes = new Map<string, { agentId: string; actionId: string }>();

  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue;

    const nodeRecord = node as Record<string, unknown>;
    if (nodeRecord.type !== 'agent' || typeof nodeRecord.id !== 'string') continue;

    const data = nodeRecord.data as Record<string, unknown> | undefined;
    const config = data?.config as Record<string, unknown> | undefined;
    if (!config || config.connectorType !== 'native') continue;

    const agentId = typeof config.agentId === 'string' ? config.agentId.trim() : '';
    const actionId = typeof config.actionId === 'string' ? config.actionId.trim() : '';

    if (agentId && actionId) {
      nativeAgentNodes.set(nodeRecord.id, { agentId, actionId });
    }
  }

  for (const [index, child] of (parsed.childSkills as unknown[]).entries()) {
    const record = child as Record<string, unknown>;
    const workflowNodeId = record.workflowNodeId as string;
    const nativeNode = nativeAgentNodes.get(workflowNodeId);

    if (!nativeNode) {
      throw new Error(`childSkills[${index}].workflowNodeId must reference a native agent node in team-agent.json`);
    }

    if (record.agentId !== nativeNode.agentId) {
      throw new Error(`childSkills[${index}].agentId must match the native agent node config`);
    }

    if (record.actionId !== nativeNode.actionId) {
      throw new Error(`childSkills[${index}].actionId must match the native agent node config`);
    }
  }
}

console.log(`Validated ${filePath}`);
