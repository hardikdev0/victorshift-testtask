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

  const extractVars = (text) => {
    const re = /\{\{\s*([a-zA-Z0-9_$]+(?:\.[a-zA-Z0-9_$]+)*)\s*\}\}/g;
    const matches = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      if (!matches.includes(m[1])) {
        matches.push(m[1]);
      }
    }
    return matches;
  };

  const removeVar = (varName, text, setText) => {
    const escapedVarName = varName.replace(/\./g, '\\.');
    const regex = new RegExp(`\\{\\{\\s*${escapedVarName}\\s*\\}\\}`, 'g');
    setText(text.replace(regex, '').replace(/\n\s*\n/g, '\n').trim());
  };

  const systemVars = useMemo(() => extractVars(systemText), [systemText]);
  const promptVars = useMemo(() => extractVars(promptText), [promptText]);

  const renderChips = (vars, text, setText) => {
    if (vars.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
        {vars.map((v) => (
          <div key={v} className="vs-var-picker__badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' }}>
            <span>{`{{${v}}}`}</span>
            <span
              style={{ cursor: 'pointer', padding: '0 2px', fontWeight: 'bold', color: '#ff8a8a', fontSize: '10px' }}
              onClick={() => removeVar(v, text, setText)}
              title="Remove variable"
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    );
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
      {upstreamIds.size > 0 && (
        <div style={{ minHeight: '34px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginBottom: '8px' }}>
          {unusedUpstreamLabels.length > 0 ? (
            <p className="vs-var-warn" style={{ margin: 0 }}>
              Unused inputs: {unusedUpstreamLabels.join(', ')}
            </p>
          ) : (
            <p className="vs-var-warn" style={{ margin: 0, color: '#88d8b0', backgroundColor: 'rgba(136, 216, 176, 0.1)', borderColor: 'rgba(136, 216, 176, 0.25)' }}>
              All inputs referenced ✓
            </p>
          )}
        </div>
      )}
      <div className="vs-var-field-wrap">
        <label>
          System (instructions)
          <textarea
            ref={systemRef}
            className="vs-llm-textarea"
            rows={2}
            value={systemText}
            onChange={onSystemChange}
            spellCheck={false}
            placeholder={'Type {{ to reference upstream data'}
          />
        </label>
        {renderChips(systemVars, systemText, setSystemText)}
        {renderPicker('system', () => systemText, setSystemText, systemRef)}
      </div>
      <div className="vs-var-field-wrap">
        <label>
          Prompt / question
          <textarea
            ref={promptRef}
            className="vs-llm-textarea vs-llm-textarea--prompt"
            rows={3}
            value={promptText}
            onChange={onPromptChange}
            spellCheck={false}
            placeholder={'Type {{ to pick a node, then an output field'}
          />
        </label>
        {renderChips(promptVars, promptText, setPromptText)}
        {renderPicker('prompt', () => promptText, setPromptText, promptRef)}
      </div>
    </BaseNode>
  );
};
