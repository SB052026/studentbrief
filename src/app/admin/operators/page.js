'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, btnSecondary, btnEdit, btnDelete, pageTitle, emptyState } from '@/lib/adminStyles'

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [activeTab, setActiveTab] = useState('operators')
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'content' })

  async function fetchAll() {
    const supabase = createClient()
const [{ data: ops }, { data: acts }] = await Promise.all([
      supabase.from('operators').select('*').order('created_at'),
      supabase.from('operator_activity').select('*, operators(name, username, role)').order('login_time', { ascending: false }).limit(20),
    ])
    setOperators(ops || [])
    setActivities(acts || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  function resetForm() {
    setForm({ name: '', username: '', password: '', role: 'content' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.name || !form.username || !form.password) return alert('Saare fields zaroori hain!')
    setSaving(true)
    const supabase = createClient()
    if (editId) await supabase.from('operators').update({ name: form.name, username: form.username, password: form.password, role: form.role }).eq('id', editId)
    else await supabase.from('operators').insert({ name: form.name, username: form.username, password: form.password, role: form.role })
    await fetchAll()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete karna chahte hain?')) return
    await createClient().from('operators').delete().eq('id', id)
    await fetchAll()
  }

  async function handleToggle(id, status) {
    await createClient().from('operators').update({ is_active: !status }).eq('id', id)
    await fetchAll()
  }

  async function handleUnblock(id) {
    if (!confirm('Unblock karna chahte hain?')) return
    await createClient().from('operators').update({ is_blocked: false, failed_attempts: 0, blocked_at: null }).eq('id', id)
    await fetchAll()
  }

  async function handleForceLogout(activityId) {
    await createClient().from('operator_activity').update({ logout_time: new Date().toISOString(), is_active: false }).eq('id', activityId)
    await fetchAll()
  }

  function handleEdit(op) {
    setForm({ name: op.name, username: op.username, password: op.password, role: op.role })
    setEditId(op.id)
    setShowForm(true)
  }

  const roleColors = { content: '#dbeafe', pyp: '#cffafe', mock: '#ede9fe' }
  const roleText = { content: '#1e40af', pyp: '#0e7490', mock: '#5b21b6' }
  const roleLabel = { content: 'Content', pyp: 'PYP', mock: 'Mock' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>👥 Operators</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>+ New</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[{ key: 'operators', label: '👥 Operators' }, { key: 'activity', label: '🔴 Activity' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Edit' : 'Naya'} Operator</h2>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Operator name" />
          <label style={labelStyle}>Username</label>
          <input style={inputStyle} value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="Username" autoComplete="off" />
          <label style={labelStyle}>Password</label>
          <input style={inputStyle} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Password" />
          <label style={labelStyle}>Role</label>
          <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={inputStyle}>
            <option value="content">📋 Content (Jobs, Results, Answer Keys, Admit Cards, Syllabus)</option>
            <option value="pyp">📄 PYP (Previous Year Papers)</option>
            <option value="mock">🧪 Mock Test (Mock Test + Subject Mock)</option>
          </select>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          </div>
        </div>
      )}

      {activeTab === 'operators' && (
        loading ? <div style={emptyState}>Loading...</div> : operators.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {operators.map(op => (
              <div key={op.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{op.name}</p>
                      <span style={{ background: roleColors[op.role], color: roleText[op.role], padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{roleLabel[op.role]}</span>
                      <span style={{ background: op.is_active ? '#dcfce7' : '#fee2e2', color: op.is_active ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{op.is_active ? 'Active' : 'Inactive'}</span>
                      {op.is_blocked && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>⛔ Blocked</span>}
                      {op.failed_attempts > 0 && !op.is_blocked && <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>⚠️ {op.failed_attempts} attempts</span>}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b' }}>👤 {op.username} • 🔑 {op.password}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flexShrink: 0 }}>
                    <button onClick={() => handleEdit(op)} style={btnEdit}>Edit</button>
                    <button onClick={() => handleToggle(op.id, op.is_active)} style={{ background: op.is_active ? '#fef3c7' : '#dcfce7', color: op.is_active ? '#92400e' : '#166534', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                      {op.is_active ? 'Disable' : 'Enable'}
                    </button>
                    {op.is_blocked && <button onClick={() => handleUnblock(op.id)} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>✅ Unblock</button>}
                    <button onClick={() => handleDelete(op.id)} style={btnDelete}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <div style={emptyState}><p style={{ fontSize: '2rem' }}>👥</p><p>Koi operator nahi</p></div>
      )}

      {activeTab === 'activity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activities.filter(a => a.is_active).length > 0 && (
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1rem', border: '1px solid #bbf7d0', marginBottom: '0.5rem' }}>
              <p style={{ fontWeight: 700, color: '#166534', fontSize: '0.85rem', marginBottom: '0.75rem' }}>🟢 Online Now</p>
              {activities.filter(a => a.is_active).map(act => (
                <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.82rem' }}>{act.operators?.name}</p>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📱 {act.device}</p>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📍 {act.location_name?.substring(0, 50)}</p>
                    <p style={{ fontSize: '0.65rem', color: '#22c55e' }}>🟢 {new Date(act.login_time).toLocaleString('en-IN')}</p>
                  </div>
                  <button onClick={() => handleForceLogout(act.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', flexShrink: 0 }}>Force Logout</button>
                </div>
              ))}
            </div>
          )}

          <p style={{ fontWeight: 700, color: '#475569', fontSize: '0.82rem', marginBottom: '0.25rem' }}>📋 Recent Activity</p>
          {activities.filter(a => !a.is_active).slice(0, 10).map(act => (
            <div key={act.id} style={{ background: 'white', borderRadius: '12px', padding: '0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.82rem' }}>{act.operators?.name} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({act.operators?.username})</span></p>
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📍 {act.location_name?.substring(0, 50)}</p>
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📱 {act.device}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
                <p style={{ fontSize: '0.65rem', color: '#22c55e' }}>🟢 {new Date(act.login_time).toLocaleString('en-IN')}</p>
                {act.logout_time && <p style={{ fontSize: '0.65rem', color: '#ef4444' }}>🔴 {new Date(act.logout_time).toLocaleString('en-IN')}</p>}
                {act.login_time && act.logout_time && <p style={{ fontSize: '0.65rem', color: '#f97316' }}>⏱️ {Math.round((new Date(act.logout_time) - new Date(act.login_time)) / 60000)} min</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
