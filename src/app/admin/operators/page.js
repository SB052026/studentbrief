'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  const [showPassChange, setShowPassChange] = useState(false)
  const [newAdminPass, setNewAdminPass] = useState('')
  const [newAdminUser, setNewAdminUser] = useState('')
  const [adminMsg, setAdminMsg] = useState('')
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'content' })

  async function fetchOperators() {
    const supabase = createClient()
    const { data } = await supabase.from('operators').select('*').order('created_at')
    const { data: acts } = await supabase
      .from('operator_activity')
      .select('*, operators(name, username, role)')
      .order('login_time', { ascending: false })
      .limit(20)
    setOperators(data || [])
    setActivities(acts || [])
    setLoading(false)
  }

  async function handleUnblock(id) {
    if (!confirm('Operator ko unblock karna chahte hain?')) return
    const supabase = createClient()
    await supabase.from('operators').update({
      is_blocked: false,
      failed_attempts: 0,
      blocked_at: null
    }).eq('id', id)
    await fetchOperators()
  }

  async function handleForceLogout(activityId) {
    const supabase = createClient()
    await supabase.from('operator_activity').update({
      logout_time: new Date().toISOString(),
      is_active: false
    }).eq('id', activityId)
    await fetchOperators()
  }

  useEffect(() => { fetchOperators() }, [])

  function resetForm() {
    setForm({ name: '', username: '', password: '', role: 'content' })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSave() {
    if (!form.name || !form.username || !form.password) return alert('Saare fields zaroori hain!')
    setSaving(true)
    const supabase = createClient()
    if (editId) {
      await supabase.from('operators').update({ name: form.name, username: form.username, password: form.password, role: form.role }).eq('id', editId)
    } else {
      await supabase.from('operators').insert({ name: form.name, username: form.username, password: form.password, role: form.role })
    }
    await fetchOperators()
    resetForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Operator delete karna chahte hain?')) return
    const supabase = createClient()
    await supabase.from('operators').delete().eq('id', id)
    await fetchOperators()
  }

  async function handleToggle(id, status) {
    const supabase = createClient()
    await supabase.from('operators').update({ is_active: !status }).eq('id', id)
    await fetchOperators()
  }

  function handleEdit(op) {
    setForm({ name: op.name, username: op.username, password: op.password, role: op.role })
    setEditId(op.id)
    setShowForm(true)
  }

  async function handleAdminPassChange() {
    if (!newAdminPass && !newAdminUser) return alert('Kuch to bharo!')
    const ADMIN_ID = 'Admin'
    const ADMIN_PASS = 'Admin@07'
    // Save in localStorage for now
    if (newAdminUser) localStorage.setItem('sb_admin_username', newAdminUser)
    if (newAdminPass) localStorage.setItem('sb_admin_password', newAdminPass)
    setAdminMsg('✅ Admin credentials update ho gaye!')
    setNewAdminPass('')
    setNewAdminUser('')
    setTimeout(() => setAdminMsg(''), 3000)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }

  const roleColors = { content: '#dbeafe', pyp: '#cffafe', mock: '#ede9fe' }
  const roleText = { content: '#1e40af', pyp: '#0e7490', mock: '#5b21b6' }
  const roleLabel = { content: 'Content', pyp: 'PYP', mock: 'Mock Test' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>👥 Operators Manage Karo</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          + New Operator
        </button>
      </div>

      {/* Admin Password Change */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPassChange ? '1rem' : 0 }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem' }}>🔑 Admin Credentials Change</h2>
          <button onClick={() => setShowPassChange(!showPassChange)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
            {showPassChange ? 'Close' : 'Change'}
          </button>
        </div>
        {showPassChange && (
          <div>
            {adminMsg && <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{adminMsg}</div>}
            <label style={labelStyle}>👤 New Admin Username</label>
            <input style={inputStyle} value={newAdminUser} onChange={e => setNewAdminUser(e.target.value)} placeholder="New username" />
            <label style={labelStyle}>🔑 New Admin Password</label>
            <input style={inputStyle} type="password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} placeholder="New password" />
            <button onClick={handleAdminPassChange} style={{ background: '#1a3c8f', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>
              Update Karo
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '1rem', fontSize: '1rem' }}>{editId ? 'Operator Edit Karo' : 'Naya Operator Add Karo'}</h2>
          <label style={labelStyle}>👤 Operator Name</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rahul Kumar" />
          <label style={labelStyle}>🔤 Username</label>
          <input style={inputStyle} value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="e.g. rahul_op" autoComplete="off" />
          <label style={labelStyle}>🔑 Password</label>
          <input style={inputStyle} type="text" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="e.g. Rahul@123" />
          <label style={labelStyle}>🎭 Role</label>
          <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={inputStyle}>
            <option value="content">📋 Content (Jobs, Results, Answer Keys, Admit Cards, Syllabus)</option>
            <option value="pyp">📄 PYP (Previous Year Papers)</option>
            <option value="mock">🧪 Mock Test (Mock Test + Subject Mock)</option>
          </select>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: '#1a3c8f', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
              {saving ? 'Saving...' : editId ? 'Update Karo' : 'Save Karo'}
            </button>
            <button onClick={resetForm} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Realtime Activity */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>🔴 Realtime Activity</h2>
        {activities.filter(a => a.is_active).length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', padding: '1rem' }}>Abhi koi operator online nahi hai</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.filter(a => a.is_active).map(act => (
              <div key={act.id} style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1rem', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                      <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{act.operators?.name}</p>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>({act.operators?.username})</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>📱 {act.device}</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>📍 {act.location_name?.substring(0, 60)}...</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b' }}>🕐 Login: {new Date(act.login_time).toLocaleString('en-IN')}</p>
                  </div>
                  <button onClick={() => handleForceLogout(act.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', flexShrink: 0 }}>
                    Force Logout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        <h3 style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem', margin: '1rem 0 0.75rem' }}>📋 Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activities.filter(a => !a.is_active).slice(0, 5).map(act => (
            <div key={act.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.82rem' }}>{act.operators?.name} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({act.operators?.username})</span></p>
                  <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📍 {act.location_name?.substring(0, 50)}...</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748b' }}>📱 {act.device?.substring(0, 40)}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 600 }}>🟢 Login: {new Date(act.login_time).toLocaleString('en-IN')}</p>
                  {act.logout_time && <p style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 600 }}>🔴 Logout: {new Date(act.logout_time).toLocaleString('en-IN')}</p>}
                  {act.login_time && act.logout_time && (
                    <p style={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 600 }}>
                      ⏱️ Duration: {Math.round((new Date(act.logout_time) - new Date(act.login_time)) / 60000)} min
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
      ) : operators.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {operators.map(op => (
            <div key={op.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{op.name}</p>
                    <span style={{ background: roleColors[op.role], color: roleText[op.role], padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{roleLabel[op.role]}</span>
                    <span style={{ background: op.is_active ? '#dcfce7' : '#fee2e2', color: op.is_active ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{op.is_active ? 'Active' : 'Inactive'}</span>
                    {op.is_blocked && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>⛔ Blocked</span>}
                    {op.failed_attempts > 0 && !op.is_blocked && <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>⚠️ {op.failed_attempts} attempts</span>}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>👤 {op.username} • 🔑 {op.password}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(op)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Edit</button>
                  <button onClick={() => handleToggle(op.id, op.is_active)} style={{ background: op.is_active ? '#fef3c7' : '#dcfce7', color: op.is_active ? '#92400e' : '#166534', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                    {op.is_active ? 'Disable' : 'Enable'}
                  </button>
                  {op.is_blocked && (
                    <button onClick={() => handleUnblock(op.id)} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                      ✅ Unblock
                    </button>
                  )}
                  <button onClick={() => handleDelete(op.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem' }}>👥</p>
          <p>Koi operator nahi mila</p>
        </div>
      )}
    </div>
  )
}
