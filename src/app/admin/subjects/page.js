'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [sections, setSections] = useState([])
  const [subsections, setSubsections] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('subjects')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', icon: '', color: '#1a3c8f', subject_id: '', topic_id: '', section_id: '' })

  async function fetchAll() {
    const supabase = createClient()
    const [{ data: s }, { data: t }, { data: sec }, { data: sub }] = await Promise.all([
      supabase.from('mock_subjects').select('*').order('name'),
      supabase.from('mock_topics').select('*, mock_subjects(name)').order('name'),
      supabase.from('mock_sections').select('*, mock_topics(name)').order('name'),
      supabase.from('mock_subsections').select('*, mock_sections(name)').order('name'),
    ])
    setSubjects(s || [])
    setTopics(t || [])
    setSections(sec || [])
    setSubsections(sub || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  function resetForm() {
    setForm({ name: '', icon: '', color: '#1a3c8f', subject_id: '', topic_id: '', section_id: '' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.name) return alert('Name zaroori hai!')
    setSaving(true)
    const supabase = createClient()
    if (activeTab === 'subjects') {
      const d = { name: form.name, icon: form.icon || '📚', color: form.color }
      if (editId) await supabase.from('mock_subjects').update(d).eq('id', editId)
      else await supabase.from('mock_subjects').insert(d)
    } else if (activeTab === 'topics') {
      if (!form.subject_id) return alert('Subject select karo!')
      const d = { name: form.name, icon: form.icon || '📖', subject_id: form.subject_id }
      if (editId) await supabase.from('mock_topics').update(d).eq('id', editId)
      else await supabase.from('mock_topics').insert(d)
    } else if (activeTab === 'sections') {
      if (!form.topic_id) return alert('Topic select karo!')
      const d = { name: form.name, icon: form.icon || '📝', topic_id: form.topic_id }
      if (editId) await supabase.from('mock_sections').update(d).eq('id', editId)
      else await supabase.from('mock_sections').insert(d)
    } else {
      if (!form.section_id) return alert('Section select karo!')
      const d = { name: form.name, icon: form.icon || '📌', section_id: form.section_id }
      if (editId) await supabase.from('mock_subsections').update(d).eq('id', editId)
      else await supabase.from('mock_subsections').insert(d)
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
    setForm({ name: item.name || '', icon: item.icon || '', color: item.color || '#1a3c8f', subject_id: item.subject_id || '', topic_id: item.topic_id || '', section_id: item.section_id || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  const tabs = [
    { key: 'subjects', label: '📚 Subjects' },
    { key: 'topics', label: '📖 Topics' },
    { key: 'sections', label: '📝 Sections' },
    { key: 'subsections', label: '📌 Sub-sections' },
  ]

  const tableMap = { subjects: 'mock_subjects', topics: 'mock_topics', sections: 'mock_sections', subsections: 'mock_subsections' }
  const currentData = { subjects, topics, sections, subsections }[activeTab]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>🎯 Subject Mock</h1>
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
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit' : 'Naya'}</h2>

          {activeTab === 'topics' && (
            <>
              <label style={labelStyle}>Subject *</label>
              <select value={form.subject_id} onChange={e => setForm(p => ({ ...p, subject_id: e.target.value }))} style={inputStyle}>
                <option value="">Select</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </>
          )}
          {activeTab === 'sections' && (
            <>
              <label style={labelStyle}>Topic *</label>
              <select value={form.topic_id} onChange={e => setForm(p => ({ ...p, topic_id: e.target.value }))} style={inputStyle}>
                <option value="">Select</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.mock_subjects?.name} → {t.name}</option>)}
              </select>
            </>
          )}
          {activeTab === 'subsections' && (
            <>
              <label style={labelStyle}>Section *</label>
              <select value={form.section_id} onChange={e => setForm(p => ({ ...p, section_id: e.target.value }))} style={inputStyle}>
                <option value="">Select</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.mock_topics?.name} → {s.name}</option>)}
              </select>
            </>
          )}

          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Name likhein..." />
          <label style={labelStyle}>Icon (Emoji)</label>
          <input style={inputStyle} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="e.g. 📚" />
          {activeTab === 'subjects' && (
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
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {item.mock_subjects?.name && `${item.mock_subjects.name} → `}
                    {item.mock_topics?.name && `${item.mock_topics.name} → `}
                    {item.mock_sections?.name && `${item.mock_sections.name} → `}
                    {item.name}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={btnEdit}>Edit</button>
                <button onClick={() => handleDelete(tableMap[activeTab], item.id)} style={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div style={emptyState}><p style={{ fontSize: '2rem' }}>📚</p><p>Koi data nahi</p></div>}
    </div>
  )
}
