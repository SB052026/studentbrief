'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    category_id: '', title: '', published_date: '', last_date: '',
    exam_date: '', age_min: '', age_max: '', education: '',
    apply_link: '', description: ''
  })

  async function fetchData() {
    const supabase = createClient()
    const { data: jobsData } = await supabase.from('jobs').select('*, job_categories(name)').order('created_at', { ascending: false })
    const { data: catsData } = await supabase.from('job_categories').select('*').order('name')
    setJobs(jobsData || [])
    setCategories(catsData || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({ category_id: '', title: '', published_date: '', last_date: '', exam_date: '', age_min: '', age_max: '', education: '', apply_link: '', description: '' })
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
      last_date: form.last_date || null,
      exam_date: form.exam_date || null,
      age_min: parseInt(form.age_min) || null,
      age_max: parseInt(form.age_max) || null,
      education: form.education || null,
      apply_link: form.apply_link || null,
      description: form.description || null,
    }
    if (editId) {
      await supabase.from('jobs').update(data).eq('id', editId)
    } else {
      await supabase.from('jobs').insert(data)
    }
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('jobs').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(job) {
    setForm({
      category_id: job.category_id || '',
      title: job.title || '',
      published_date: job.published_date || '',
      last_date: job.last_date || '',
      exam_date: job.exam_date || '',
      age_min: job.age_min || '',
      age_max: job.age_max || '',
      education: job.education || '',
      apply_link: job.apply_link || '',
      description: job.description || '',
    })
    setEditId(job.id)
    setShowForm(true)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>💼 Jobs Manage Karo</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Job
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Job Edit Karo' : 'Naya Job Add Karo'}</h2>

          <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
            <option value="">Category Select Karo *</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Job Title *" />
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Job Description" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <input style={inputStyle} type="date" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} placeholder="Published Date" />
            <input style={inputStyle} type="date" value={form.last_date} onChange={e => setForm(p => ({ ...p, last_date: e.target.value }))} placeholder="Last Date" />
            <input style={inputStyle} type="date" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} placeholder="Exam Date" />
            <input style={inputStyle} value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))} placeholder="Education" />
            <input style={inputStyle} type="number" value={form.age_min} onChange={e => setForm(p => ({ ...p, age_min: e.target.value }))} placeholder="Age Min" />
            <input style={inputStyle} type="number" value={form.age_max} onChange={e => setForm(p => ({ ...p, age_max: e.target.value }))} placeholder="Age Max" />
          </div>

          <input style={inputStyle} value={form.apply_link} onChange={e => setForm(p => ({ ...p, apply_link: e.target.value }))} placeholder="Apply Link (https://...)" />

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
      ) : jobs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jobs.map(job => (
            <div key={job.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{job.job_categories?.name}</span>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginTop: '4px' }}>{job.title}</h3>
                  {job.last_date && <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '2px' }}>Last Date: {job.last_date}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(job)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(job.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem' }}>💼</p>
          <p>Koi job nahi mili</p>
        </div>
      )}
    </div>
  )
}
