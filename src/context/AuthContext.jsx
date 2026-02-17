import { createContext, useState, useEffect } from 'react'

// Create the context
export const AuthContext = createContext()

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkUser = () => {
      // Check localStorage for saved user
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setLoading(false)
    }

    checkUser()
  }, [])

  // Sign up function
  const signUp = (email, password) => {
    const newUser = { email, id: Date.now() }
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    setUser(newUser)
    return { user: newUser, error: null }
  }

  // Sign in function
  const signIn = (email, password) => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      if (user.email === email) {
        setUser(user)
        return { user, error: null }
      }
    }
    return { user: null, error: 'Invalid credentials' }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}