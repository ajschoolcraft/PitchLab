import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const styles = {
    landing: {
      width: '100%',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    
    // Hero Section
    hero: {
      background: 'linear-gradient(135deg, #FF9500 0%, #FF7A00 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    heroContent: {
      maxWidth: '550px',
      zIndex: 2,
    },
    heroTitle: {
      fontSize: '42px',
      fontWeight: '700',
      marginBottom: '16px',
      lineHeight: '1.3',
      letterSpacing: '-0.5px',
    },
    heroSubtitle: {
      fontSize: '18px',
      lineHeight: '1.7',
      marginBottom: '32px',
      opacity: '0.95',
      fontWeight: '400',
    },
    heroEmoji: {
      fontSize: '80px',
      marginBottom: '20px',
      display: 'block',
    },
    
    // Button Styles
    btnPrimary: {
      backgroundColor: 'white',
      color: '#FF9500',
      border: 'none',
      padding: '16px 40px',
      fontSize: '18px',
      fontWeight: '700',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '56px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    
    // Features Section
    features: {
      padding: '80px 20px',
      backgroundColor: '#f9f9f9',
    },
    featuresContainer: {
      maxWidth: '1100px',
      margin: '0 auto',
    },
    featuresTitle: {
      fontSize: '36px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '20px',
      color: '#1f2937',
    },
    featuresSubtitle: {
      fontSize: '16px',
      textAlign: 'center',
      color: '#6b7280',
      marginBottom: '60px',
      maxWidth: '600px',
      margin: '0 auto 60px',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
    },
    featureCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '40px 24px',
      textAlign: 'center',
      border: '2px solid #f0f0f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    featureIcon: {
      fontSize: '56px',
      marginBottom: '20px',
      display: 'block',
    },
    featureCardTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '12px',
    },
    featureCardText: {
      fontSize: '15px',
      color: '#6b7280',
      lineHeight: '1.7',
      margin: '0',
    },
    
    // How It Works Section
    howitworks: {
      padding: '80px 20px',
      backgroundColor: 'white',
    },
    howitworksContainer: {
      maxWidth: '1100px',
      margin: '0 auto',
    },
    howitworksTitle: {
      fontSize: '36px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '60px',
      color: '#1f2937',
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
      marginBottom: '40px',
    },
    step: {
      textAlign: 'center',
      position: 'relative',
    },
    stepNumber: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#FF9500',
      color: 'white',
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '16px',
    },
    stepTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
    },
    stepText: {
      fontSize: '15px',
      color: '#6b7280',
      lineHeight: '1.6',
    },
    
    // CTA Section
    cta: {
      background: 'linear-gradient(135deg, #FF9500 0%, #FF7A00 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
    },
    ctaContainer: {
      maxWidth: '700px',
      margin: '0 auto',
    },
    ctaTitle: {
      fontSize: '40px',
      fontWeight: '700',
      marginBottom: '16px',
    },
    ctaText: {
      fontSize: '18px',
      marginBottom: '32px',
      opacity: '0.95',
      lineHeight: '1.6',
    },
    ctaButton: {
      backgroundColor: 'white',
      color: '#FF9500',
      border: 'none',
      padding: '16px 48px',
      fontSize: '18px',
      fontWeight: '700',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '56px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    
    // Footer
    footer: {
      backgroundColor: '#1f2937',
      color: '#9ca3af',
      padding: '40px 20px',
      textAlign: 'center',
      fontSize: '14px',
    },
    footerText: {
      margin: '0',
      maxWidth: '1100px',
      margin: '0 auto',
    },
  }

  return (
    <div style={styles.landing}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroEmoji}>🎤</span>
          <h1 style={styles.heroTitle}>
            Your AI Presentation Coach
          </h1>
          <p style={styles.heroSubtitle}>
            Record your story. Get instant feedback. Present with confidence.
          </p>
          <button 
            style={styles.btnPrimary}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onClick={() => navigate('/auth')}
          >
            Let's Get Started →
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresContainer}>
          <h2 style={styles.featuresTitle}>Why You'll Love It</h2>
          <p style={styles.featuresSubtitle}>
            Everything you need in one simple place
          </p>
          
          <div style={styles.featuresGrid}>
            <div 
              style={styles.featureCard}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#FF9500'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 149, 0, 0.15)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={styles.featureIcon}>📝</span>
              <h3 style={styles.featureCardTitle}>AI Writes Your Script</h3>
              <p style={styles.featureCardText}>
                Just tell us your idea. Our AI generates a clear, structured script in seconds.
              </p>
            </div>

            <div 
              style={styles.featureCard}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#FF9500'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 149, 0, 0.15)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={styles.featureIcon}>🎥</span>
              <h3 style={styles.featureCardTitle}>Record Right Here</h3>
              <p style={styles.featureCardText}>
                Use your phone or computer. Record as many takes as you want. Pick the best one.
              </p>
            </div>

            <div 
              style={styles.featureCard}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#FF9500'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 149, 0, 0.15)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={styles.featureIcon}>✨</span>
              <h3 style={styles.featureCardTitle}>Get Better Each Time</h3>
              <p style={styles.featureCardText}>
                Review your recordings. Learn what works. Present with more confidence next time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howitworks}>
        <div style={styles.howitworksContainer}>
          <h2 style={styles.howitworksTitle}>How It Works</h2>
          
          <div style={styles.stepsGrid}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Create Your Script</h3>
              <p style={styles.stepText}>
                Tell us what you want to say. Get a professional script back.
              </p>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Record Your Video</h3>
              <p style={styles.stepText}>
                Hit record and present. Try as many times as you need.
              </p>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Share Your Best</h3>
              <p style={styles.stepText}>
                Download and share to any platform. Ready to go live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Present Better?</h2>
          <p style={styles.ctaText}>
            Join entrepreneurs, job seekers, and presenters who are gaining confidence every day.
          </p>
          <button 
            style={styles.ctaButton}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onClick={() => navigate('/auth')}
          >
            Start Free Today →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2026 Presentation Coach. Built to help you share your story with confidence.
        </p>
      </footer>
    </div>
  )
}