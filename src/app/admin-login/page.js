'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const MAX_ATTEMPTS = 5
const LOCKOUT_KEY = 'sb_admin_lock'
const ATTEMPTS_KEY = 'sb_admin_attempts'
let EMERGENCY_CODE = 'SB@Emergency#2026'

export default function AdminLoginPage() {
  useEffect(() => {
    // Push home to history so back button goes home
    window.history.pushState(null, '', window.location.href)
    window.onpopstate = () => {
      window.location.href = '/'
    }
    return () => { window.onpopstate = null }
  }, [])

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const [showEmergency, setShowEmergency] = useState(false)
  const [emergencyCode, setEmergencyCode] = useState('')
  const [emergencyError, setEmergencyError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const lockUntil = localStorage.getItem(LOCKOUT_KEY)
    if (lockUntil && lockUntil === 'permanent') {
      setLocked(true)
      setLockTimer(-1)
      return
    }
    const savedAttempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0')
    setAttempts(savedAttempts)
    if (savedAttempts >= MAX_ATTEMPTS) {
      setLocked(true)
      setLockTimer(-1)
    }
    const auth = localStorage.getItem('sb_admin_auth')
    if (auth === 'true') router.push('/admin')
  }, [])

  useEffect(() => {
    if (!locked || lockTimer === -1) return
    const interval = setInterval(() => {
      const lockUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0')
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLocked(false)
        setLockTimer(0)
        setAttempts(0)
        localStorage.removeItem(LOCKOUT_KEY)
        localStorage.removeItem(ATTEMPTS_KEY)
        clearInterval(interval)
      } else {
        setLockTimer(remaining)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [locked])

  async function handleLogin() {
    if (locked) return
    if (!userId || !password) return setError('Saare fields zaroori hain!')
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800))

    // Get credentials from Supabase settings
    const supabase = createClient()
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['admin_username', 'admin_password'])

    const settingsObj = {}
    settings?.forEach(s => { settingsObj[s.key] = s.value })

    const adminUser = settingsObj.admin_username || 'Admin'
    const adminPass = settingsObj.admin_password || 'Admin@07'

    if (userId === adminUser && password === adminPass) {
      const token = btoa(`${Date.now()}-${Math.random().toString(36)}`)
      localStorage.setItem('sb_admin_auth', 'true')
      localStorage.setItem('sb_admin_token', token)
      localStorage.setItem('sb_admin_time', Date.now().toString())
      localStorage.removeItem(ATTEMPTS_KEY)
      localStorage.removeItem(LOCKOUT_KEY)
      router.push('/admin')
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      localStorage.setItem(ATTEMPTS_KEY, newAttempts.toString())

      if (newAttempts >= MAX_ATTEMPTS) {
        localStorage.setItem(LOCKOUT_KEY, 'permanent')
        setLocked(true)
        setLockTimer(-1)
        setError(`⛔ ${MAX_ATTEMPTS} baar galat attempt! Account permanently lock ho gaya. Emergency code use karein.`)
      } else {
        setError(`❌ Galat User ID ya Password! (${MAX_ATTEMPTS - newAttempts} attempts baaki)`)
      }
    }
    setLoading(false)
  }

  async function handleEmergencyUnlock() {
    setEmergencyError('')
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'admin_emergency_code').single()
    const code = data?.value || 'SB@Emergency#2026'
    if (emergencyCode === code) {
      localStorage.removeItem(LOCKOUT_KEY)
      localStorage.removeItem(ATTEMPTS_KEY)
      setLocked(false)
      setAttempts(0)
      setShowEmergency(false)
      setEmergencyCode('')
      setError('')
      alert('✅ Account unlock ho gaya! Ab login karein.')
    } else {
      setEmergencyError('❌ Galat emergency code!')
    }
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '2px solid #e2e8f0', fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
      padding: '1rem', fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover', marginBottom: '0.75rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f' }}>
            Student<span style={{ color: '#f97316' }}>Brief</span>
          </div>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
            🔐 Admin Panel
          </span>
        </div>

        {locked ? (
          <div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fee2e2', borderRadius: '14px', marginBottom: '1rem' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</p>
              <p style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Account Lock Ho Gaya!</p>
              {lockTimer > 0 ? (
                <p style={{ fontSize: '2rem', fontWeight: 900, color: '#991b1b' }}>{formatTime(lockTimer)}</p>
              ) : (
                <p style={{ fontSize: '0.82rem', color: '#991b1b' }}>5 baar galat attempt! Emergency code se unlock karein.</p>
              )}
            </div>

            {!showEmergency ? (
              <button onClick={() => setShowEmergency(true)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#1a3c8f', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>
                🚨 Emergency Code Use Karein
              </button>
            ) : (
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a3c8f', marginBottom: '0.75rem' }}>🚨 Emergency Unlock Code</p>
                {emergencyError && <p style={{ color: '#991b1b', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{emergencyError}</p>}
                <input
                  type="password"
                  style={{ ...inputStyle, marginBottom: '0.75rem' }}
                  value={emergencyCode}
                  onChange={e => setEmergencyCode(e.target.value)}
                  placeholder="Emergency code daalo"
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleEmergencyUnlock} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#16a34a', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>
                    Unlock Karein
                  </button>
                  <button onClick={() => { setShowEmergency(false); setEmergencyCode('') }} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#f1f5f9', color: '#64748b', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>User ID</label>
              <input style={inputStyle} value={userId} onChange={e => setUserId(e.target.value)} placeholder="Enter User ID" autoComplete="off" autoCorrect="off" autoCapitalize="off" />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inputStyle, paddingRight: '48px' }} type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {attempts > 0 && (
              <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '8px 12px', marginBottom: '1rem', fontSize: '0.72rem', color: '#92400e', textAlign: 'center' }}>
                ⚠️ {attempts}/{MAX_ATTEMPTS} galat attempts — {MAX_ATTEMPTS - attempts} baaki
              </div>
            )}

            <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              {loading ? '⏳ Verifying...' : '🔐 Login Karo'}
            </button>
          </>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '1.5rem' }}>

        </p>
        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#cbd5e1', marginTop: '0.5rem' }}>🛡️ Secured Admin Access</p>
      </div>
    </div>
  )
}
