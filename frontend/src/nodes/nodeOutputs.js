// Declared outputs per node type (for LLM {{ }} variable picker)

export function getOutputsForNodeType(type) {
  switch (type) {
    case 'customInput':
      return [
        {
          key: 'text',
          label: 'text',
          typeBadge: 'Text',
          description: 'The inputted text',
        },
      ];
    case 'customOutput':
      return [
        {
          key: 'value',
          label: 'value',
          typeBadge: 'Text',
          description: 'Output payload',
        },
      ];
    case 'text':
      return [
        {
          key: 'output',
          label: 'output',
          typeBadge: 'Text',
          description: 'Template result',
        },
      ];
    case 'llm':
      return [
        {
          key: 'response',
          label: 'response',
          typeBadge: 'Text',
          description: 'Model response',
        },
      ];
    case 'constant':
      return [
        {
          key: 'value',
          label: 'value',
          typeBadge: 'Text',
          description: 'Literal value',
        },
      ];
    case 'merge':
      return [
        {
          key: 'merged',
          label: 'merged',
          typeBadge: 'Text',
          description: 'Merged stream',
        },
      ];
    case 'router':
      return [
        {
          key: 'branch',
          label: 'branch',
          typeBadge: 'Text',
          description: 'Selected branch',
        },
      ];
    case 'noop':
      return [
        {
          key: 'out',
          label: 'out',
          typeBadge: 'Text',
          description: 'Passthrough',
        },
      ];
    case 'delay':
      return [
        {
          key: 'out',
          label: 'out',
          typeBadge: 'Text',
          description: 'Delayed value',
        },
      ];
    default:
      return [
        {
          key: 'out',
          label: 'out',
          typeBadge: 'Text',
          description: 'Node output',
        },
      ];
  }
}

/** Short type label for picker list */
export function nodeTypeBadge(type) {
  switch (type) {
    case 'customInput':
      return 'Input';
    case 'customOutput':
      return 'Output';
    case 'text':
      return 'Text';
    case 'llm':
      return 'LLM';
    case 'constant':
      return 'Constant';
    case 'merge':
      return 'Merge';
    case 'router':
      return 'Router';
    case 'noop':
      return 'Passthrough';
    case 'delay':
      return 'Delay';
    default:
      return 'Node';
  }
}

/** User-facing id like input_0 (from data or id) */
export function getNodePickerLabel(node) {
  if (!node) return '';
  if (node.type === 'customInput' && node.data?.inputName) return String(node.data.inputName);
  if (node.type === 'customOutput' && node.data?.outputName) return String(node.data.outputName);
  if (node.type === 'llm') return node.id.replace(/^llm-/, 'llm_');
  return node.id.replace(/-/g, '_');
}
