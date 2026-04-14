import { useNavigate } from 'react-router-dom'
import '../styles/landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-icon">🎤</div>
          PresentationCoach
        </div>
        <button className="btn-primary btn-sm" onClick={() => navigate('/auth')}>
          Get Started Free
        </button>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-badge">
          ✨ Built on the Authority Alignment™ Framework
        </div>
        <h1>
          Stop Winging It.<br/><span>Start Owning It.</span>
        </h1>
        <p className="landing-hero-sub">
          AI-powered presentation coaching for entrepreneurs who are tired of
          fumbling their pitch. Write your script, practice on camera,
          and get real coaching feedback in minutes.
        </p>
        <div className="landing-hero-actions">
          <button className="btn-primary" onClick={() => navigate('/auth')}>
            Start For Free →
          </button>
          <button className="btn-secondary" onClick={() => {
            document.querySelector('.landing-how')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            See How It Works
          </button>
        </div>
        <p className="landing-hero-trust">
          Built for <span>entrepreneurs</span>, <span>founders</span>, and <span>business owners</span>
        </p>
      </section>

      <section className="landing-stats">
        <div className="landing-stats-inner">
          <div className="landing-stat">
            <span className="landing-stat-num">11</span>
            <span className="landing-stat-label">Guided Questions</span>
          </div>
          <div className="landing-stat-divider" />
          <div className="landing-stat">
            <span className="landing-stat-num">3</span>
            <span className="landing-stat-label">Framework Phases</span>
          </div>
          <div className="landing-stat-divider" />
          <div className="landing-stat">
            <span className="landing-stat-num">AI</span>
            <span className="landing-stat-label">Coaching Feedback</span>
          </div>
          <div className="landing-stat-divider" />
          <div className="landing-stat">
            <span className="landing-stat-num">Free</span>
            <span className="landing-stat-label">To Get Started</span>
          </div>
        </div>
      </section>

      <section className="landing-framework">
        <div className="landing-framework-inner">
          <div className="landing-framework-text">
            <p className="landing-section-label">The Framework Behind It</p>
            <h2>Authority Alignment™</h2>
            <p>
              The Authority Alignment™ framework helps entrepreneurs find and own
              their authentic story — not a rehearsed pitch, but a real one that
              connects with the right people.
            </p>
            <p>
              Our AI guides you through three phases: <strong>Identity</strong>,
              <strong> Impact</strong>, and <strong>Declaration</strong> — so your
              presentation reflects who you actually are and why your work matters.
            </p>
            <button className="btn-primary" onClick={() => navigate('/auth')}>
              Try It Free →
            </button>
          </div>
          <div className="landing-framework-phases">
            <div className="landing-phase">
              <div className="landing-phase-num">I</div>
              <div>
                <h4>Identity</h4>
                <p>Who you are and what drives you</p>
              </div>
            </div>
            <div className="landing-phase">
              <div className="landing-phase-num">II</div>
              <div>
                <h4>Impact</h4>
                <p>The problem you solve and why it matters</p>
              </div>
            </div>
            <div className="landing-phase">
              <div className="landing-phase-num">III</div>
              <div>
                <h4>Declaration</h4>
                <p>Your clear, confident call to action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-how">
        <div className="landing-how-inner">
          <p className="landing-section-label">Simple as 1-2-3</p>
          <h2 className="landing-section-title">How It Works</h2>
          <p className="landing-section-sub">
            No experience needed. We guide you through every step.
          </p>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-num">1</div>
              <h3>Answer the Questions</h3>
              <p>11 guided questions based on the Authority Alignment™ framework. No blank page paralysis — just answer naturally.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <h3>Get Your Script</h3>
              <p>Claude generates a clear, structured pitch script from your answers in seconds. Authentic to your voice, structured for impact.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <h3>Record and Get Coached</h3>
              <p>Record as many takes as you need. After each one, get real AI coaching feedback on what landed, what to tighten, and one specific tip.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-features-inner">
          <p className="landing-section-label">Everything You Need</p>
          <h2 className="landing-section-title">Built For Real Entrepreneurs</h2>
          <p className="landing-section-sub">
            No marketing jargon. No complicated tools. Just you, telling your story better.
          </p>
          <div className="landing-features-grid">
            <div className="landing-feature">
              <div className="landing-feature-icon">🤖</div>
              <h3>AI Script Generator</h3>
              <p>Answer 11 guided questions and Claude builds your script — structured around the Authority Alignment™ framework so it actually connects.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">🎯</div>
              <h3>Real Coaching Feedback</h3>
              <p>After every recording, our AI gives you three insights: what landed, what to tighten, and one specific tip for your next take.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">🎥</div>
              <h3>Multi-Take Recording</h3>
              <p>Record as many takes as you want with your teleprompter running. Review them, pick your best one. No pressure, no rush.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">📤</div>
              <h3>Share Anywhere</h3>
              <p>Download your video and post it to Instagram, TikTok, YouTube, or LinkedIn. We walk you through exactly how to upload to each platform.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta-bg">
          <div className="landing-cta-inner">
            <h2>Your Story Is Worth Telling Right.</h2>
            <p>
              Stop leaving your pitch to chance. Let AI help you find your words,
              practice on camera, and show up with confidence.
            </p>
            <button className="btn-primary" onClick={() => navigate('/auth')}>
              Start For Free →
            </button>
            <p className="landing-cta-sub">No credit card required</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          © 2026 PresentationCoach · Built with care at{' '}
          <a href="https://www.lmu.edu" target="_blank" rel="noreferrer">
            Loyola Marymount University
          </a>
        </p>
      </footer>
    </div>
  )
}