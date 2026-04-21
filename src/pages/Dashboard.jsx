/**
 * @fileoverview Main dashboard / home screen.
 * Displays a personalized greeting, script and recording stats, a CTA card,
 * lists of recent scripts and recordings with inline actions (use, delete,
 * mark as final), and a quick-action grid for common tasks.
 * Triggers the onboarding flow on the user's first visit.
 */

import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import Onboarding from '../components/Onboarding'
import { supabase } from '../lib/supabase'
import '../styles/dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [scripts, setScripts] = useState([])
  const [recordings, setRecordings] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)

  console.log('🔵 Dashboard loaded')
  console.log('🔵 User:', user)

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

      console.log('Current user ID:', user.id)
      console.log('Fetching scripts...')

      try {
        // Fetch scripts
        const { data: scriptsData, error: scriptsError } = await supabase
          .from('scripts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (scriptsError) throw scriptsError

        console.log('Scripts fetched:', scriptsData)
        console.log('Number of scripts:', scriptsData?.length)

        setScripts(scriptsData || [])

        // Fetch recordings (videos)
        const { data: recordingsData, error: recordingsError } = await supabase
          .from('user_vids')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (recordingsError) throw recordingsError

        console.log('Recordings fetched:', recordingsData)

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
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="dash">
        <div className="dash-inner">
          <div className="dash-header">
            <p className="dash-greeting">{getTimeGreeting()}</p>
            <h1 className="dash-title">Welcome back, {getUserName()} 👋</h1>
            <p className="dash-subtitle">Here's your coaching overview</p>
          </div>

          <div className="dash-stats">
            <div className="stat-card">
              <div className="stat-number">{scripts.length}</div>
              <div className="stat-label">Scripts Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{recordings.length}</div>
              <div className="stat-label">Videos Recorded</div>
            </div>
          </div>

          <div className="dash-action-card">
            <div className="dash-action-text">
              <h2>Ready to create your next presentation?</h2>
              <p>Our AI will help you write a clear, structured script in seconds.</p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/script-generator')}>
              ✨ Create Script
            </button>
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📝</div>
                <span className="card-title">My Scripts</span>
              </div>
              {scripts.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-state-icon">✍️</span>
                  <p className="empty-state-title">Write your first script</p>
                  <p className="empty-state-text">Our AI helps you turn ideas into clear, structured presentations</p>
                  <button className="btn-primary btn-sm" onClick={() => navigate('/script-generator')}>
                    ✨ Create Script
                  </button>
                </div>
              ) : (
                <div className="dash-item-list">
                  {scripts.map(script => (
                    <div key={script.id} className="dash-item">
                      <div className="dash-item-info">
                      <div className="dash-item-title">
                        Script #{scripts.length - scripts.indexOf(script)}
                      </div>
                        <div className="dash-item-date">
                          {new Date(script.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="dash-item-actions">
                        <button
                          className="dash-item-btn"
                          onClick={() => navigate('/record', { state: { script } })}
                        >
                          Use →
                        </button>
                        <button
                          className="dash-item-btn dash-item-btn-delete"
                          onClick={async () => {
                            if (!window.confirm('Delete this script?')) return;

                            const { error } = await supabase
                              .from('scripts')
                              .delete()
                              .eq('id', script.id);

                            if (error) {
                              alert('Error deleting script');
                              return;
                            }

                            setScripts(scripts.filter(s => s.id !== script.id));
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="dash-card-btn" onClick={() => navigate('/script-generator')}>
                ✍️ New Script
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">🎥</div>
                <span className="card-title">My Recordings</span>
              </div>
              {recordings.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-state-icon">🎤</span>
                  <p className="empty-state-title">Record your first take</p>
                  <p className="empty-state-text">Practice makes perfect — record, review, and improve your delivery</p>
                  <button className="btn-secondary btn-sm" onClick={() => navigate('/record')}>
                    🎥 Start Recording
                  </button>
                </div>
              ) : (
                <div className="dash-item-list">
                  {recordings.map((recording, index) => (
                    <div key={recording.id} className="dash-item">
                      <div className="dash-recording-info">
                        {recording.thumbnail_url ? (
                          <img
                            src={recording.thumbnail_url}
                            alt="Thumbnail"
                            className="dash-recording-thumb"
                          />
                        ) : (
                          <div className="dash-recording-thumb-placeholder">🎥</div>
                        )}
                        <div>
                        <div className="dash-item-title">
                          {recording.status === 'final' && <span title="Final">⭐ </span>}
                          Recording #{recordings.length - index}
                        </div>
                        <div className="dash-item-date">
                          {new Date(recording.created_at).toLocaleDateString()} • {recording.duration_secs}s
                        </div>
                        </div>
                      </div>
                      <div className="dash-recording-actions">
                        <button
                          className="dash-item-btn"
                          onClick={() => navigate('/recordings', { state: { recordingId: recording.id } })}
                        >
                          View
                        </button>
                        <button
                          className={`dash-item-btn ${recording.status === 'final' ? 'dash-item-btn-active' : ''}`}
                          onClick={async () => {
                            const newStatus = recording.status === 'final' ? 'draft' : 'final';
                            const { error } = await supabase
                              .from('user_vids')
                              .update({ status: newStatus })
                              .eq('id', recording.id);

                            if (error) {
                              alert('Error updating status');
                              return;
                            }

                            setRecordings(recordings.map(r =>
                              r.id === recording.id ? { ...r, status: newStatus } : r
                            ));
                          }}
                        >
                          {recording.status === 'final' ? 'Unmark' : 'Mark Final'}
                        </button>
                        <button
                          className="dash-item-btn dash-item-btn-delete"
                          onClick={async () => {
                            if (!window.confirm('Delete this recording?')) return;

                            try {
                              // Delete from storage
                              const { error: storageError } = await supabase.storage
                                .from('videos')
                                .remove([recording.storage_path]);

                              if (storageError) {
                                console.error('Storage delete error:', storageError);
                              }

                              // Delete from database
                              const { error: dbError } = await supabase
                                .from('user_vids')
                                .delete()
                                .eq('id', recording.id);

                              if (dbError) {
                                alert('Error deleting recording');
                                return;
                              }

                              // Update UI
                              setRecordings(recordings.filter(r => r.id !== recording.id));

                            } catch (err) {
                              console.error('Delete error:', err);
                              alert('Failed to delete recording');
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="dash-card-btn" onClick={() => navigate('/record')}>
                🎤 Start Recording
              </button>
            </div>
          </div>

          <div className="dash-quick">
            <h3 className="dash-quick-title">Quick Actions</h3>
            <div className="dash-quick-grid">
              <button className="dash-quick-item" onClick={() => navigate('/script-generator')}>
                <span className="dash-quick-icon">✨</span>
                <span className="dash-quick-label">AI Script</span>
              </button>
              <button className="dash-quick-item" onClick={() => navigate('/record')}>
                <span className="dash-quick-icon">🎥</span>
                <span className="dash-quick-label">Record</span>
              </button>
              <button className="dash-quick-item" onClick={() => navigate('/recordings')}>
                <span className="dash-quick-icon">🎬</span>
                <span className="dash-quick-label">My Videos</span>
              </button>
              <button className="dash-quick-item" onClick={() => navigate('/share')}>
                <span className="dash-quick-icon">📤</span>
                <span className="dash-quick-label">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
