import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import Onboarding from '../components/Onboarding'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [scripts, setScripts] = useState([])
  const [recordings, setRecordings] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)

  console.log('🔵 Dashboard loaded')  // ← ADD THIS
  console.log('🔵 User:', user)  // ← ADD THIS

  useEffect(() => {
    const done = localStorage.getItem('pc_onboarding_complete')
    if (!done) {
      setShowOnboarding(true)
    }
  }, [])
      // Fetch user's scripts and recordings
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      console.log('Current user ID:', user.id)  // ← ADD THIS
      console.log('Fetching scripts...')  // ← ADD THIS

      try {
        // Fetch scripts
        const { data: scriptsData, error: scriptsError } = await supabase
          .from('scripts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (scriptsError) throw scriptsError
        
        console.log('Scripts fetched:', scriptsData)  // ← ADD THIS
        console.log('Number of scripts:', scriptsData?.length)  // ← ADD THIS
        
        setScripts(scriptsData || [])

        // Fetch recordings (videos)
        const { data: recordingsData, error: recordingsError } = await supabase
          .from('user_vids')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (recordingsError) throw recordingsError
        
        console.log('Recordings fetched:', recordingsData)  // ← ADD THIS
        
        setRecordings(recordingsData || [])

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [user])

  const getUserName = () => {
    if (!user?.email) return 'there'
    const name = user.email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .pc-dash {
          min-height: 100vh;
          background: #FAFAFA;
          font-family: 'DM Sans', -apple-system, sans-serif;
          padding: 40px 24px 80px;
        }
        .pc-dash-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .pc-dash-header {
          margin-bottom: 36px;
        }
        .pc-dash-greeting {
          font-size: 15px;
          color: #FF9500;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .pc-dash-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .pc-dash-subtitle {
          font-size: 15px;
          color: #9ca3af;
        }

        .pc-dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .pc-dash-stat {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #f0f0f0;
          text-align: center;
          transition: all 0.2s ease;
        }
        .pc-dash-stat:hover {
          border-color: #FFE0B2;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }
        .pc-dash-stat-num {
          font-size: 36px;
          font-weight: 700;
          color: #FF9500;
          line-height: 1;
          margin-bottom: 8px;
        }
        .pc-dash-stat-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .pc-dash-action-card {
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          position: relative;
          overflow: hidden;
        }
        .pc-dash-action-card::after {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }
        .pc-dash-action-text h2 {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }
        .pc-dash-action-text p {
          font-size: 15px;
          color: rgba(255,255,255,0.85);
          margin: 0;
          line-height: 1.5;
        }
        .pc-dash-action-btn {
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 700;
          color: #FF9500;
          background: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          white-space: nowrap;
          position: relative;
          z-index: 1;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .pc-dash-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.15);
        }

        .pc-dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .pc-dash-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }
        .pc-dash-card:hover {
          border-color: #FFE0B2;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }
        .pc-dash-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .pc-dash-card-icon {
          width: 44px;
          height: 44px;
          background: #FFF8F0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
        .pc-dash-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .pc-dash-empty {
          text-align: center;
          padding: 32px 16px;
        }
        .pc-dash-empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
          display: block;
          opacity: 0.6;
        }
        .pc-dash-empty-title {
          font-size: 15px;
          font-weight: 600;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .pc-dash-empty-text {
          font-size: 13px;
          color: #c4c9d1;
        }

        .pc-dash-card-btn {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          color: #FF9500;
          background: #FFF8F0;
          border: 1.5px solid #FFE0B2;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          margin-top: 20px;
        }
        .pc-dash-card-btn:hover {
          background: #FF9500;
          color: white;
          border-color: #FF9500;
        }

        .pc-dash-quick {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #f0f0f0;
        }
        .pc-dash-quick-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }
        .pc-dash-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .pc-dash-quick-item {
          padding: 20px 12px;
          border-radius: 14px;
          border: 1.5px solid #f0f0f0;
          background: white;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .pc-dash-quick-item:hover {
          border-color: #FF9500;
          background: #FFF8F0;
          transform: translateY(-2px);
        }
        .pc-dash-quick-icon {
          font-size: 24px;
          display: block;
          margin-bottom: 8px;
        }
        .pc-dash-quick-label {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
        }

        @media (max-width: 768px) {
          .pc-dash { padding: 24px 16px 60px; }
          .pc-dash-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .pc-dash-stat { padding: 16px 12px; }
          .pc-dash-stat-num { font-size: 28px; }
          .pc-dash-action-card { 
            flex-direction: column; 
            padding: 28px; 
            text-align: center; 
          }
          .pc-dash-action-btn { width: 100%; }
          .pc-dash-grid { grid-template-columns: 1fr; }
          .pc-dash-quick-grid { grid-template-columns: repeat(2, 1fr); }
          .pc-dash-title { font-size: 26px; }
        }
      `}</style>

      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="pc-dash">
        <div className="pc-dash-inner">
          <div className="pc-dash-header">
            <p className="pc-dash-greeting">{getTimeGreeting()}</p>
            <h1 className="pc-dash-title">Welcome back, {getUserName()} 👋</h1>
            <p className="pc-dash-subtitle">Here's your coaching overview</p>
          </div>

          <div className="pc-dash-stats">
            <div className="pc-dash-stat">
              <div className="pc-dash-stat-num">{scripts.length}</div>
              <div className="pc-dash-stat-label">Scripts Created</div>
            </div>
            <div className="pc-dash-stat">
              <div className="pc-dash-stat-num">{recordings.length}</div>
              <div className="pc-dash-stat-label">Videos Recorded</div>
            </div>
            <div className="pc-dash-stat">
              <div className="pc-dash-stat-num">0</div>
              <div className="pc-dash-stat-label">Videos Shared</div>
            </div>
          </div>

          <div className="pc-dash-action-card">
            <div className="pc-dash-action-text">
              <h2>Ready to create your next presentation?</h2>
              <p>Our AI will help you write a clear, structured script in seconds.</p>
            </div>
            <button className="pc-dash-action-btn" onClick={() => navigate('/script-generator')}>
              ✨ Create Script
            </button>
          </div>

          <div className="pc-dash-grid">
            <div className="pc-dash-card">
              <div className="pc-dash-card-header">
                <div className="pc-dash-card-icon">📝</div>
                <span className="pc-dash-card-title">My Scripts</span>
              </div>
              {scripts.length === 0 ? (
                <div className="pc-dash-empty">
                  <span className="pc-dash-empty-icon">💡</span>
                  <p className="pc-dash-empty-title">No scripts yet</p>
                  <p className="pc-dash-empty-text">Create your first AI-powered script</p>
                </div>
              ) : (
                <div></div>
              )}
              <button className="pc-dash-card-btn" onClick={() => navigate('/script-generator')}>
                ✍️ New Script
              </button>
            </div>

            <div className="pc-dash-card">
              <div className="pc-dash-card-header">
                <div className="pc-dash-card-icon">🎥</div>
                <span className="pc-dash-card-title">My Recordings</span>
              </div>
              {recordings.length === 0 ? (
                <div className="pc-dash-empty">
                  <span className="pc-dash-empty-icon">🎬</span>
                  <p className="pc-dash-empty-title">No recordings yet</p>
                  <p className="pc-dash-empty-text">Record your first presentation</p>
                </div>
              ) : (
                <div></div>
              )}
              <button className="pc-dash-card-btn" onClick={() => navigate('/record')}>
                🎤 Start Recording
              </button>
            </div>
          </div>

          <div className="pc-dash-quick">
            <h3 className="pc-dash-quick-title">Quick Actions</h3>
            <div className="pc-dash-quick-grid">
              <button className="pc-dash-quick-item" onClick={() => navigate('/script-generator')}>
                <span className="pc-dash-quick-icon">✨</span>
                <span className="pc-dash-quick-label">AI Script</span>
              </button>
              <button className="pc-dash-quick-item" onClick={() => navigate('/record')}>
                <span className="pc-dash-quick-icon">🎥</span>
                <span className="pc-dash-quick-label">Record</span>
              </button>
              <button className="pc-dash-quick-item" onClick={() => navigate('/record')}>
                <span className="pc-dash-quick-icon">📖</span>
                <span className="pc-dash-quick-label">Teleprompter</span>
              </button>
              <button className="pc-dash-quick-item" onClick={() => navigate('/record')}>
                <span className="pc-dash-quick-icon">📤</span>
                <span className="pc-dash-quick-label">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}