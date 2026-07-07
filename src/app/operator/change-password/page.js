'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChangePasswordPage() {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleChange() {
    if (!oldPass || !newPass || !confirmPass) return setError('Saare fields zaroori hain!')
    if (newPass !== confirmPass) return setError('Naya password match nahi kar raha!')
    if (newPass.length < 6) return setError('Password kam se kam 6 characters ka hona chahiye!')

    setSaving(true)
    setError('')
    setMsg('')

    const supabase = createClient()
    const id = localStorage.getItem('sb_operator_id')

    const { data } = await supabase
      .from('operators')
      .select('*')
      .eq('id', id)
      .eq('password', oldPass)
      .single()

    if (!data) {
      setError('Purana password galat hai!')
      setSaving(false)
      return
    }

    await supabase.from('operators').update({ password: newPass }).eq('id', id)
    setMsg('✅ Password successfully change ho gaya!')
    setOldPass('')
    setNewPass('')
    setConfirmPass('')
    setSaving(false)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }

  return (
    <div>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1.5rem' }}>🔑 Password Change Karo</h1>

      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', maxWidth: '400px' }}>
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>⚠️ {error}</div>}
        {msg && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>{msg}</div>}

        <label style={labelStyle}>🔒 Purana Password</label>
        <input style={inputStyle} type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Purana password" />

        <label style={labelStyle}>🔑 Naya Password</label>
        <input style={inputStyle} type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Naya password (min 6 char)" />

        <label style={labelStyle}>✅ Confirm Password</label>
        <input style={inputStyle} type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Naya password dobara likhein" onKeyDown={e => e.key === 'Enter' && handleChange()} />

        <button onClick={handleChange} disabled={saving} style={{ width: '100%', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>
          {saving ? 'Saving...' : '🔑 Password Change Karo'}
        </button>
      </div>
    </div>
  )
}
