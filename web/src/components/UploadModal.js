'use client';
import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    // Only allow video files
    if (!file.type.startsWith('video/')) {
      toast('Please upload a valid video file.', 'error');
      return;
    }

    try {
      setUploading(true);
      setProgress(10); // Initial progress

      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', file.name.split('.')[0]);

      // Note: Full progress tracking requires XMLHttpRequest or a custom fetch wrapper
      // For now we'll simulate some progress as Fetch doesn't support upload progress natively
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 500);

      await api.uploadVideo(formData);
      
      clearInterval(interval);
      setProgress(100);
      toast('Video uploaded successfully!', 'success');
      
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 500);
    } catch (err) {
      toast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Upload Video</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        <div 
          className={`drop-zone ${dragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current.click()}
        >
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="video/*"
          />
          
          {uploading ? (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              <span>Uploading... {progress}%</span>
            </div>
          ) : (
            <div className="drop-zone-content">
              <div className="upload-icon">📤</div>
              <p>Drag & drop your recording here or <span>browse</span></p>
              <span className="file-hint">Supported formats: MP4, WebM (Max 500MB)</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          width: 500px;
          padding: 32px;
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .modal-header h2 { margin: 0; font-size: 20px; }
        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 24px;
          cursor: pointer;
        }
        .drop-zone {
          height: 240px;
          border: 2px dashed var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
          cursor: pointer;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .drop-zone.active {
          border-color: var(--primary);
          background: rgba(79, 70, 229, 0.05);
        }
        .drop-zone.uploading {
          cursor: default;
          border-style: solid;
        }
        .drop-zone:hover:not(.uploading) {
          border-color: var(--primary);
        }
        .upload-icon { font-size: 40px; margin-bottom: 16px; }
        .drop-zone p { margin: 0 0 8px 0; font-size: 16px; }
        .drop-zone p span { color: var(--primary); font-weight: 600; }
        .file-hint { font-size: 12px; color: var(--text-muted); }
        .progress-container {
          width: 80%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .progress-bar {
          height: 8px;
          background: var(--primary);
          border-radius: 4px;
          transition: width 0.2s;
        }
      `}</style>
    </div>
  );
}
