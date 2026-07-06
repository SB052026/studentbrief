'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminCategoriesPage() {
  const [jobCats, setJobCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [activeTab, setActiveTab] = useState('jobs')
  const [form, setForm] = useState({ name: '', slug: '', icon: '' })

  const tables = {
    jobs: 'job_categories',
    results: 'result_categories',
    answerkeys: 'answerkey_categories',
    admitcards: 'admitcard_categories',
  }

  async function fetchCats() {
    const supabase = createClient()
    const { data } = await supabase.from(tables[activeTab]).select('*').order('name')
    setJobCats(data || [])
    setLoading(false)
  }

  useEffect(() => { setLoading(true); fetchCats() }, [activeTab])

  function resetForm() {
    setForm({ name: '', slug: '', icon: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.name || !form.slug) return alert('Name aur Slug zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = { name: form.name, slug: form.slug, icon: form.icon || '📋' }
    if (editId) {
      await supabase.from(tables[activeTab]).update(data).eq('id', editId)
    } else {
      await supabase.from(tables[activeTab]).insert(data)
    }
    await fetchCats()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karne par is category ki saari items bhi delete ho sakti hain!')) return
    const supabase = createClient()
    await supabase.from(tables[activeTab]).delete().eq('id', id)
    await fetchCats()
  }

  function handleEdit(cat) {
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '' })
    setEditId(cat.id)
    setShowForm(true)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }

  const tabs = [
    { key: 'jobs', label: '💼 Jobs' },
    { key: 'results', label: '📋 Results' },
    { key: 'answerkeys', label: '📝 Answer Keys' },
    { key: 'admitcards', label: '🎫 Admit Cards' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>📁 Categories Manage Karo</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Category
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Category Edit Karo' : 'Naya Category Add Karo'}</h2>

          <label style={labelStyle}>📌 Category Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Railway Jobs" />

          <label style={labelStyle}>🔗 Slug * (URL me use hoga)</label>
          <input style={inputStyle} value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} placeholder="e.g. railway-jobs" />

          <label style={labelStyle}>🎨 Icon (Emoji)</label>
          <input style={inputStyle} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="e.g. 🚂" />

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: '#1a3c8f', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
              {saving ? 'Saving...' : editId ? 'Update Karo' : 'Save Karo'}
            </button>
            <button onClick={resetForm} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
      ) : jobCats.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jobCats.map(cat => (
            <div key={cat.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{cat.name}</p>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/{cat.slug}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(cat)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Edit</button>
                <button onClick={() => handleDelete(cat.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem' }}>📁</p>
          <p>Koi category nahi mili</p>
        </div>
      )}
    </div>
  )
}
