import { useState } from 'react'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: '🎤',
      title: 'Welcome to PresentationCoach',
      subtitle: 'Your personal AI-powered tool for telling your story with clarity and confidence.',
      detail: 'We help entrepreneurs and business owners craft their message and present it professionally.',
      accent: '#FF9500',
    },
    {
      icon: '✍️',
      title: 'Craft Your Message',
      subtitle: 'Answer guided questions and let AI help you shape a clear, powerful narrative.',
      detail: 'No more staring at a blank page. We walk you through it step by step.',
      accent: '#FF6B00',
    },
    {
      icon: '🎥',
      title: 'Record & Share',
      subtitle: 'Practice on camera with a built-in teleprompter. Download your best take.',
      detail: 'Record as many times as you need. Share to any platform when you\'re ready.',
      accent: '#E85D00',
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .ob-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'DM Sans', -apple-system, sans-serif;
          animation: obFadeIn 0.4s ease;
        }
        @keyframes obFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ob-card {
          background: white;
          border-radius: 24px;
          padding: 48px 40px 40px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          position: relative;
          animation: obSlideUp 0.5s ease;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
        }
        @keyframes obSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ob-skip {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          padding: 4px 8px;
          transition: color 0.2s;
        }
        .ob-skip:hover {
          color: #1a1a1a;
        }

        .ob-icon-wrap {
          width: 88px;
          height: 88px;
          border-radius: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .ob-icon-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.12;
          border-radius: 24px;
        }

        .ob-title {
          font-size: 26px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .ob-subtitle {
          font-size: 17px;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .ob-detail {
          font-size: 14px;
          color: #9ca3af;
          line-height: 1.5;
          margin-bottom: 36px;
        }

        /* Progress Dots */
        .ob-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }
        .ob-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e5e7eb;
          transition: all 0.3s ease;
        }
        .ob-dot.active {
          width: 28px;
          border-radius: 100px;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
        }
        .ob-dot.done {
          background: #FF9500;
        }

        /* Buttons */
        .ob-actions {
          display: flex;
          gap: 12px;
        }
        .ob-btn-back {
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
          background: #f5f5f5;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .ob-btn-back:hover {
          background: #e5e7eb;
          color: #1a1a1a;
        }
        .ob-btn-next {
          flex: 1;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(255, 149, 0, 0.3);
        }
        .ob-btn-next:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255, 149, 0, 0.4);
        }

        /* Mobile */
        @media (max-width: 480px) {
          .ob-card {
            padding: 40px 24px 32px;
            border-radius: 20px;
          }
          .ob-title {
            font-size: 22px;
          }
          .ob-subtitle {
            font-size: 15px;
          }
          .ob-icon-wrap {
            width: 72px;
            height: 72px;
            font-size: 32px;
          }
        }
      `}</style>

      <div className="ob-overlay">
        <div className="ob-card" key={step}>
          <button className="ob-skip" onClick={handleSkip}>
            Skip
          </button>

          <div 
            className="ob-icon-wrap"
            style={{ backgroundColor: `${current.accent}15` }}
          >
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
    </>
  )
}