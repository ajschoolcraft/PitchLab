import MultiTakeVideoRecorder from '../components/MultiTakeVideoRecorder'

export default function Record() {
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

          <MultiTakeVideoRecorder />
        </div>
      </div>
    </>
  )
}