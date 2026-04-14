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
          ✨ AI-Powered Presentation Coaching
        </div>
        <h1>
          Speak with<br/><span>Confidence.</span>
        </h1>
        <p className="landing-hero-sub">
          Generate your script, practice on camera, and present like a pro.
          Your personal AI coach that helps you communicate clearly.
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
          Built for <span>entrepreneurs</span>, <span>small business owners</span>, and <span>job seekers</span>
        </p>
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
              <h3>Tell Us Your Idea</h3>
              <p>Just describe what you want to talk about. Who's your audience? How long should it be? That's all we need.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <h3>Get Your Script</h3>
              <p>Our AI writes a clear, structured script for you in seconds. Edit it, tweak it, make it yours.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <h3>Record & Share</h3>
              <p>Practice on camera with your script as a guide. Download your best take and share it anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-features-inner">
          <p className="landing-section-label">Everything You Need</p>
          <h2 className="landing-section-title">Built For Real People</h2>
          <p className="landing-section-sub">
            No marketing jargon. No complicated tools. Just you, telling your story better.
          </p>
          <div className="landing-features-grid">
            <div className="landing-feature">
              <div className="landing-feature-icon">🤖</div>
              <h3>AI Script Generator</h3>
              <p>Tell us your topic and audience. Our AI creates a professional, structured script you can use right away — or customize to fit your voice.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">🎥</div>
              <h3>Multi-Take Recording</h3>
              <p>Record as many takes as you want. Review them side by side. Pick your best one. No pressure, no rush.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">📖</div>
              <h3>Built-In Teleprompter</h3>
              <p>Your script scrolls on screen while you record, so you never lose your place. Just look at the camera and speak naturally.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">📤</div>
              <h3>Share Anywhere</h3>
              <p>Download your video and post it to Instagram, TikTok, YouTube, or WhatsApp. We'll even tell you the best format for each platform.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-proof">
        <div className="landing-proof-inner">
          <p className="landing-section-label">Why It Matters</p>
          <p className="landing-proof-quote">
            "I used to spend hours trying to figure out what to say in my videos.
            Now I just type my idea and start recording in minutes."
          </p>
          <p className="landing-proof-author">
            <strong>Built by presenters, for presenters</strong> — LMU Capstone 2026
          </p>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta-bg">
          <div className="landing-cta-inner">
            <h2>Ready to Present Better?</h2>
            <p>
              Join entrepreneurs and business owners who are telling their stories
              with clarity and confidence.
            </p>
            <button className="btn-primary" onClick={() => navigate('/auth')}>
              Get Started — It's Free
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          © 2026 PresentationCoach · Built with care at <a href="https://www.lmu.edu" target="_blank" rel="noreferrer">Loyola Marymount University</a>
        </p>
      </footer>
    </div>
  )
}
