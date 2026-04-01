'use client';
import { useState } from 'react';

export default function HighlightTool({ onApply }) {
  const [color, setColor] = useState('#f59e0b'); // Yellow-ish
  const [lineWidth, setLineWidth] = useState(10);

  return (
    <div className="tool-subpanel">
       <h3>Highlight Mark</h3>
       <p className="tool-desc">Draw circles or boxes around important features on screen.</p>
       
       <div className="control-group">
         <label>Brush Size: {lineWidth}px</label>
         <input 
           type="range" 
           min="2" 
           max="40" 
           value={lineWidth} 
           onChange={e => setLineWidth(parseInt(e.target.value))}
         />
       </div>

       <div className="color-picker">
          <label>Color:</label>
          <div className="colors">
             {['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'].map(c => (
               <div 
                 key={c} 
                 className={`color-swatch ${color === c ? 'active' : ''}`} 
                 style={{ background: c }}
                 onClick={() => setColor(c)}
               ></div>
             ))}
          </div>
       </div>

       <button 
         className="apply-btn" 
         onClick={() => onApply({ type: 'highlight', color, lineWidth })}
       >
         Add Highlight
       </button>

       <style jsx>{`
         .tool-subpanel {
           margin-top: 12px;
           padding: 16px;
           background: rgba(30, 41, 59, 0.4);
           border-radius: 8px;
         }
         h3 { font-size: 14px; margin: 0 0 8px 0; }
         .tool-desc { font-size: 11px; color: var(--text-muted); margin-bottom: 16px; }
         .control-group { margin-bottom: 20px; }
         label { display: block; font-size: 12px; margin-bottom: 8px; color: var(--text-secondary); }
         input[type="range"] { width: 100%; height: 4px; border-radius: 2px; background: var(--border); }
         .color-picker { margin-bottom: 20px; }
         .colors { display: flex; gap: 8px; }
         .color-swatch { 
           width: 24px; 
           height: 24px; 
           border-radius: 50%; 
           cursor: pointer; 
           border: 2px solid transparent; 
           transition: 0.2s;
         }
         .color-swatch.active { border-color: white; transform: scale(1.1); }
         .apply-btn {
           width: 100%;
           padding: 8px;
           background: var(--primary);
           color: white;
           border: none;
           border-radius: 6px;
           font-size: 12px;
           font-weight: 600;
           cursor: pointer;
         }
       `}</style>
    </div>
  );
}
