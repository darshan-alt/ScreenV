'use client';
import Link from 'next/link';

export default function VideoCard({ video, onDelete }) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getThumbnailUrl = (video) => {
    // If we had real thumbnails, we'd use them.
    // For now, let's use a placeholder or a preview if possible.
    return `http://localhost:3001/api/videos/${video.id}/stream`;
  };

  return (
    <div className="video-card">
      <div className="thumbnail-container">
        {/* We use a video element with a low-res source or a frame if possible */}
        <video className="video-preview" preload="metadata">
          <source src={`http://localhost:3001/api/videos/${video.id}/stream#t=0.5`} type="video/webm" />
        </video>
        <div className="duration-badge">{formatDuration(video.duration)}</div>
        <div className="card-actions-overlay">
          <Link href={`/editor/${video.id}`} className="action-btn edit-btn">Edit</Link>
          <button onClick={() => onDelete(video.id)} className="action-btn delete-btn">Delete</button>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="video-title">{video.title}</h3>
        <span className="video-date">{formatDate(video.created_at)}</span>
      </div>
      
      <style jsx>{`
        .video-card {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: 0.3s;
          cursor: pointer;
        }
        .video-card:hover {
          background: rgba(30, 41, 59, 0.6);
          border-color: #334155;
          transform: translateY(-4px);
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.3);
        }
        .thumbnail-container {
          position: relative;
          aspect-ratio: 16 / 9;
          background: #000;
          overflow: hidden;
        }
        .video-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          transition: 0.3s;
        }
        .video-card:hover .video-preview {
          opacity: 1;
        }
        .duration-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .card-actions-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transition: 0.2s;
        }
        .video-card:hover .card-actions-overlay {
          opacity: 1;
        }
        .action-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: 0.2s;
        }
        .edit-btn {
          background: var(--primary);
          color: white;
        }
        .edit-btn:hover {
          background: var(--primary-hover);
        }
        .delete-btn {
          background: #ef4444;
          color: white;
        }
        .delete-btn:hover {
          background: #dc2626;
        }
        .card-content {
          padding: 16px;
        }
        .video-title {
          font-size: 15px;
          font-weight: 600;
          color: white;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .video-date {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
