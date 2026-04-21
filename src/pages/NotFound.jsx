/**
 * @fileoverview 404 Not Found page.
 * Catches all unmatched routes and displays a friendly error message
 * with a link back to the home page.
 */

import { useNavigate } from 'react-router-dom'
import '../styles/not-found.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found">
      <div className="not-found-inner">
        <span className="not-found-icon">🎤</span>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-text">This page doesn't exist. Let's get you back on track.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Go Home →</button>
      </div>
    </div>
  )
}
