/**
 * @fileoverview Route guard component.
 * Wraps routes that require authentication. Redirects unauthenticated
 * users to the /auth page and displays a loading state while the
 * session is being verified.
 */

import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}