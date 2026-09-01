'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminCareersPage() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', department: '', location: '', job_type: 'Full Time', experience: '', salary: '', description: '', requirements: '', last_date: '', is_active: true, order_no: '0' })

  async function fetchCareers() {
    const supabase = createClient()
    const { data } = await supabase.from('careers').select('*').order('order_no')
    setCareers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCareers() }, [])

  function resetForm() {
    setForm({ title: '', department: '', location: '', job_type: 'Full Time', experience: '', salary: '', description: '', requirements: '', last_date: '', is_active: true, order_no: '0' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.title) return alert('Title zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = {
      title: form.title,
      department: form.department || null,
      location: form.location || null,
      job_type: form.job_type || 'Full Time',
      experience: form.experience || null,
      salary: form.salary || null,
      description: form.description || null,
      requirements: form.requirements || null,
      last_date: form.last_date || null,
      is_active: form.is_active,
      order_no: parseInt(form.order_no) || 0,
    }
    if (editId) await supabase.from('careers').update(data).eq('id', editId)
    else await supabase.from('careers').insert(data)
    await fetchCareers()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('careers').delete().eq('id', id)
    await fetchCareers()
  }

  function handleEdit(item) {
    setForm({
      title: item.title || '',
      department: item.department || '',
      location: item.location || '',
      job_type: item.job_type || 'Full Time',
      experience: item.experience || '',
      salary: item.salary || '',
      description: item.description || '',
      requirements: item.requirements || '',
      last_date: item.last_date || '',
      is_active: item.is_active !== false,
      order_no: String(item.order_no || 0),
    })
    setEditId(item.id)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>🚀 Careers</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New Opening</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '0.95rem' }}>{editId ? 'Edit' : 'New'} Job Opening</h2>

          <label style={labelStyle}>Job Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Content Writer" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={labelStyle}>Department</label>
              <input style={inputStyle} value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Content" />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Remote / Bawal" />
            </div>
            <div>
              <label style={labelStyle}>Job Type</label>
              <select style={inputStyle} value={form.job_type} onChange={e => setForm(p => ({ ...p, job_type: e.target.value }))}>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
                <option>Freelance</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Experience</label>
              <input style={inputStyle} value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 0-1 Year" />
            </div>
            <div>
              <label style={labelStyle}>Salary</label>
              <input style={inputStyle} value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. 5000-10000/month" />
            </div>
            <div>
              <label style={labelStyle}>Last Date</label>
              <input style={inputStyle} type="date" value={form.last_date} onChange={e => setForm(p => ({ ...p, last_date: e.target.value }))} />
            </div>
          </div>

          <label style={labelStyle}>Job Description</label>
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Job ke baare mein likhein..." />

          <label style={labelStyle}>Requirements</label>
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder="Requirements likhein..." />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={labelStyle}>Order No</label>
              <input style={inputStyle} type="number" value={form.order_no} onChange={e => setForm(p => ({ ...p, order_no: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}>
                <option value="true">✅ Active</option>
                <option value="false">❌ Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : careers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {careers.map(career => (
            <div key={career.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', marginBottom: '4px' }}>{career.title}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                    {career.department && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: '9999px', fontSize: '0.62rem', fontWeight: 700 }}>{career.department}</span>}
                    {career.location && <span style={{ background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '9999px', fontSize: '0.62rem', fontWeight: 700 }}>{career.location}</span>}
                    {career.job_type && <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '9999px', fontSize: '0.62rem', fontWeight: 700 }}>{career.job_type}</span>}
                    {career.salary && <span style={{ background: '#fce7f3', color: '#9d174d', padding: '1px 6px', borderRadius: '9999px', fontSize: '0.62rem', fontWeight: 700 }}>{career.salary}</span>}
                  </div>
                  <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Order: {career.order_no} • {career.is_active ? '✅ Active' : '❌ Inactive'} {career.last_date ? `• Last Date: ${new Date(career.last_date).toLocaleDateString('en-IN')}` : ''}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(career)} style={btnEdit}>Edit</button>
                  <button onClick={() => handleDelete(career.id)} style={btnDelete}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}><p style={{ fontSize: '2rem' }}>🚀</p><p>Koi opening nahi hai</p></div>
      )}
    </div>
  )
}
