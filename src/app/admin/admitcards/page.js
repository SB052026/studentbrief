'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminAdmitCardsPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    category_id: '', title: '', published_date: '', exam_date: '',
    download_last_date: '', organization: '', post_name: '',
    admitcard_status: 'Released', admitcard_link: ''
  })

  async function fetchData() {
    const supabase = createClient()
    const { data: itemsData } = await supabase.from('admitcards').select('*, admitcard_categories(name)').order('created_at', { ascending: false })
    const { data: catsData } = await supabase.from('admitcard_categories').select('*').order('name')
    setItems(itemsData || [])
    setCategories(catsData || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({ category_id: '', title: '', published_date: '', exam_date: '', download_last_date: '', organization: '', post_name: '', admitcard_status: 'Released', admitcard_link: '' })
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
      download_last_date: form.download_last_date || null,
      organization: form.organization || null,
      post_name: form.post_name || null,
      admitcard_status: form.admitcard_status || 'Released',
      admitcard_link: form.admitcard_link || null,
    }
    if (editId) {
      await supabase.from('admitcards').update(data).eq('id', editId)
    } else {
      await supabase.from('admitcards').insert(data)
    }
    await fetchData()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('admitcards').delete().eq('id', id)
    await fetchData()
  }

  function handleEdit(item) {
    setForm({
      category_id: item.category_id || '',
      title: item.title || '',
      published_date: item.published_date || '',
      exam_date: item.exam_date || '',
      download_last_date: item.download_last_date || '',
      organization: item.organization || '',
      post_name: item.post_name || '',
      admitcard_status: item.admitcard_status || 'Released',
      admitcard_link: item.admitcard_link || '',
    })
    setEditId(item.id)
    setShowForm(true)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>🎫 Admit Cards Manage Karo</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Admit Card
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit Karo' : 'Naya Admit Card Add Karo'}</h2>

          <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={inputStyle}>
            <option value="">Category Select Karo *</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Admit Card Title *" />
          <input style={inputStyle} value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="Organization" />
          <input style={inputStyle} value={form.post_name} onChange={e => setForm(p => ({ ...p, post_name: e.target.value }))} placeholder="Post Name" />
          <select value={form.admitcard_status} onChange={e => setForm(p => ({ ...p, admitcard_status: e.target.value }))} style={inputStyle}>
            <option value="Released">Released</option>
            <option value="Expected">Expected</option>
            <option value="Pending">Pending</option>
          </select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <input style={inputStyle} type="date" value={form.published_date} onChange={e => setForm(p => ({ ...p, published_date: e.target.value }))} placeholder="Published Date" />
            <input style={inputStyle} type="date" value={form.exam_date} onChange={e => setForm(p => ({ ...p, exam_date: e.target.value }))} placeholder="Exam Date" />
            <input style={inputStyle} type="date" value={form.download_last_date} onChange={e => setForm(p => ({ ...p, download_last_date: e.target.value }))} placeholder="Download Last Date" />
          </div>
          <input style={inputStyle} value={form.admitcard_link} onChange={e => setForm(p => ({ ...p, admitcard_link: e.target.value }))} placeholder="Admit Card Link (https://...)" />

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
      ) : items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ background: '#fef9c3', color: '#713f12', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{item.admitcard_categories?.name}</span>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginTop: '4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{item.organization} • {item.admitcard_status}</p>
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
          <p style={{ fontSize: '2rem' }}>🎫</p>
          <p>Koi admit card nahi mila</p>
        </div>
      )}
    </div>
  )
}
