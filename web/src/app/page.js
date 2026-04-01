import Link from 'next/link';

export default function Home() {
  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div style={{ fontWeight: 700, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-gradient)' }}></div>
          ScreenV1
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" className="btn btn-secondary">Log In</Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Get Started</Link>
        </div>
      </nav>

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
        <div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          
          <h1 className="title">
            Record beautifully.<br/>
            <span className="text-gradient">Edit instantly.</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>
            The all-in-one browser extension to capture your screen, add your webcam, and edit like a pro without leaving your browser.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Start Recording — It's Free
            </Link>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✓</span> Extension + Web
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✓</span> Zero installs for editing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✓</span> Frame-perfect timeline
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
