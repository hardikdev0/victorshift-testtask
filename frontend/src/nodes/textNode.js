// textNode.js — Part 3: auto-size + {{ variable }} handles

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { measureFormControlScrollWidth } from './nodeAutoWidth';

function extractVariables(text) {
  const re = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;
  const names = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
  }
  return names;
}

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [currText, setCurrText] = useState(data?.text ?? '{{input}}');
  const textareaRef = useRef(null);
  const [boxWidth, setBoxWidth] = useState(220);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  const targetHandles = useMemo(
    () =>
      variables.map((name, i) => {
        const n = variables.length;
        const topPct = n === 1 ? '50%' : `${((100 / (n + 1)) * (i + 1)).toFixed(1)}%`;
        return { id: `${id}-var-${name}`, style: { top: topPct } };
      }),
    [id, variables]
  );

  useEffect(() => {
    updateNodeField(id, 'text', currText);
  }, [id, currText, updateNodeField]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    const nextH = Math.max(56, el.scrollHeight);
    el.style.height = `${nextH}px`;
    setBoxWidth(measureFormControlScrollWidth(el));
  }, [currText]);

  return (
    <div style={{ width: boxWidth }}>
      <BaseNode
        title="Text"
        subtitle="Template"
        targets={targetHandles}
        sources={[{ id: `${id}-output`, style: { top: '50%' } }]}
      >
        <label>
          Text
          <textarea
            ref={textareaRef}
            className="vs-node-textarea"
            rows={2}
            value={currText}
            onChange={(e) => setCurrText(e.target.value)}
            spellCheck={false}
            placeholder={'Use {{myVar}} for inputs'}
          />
        </label>
        {variables.length > 0 ? (
          <p className="vs-node__muted">Variables: {variables.join(', ')}</p>
        ) : null}
      </BaseNode>
    </div>
  );
};
