// Demo node (Part 1) — lightweight BaseNode: placeholder “transform” step

import { BaseNode } from './BaseNode';

export const TransformNode = ({ id }) => (
  <BaseNode
    title="Transform"
    subtitle="Map"
    targets={[{ id: `${id}-in`, style: { top: '50%' } }]}
    sources={[{ id: `${id}-out`, style: { top: '50%' } }]}
  >
    <p className="vs-node__muted">Example extra node type using the same shell as Merge / Delay.</p>
  </BaseNode>
);
