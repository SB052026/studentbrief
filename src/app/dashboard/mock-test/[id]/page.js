'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import { shuffleArray, calculateScore, formatTime } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function MockTestExamPage({ params }) {
  const { user, loading: userLoading } = useUser()
  const [testId, setTestId] = useState(null)
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setTestId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (!testId) return
    async function fetchTest() {
      const supabase = createClient()
      const { data: testData } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('id', testId)
        .single()
      const { data: questionsData } = await supabase
        .from('mock_questions')
        .select('*')
        .eq('mock_test_id', testId)
      if (testData) {
        setTest(testData)
        setTimeLeft(testData.duration_minutes * 60)
        const shuffled = shuffleArray(questionsData || []).map(q => ({
          ...q,
          options: shuffleArray([
            { key: 'A', value: q.option_a },
            { key: 'B', value: q.option_b },
            { key: 'C', value: q.option_c },
            { key: 'D', value: q.option_d },
          ])
        }))
        setQuestions(shuffled)
      }
      setLoading(false)
    }
    fetchTest()
  }, [testId])

  useEffect(() => {
    if (submitted || timeLeft <= 0 || loading) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted, loading, timeLeft])

  function handleAnswer(questionId, optionKey) {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }))
  }

  function handleSubmit() {
    const finalScore = calculateScore(questions, answers)
    setScore(finalScore)
    setSubmitted(true)
  }

  if (loading || userLoading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, maxWidth: '500px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>Test Complete!</h2>
          <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>Tumhara score:</p>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#f97316', marginBottom: '0.5rem' }}>
            {score}/{questions.length}
          </div>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            {Math.round((score / questions.length) * 100)}% correct
          </p>
          <button onClick={() => router.push('/dashboard/mock-test')} style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Wapas Mock Tests pe jao
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem' }}>{test?.title}</h1>
          <div style={{ background: timeLeft < 60 ? '#fee2e2' : '#dbeafe', color: timeLeft < 60 ? '#991b1b' : '#1e40af', padding: '6px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
          {questions.map((q, index) => (
            <button key={q.id} onClick={() => setCurrentIndex(index)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', background: answers[q.id] ? '#22c55e' : index === currentIndex ? '#1a3c8f' : '#f1f5f9', color: answers[q.id] || index === currentIndex ? 'white' : '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Question {currentIndex + 1} of {questions.length}</p>
            <h2 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {currentQuestion.question}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {currentQuestion.options.map((option) => (
                <button key={option.key} onClick={() => handleAnswer(currentQuestion.id, option.key)} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '10px', border: `2px solid ${answers[currentQuestion.id] === option.key ? '#1a3c8f' : '#e2e8f0'}`, background: answers[currentQuestion.id] === option.key ? '#dbeafe' : 'white', color: answers[currentQuestion.id] === option.key ? '#1e40af' : '#374151', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  <span style={{ fontWeight: 800, marginRight: '8px' }}>{option.key}.</span>
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
          <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', opacity: currentIndex === 0 ? 0.5 : 1 }}>
            ← Pehla
          </button>
          <button onClick={handleSubmit} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Submit
          </button>
          <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIndex === questions.length - 1} style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', opacity: currentIndex === questions.length - 1 ? 0.5 : 1 }}>
            Agla →
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
