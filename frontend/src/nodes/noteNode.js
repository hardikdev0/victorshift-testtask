import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { measureFormControlScrollWidth } from './nodeAutoWidth';

export const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [currText, setCurrText] = useState(data?.text ?? '');
  const textareaRef = useRef(null);
  const [boxWidth, setBoxWidth] = useState(220);

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
        title="Note"
        subtitle="Comment"
        targets={[]}
        sources={[]}
      >
        <textarea
          ref={textareaRef}
          className="vs-node-textarea"
          rows={2}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          spellCheck={false}
          placeholder={'Add a note...'}
          style={{ marginTop: '8px', width: '100%' }}
        />
      </BaseNode>
    </div>
  );
};
