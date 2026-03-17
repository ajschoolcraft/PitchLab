import { useState, useRef, useEffect, useCallback } from 'react'

export default function Teleprompter({ script, onClose }) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [fontSize, setFontSize] = useState(28)
  const [mirrored, setMirrored] = useState(false)
  const [progress, setProgress] = useState(0)
  const scrollRef = useRef(null)
  const animationRef = useRef(null)
  const lastTimeRef = useRef(null)

  const defaultScript = `Your script will appear here.

Go to the Script Generator to create one, then come back to practice with the teleprompter.

Tip: Speak slowly and naturally. Make eye contact with the camera, not the screen.`

  const displayScript = script || defaultScript

  const scrollStep = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const delta = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    if (scrollRef.current) {
      const pixelsPerFrame = (speed * 0.5 * delta) / 16
      scrollRef.current.scrollTop += pixelsPerFrame

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const maxScroll = scrollHeight - clientHeight
      if (maxScroll > 0) {
        setProgress(Math.min((scrollTop / maxScroll) * 100, 100))
      }

      if (scrollRef.current.scrollTop >= maxScroll) {
        setIsScrolling(false)
        return
      }
    }

    animationRef.current = requestAnimationFrame(scrollStep)
  }, [speed])

  useEffect(() => {
    if (isScrolling) {
      lastTimeRef.current = null
      animationRef.current = requestAnimationFrame(scrollStep)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isScrolling, scrollStep])

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      switch(e.key) {
        case ' ':
          e.preventDefault()
          setIsScrolling(prev => !prev)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSpeed(prev => Math.min(prev + 0.5, 5))
          break
        case 'ArrowDown':
          e.preventDefault()
          setSpeed(prev => Math.max(prev - 0.5, 0.5))
          break
        case 'Escape':
          if (onClose) onClose()
          break
        case 'r':
        case 'R':
          if (scrollRef.current) {
            scrollRef.current.scrollTop = 0
            setProgress(0)
            setIsScrolling(false)
          }
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleReset = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
      setProgress(0)
      setIsScrolling(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .tp-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0a0a0a;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', -apple-system, sans-serif;
          animation: tpFadeIn 0.3s ease;
        }
        @keyframes tpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Top Bar */
        .tp-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .tp-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tp-badge {
          padding: 4px 12px;
          background: rgba(255, 149, 0, 0.15);
          border: 1px solid rgba(255, 149, 0, 0.3);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          color: #FF9500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .tp-status {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        .tp-status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .tp-status-dot.active {
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          animation: tpPulse 1.5s ease infinite;
        }
        .tp-status-dot.paused {
          background: #FF9500;
        }
        @keyframes tpPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .tp-close-btn {
          padding: 8px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .tp-close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        /* Progress Bar */
        .tp-progress {
          height: 3px;
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .tp-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #FF9500, #FF6B00);
          transition: width 0.3s ease;
          border-radius: 0 2px 2px 0;
        }

        /* Script Area */
        .tp-script-area {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .tp-script-scroll {
          height: 100%;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .tp-script-scroll::-webkit-scrollbar {
          display: none;
        }
        .tp-script-content {
          padding: 15vh 10vw 60vh;
          max-width: 900px;
          margin: 0 auto;
        }
        .tp-script-text {
          color: rgba(255,255,255,0.92);
          line-height: 1.9;
          white-space: pre-wrap;
          word-wrap: break-word;
          letter-spacing: 0.2px;
        }
        .tp-script-text.mirrored {
          transform: scaleX(-1);
        }

        /* Center Line Guide */
        .tp-guide {
          position: absolute;
          left: 0;
          right: 0;
          top: 38%;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 149, 0, 0.3) 20%, rgba(255, 149, 0, 0.3) 80%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }
        .tp-guide::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: -40px;
          bottom: -40px;
          background: linear-gradient(180deg, transparent 0%, rgba(255, 149, 0, 0.02) 40%, rgba(255, 149, 0, 0.02) 60%, transparent 100%);
        }

        /* Fade Edges */
        .tp-fade-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(180deg, #0a0a0a 0%, transparent 100%);
          pointer-events: none;
          z-index: 2;
        }
        .tp-fade-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(0deg, #0a0a0a 0%, transparent 100%);
          pointer-events: none;
          z-index: 2;
        }

        /* Bottom Controls */
        .tp-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .tp-control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tp-control-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .tp-btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tp-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .tp-btn.active {
          background: rgba(255, 149, 0, 0.15);
          border-color: rgba(255, 149, 0, 0.3);
          color: #FF9500;
        }
        .tp-play-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(255, 149, 0, 0.3);
        }
        .tp-play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 28px rgba(255, 149, 0, 0.4);
        }
        .tp-speed-display {
          font-size: 14px;
          font-weight: 700;
          color: #FF9500;
          min-width: 36px;
          text-align: center;
        }
        .tp-btn-sm {
          width: 32px;
          height: 32px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          border-radius: 6px;
        }
        .tp-divider {
          width: 1px;
          height: 28px;
          background: rgba(255,255,255,0.08);
        }

        /* Keyboard Hints */
        .tp-hints {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 8px 20px 12px;
          flex-shrink: 0;
        }
        .tp-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tp-hint kbd {
          padding: 2px 6px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          font-size: 10px;
          font-family: inherit;
          color: rgba(255,255,255,0.4);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .tp-script-content {
            padding: 10vh 6vw 50vh;
          }
          .tp-controls {
            gap: 10px;
            padding: 12px 16px;
          }
          .tp-hints {
            display: none;
          }
          .tp-control-label {
            display: none;
          }
        }
      `}</style>

      <div className="tp-overlay">
        {/* Top Bar */}
        <div className="tp-topbar">
          <div className="tp-topbar-left">
            <span className="tp-badge">Teleprompter</span>
            <span className="tp-status">
              <span className={`tp-status-dot ${isScrolling ? 'active' : 'paused'}`}></span>
              {isScrolling ? 'Scrolling' : 'Paused'}
            </span>
          </div>
          <button className="tp-close-btn" onClick={onClose || (() => window.history.back())}>
            Exit ✕
          </button>
        </div>

        {/* Progress */}
        <div className="tp-progress">
          <div className="tp-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Script Area */}
        <div className="tp-script-area">
          <div className="tp-fade-top"></div>
          <div className="tp-guide"></div>
          <div className="tp-script-scroll" ref={scrollRef}>
            <div className="tp-script-content">
              <div 
                className={`tp-script-text ${mirrored ? 'mirrored' : ''}`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {displayScript}
              </div>
            </div>
          </div>
          <div className="tp-fade-bottom"></div>
        </div>

        {/* Controls */}
        <div className="tp-controls">
          {/* Speed */}
          <div className="tp-control-group">
            <span className="tp-control-label">Speed</span>
            <button 
              className="tp-btn tp-btn-sm"
              onClick={() => setSpeed(prev => Math.max(prev - 0.5, 0.5))}
            >
              −
            </button>
            <span className="tp-speed-display">{speed}×</span>
            <button 
              className="tp-btn tp-btn-sm"
              onClick={() => setSpeed(prev => Math.min(prev + 0.5, 5))}
            >
              +
            </button>
          </div>

          <div className="tp-divider"></div>

          {/* Play/Pause */}
          <button 
            className="tp-play-btn"
            onClick={() => setIsScrolling(prev => !prev)}
          >
            {isScrolling ? '❚❚' : '▶'}
          </button>

          <div className="tp-divider"></div>

          {/* Font Size */}
          <div className="tp-control-group">
            <span className="tp-control-label">Size</span>
            <button 
              className="tp-btn tp-btn-sm"
              onClick={() => setFontSize(prev => Math.max(prev - 2, 16))}
            >
              A↓
            </button>
            <button 
              className="tp-btn tp-btn-sm"
              onClick={() => setFontSize(prev => Math.min(prev + 2, 48))}
            >
              A↑
            </button>
          </div>

          <div className="tp-divider"></div>

          {/* Mirror + Reset */}
          <button 
            className={`tp-btn ${mirrored ? 'active' : ''}`}
            onClick={() => setMirrored(prev => !prev)}
          >
            ↔ Mirror
          </button>
          <button className="tp-btn" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="tp-hints">
          <span className="tp-hint"><kbd>Space</kbd> Play / Pause</span>
          <span className="tp-hint"><kbd>↑</kbd><kbd>↓</kbd> Speed</span>
          <span className="tp-hint"><kbd>R</kbd> Reset</span>
          <span className="tp-hint"><kbd>Esc</kbd> Exit</span>
        </div>
      </div>
    </>
  )
}