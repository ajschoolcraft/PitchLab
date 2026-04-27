/**
 * @fileoverview Responsive navigation system.
 * Renders a mobile bottom tab bar (with a slide-out drawer for secondary links)
 * on viewports under 768px, and a traditional top navigation bar on desktop.
 * Handles focus management, scroll locking, and keyboard accessibility for the
 * mobile drawer.
 */

import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/navbar.css'
function BottomTabs({ isActive, onOpenDrawer, drawerOpen, navigate, triggerRef }) {
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
          ref={triggerRef}
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
function MobileDrawer({ open, onClose, user, onLogout, navigate, firstLinkRef }) {
  const drawerRef = useRef(null)

  const links = [
    { path: '/script-generator', label: 'Scripts', icon: '✍️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/share', label: 'Share', icon: '📤' },
    { path: '/help', label: 'Help', icon: '❓' },
  ]

  const initial = (user?.email?.[0] || '?').toUpperCase()

  // Close drawer on Escape; trap Tab focus within the drawer.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
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
          {links.map((link, index) => (
            <button
              key={link.path}
              ref={index === 0 ? firstLinkRef : null}
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
    { path: '/share', label: 'Share', icon: '📤' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/help', label: 'Help', icon: '❓' },
  ]

  return (
    <div className="nav-desktop">
      <div className="nav-desktop-inner">
        <div className="nav-logo" onClick={() => navigate('/dashboard')}>
          <img src="/pitchlab-icon.png" alt="PitchLab" className="nav-logo-icon" />
          PitchLab
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

  // Refs for focus management.
  const triggerRef = useRef(null)
  const firstLinkRef = useRef(null)
  const wasOpenRef = useRef(false)

  // Move focus into the drawer on open; restore to trigger on close.
  useEffect(() => {
    if (drawerOpen) {
      wasOpenRef.current = true
      firstLinkRef.current?.focus()
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      triggerRef.current?.focus()
    }
  }, [drawerOpen])

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
        triggerRef={triggerRef}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
        navigate={navigate}
        firstLinkRef={firstLinkRef}
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
