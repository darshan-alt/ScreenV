'use client';
import { useRef, useEffect, useState } from 'react';

export default function VideoPlayer({
  src,
  onTimeUpdate,
  onLoadedMetadata,
  isPlaying,
  togglePlayback,
  effects = [],
  activeTool
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);

  // Sync video state with props
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.play();
    else videoRef.current.pause();
  }, [isPlaying]);

  // Draw overlay effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      effects.forEach(effect => {
        if (effect.type === 'blur') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.filter = 'blur(10px)';
          ctx.fillRect(effect.x, effect.y, effect.width, effect.height);
          ctx.filter = 'none';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(effect.x, effect.y, effect.width, effect.height);
        } else if (effect.type === 'highlight') {
          ctx.strokeStyle = effect.color || '#f59e0b';
          ctx.lineWidth = effect.lineWidth || 5;
          ctx.setLineDash([]);
          ctx.strokeRect(effect.x, effect.y, effect.width, effect.height);
        }
      });

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [effects]);

  // Handle Resize
  useEffect(() => {
    const resize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleMouseDown = (e) => {
    if (activeTool !== 'blur' && activeTool !== 'highlight') return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDrawStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !drawStart) return;
    // TBD: Visual feedback during drawing
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !drawStart) return;
    setIsDrawing(false);
    // TBD: Finalize region and call onEffectAdded
  };

  return (
    <div className="video-player-container" ref={containerRef}>
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={() => onTimeUpdate(videoRef.current)}
        onLoadedMetadata={() => onLoadedMetadata(videoRef.current)}
        crossOrigin="anonymous"
        onClick={togglePlayback}
      />

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={activeTool === 'blur' || activeTool === 'highlight' ? 'crosshair' : ''}
      />

      {!isPlaying && (
        <button className="play-overlay" onClick={togglePlayback}>▶️</button>
      )}

      <style jsx>{`
        .video-player-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        video {
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: ${activeTool === 'blur' || activeTool === 'highlight' ? 'auto' : 'none'};
        }
        .crosshair { cursor: crosshair; }
        .play-overlay {
          position: absolute;
          width: 80px;
          height: 80px;
          background: rgba(79, 70, 229, 0.8);
          border: none;
          border-radius: 50%;
          font-size: 32px;
          color: white;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .play-overlay:hover {
          transform: scale(1.1);
          background: var(--primary);
        }
      `}</style>
    </div>
  );
}
