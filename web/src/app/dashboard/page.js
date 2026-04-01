'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/VideoCard';
import UploadModal from '@/components/UploadModal';
import { useToast } from '@/components/Toast';

export default function Dashboard() {
  const router = useRouter();
  const toast = useToast();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    // Check auth
    const token = typeof window !== 'undefined' ? localStorage.getItem('screenv1_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    fetchVideos();
  }, [router]);

  async function fetchVideos() {
    try {
      setLoading(true);
      const data = await api.getVideos();
      setVideos(data.videos);
      setFilteredVideos(data.videos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let result = [...videos];
    
    // Search
    if (searchQuery) {
      result = result.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortOrder === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
    
    setFilteredVideos(result);
  }, [searchQuery, sortOrder, videos]);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this recording?')) return;
    
    try {
      await api.deleteVideo(id);
      setVideos(videos.filter(v => v.id !== id));
      toast('Video deleted', 'success');
    } catch (err) {
      toast('Failed to delete video: ' + err.message, 'error');
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="title">My Library</h1>
            <p className="subtitle">All your recordings in one place</p>
          </div>
          
          <div className="header-right">
             <button className="primary-btn" onClick={() => setIsUploadOpen(true)}>
               New Recording
             </button>
          </div>
        </header>

        {videos.length > 0 && (
          <div className="dashboard-utils">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search recordings..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="sort-box">
              <label>Sort by:</label>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="skeleton-grid">
               {[1,2,3,4].map(i => <div key={i} className="skeleton-card"></div>)}
            </div>
          </div>
        ) : error ? (
          <div className="error-state">
             <p>{error}</p>
             <button onClick={fetchVideos} className="retry-btn">Retry</button>
          </div>
        ) : videos.length === 0 ? (
          <div className="empty-state">
             <div className="empty-icon">📂</div>
             <h3>No recordings yet</h3>
             <p>Start recording with the ScreenV1 browser extension to see your videos here.</p>
             <button className="secondary-btn" onClick={() => window.open('#', '_blank')}>
               Install Extension
             </button>
          </div>
        ) : (
          <div className="video-grid">
             {filteredVideos.map(video => (
               <VideoCard key={video.id} video={video} onDelete={handleDelete} />
             ))}
          </div>
        )}

        <UploadModal 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
          onUploadSuccess={fetchVideos}
        />
      </main>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .dashboard-utils {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
          align-items: center;
        }
        .search-box {
          flex: 1;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
        }
        .search-box input {
          width: 100%;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px 10px 36px;
          color: white;
          font-size: 14px;
        }
        .sort-box {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 14px;
        }
        .sort-box select {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }
        .title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.04em;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 16px;
          margin: 0;
        }
        .primary-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .primary-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px;
        }
        .empty-state {
          text-align: center;
          padding: 100px 0;
          border: 1px dashed var(--border);
          border-radius: 20px;
          background: rgba(30, 41, 59, 0.2);
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .empty-state h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        .empty-state p {
          color: var(--text-muted);
          margin-bottom: 24px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .secondary-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .secondary-btn:hover {
          background: var(--border);
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px;
        }
        .skeleton-card {
          aspect-ratio: 16 / 9;
          background: rgba(30, 41, 59, 0.3);
          border-radius: 12px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
