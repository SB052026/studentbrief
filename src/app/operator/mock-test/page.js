'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

async function checkPermission(perm) {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()
  const id = localStorage.getItem('sb_operator_id')
  if (!id) return false
  const { data } = await supabase.from('operators').select('permissions, is_active, is_blocked').eq('id', id).single()
  if (!data || !data.is_active || data.is_blocked) return false
  return (data.permissions || []).includes(perm)
}

export default function AdminMockTestPage() {
  const [tests, setTests] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTestForm, setShowTestForm] = useState(false)
  const [showQForm, setShowQForm] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [mockCategories, setMockCategories] = useState([])
  const [mockSubcategories, setMockSubcategories] = useState([])
  const [testForm, setTestForm] = useState({ title: '', duration_minutes: '30', total_questions: '10', mock_category_id: '', mock_subcategory_id: '' })
  const [qForm, setQForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '' })

  async function fetchTests() {
    const supabase = createClient()
    const { data } = await supabase.from('mock_tests').select('*').order('created_at', { ascending: false })
    setTests(data || [])
    const { data: mcats } = await supabase.from('mock_categories').select('*').order('name')
    setMockCategories(mcats || [])
    setLoading(false)
  }

  async function fetchMockSubcategories(categoryId) {
    const supabase = createClient()
    const { data } = await supabase.from('mock_subcategories').select('*').eq('category_id', categoryId).order('name')
    setMockSubcategories(data || [])
  }

  async function fetchQuestions(testId) {
    const supabase = createClient()
    const { data } = await supabase.from('mock_questions').select('*').eq('mock_test_id', testId).order('created_at')
    setQuestions(data || [])
  }

  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    checkPermission('mock').then(allowed => {
      if (!allowed) window.location.replace('/operator')
      setHasPermission(allowed)
    }); fetchTests() }, [])

  async function handleSaveTest() {
    if (!testForm.title) return alert('Title zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = {
      title: testForm.title,
      duration_minutes: parseInt(testForm.duration_minutes) || 30,
      total_questions: parseInt(testForm.total_questions) || 10,
      mock_category_id: testForm.mock_category_id || null,
      mock_subcategory_id: testForm.mock_subcategory_id || null,
    }
    if (editId) {
      await supabase.from('mock_tests').update(data).eq('id', editId)
    } else {
      await supabase.from('mock_tests').insert(data)
    }
    await fetchTests()
    setTestForm({ title: '', duration_minutes: '30', total_questions: '10', mock_category_id: '', mock_subcategory_id: '' })
    setEditId(null)
    setShowTestForm(false)
    setSaving(false)
  }

  async function handleDeleteTest(id) {
    if (!confirm('Kya aap sure hain? Saare questions bhi delete ho jayenge!')) return
    const supabase = createClient()
    await supabase.from('mock_questions').delete().eq('mock_test_id', id)
    await supabase.from('mock_tests').delete().eq('id', id)
    if (selectedTest?.id === id) { setSelectedTest(null); setQuestions([]) }
    await fetchTests()
  }

  async function handleSaveQuestion() {
    if (!qForm.question || !qForm.option_a || !qForm.option_b || !qForm.option_c || !qForm.option_d) return alert('Saare fields zaroori hain!')
    setSaving(true)
    const supabase = createClient()
    await supabase.from('mock_questions').insert({ ...qForm, mock_test_id: selectedTest.id })
    await fetchQuestions(selectedTest.id)
    setQForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '' })
    setShowQForm(false)
    setSaving(false)
  }

  async function handleDeleteQuestion(id) {
    if (!confirm('Question delete karein?')) return
    const supabase = createClient()
    await supabase.from('mock_questions').delete().eq('id', id)
    await fetchQuestions(selectedTest.id)
  }

  async function handleCSVUpload(e, testId) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const text = evt.target.result
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const supabase = createClient()
      let count = 0
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        const row = {}
        headers.forEach((h, idx) => { row[h] = values[idx] || '' })
        if (!row.question || !row.option_a || !row.option_b || !row.option_c || !row.option_d || !row.correct_option) continue
        await supabase.from('mock_questions').insert({
          mock_test_id: testId,
          question: row.question,
          option_a: row.option_a,
          option_b: row.option_b,
          option_c: row.option_c,
          option_d: row.option_d,
          correct_option: row.correct_option.toString().toUpperCase().trim(),
          explanation: row.explanation || null,
        })
        count++
      }
      await fetchQuestions(testId)
      alert(count + ' questions upload ho gaye!')
    }
    reader.readAsText(file, 'UTF-8')
  }

  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>🧪 Mock Tests</h1>
        <button onClick={() => setShowTestForm(true)} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Test
        </button>
      </div>

      {showTestForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>Naya Mock Test</h2>
          
          <label style={labelStyle}>📝 Test Title *</label>
          <input style={inputStyle} value={testForm.title} onChange={e => setTestForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Ancient History Test 1" />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={labelStyle}>⏱️ Duration (minutes)</label>
              <input style={inputStyle} type="number" value={testForm.duration_minutes} onChange={e => setTestForm(p => ({ ...p, duration_minutes: e.target.value }))} placeholder="30" />
            </div>
            <div>
              <label style={labelStyle}>❓ Total Questions</label>
              <input style={inputStyle} type="number" value={testForm.total_questions} onChange={e => setTestForm(p => ({ ...p, total_questions: e.target.value }))} placeholder="10" />
            </div>
          </div>

          <label style={labelStyle}>📁 Category *</label>
          <select style={inputStyle} value={testForm.mock_category_id} onChange={e => { setTestForm(p => ({ ...p, mock_category_id: e.target.value, mock_subcategory_id: '' })); if(e.target.value) fetchMockSubcategories(e.target.value) }}>
            <option value="">Category Select Karo (Railway, SSC, Army...)</option>
            {mockCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>

          {mockSubcategories.length > 0 && (
            <>
              <label style={labelStyle}>📋 Sub-Category *</label>
              <select style={inputStyle} value={testForm.mock_subcategory_id} onChange={e => setTestForm(p => ({ ...p, mock_subcategory_id: e.target.value }))}>
                <option value="">Sub-Category Select Karo (RRB Group D, SSC GD...)</option>
                {mockSubcategories.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSaveTest} disabled={saving} style={{ flex: 1, background: '#1a3c8f', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
              {saving ? 'Saving...' : 'Save Karo'}
            </button>
            <button onClick={() => setShowTestForm(false)} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tests.map(test => (
            <div key={test.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: selectedTest?.id === test.id ? '1rem' : 0 }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{test.title}</h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>⏱️ {test.duration_minutes} min • 📝 {test.total_questions} questions</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setSelectedTest(test); fetchQuestions(test.id) }} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                    {selectedTest?.id === test.id ? 'Close' : 'Questions'}
                  </button>
                  <button onClick={() => handleDeleteTest(test.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Delete</button>
                </div>
              </div>

              {selectedTest?.id === test.id && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.85rem' }}>Questions ({questions.length})</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setShowQForm(!showQForm)} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ Add Question</button>
                      <label style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                        📊 CSV Upload
                        <input type="file" accept=".csv" style={{ display: 'none' }} onChange={e => handleCSVUpload(e, test.id)} />
                      </label>
                    </div>
                  </div>

                  {showQForm && (
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
                      <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={qForm.question} onChange={e => setQForm(p => ({ ...p, question: e.target.value }))} placeholder="Question *" />
                      <input style={inputStyle} value={qForm.option_a} onChange={e => setQForm(p => ({ ...p, option_a: e.target.value }))} placeholder="Option A *" />
                      <input style={inputStyle} value={qForm.option_b} onChange={e => setQForm(p => ({ ...p, option_b: e.target.value }))} placeholder="Option B *" />
                      <input style={inputStyle} value={qForm.option_c} onChange={e => setQForm(p => ({ ...p, option_c: e.target.value }))} placeholder="Option C *" />
                      <input style={inputStyle} value={qForm.option_d} onChange={e => setQForm(p => ({ ...p, option_d: e.target.value }))} placeholder="Option D *" />
                      <select value={qForm.correct_option} onChange={e => setQForm(p => ({ ...p, correct_option: e.target.value }))} style={inputStyle}>
                        <option value="A">A Sahi Hai</option>
                        <option value="B">B Sahi Hai</option>
                        <option value="C">C Sahi Hai</option>
                        <option value="D">D Sahi Hai</option>
                      </select>
                      <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={qForm.explanation} onChange={e => setQForm(p => ({ ...p, explanation: e.target.value }))} placeholder="Explanation (optional)" />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleSaveQuestion} disabled={saving} style={{ flex: 1, background: '#1a3c8f', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem' }}>
                          {saving ? 'Saving...' : 'Save Question'}
                        </button>
                        <button onClick={() => setShowQForm(false)} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem' }}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {questions.map((q, i) => (
                    <div key={q.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: '2px' }}>{i + 1}. {q.question}</p>
                        <p style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>✅ Sahi: {q.correct_option}</p>
                      </div>
                      <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', flexShrink: 0 }}>Del</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
