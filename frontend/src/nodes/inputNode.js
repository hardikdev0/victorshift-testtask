// inputNode.js

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { measureFormControlScrollWidth } from './nodeAutoWidth';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const [nodeWidth, setNodeWidth] = useState(200);

  useEffect(() => {
    updateNodeField(id, 'inputName', currName);
  }, [id, currName, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'inputType', inputType);
  }, [id, inputType, updateNodeField]);

  useLayoutEffect(() => {
    const wName = measureFormControlScrollWidth(nameRef.current);
    const wType = measureFormControlScrollWidth(typeRef.current);
    setNodeWidth(Math.max(wName, wType));
  }, [currName, inputType]);

  return (
    <BaseNode
      title="Input"
      subtitle="Source"
      sources={[{ id: `${id}-value` }]}
      rootStyle={{ width: nodeWidth }}
    >
      <label>
        Name
        <input ref={nameRef} type="text" value={currName} onChange={(e) => setCurrName(e.target.value)} />
      </label>
      <label>
        Type
        <select ref={typeRef} value={inputType} onChange={(e) => setInputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
};
