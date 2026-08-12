'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', image_url: '', video_url: '', link: '', order_no: '0', is_active: true })

  async function fetchArticles() {
    const supabase = createClient()
    const { data } = await supabase.from('articles').select('*').order('order_no')
    setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  function resetForm() {
    setForm({ title: '', description: '', image_url: '', video_url: '', link: '', order_no: '0', is_active: true })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.title) return alert('Title zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = {
      title: form.title,
      description: form.description || null,
      image_url: form.image_url || null,
      video_url: form.video_url || null,
      link: form.link || null,
      order_no: parseInt(form.order_no) || 0,
      is_active: form.is_active,
    }
    if (editId) await supabase.from('articles').update(data).eq('id', editId)
    else await supabase.from('articles').insert(data)
    await fetchArticles()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('articles').delete().eq('id', id)
    await fetchArticles()
  }

  function handleEdit(item) {
    setForm({
      title: item.title || '',
      description: item.description || '',
      image_url: item.image_url || '',
      video_url: item.video_url || '',
      link: item.link || '',
      order_no: String(item.order_no || 0),
      is_active: item.is_active !== false,
    })
    setEditId(item.id)
    setShowForm(true)
  }

  async function uploadImage(file) {
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const fileName = Date.now() + '-' + file.name.replace(/[^a-z0-9.]/gi, '_')
    const { error } = await supabase.storage.from('question-images').upload(fileName, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('question-images').getPublicUrl(fileName)
      setForm(p => ({ ...p, image_url: data.publicUrl }))
    }
    setUploading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>📰 Articles & Updates</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New Article</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '0.95rem' }}>{editId ? 'Edit' : 'New'} Article</h2>

          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Article title" />

          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description..." />

          <label style={labelStyle}>🖼️ Image Upload</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
            <input type="file" accept="image/*" style={{ flex: 1, fontSize: '0.78rem' }} onChange={e => uploadImage(e.target.files[0])} />
            {uploading && <span style={{ fontSize: '0.72rem', color: '#1a3c8f' }}>Uploading...</span>}
            {form.image_url && <img src={form.image_url} alt="preview" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />}
          </div>

          <label style={labelStyle}>🖼️ Image URL (ya upar se upload karo)</label>
          <input style={inputStyle} value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />

          <label style={labelStyle}>🎥 Video URL (Optional)</label>
          <input style={inputStyle} value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))} placeholder="https://... (.mp4)" />

          <label style={labelStyle}>🔗 Link (Click karne par kahan jayega)</label>
          <input style={inputStyle} value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} placeholder="https://..." />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={labelStyle}>Order No</label>
              <input style={inputStyle} type="number" value={form.order_no} onChange={e => setForm(p => ({ ...p, order_no: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}>
                <option value="true">✅ Active</option>
                <option value="false">❌ Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={handleSave} disabled={saving || uploading} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={emptyState}>Loading...</div> : articles.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {articles.map(article => (
            <div key={article.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '70px', height: '52px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</p>
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Order: {article.order_no} • {article.is_active ? '✅ Active' : '❌ Inactive'}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => handleEdit(article)} style={btnEdit}>Edit</button>
                <button onClick={() => handleDelete(article.id)} style={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}>
          <p style={{ fontSize: '2rem' }}>📰</p>
          <p>Koi article nahi hai</p>
        </div>
      )}
    </div>
  )
}
