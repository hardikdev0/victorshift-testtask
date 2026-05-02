import { BaseNode } from './BaseNode';

export const NoopNode = ({ id }) => (
  <BaseNode
    title="Passthrough"
    subtitle="Wire"
    targets={[{ id: `${id}-in`, style: { top: '50%' } }]}
    sources={[{ id: `${id}-out`, style: { top: '50%' } }]}
  >
    <p className="vs-node__muted">One-to-one pass-through for layout and routing.</p>
  </BaseNode>
);
