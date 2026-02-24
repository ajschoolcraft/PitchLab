import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [scripts, setScripts] = useState([])
  const [recordings, setRecordings] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  const styles = {
    dashboard: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '40px 20px',
    },
    header: {
      maxWidth: '1200px',
      margin: '0 auto 40px',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
    },
    userInfo: {
      fontSize: '14px',
      color: '#6b7280',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '24px',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      width: '100%',
      marginTop: '16px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#9ca3af',
    },
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome Back</h1>
        {user && (
          <p style={styles.userInfo}>Logged in as: {user.email}</p>
        )}
      </div>

      <div style={styles.container}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📝 Scripts</h2>
          <div style={styles.emptyState}>
            <p>No scripts yet</p>
            <p style={{ fontSize: '12px' }}>Create your first script to get started</p>
          </div>
          <button 
            style={styles.button}
            onClick={() => navigate('/script-generator')}
          >
            Create Script
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎥 Recordings</h2>
          <div style={styles.emptyState}>
            <p>No recordings yet</p>
            <p style={{ fontSize: '12px' }}>Record your first video to get started</p>
          </div>
          <button 
            style={styles.button}
            onClick={() => navigate('/record')}
          >
            Record Video
          </button>
        </div>
      </div>
    </div>
  )
}