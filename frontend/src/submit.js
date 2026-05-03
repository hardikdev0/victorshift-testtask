// submit.js — Part 4: POST pipeline, show alert with num_nodes, num_edges, is_dag

import { useCallback, useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

function formatAlertBody(data) {
  const n = data.num_nodes;
  const e = data.num_edges;
  const dag = data.is_dag;
  const dagLine = dag
    ? 'Yes — the graph has no cycles.'
    : 'No — the pipeline contains a cycle (not a DAG).';
  return (
    `Pipeline summary\n\n` +
    `Nodes: ${n}\n` +
    `Edges: ${e}\n` +
    `Directed acyclic graph (DAG): ${dagLine}`
  );
}

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pipeline', JSON.stringify({ nodes, edges }));
      const res = await fetch(`${API_BASE}/pipelines/parse`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = data.detail;
        const detailStr = Array.isArray(detail)
          ? detail.map((d) => d.msg || JSON.stringify(d)).join('; ')
          : typeof detail === 'string'
            ? detail
            : detail && JSON.stringify(detail);
        setLoading(false);
        window.alert(`Could not parse pipeline.\n\n${detailStr || res.statusText || 'Unknown error'}`);
        return;
      }
      if (
        typeof data.num_nodes !== 'number' ||
        typeof data.num_edges !== 'number' ||
        typeof data.is_dag !== 'boolean'
      ) {
        setLoading(false);
        window.alert('Unexpected response from server. Check backend /pipelines/parse output.');
        return;
      }
      setLoading(false);
      window.alert(formatAlertBody(data));
    } catch (err) {
      setLoading(false);
      window.alert(
        `Network error: ${err.message || err}\n\nMake sure the FastAPI backend is running (e.g. python3 -m uvicorn main:app --reload in the backend folder).`
      );
    }
  }, [nodes, edges]);

  return (
    <div className="pipeline-submit">
      <button type="button" className="pipeline-submit__btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting…' : 'Submit pipeline'}
      </button>
    </div>
  );
};
