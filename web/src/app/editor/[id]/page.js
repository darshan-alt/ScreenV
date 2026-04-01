'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { trimVideo } from '@/lib/videoProcessor';
import Navbar from '@/components/Navbar';
import Timeline from '@/components/editor/Timeline';
import ToolPanel from '@/components/editor/ToolPanel';
import { useToast } from '@/components/Toast';

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const videoRef = useRef(null);
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [activeTool, setActiveTool] = useState('trim');
  const [effects, setEffects] = useState([]);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  async function fetchVideo() {
    try {
      setLoading(true);
      const data = await api.getVideo(id);
      const v = data.video;
      if (!v) throw new Error('Video not found');
      setVideo(v);
      setDuration(v.duration || 0);
      setTrimEnd(v.duration || 0);
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !duration) {
         setDuration(videoRef.current.duration);
         setTrimEnd(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleKeyDown = (ev) => {
      if (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA') return;

      if (ev.code === 'Space') {
        ev.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
          else { videoRef.current.pause(); setIsPlaying(false); }
        }
      } else if (ev.key === '[') {
        ev.preventDefault();
        setTrimStart(prev => Math.max(0, prev - 1));
      } else if (ev.key === ']') {
        ev.preventDefault();
        setTrimEnd(prev => Math.min(duration, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration]);

  const handleApplyEffect = (effect) => {
    const startTime = effect.type === 'music' ? 0 : trimStart;
    const endTime = effect.type === 'music' ? duration : trimEnd;
    setEffects(prev => [...prev, { ...effect, id: Date.now(), startTime, endTime }]);
    toast(`Effect added: ${effect.type === 'music' ? 'Music' : effect.type}`, 'success');
  };

  const handleSave = async () => {
    try {
      setProcessing(true);
      const videoUrl = `http://localhost:3001/api/videos/${id}/stream`;
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      const trimmedBlob = await trimVideo(blob, trimStart, trimEnd);
      
      // Upload the new video version
      const formData = new FormData();
      formData.append('video', trimmedBlob, `edited-${Date.now()}.mp4`);
      
      await api.replaceVideo(id, formData);
      toast('Video saved successfully!', 'success');
      router.push('/dashboard');
    } catch (err) {
      console.error('Processing error:', err);
      toast('Failed to process video: ' + err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Loading Editor...</div>;

  return (
    <div className="editor-page">
      <Navbar />
      
      <div className="editor-layout">
        <main className="editor-main">
          <div className="video-viewport">
            <video 
              ref={videoRef}
              src={`http://localhost:3001/api/videos/${id}/stream`}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              crossOrigin="anonymous"
            />
            {!isPlaying && (
              <button className="play-overlay" onClick={togglePlayback}>▶️</button>
            )}
          </div>
          
          <div className="editor-controls">
            <div className="playback-bar">
               <button onClick={togglePlayback} className="play-btn">
                 {isPlaying ? '⏸' : '▶️'}
               </button>
               <span className="time-display">
                 {Math.floor(currentTime)}s / {Math.floor(duration)}s
               </span>
               <div className="spacer"></div>
               <button 
                 className="save-btn" 
                 onClick={handleSave} 
                 disabled={processing}
               >
                 {processing ? 'Processing...' : 'Export Video'}
               </button>
            </div>
            
            <Timeline
              duration={duration}
              currentTime={currentTime}
              onSeek={handleSeek}
              trimStart={trimStart}
              trimEnd={trimEnd}
              onTrimChange={(s, e) => { setTrimStart(s); setTrimEnd(e); }}
              effects={effects}
            />
          </div>
        </main>
        
        <ToolPanel 
          activeTool={activeTool} 
          onToolChange={setActiveTool} 
          onApplyEffect={handleApplyEffect}
        />
      </div>

      <style jsx>{`
        .editor-page {
          height: 100vh;
          background: #0f172a;
          display: flex;
          flex-direction: column;
        }
        .editor-layout {
          display: flex;
          flex: 1;
        }
        .editor-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 32px;
          gap: 32px;
        }
        .video-viewport {
          flex: 1;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 50px -15px rgba(0,0,0,0.5);
          border: 1px solid var(--border);
        }
        video {
          max-width: 100%;
          max-height: 100%;
        }
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
        }
        .play-overlay:hover {
          transform: scale(1.1);
          background: var(--primary);
        }
        .editor-controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .playback-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 12px;
        }
        .play-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        .time-display {
          font-size: 14px;
          color: var(--text-muted);
          font-family: monospace;
        }
        .spacer { flex: 1; }
        .save-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      `}</style>
    </div>
  );
}
