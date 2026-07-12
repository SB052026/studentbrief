'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminPYPPage() {
  const [items, setItems] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedPYP, setSelectedPYP] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showQForm, setShowQForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ exam_name: '', year: '', pdf_url: '', description: '' })
  const [qForm, setQForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '' })

  async function fetchData() {
    const supabase = createClient()
    const { data } = await supabase.from('pyp').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  async function fetchQuestions(pypId) {
    const supabase = createClient()
    const { data } = await supabase.from('pyp_questions').select('*').eq('pyp_id', pypId).order('created_at')
    setQuestions(data || [])
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({ exam_name: '', year: '', pdf_url: '', description: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.exam_name) return alert('Exam name zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = { exam_name: form.exam_name, year: form.year || null, pdf_url: form.pdf_url || null, description: form.description || null }
    if (editId) await supabase.from('pyp').update(data).eq('id', editId)
    else await supabase.from('pyp').insert(data)
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('pyp').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(item) {
    setForm({ exam_name: item.exam_name || '', year: item.year || '', pdf_url: item.pdf_url || '', description: item.description || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  async function handleSaveQuestion() {
    if (!qForm.question) return alert('Question zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    await supabase.from('pyp_questions').insert({ ...qForm, pyp_id: selectedPYP.id })
    await fetchQuestions(selectedPYP.id)
    setQForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '' })
    setShowQForm(false)
    setSaving(false)
  }

  async function handleDeleteQuestion(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('pyp_questions').delete().eq('id', id)
    await fetchQuestions(selectedPYP.id)
  }

  return (
    <div>
      {selectedPYP ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <button onClick={() => { setSelectedPYP(null); setQuestions([]) }} style={{ background: 'none', border: 'none', color: '#1a3c8f', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>← Back</button>
              <h1 style={{ ...pageTitle, marginBottom: 0 }}>{selectedPYP.exam_name}</h1>
            </div>
            <button onClick={() => setShowQForm(true)} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ Question</button>
          </div>

          {showQForm && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>Naya Question</h2>
              <label style={labelStyle}>Question *</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={qForm.question} onChange={e => setQForm(p => ({ ...p, question: e.target.value }))} />
              {['option_a','option_b','option_c','option_d'].map(opt => (
                <div key={opt}>
                  <label style={labelStyle}>Option {opt.split('_')[1].toUpperCase()}</label>
                  <input style={inputStyle} value={qForm[opt]} onChange={e => setQForm(p => ({ ...p, [opt]: e.target.value }))} />
                </div>
              ))}
              <label style={labelStyle}>Correct Option</label>
              <select value={qForm.correct_option} onChange={e => setQForm(p => ({ ...p, correct_option: e.target.value }))} style={inputStyle}>
                {['A','B','C','D'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <label style={labelStyle}>Explanation</label>
              <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={qForm.explanation} onChange={e => setQForm(p => ({ ...p, explanation: e.target.value }))} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSaveQuestion} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setShowQForm(false)} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {questions.map((q, i) => (
              <div key={q.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>Q{i+1}. {q.question}</p>
                    <p style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '4px' }}>✓ {q.correct_option}</p>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} style={btnDelete}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={pageTitle}>📄 PYP Papers</h1>
            <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
          </div>

          {showForm && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit' : 'Naya'} PYP</h2>
              <label style={labelStyle}>Exam Name *</label>
              <input style={inputStyle} value={form.exam_name} onChange={e => setForm(p => ({ ...p, exam_name: e.target.value }))} placeholder="e.g. SSC GD 2023" />
              <label style={labelStyle}>Year</label>
              <input style={inputStyle} value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="e.g. 2023" />
              <label style={labelStyle}>PDF Link</label>
              <input style={inputStyle} value={form.pdf_url} onChange={e => setForm(p => ({ ...p, pdf_url: e.target.value }))} placeholder="https://..." />
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
                <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
              </div>
            </div>
          )}

          {loading ? <div style={emptyState}>Loading...</div> : items.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{item.exam_name}</p>
                      {item.year && <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Year: {item.year}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => { setSelectedPYP(item); fetchQuestions(item.id) }} style={{ background: '#ede9fe', color: '#5b21b6', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Questions</button>
                      <button onClick={() => handleEdit(item)} style={btnEdit}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={btnDelete}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <div style={emptyState}><p style={{ fontSize: '2rem' }}>📄</p><p>Koi PYP nahi</p></div>}
        </div>
      )}
    </div>
  )
}
