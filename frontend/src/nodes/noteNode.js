import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note ?? 'Write notes here...');

  return (
    <BaseNode
      title="Note"
      subtitle="Documentation"
      targets={[]}
      sources={[]}
      rootStyle={{ minWidth: '250px' }}
    >
      <textarea
        className="vs-node-textarea"
        style={{ minHeight: '120px' }}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Pipeline notes"
      />
    </BaseNode>
  );
};
