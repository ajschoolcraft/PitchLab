import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../context/AuthContext'
import '../styles/script-generator.css'

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

  // Fetch questions from Supabase
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('order_num', { ascending: true })

      if (error) {
        console.error('Error fetching questions:', error)
        return
      }

      // Format for use in component
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
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (loadingQuestions) {
    return (
      <div className="scriptgen">
        <div className="scriptgen-content">
          <div className="scriptgen-loading">
            <div className="spinner"></div>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="scriptgen">
        <div className="scriptgen-content">
          <div className="error-box">
            <p>No questions found. Please create the questions table in Supabase.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scriptgen">
      <div className="scriptgen-content">
        {/* Header */}
        <div className="scriptgen-header">
          <h1 className="scriptgen-title">Create Your Pitch Script</h1>
          <p className="scriptgen-subtitle">
            Answer these questions thoughtfully - they'll help us create an authentic pitch
          </p>
        </div>

        {/* Progress Bar */}
        <div className="scriptgen-progress-bar">
          <div className="scriptgen-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="scriptgen-progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </p>

        {/* Question Card */}
        {!script && (
          <div className="scriptgen-card">
            <h2 className="scriptgen-question">{currentQ.text}</h2>

            <textarea
              className="scriptgen-textarea"
              value={answers[currentQ.id]}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder={currentQ.placeholder}
              rows={6}
            />

            {/* Navigation Buttons */}
            <div className="scriptgen-buttons">
              {currentQuestion > 0 && (
                <button onClick={handleBack} className="btn-secondary">
                  ← Back
                </button>
              )}

              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary"
                  disabled={!answers[currentQ.id].trim()}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleGenerateScript}
                  className="btn-primary"
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
          <div className="scriptgen-loading">
            <div className="spinner" />
            <p>Crafting your authentic pitch...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}

        {/* Generated Script */}
        {script && !loading && (
          <div className="scriptgen-card">
            <h2 className="scriptgen-success-title">Your Script Is Ready! 🎉</h2>
            <div className="scriptgen-script-box">
              <pre className="scriptgen-script-text">{script}</pre>
            </div>

            <div className="scriptgen-buttons">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(script)
                  alert('Script copied to clipboard!')
                }}
                className="btn-secondary"
              >
                📋 Copy Script
              </button>
              <button
                onClick={() => navigate('/record', { state: { script: savedScript || { script_text: script } } })}
                className="btn-primary"
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
