'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const ADMIN_ID = 'Admin'
  const ADMIN_PASS = 'Admin@07'

  async function handleLogin() {
    if (!userId || !password) return setError('Saare fields zaroori hain!')
    setLoading(true)
    setError('')

    if (userId === ADMIN_ID && password === ADMIN_PASS) {
      localStorage.setItem('sb_admin_auth', 'true')
      router.push('/admin')
    } else {
      setError('Galat User ID ya Password!')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '2px solid #e2e8f0', fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif', outline: 'none',
    boxSizing: 'border-box', marginBottom: '0.75rem',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
      padding: '1rem', fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '4px' }}>
            Student<span style={{ color: '#f97316' }}>Brief</span>
          </div>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
            Admin Panel
          </span>
        </div>

        <h2 style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          🔐 Admin Login
        </h2>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <input
          style={inputStyle}
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="User ID"
          autoComplete="off"
        />
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #1a3c8f, #2952c4)',
            color: 'white', border: 'none', fontWeight: 700,
            fontSize: '1rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            marginTop: '0.25rem',
          }}
        >
          {loading ? 'Logging in...' : 'Login Karo →'}
        </button>
      </div>
    </div>
  )
}
