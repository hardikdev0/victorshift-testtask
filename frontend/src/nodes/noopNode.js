import { BaseNode } from './BaseNode';

export const NoopNode = ({ id }) => {
  return (
    <BaseNode
      title="Passthrough"
      subtitle="Utility"
      targets={[{ id: `${id}-in` }]}
      sources={[{ id: `${id}-out` }]}
    >
      <p className="vs-node__muted">Simply passes data unchanged.</p>
    </BaseNode>
  );
};
