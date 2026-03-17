import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .pc-auth {
          min-height: 100vh;
          background: #FAFAFA;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .pc-auth-wrapper {
          width: 100%;
          max-width: 420px;
        }
        .pc-auth-logo {
          text-align: center;
          margin-bottom: 32px;
        }
        .pc-auth-logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 12px;
        }
        .pc-auth-logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.3px;
        }
        .pc-auth-card {
          background: white;
          border-radius: 20px;
          padding: 40px 32px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .pc-auth-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          text-align: center;
          margin-bottom: 4px;
        }
        .pc-auth-subtitle {
          font-size: 15px;
          color: #6b7280;
          text-align: center;
          margin-bottom: 28px;
        }
        .pc-auth-error {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 20px;
          text-align: center;
        }
        .pc-auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .pc-auth-field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .pc-auth-field input {
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
        .pc-auth-field input:focus {
          outline: none;
          border-color: #FF9500;
          background: white;
          box-shadow: 0 0 0 4px rgba(255, 149, 0, 0.1);
        }
        .pc-auth-field input::placeholder {
          color: #c4c9d1;
        }
        .pc-auth-submit {
          width: 100%;
          padding: 14px;
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
          margin-top: 4px;
        }
        .pc-auth-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 149, 0, 0.4);
        }
        .pc-auth-submit:disabled {
          background: #d1d5db;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .pc-auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }
        .pc-auth-divider-line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }
        .pc-auth-divider-text {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
        }
        .pc-auth-google {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .pc-auth-google:hover {
          border-color: #d1d5db;
          background: #FAFAFA;
        }
        .pc-auth-toggle {
          text-align: center;
          margin-top: 28px;
          font-size: 14px;
          color: #6b7280;
        }
        .pc-auth-toggle button {
          background: none;
          border: none;
          color: #FF9500;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          font-family: inherit;
          margin-left: 4px;
        }
        .pc-auth-toggle button:hover {
          text-decoration: underline;
        }
        .pc-auth-back {
          text-align: center;
          margin-top: 20px;
        }
        .pc-auth-back button {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
        }
        .pc-auth-back button:hover {
          color: #FF9500;
        }
      `}</style>

      <div className="pc-auth">
        <div className="pc-auth-wrapper">
          <div className="pc-auth-logo">
            <div className="pc-auth-logo-icon">🎤</div>
            <div className="pc-auth-logo-text">PresentationCoach</div>
          </div>

          <div className="pc-auth-card">
            <h1 className="pc-auth-title">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="pc-auth-subtitle">
              {isSignUp 
                ? 'Start telling your story with confidence' 
                : 'Sign in to continue coaching'}
            </p>

            {error && <div className="pc-auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="pc-auth-form">
              <div className="pc-auth-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pc-auth-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {isSignUp && (
                <div className="pc-auth-field">
                  <label>Confirm Password</label>
                  <input
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
                className="pc-auth-submit"
              >
                {loading 
                  ? 'Loading...' 
                  : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="pc-auth-divider">
              <div className="pc-auth-divider-line"></div>
              <span className="pc-auth-divider-text">or</span>
              <div className="pc-auth-divider-line"></div>
            </div>

            <button onClick={handleGoogleSignIn} className="pc-auth-google">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <div className="pc-auth-toggle">
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

          <div className="pc-auth-back">
            <button onClick={() => navigate('/')}>
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}