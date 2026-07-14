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
    physical_date: '', medical_date: '',
    education: '', apply_link: '',
    documents: '', selection_process: '',
    physical_measurements: '', medical_criteria: '',
    vacancy_details: '', application_fee: '',
    age_criteria: [{ category: 'General', min_age: '18', max_age: '25', relaxation: '-' }],
    fee_criteria: [{ category: 'General/OBC', fee: '100' }, { category: 'SC/ST/PH', fee: '0' }, { category: 'Female', fee: '0' }],
  })

  async function fetchData() {
    const supabase = createClient()
    const { data: jobsData } = await supabase.from('jobs').select('*, job_categories(name)').order('created_at', { ascending: false })
    const { data: catsData } = await supabase.from('job_categories').select('*').order('name')
    setJobs(jobsData || [])
    setCategories(catsData || [])
    setLoading(false)
  }

  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    checkPermission('jobs').then(allowed => {
      if (!allowed) window.location.replace('/operator')
      setHasPermission(allowed)
    }); fetchData() }, [])

  function resetForm() {
    setForm({
      category_id: '', title: '', description: '',
      published_date: '', last_date: '', exam_date: '',
      physical_date: '', medical_date: '',
      education: '', apply_link: '',
      documents: '', selection_process: '',
      physical_measurements: '', medical_criteria: '',
      vacancy_details: '', application_fee: '',
      age_criteria: [{ category: 'General', min_age: '18', max_age: '25', relaxation: '-' }],
      fee_criteria: [{ category: 'General/OBC', fee: '100' }, { category: 'SC/ST/PH', fee: '0' }, { category: 'Female', fee: '0' }],
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
      category_id: form.category_id,
      title: form.title,
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
      fee_criteria: job.fee_criteria || [{ category: 'General/OBC', fee: '100' }, { category: 'SC/ST/PH', fee: '0' }],
    })
    setEditId(job.id)
    setShowForm(true)
  }

  function addAgeRow() {
    setForm(p => ({ ...p, age_criteria: [...p.age_criteria, { category: '', min_age: '', max_age: '', relaxation: '' }] }))
  }

  function updateAgeRow(index, field, value) {
    const updated = [...form.age_criteria]
    updated[index][field] = value
    setForm(p => ({ ...p, age_criteria: updated }))
  }

  function removeAgeRow(index) {
    setForm(p => ({ ...p, age_criteria: p.age_criteria.filter((_, i) => i !== index) }))
  }

  function addFeeRow() {
    setForm(p => ({ ...p, fee_criteria: [...p.fee_criteria, { category: '', fee: '' }] }))
  }

  function updateFeeRow(index, field, value) {
    const updated = [...form.fee_criteria]
    updated[index][field] = value
    setForm(p => ({ ...p, fee_criteria: updated }))
  }

  function removeFeeRow(index) {
    setForm(p => ({ ...p, fee_criteria: p.fee_criteria.filter((_, i) => i !== index) }))
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>💼 Jobs Manage Karo</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Job
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Job Edit Karo' : 'Naya Job Add Karo'}</h2>

          {/* Section Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {sections.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)} style={{ padding: '5px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem', fontFamily: 'Poppins, sans-serif', background: activeSection === s.key ? '#1a3c8f' : '#f1f5f9', color: activeSection === s.key ? 'white' : '#64748b' }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Basic Info */}
          {activeSection === 'basic' && (
            <div>
              <label style={labelStyle}>📁 Category *</label>
              <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
                <option value="">Category Select Karo</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label style={labelStyle}>📝 Job Title *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. SSC CGL Recruitment 2025" />
              <label style={labelStyle}>📄 Description</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Job description likhein..." />
              <label style={labelStyle}>🎓 Education Qualification</label>
              <input style={inputStyle} value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))} placeholder="e.g. 10th/12th/Graduate" />
              <label style={labelStyle}>📊 Vacancy Details</label>
              <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={form.vacancy_details} onChange={e => setForm(p => ({ ...p, vacancy_details: e.target.value }))} placeholder="e.g. Total: 5000, General: 2500..." />
              <label style={labelStyle}>🔗 Apply Link</label>
              <input style={inputStyle} value={form.apply_link} onChange={e => setForm(p => ({ ...p, apply_link: e.target.value }))} placeholder="https://..." />
            </div>
          )}

          {/* Dates */}
          {activeSection === 'dates' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div><label style={labelStyle}>📅 Published Date</label><input style={inputStyle} type="date" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} /></div>
                <div><label style={labelStyle}>⏰ Last Date</label><input style={inputStyle} type="date" value={form.last_date} onChange={e => setForm(p => ({ ...p, last_date: e.target.value }))} /></div>
                <div><label style={labelStyle}>📆 Exam Date</label><input style={inputStyle} type="date" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} /></div>
                <div><label style={labelStyle}>🏃 Physical Date</label><input style={inputStyle} type="date" value={form.physical_date} onChange={e => setForm(p => ({ ...p, physical_date: e.target.value }))} /></div>
                <div><label style={labelStyle}>🏥 Medical Date</label><input style={inputStyle} type="date" value={form.medical_date} onChange={e => setForm(p => ({ ...p, medical_date: e.target.value }))} /></div>
              </div>
            </div>
          )}

          {/* Age Criteria */}
          {activeSection === 'age' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>👤 Age Limit (Category Wise)</label>
                <button onClick={addAgeRow} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ Row Add</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Category</th>
                      <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Min Age</th>
                      <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Max Age</th>
                      <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Relaxation</th>
                      <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.age_criteria.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px' }}><input style={smallInput} value={row.category} onChange={e => updateAgeRow(i, 'category', e.target.value)} placeholder="General" /></td>
                        <td style={{ padding: '6px' }}><input style={smallInput} type="number" value={row.min_age} onChange={e => updateAgeRow(i, 'min_age', e.target.value)} placeholder="18" /></td>
                        <td style={{ padding: '6px' }}><input style={smallInput} type="number" value={row.max_age} onChange={e => updateAgeRow(i, 'max_age', e.target.value)} placeholder="25" /></td>
                        <td style={{ padding: '6px' }}><input style={smallInput} value={row.relaxation} onChange={e => updateAgeRow(i, 'relaxation', e.target.value)} placeholder="3 Years" /></td>
                        <td style={{ padding: '6px', textAlign: 'center' }}><button onClick={() => removeAgeRow(i)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Poppins, sans-serif' }}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fee Criteria */}
          {activeSection === 'fee' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>💰 Application Fee (Category Wise)</label>
                <button onClick={addFeeRow} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ Row Add</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Category</th>
                      <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Fee (₹)</th>
                      <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.fee_criteria.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px' }}><input style={smallInput} value={row.category} onChange={e => updateFeeRow(i, 'category', e.target.value)} placeholder="General/OBC" /></td>
                        <td style={{ padding: '6px' }}><input style={smallInput} value={row.fee} onChange={e => updateFeeRow(i, 'fee', e.target.value)} placeholder="100" /></td>
                        <td style={{ padding: '6px', textAlign: 'center' }}><button onClick={() => removeFeeRow(i)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Poppins, sans-serif' }}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Details */}
          {activeSection === 'details' && (
            <div>
              <label style={labelStyle}>📋 Selection Process</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={form.selection_process} onChange={e => setForm(p => ({ ...p, selection_process: e.target.value }))} placeholder="e.g. Written Test, Physical Test, Medical Test, Document Verification" />
              <label style={labelStyle}>📄 Required Documents</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={form.documents} onChange={e => setForm(p => ({ ...p, documents: e.target.value }))} placeholder="e.g. Aadhar Card, 10th Marksheet, Photo..." />
              <label style={labelStyle}>🏃 Physical Measurements</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={form.physical_measurements} onChange={e => setForm(p => ({ ...p, physical_measurements: e.target.value }))} placeholder="e.g. Height: 168cm, Chest: 77-82cm..." />
              <label style={labelStyle}>🏥 Medical Criteria</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={form.medical_criteria} onChange={e => setForm(p => ({ ...p, medical_criteria: e.target.value }))} placeholder="e.g. Good eyesight, No major illness..." />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
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
                  <button onClick={() => handleEdit(job)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Edit</button>
                  <button onClick={() => handleDelete(job.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Delete</button>
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
