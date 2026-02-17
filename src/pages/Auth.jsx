import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
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
    
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false)
      // After Supabase keys arrive, we'll add real auth here
      // For now, just navigate to dashboard
      navigate('/dashboard')
    }, 500)
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
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      outline: 'none',
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
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    buttonPrimaryHover: {
      backgroundColor: '#2563eb',
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
      color: '#3b82f6',
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
        {/* Header */}
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

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password (Sign Up Only) */}
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

          {/* Submit Button */}
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

        {/* Toggle Between Sign Up and Login */}
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