'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminAdmitCardsPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ category_id: '', title: '', exam_date: '', admit_card_link: '', description: '' })

  async function fetchData() {
    const supabase = createClient()
    const [{ data: a }, { data: c }] = await Promise.all([
      supabase.from('admitcards').select('*, admitcard_categories(name)').order('created_at', { ascending: false }),
      supabase.from('admitcard_categories').select('*').order('name'),
    ])
    setItems(a || [])
    setCategories(c || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({ category_id: '', title: '', exam_date: '', admit_card_link: '', description: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.title || !form.category_id) return alert('Title aur Category zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = { category_id: form.category_id, title: form.title, exam_date: form.exam_date || null, admit_card_link: form.admit_card_link || null, description: form.description || null }
    if (editId) await supabase.from('admitcards').update(data).eq('id', editId)
    else await supabase.from('admitcards').insert(data)
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('admitcards').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(item) {
    setForm({ category_id: item.category_id || '', title: item.title || '', exam_date: item.exam_date || '', admit_card_link: item.admit_card_link || '', description: item.description || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>🎫 Admit Cards</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit' : 'Naya'} Admit Card</h2>
          <label style={labelStyle}>Category *</label>
          <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
            <option value="">Select</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Admit card title" />
          <label style={labelStyle}>Exam Date</label>
          <input style={inputStyle} type="date" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} />
          <label style={labelStyle}>Admit Card Link</label>
          <input style={inputStyle} value={form.admit_card_link} onChange={e => setForm(p => ({ ...p, admit_card_link: e.target.value }))} placeholder="https://..." />
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, height: '60px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{item.admitcard_categories?.name}</span>
                <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', marginTop: '4px' }}>{item.title}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={btnEdit}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div style={emptyState}><p style={{ fontSize: '2rem' }}>🎫</p><p>Koi admit card nahi</p></div>}
    </div>
  )
}
