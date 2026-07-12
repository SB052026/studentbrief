'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminMockCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('categories')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '', color: '#1a3c8f', category_id: '' })

  async function fetchAll() {
    const supabase = createClient()
    const [{ data: c }, { data: s }] = await Promise.all([
      supabase.from('mock_categories').select('*').order('name'),
      supabase.from('mock_subcategories').select('*, mock_categories(name)').order('name'),
    ])
    setCategories(c || [])
    setSubcategories(s || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  function resetForm() {
    setForm({ name: '', icon: '', color: '#1a3c8f', category_id: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.name) return alert('Name zaroori hai!')
    if (activeTab === 'subcategories' && !form.category_id) return alert('Category select karo!')
    setSaving(true)
    const supabase = createClient()
    if (activeTab === 'categories') {
      const d = { name: form.name, icon: form.icon || '📋', color: form.color || '#1a3c8f' }
      if (editId) await supabase.from('mock_categories').update(d).eq('id', editId)
      else await supabase.from('mock_categories').insert(d)
    } else {
      const d = { name: form.name, icon: form.icon || '📝', category_id: form.category_id }
      if (editId) await supabase.from('mock_subcategories').update(d).eq('id', editId)
      else await supabase.from('mock_subcategories').insert(d)
    }
    await fetchAll()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(table, id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from(table).delete().eq('id', id)
    await fetchAll()
  }

  function handleEdit(item) {
    setForm({ name: item.name || '', icon: item.icon || '', color: item.color || '#1a3c8f', category_id: item.category_id || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  const currentData = activeTab === 'categories' ? categories : subcategories

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>📁 Mock Categories</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[{ key: 'categories', label: '📁 Categories' }, { key: 'subcategories', label: '📋 Sub-Categories' }].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); resetForm() }} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit' : 'Naya'} {activeTab === 'categories' ? 'Category' : 'Sub-Category'}</h2>
          {activeTab === 'subcategories' && (
            <>
              <label style={labelStyle}>Category *</label>
              <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
                <option value="">Select</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </>
          )}
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Name likhein..." />
          <label style={labelStyle}>Icon (Emoji)</label>
          <input style={inputStyle} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="e.g. 🚂" />
          {activeTab === 'categories' && (
            <>
              <label style={labelStyle}>Color</label>
              <input style={{ ...inputStyle, padding: '6px', height: '44px' }} type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
            </>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : currentData.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentData.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{item.name}</p>
                  {item.mock_categories && <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.mock_categories.name}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={btnEdit}>Edit</button>
                <button onClick={() => handleDelete(activeTab === 'categories' ? 'mock_categories' : 'mock_subcategories', item.id)} style={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div style={emptyState}><p style={{ fontSize: '2rem' }}>📁</p><p>Koi data nahi</p></div>}
    </div>
  )
}
