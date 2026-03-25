import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [scriptsCount, setScriptsCount] = useState(0)
  const [recordingsCount, setRecordingsCount] = useState(0)

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || ''
      setDisplayName(name)
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    if (!user) return
    try {
      const { count: sCount } = await supabase
        .from('scripts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setScriptsCount(sCount || 0)

      const { count: rCount } = await supabase
        .from('user_vids')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setRecordingsCount(rCount || 0)
    } catch (err) {
      console.log('Stats fetch error:', err)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName, bio: bio }
      })
      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Save error:', err)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getInitials = () => {
    if (displayName) {
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (user?.email) return user.email[0].toUpperCase()
    return '?'
  }

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .pc-profile {
          min-height: 100vh;
          background: #FAFAFA;
          font-family: 'DM Sans', -apple-system, sans-serif;
          padding: 40px 24px 80px;
        }
        .pc-profile-inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .pc-profile-header {
          margin-bottom: 36px;
        }
        .pc-profile-label {
          font-size: 14px;
          font-weight: 700;
          color: #FF9500;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .pc-profile-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        /* Avatar Card */
        .pc-profile-avatar-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #f0f0f0;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .pc-profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .pc-profile-avatar-info h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .pc-profile-avatar-info p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        .pc-profile-avatar-info .pc-profile-member {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 4px;
        }

        /* Stats Row */
        .pc-profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .pc-profile-stat {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #f0f0f0;
          text-align: center;
        }
        .pc-profile-stat-num {
          font-size: 32px;
          font-weight: 700;
          color: #FF9500;
          line-height: 1;
          margin-bottom: 6px;
        }
        .pc-profile-stat-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Edit Card */
        .pc-profile-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #f0f0f0;
          margin-bottom: 24px;
        }
        .pc-profile-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pc-profile-field {
          margin-bottom: 20px;
        }
        .pc-profile-field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .pc-profile-field input,
        .pc-profile-field textarea {
          width: 100%;
          padding: 14px 16px;
          font-size: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
          background: #FAFAFA;
          color: #1a1a1a;
        }
        .pc-profile-field input:focus,
        .pc-profile-field textarea:focus {
          outline: none;
          border-color: #FF9500;
          background: white;
          box-shadow: 0 0 0 4px rgba(255, 149, 0, 0.1);
        }
        .pc-profile-field textarea {
          resize: vertical;
          min-height: 80px;
        }
        .pc-profile-field .pc-profile-email-display {
          padding: 14px 16px;
          font-size: 16px;
          background: #f0f0f0;
          border-radius: 12px;
          color: #6b7280;
          border: 2px solid #e5e7eb;
        }
        .pc-profile-field .pc-profile-hint {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 6px;
        }

        /* Save Button */
        .pc-profile-save {
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(255, 149, 0, 0.3);
          width: 100%;
        }
        .pc-profile-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 149, 0, 0.4);
        }
        .pc-profile-save:disabled {
          background: #d1d5db;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .pc-profile-save.saved {
          background: #22c55e;
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
        }

        /* Danger Zone */
        .pc-profile-danger {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #fecaca;
        }
        .pc-profile-danger-title {
          font-size: 16px;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 8px;
        }
        .pc-profile-danger-text {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .pc-profile-danger-btn {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #dc2626;
          background: #FEF2F2;
          border: 1.5px solid #fecaca;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .pc-profile-danger-btn:hover {
          background: #dc2626;
          color: white;
          border-color: #dc2626;
        }

        /* Back Link */
        .pc-profile-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          margin-bottom: 24px;
          padding: 0;
          transition: color 0.2s;
        }
        .pc-profile-back:hover {
          color: #FF9500;
        }

        @media (max-width: 768px) {
          .pc-profile { padding: 24px 16px 60px; }
          .pc-profile-title { font-size: 26px; }
          .pc-profile-avatar-card { flex-direction: column; text-align: center; }
          .pc-profile-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .pc-profile-stat { padding: 16px 12px; }
          .pc-profile-stat-num { font-size: 24px; }
          .pc-profile-card { padding: 24px 20px; }
        }
      `}</style>

      <div className="pc-profile">
        <div className="pc-profile-inner">
          <button className="pc-profile-back" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>

          <div className="pc-profile-header">
            <p className="pc-profile-label">Your Profile</p>
            <h1 className="pc-profile-title">Account Settings</h1>
          </div>

          {/* Avatar Card */}
          <div className="pc-profile-avatar-card">
            <div className="pc-profile-avatar">
              {getInitials()}
            </div>
            <div className="pc-profile-avatar-info">
              <h2>{displayName || 'Set your name'}</h2>
              <p>{user?.email}</p>
              <p className="pc-profile-member">Member since {memberSince}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="pc-profile-stats">
            <div className="pc-profile-stat">
              <div className="pc-profile-stat-num">{scriptsCount}</div>
              <div className="pc-profile-stat-label">Scripts</div>
            </div>
            <div className="pc-profile-stat">
              <div className="pc-profile-stat-num">{recordingsCount}</div>
              <div className="pc-profile-stat-label">Recordings</div>
            </div>
            <div className="pc-profile-stat">
              <div className="pc-profile-stat-num">0</div>
              <div className="pc-profile-stat-label">Shared</div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="pc-profile-card">
            <h3 className="pc-profile-card-title">✏️ Edit Profile</h3>
            
            <div className="pc-profile-field">
              <label>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="pc-profile-field">
              <label>Email</label>
              <div className="pc-profile-email-display">{user?.email}</div>
              <p className="pc-profile-hint">Email cannot be changed</p>
            </div>

            <div className="pc-profile-field">
              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself or your business..."
                rows={3}
              />
            </div>

            <button 
              className={`pc-profile-save ${saved ? 'saved' : ''}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Account Actions */}
          <div className="pc-profile-danger">
            <h3 className="pc-profile-danger-title">Account</h3>
            <p className="pc-profile-danger-text">
              Sign out of your account on this device.
            </p>
            <button className="pc-profile-danger-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}