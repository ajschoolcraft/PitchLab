import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, loading } = useContext(AuthContext)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) return null  // Wait for auth to load
  if (!user) return null    // Hide nav if not logged in

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/script-generator', label: 'Create Script', icon: '✍️' },
    { path: '/record', label: 'Record', icon: '🎥' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        
        .pc-nav {
          background: white;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .pc-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
        }
        .pc-nav-logo {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: -0.3px;
          transition: opacity 0.2s;
        }
        .pc-nav-logo:hover { opacity: 0.8; }
        .pc-nav-logo-dot {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
        }
        .pc-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pc-nav-link {
          padding: 8px 16px;
          font-size: 15px;
          font-weight: 500;
          color: #6b7280;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pc-nav-link:hover {
          color: #1a1a1a;
          background: #f5f5f5;
        }
        .pc-nav-link.active {
          color: #FF9500;
          background: #FFF8F0;
          font-weight: 600;
        }
        .pc-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pc-nav-email {
          font-size: 13px;
          color: #9ca3af;
        }
        .pc-nav-logout {
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: transparent;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .pc-nav-logout:hover {
          color: #FF9500;
          border-color: #FF9500;
          background: #FFF8F0;
        }
        .pc-nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
        }
        .pc-nav-mobile-menu {
          display: none;
        }
        @media (max-width: 768px) {
          .pc-nav-links, .pc-nav-email { display: none; }
          .pc-nav-mobile-toggle { display: block; }
          .pc-nav-mobile-menu {
            display: ${mobileOpen ? 'flex' : 'none'};
            position: fixed;
            top: 68px;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            flex-direction: column;
            padding: 24px;
            gap: 8px;
            z-index: 99;
            animation: slideDown 0.2s ease;
          }
          .pc-nav-mobile-menu .pc-nav-link {
            font-size: 18px;
            padding: 16px;
            justify-content: flex-start;
          }
          .pc-nav-mobile-menu .pc-nav-logout {
            margin-top: 16px;
            padding: 16px;
            text-align: center;
            font-size: 16px;
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>

      <nav className="pc-nav">
        <div className="pc-nav-inner">
          <div className="pc-nav-logo" onClick={() => navigate('/dashboard')}>
            <div className="pc-nav-logo-dot">🎤</div>
            PresentationCoach
          </div>

          <div className="pc-nav-links">
            {navItems.map(item => (
              <button
                key={item.path}
                className={`pc-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="pc-nav-right">
            <span className="pc-nav-email">{user.email}</span>
            <button className="pc-nav-logout" onClick={handleLogout}>
              Log Out
            </button>
            <button 
              className="pc-nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      <div className="pc-nav-mobile-menu">
        {navItems.map(item => (
          <button
            key={item.path}
            className={`pc-nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => {
              navigate(item.path)
              setMobileOpen(false)
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <button className="pc-nav-logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </>
  )
}