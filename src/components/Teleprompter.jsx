import { useState, useRef, useEffect, useCallback } from 'react'
import '../styles/teleprompter.css'

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
  )
}
