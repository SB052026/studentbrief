'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ question: '', answer: '', order_no: '0', is_active: true })

  async function fetchFaqs() {
    const supabase = createClient()
    const { data } = await supabase.from('faqs').select('*').order('order_no')
    setFaqs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchFaqs() }, [])

  function resetForm() {
    setForm({ question: '', answer: '', order_no: '0', is_active: true })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.question) return alert('Question zaroori hai!')
    if (!form.answer) return alert('Answer zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    const data = { question: form.question, answer: form.answer, order_no: parseInt(form.order_no) || 0, is_active: form.is_active }
    if (editId) await supabase.from('faqs').update(data).eq('id', editId)
    else await supabase.from('faqs').insert(data)
    await fetchFaqs()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('faqs').delete().eq('id', id)
    await fetchFaqs()
  }

  function handleEdit(item) {
    setForm({ question: item.question, answer: item.answer, order_no: String(item.order_no || 0), is_active: item.is_active !== false })
    setEditId(item.id)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>❓ FAQs</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New FAQ</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '0.95rem' }}>{editId ? 'Edit' : 'New'} FAQ</h2>
          <label style={labelStyle}>Question *</label>
          <input style={inputStyle} value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Question likhein..." />
          <label style={labelStyle}>Answer *</label>
          <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} placeholder="Answer likhein..." />
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

      {loading ? <div style={emptyState}>Loading...</div> : faqs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map(faq => (
            <div key={faq.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', marginBottom: '4px' }}>Q: {faq.question}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>A: {faq.answer}</p>
                  <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>Order: {faq.order_no} • {faq.is_active ? '✅ Active' : '❌ Inactive'}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(faq)} style={btnEdit}>Edit</button>
                  <button onClick={() => handleDelete(faq.id)} style={btnDelete}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}><p style={{ fontSize: '2rem' }}>❓</p><p>Koi FAQ nahi hai</p></div>
      )}
    </div>
  )
}
