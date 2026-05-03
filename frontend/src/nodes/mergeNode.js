import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  const [name, setName] = useState(data?.name ?? 'Merge');

  return (
    <BaseNode
      title="Merge"
      subtitle="Combiner"
      targets={[{ id: `${id}-in1`, style: { top: '30%' } }, { id: `${id}-in2`, style: { top: '70%' } }]}
      sources={[{ id: `${id}-out` }]}
    >
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
    </BaseNode>
  );
};
