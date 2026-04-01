'use client';
import { useEffect, useRef, useState } from 'react';

export default function Timeline({ duration, currentTime, onSeek, trimStart, trimEnd, onTrimChange, effects = [] }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(null);

  const handleSeek = (e) => {
    if (isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(Math.max(x / rect.width, 0), 1);
    onSeek(progress * duration);
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(Math.max(x / rect.width, 0), 1);
    const time = progress * duration;

    if (isDragging === 'playhead') {
      onSeek(time);
    } else if (isDragging === 'start') {
      onTrimChange(Math.min(time, trimEnd - 0.5), trimEnd);
    } else if (isDragging === 'end') {
      onTrimChange(trimStart, Math.max(time, trimStart + 0.5));
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', () => setIsDragging(null));
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', () => setIsDragging(null));
    };
  }, [isDragging]);

  const getPosition = (time) => (time / duration) * 100;

  const blurEffects = effects.filter(e => e.type === 'blur');
  const highlightEffects = effects.filter(e => e.type === 'highlight');
  const musicEffects = effects.filter(e => e.type === 'music' || e.title);

  const trackRows = [
    { label: '🔵', key: 'blur', items: blurEffects, color: 'rgba(59,130,246,0.6)' },
    { label: '🖊️', key: 'highlight', items: highlightEffects, color: null }, // uses effect.color
    { label: '🎵', key: 'music', items: musicEffects, color: 'rgba(34,197,94,0.6)' },
  ];

  return (
    <div className="timeline-wrapper" ref={containerRef}>
      {/* Main scrub track */}
      <div className="timeline-container" onMouseDown={(e) => {
        if (e.target.classList.contains('timeline-track')) handleSeek(e);
      }}>
        <div className="timeline-track">
          <div
            className="trim-overlay"
            style={{ left: `${getPosition(trimStart)}%`, width: `${getPosition(trimEnd - trimStart)}%` }}
          ></div>

          <div
            className="playhead"
            style={{ left: `${getPosition(currentTime)}%` }}
            onMouseDown={(e) => { e.stopPropagation(); setIsDragging('playhead'); }}
          ></div>

          <div
            className="trim-handle start"
            style={{ left: `${getPosition(trimStart)}%` }}
            onMouseDown={(e) => { e.stopPropagation(); setIsDragging('start'); }}
          >
            <div className="handle-knob"></div>
          </div>
          <div
            className="trim-handle end"
            style={{ left: `${getPosition(trimEnd)}%` }}
            onMouseDown={(e) => { e.stopPropagation(); setIsDragging('end'); }}
          >
            <div className="handle-knob"></div>
          </div>
        </div>
      </div>

      {/* Effect track rows */}
      <div className="effect-tracks">
        {trackRows.map(row => (
          <div key={row.key} className="effect-row">
            <span className="row-label">{row.label}</span>
            <div className="row-track">
              {row.items.map(effect => (
                <div
                  key={effect.id}
                  className="effect-segment"
                  style={{
                    left: `${getPosition(effect.startTime ?? 0)}%`,
                    width: `${getPosition((effect.endTime ?? duration) - (effect.startTime ?? 0))}%`,
                    background: row.color ?? (effect.color ? effect.color + '99' : 'rgba(139,92,246,0.6)'),
                  }}
                  title={effect.title || effect.type}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .timeline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .timeline-container {
          height: 60px;
          background: #1e293b;
          border-radius: 12px;
          position: relative;
          padding: 10px 0;
          cursor: crosshair;
        }
        .timeline-track {
          height: 100%;
          width: 100%;
          background: #334155;
          position: relative;
          border-radius: 6px;
          overflow: visible;
        }
        .trim-overlay {
          position: absolute;
          height: 100%;
          background: rgba(79, 70, 229, 0.2);
          border-left: 2px solid var(--primary);
          border-right: 2px solid var(--primary);
          z-index: 1;
        }
        .playhead {
          position: absolute;
          top: -4px;
          height: calc(100% + 8px);
          width: 2px;
          background: #ef4444;
          z-index: 10;
          cursor: ew-resize;
        }
        .playhead::after {
          content: "";
          position: absolute;
          top: -4px;
          left: -4px;
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
        }
        .trim-handle {
          position: absolute;
          height: 100%;
          width: 4px;
          background: var(--primary);
          z-index: 5;
          cursor: ew-resize;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .handle-knob {
          width: 12px;
          height: 12px;
          background: var(--primary);
          border-radius: 2px;
        }
        /* Effect track rows */
        .effect-tracks {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .effect-row {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 18px;
        }
        .row-label {
          font-size: 12px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .row-track {
          flex: 1;
          height: 100%;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .effect-segment {
          position: absolute;
          height: 100%;
          border-radius: 3px;
          min-width: 4px;
        }
      `}</style>
    </div>
  );
}
