'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { shuffleArray, calculateScore, formatTime } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function MockTestExamPage({ params }) {
  const [testId, setTestId] = useState(null)
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [testData, setTestData] = useState(null)
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

  if (submitted) {
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct_option)

    function getAnswerText(q, key) {
      if (!key) return 'नहीं दिया'
      const map = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }
      return map[key] || key
    }

    function getCorrectText(q) {
      const map = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }
      return map[q.correct_option] || q.correct_option
    }
    const wrongAnswers = questions.filter(q => answers[q.id] && answers[q.id] !== q.correct_option)
    const skipped = questions.filter(q => !answers[q.id])
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>

          {/* Score Card */}
          <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center', boxShadow: '0 8px 25px rgba(26,60,143,0.3)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🎉</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>Test Complete!</h2>

            {testData?.negative_marking > 0 ? (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f97316' }}>
                  {(score - (wrongAnswers.length * testData.negative_marking)).toFixed(2)}/{questions.length}
                </div>
                <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.75rem' }}>
                  Net Score (Negative: -{testData.negative_marking} x {wrongAnswers.length} = -{(wrongAnswers.length * testData.negative_marking).toFixed(2)})
                </p>
                <p style={{ color: 'rgba(191,219,254,0.6)', fontSize: '0.72rem' }}>Gross: {score}/{questions.length} ({percentage}%)</p>
              </div>
            ) : (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f97316' }}>{score}/{questions.length}</div>
                <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.85rem' }}>{percentage}% Correct</p>
              </div>
            )}

            {testData?.cut_off && Object.keys(testData.cut_off).some(k => testData.cut_off[k]) && (
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem', marginTop: '0.75rem' }}>
                <p style={{ color: 'rgba(191,219,254,0.9)', fontSize: '0.72rem', fontWeight: 600, marginBottom: '8px' }}>🎯 Compare with Last Cut Off</p>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: 'none', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Poppins, sans-serif', marginBottom: '8px', outline: 'none' }}
                >
                  {Object.entries(testData.cut_off).filter(([, v]) => v).map(([cat, val]) => (
                    <option key={cat} value={cat}>{cat} — Cut Off: {val}</option>
                  ))}
                </select>
                {(() => {
                  const netScore = testData.negative_marking > 0
                    ? score - (wrongAnswers.length * testData.negative_marking)
                    : score
                  const cutOff = parseFloat(testData.cut_off[selectedCategory])
                  const passed = netScore >= cutOff
                  const diff = (cutOff - netScore).toFixed(2)
                  return (
                    <div style={{ background: passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
                      <p style={{ color: passed ? '#86efac' : '#fca5a5', fontWeight: 800, fontSize: '0.85rem' }}>
                        {passed ? '✅ Cut Off Qualify!' : '❌ Cut Off Miss!'}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', marginTop: '2px' }}>
                        Your Score: {netScore.toFixed(2)} | {selectedCategory} Cut Off: {cutOff}
                        {!passed && ' | Need ' + diff + ' more marks'}
                      </p>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>{correctAnswers.length}</div>
              <p style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>✅ सही</p>
            </div>
            <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>{wrongAnswers.length}</div>
              <p style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 600 }}>❌ गलत</p>
            </div>
            <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706' }}>{skipped.length}</div>
              <p style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 600 }}>⏭️ छोड़े</p>
            </div>
          </div>

          {/* Answer Review */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📊 उत्तर समीक्षा</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correct_option
                const isSkipped = !answers[q.id]
                return (
                  <div key={q.id} style={{ padding: '0.875rem', background: isSkipped ? '#fef3c7' : isCorrect ? '#dcfce7' : '#fee2e2', borderRadius: '10px', borderLeft: `4px solid ${isSkipped ? '#f59e0b' : isCorrect ? '#22c55e' : '#ef4444'}` }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>{i + 1}. {q.question}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem' }}>
                      <span style={{ background: 'white', padding: '3px 8px', borderRadius: '6px', color: '#475569' }}>
                        आपका: <strong>{getAnswerText(q, answers[q.id])}</strong>
                      </span>
                      <span style={{ background: '#dcfce7', padding: '3px 8px', borderRadius: '6px', color: '#166534' }}>
                        सही: <strong>{getCorrectText(q)}</strong>
                      </span>
                      {q.explanation && (
                      <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '6px', padding: '6px 8px', background: 'rgba(255,255,255,0.7)', borderRadius: '6px', lineHeight: 1.5 }}>
                        💡 {q.explanation}
                      </p>
                    )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button onClick={() => router.push('/dashboard/mock-test')} style={{ width: '100%', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem' }}>
            वापस Mock Tests पर जाओ
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
