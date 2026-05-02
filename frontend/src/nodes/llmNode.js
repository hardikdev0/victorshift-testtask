// llmNode.js — System + prompt fields; type "{{" for two-step node → output picker

import { useState, useEffect, useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { getNodePickerLabel } from './nodeOutputs';
import { useVariablePicker } from './useVariablePicker';

const graphSelector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  updateNodeField: state.updateNodeField,
});

export const LLMNode = ({ id, data }) => {
  const { nodes, edges, updateNodeField } = useStore(graphSelector, shallow);
  const { tryOpenPicker, renderPicker } = useVariablePicker(id);

  const [systemText, setSystemText] = useState(data?.systemText ?? 'Answer the question based on context.');
  const [promptText, setPromptText] = useState(data?.promptText ?? '');

  const systemRef = useRef(null);
  const promptRef = useRef(null);

  useEffect(() => {
    updateNodeField(id, 'systemText', systemText);
  }, [id, systemText, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'promptText', promptText);
  }, [id, promptText, updateNodeField]);

  const upstreamIds = useMemo(() => {
    const set = new Set();
    for (const e of edges) {
      if (e.target === id) set.add(e.source);
    }
    return set;
  }, [edges, id]);

  const unusedUpstreamLabels = useMemo(() => {
    const blob = `${systemText}\n${promptText}`;
    const missing = [];
    for (const n of nodes.filter((n) => upstreamIds.has(n.id))) {
      const lab = getNodePickerLabel(n);
      if (lab && !blob.includes(lab)) missing.push(lab);
    }
    return missing;
  }, [nodes, upstreamIds, systemText, promptText]);

  const onSystemChange = (e) => {
    const v = e.target.value;
    const pos = e.target.selectionStart;
    setSystemText(v);
    tryOpenPicker('system', v, pos, systemRef.current);
  };

  const onPromptChange = (e) => {
    const v = e.target.value;
    const pos = e.target.selectionStart;
    setPromptText(v);
    tryOpenPicker('prompt', v, pos, promptRef.current);
  };

  return (
    <BaseNode
      title="LLM"
      subtitle="Model"
      targets={[
        { id: `${id}-system`, style: { top: '28%' } },
        { id: `${id}-prompt`, style: { top: '62%' } },
      ]}
      sources={[{ id: `${id}-response` }]}
    >
      {unusedUpstreamLabels.length > 0 ? (
        <p className="vs-var-warn">
          You are not referencing connected inputs: {unusedUpstreamLabels.join(', ')}. Type {'{{'} in a field below to
          insert from a node.
        </p>
      ) : null}
      <div className="vs-var-field-wrap">
        <label>
          System (instructions)
          <textarea
            ref={systemRef}
            className="vs-node-textarea"
            rows={2}
            value={systemText}
            onChange={onSystemChange}
            spellCheck={false}
            placeholder={'Type {{ to reference upstream data'}
          />
        </label>
        {renderPicker('system', () => systemText, setSystemText, systemRef)}
      </div>
      <div className="vs-var-field-wrap">
        <label>
          Prompt / question
          <textarea
            ref={promptRef}
            className="vs-node-textarea"
            rows={3}
            value={promptText}
            onChange={onPromptChange}
            spellCheck={false}
            placeholder={'Type {{ to pick a node, then an output field'}
          />
        </label>
        {renderPicker('prompt', () => promptText, setPromptText, promptRef)}
      </div>
    </BaseNode>
  );
};
