import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ScriptGenerator() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [duration, setDuration] = useState('2')
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      alert('Please enter a presentation topic')
      return
    }

    setLoading(true)
    try {
      // TODO: Replace with actual AI API call
      // For now, generate a placeholder script
      const generatedScript = `
PRESENTATION SCRIPT: ${topic}

[OPENING - 15 seconds]
Hello, my name is [Your Name]. Today, I want to talk about ${topic}.

[MAIN POINT 1 - 30 seconds]
First, it's important to understand that ${topic} is relevant because...

[MAIN POINT 2 - 30 seconds]
Second, we should consider how ${topic} affects us...

[MAIN POINT 3 - 30 seconds]
Finally, the key takeaway about ${topic} is...

[CLOSING - 15 seconds]
Thank you for listening. Remember, ${topic} matters because it impacts all of us.
      `.trim()

      setScript(generatedScript)
    } catch (error) {
      alert('Error generating script')
      console.error(error)
    }
    setLoading(false)
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '40px 20px',
    },
    maxWidth: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '40px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '24px',
      border: '1px solid #e2e8f0',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      boxSizing: 'border-box',
      fontFamily: 'monospace',
      minHeight: '200px',
      resize: 'vertical',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      flex: 1,
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#e5e7eb',
      color: '#1f2937',
    },
    scriptOutput: {
      backgroundColor: '#f3f4f6',
      padding: '20px',
      borderRadius: '8px',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.6',
      color: '#374151',
      fontSize: '14px',
    },
    loadingText: {
      textAlign: 'center',
      color: '#6b7280',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>Generate Your Script</h1>
          <p style={styles.subtitle}>Tell us about your presentation, and we'll generate a structured script for you.</p>
        </div>

        <div style={styles.section}>
          <div style={styles.formGroup}>
            <label style={styles.label}>What's your presentation about?</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g., My startup idea, Why I love coffee, How to learn coding"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Who's your audience?</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g., Investors, Students, Friends"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>How long? (minutes)</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleGenerateScript}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Script'}
            </button>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </div>

        {script && (
          <div style={styles.section}>
            <h2 style={{ ...styles.title, fontSize: '24px', marginBottom: '16px' }}>Your Script</h2>
            <div style={styles.scriptOutput}>
              {script}
            </div>
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.primaryButton, marginTop: '16px' }}
                onClick={() => {
                  // TODO: Save script to database
                  alert('Script saved! (TODO: implement database save)')
                  navigate('/dashboard')
                }}
              >
                Save Script
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}