/**
 * @fileoverview First-time user onboarding flow.
 * Displays a 3-step walkthrough introducing the app's core features.
 * Progress is persisted to localStorage so the flow only appears once.
 * Users can skip at any point or navigate back through previous steps.
 */

import { useState } from 'react'
import '../styles/onboarding.css'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: '🎤',
      title: 'Welcome to PresentationCoach',
      subtitle: 'Your personal AI-powered tool for telling your story with clarity and confidence.',
      detail: 'We help entrepreneurs and business owners craft their message and present it professionally.',
    },
    {
      icon: '✍️',
      title: 'Craft Your Message',
      subtitle: 'Answer guided questions and let AI help you shape a clear, powerful narrative.',
      detail: 'No more staring at a blank page. We walk you through it step by step.',
    },
    {
      icon: '🎥',
      title: 'Record & Share',
      subtitle: 'Practice on camera with a built-in teleprompter. Download your best take.',
      detail: 'Record as many times as you need. Share to any platform when you\'re ready.',
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('pc_onboarding_complete', 'true')
      onComplete()
    } else {
      setStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('pc_onboarding_complete', 'true')
    onComplete()
  }

  return (
    <div className="ob-overlay">
      <div className="ob-card" key={step}>
        <button className="ob-skip" onClick={handleSkip}>
          Skip
        </button>

        <div className="ob-icon-wrap">
          {current.icon}
        </div>

        <h2 className="ob-title">{current.title}</h2>
        <p className="ob-subtitle">{current.subtitle}</p>
        <p className="ob-detail">{current.detail}</p>

        <div className="ob-dots">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`ob-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            />
          ))}
        </div>

        <div className="ob-actions">
          {step > 0 && (
            <button className="ob-btn-back" onClick={() => setStep(prev => prev - 1)}>
              ← Back
            </button>
          )}
          <button className="ob-btn-next" onClick={handleNext}>
            {isLast ? "Let's Go! →" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
