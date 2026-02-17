import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const styles = {
    landing: {
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    hero: {
      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroContent: {
      maxWidth: '500px',
    },
    heroTitle: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '16px',
      lineHeight: '1.2',
    },
    heroSubtitle: {
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '32px',
      opacity: '0.95',
      fontWeight: '400',
    },
    btnPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '14px 32px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '44px',
      minWidth: '200px',
    },
    features: {
      padding: '60px 20px',
      backgroundColor: 'white',
    },
    featuresTitle: {
      fontSize: '24px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '40px',
      color: '#1f2937',
    },
    featureCard: {
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      textAlign: 'center',
      border: '1px solid #e2e8f0',
    },
    featureIcon: {
      fontSize: '40px',
      marginBottom: '16px',
    },
    featureCardH3: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '12px',
      margin: '0 0 12px 0',
    },
    featureCardP: {
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: '1.6',
      margin: '0',
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
    },
    ctaH2: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '24px',
    },
    footer: {
      backgroundColor: '#111827',
      color: '#9ca3af',
      padding: '32px 20px',
      textAlign: 'center',
      fontSize: '14px',
    },
    footerP: {
      margin: '0',
    },
  }

  return (
    <div style={styles.landing}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Presentation Coach</h1>
          <p style={styles.heroSubtitle}>
            Record your presentation. Get AI-powered feedback. Present with confidence.
          </p>
          <button 
            style={styles.btnPrimary}
            onClick={() => navigate('/auth')}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>How It Works</h2>
        
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🎥</div>
          <h3 style={styles.featureCardH3}>Record</h3>
          <p style={styles.featureCardP}>Simply press record and present. We capture everything.</p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🧠</div>
          <h3 style={styles.featureCardH3}>Analyze</h3>
          <p style={styles.featureCardP}>AI analyzes your pacing, engagement, and clarity in real-time.</p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📈</div>
          <h3 style={styles.featureCardH3}>Improve</h3>
          <p style={styles.featureCardP}>Get actionable feedback and watch yourself improve with each practice.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaH2}>Ready to Present Better?</h2>
        <button 
          style={styles.btnPrimary}
          onClick={() => navigate('/auth')}
        >
          Start Free
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerP}>&copy; 2026 Presentation Coach. All rights reserved.</p>
      </footer>
    </div>
  )
}