'use client';
import { useState } from 'react';

export default function MusicPanel({ onAddMusic }) {
  const tracks = [
    { id: '1', title: 'Lofi Chill', duration: '2:30', file: 'lofi.mp3' },
    { id: '2', title: 'Upbeat Corporate', duration: '1:45', file: 'corp.mp3' },
    { id: '3', title: 'Cinematic Flow', duration: '3:05', file: 'cine.mp3' }
  ];

  const [volume, setVolume] = useState(50);

  return (
    <div className="tool-subpanel">
       <h3>Background Music</h3>
       <p className="tool-desc">Select a track to add to your video timeline.</p>
       
       <div className="track-list">
          {tracks.map(track => (
            <div key={track.id} className="track-item" onClick={() => onAddMusic(track)}>
               <div className="track-info">
                  <span className="track-title">{track.title}</span>
                  <span className="track-duration">{track.duration}</span>
               </div>
               <button className="add-track-btn">+</button>
            </div>
          ))}
       </div>

       <div className="control-group">
          <label>Track Volume: {volume}%</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={e => setVolume(parseInt(e.target.value))}
          />
       </div>

       <style jsx>{`
         .tool-subpanel {
           margin-top: 12px;
           padding: 16px;
           background: rgba(30, 41, 59, 0.4);
           border-radius: 8px;
         }
         h3 { font-size: 14px; margin: 0 0 8px 0; }
         .tool-desc { font-size: 11px; color: var(--text-muted); margin-bottom: 12px; }
         .track-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
         .track-item {
           padding: 10px;
           background: rgba(15, 23, 42, 0.4);
           border-radius: 6px;
           display: flex;
           justify-content: space-between;
           align-items: center;
           cursor: pointer;
           transition: 0.2s;
         }
         .track-item:hover { background: rgba(30, 41, 59, 0.6); }
         .track-info { display: flex; flex-direction: column; gap: 2px; }
         .track-title { font-size: 12px; font-weight: 500; }
         .track-duration { font-size: 10px; color: var(--text-muted); }
         .add-track-btn { background: transparent; border: none; color: var(--primary); font-size: 18px; font-weight: 700; cursor: pointer; }
         .control-group { margin-top: 16px; }
         label { display: block; font-size: 12px; margin-bottom: 8px; color: var(--text-secondary); }
         input[type="range"] { width: 100%; height: 4px; border-radius: 2px; background: var(--border); }
       `}</style>
    </div>
  );
}
