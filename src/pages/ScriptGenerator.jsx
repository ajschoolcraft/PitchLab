import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../context/AuthContext'

export default function ScriptGeneratorV2() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '',
    q7: '', q8: '', q9: '', q10: '', q11: ''
  })
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // The 11 stakeholder questions
  const questions = [
    {
      id: 'q1',
      text: 'What belief quietly drives the way you approach this work?',
      placeholder: 'Example: I believe everyone deserves access to quality education, regardless of income'
    },
    {
      id: 'q2',
      text: 'Where did that belief come from?',
      placeholder: 'Example: Growing up, I watched my mother struggle to afford tutoring for my siblings'
    },
    {
      id: 'q3',
      text: 'What standard do you hold, even when it\'s inconvenient?',
      placeholder: 'Example: I never use generic templates - every lesson is customized'
    },
    {
      id: 'q4',
      text: 'Where are you currently not honoring that standard?',
      placeholder: 'Example: Sometimes I reuse materials when I\'m rushed, but it bothers me'
    },
    {
      id: 'q5',
      text: 'What experiences uniquely shaped how you understand this problem?',
      placeholder: 'Example: Years as a teacher showed me how one-size-fits-all fails most students'
    },
    {
      id: 'q6',
      text: 'Why does solving this problem matter more than it first appears?',
      placeholder: 'Example: Education gaps compound - small differences in 3rd grade become massive by high school'
    },
    {
      id: 'q7',
      text: 'What happens if it remains unsolved?',
      placeholder: 'Example: Another generation of kids falls through the cracks'
    },
    {
      id: 'q8',
      text: 'What specifically changes for your client?',
      placeholder: 'Example: Students go from struggling to confident in 6 weeks'
    },
    {
      id: 'q9',
      text: 'What evidence supports that?',
      placeholder: 'Example: 85% of our students improve by 2+ grade levels in one semester'
    },
    {
      id: 'q10',
      text: 'What are you currently over-explaining instead of simplifying?',
      placeholder: 'Example: I talk too much about my teaching methodology instead of the results'
    },
    {
      id: 'q11',
      text: 'Where does your current messaging understate how you actually operate?',
      placeholder: 'Example: We don\'t mention that we follow up with families for 3 months after'
    }
  ]

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleGenerateScript = async () => {
    setLoading(true)
    setError('')

    try {
      // Call the API to generate script
      const response = await fetch('https://ai-presentation-coach.vercel.app/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) {
        throw new Error('Failed to generate script')
      }

      const data = await response.json()
      setScript(data.script)

      // Save to Supabase
      const { error: dbError } = await supabase
        .from('scripts')
        .insert({
          user_id: user.id,
          title: `Pitch Script - ${new Date().toLocaleDateString()}`,
          script_text: data.script,
          user_answers: answers,
          status: 'draft'
        })

      if (dbError) throw dbError

    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Create Your Pitch Script</h1>
          <p style={styles.subtitle}>
            Answer these questions thoughtfully - they'll help us create an authentic pitch
          </p>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </p>

        {/* Question Card */}
        {!script && (
          <div style={styles.card}>
            <h2 style={styles.questionText}>{currentQ.text}</h2>
            
            <textarea
              value={answers[currentQ.id]}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder={currentQ.placeholder}
              style={styles.textarea}
              rows={6}
            />

            {/* Navigation Buttons */}
            <div style={styles.buttonRow}>
              {currentQuestion > 0 && (
                <button onClick={handleBack} style={styles.buttonSecondary}>
                  ← Back
                </button>
              )}
              
              {currentQuestion < questions.length - 1 ? (
                <button 
                  onClick={handleNext} 
                  style={styles.buttonPrimary}
                  disabled={!answers[currentQ.id].trim()}
                >
                  Next →
                </button>
              ) : (
                <button 
                  onClick={handleGenerateScript} 
                  style={styles.buttonPrimary}
                  disabled={!answers[currentQ.id].trim() || loading}
                >
                  {loading ? 'Generating...' : '✨ Generate My Script'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <p>Crafting your authentic pitch...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* Generated Script */}
        {script && !loading && (
          <div style={styles.card}>
            <h2 style={styles.successTitle}>Your Script Is Ready! 🎉</h2>
            <div style={styles.scriptBox}>
              <pre style={styles.scriptText}>{script}</pre>
            </div>
            
            <div style={styles.buttonRow}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(script)
                  alert('Script copied to clipboard!')
                }}
                style={styles.buttonSecondary}
              >
                📋 Copy Script
              </button>
              <button 
                onClick={() => navigate('/record')}
                style={styles.buttonPrimary}
              >
                🎥 Record This Script
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '40px 20px',
  },
  content: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '100px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  questionText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '20px',
    lineHeight: '1.4',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontFamily: 'inherit',
    resize: 'vertical',
    marginBottom: '24px',
    transition: 'border-color 0.2s',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  buttonPrimary: {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonSecondary: {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '12px',
    marginTop: '16px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '20px',
    textAlign: 'center',
  },
  scriptBox: {
    backgroundColor: '#1a1a1a',
    color: '#e5e7eb',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  scriptText: {
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
}