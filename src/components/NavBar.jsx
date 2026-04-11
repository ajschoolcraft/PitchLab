import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/navbar.css'

// Mobile bottom tab bar — 4 slots + "More" that opens the drawer.
function BottomTabs({ isActive, onOpenDrawer, drawerOpen, navigate }) {
  const tabs = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/record', label: 'Record', icon: '🎥' },
    { path: '/recordings', label: 'Videos', icon: '🎬' },
  ]

  return (
    <nav className="nav">
      <div className="nav-inner">
        {tabs.map(tab => (
          <button
            key={tab.path}
            className={`nav-tab ${isActive(tab.path) ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        ))}
        <button
          className={`nav-tab ${drawerOpen ? 'active' : ''}`}
          onClick={onOpenDrawer}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <span className="nav-tab-icon">☰</span>
          <span className="nav-tab-label">More</span>
        </button>
      </div>
    </nav>
  )
}

// Slide-out drawer for less-frequent destinations.
function MobileDrawer({ open, onClose, user, onLogout, navigate }) {
  const links = [
    { path: '/script-generator', label: 'Scripts', icon: '✍️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/share', label: 'Share', icon: '📤' },
    { path: '/help', label: 'Help', icon: '❓' },
  ]

  const initial = (user?.email?.[0] || '?').toUpperCase()

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="drawer-header">
          <div className="drawer-avatar">{initial}</div>
          <div className="drawer-user-email">{user?.email}</div>
        </div>

        <nav className="drawer-nav">
          {links.map(link => (
            <button
              key={link.path}
              className="drawer-link"
              onClick={() => {
                navigate(link.path)
                onClose()
              }}
            >
              <span className="drawer-link-icon">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="drawer-footer">
          <button className="drawer-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </aside>
    </>
  )
}

// Desktop top bar — unchanged behavior, extracted for clarity.
function DesktopTopBar({ user, isActive, navigate, onLogout }) {
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/script-generator', label: 'Scripts', icon: '✍️' },
    { path: '/record', label: 'Record', icon: '🎥' },
    { path: '/recordings', label: 'Recordings', icon: '🎬' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <div className="nav-desktop">
      <div className="nav-desktop-inner">
        <div className="nav-logo" onClick={() => navigate('/dashboard')}>
          <div className="nav-logo-icon">🎤</div>
          PresentationCoach
        </div>

        <div className="nav-links">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <span className="nav-email">{user.email}</span>
          <button className="nav-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, loading } = useContext(AuthContext)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close the drawer whenever the route changes.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [drawerOpen])

  // Close drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  if (loading) return null
  if (!user) return null

  const handleLogout = async () => {
    setDrawerOpen(false)
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <BottomTabs
        isActive={isActive}
        onOpenDrawer={() => setDrawerOpen(true)}
        drawerOpen={drawerOpen}
        navigate={navigate}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
        navigate={navigate}
      />
      <DesktopTopBar
        user={user}
        isActive={isActive}
        navigate={navigate}
        onLogout={handleLogout}
      />
    </>
  )
}
