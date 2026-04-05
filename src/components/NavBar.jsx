import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/navbar.css'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, loading } = useContext(AuthContext)

  if (loading) return null
  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/script-generator', label: 'Scripts', icon: '✍️' },
    { path: '/record', label: 'Record', icon: '🎥' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav className="nav">
        <div className="nav-inner">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-tab ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-tab-icon">{item.icon}</span>
              <span className="nav-tab-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Top Bar */}
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
            <button className="nav-logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
