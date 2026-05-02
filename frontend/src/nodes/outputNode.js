// outputNode.js — Name field supports {{ → node → output picker (portal, not clipped by canvas)

import { useState, useEffect, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { useVariablePicker } from './useVariablePicker';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const { tryOpenPicker, renderPicker } = useVariablePicker(id);
  const nameInputRef = useRef(null);

  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  useEffect(() => {
    updateNodeField(id, 'outputName', currName);
  }, [id, currName, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'outputType', outputType);
  }, [id, outputType, updateNodeField]);

  const onNameChange = (e) => {
    const v = e.target.value;
    const pos = e.target.selectionStart ?? v.length;
    setCurrName(v);
    tryOpenPicker(
      'name',
      v,
      pos,
      nameInputRef.current,
      'Connect another node into this Output (or add nodes on the canvas), then type {{ here.'
    );
  };

  return (
    <BaseNode
      title="Output"
      subtitle="Sink"
      targets={[{ id: `${id}-value` }]}
    >
      <div className="vs-var-field-wrap">
        <label>
          Name
          <input
            ref={nameInputRef}
            type="text"
            value={currName}
            onChange={onNameChange}
            spellCheck={false}
            placeholder="output_1 or type {{ to insert from a node"
          />
        </label>
        {renderPicker('name', () => currName, setCurrName, nameInputRef)}
      </div>
      <label>
        Type
        <select value={outputType} onChange={(e) => setOutputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
};
