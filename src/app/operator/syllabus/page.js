'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSyllabusPage() {
  const [syllabus, setSyllabus] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', exam_name: '', description: '', file_url: '' })

  async function fetchSyllabus() {
    const supabase = createClient()
    const { data } = await supabase.from('syllabus').select('*').order('created_at', { ascending: false })
    setSyllabus(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSyllabus() }, [])

  async function handleSave() {
    if (!form.title) return alert('Title zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    await supabase.from('syllabus').insert({
      title: form.title,
      exam_name: form.exam_name || null,
      description: form.description || null,
      file_url: form.file_url || null,
    })
    await fetchSyllabus()
    setForm({ title: '', exam_name: '', description: '', file_url: '' })
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('syllabus').delete().eq('id', id)
    await fetchSyllabus()
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>📚 Syllabus Manage Karo</h1>
        <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Syllabus
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>Naya Syllabus</h2>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Syllabus Title *" />
          <input style={inputStyle} value={form.exam_name} onChange={e => setForm(p => ({ ...p, exam_name: e.target.value }))} placeholder="Exam Name" />
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" />
          <input style={inputStyle} value={form.file_url} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))} placeholder="PDF Link (https://...)" />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: '#1a3c8f', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
              {saving ? 'Saving...' : 'Save Karo'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
      ) : syllabus.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {syllabus.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{item.exam_name}</p>
                {item.file_url && <a href={item.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#1a3c8f' }}>PDF dekho →</a>}
              </div>
              <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', flexShrink: 0 }}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem' }}>📚</p>
          <p>Koi syllabus nahi mila</p>
        </div>
      )}
    </div>
  )
}
