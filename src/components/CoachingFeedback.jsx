import { useState, useEffect } from 'react'

export default function CoachingFeedback({ take, script }) {
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requested, setRequested] = useState(false)

  useEffect(() => {
    if (take?.saveStatus === 'saved' && !requested && !feedback) {
      setRequested(true)
      getFeedback()
    }
  }, [take?.saveStatus])

  const getFeedback = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/coaching-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: script || '',
          duration: take?.duration || 0,
          takeNumber: take?.takeNumber || 1,
        })
      })
      if (!response.ok) throw new Error('Failed to get feedback')
      const data = await response.json()
      setFeedback(data.feedback)
    } catch (err) {
      console.error('Feedback error:', err)
      setError('Could not generate feedback right now.')
    } finally {
      setLoading(false)
    }
  }

  if (!take || take.saveStatus === 'pending') return null
  if (take.saveStatus === 'failed') return null

  return (
    <>
      <style>{`
        .cf-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #f0f0f0; margin-top: 20px; font-family: 'DM Sans', -apple-system, sans-serif; }
        .cf-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .cf-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #FF9500, #FF6B00); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .cf-title { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0; }
        .cf-subtitle { font-size: 13px; color: #9ca3af; margin: 0; }
        .cf-loading { display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 14px; padding: 8px 0; }
        .cf-spinner { width: 18px; height: 18px; border: 2px solid #f0f0f0; border-top: 2px solid #FF9500; border-radius: 50%; animation: cf-spin 0.8s linear infinite; flex-shrink: 0; }
        @keyframes cf-spin { to { transform: rotate(360deg); } }
        .cf-items { display: flex; flex-direction: column; gap: 12px; }
        .cf-item { display: flex; gap: 12px; align-items: flex-start; padding: 14px; border-radius: 12px; background: #FAFAFA; }
        .cf-item-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .cf-item-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .cf-item-label.green { color: #16a34a; }
        .cf-item-label.orange { color: #FF9500; }
        .cf-item-label.blue { color: #3b82f6; }
        .cf-item-text { font-size: 14px; color: #374151; line-height: 1.5; margin: 0; }
        .cf-retry { background: none; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 16px; font-size: 13px; color: #6b7280; cursor: pointer; font-family: inherit; margin-top: 8px; }
        .cf-error { font-size: 13px; color: #9ca3af; padding: 4px 0; }
      `}</style>
      <div className="cf-card">
        <div className="cf-header">
          <div className="cf-icon">🎯</div>
          <div>
            <p className="cf-title">AI Coaching Feedback</p>
            <p className="cf-subtitle">Powered by Claude</p>
          </div>
        </div>
        {loading && <div className="cf-loading"><div className="cf-spinner" />Analyzing your performance...</div>}
        {error && <div><p className="cf-error">{error}</p><button className="cf-retry" onClick={getFeedback}>Try again</button></div>}
        {feedback && !loading && (
          <div className="cf-items">
            <div className="cf-item"><span className="cf-item-icon">✅</span><div><p className="cf-item-label green">What Landed</p><p className="cf-item-text">{feedback.whatLanded}</p></div></div>
            <div className="cf-item"><span className="cf-item-icon">🎯</span><div><p className="cf-item-label ">What to Tighten</p><p className="cf-item-text">{feedback.whatToTighten}</p></div></div>
            <div className="cf-item"><span className="cf-item-icon">💡</span><div><p className="cf-item-label blue">One Specific Tip</p><p className="cf-item-text">{feedback.specificTip}</p></div></div>
          </div>
        )}
      </div>
    </>
  )
}
