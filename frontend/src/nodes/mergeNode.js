// Demo node — Part 1: uses BaseNode abstraction

import { BaseNode } from './BaseNode';

export const MergeNode = ({ id }) => (
  <BaseNode
    title="Merge"
    subtitle="Join"
    targets={[
      { id: `${id}-in-a`, style: { top: '35%' } },
      { id: `${id}-in-b`, style: { top: '65%' } },
    ]}
    sources={[{ id: `${id}-out` }]}
  >
    <p className="vs-node__muted">Combines two upstream branches into one flow.</p>
  </BaseNode>
);
