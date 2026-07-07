'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const ADMIN_ID = 'Admin'
const ADMIN_PASS = 'Admin@07'
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

export default function AdminLoginPage() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Check if already locked
    const lockUntil = localStorage.getItem('sb_admin_lock')
    if (lockUntil) {
      const remaining = parseInt(lockUntil) - Date.now()
      if (remaining > 0) {
        setLocked(true)
        setLockTimer(Math.ceil(remaining / 1000))
      } else {
        localStorage.removeItem('sb_admin_lock')
        localStorage.removeItem('sb_admin_attempts')
      }
    }
    // Check attempts
    const savedAttempts = parseInt(localStorage.getItem('sb_admin_attempts') || '0')
    setAttempts(savedAttempts)

    // Check if already logged in
    const auth = localStorage.getItem('sb_admin_auth')
    if (auth === 'true') router.push('/admin')
  }, [])

  useEffect(() => {
    if (!locked) return
    const interval = setInterval(() => {
      const lockUntil = parseInt(localStorage.getItem('sb_admin_lock') || '0')
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLocked(false)
        setLockTimer(0)
        setAttempts(0)
        localStorage.removeItem('sb_admin_lock')
        localStorage.removeItem('sb_admin_attempts')
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

    // Simulate delay for security
    await new Promise(r => setTimeout(r, 800))

    if (userId === ADMIN_ID && password === ADMIN_PASS) {
      // Generate session token
      const token = btoa(`${Date.now()}-${Math.random().toString(36)}`)
      localStorage.setItem('sb_admin_auth', 'true')
      localStorage.setItem('sb_admin_token', token)
      localStorage.setItem('sb_admin_time', Date.now().toString())
      localStorage.removeItem('sb_admin_attempts')
      localStorage.removeItem('sb_admin_lock')
      router.push('/admin')
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      localStorage.setItem('sb_admin_attempts', newAttempts.toString())

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_TIME
        localStorage.setItem('sb_admin_lock', lockUntil.toString())
        setLocked(true)
        setError(`${MAX_ATTEMPTS} baar galat attempt! 15 minute ke liye lock ho gaya.`)
      } else {
        setError(`Galat User ID ya Password! (${MAX_ATTEMPTS - newAttempts} attempts baaki)`)
      }
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '2px solid #e2e8f0', fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
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
          <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fee2e2', borderRadius: '14px' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</p>
            <p style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Account Lock Ho Gaya!</p>
            <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Dobara try karo:</p>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: '#991b1b' }}>{formatTime(lockTimer)}</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>User ID</label>
              <input
                style={inputStyle}
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Enter User ID"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="new-password"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || locked}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1a3c8f, #2952c4)',
                color: 'white', border: 'none', fontWeight: 700,
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {loading ? '⏳ Verifying...' : '🔐 Login Karo'}
            </button>

            {attempts > 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#ef4444', marginTop: '0.75rem' }}>
                ⚠️ {attempts}/{MAX_ATTEMPTS} galat attempts
              </p>
            )}
          </>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '1.5rem' }}>
          Operator? <a href="/operator-login" style={{ color: '#1a3c8f', fontWeight: 700, textDecoration: 'none' }}>Operator Login →</a>
        </p>
        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
          🛡️ Secured Admin Access
        </p>
      </div>
    </div>
  )
}
