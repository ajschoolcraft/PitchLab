import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/auth.css'

export default function Auth() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })
        if (authError) throw authError
        alert('Account created! You can now sign in.')
        setIsSignUp(false)
        setFormData({ email: formData.email, password: '', confirmPassword: '' })
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (loginError) throw loginError
        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      })
      if (error) throw error
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="auth">
      <div className="auth-wrapper">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎤</div>
          <div className="auth-logo-text">PresentationCoach</div>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="auth-subtitle">
            {isSignUp
              ? 'Start telling your story with confidence'
              : 'Sign in to continue coaching'}
          </p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {isSignUp && (
              <div className="form-field">
                <label className="form-label">Confirm Password</label>
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Type your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary auth-submit"
            >
              {loading
                ? 'Loading...'
                : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">or</span>
            <div className="divider-line"></div>
          </div>

          <button onClick={handleGoogleSignIn} className="auth-google">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-toggle">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setFormData({ email: '', password: '', confirmPassword: '' })
            }}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

        <div className="auth-back">
          <button onClick={() => navigate('/')}>
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
