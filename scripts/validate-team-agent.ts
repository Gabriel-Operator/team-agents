import * as fs from 'fs';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npx tsx scripts/validate-team-agent.ts assets/team-agent.json');
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
const parsed = JSON.parse(raw) as Record<string, unknown>;

if (typeof parsed.appId !== 'string' || !parsed.appId.trim()) {
  throw new Error('appId is required');
}

if (typeof parsed.endpointId !== 'string' || !parsed.endpointId.trim()) {
  throw new Error('endpointId is required');
}

if (!parsed.endpoint || typeof parsed.endpoint !== 'object') {
  throw new Error('endpoint object is required');
}

const endpoint = parsed.endpoint as Record<string, unknown>;

if (endpoint.id !== parsed.endpointId) {
  throw new Error('endpoint.id must match endpointId');
}

for (const field of ['name', 'slug', 'method']) {
  if (typeof endpoint[field] !== 'string' || !(endpoint[field] as string).trim()) {
    throw new Error(`endpoint.${field} is required`);
  }
}

if ('workflow' in endpoint && endpoint.workflow !== undefined && endpoint.workflow !== null) {
  if (typeof endpoint.workflow !== 'object') {
    throw new Error('endpoint.workflow must be an object when present');
  }

  const workflow = endpoint.workflow as Record<string, unknown>;

  if (!Array.isArray(workflow.nodes)) {
    throw new Error('endpoint.workflow.nodes must be an array');
  }

  if (!Array.isArray(workflow.edges)) {
    throw new Error('endpoint.workflow.edges must be an array');
  }

  if ('variables' in workflow && workflow.variables !== undefined && !Array.isArray(workflow.variables)) {
    throw new Error('endpoint.workflow.variables must be an array when present');
  }

  for (const [index, node] of workflow.nodes.entries()) {
    if (!node || typeof node !== 'object') {
      throw new Error(`endpoint.workflow.nodes[${index}] must be an object`);
    }

    const record = node as Record<string, unknown>;

    if (typeof record.id !== 'string' || !record.id.trim()) {
      throw new Error(`endpoint.workflow.nodes[${index}].id is required`);
    }

    if (typeof record.type !== 'string' || !record.type.trim()) {
      throw new Error(`endpoint.workflow.nodes[${index}].type is required`);
    }

    if ('data' in record && record.data !== undefined && (record.data === null || typeof record.data !== 'object')) {
      throw new Error(`endpoint.workflow.nodes[${index}].data must be an object when present`);
    }
  }

  for (const [index, edge] of workflow.edges.entries()) {
    if (!edge || typeof edge !== 'object') {
      throw new Error(`endpoint.workflow.edges[${index}] must be an object`);
    }

    const record = edge as Record<string, unknown>;

    for (const field of ['id', 'source', 'target']) {
      if (typeof record[field] !== 'string' || !(record[field] as string).trim()) {
        throw new Error(`endpoint.workflow.edges[${index}].${field} is required`);
      }
    }
  }
}

console.log('team-agent.json is valid');
