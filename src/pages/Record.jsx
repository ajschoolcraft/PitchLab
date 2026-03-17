import { useState } from 'react'
import MultiTakeVideoRecorder from '../components/MultiTakeVideoRecorder'
import Teleprompter from '../components/Teleprompter'

export default function Record() {
  const [showTeleprompter, setShowTeleprompter] = useState(false)
  const [script, setScript] = useState('')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .pc-record {
          min-height: 100vh;
          background: #FAFAFA;
          font-family: 'DM Sans', -apple-system, sans-serif;
          padding: 40px 24px 80px;
        }
        .pc-record-inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .pc-record-header {
          margin-bottom: 32px;
        }
        .pc-record-label {
          font-size: 14px;
          font-weight: 700;
          color: #FF9500;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .pc-record-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .pc-record-subtitle {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.5;
        }

        /* Teleprompter Card */
        .pc-record-tp-card {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .pc-record-tp-info {
          flex: 1;
        }
        .pc-record-tp-title {
          font-size: 17px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pc-record-tp-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.4;
        }
        .pc-record-tp-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(255, 149, 0, 0.3);
        }
        .pc-record-tp-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 149, 0, 0.4);
        }

        /* Script Input for Teleprompter */
        .pc-record-tp-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          min-height: 80px;
          margin-top: 12px;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .pc-record-tp-input:focus {
          outline: none;
          border-color: #FF9500;
          box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.1);
        }
        .pc-record-tp-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        /* Tips */
        .pc-record-tips {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #f0f0f0;
          margin-bottom: 24px;
        }
        .pc-record-tips-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pc-record-tips-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .pc-record-tip {
          font-size: 14px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.4;
        }
        .pc-record-tip-check {
          color: #FF9500;
          font-weight: 700;
        }
        @media (max-width: 768px) {
          .pc-record { padding: 24px 16px 60px; }
          .pc-record-title { font-size: 26px; }
          .pc-record-tips-list { grid-template-columns: 1fr; }
          .pc-record-tp-card { flex-direction: column; text-align: center; }
          .pc-record-tp-btn { width: 100%; }
        }
      `}</style>

      <div className="pc-record">
        <div className="pc-record-inner">
          <div className="pc-record-header">
            <p className="pc-record-label">Video Studio</p>
            <h1 className="pc-record-title">Record Your Presentation</h1>
            <p className="pc-record-subtitle">
              Take as many tries as you need. Pick your best take and download it.
            </p>
          </div>

          {/* Teleprompter Card */}
          <div className="pc-record-tp-card">
            <div className="pc-record-tp-info">
              <p className="pc-record-tp-title">
                📖 Teleprompter
              </p>
              <p className="pc-record-tp-desc">
                Paste your script below and launch the teleprompter while you record.
              </p>
              <textarea
                className="pc-record-tp-input"
                placeholder="Paste your script here..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={3}
              />
            </div>
            <button 
              className="pc-record-tp-btn"
              onClick={() => setShowTeleprompter(true)}
            >
              Launch ▶
            </button>
          </div>

          {/* Tips */}
          <div className="pc-record-tips">
            <p className="pc-record-tips-title">
              💡 Quick Tips Before You Record
            </p>
            <div className="pc-record-tips-list">
              <div className="pc-record-tip">
                <span className="pc-record-tip-check">✓</span>
                Find good lighting
              </div>
              <div className="pc-record-tip">
                <span className="pc-record-tip-check">✓</span>
                Look at the camera
              </div>
              <div className="pc-record-tip">
                <span className="pc-record-tip-check">✓</span>
                Speak slowly and clearly
              </div>
              <div className="pc-record-tip">
                <span className="pc-record-tip-check">✓</span>
                Keep background clean
              </div>
              <div className="pc-record-tip">
                <span className="pc-record-tip-check">✓</span>
                Smile and be natural
              </div>
              <div className="pc-record-tip">
                <span className="pc-record-tip-check">✓</span>
                It's okay to redo takes
              </div>
            </div>
          </div>

          {/* Video Recorder */}
          <MultiTakeVideoRecorder />
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