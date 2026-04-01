'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.refresh();
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/dashboard" className="logo">
          <div className="logo-icon"></div>
          <span className="logo-text">ScreenV1</span>
        </Link>
        
        <div className="nav-actions">
          {user && (
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .navbar {
          height: 64px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary), #8b5cf6);
          border-radius: 8px;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .user-name {
          color: var(--text-muted);
          font-size: 14px;
        }
        .logout-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }
        .logout-btn:hover {
          background: var(--border);
        }
      `}</style>
    </nav>
  );
}
