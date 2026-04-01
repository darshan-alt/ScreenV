import BlurTool from './BlurTool';
import HighlightTool from './HighlightTool';
import MusicPanel from './MusicPanel';

export default function ToolPanel({ activeTool, onToolChange, onApplyEffect }) {
  const tools = [
    { id: 'trim', label: '✂️ Trim', info: 'Cut start/end points' },
    { id: 'blur', label: '🔵 Blur', info: 'Hide sensitive info' },
    { id: 'highlight', label: '🖊️ Highlight', info: 'Draw attention' },
    { id: 'music', label: '🎵 Music', info: 'Add background track' },
    { id: 'combine', label: '🔗 Combine', info: 'Merge with another clip' }
  ];

  return (
    <aside className="tool-panel">
      <h2 className="panel-title">Editing Tools</h2>
      <div className="tool-list">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
          >
            <span className="tool-label">{tool.label}</span>
            <span className="tool-info">{tool.info}</span>
          </button>
        ))}
      </div>

      {activeTool && (
        <div className="sub-panel-container">
          <h3 className="sub-panel-title">{tools.find(t => t.id === activeTool)?.label} Settings</h3>
          <div className="sub-panel-wrapper">
            {activeTool === 'blur' && <BlurTool onApply={onApplyEffect} />}
            {activeTool === 'highlight' && <HighlightTool onApply={onApplyEffect} />}
            {activeTool === 'music' && <MusicPanel onAddMusic={onApplyEffect} />}
            {(activeTool === 'trim' || activeTool === 'combine') && (
              <div className="placeholder-info">
                <p>Adjust the handles on the timeline below to {activeTool} your video.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .tool-panel {
          width: 260px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          border-left: 1px solid var(--border);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          height: calc(100vh - 64px);
          overflow-y: auto;
        }
        .panel-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .tool-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tool-btn {
          width: 100%;
          padding: 14px;
          border: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
          color: var(--text);
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          text-align: left;
        }
        .tool-btn:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: #334155;
          transform: translateY(-2px);
        }
        .tool-btn.active {
          border-color: var(--primary);
          background: rgba(79, 70, 229, 0.15);
          box-shadow: 0 0 15px -5px var(--primary);
        }
        .sub-panel-container {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          animation: fadeIn 0.3s ease-in;
        }
        .sub-panel-title {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sub-panel-wrapper {
          width: 100%;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .placeholder-info {
          padding: 16px;
          font-size: 12px;
          color: var(--text-secondary);
          background: rgba(30, 41, 59, 0.4);
          border-radius: 8px;
          line-height: 1.5;
        }
        .tool-label {
          font-size: 15px;
          font-weight: 600;
        }
        .tool-info {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </aside>
  );
}
