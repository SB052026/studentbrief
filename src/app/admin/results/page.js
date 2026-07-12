'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminResultsPage() {
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    category_id: '', title: '', published_date: '', exam_date: '',
    result_date: '', organization: '', post_name: '',
    total_vacancies: '', result_status: 'Declared', result_link: '', description: ''
  })

  async function fetchData() {
    const supabase = createClient()
    const [{ data: r }, { data: c }] = await Promise.all([
      supabase.from('results').select('*, result_categories(name)').order('created_at', { ascending: false }),
      supabase.from('result_categories').select('*').order('name'),
    ])
    setResults(r || [])
    setCategories(c || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({ category_id: '', title: '', published_date: '', exam_date: '', result_date: '', organization: '', post_name: '', total_vacancies: '', result_status: 'Declared', result_link: '', description: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.title || !form.category_id) return alert('Title aur Category zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = {
      category_id: form.category_id, title: form.title,
      published_date: form.published_date || null,
      exam_date: form.exam_date || null,
      result_date: form.result_date || null,
      organization: form.organization || null,
      post_name: form.post_name || null,
      total_vacancies: form.total_vacancies || null,
      result_status: form.result_status || 'Declared',
      result_link: form.result_link || null,
      description: form.description || null,
    }
    if (editId) await supabase.from('results').update(data).eq('id', editId)
    else await supabase.from('results').insert(data)
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('results').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(r) {
    setForm({
      category_id: r.category_id || '', title: r.title || '',
      published_date: r.published_date || '', exam_date: r.exam_date || '',
      result_date: r.result_date || '', organization: r.organization || '',
      post_name: r.post_name || '', total_vacancies: r.total_vacancies || '',
      result_status: r.result_status || 'Declared', result_link: r.result_link || '',
      description: r.description || ''
    })
    setEditId(r.id)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>📋 Results</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit Result' : 'Naya Result'}</h2>

          <label style={labelStyle}>Category *</label>
          <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
            <option value="">Select</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Result title" />

          <label style={labelStyle}>Organization</label>
          <input style={inputStyle} value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="e.g. SSC, UPSC" />

          <label style={labelStyle}>Post Name</label>
          <input style={inputStyle} value={form.post_name} onChange={e => setForm(p => ({ ...p, post_name: e.target.value }))} placeholder="Post name" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={labelStyle}>Published Date</label>
              <input style={inputStyle} type="date" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Exam Date</label>
              <input style={inputStyle} type="date" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Result Date</label>
              <input style={inputStyle} type="date" value={form.result_date} onChange={e => setForm(p => ({ ...p, result_date: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Total Vacancies</label>
              <input style={inputStyle} value={form.total_vacancies} onChange={e => setForm(p => ({ ...p, total_vacancies: e.target.value }))} placeholder="e.g. 5000" />
            </div>
          </div>

          <label style={labelStyle}>Result Status</label>
          <select value={form.result_status} onChange={e => setForm(p => ({ ...p, result_status: e.target.value }))} style={inputStyle}>
            <option value="Declared">Declared</option>
            <option value="Expected">Expected</option>
            <option value="Pending">Pending</option>
          </select>

          <label style={labelStyle}>Result Link</label>
          <input style={inputStyle} value={form.result_link} onChange={e => setForm(p => ({ ...p, result_link: e.target.value }))} placeholder="https://..." />

          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : results.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {results.map(r => (
            <div key={r.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{r.result_categories?.name}</span>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', marginTop: '4px' }}>{r.title}</p>
                  {r.result_date && <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Date: {r.result_date}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(r)} style={btnEdit}>Edit</button>
                  <button onClick={() => handleDelete(r.id)} style={btnDelete}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}><p style={{ fontSize: '2rem' }}>📋</p><p>Koi result nahi</p></div>
      )}
    </div>
  )
}
