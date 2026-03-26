import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .pc-404 {
          min-height: 100vh;
          background: #FAFAFA;
          font-family: 'DM Sans', -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }
        .pc-404-inner { max-width: 440px; }
        .pc-404-icon { font-size: 64px; margin-bottom: 24px; display: block; }
        .pc-404-code { font-size: 72px; font-weight: 700; color: #e5e7eb; letter-spacing: -2px; line-height: 1; margin-bottom: 16px; }
        .pc-404-title { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
        .pc-404-text { font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 32px; }
        .pc-404-btn {
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
        }
        .pc-404-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(255, 149, 0, 0.4); }
      `}</style>

      <div className="pc-404">
        <div className="pc-404-inner">
          <span className="pc-404-icon">🎤</span>
          <div className="pc-404-code">404</div>
          <h1 className="pc-404-title">Page not found</h1>
          <p className="pc-404-text">This page doesn't exist. Let's get you back on track.</p>
          <button className="pc-404-btn" onClick={() => navigate('/')}>Go Home →</button>
        </div>
      </div>
    </>
  )
}