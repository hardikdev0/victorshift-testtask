import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { measureFormControlScrollWidth } from './nodeAutoWidth';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const inputRef = useRef(null);
  const [ms, setMs] = useState(data?.delayMs ?? '250');
  const [nodeWidth, setNodeWidth] = useState(200);

  useEffect(() => {
    updateNodeField(id, 'delayMs', ms);
  }, [id, ms, updateNodeField]);

  useLayoutEffect(() => {
    setNodeWidth(measureFormControlScrollWidth(inputRef.current));
  }, [ms]);

  return (
    <BaseNode
      title="Delay"
      subtitle="Timing"
      targets={[{ id: `${id}-in`, style: { top: '50%' } }]}
      sources={[{ id: `${id}-out`, style: { top: '50%' } }]}
      rootStyle={{ width: nodeWidth }}
    >
      <label>
        Milliseconds
        <input ref={inputRef} type="number" min={0} value={ms} onChange={(e) => setMs(e.target.value)} />
      </label>
    </BaseNode>
  );
};
