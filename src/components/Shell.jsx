import { Link, NavLink } from 'react-router'

export default function Shell({ children, demo, status }) {
  const systemLabel = status === 'error' ? 'SYSTEM OFFLINE' : status === 'loading' ? 'CONNECTING' : 'SYSTEM ONLINE'
  const modeLabel = demo ? 'LOCAL DEMO' : status === 'error' ? 'SUPABASE ERROR' : status === 'loading' ? 'CONNECTING' : 'SUPABASE LIVE'
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="Orbit Crew home">
          <span className="brand-mark">✦</span>
          <span><strong>ORBIT</strong><small>CREW</small></span>
        </Link>
        <p className="sidebar-eyebrow">MISSION CONTROL</p>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><span aria-hidden="true">⌂</span> Home</NavLink>
          <NavLink to="/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><span aria-hidden="true">＋</span> Create</NavLink>
          <NavLink to="/crew" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><span aria-hidden="true">▦</span> Gallery</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="orbit-doodle" aria-hidden="true"><span>✦</span></div>
          <strong>Explore together.</strong>
          <p>Your next mission starts with the right people.</p>
        </div>
      </aside>
      <div className="content-shell">
        <header className={`topbar ${status === 'error' ? 'is-error' : ''}`}>
          <div className="topbar-coordinate"><span className="signal-dot" /> {systemLabel} <span className="topbar-divider">/</span> SECTOR 07</div>
          <span className="mode-pill">{modeLabel}</span>
        </header>
        <main id="main-content" className="main-content">{children}</main>
        <footer className="footer"><span>ORBIT CREW <span aria-hidden="true">✦</span> MISSION CONTROL</span><span>Made for explorers, by explorers.</span></footer>
      </div>
    </div>
  )
}
