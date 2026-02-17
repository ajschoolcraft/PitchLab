import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  // If no user, redirect to auth
  if (!user) {
    navigate('/auth')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const handleRecordPresentation = () => {
    navigate('/record')
  }

  const styles = {
    dashboard: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      backgroundColor: '#1e40af',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    headerContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      margin: '0',
    },
    headerSubtitle: {
      fontSize: '14px',
      opacity: '0.9',
      margin: '0',
    },
    logoutBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      minHeight: '40px',
    },
    main: {
      flex: 1,
      padding: '40px 20px',
    },
    section: {
      maxWidth: '600px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 24px 0',
    },
    emptyState: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '40px 20px',
      textAlign: 'center',
      borderStyle: 'dashed',
      borderWidth: '2px',
      borderColor: '#e5e7eb',
      marginBottom: '24px',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: '16px',
      color: '#6b7280',
      margin: '0 0 24px 0',
      lineHeight: '1.6',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '14px 32px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '44px',
      minWidth: '100%',
    },
    userCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
    },
    cardLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px',
    },
    cardValue: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0',
    },
    footer: {
      backgroundColor: '#111827',
      color: '#9ca3af',
      padding: '24px 20px',
      textAlign: 'center',
      fontSize: '14px',
    },
    footerText: {
      margin: '0',
    },
  }

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Welcome back</h1>
          <p style={styles.headerSubtitle}>{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <section style={styles.section}>
          {/* User Info Card */}
          <div style={styles.userCard}>
            <div style={styles.cardLabel}>Your Account</div>
            <p style={styles.cardValue}>{user.email}</p>
          </div>

          {/* Presentations Section */}
          <h2 style={styles.sectionTitle}>Your Presentations</h2>

          {/* Empty State */}
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎥</div>
            <p style={styles.emptyText}>
              No presentations yet. Record your first one to get started!
            </p>
            <button
              onClick={handleRecordPresentation}
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Record Your First Presentation
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          &copy; 2026 Presentation Coach. All rights reserved.
        </p>
      </footer>
    </div>
  )
}