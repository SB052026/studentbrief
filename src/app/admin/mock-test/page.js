'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function AdminMockTestPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTestForm, setShowTestForm] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [saving, setSaving] = useState(false)
  const [testForm, setTestForm] = useState({ title: '', duration_minutes: 30, total_questions: 10 })
  const [questionForm, setQuestionForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' })

  async function fetchTests() {
    const supabase = createClient()
    const { data } = await supabase
      .from('mock_tests')
      .select('*')
      .order('created_at', { ascending: false })
    setTests(data || [])
    setLoading(false)
  }

  async function fetchQuestions(testId) {
    const supabase = createClient()
    const { data } = await supabase
      .from('mock_questions')
      .select('*')
      .eq('mock_test_id', testId)
      .order('created_at', { ascending: true })
    setQuestions(data || [])
  }

  useEffect(() => { fetchTests() }, [])

  async function handleSaveTest() {
    if (!testForm.title) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('mock_tests').insert({
      title: testForm.title,
      duration_minutes: parseInt(testForm.duration_minutes),
      total_questions: parseInt(testForm.total_questions),
    })
    await fetchTests()
    setShowTestForm(false)
    setTestForm({ title: '', duration_minutes: 30, total_questions: 10 })
    setSaving(false)
  }

  async function handleDeleteTest(id) {
    if (!confirm('Kya aap sure hain? Saare questions bhi delete ho jayenge.')) return
    const supabase = createClient()
    await supabase.from('mock_tests').delete().eq('id', id)
    await fetchTests()
  }

  async function handleSelectTest(test) {
    setSelectedTest(test)
    await fetchQuestions(test.id)
    setShowQuestionForm(false)
  }

  async function handleSaveQuestion() {
    if (!questionForm.question || !questionForm.option_a || !questionForm.option_b || !questionForm.option_c || !questionForm.option_d) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('mock_questions').insert({
      mock_test_id: selectedTest.id,
      question: questionForm.question,
      option_a: questionForm.option_a,
      option_b: questionForm.option_b,
      option_c: questionForm.option_c,
      option_d: questionForm.option_d,
      correct_option: questionForm.correct_option,
    })
    await fetchQuestions(selectedTest.id)
    setQuestionForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' })
    setShowQuestionForm(false)
    setSaving(false)
  }

  async function handleDeleteQuestion(id) {
    if (!confirm('Question delete karo?')) return
    const supabase = createClient()
    await supabase.from('mock_questions').delete().eq('id', id)
    await fetchQuestions(selectedTest.id)
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Mock Tests Manage Karo</h1>
        <button
          onClick={() => setShowTestForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Naya Test Add Karo
        </button>
      </div>

      {showTestForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="font-bold text-blue-900 mb-4">Naya Mock Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">Test Title *</label>
              <input className="input-field" value={testForm.title} onChange={e => setTestForm(p => ({ ...p, title: e.target.value }))} placeholder="Test title daalo" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Duration (minutes)</label>
              <input type="number" className="input-field" value={testForm.duration_minutes} onChange={e => setTestForm(p => ({ ...p, duration_minutes: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Total Questions</label>
              <input type="number" className="input-field" value={testForm.total_questions} onChange={e => setTestForm(p => ({ ...p, total_questions: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSaveTest} disabled={saving} className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition">
              {saving ? 'Saving...' : 'Save Karo'}
            </button>
            <button onClick={() => setShowTestForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {tests.length > 0 ? tests.map(test => (
          <div key={test.id} className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition ${selectedTest?.id === test.id ? 'border-blue-600 border-2' : ''}`}>
            <div className="flex items-center justify-between">
              <div onClick={() => handleSelectTest(test)}>
                <h3 className="font-semibold text-gray-800 text-sm">{test.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{test.duration_minutes} min • {test.total_questions} questions</p>
              </div>
              <button onClick={() => handleDeleteTest(test.id)} className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-3 py-1.5 rounded-lg transition">
                Delete
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-2">
            <EmptyState title="Koi test nahi hai" description="Naya mock test add karo" icon="📝" />
          </div>
        )}
      </div>

      {selectedTest && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-blue-900">{selectedTest.title} — Questions</h2>
            <button
              onClick={() => setShowQuestionForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              + Question Add Karo
            </button>
          </div>

          {showQuestionForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex flex-col gap-3">
                <input className="input-field" value={questionForm.question} onChange={e => setQuestionForm(p => ({ ...p, question: e.target.value }))} placeholder="Question likho *" />
                <input className="input-field" value={questionForm.option_a} onChange={e => setQuestionForm(p => ({ ...p, option_a: e.target.value }))} placeholder="Option A *" />
                <input className="input-field" value={questionForm.option_b} onChange={e => setQuestionForm(p => ({ ...p, option_b: e.target.value }))} placeholder="Option B *" />
                <input className="input-field" value={questionForm.option_c} onChange={e => setQuestionForm(p => ({ ...p, option_c: e.target.value }))} placeholder="Option C *" />
                <input className="input-field" value={questionForm.option_d} onChange={e => setQuestionForm(p => ({ ...p, option_d: e.target.value }))} placeholder="Option D *" />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Correct Option</label>
                  <select className="input-field" value={questionForm.correct_option} onChange={e => setQuestionForm(p => ({ ...p, correct_option: e.target.value }))}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveQuestion} disabled={saving} className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg text-sm transition">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setShowQuestionForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {questions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{index + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <p className={`text-xs px-2 py-1 rounded ${q.correct_option === 'A' ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-500'}`}>A. {q.option_a}</p>
                      <p className={`text-xs px-2 py-1 rounded ${q.correct_option === 'B' ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-500'}`}>B. {q.option_b}</p>
                      <p className={`text-xs px-2 py-1 rounded ${q.correct_option === 'C' ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-500'}`}>C. {q.option_c}</p>
                      <p className={`text-xs px-2 py-1 rounded ${q.correct_option === 'D' ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-500'}`}>D. {q.option_d}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-2 py-1 rounded-lg transition shrink-0">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Koi question nahi hai — add karo</p>
          )}
        </div>
      )}
    </div>
  )
}
