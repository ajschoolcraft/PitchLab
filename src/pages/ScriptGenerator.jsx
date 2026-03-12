import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ScriptGenerator() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [duration, setDuration] = useState('2')
  const [tone, setTone] = useState('professional')
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerateScript = async () => {
    if (!topic.trim()) return

    setLoading(true)
    try {
      // TODO: Replace with real Claude API call via serverless function
      await new Promise(resolve => setTimeout(resolve, 1500))

      const generatedScript = `PRESENTATION SCRIPT: ${topic}
Target Audience: ${audience || 'General'}
Duration: ~${duration} minutes | Tone: ${tone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[OPENING — ${Math.round(duration * 10)}s]

"Hello, I'm [Your Name], and today I want to share something important with you about ${topic}."

(Pause. Make eye contact. Smile.)

[WHY IT MATTERS — ${Math.round(duration * 15)}s]

"Here's why this matters to ${audience || 'you'}..."

• Start with a surprising fact or personal story
• Connect it to your audience's daily life
• Make them feel why they should care

[MAIN POINT 1 — ${Math.round(duration * 15)}s]

"The first thing you need to know about ${topic} is..."

• Lead with your strongest argument
• Support it with one clear example
• Keep it simple — one idea per section

[MAIN POINT 2 — ${Math.round(duration * 15)}s]

"Building on that, let me show you..."

• Connect this to your first point
• Use a real-world example or case study
• Make it relatable to ${audience || 'your audience'}

[MAIN POINT 3 — ${Math.round(duration * 15)}s]

"And finally, the key takeaway is..."

• This should be your most memorable point
• Give them something actionable
• Something they can do TODAY

[CLOSING — ${Math.round(duration * 10)}s]

"So remember: ${topic} matters because it [key benefit]. Thank you for your time — I'd love to hear your thoughts."

(Smile. Pause. End with confidence.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Tips: Speak slowly. Pause between sections. 
Look at the camera, not the script.`.trim()

      setScript(generatedScript)
      setStep(4)
    } catch (error) {
      alert('Something went wrong. Please try again.')
      console.error(error)
    }
    setLoading(false)
  }

  const tones = [
    { value: 'professional', label: 'Professional', icon: '💼', desc: 'Clear and polished' },
    { value: 'casual', label: 'Casual', icon: '😊', desc: 'Friendly and relaxed' },
    { value: 'inspiring', label: 'Inspiring', icon: '🔥', desc: 'Motivational energy' },
    { value: 'educational', label: 'Educational', icon: '📚', desc: 'Teach and explain' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .pc-sg {
          min-height: 100vh;
          background: #FAFAFA;
          font-family: 'DM Sans', -apple-system, sans-serif;
          padding: 40px 24px 80px;
        }
        .pc-sg-inner {
          max-width: 720px;
          margin: 0 auto;
        }

        /* Header */
        .pc-sg-header {
          margin-bottom: 36px;
        }
        .pc-sg-label {
          font-size: 14px;
          font-weight: 700;
          color: #FF9500;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .pc-sg-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .pc-sg-subtitle {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.5;
        }

        /* Progress Bar */
        .pc-sg-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 36px;
        }
        .pc-sg-progress-step {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 100px;
          transition: all 0.3s ease;
          position: relative;
        }
        .pc-sg-progress-step.active {
          background: linear-gradient(135deg, #FF9500, #FF6B00);
        }
        .pc-sg-progress-step.done {
          background: #FF9500;
        }

        /* Card */
        .pc-sg-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          border: 1px solid #f0f0f0;
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pc-sg-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .pc-sg-card-hint {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        /* Inputs */
        .pc-sg-input {
          width: 100%;
          padding: 16px 20px;
          font-size: 17px;
          border: 2px solid #e5e7eb;
          border-radius: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
          color: #1a1a1a;
          background: #FAFAFA;
        }
        .pc-sg-input:focus {
          outline: none;
          border-color: #FF9500;
          background: white;
          box-shadow: 0 0 0 4px rgba(255, 149, 0, 0.1);
        }
        .pc-sg-input::placeholder {
          color: #c4c9d1;
        }

        /* Tone Selector */
        .pc-sg-tones {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .pc-sg-tone {
          padding: 18px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pc-sg-tone:hover {
          border-color: #FFE0B2;
          background: #FFF8F0;
        }
        .pc-sg-tone.selected {
          border-color: #FF9500;
          background: #FFF8F0;
          box-shadow: 0 0 0 4px rgba(255, 149, 0, 0.1);
        }
        .pc-sg-tone-icon {
          font-size: 24px;
        }
        .pc-sg-tone-text strong {
          font-size: 15px;
          color: #1a1a1a;
          display: block;
          margin-bottom: 2px;
        }
        .pc-sg-tone-text span {
          font-size: 13px;
          color: #9ca3af;
        }

        /* Duration */
        .pc-sg-duration-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pc-sg-duration-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          background: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-family: inherit;
          color: #1a1a1a;
        }
        .pc-sg-duration-btn:hover {
          border-color: #FF9500;
          background: #FFF8F0;
        }
        .pc-sg-duration-display {
          font-size: 36px;
          font-weight: 700;
          color: #FF9500;
          min-width: 60px;
          text-align: center;
        }
        .pc-sg-duration-unit {
          font-size: 15px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Buttons */
        .pc-sg-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .pc-sg-btn-primary {
          flex: 1;
          padding: 16px 24px;
          font-size: 17px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(255, 149, 0, 0.3);
        }
        .pc-sg-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 149, 0, 0.4);
        }
        .pc-sg-btn-primary:disabled {
          background: #d1d5db;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .pc-sg-btn-secondary {
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .pc-sg-btn-secondary:hover {
          border-color: #FF9500;
          color: #FF9500;
        }

        /* Script Output */
        .pc-sg-output {
          background: #1a1a1a;
          color: #e5e7eb;
          padding: 32px;
          border-radius: 16px;
          font-family: 'DM Sans', monospace;
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-wrap;
          word-wrap: break-word;
          max-height: 500px;
          overflow-y: auto;
        }
        .pc-sg-output-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .pc-sg-output-btn {
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          border: none;
        }
        .pc-sg-btn-record {
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          color: white;
          flex: 1;
          box-shadow: 0 4px 16px rgba(255, 149, 0, 0.3);
        }
        .pc-sg-btn-record:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 149, 0, 0.4);
        }
        .pc-sg-btn-copy {
          background: #f0f0f0;
          color: #1a1a1a;
        }
        .pc-sg-btn-copy:hover {
          background: #e5e7eb;
        }
        .pc-sg-btn-regen {
          background: white;
          color: #6b7280;
          border: 1.5px solid #e5e7eb;
        }
        .pc-sg-btn-regen:hover {
          border-color: #FF9500;
          color: #FF9500;
        }

        /* Loading */
        .pc-sg-loading {
          text-align: center;
          padding: 60px 20px;
        }
        .pc-sg-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f0f0f0;
          border-top: 4px solid #FF9500;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .pc-sg-loading-text {
          font-size: 17px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .pc-sg-loading-sub {
          font-size: 14px;
          color: #9ca3af;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .pc-sg { padding: 24px 16px 60px; }
          .pc-sg-card { padding: 28px 20px; }
          .pc-sg-title { font-size: 26px; }
          .pc-sg-tones { grid-template-columns: 1fr; }
          .pc-sg-output-actions { flex-direction: column; }
          .pc-sg-actions { flex-direction: column; }
        }
      `}</style>

      <div className="pc-sg">
        <div className="pc-sg-inner">
          {/* Header */}
          <div className="pc-sg-header">
            <p className="pc-sg-label">Script Generator</p>
            <h1 className="pc-sg-title">
              {step < 4 ? "Let's write your script" : 'Your Script Is Ready! 🎉'}
            </h1>
            <p className="pc-sg-subtitle">
              {step < 4 
                ? 'Answer a few quick questions and our AI will create a tailored script for you.' 
                : 'Review your script below. Edit it, copy it, or jump straight to recording.'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="pc-sg-progress">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`pc-sg-progress-step ${s === step ? 'active' : ''} ${s < step ? 'done' : ''}`}
              />
            ))}
          </div>

          {/* Step 1: Topic */}
          {step === 1 && (
            <div className="pc-sg-card">
              <h2 className="pc-sg-card-title">What's your presentation about?</h2>
              <p className="pc-sg-card-hint">
                Don't overthink it — just tell us the main idea in a sentence or two.
              </p>
              <input
                className="pc-sg-input"
                type="text"
                placeholder="e.g., Why my bakery makes the best sourdough in town"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && topic.trim() && setStep(2)}
                autoFocus
              />
              <div className="pc-sg-actions" style={{ marginTop: '24px' }}>
                <button className="pc-sg-btn-secondary" onClick={() => navigate('/dashboard')}>
                  Cancel
                </button>
                <button 
                  className="pc-sg-btn-primary"
                  disabled={!topic.trim()}
                  onClick={() => setStep(2)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Audience & Tone */}
          {step === 2 && (
            <div className="pc-sg-card">
              <h2 className="pc-sg-card-title">Who are you talking to?</h2>
              <p className="pc-sg-card-hint">
                This helps us match the right words and energy for your audience.
              </p>
              <input
                className="pc-sg-input"
                type="text"
                placeholder="e.g., Potential customers, Investors, My team"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={{ marginBottom: '28px' }}
                autoFocus
              />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
                Pick a tone
              </h3>
              <div className="pc-sg-tones">
                {tones.map(t => (
                  <button
                    key={t.value}
                    className={`pc-sg-tone ${tone === t.value ? 'selected' : ''}`}
                    onClick={() => setTone(t.value)}
                  >
                    <span className="pc-sg-tone-icon">{t.icon}</span>
                    <div className="pc-sg-tone-text">
                      <strong>{t.label}</strong>
                      <span>{t.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="pc-sg-actions" style={{ marginTop: '24px' }}>
                <button className="pc-sg-btn-secondary" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="pc-sg-btn-primary" onClick={() => setStep(3)}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Duration */}
          {step === 3 && (
            <div className="pc-sg-card">
              <h2 className="pc-sg-card-title">How long should it be?</h2>
              <p className="pc-sg-card-hint">
                Short and sweet usually wins. We recommend 1-3 minutes for social media.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                <div className="pc-sg-duration-row">
                  <button 
                    className="pc-sg-duration-btn"
                    onClick={() => setDuration(String(Math.max(1, parseInt(duration) - 1)))}
                  >
                    −
                  </button>
                  <div className="pc-sg-duration-display">{duration}</div>
                  <button 
                    className="pc-sg-duration-btn"
                    onClick={() => setDuration(String(Math.min(15, parseInt(duration) + 1)))}
                  >
                    +
                  </button>
                </div>
                <span className="pc-sg-duration-unit" style={{ marginTop: '8px' }}>minutes</span>
              </div>
              <div className="pc-sg-actions" style={{ marginTop: '16px' }}>
                <button className="pc-sg-btn-secondary" onClick={() => setStep(2)}>
                  ← Back
                </button>
                <button className="pc-sg-btn-primary" onClick={handleGenerateScript}>
                  ✨ Generate My Script
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="pc-sg-card">
              <div className="pc-sg-loading">
                <div className="pc-sg-spinner"></div>
                <p className="pc-sg-loading-text">Writing your script...</p>
                <p className="pc-sg-loading-sub">This usually takes a few seconds</p>
              </div>
            </div>
          )}

          {/* Step 4: Script Output */}
          {step === 4 && script && !loading && (
            <div className="pc-sg-card">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}>
                <span style={{ 
                  padding: '6px 14px', 
                  background: '#FFF8F0', 
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#FF9500',
                  border: '1px solid #FFE0B2'
                }}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone
                </span>
                <span style={{ 
                  padding: '6px 14px', 
                  background: '#f0f0f0', 
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  ~{duration} min
                </span>
                <span style={{ 
                  padding: '6px 14px', 
                  background: '#f0f0f0', 
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  {audience || 'General audience'}
                </span>
              </div>
              
              <div className="pc-sg-output">
                {script}
              </div>

              <div className="pc-sg-output-actions">
                <button 
                  className="pc-sg-output-btn pc-sg-btn-record"
                  onClick={() => navigate('/record')}
                >
                  🎥 Record This Script
                </button>
                <button 
                  className="pc-sg-output-btn pc-sg-btn-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(script)
                    alert('Script copied to clipboard!')
                  }}
                >
                  📋 Copy
                </button>
                <button 
                  className="pc-sg-output-btn pc-sg-btn-regen"
                  onClick={() => {
                    setScript('')
                    setStep(1)
                  }}
                >
                  🔄 Start Over
                </button>
              </div>

              <div style={{ 
                marginTop: '24px',
                padding: '16px 20px',
                background: '#FFF8F0',
                borderRadius: '12px',
                border: '1px solid #FFE0B2',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '20px' }}>💡</span>
                <p style={{ fontSize: '14px', color: '#92680A', margin: 0, lineHeight: '1.5' }}>
                  <strong>Pro tip:</strong> This script is your starting point. 
                  Feel free to edit it and make it sound like you before recording.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}