import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { getOutputsForNodeType, nodeTypeBadge, getNodePickerLabel } from './nodeOutputs';
import './variablePicker.css';

function safeTemplateRef(label) {
  const s = String(label).replace(/[^\w]/g, '_');
  return s || 'node';
}

function useUpstreamNodes(selfId, nodes, edges) {
  return useMemo(() => {
    const upstreamIds = new Set();
    for (const e of edges) {
      if (e.target === selfId) upstreamIds.add(e.source);
    }
    const list = nodes.filter((n) => n.id !== selfId && upstreamIds.has(n.id));
    if (list.length > 0) return list;
    return nodes.filter((n) => n.id !== selfId);
  }, [nodes, edges, selfId]);
}

/**
 * Two-step {{ node → output }} picker. Renders via portal so it is not clipped by the canvas.
 * @param {string} selfNodeId React Flow node id
 */
export function useVariablePicker(selfNodeId) {
  const { nodes, edges } = useStore(
    (s) => ({
      nodes: s.nodes,
      edges: s.edges,
    }),
    shallow
  );

  const [picker, setPicker] = useState(null);
  const upstreamNodes = useUpstreamNodes(selfNodeId, nodes, edges);

  const closePicker = useCallback(() => setPicker(null), []);

  useEffect(() => {
    if (!picker) return;
    const onDoc = (ev) => {
      if (ev.target.closest?.('.vs-var-picker')) return;
      if (ev.target.closest?.('.vs-var-field-wrap')) return;
      closePicker();
    };
    const onKey = (ev) => {
      if (ev.key === 'Escape') closePicker();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [picker, closePicker]);

  const tryOpenPicker = useCallback((fieldKey, value, selectionStart, anchorEl, emptyHint) => {
    const pos = selectionStart ?? value.length;
    if (pos < 2) return;
    if (value.slice(pos - 2, pos) !== '{{') return;
    const anchorRect = anchorEl?.getBoundingClientRect?.() ?? null;
    setPicker({
      fieldKey,
      step: 1,
      triggerStart: pos - 2,
      selectedNode: null,
      anchorRect,
      emptyHint: emptyHint ?? null,
    });
  }, []);

  const finishInsert = useCallback((triggerStart, inserted, getText, setText, inputRef) => {
    const text = getText();
    const before = text.slice(0, triggerStart);
    const after = text.slice(triggerStart + 2);
    const next = before + inserted + after;
    setText(next);
    setPicker(null);
    requestAnimationFrame(() => {
      const el = inputRef?.current;
      if (!el) return;
      const caret = before.length + inserted.length;
      el.focus();
      if (typeof el.setSelectionRange === 'function') {
        el.setSelectionRange(caret, caret);
      }
    });
  }, []);

  /**
   * @param {string} fieldKey
   * @param {() => string} getText
   * @param {(s: string) => void} setText
   * @param {React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>} inputRef
   */
  const renderPicker = useCallback(
    (fieldKey, getText, setText, inputRef) => {
      if (!picker || picker.fieldKey !== fieldKey) return null;

      const rect = picker.anchorRect;
      const pickerStyle =
        rect != null
          ? {
              position: 'fixed',
              top: rect.bottom + 8,
              left: Math.max(8, Math.min(rect.left, typeof window !== 'undefined' ? window.innerWidth - 328 : 8)),
              minWidth: Math.max(240, rect.width),
              zIndex: 10050,
            }
          : {
              position: 'fixed',
              top: '22%',
              left: '50%',
              transform: 'translateX(-50%)',
              minWidth: 240,
              zIndex: 10050,
            };

      const pickerOutputs =
        picker.selectedNode != null ? getOutputsForNodeType(picker.selectedNode.type) : [];

      const onPickOutput = (outputKey) => {
        if (!picker.selectedNode) return;
        const label = getNodePickerLabel(picker.selectedNode);
        const ref = safeTemplateRef(label);
        const inserted = `{{${ref}.${outputKey}}}`;
        finishInsert(picker.triggerStart, inserted, getText, setText, inputRef);
      };

      const hint =
        picker.emptyHint ??
        'Add nodes to the canvas and connect them to this block, then type {{ here.';

      const popover = (
        <div className="vs-var-picker vs-var-picker--portal" style={pickerStyle} role="listbox">
          <div className="vs-var-picker__steps">
            <span
              className={`vs-var-picker__step ${
                picker.step === 1 ? 'vs-var-picker__step--active' : 'vs-var-picker__step--done'
              }`}
            >
              1 Select node
            </span>
            <span className={`vs-var-picker__step ${picker.step === 2 ? 'vs-var-picker__step--active' : ''}`}>
              2 Select output
            </span>
          </div>
          {picker.step === 2 ? (
            <button
              type="button"
              className="vs-var-picker__back"
              onMouseDown={(ev) => ev.preventDefault()}
              onClick={() => setPicker((p) => (p ? { ...p, step: 1, selectedNode: null } : p))}
            >
              ← Back to nodes
            </button>
          ) : null}
          <div className="vs-var-picker__list">
            {picker.step === 1 ? (
              upstreamNodes.length === 0 ? (
                <div className="vs-var-picker__empty">{hint}</div>
              ) : (
                upstreamNodes.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="vs-var-picker__item"
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => setPicker((p) => (p ? { ...p, step: 2, selectedNode: n } : p))}
                  >
                    <span className="vs-var-picker__name">{getNodePickerLabel(n)}</span>
                    <span className="vs-var-picker__badge">{nodeTypeBadge(n.type)}</span>
                  </button>
                ))
              )
            ) : pickerOutputs.length === 0 ? (
              <div className="vs-var-picker__empty">No outputs for this node type.</div>
            ) : (
              pickerOutputs.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className="vs-var-picker__item"
                  onMouseDown={(ev) => ev.preventDefault()}
                  onClick={() => onPickOutput(o.key)}
                >
                  <div className="vs-var-picker__out-meta">
                    <div className="vs-var-picker__out-row">
                      <span className="vs-var-picker__name">{o.label}</span>
                      <span className="vs-var-picker__badge">{o.typeBadge}</span>
                    </div>
                    {o.description ? <span className="vs-var-picker__out-desc">{o.description}</span> : null}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      );

      return createPortal(popover, document.body);
    },
    [picker, upstreamNodes, finishInsert]
  );

  return { upstreamNodes, picker, tryOpenPicker, closePicker, setPicker, renderPicker };
}
