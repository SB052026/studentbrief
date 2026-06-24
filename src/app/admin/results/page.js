'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
    const { data: resultsData } = await supabase.from('results').select('*, result_categories(name)').order('created_at', { ascending: false })
    const { data: catsData } = await supabase.from('result_categories').select('*').order('name')
    setResults(resultsData || [])
    setCategories(catsData || [])
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
      category_id: form.category_id,
      title: form.title,
      published_date: form.published_date || null,
      exam_date: form.exam_date || null,
      result_date: form.result_date || null,
      organization: form.organization || null,
      post_name: form.post_name || null,
      total_vacancies: parseInt(form.total_vacancies) || null,
      result_status: form.result_status || 'Declared',
      result_link: form.result_link || null,
      description: form.description || null,
    }
    if (editId) {
      await supabase.from('results').update(data).eq('id', editId)
    } else {
      await supabase.from('results').insert(data)
    }
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('results').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(item) {
    setForm({
      category_id: item.category_id || '',
      title: item.title || '',
      published_date: item.published_date || '',
      exam_date: item.exam_date || '',
      result_date: item.result_date || '',
      organization: item.organization || '',
      post_name: item.post_name || '',
      total_vacancies: item.total_vacancies || '',
      result_status: item.result_status || 'Declared',
      result_link: item.result_link || '',
      description: item.description || '',
    })
    setEditId(item.id)
    setShowForm(true)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>📋 Results Manage Karo</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Result
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Result Edit Karo' : 'Naya Result Add Karo'}</h2>

          <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
            <option value="">Category Select Karo *</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Result Title *" />
          <input style={inputStyle} value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="Organization" />
          <input style={inputStyle} value={form.post_name} onChange={e => setForm(p => ({ ...p, post_name: e.target.value }))} placeholder="Post Name" />
          <input style={inputStyle} type="number" value={form.total_vacancies} onChange={e => setForm(p => ({ ...p, total_vacancies: e.target.value }))} placeholder="Total Vacancies" />

          <select value={form.result_status} onChange={e => setForm(p => ({ ...p, result_status: e.target.value }))} style={inputStyle}>
            <option value="Declared">Declared</option>
            <option value="Expected">Expected</option>
            <option value="Pending">Pending</option>
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <input style={inputStyle} type="date" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} placeholder="Published Date" />
            <input style={inputStyle} type="date" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} placeholder="Exam Date" />
            <input style={inputStyle} type="date" value={form.result_date} onChange={e => setForm(p => ({ ...p, result_date: e.target.value }))} placeholder="Result Date" />
          </div>

          <input style={inputStyle} value={form.result_link} onChange={e => setForm(p => ({ ...p, result_link: e.target.value }))} placeholder="Result Link (https://...)" />
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: '#1a3c8f', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
              {saving ? 'Saving...' : editId ? 'Update Karo' : 'Save Karo'}
            </button>
            <button onClick={resetForm} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
      ) : results.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {results.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{item.result_categories?.name}</span>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginTop: '4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{item.organization} • {item.result_status}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(item)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem' }}>📋</p>
          <p>Koi result nahi mila</p>
        </div>
      )}
    </div>
  )
}
