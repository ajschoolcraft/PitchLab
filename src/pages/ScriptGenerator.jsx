import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../context/AuthContext'

export default function ScriptGenerator() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '',
    q7: '', q8: '', q9: '', q10: '', q11: ''
  })
  const [script, setScript] = useState('')
  const [savedScript, setSavedScript] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('order_num', { ascending: true })
      if (error) { console.error('Error fetching questions:', error); return }
      const formattedQuestions = data.map(q => ({
        id: q.question_id,
        text: q.question_text,
        placeholder: q.example_text
      }))
      setQuestions(formattedQuestions)
      setLoadingQuestions(false)
    }
    fetchQuestions()
  }, [])

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1)
  }

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1)
  }

  const handleGenerateScript = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })
      if (!response.ok) throw new Error('Failed to generate script')
      const data = await response.json()
      setScript(data.script)
      const { data: dbData, error: dbError } = await supabase
        .from('scripts')
        .insert({
          user_id: user.id,
          title: `Pitch Script - ${new Date().toLocaleDateString()}`,
          script_text: data.script,
          user_answers: answers,
          status: 'draft'
        })
        .select()
      if (dbError) throw dbError
      if (dbData?.[0]) setSavedScript(dbData[0])
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentQ = questions[currentQuestion]
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0

  if (loadingQuestions) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loading}>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.error}>
            <p>No questions found. Please create the questions table in Supabase.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Your Pitch Script</h1>
          <p style={styles.subtitle}>
            Answer these questions thoughtfully - they'll help us create an authentic pitch
          </p>
        </div>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </p>

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
            <div style={styles.buttonRow}>
              {currentQuestion > 0 && (
                <button onClick={handleBack} style={styles.buttonSecondary}>← Back</button>
              )}
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  style={styles.buttonPrimary}
                  disabled={!answers[currentQ.id]?.trim()}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleGenerateScript}
                  style={styles.buttonPrimary}
                  disabled={!answers[currentQ.id]?.trim() || loading}
                >
                  {loading ? 'Generating...' : '✨ Generate My Script'}
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div style={styles.loading}>
            <p>Crafting your authentic pitch...</p>
          </div>
        )}

        {error && (
          <div style={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {script && !loading && (
          <div style={styles.card}>
            <h2 style={styles.successTitle}>Your Script Is Ready! 🎉</h2>
            <div style={styles.scriptBox}>
              <pre style={styles.scriptText}>{script}</pre>
            </div>
            <div style={styles.buttonRow}>
              <button
                onClick={() => navigator.clipboard.writeText(script)}
                style={styles.buttonSecondary}
              >
                📋 Copy Script
              </button>
              <button
                onClick={() => navigate('/record', { state: { script: savedScript || { script_text: script } } })}
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
  container: { minHeight: '100vh', backgroundColor: '#FAFAFA', padding: '40px 20px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  content: { maxWidth: '700px', margin: '0 auto' },
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#6b7280' },
  progressBar: { width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '100px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { height: '100%', backgroundColor: '#FF9500', transition: 'width 0.3s ease' },
  progressText: { fontSize: '14px', color: '#6b7280', marginBottom: '24px', textAlign: 'center' },
  card: { backgroundColor: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #f0f0f0' },
  questionText: { fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginBottom: '20px', lineHeight: '1.4' },
  textarea: { width: '100%', padding: '16px', fontSize: '16px', border: '2px solid #e5e7eb', borderRadius: '12px', fontFamily: 'inherit', resize: 'vertical', marginBottom: '24px', display: 'block', transition: 'border-color 0.2s', boxSizing: 'border-box' },
  buttonRow: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  buttonPrimary: { padding: '14px 28px', fontSize: '16px', fontWeight: '600', color: 'white', background: 'linear-gradient(135deg, #FF9500, #FF6B00)', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  buttonSecondary: { padding: '14px 28px', fontSize: '16px', fontWeight: '600', color: '#6b7280', backgroundColor: 'white', border: '2px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '40px' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '12px', marginTop: '16px' },
  successTitle: { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px', textAlign: 'center' },
  scriptBox: { backgroundColor: '#1a1a1a', color: '#e5e7eb', padding: '24px', borderRadius: '12px', marginBottom: '24px', maxHeight: '400px', overflowY: 'auto' },
  scriptText: { fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 },
}