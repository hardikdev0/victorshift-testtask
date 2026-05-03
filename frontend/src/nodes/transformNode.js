import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation ?? 'Uppercase');

  return (
    <BaseNode
      title="Transform"
      subtitle="Data"
      targets={[{ id: `${id}-in` }]}
      sources={[{ id: `${id}-out` }]}
    >
      <label>
        Operation
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="Uppercase">Uppercase</option>
          <option value="Lowercase">Lowercase</option>
          <option value="Trim">Trim</option>
        </select>
      </label>
    </BaseNode>
  );
};
