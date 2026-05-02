// Shared shell for pipeline nodes (VectorShift-style card + handles)

import { Handle, Position } from 'reactflow';
import './baseNode.css';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children
 * @param {{ id: string, style?: object }[]} [props.targets]
 * @param {{ id: string, style?: object }[]} [props.sources]
 * @param {React.CSSProperties} [props.rootStyle] merged onto the outer `.vs-node` shell
 * @param {string} [props.rootClassName] appended to `.vs-node`
 */
export function BaseNode({ title, subtitle, children, targets = [], sources = [], rootStyle, rootClassName }) {
  return (
    <div className={['vs-node', rootClassName].filter(Boolean).join(' ')} style={rootStyle}>
      <div className="vs-node__header">
        <span className="vs-node__title">{title}</span>
        {subtitle ? <span className="vs-node__subtitle">{subtitle}</span> : null}
      </div>
      <div className="vs-node__body">{children}</div>
      {targets.map((h) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={h.id}
          className="vs-node__handle vs-node__handle--target"
          style={h.style}
        />
      ))}
      {sources.map((h) => (
        <Handle
          key={h.id}
          type="source"
          position={Position.Right}
          id={h.id}
          className="vs-node__handle vs-node__handle--source"
          style={h.style}
        />
      ))}
    </div>
  );
}
