'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { shuffleArray, calculateScore, formatTime } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function PypPracticePage({ params }) {
  const [pypId, setPypId] = useState(null)
  const [paper, setPaper] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(1800)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const resolvedParams = await params
      setPypId(resolvedParams.id)
      const supabase = createClient()
      const { data: paperData } = await supabase
        .from('pyp')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()
      const { data: questionsData } = await supabase
        .from('pyp_questions')
        .select('*')
        .eq('pyp_id', resolvedParams.id)
      setPaper(paperData)
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
      setLoading(false)
    }
    load()
  }, [params])



  useEffect(() => {
    if (submitted || loading) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted, loading])

  function getAnswerText(q, key) {
    if (!key) return 'नहीं दिया'
    const map = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }
    return map[key] || key
  }

  function getCorrectText(q) {
    const map = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }
    return map[q.correct_option] || q.correct_option
  }

  function handleAnswer(questionId, optionKey) {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }))
  }

  function handleSubmit() {
    const finalScore = calculateScore(questions, answers)
    setScore(finalScore)
    setSubmitted(true)
  }

  if (loading) {
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

  if (questions.length === 0) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, maxWidth: '500px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📄</span>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Questions abhi available nahi hain</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Is paper ke questions jald add honge</p>
          <button onClick={() => router.push('/dashboard/pyp')} style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            वापस जाओ
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>Practice Complete!</h2>
            <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>{paper?.exam_name}</p>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#f97316', marginBottom: '0.5rem' }}>
              {score}/{questions.length}
            </div>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {Math.round((score / questions.length) * 100)}% Correct
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📊 Answer Review</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q, i) => (
                <div key={q.id} style={{ padding: '0.75rem', background: answers[q.id] === q.correct_option ? '#dcfce7' : '#fee2e2', borderRadius: '10px', borderLeft: `4px solid ${answers[q.id] === q.correct_option ? '#22c55e' : '#ef4444'}` }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{i + 1}. {q.question}</p>
                  <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '4px' }}>
                    Your Answer: <span style={{ fontWeight: 700 }}>{getAnswerText(q, answers[q.id])}</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#16a34a', marginBottom: '4px' }}>
                    Correct Answer: <span style={{ fontWeight: 700 }}>{getCorrectText(q)}</span>
                  </p>
                  {q.explanation && (
                    <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '6px', padding: '6px 8px', background: 'rgba(255,255,255,0.7)', borderRadius: '6px', lineHeight: 1.5 }}>
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => router.push('/dashboard/pyp')} style={{ width: '100%', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem' }}>
            Back to PYP
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="page-wrapper" >
      <Navbar />

      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem' }}>{paper?.exam_name}</h1>
            <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{paper?.year}</p>
          </div>
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
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>प्रश्न {currentIndex + 1} / {questions.length}</p>
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
            ← पिछला
          </button>
          <button onClick={handleSubmit} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            Submit
          </button>
          <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIndex === questions.length - 1} style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', opacity: currentIndex === questions.length - 1 ? 0.5 : 1 }}>
            अगला →
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
