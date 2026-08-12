'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { shuffleArray, calculateScore, formatTime } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function MockTestExamPage({ params }) {
  const [testId, setTestId] = useState(null)
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedReview, setMarkedReview] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [testData, setTestData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [siteSettings, setSiteSettings] = useState({ logo_url: '' })
  const [showSidebar, setShowSidebar] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setTestId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    async function fetchSettings() {
      try {
        const cached = sessionStorage.getItem('sb_site_settings')
        if (cached) { setSiteSettings(prev => ({ ...prev, ...JSON.parse(cached) })); return }
        const supabase = createClient()
        const { data } = await supabase.from('site_settings').select('*')
        const obj = {}
        data?.forEach(s => { obj[s.key] = s.value })
        setSiteSettings(prev => ({ ...prev, ...obj }))
      } catch(e) {}
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    if (!testId) return
    async function fetchTest() {
      const supabase = createClient()
      const { data: testInfo } = await supabase.from('mock_tests').select('*').eq('id', testId).single()
      const { data: td } = await supabase.from('mock_tests').select('negative_marking, cut_off, total_marks').eq('id', testId).single()
      setTestData(td)
      const { data: questionsData } = await supabase.from('mock_questions').select('*').eq('mock_test_id', testId)
      if (testInfo) {
        setTest(testInfo)
        setTimeLeft(testInfo.duration_minutes * 60)
        const shuffled = shuffleArray(questionsData || []).map(q => ({
          ...q,
          options: shuffleArray([
            { key: 'A', value: q.option_a, img: q.option_a_image },
            { key: 'B', value: q.option_b, img: q.option_b_image },
            { key: 'C', value: q.option_c, img: q.option_c_image },
            { key: 'D', value: q.option_d, img: q.option_d_image },
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
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted, loading, timeLeft])

  function handleAnswer(questionId, optionKey) {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }))
  }

  function handleMarkReview() {
    setMarkedReview(prev => ({ ...prev, [questions[currentIndex].id]: !prev[questions[currentIndex].id] }))
  }

  function handleSubmit() {
    const finalScore = calculateScore(questions, answers)
    setScore(finalScore)
    setSubmitted(true)
  }

  function getQStatus(q, index) {
    if (answers[q.id] && markedReview[q.id]) return 'review-answered'
    if (markedReview[q.id]) return 'review'
    if (answers[q.id]) return 'answered'
    if (index < currentIndex) return 'skipped'
    return 'unattempted'
  }

  const answeredCount = Object.keys(answers).length
  const markedCount = Object.keys(markedReview).length
  const skippedCount = questions.filter((q, i) => !answers[q.id] && i < currentIndex).length

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f0f4ff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#1a3c8f', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>Loading exam...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct_option)
    const wrongAnswers = questions.filter(q => answers[q.id] && answers[q.id] !== q.correct_option)
    const skipped = questions.filter(q => !answers[q.id])
    const percentage = Math.round((score / questions.length) * 100)
    const marksPerQ = testData?.total_marks ? testData.total_marks / questions.length : 1
    const obtainedMarks = testData?.negative_marking > 0
      ? (score * marksPerQ) - (wrongAnswers.length * testData.negative_marking * marksPerQ)
      : score * marksPerQ
    const totalMarks = testData?.total_marks || questions.length

    function getAnswerText(q, key) {
      if (!key) return 'Not Answered'
      const map = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }
      return map[key] || key
    }
    function getCorrectText(q) {
      const map = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }
      return map[q.correct_option] || q.correct_option
    }

    return (
      <div style={{ fontFamily: 'Poppins, sans-serif', background: '#f0f4ff', minHeight: '100vh' }}>
        {/* Result Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {siteSettings.logo_url && <img src={siteSettings.logo_url} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />}
          <span style={{ fontWeight: 900, color: 'white', fontSize: '1.1rem' }}>Student<span style={{ color: '#f97316' }}>Brief</span></span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginLeft: 'auto' }}>{test?.title}</span>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem' }}>
          {/* Score Card */}
          <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center', boxShadow: '0 8px 25px rgba(26,60,143,0.3)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🎉</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Test Complete!</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f97316' }}>{score}/{questions.length}</div>
                <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.75rem' }}>Questions Correct</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f97316' }}>{Math.round(obtainedMarks)}/{totalMarks}</div>
                <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.75rem' }}>Marks Obtained</p>
              </div>
            </div>

            {testData?.cut_off && Object.keys(testData.cut_off).some(k => testData.cut_off[k]) && (
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem', marginTop: '0.75rem' }}>
                <p style={{ color: 'rgba(191,219,254,0.9)', fontSize: '0.72rem', fontWeight: 600, marginBottom: '8px' }}>🎯 Compare with Last Cut Off</p>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: 'none', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Poppins, sans-serif', marginBottom: '8px', outline: 'none' }}>
                  {Object.entries(testData.cut_off).filter(([, v]) => v).map(([cat, val]) => (
                    <option key={cat} value={cat}>{cat} — Cut Off: {val}</option>
                  ))}
                </select>
                {(() => {
                  const netScore = Math.round(obtainedMarks)
                  const cutOff = parseFloat(testData.cut_off[selectedCategory])
                  const passed = netScore >= cutOff
                  const diff = (cutOff - netScore).toFixed(0)
                  return (
                    <div style={{ background: passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
                      <p style={{ color: passed ? '#86efac' : '#fca5a5', fontWeight: 800, fontSize: '0.85rem' }}>
                        {passed ? '✅ Cut Off Qualify!' : '❌ Cut Off Miss!'}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', marginTop: '2px' }}>
                        Your Marks: {netScore} | {selectedCategory} Cut Off: {cutOff}
                        {!passed && ' | Need ' + diff + ' more marks'}
                      </p>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>{correctAnswers.length}</div>
              <p style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>✅ Correct</p>
            </div>
            <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>{wrongAnswers.length}</div>
              <p style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 600 }}>❌ Wrong</p>
            </div>
            <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706' }}>{skipped.length}</div>
              <p style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 600 }}>⏭️ Skipped</p>
            </div>
          </div>

          {/* Answer Review */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📊 Answer Review</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correct_option
                const isSkipped = !answers[q.id]
                return (
                  <div key={q.id} style={{ padding: '0.875rem', background: isSkipped ? '#fef3c7' : isCorrect ? '#dcfce7' : '#fee2e2', borderRadius: '10px', borderLeft: `4px solid ${isSkipped ? '#f59e0b' : isCorrect ? '#22c55e' : '#ef4444'}` }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>{i + 1}. {q.question}</p>
                    {q.question_image && <img src={q.question_image} alt="Q" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain', borderRadius: '8px', marginBottom: '8px' }} />}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 8px', borderRadius: '6px' }}>
                        <span style={{ color: '#475569' }}>Your Answer: <strong>{getAnswerText(q, answers[q.id])}</strong></span>
                        {answers[q.id] && q[`option_${answers[q.id].toLowerCase()}_image`] && <img src={q[`option_${answers[q.id].toLowerCase()}_image`]} alt="ans" style={{ width: '32px', height: '24px', objectFit: 'contain', borderRadius: '4px' }} />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>
                        <span style={{ color: '#166534' }}>Correct: <strong>{getCorrectText(q)}</strong></span>
                        {q[`option_${q.correct_option.toLowerCase()}_image`] && <img src={q[`option_${q.correct_option.toLowerCase()}_image`]} alt="correct" style={{ width: '32px', height: '24px', objectFit: 'contain', borderRadius: '4px' }} />}
                      </div>
                      {q.explanation && (
                        <div style={{ background: 'rgba(255,255,255,0.8)', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #f97316' }}>
                          <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.5 }}>💡 {q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button onClick={() => router.push('/dashboard/mock-test')} style={{ width: '100%', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem' }}>
            ← Back to Mock Tests
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: '#f0f4ff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* TOP HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', padding: '0 16px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Left - Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {siteSettings.logo_url
            ? <img src={siteSettings.logo_url} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.3)' }} />
            : <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '0.8rem' }}>SB</div>
          }
          <span style={{ fontWeight: 900, color: 'white', fontSize: '0.9rem', display: 'none' }} className="desktop-only">Student<span style={{ color: '#f97316' }}>Brief</span></span>
        </div>

        {/* Center - Exam Title */}
        <div style={{ textAlign: 'center', flex: 1, padding: '0 12px' }}>
          <p style={{ color: 'white', fontWeight: 800, fontSize: '0.82rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{test?.title}</p>
          <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.62rem' }}>Q {currentIndex + 1}/{questions.length}</p>
        </div>

        {/* Right - Timer + Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: timeLeft < 300 ? '#ef4444' : timeLeft < 600 ? '#f97316' : 'rgba(255,255,255,0.15)', color: 'white', padding: '5px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.2)', minWidth: '70px', textAlign: 'center' }}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <button onClick={() => setShowSidebar(!showSidebar)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* SIDEBAR - Question Panel */}
        <div style={{
          width: showSidebar ? '260px' : '0',
          minWidth: showSidebar ? '260px' : '0',
          background: 'white',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          position: 'fixed',
          top: '52px',
          left: 0,
          bottom: 0,
          zIndex: 99,
          overflowY: 'auto',
        }}>
          <div style={{ padding: '16px' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '16px' }}>
              <div style={{ background: '#dcfce7', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a' }}>{answeredCount}</div>
                <p style={{ fontSize: '0.55rem', color: '#166534', fontWeight: 600 }}>Answered</p>
              </div>
              <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#dc2626' }}>{questions.length - answeredCount}</div>
                <p style={{ fontSize: '0.55rem', color: '#991b1b', fontWeight: 600 }}>Not Answered</p>
              </div>
              <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d97706' }}>{skippedCount}</div>
                <p style={{ fontSize: '0.55rem', color: '#92400e', fontWeight: 600 }}>Skipped</p>
              </div>
              <div style={{ background: '#ede9fe', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7c3aed' }}>{markedCount}</div>
                <p style={{ fontSize: '0.55rem', color: '#5b21b6', fontWeight: 600 }}>Marked</p>
              </div>
            </div>

            {/* Legend */}
            <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { color: '#22c55e', label: 'Answered' },
                { color: '#ef4444', label: 'Skipped' },
                { color: '#7c3aed', label: 'Marked' },
                { color: '#e2e8f0', label: 'Not Visited' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }}></div>
                  <span style={{ fontSize: '0.55rem', color: '#64748b' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Question Numbers */}
            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1a3c8f', marginBottom: '8px' }}>Questions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {questions.map((q, index) => {
                const status = getQStatus(q, index)
                const colors = {
                  'answered': { bg: '#22c55e', color: 'white' },
                  'review': { bg: '#7c3aed', color: 'white' },
                  'review-answered': { bg: '#7c3aed', color: 'white' },
                  'skipped': { bg: '#ef4444', color: 'white' },
                  'unattempted': { bg: '#f1f5f9', color: '#64748b' },
                }
                const c = colors[status]
                return (
                  <button key={q.id} onClick={() => { setCurrentIndex(index); setShowSidebar(false) }} style={{ width: '32px', height: '32px', borderRadius: '6px', border: index === currentIndex ? '2px solid #1a3c8f' : 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem', background: c.bg, color: c.color, fontFamily: 'Poppins, sans-serif' }}>
                    {index + 1}
                  </button>
                )
              })}
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} style={{ width: '100%', marginTop: '16px', padding: '10px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem' }}>
              Submit Test
            </button>
          </div>
        </div>

        {/* Overlay for sidebar */}
        {showSidebar && <div onClick={() => setShowSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 98, top: '52px' }} />}

        {/* MAIN QUESTION AREA */}
        <div style={{ flex: 1, padding: '16px', maxWidth: '800px', margin: '0 auto', width: '100%', position: 'relative' }}>

          {/* Watermark */}
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, opacity: 0.04, pointerEvents: 'none', userSelect: 'none' }}>
            {(test?.logo_url || siteSettings.logo_url)
              ? <img src={test?.logo_url || siteSettings.logo_url} alt="" style={{ width: '280px', height: '280px', objectFit: 'contain' }} />
              : <div style={{ fontSize: '5rem', fontWeight: 900, color: '#1a3c8f', whiteSpace: 'nowrap' }}>StudentBrief</div>
            }
          </div>

          {currentQuestion && (
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Question Card */}
              <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>Q. {currentIndex + 1}</span>
                  {markedReview[currentQuestion.id] && <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '3px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700 }}>🚩 Marked</span>}
                </div>
                <h2 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '12px' }}>{currentQuestion.question}</h2>
                {currentQuestion.question_image && <img src={currentQuestion.question_image} alt="Question" style={{ width: '100%', maxHeight: '120px', objectFit: 'contain', borderRadius: '10px', marginBottom: '12px', background: '#f8fafc' }} />}

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentQuestion.options.map((option) => (
                    <button key={option.key} onClick={() => handleAnswer(currentQuestion.id, option.key)} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: '10px', border: `2px solid ${answers[currentQuestion.id] === option.key ? '#1a3c8f' : '#e2e8f0'}`, background: answers[currentQuestion.id] === option.key ? '#dbeafe' : 'white', color: answers[currentQuestion.id] === option.key ? '#1e40af' : '#374151', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: answers[currentQuestion.id] === option.key ? '#1a3c8f' : '#f1f5f9', color: answers[currentQuestion.id] === option.key ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>{option.key}</span>
                      <span style={{ flex: 1 }}>{option.value}</span>
                      {option.img && <img src={option.img} alt={option.key} style={{ width: '36px', height: '28px', objectFit: 'contain', borderRadius: '4px' }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} style={{ flex: 1, minWidth: '80px', padding: '10px', background: 'white', color: '#1a3c8f', border: '2px solid #1a3c8f', borderRadius: '10px', fontWeight: 700, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', opacity: currentIndex === 0 ? 0.4 : 1 }}>
                  ← Previous
                </button>
                <button onClick={handleMarkReview} style={{ flex: 1, minWidth: '120px', padding: '10px', background: markedReview[currentQuestion.id] ? '#7c3aed' : 'white', color: markedReview[currentQuestion.id] ? 'white' : '#7c3aed', border: '2px solid #7c3aed', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>
                  🚩 {markedReview[currentQuestion.id] ? 'Unmark' : 'Mark Review'}
                </button>
                {currentIndex === questions.length - 1 ? (
                  <button onClick={handleSubmit} style={{ flex: 1, minWidth: '100px', padding: '10px', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>
                    Submit ✓
                  </button>
                ) : (
                  <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} style={{ flex: 1, minWidth: '100px', padding: '10px', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>
                    Save & Next →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
