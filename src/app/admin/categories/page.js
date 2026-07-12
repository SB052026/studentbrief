'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState('job')
  const [data, setData] = useState({ job: [], result: [], answerkey: [], admitcard: [] })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', icon: '' })

  const tables = { job: 'job_categories', result: 'result_categories', answerkey: 'answerkey_categories', admitcard: 'admitcard_categories' }
  const tabs = [
    { key: 'job', label: '💼 Jobs' },
    { key: 'result', label: '📋 Results' },
    { key: 'answerkey', label: '📝 Answer Keys' },
    { key: 'admitcard', label: '🎫 Admit Cards' },
  ]

  async function fetchAll() {
    const supabase = createClient()
    const [{ data: j }, { data: r }, { data: a }, { data: ac }] = await Promise.all([
      supabase.from('job_categories').select('*').order('name'),
      supabase.from('result_categories').select('*').order('name'),
      supabase.from('answerkey_categories').select('*').order('name'),
      supabase.from('admitcard_categories').select('*').order('name'),
    ])
    setData({ job: j || [], result: r || [], answerkey: a || [], admitcard: ac || [] })
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  function resetForm() {
    setForm({ name: '', slug: '', icon: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.name) return alert('Name zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-')
    const d = { name: form.name, slug, icon: form.icon || '📋' }
    if (editId) await supabase.from(tables[activeTab]).update(d).eq('id', editId)
    else await supabase.from(tables[activeTab]).insert(d)
    await fetchAll()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from(tables[activeTab]).delete().eq('id', id)
    await fetchAll()
  }

  function handleEdit(item) {
    setForm({ name: item.name || '', slug: item.slug || '', icon: item.icon || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>📁 Categories</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); resetForm() }} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit' : 'Naya'} Category</h2>
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Category name" />
          <label style={labelStyle}>Slug (auto-generate hoga)</label>
          <input style={inputStyle} value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="e.g. railway-jobs" />
          <label style={labelStyle}>Icon (Emoji)</label>
          <input style={inputStyle} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="e.g. 🚂" />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : data[activeTab].length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data[activeTab].map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{item.name}</p>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.slug}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={btnEdit}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div style={emptyState}><p style={{ fontSize: '2rem' }}>📁</p><p>Koi category nahi</p></div>}
    </div>
  )
}
