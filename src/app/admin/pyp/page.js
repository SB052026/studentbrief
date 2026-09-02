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
  const [uploading, setUploading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ exam_name: '', year: '', pdf_url: '', description: '', total_marks: '100', logo_url: '' })
  const [qForm, setQForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '', question_image: '', option_a_image: '', option_b_image: '', option_c_image: '', option_d_image: '' })

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
    setForm({ exam_name: '', year: '', pdf_url: '', description: '', total_marks: '100', logo_url: '' })
    setEditId(null)
    setShowForm(false)
  }

  function resetQForm() {
    setQForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '', question_image: '', option_a_image: '', option_b_image: '', option_c_image: '', option_d_image: '' })
    setShowQForm(false)
  }

  async function handleSave() {
    if (!form.exam_name) return alert('Exam name zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = { exam_name: form.exam_name, year: form.year || null, pdf_url: form.pdf_url || null, description: form.description || null, total_marks: parseInt(form.total_marks) || 100, logo_url: form.logo_url || null }
    if (editId) {
      const { error } = await supabase.from('pyp').update(data).eq('id', editId)
      if (error) { alert('Error: ' + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('pyp').insert(data)
      if (error) { alert('Error: ' + error.message); setSaving(false); return }
    }
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
    setForm({ exam_name: item.exam_name || '', year: item.year || '', pdf_url: item.pdf_url || '', description: item.description || '', total_marks: String(item.total_marks || 100), logo_url: item.logo_url || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  async function uploadImage(file, field) {
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`
    const { error } = await supabase.storage.from('question-images').upload(fileName, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('question-images').getPublicUrl(fileName)
      setQForm(p => ({ ...p, [field]: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSaveQuestion() {
    if (!qForm.question && !qForm.question_image) return alert('Question ya image zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    await supabase.from('pyp_questions').insert({
      pyp_id: selectedPYP.id,
      question: qForm.question,
      option_a: qForm.option_a,
      option_b: qForm.option_b,
      option_c: qForm.option_c,
      option_d: qForm.option_d,
      correct_option: qForm.correct_option,
      explanation: qForm.explanation || null,
      question_image: qForm.question_image || null,
      option_a_image: qForm.option_a_image || null,
      option_b_image: qForm.option_b_image || null,
      option_c_image: qForm.option_c_image || null,
      option_d_image: qForm.option_d_image || null,
    })
    await fetchQuestions(selectedPYP.id)
    resetQForm()
    setSaving(false)
  }

  function parseCSVLine(line) {
    const result = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  async function handleCSVUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const text = evt.target.result
      const lines = text.split('\n').filter(l => l.trim())
      const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim())
      const supabase = createClient()
      let count = 0
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, '').trim())
        const row = {}
        headers.forEach((h, idx) => { row[h] = values[idx] || '' })
        if (!row.question && !row.question_image) continue
        await supabase.from('pyp_questions').insert({
          pyp_id: selectedPYP.id,
          question: row.question || '',
          option_a: row.option_a || '',
          option_b: row.option_b || '',
          option_c: row.option_c || '',
          option_d: row.option_d || '',
          correct_option: row.correct_option?.toUpperCase().trim() || 'A',
          explanation: row.explanation || null,
        })
        count++
      }
      await fetchQuestions(selectedPYP.id)
      alert(`${count} questions upload ho gaye!`)
    }
    reader.readAsText(file, 'UTF-8')
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
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* CSV Upload */}
              <label style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                📊 CSV Upload
                <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
              </label>
              <button onClick={() => setShowQForm(true)} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ Question</button>
            </div>
          </div>

          {showQForm && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>Naya Question</h2>

              <label style={labelStyle}>Question</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={qForm.question} onChange={e => setQForm(p => ({ ...p, question: e.target.value }))} placeholder="Question text (ya sirf image upload karo)" />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>🖼️ Question Image:</label>
                <input type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0], 'question_image')} style={{ fontSize: '0.7rem' }} />
                {qForm.question_image && <img src={qForm.question_image} alt="Q" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
              </div>

              {['a','b','c','d'].map(opt => (
                <div key={opt}>
                  <label style={labelStyle}>Option {opt.toUpperCase()}</label>
                  <input style={inputStyle} value={qForm[`option_${opt}`]} onChange={e => setQForm(p => ({ ...p, [`option_${opt}`]: e.target.value }))} placeholder={`Option ${opt.toUpperCase()} text`} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                    <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>🖼️ Option {opt.toUpperCase()} Image:</label>
                    <input type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0], `option_${opt}_image`)} style={{ fontSize: '0.7rem' }} />
                    {qForm[`option_${opt}_image`] && <img src={qForm[`option_${opt}_image`]} alt={opt} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
                  </div>
                </div>
              ))}

              <label style={labelStyle}>Correct Option</label>
              <select value={qForm.correct_option} onChange={e => setQForm(p => ({ ...p, correct_option: e.target.value }))} style={inputStyle}>
                {['A','B','C','D'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>

              <label style={labelStyle}>Explanation</label>
              <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={qForm.explanation} onChange={e => setQForm(p => ({ ...p, explanation: e.target.value }))} />

              {uploading && <p style={{ fontSize: '0.72rem', color: '#1a3c8f', fontWeight: 600, marginBottom: '0.5rem' }}>⏳ Image upload ho rahi hai...</p>}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSaveQuestion} disabled={saving || uploading} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={resetQForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
              </div>
            </div>
          )}

          <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>Total: {questions.length} questions</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {questions.map((q, i) => (
              <div key={q.id} style={{ background: 'white', borderRadius: '12px', padding: '0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.82rem' }}>Q{i+1}. {q.question}</p>
                    {q.question_image && <img src={q.question_image} alt="Q" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', marginTop: '4px' }} />}
                    <p style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>✓ {q.correct_option}</p>
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
              <label style={labelStyle}>🖼️ Exam Logo (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
                <input type="file" accept="image/*" style={{ flex: 1, fontSize: '0.78rem' }}
                  onChange={async e => {
                    const file = e.target.files[0]; if (!file) return
                    const supabase = createClient()
                    const fileName = Date.now() + '-' + file.name.replace(/[^a-z0-9.]/gi, '_')
                    const { error } = await supabase.storage.from('question-images').upload(fileName, file, { upsert: true })
                    if (!error) { const { data } = supabase.storage.from('question-images').getPublicUrl(fileName); setForm(p => ({ ...p, logo_url: data.publicUrl })) }
                  }}
                />
                {form.logo_url && <img src={form.logo_url} alt="logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />}
              </div>
              <label style={labelStyle}>PDF Link</label>
              <input style={inputStyle} value={form.pdf_url} onChange={e => setForm(p => ({ ...p, pdf_url: e.target.value }))} placeholder="https://..." />
              <label style={labelStyle}>🏆 Total Marks</label>
              <input style={inputStyle} type="number" value={form.total_marks} onChange={e => setForm(p => ({ ...p, total_marks: e.target.value }))} placeholder="100" />
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
