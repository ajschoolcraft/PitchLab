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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
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
      
        console.log('User created:', authData.user?.id)
      
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
      console.error('Auth error:', error)
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
      console.error('Google sign-in error:', error)
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    formWrapper: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '40px 24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
    },
    input: {
      padding: '12px 16px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontFamily: 'inherit',
      minHeight: '44px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '8px',
    },
    button: {
      padding: '12px 16px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      minHeight: '44px',
      transition: 'all 0.3s ease',
      marginTop: '8px',
    },
    buttonPrimary: {
      backgroundColor: '#FF9500',
      color: 'white',
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '16px 0',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#e5e7eb',
    },
    dividerText: {
      fontSize: '14px',
      color: '#6b7280',
    },
    toggleContainer: {
      textAlign: 'center',
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
    },
    toggleText: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '0',
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: '#FF9500',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      padding: '0',
      marginLeft: '4px',
      textDecoration: 'underline',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={styles.subtitle}>
            {isSignUp 
              ? 'Start improving your presentations today' 
              : 'Sign in to your account'}
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {isSignUp && (
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              ...(loading && styles.buttonDisabled),
            }}
          >
            {loading 
              ? 'Loading...' 
              : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            ...styles.button,
            backgroundColor: 'white',
            color: '#1f2937',
            border: '1px solid #d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
              
        <div style={styles.toggleContainer}>
          <p style={styles.toggleText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
              style={styles.toggleButton}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}