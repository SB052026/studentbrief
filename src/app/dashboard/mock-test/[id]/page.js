'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/UserProvider'
import { useSubscription } from '@/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'
import { shuffleArray, calculateScore, formatTime } from '@/lib/utils'
import Loader from '@/components/ui/Loader'
import { useRouter } from 'next/navigation'

export default function MockTestExamPage({ params }) {
  const { dbUser, loading: userLoading } = useUser()
  const { hasAccess, loading: subLoading } = useSubscription(dbUser)
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [testId, setTestId] = useState(null)
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

  if (userLoading || subLoading || loading) return <Loader />

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">Subscription Required</h2>
        <button onClick={() => router.push('/dashboard')} className="bg-orange-500 text-white px-6 py-3 rounded-lg">
          Dashboard pe jao
        </button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-6 block">🎉</span>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Test Complete!</h2>
        <p className="text-gray-500 mb-6">Tumhara score:</p>
        <div className="text-5xl font-bold text-orange-500 mb-2">
          {score}/{questions.length}
        </div>
        <p className="text-gray-500 mb-8">
          {Math.round((score / questions.length) * 100)}% correct
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => router.push('/dashboard/mock-test')}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
          >
            Wapas Mock Tests pe jao
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-blue-900 text-lg">{test?.title}</h1>
        <div className={`font-bold text-lg px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-800'}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
              answers[q.id]
                ? 'bg-green-500 text-white'
                : index === currentIndex
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {currentQuestion && (
        <div className="card mb-6">
          <p className="text-sm text-gray-500 mb-2">Question {currentIndex + 1} of {questions.length}</p>
          <h2 className="font-semibold text-gray-800 mb-6 text-lg leading-relaxed">
            {currentQuestion.question}
          </h2>
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(currentQuestion.id, option.key)}
                className={`text-left px-4 py-3 rounded-lg border-2 transition font-medium text-sm ${
                  answers[currentQuestion.id] === option.key
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-blue-300 text-gray-700'
                }`}
              >
                <span className="font-bold mr-2">{option.key}.</span>
                {option.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50 transition"
        >
          ← Pehla
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition"
        >
          Submit Karo
        </button>
        <button
          onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50 transition"
        >
          Agla →
        </button>
      </div>
    </div>
  )
}
