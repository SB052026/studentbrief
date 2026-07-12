'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [activeSection, setActiveSection] = useState('basic')
  const [form, setForm] = useState({
    category_id: '', title: '', description: '',
    published_date: '', last_date: '', exam_date: '',
    physical_date: '', medical_date: '', education: '',
    apply_link: '', documents: '', selection_process: '',
    physical_measurements: '', medical_criteria: '',
    vacancy_details: '', application_fee: '',
    age_criteria: [{ category: 'General', min_age: '18', max_age: '25', relaxation: '-' }],
    fee_criteria: [{ category: 'General/OBC', fee: '100' }, { category: 'SC/ST/PH', fee: '0' }],
  })

  async function fetchData() {
    const supabase = createClient()
    const [{ data: j }, { data: c }] = await Promise.all([
      supabase.from('jobs').select('*, job_categories(name)').order('created_at', { ascending: false }),
      supabase.from('job_categories').select('*').order('name'),
    ])
    setJobs(j || [])
    setCategories(c || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({
      category_id: '', title: '', description: '',
      published_date: '', last_date: '', exam_date: '',
      physical_date: '', medical_date: '', education: '',
      apply_link: '', documents: '', selection_process: '',
      physical_measurements: '', medical_criteria: '',
      vacancy_details: '', application_fee: '',
      age_criteria: [{ category: 'General', min_age: '18', max_age: '25', relaxation: '-' }],
      fee_criteria: [{ category: 'General/OBC', fee: '100' }, { category: 'SC/ST/PH', fee: '0' }],
    })
    setEditId(null)
    setShowForm(false)
    setActiveSection('basic')
  }

  async function handleSave() {
    if (!form.title || !form.category_id) return alert('Title aur Category zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = {
      category_id: form.category_id, title: form.title,
      description: form.description || null,
      published_date: form.published_date || null,
      last_date: form.last_date || null,
      exam_date: form.exam_date || null,
      physical_date: form.physical_date || null,
      medical_date: form.medical_date || null,
      education: form.education || null,
      apply_link: form.apply_link || null,
      documents: form.documents || null,
      selection_process: form.selection_process || null,
      physical_measurements: form.physical_measurements || null,
      medical_criteria: form.medical_criteria || null,
      vacancy_details: form.vacancy_details || null,
      application_fee: form.application_fee || null,
      age_criteria: form.age_criteria,
      fee_criteria: form.fee_criteria,
    }
    if (editId) await supabase.from('jobs').update(data).eq('id', editId)
    else await supabase.from('jobs').insert(data)
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('jobs').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(job) {
    setForm({
      category_id: job.category_id || '',
      title: job.title || '',
      description: job.description || '',
      published_date: job.published_date || '',
      last_date: job.last_date || '',
      exam_date: job.exam_date || '',
      physical_date: job.physical_date || '',
      medical_date: job.medical_date || '',
      education: job.education || '',
      apply_link: job.apply_link || '',
      documents: job.documents || '',
      selection_process: job.selection_process || '',
      physical_measurements: job.physical_measurements || '',
      medical_criteria: job.medical_criteria || '',
      vacancy_details: job.vacancy_details || '',
      application_fee: job.application_fee || '',
      age_criteria: job.age_criteria || [{ category: 'General', min_age: '18', max_age: '25', relaxation: '-' }],
      fee_criteria: job.fee_criteria || [{ category: 'General/OBC', fee: '100' }],
    })
    setEditId(job.id)
    setShowForm(true)
  }

  const smallInput = { padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' }
  const sections = [
    { key: 'basic', label: '📋 Basic' },
    { key: 'dates', label: '📅 Dates' },
    { key: 'age', label: '👤 Age' },
    { key: 'fee', label: '💰 Fee' },
    { key: 'details', label: '📄 Details' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>💼 Jobs</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit Job' : 'Naya Job'}</h2>

          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {sections.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)} style={{ padding: '5px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem', fontFamily: 'Poppins, sans-serif', background: activeSection === s.key ? '#1a3c8f' : '#f1f5f9', color: activeSection === s.key ? 'white' : '#64748b' }}>
                {s.label}
              </button>
            ))}
          </div>

          {activeSection === 'basic' && (
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
                <option value="">Select</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Job title" />
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              <label style={labelStyle}>Education</label>
              <input style={inputStyle} value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))} placeholder="10th/12th/Graduate" />
              <label style={labelStyle}>Vacancy Details</label>
              <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={form.vacancy_details} onChange={e => setForm(p => ({ ...p, vacancy_details: e.target.value }))} />
              <label style={labelStyle}>Apply Link</label>
              <input style={inputStyle} value={form.apply_link} onChange={e => setForm(p => ({ ...p, apply_link: e.target.value }))} placeholder="https://..." />
            </div>
          )}

          {activeSection === 'dates' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[['published_date','📅 Published'],['last_date','⏰ Last Date'],['exam_date','📆 Exam'],['physical_date','🏃 Physical'],['medical_date','🏥 Medical']].map(([key, lbl]) => (
                <div key={key}>
                  <label style={labelStyle}>{lbl}</label>
                  <input style={inputStyle} type="date" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'age' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Age Criteria</label>
                <button onClick={() => setForm(p => ({ ...p, age_criteria: [...p.age_criteria, { category: '', min_age: '', max_age: '', relaxation: '' }] }))} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ Row</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      {['Category', 'Min', 'Max', 'Relaxation', ''].map(h => <th key={h} style={{ padding: '8px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {form.age_criteria.map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: '4px' }}><input style={smallInput} value={row.category} onChange={e => { const u = [...form.age_criteria]; u[i].category = e.target.value; setForm(p => ({ ...p, age_criteria: u })) }} /></td>
                        <td style={{ padding: '4px' }}><input style={smallInput} type="number" value={row.min_age} onChange={e => { const u = [...form.age_criteria]; u[i].min_age = e.target.value; setForm(p => ({ ...p, age_criteria: u })) }} /></td>
                        <td style={{ padding: '4px' }}><input style={smallInput} type="number" value={row.max_age} onChange={e => { const u = [...form.age_criteria]; u[i].max_age = e.target.value; setForm(p => ({ ...p, age_criteria: u })) }} /></td>
                        <td style={{ padding: '4px' }}><input style={smallInput} value={row.relaxation} onChange={e => { const u = [...form.age_criteria]; u[i].relaxation = e.target.value; setForm(p => ({ ...p, age_criteria: u })) }} /></td>
                        <td style={{ padding: '4px' }}><button onClick={() => setForm(p => ({ ...p, age_criteria: p.age_criteria.filter((_, j) => j !== i) }))} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'fee' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Fee Criteria</label>
                <button onClick={() => setForm(p => ({ ...p, fee_criteria: [...p.fee_criteria, { category: '', fee: '' }] }))} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ Row</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    {['Category', 'Fee (₹)', ''].map(h => <th key={h} style={{ padding: '8px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {form.fee_criteria.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: '4px' }}><input style={smallInput} value={row.category} onChange={e => { const u = [...form.fee_criteria]; u[i].category = e.target.value; setForm(p => ({ ...p, fee_criteria: u })) }} /></td>
                      <td style={{ padding: '4px' }}><input style={smallInput} value={row.fee} onChange={e => { const u = [...form.fee_criteria]; u[i].fee = e.target.value; setForm(p => ({ ...p, fee_criteria: u })) }} /></td>
                      <td style={{ padding: '4px' }}><button onClick={() => setForm(p => ({ ...p, fee_criteria: p.fee_criteria.filter((_, j) => j !== i) }))} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'details' && (
            <div>
              {[['selection_process','📋 Selection Process'],['documents','📄 Documents'],['physical_measurements','🏃 Physical'],['medical_criteria','🏥 Medical']].map(([key, lbl]) => (
                <div key={key}>
                  <label style={labelStyle}>{lbl}</label>
                  <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : jobs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jobs.map(job => (
            <div key={job.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{job.job_categories?.name}</span>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', marginTop: '4px' }}>{job.title}</p>
                  {job.last_date && <p style={{ fontSize: '0.72rem', color: '#ef4444' }}>Last: {job.last_date}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(job)} style={btnEdit}>Edit</button>
                  <button onClick={() => handleDelete(job.id)} style={btnDelete}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}><p style={{ fontSize: '2rem' }}>💼</p><p>Koi job nahi</p></div>
      )}
    </div>
  )
}
