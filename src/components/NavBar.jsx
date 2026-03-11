import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const styles = {
    nav: {
      backgroundColor: 'white',
      borderBottom: '2px solid #f0f0f0',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
    },
    logo: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#FF9500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    links: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    link: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    activeLink: {
      color: '#FF9500',
      backgroundColor: '#FFF5E6',
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    email: {
      fontSize: '13px',
      color: '#9ca3af',
      display: 'none',
    },
    logoutBtn: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#FF9500',
      backgroundColor: 'transparent',
      border: '2px solid #FF9500',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  }

  // Show email on wider screens via inline media query workaround
  const emailStyle = {
    ...styles.email,
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div 
          style={styles.logo}
          onClick={() => navigate('/dashboard')}
        >
          🎤 PresentationCoach
        </div>

        <div style={styles.links}>
          <button
            style={{
              ...styles.link,
              ...(isActive('/dashboard') ? styles.activeLink : {}),
            }}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            style={{
              ...styles.link,
              ...(isActive('/script-generator') ? styles.activeLink : {}),
            }}
            onClick={() => navigate('/script-generator')}
          >
            Scripts
          </button>
          <button
            style={{
              ...styles.link,
              ...(isActive('/record') ? styles.activeLink : {}),
            }}
            onClick={() => navigate('/record')}
          >
            Record
          </button>
        </div>

        <div style={styles.right}>
          <span style={emailStyle}>{user.email}</span>
          <button
            style={styles.logoutBtn}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#FF9500'
              e.target.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#FF9500'
            }}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  )
}