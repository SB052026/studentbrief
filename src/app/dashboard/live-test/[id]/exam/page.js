'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import { shuffleArray, formatTime } from '@/lib/utils'
import Loader from '@/components/ui/Loader'
import { useRouter } from 'next/navigation'

export default function LiveTestExamPage({ params }) {
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
  const [hasPaid, setHasPaid] = useState(false)
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [permissionError, setPermissionError] = useState('')
  const [tabSwitches, setTabSwitches] = useState(0)
  const [fullscreenExits, setFullscreenExits] = useState(0)
  const [faceWarning, setFaceWarning] = useState('')
  const [cheatWarning, setCheatWarning] = useState('')
  const [suspiciousLogs, setSuspiciousLogs] = useState([])
  const [locationStart, setLocationStart] = useState(null)
  const [faceDetectionReady, setFaceDetectionReady] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const faceApiRef = useRef(null)
  const streamRef = useRef(null)
  const startTimeRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setTestId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (!testId || !user) return
    async function fetchTest() {
      const supabase = createClient()
      const { data: payment } = await supabase
        .from('live_payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('test_id', testId)
        .eq('status', 'paid')
        .single()

      if (!payment) {
        router.push(`/dashboard/live-test/${testId}`)
        return
      }
      setHasPaid(true)

      const { data: testData } = await supabase
        .from('live_tests')
        .select('*')
        .eq('id', testId)
        .single()

      const { data: questionsData } = await supabase
        .from('live_questions')
        .select('*')
        .eq('live_test_id', testId)

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
  }, [testId, user])

  async function requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStart(`${pos.coords.latitude},${pos.coords.longitude}`)
        },
        () => {}
      )

      await loadFaceApi()
      setPermissionsGranted(true)
      startTimeRef.current = Date.now()

      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch (err) {
      setPermissionError('Camera aur Mic permission do — test ke liye zaroori hai')
    }
  }

  async function loadFaceApi() {
    try {
      const faceapi = await import('face-api.js')
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      ])
      faceApiRef.current = faceapi
      setFaceDetectionReady(true)
      startFaceDetection(faceapi)
    } catch (err) {
      console.error('Face API load error:', err)
    }
  }

  function startFaceDetection(faceapi) {
    let noFaceCount = 0
    const interval = setInterval(async () => {
      if (submitted) {
        clearInterval(interval)
        return
      }
      if (!videoRef.current || !canvasRef.current) return
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        if (detections.length === 0) {
          noFaceCount++
          if (noFaceCount >= 2) {
            setFaceWarning('⚠️ Face detect nahi ho raha — camera ke saamne baitho!')
            addLog('No face detected')
          }
        } else if (detections.length > 1) {
          setFaceWarning('🚨 Multiple faces detected — cheating flag!')
          addLog('Multiple faces detected')
        } else {
          noFaceCount = 0
          setFaceWarning('')
        }
      } catch (err) {}
    }, 5000)
    return () => clearInterval(interval)
  }

  function addLog(event) {
    const log = { event, timestamp: new Date().toISOString() }
    setSuspiciousLogs(prev => [...prev, log])
  }

  useEffect(() => {
    if (!permissionsGranted || submitted) return

    function handleVisibilityChange() {
      if (document.hidden) {
        setTabSwitches(prev => {
          const newCount = prev + 1
          setCheatWarning(`⚠️ Tab switch detected! Warning ${newCount}/3`)
          addLog(`Tab switch ${newCount}`)
          if (newCount >= 3) {
            handleSubmit(true)
          }
          return newCount
        })
      }
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        setFullscreenExits(prev => {
          const newCount = prev + 1
          setCheatWarning(`⚠️ Fullscreen exit detected! Warning ${newCount}`)
          addLog(`Fullscreen exit ${newCount}`)
          return newCount
        })
      }
    }

    function handleCopy(e) { e.preventDefault() }
    function handlePaste(e) { e.preventDefault() }
    function handleContextMenu(e) { e.preventDefault() }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [permissionsGranted, submitted])

  useEffect(() => {
    if (!permissionsGranted || submitted || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [permissionsGranted, submitted])

  async function handleSubmit(autoSubmit = false) {
    if (submitted) return
    setSubmitted(true)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }

    const timeTaken = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0

    const res = await fetch(`/api/live-test/${testId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        timeTaken,
        sessionData: {
          faceDetected: true,
          multipleFaces: 0,
          tabSwitches,
          fullscreenExits,
          locationStart,
          locationChange: false,
          suspiciousLogs,
        },
      }),
    })
    const data = await res.json()
    setScore(data.score || 0)
  }

  function handleAnswer(questionId, optionKey) {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }))
  }

  if (loading) return <Loader />

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-6 block">🎉</span>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Test Submit Ho Gaya!</h2>
        <p className="text-gray-500 mb-4">Tumhara score:</p>
        <div className="text-5xl font-bold text-orange-500 mb-2">
          {score}/{questions.length}
        </div>
        <p className="text-gray-500 mb-8">
          {Math.round((score / questions.length) * 100)}% correct
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => router.push(`/dashboard/live-test/${testId}/leaderboard`)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
          >
            Leaderboard Dekho 🏆
          </button>
          <button
            onClick={() => router.push('/dashboard/live-test')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition"
          >
            Wapas Live Tests pe jao
          </button>
        </div>
      </div>
    )
  }

  if (!permissionsGranted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-6 block">📷</span>
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          Permissions Required
        </h2>
        <p className="text-gray-500 mb-6">
          Test shuru karne ke liye Camera, Mic aur Location access do
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <ul className="text-yellow-700 text-sm flex flex-col gap-2">
            <li>📷 Camera — Face detection ke liye</li>
            <li>🎤 Mic — Audio monitoring ke liye</li>
            <li>📍 Location — Location lock ke liye</li>
            <li>🖥️ Fullscreen — Cheating rokne ke liye</li>
          </ul>
        </div>
        {permissionError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {permissionError}
          </div>
        )}
        <button
          onClick={requestPermissions}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition text-lg"
        >
          Allow karo aur Test Shuru Karo
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-blue-900 text-sm truncate">{test?.title}</h1>
        <div className={`font-bold text-sm px-3 py-1 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-800'}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-40">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-24 h-24 rounded-full border-4 border-blue-900 object-cover shadow-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {(faceWarning || cheatWarning) && (
        <div className="fixed top-16 left-0 right-0 z-50 px-4">
          <div className="bg-red-500 text-white text-sm font-semibold px-4 py-3 rounded-lg text-center shadow-lg">
            {faceWarning || cheatWarning}
          </div>
        </div>
      )}

      <div className="mt-16 mb-4 flex flex-wrap gap-2">
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
          <p className="text-sm text-gray-500 mb-2">
            Question {currentIndex + 1} of {questions.length}
          </p>
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

      <div className="flex items-center justify-between gap-3 mb-8">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50 transition"
        >
          ← Pehla
        </button>
        <button
          onClick={() => handleSubmit(false)}
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
