'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminSyllabusPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', exam_name: '', syllabus_link: '', description: '' })

  async function fetchData() {
    const supabase = createClient()
    const { data } = await supabase.from('syllabus').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({ title: '', exam_name: '', syllabus_link: '', description: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.title) return alert('Title zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = { title: form.title, exam_name: form.exam_name || null, syllabus_link: form.syllabus_link || null, description: form.description || null }
    if (editId) await supabase.from('syllabus').update(data).eq('id', editId)
    else await supabase.from('syllabus').insert(data)
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('syllabus').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(item) {
    setForm({ title: item.title || '', exam_name: item.exam_name || '', syllabus_link: item.syllabus_link || '', description: item.description || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>📚 Syllabus</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit' : 'Naya'} Syllabus</h2>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Syllabus title" />
          <label style={labelStyle}>Exam Name</label>
          <input style={inputStyle} value={form.exam_name} onChange={e => setForm(p => ({ ...p, exam_name: e.target.value }))} placeholder="e.g. SSC GD 2025" />
          <label style={labelStyle}>Syllabus Link (PDF)</label>
          <input style={inputStyle} value={form.syllabus_link} onChange={e => setForm(p => ({ ...p, syllabus_link: e.target.value }))} placeholder="https://..." />
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{item.title}</p>
                {item.exam_name && <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.exam_name}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={btnEdit}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div style={emptyState}><p style={{ fontSize: '2rem' }}>📚</p><p>Koi syllabus nahi</p></div>}
    </div>
  )
}
