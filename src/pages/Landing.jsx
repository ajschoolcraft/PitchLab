import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        * { box-sizing: border-box; }
        
        .pc-landing {
          font-family: 'DM Sans', -apple-system, sans-serif;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .pc-topnav {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }
        .pc-topnav-logo {
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #1a1a1a;
          letter-spacing: -0.3px;
        }
        .pc-topnav-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .pc-topnav-btn {
          padding: 10px 24px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(255, 149, 0, 0.3);
        }
        .pc-topnav-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(255, 149, 0, 0.4);
        }

        .pc-hero {
          padding: 80px 24px 100px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pc-hero::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(255, 149, 0, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .pc-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: #FFF8F0;
          border: 1.5px solid #FFE0B2;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          color: #E67E00;
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease;
        }
        .pc-hero h1 {
          font-size: 56px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin: 0 auto 24px;
          max-width: 700px;
          animation: fadeInUp 0.6s ease 0.1s both;
        }
        .pc-hero h1 span {
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pc-hero-sub {
          font-size: 20px;
          line-height: 1.7;
          color: #6b7280;
          max-width: 520px;
          margin: 0 auto 44px;
          font-weight: 400;
          animation: fadeInUp 0.6s ease 0.2s both;
        }
        .pc-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: fadeInUp 0.6s ease 0.3s both;
          flex-wrap: wrap;
        }
        .pc-hero-btn-primary {
          padding: 16px 40px;
          font-size: 18px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 4px 24px rgba(255, 149, 0, 0.35);
        }
        .pc-hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255, 149, 0, 0.45);
        }
        .pc-hero-btn-secondary {
          padding: 16px 32px;
          font-size: 17px;
          font-weight: 600;
          color: #6b7280;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
        }
        .pc-hero-btn-secondary:hover {
          border-color: #FF9500;
          color: #FF9500;
        }
        .pc-hero-trust {
          margin-top: 60px;
          font-size: 14px;
          color: #9ca3af;
          animation: fadeInUp 0.6s ease 0.4s both;
        }
        .pc-hero-trust span {
          color: #FF9500;
          font-weight: 600;
        }

        .pc-how {
          padding: 100px 24px;
          background: #FAFAFA;
        }
        .pc-how-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .pc-section-label {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: #FF9500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 16px;
        }
        .pc-section-title {
          text-align: center;
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -1px;
          margin-bottom: 16px;
          color: #1a1a1a;
        }
        .pc-section-sub {
          text-align: center;
          font-size: 18px;
          color: #6b7280;
          max-width: 500px;
          margin: 0 auto 64px;
          line-height: 1.6;
        }
        .pc-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .pc-step {
          text-align: center;
          padding: 40px 28px;
          background: white;
          border-radius: 20px;
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
          position: relative;
        }
        .pc-step:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
          border-color: #FFE0B2;
        }
        .pc-step-num {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #FF9500, #FF6B00);
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
        }
        .pc-step h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #1a1a1a;
        }
        .pc-step p {
          font-size: 15px;
          color: #6b7280;
          line-height: 1.7;
          margin: 0;
        }

        .pc-features {
          padding: 100px 24px;
          background: white;
        }
        .pc-features-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .pc-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .pc-feature {
          padding: 36px;
          background: #FAFAFA;
          border-radius: 20px;
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        .pc-feature:hover {
          border-color: #FFE0B2;
          background: #FFF8F0;
        }
        .pc-feature-icon {
          width: 52px;
          height: 52px;
          background: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 18px;
          border: 1px solid #f0f0f0;
        }
        .pc-feature h3 {
          font-size: 19px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1a1a1a;
        }
        .pc-feature p {
          font-size: 15px;
          color: #6b7280;
          line-height: 1.7;
          margin: 0;
        }

        .pc-proof {
          padding: 80px 24px;
          background: #FAFAFA;
          text-align: center;
        }
        .pc-proof-inner {
          max-width: 700px;
          margin: 0 auto;
        }
        .pc-proof-quote {
          font-size: 24px;
          font-weight: 500;
          line-height: 1.6;
          color: #1a1a1a;
          margin-bottom: 24px;
          font-style: italic;
        }
        .pc-proof-author {
          font-size: 15px;
          color: #6b7280;
        }
        .pc-proof-author strong {
          color: #1a1a1a;
        }

        .pc-cta {
          padding: 100px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pc-cta-bg {
          background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
          border-radius: 32px;
          max-width: 1152px;
          margin: 0 auto;
          padding: 80px 24px;
          position: relative;
        }
        .pc-cta-inner {
          max-width: 600px;
          margin: 0 auto;
        }
        .pc-cta h2 {
          font-size: 40px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .pc-cta p {
          font-size: 18px;
          color: rgba(255,255,255,0.9);
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .pc-cta-btn {
          padding: 18px 48px;
          font-size: 18px;
          font-weight: 700;
          color: #FF9500;
          background: white;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .pc-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }

        .pc-footer {
          padding: 40px 24px;
          text-align: center;
          background: #1a1a1a;
        }
        .pc-footer p {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }
        .pc-footer a {
          color: #FF9500;
          text-decoration: none;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .pc-hero { padding: 50px 20px 70px; }
          .pc-hero h1 { font-size: 36px; letter-spacing: -0.5px; }
          .pc-hero-sub { font-size: 17px; }
          .pc-steps { grid-template-columns: 1fr; gap: 16px; }
          .pc-features-grid { grid-template-columns: 1fr; }
          .pc-section-title { font-size: 30px; }
          .pc-cta h2 { font-size: 30px; }
          .pc-cta-bg { margin: 0 12px; border-radius: 24px; padding: 60px 20px; }
          .pc-hero-actions { flex-direction: column; }
          .pc-hero-btn-primary, .pc-hero-btn-secondary { width: 100%; text-align: center; }
        }
      `}</style>

      <div className="pc-landing">
        <nav className="pc-topnav">
          <div className="pc-topnav-logo">
            <div className="pc-topnav-logo-icon">🎤</div>
            PresentationCoach
          </div>
          <button className="pc-topnav-btn" onClick={() => navigate('/auth')}>
            Get Started Free
          </button>
        </nav>

        <section className="pc-hero">
          <div className="pc-hero-badge">
            ✨ AI-Powered Presentation Coaching
          </div>
          <h1>
            Tell Your Story<br/>
            With <span>Confidence</span>
          </h1>
          <p className="pc-hero-sub">
            Generate your script, practice on camera, and present like a pro. 
            Your personal AI coach that helps you communicate clearly.
          </p>
          <div className="pc-hero-actions">
            <button className="pc-hero-btn-primary" onClick={() => navigate('/auth')}>
              Start For Free →
            </button>
            <button className="pc-hero-btn-secondary" onClick={() => {
              document.querySelector('.pc-how')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              See How It Works
            </button>
          </div>
          <p className="pc-hero-trust">
            Built for <span>entrepreneurs</span>, <span>small business owners</span>, and <span>job seekers</span>
          </p>
        </section>

        <section className="pc-how">
          <div className="pc-how-inner">
            <p className="pc-section-label">Simple as 1-2-3</p>
            <h2 className="pc-section-title">How It Works</h2>
            <p className="pc-section-sub">
              No experience needed. We guide you through every step.
            </p>
            <div className="pc-steps">
              <div className="pc-step">
                <div className="pc-step-num">1</div>
                <h3>Tell Us Your Idea</h3>
                <p>
                  Just describe what you want to talk about. Who's your audience? 
                  How long should it be? That's all we need.
                </p>
              </div>
              <div className="pc-step">
                <div className="pc-step-num">2</div>
                <h3>Get Your Script</h3>
                <p>
                  Our AI writes a clear, structured script for you in seconds. 
                  Edit it, tweak it, make it yours.
                </p>
              </div>
              <div className="pc-step">
                <div className="pc-step-num">3</div>
                <h3>Record & Share</h3>
                <p>
                  Practice on camera with your script as a guide. 
                  Download your best take and share it anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pc-features">
          <div className="pc-features-inner">
            <p className="pc-section-label">Everything You Need</p>
            <h2 className="pc-section-title">Built For Real People</h2>
            <p className="pc-section-sub">
              No marketing jargon. No complicated tools. Just you, telling your story better.
            </p>
            <div className="pc-features-grid">
              <div className="pc-feature">
                <div className="pc-feature-icon">🤖</div>
                <h3>AI Script Generator</h3>
                <p>
                  Tell us your topic and audience. Our AI creates a professional, 
                  structured script you can use right away — or customize to fit your voice.
                </p>
              </div>
              <div className="pc-feature">
                <div className="pc-feature-icon">🎥</div>
                <h3>Multi-Take Recording</h3>
                <p>
                  Record as many takes as you want. Review them side by side. 
                  Pick your best one. No pressure, no rush.
                </p>
              </div>
              <div className="pc-feature">
                <div className="pc-feature-icon">📖</div>
                <h3>Built-In Teleprompter</h3>
                <p>
                  Your script scrolls on screen while you record, so you never 
                  lose your place. Just look at the camera and speak naturally.
                </p>
              </div>
              <div className="pc-feature">
                <div className="pc-feature-icon">📤</div>
                <h3>Share Anywhere</h3>
                <p>
                  Download your video and post it to Instagram, TikTok, YouTube, 
                  or WhatsApp. We'll even tell you the best format for each platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pc-proof">
          <div className="pc-proof-inner">
            <p className="pc-section-label">Why It Matters</p>
            <p className="pc-proof-quote">
              "I used to spend hours trying to figure out what to say in my videos. 
              Now I just type my idea and start recording in minutes."
            </p>
            <p className="pc-proof-author">
              <strong>Built by presenters, for presenters</strong> — LMU Capstone 2026
            </p>
          </div>
        </section>

        <section className="pc-cta">
          <div className="pc-cta-bg">
            <div className="pc-cta-inner">
              <h2>Ready to Present Better?</h2>
              <p>
                Join entrepreneurs and business owners who are telling their stories 
                with clarity and confidence.
              </p>
              <button className="pc-cta-btn" onClick={() => navigate('/auth')}>
                Get Started — It's Free
              </button>
            </div>
          </div>
        </section>

        <footer className="pc-footer">
          <p>
            © 2026 PresentationCoach · Built with care at <a href="https://www.lmu.edu" target="_blank" rel="noreferrer">Loyola Marymount University</a>
          </p>
        </footer>
      </div>
    </>
  )
}