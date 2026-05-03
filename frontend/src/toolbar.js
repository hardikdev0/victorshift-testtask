// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: "end" }}>
                <DraggableNode type="customInput" label="Input" />
                <DraggableNode type="llm" label="LLM" />
                <DraggableNode type="customOutput" label="Output" />
                <DraggableNode type="text" label="Text" />
                <DraggableNode type="merge" label="Merge" />
                <DraggableNode type="noop" label="Passthrough" />
                <DraggableNode type="delay" label="Delay" />
                <DraggableNode type="note" label="Note" />
                <DraggableNode type="transform" label="Transform" />

            </div>
        </div>
    );
};
