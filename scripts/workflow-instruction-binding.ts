import { DOMAIN_PREVIEW_OPERATIONS, INSTAGRAM_PREVIEW_OPERATIONS, type PreviewOperation } from './workflow-preview-contract';

export type WorkflowInstructionBinding = {
  operation: PreviewOperation;
  revisionOperation?: PreviewOperation;
  inputs: Record<string, string>;
};
const operations: readonly string[] = [...INSTAGRAM_PREVIEW_OPERATIONS, ...Object.values(DOMAIN_PREVIEW_OPERATIONS).flat()];

/** A node names a declared operation, never another package, revision, provider or endpoint. */
export function validateWorkflowInstructionBinding(value: unknown): WorkflowInstructionBinding {
  const binding = value as WorkflowInstructionBinding;
  if (!binding || typeof binding !== 'object' || Array.isArray(binding)
    || Object.keys(binding).some(key => !['operation', 'revisionOperation', 'inputs'].includes(key))
    || !operations.includes(binding.operation)
    || binding.revisionOperation !== undefined && !operations.includes(binding.revisionOperation)
    || !binding.inputs || typeof binding.inputs !== 'object' || Array.isArray(binding.inputs)
    || Object.keys(binding.inputs).length > 12
    || Object.entries(binding.inputs).some(([key, template]) => !/^[a-z][a-z_]{0,40}$/.test(key) || typeof template !== 'string' || template.length > 16000)) {
    throw new Error('Invalid workflow instruction binding');
  }
  return binding;
}
