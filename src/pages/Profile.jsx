import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import '../styles/profile.css'

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
    <div className="profile">
      <div className="profile-inner">
        <button className="profile-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="profile-header">
          <p className="profile-label">Your Profile</p>
          <h1 className="profile-title">Account Settings</h1>
        </div>

        {/* Avatar Card */}
        <div className="profile-avatar-card">
          <div className="profile-avatar">
            {getInitials()}
          </div>
          <div className="profile-avatar-info">
            <h2>{displayName || 'Set your name'}</h2>
            <p>{user?.email}</p>
            <p className="profile-member">Member since {memberSince}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{scriptsCount}</div>
            <div className="stat-label">Scripts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{recordingsCount}</div>
            <div className="stat-label">Recordings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Shared</div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="profile-card">
          <h3 className="profile-card-title">✏️ Edit Profile</h3>

          <div className="form-field">
            <label className="form-label">Display Name</label>
            <input
              className="input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <div className="profile-email-display">{user?.email}</div>
            <p className="form-hint">Email cannot be changed</p>
          </div>

          <div className="form-field">
            <label className="form-label">Bio</label>
            <textarea
              className="textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself or your business..."
              rows={3}
            />
          </div>

          <button
            className={`btn-primary profile-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Account Actions */}
        <div className="profile-danger">
          <h3 className="profile-danger-title">Account</h3>
          <p className="profile-danger-text">
            Sign out of your account on this device.
          </p>
          <button className="btn-destructive" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
