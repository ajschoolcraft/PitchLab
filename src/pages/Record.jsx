/**
 * @fileoverview Video recording page.
 * Provides the recording interface with an optional teleprompter, an interactive
 * pre-recording checklist, and the MultiTakeVideoRecorder component.
 */

import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import MultiTakeVideoRecorder from '../components/MultiTakeVideoRecorder'
import Teleprompter from '../components/Teleprompter'
import '../styles/record.css'

const CHECKLIST = [
  { id: 'lighting', icon: '💡', text: 'Good lighting on your face' },
  { id: 'camera', icon: '👁️', text: 'Look at the camera, not the screen' },
  { id: 'background', icon: '🎨', text: 'Clean, simple background' },
  { id: 'audio', icon: '🔇', text: 'Quiet room, no distractions' },
  { id: 'pace', icon: '🐢', text: 'Speak slowly and clearly' },
  { id: 'relax', icon: '😊', text: 'Relax — it\'s okay to redo takes' },
]

export default function Record() {
  const location = useLocation()
  const passedScript = location.state?.script

  const [showTeleprompter, setShowTeleprompter] = useState(false)
  const [script, setScript] = useState(passedScript?.script_text || '')
  const [checked, setChecked] = useState({})

  const checkedCount = Object.values(checked).filter(Boolean).length
  const allChecked = checkedCount === CHECKLIST.length
  const readyPercent = Math.round((checkedCount / CHECKLIST.length) * 100)

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <>
      <style>{`
        .record-checklist {
          background: #1a1a1a;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          margin-bottom: 24px;
        }
        .record-checklist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .record-checklist-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .record-checklist-badge {
          font-size: 13px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          background: ${allChecked ? 'rgba(212, 165, 116, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
          color: ${allChecked ? '#d4a574' : '#a0a0a0'};
          transition: all 0.3s ease;
        }
        .record-progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .record-progress-fill {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(135deg, #d4a574, #c89563);
          transition: width 0.4s ease;
          width: ${readyPercent}%;
        }
        .record-checklist-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .record-checklist-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid ${'{checked ? "rgba(212, 165, 116, 0.3)" : "rgba(255, 255, 255, 0.1)"}'};
          cursor: pointer;
          transition: all 0.2s ease;
          background: ${'{checked ? "rgba(212, 165, 116, 0.1)" : "rgba(255, 255, 255, 0.03)"}'};
          user-select: none;
        }
        .record-checklist-item:hover { 
          border-color: rgba(212, 165, 116, 0.5);
          background: rgba(212, 165, 116, 0.05);
        }
        .record-check-box {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
          font-size: 12px;
        }
        .record-check-box.checked {
          background: #d4a574;
          border-color: #d4a574;
        }
        .record-check-icon { font-size: 16px; }
        .record-check-text {
          font-size: 13px;
          font-weight: 500;
          color: #d0d0d0;
          line-height: 1.3;
        }
        .record-ready-banner {
          margin-top: 14px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #d4a574, #c89563);
          border-radius: 12px;
          text-align: center;
          color: #0f0f0f;
          font-size: 14px;
          font-weight: 600;
          animation: cf-slide-up 0.4s ease;
        }
        @keyframes cf-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .record-checklist-items { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="record">
        <div className="record-inner">
          <div className="record-header">
            <p className="record-label">Video Studio</p>
            <h1 className="record-title">Record Your Presentation</h1>
            <p className="record-subtitle">
              Take as many tries as you need. Pick your best take and download it.
            </p>
          </div>

          {passedScript && (
            <div className="record-script-notice">
              <div className="record-script-notice-label">📝 Script Loaded</div>
              <div className="record-script-notice-text">
                {passedScript.title || passedScript.script_text?.substring(0, 50) + '...' || 'Using your pitch script'}
              </div>
            </div>
          )}

          {/* Interactive Pre-Recording Checklist */}
          <div className="record-checklist">
            <div className="record-checklist-header">
              <p className="record-checklist-title">✅ Before You Hit Record</p>
              <span className="record-checklist-badge">
                {allChecked ? '🎉 Ready!' : `${checkedCount}/${CHECKLIST.length} checked`}
              </span>
            </div>
            <div className="record-progress-bar">
              <div className="record-progress-fill" />
            </div>
            <div className="record-checklist-items">
              {CHECKLIST.map(item => (
                <div
                  key={item.id}
                  className="record-checklist-item"
                  style={{
                    borderColor: checked[item.id] ? 'rgba(212, 165, 116, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    background: checked[item.id] ? 'rgba(212, 165, 116, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  }}
                  onClick={() => toggle(item.id)}
                >
                  <div className={`record-check-box ${checked[item.id] ? 'checked' : ''}`}>
                    {checked[item.id] && '✓'}
                  </div>
                  <span className="record-check-icon">{item.icon}</span>
                  <span className="record-check-text">{item.text}</span>
                </div>
              ))}
            </div>
            {allChecked && (
              <div className="record-ready-banner">
                🎬 You're all set — hit record and own it!
              </div>
            )}
          </div>

          {/* Teleprompter Card */}
          <div className="record-tp-card">
            <div className="record-tp-info">
              <p className="record-tp-title">📖 Teleprompter</p>
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

          {/* Video Recorder */}
          <MultiTakeVideoRecorder script={passedScript} manualScript={script} />
        </div>
      </div>

      {showTeleprompter && (
        <Teleprompter
          script={script}
          onClose={() => setShowTeleprompter(false)}
        />
      )}
    </>
  )
}
