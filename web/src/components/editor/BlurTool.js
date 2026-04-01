'use client';
import { useState } from 'react';

export default function BlurTool({ onApply }) {
  const [blurAmount, setBlurAmount] = useState(10);
  const [isApplying, setIsApplying] = useState(false);

  return (
    <div className="tool-subpanel">
       <h3>Blur Filter</h3>
       <p className="tool-desc">Select a region on the video player to blur sensitive information.</p>
       
       <div className="control-group">
         <label>Strength: {blurAmount}px</label>
         <input 
           type="range" 
           min="1" 
           max="50" 
           value={blurAmount} 
           onChange={e => setBlurAmount(parseInt(e.target.value))}
         />
       </div>

       <div className="active-regions">
          <div className="region-item">
            <span>Rectangle Region #1</span>
            <button className="remove-btn">&times;</button>
          </div>
       </div>

       <button 
         className="apply-btn" 
         onClick={() => onApply({ type: 'blur', amount: blurAmount })}
         disabled={isApplying}
       >
         Add Blur Region
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
         .active-regions { margin-bottom: 16px; }
         .region-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 8px;
           background: rgba(15, 23, 42, 0.4);
           border-radius: 4px;
           font-size: 11px;
         }
         .remove-btn { background: transparent; border: none; color: #ef4444; cursor: pointer; }
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
