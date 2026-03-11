import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [scripts, setScripts] = useState([])
  const [recordings, setRecordings] = useState([])

  const styles = {
    dashboard: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '40px 20px',
    },
    header: {
      maxWidth: '1200px',
      margin: '0 auto 40px',
      paddingBottom: '24px',
      borderBottom: '2px solid #f0f0f0',
    },
    greeting: {
      fontSize: '14px',
      color: '#FF9500',
      fontWeight: '600',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
    },
    userInfo: {
      fontSize: '14px',
      color: '#9ca3af',
    },
    statsRow: {
      maxWidth: '1200px',
      margin: '0 auto 32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #f0f0f0',
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#FF9500',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '13px',
      color: '#6b7280',
      fontWeight: '500',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid #f0f0f0',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '24px',
    },
    sectionIcon: {
      fontSize: '28px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '12px',
      display: 'block',
    },
    emptyTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: '4px',
    },
    emptyText: {
      fontSize: '13px',
      color: '#9ca3af',
      marginBottom: '0',
    },
    button: {
      backgroundColor: '#FF9500',
      color: 'white',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      width: '100%',
      marginTop: '24px',
      transition: 'all 0.2s ease',
    },
    quickActions: {
      maxWidth: '1200px',
      margin: '32px auto 0',
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid #f0f0f0',
    },
    quickActionsTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '16px',
    },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
    },
    quickAction: {
      padding: '16px',
      borderRadius: '12px',
      border: '2px solid #f0f0f0',
      backgroundColor: 'white',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    quickActionIcon: {
      fontSize: '24px',
    },
    quickActionText: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
    },
  }

  const getUserName = () => {
    if (!user?.email) return 'Coach'
    return user.email.split('@')[0]
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <p style={styles.greeting}>Welcome back</p>
        <h1 style={styles.title}>Hey, {getUserName()} 👋</h1>
        {user && (
          <p style={styles.userInfo}>{user.email}</p>
        )}
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{scripts.length}</div>
          <div style={styles.statLabel}>Scripts Created</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{recordings.length}</div>
          <div style={styles.statLabel}>Videos Recorded</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>0</div>
          <div style={styles.statLabel}>Videos Published</div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>📝</span>
            <h2 style={styles.sectionTitle}>My Scripts</h2>
          </div>
          {scripts.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>💡</span>
              <p style={styles.emptyTitle}>No scripts yet</p>
              <p style={styles.emptyText}>Generate your first AI-powered script to get started</p>
            </div>
          ) : (
            <div>
              {/* Scripts list will go here when database is connected */}
            </div>
          )}
          <button 
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#FF7A00'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#FF9500'
              e.target.style.transform = 'translateY(0)'
            }}
            onClick={() => navigate('/script-generator')}
          >
            ✨ Create New Script
          </button>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🎥</span>
            <h2 style={styles.sectionTitle}>My Recordings</h2>
          </div>
          {recordings.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🎬</span>
              <p style={styles.emptyTitle}>No recordings yet</p>
              <p style={styles.emptyText}>Record your first presentation video</p>
            </div>
          ) : (
            <div>
              {/* Recordings list will go here when database is connected */}
            </div>
          )}
          <button 
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#FF7A00'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#FF9500'
              e.target.style.transform = 'translateY(0)'
            }}
            onClick={() => navigate('/record')}
          >
            🎤 Record Video
          </button>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
        <div style={styles.quickActionsGrid}>
          <div 
            style={styles.quickAction}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#FF9500'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#f0f0f0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => navigate('/script-generator')}
          >
            <span style={styles.quickActionIcon}>📝</span>
            <span style={styles.quickActionText}>New Script</span>
          </div>
          <div 
            style={styles.quickAction}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#FF9500'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#f0f0f0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => navigate('/record')}
          >
            <span style={styles.quickActionIcon}>🎥</span>
            <span style={styles.quickActionText}>Record Video</span>
          </div>
          <div 
            style={styles.quickAction}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#FF9500'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#f0f0f0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => navigate('/record')}
          >
            <span style={styles.quickActionIcon}>📤</span>
            <span style={styles.quickActionText}>Share Video</span>
          </div>
        </div>
      </div>
    </div>
  )
}