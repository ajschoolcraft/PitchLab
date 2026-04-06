import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import MultiTakeVideoRecorder from '../components/MultiTakeVideoRecorder'
import Teleprompter from '../components/Teleprompter'
import '../styles/record.css'

export default function Record() {
  const location = useLocation()
  const passedScript = location.state?.script

  const [showTeleprompter, setShowTeleprompter] = useState(false)
  const [script, setScript] = useState(passedScript?.script_text || '')

  return (
    <>
      <div className="record">
        <div className="record-inner">
          <div className="record-header">
            <p className="record-label">Video Studio</p>
            <h1 className="record-title">Record Your Presentation</h1>
            <p className="record-subtitle">
              Take as many tries as you need. Pick your best take and download it.
            </p>
          </div>
          {/* Script Loaded Notification */}
          {passedScript && (
            <div className="record-script-notice">
              <div className="record-script-notice-label">
                📝 Script Loaded
              </div>
              <div className="record-script-notice-text">
                {passedScript.title || passedScript.script_text?.substring(0, 50) + '...' || 'Using your pitch script'}
              </div>
            </div>
          )}
          {/* Teleprompter Card */}
          <div className="record-tp-card">
            <div className="record-tp-info">
              <p className="record-tp-title">
                📖 Teleprompter
              </p>
              <p className="record-tp-desc">
                Paste your script below and launch the teleprompter while you record.
              </p>
              <textarea
                className="record-tp-input"
                placeholder="Paste your script here..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={3}
              />
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowTeleprompter(true)}
            >
              Launch ▶
            </button>
          </div>

          {/* Tips */}
          <div className="record-tips">
            <p className="record-tips-title">
              💡 Quick Tips Before You Record
            </p>
            <div className="record-tips-list">
              <div className="record-tip">
                <span className="record-tip-check">✓</span>
                Find good lighting
              </div>
              <div className="record-tip">
                <span className="record-tip-check">✓</span>
                Look at the camera
              </div>
              <div className="record-tip">
                <span className="record-tip-check">✓</span>
                Speak slowly and clearly
              </div>
              <div className="record-tip">
                <span className="record-tip-check">✓</span>
                Keep background clean
              </div>
              <div className="record-tip">
                <span className="record-tip-check">✓</span>
                Smile and be natural
              </div>
              <div className="record-tip">
                <span className="record-tip-check">✓</span>
                It's okay to redo takes
              </div>
            </div>
          </div>

          {/* Video Recorder */}
          <MultiTakeVideoRecorder script={passedScript} />
        </div>
      </div>

      {/* Teleprompter Overlay */}
      {showTeleprompter && (
        <Teleprompter
          script={script}
          onClose={() => setShowTeleprompter(false)}
        />
      )}
    </>
  )
}
