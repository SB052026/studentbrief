'use client'
// bcrypt compare via API

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OperatorLoginPage() {
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    window.onpopstate = () => {
      window.location.href = '/'
    }
    return () => { window.onpopstate = null }
  }, [])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locStatus, setLocStatus] = useState('')
  const router = useRouter()

  async function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: null, lng: null, name: 'Location not supported' })
        return
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            const data = await res.json()
            resolve({ lat, lng, name: data.display_name || `${lat}, ${lng}` })
          } catch {
            resolve({ lat, lng, name: `${lat}, ${lng}` })
          }
        },
        () => resolve({ lat: null, lng: null, name: 'Location denied' })
      )
    })
  }

  function getDevice() {
    const ua = navigator.userAgent
    if (/Android/i.test(ua)) return `Android - ${ua.match(/Android ([^;]+)/)?.[1] || ''}`
    if (/iPhone|iPad/i.test(ua)) return `iOS`
    if (/Windows/i.test(ua)) return `Windows`
    if (/Mac/i.test(ua)) return 'MacOS'
    return ua.substring(0, 50)
  }

  async function handleLogin() {
    if (!username || !password) return setError('Saare fields zaroori hain!')
    setLoading(true)
    setError('')
    setLocStatus('📍 Verifying...')

    const supabase = createClient()

    // Check if operator exists and not blocked
    const { data: op } = await supabase
      .from('operators')
      .select('*')
      .eq('username', username)
      .single()

    if (!op) {
      setError('Galat Username ya Password!')
      setLoading(false)
      setLocStatus('')
      return
    }

    if (op.is_blocked) {
      setError('⛔ Aapka account block ho gaya hai! Admin se sampark karein.')
      setLoading(false)
      setLocStatus('')
      return
    }

    if (!op.is_active) {
      setError('⛔ Aapka account inactive hai! Admin se sampark karein.')
      setLoading(false)
      setLocStatus('')
      return
    }

    const bcrypt = await import('bcryptjs')
    const passwordMatch = await bcrypt.compare(password, op.password)
    if (!passwordMatch) {
      const newAttempts = (op.failed_attempts || 0) + 1
      const shouldBlock = newAttempts >= 5

      await supabase.from('operators').update({
        failed_attempts: newAttempts,
        is_blocked: shouldBlock,
        blocked_at: shouldBlock ? new Date().toISOString() : null
      }).eq('id', op.id)

      if (shouldBlock) {
        setError('⛔ 5 baar galat password! Aapka account block ho gaya hai. Admin se sampark karein.')
      } else {
        setError(`❌ Galat Password! ${5 - newAttempts} attempts baaki hain.`)
      }
      setLoading(false)
      setLocStatus('')
      return
    }

    // Reset failed attempts on success
    await supabase.from('operators').update({
      failed_attempts: 0,
      is_blocked: false,
      blocked_at: null
    }).eq('id', op.id)

    // Get location
    const location = await getLocation()
    const device = getDevice()

    const { data: activity } = await supabase.from('operator_activity').insert({
      operator_id: op.id,
      location_lat: location.lat,
      location_lng: location.lng,
      location_name: location.name,
      device: device,
      is_active: true,
    }).select().single()

    localStorage.setItem('sb_operator_auth', 'true')
    localStorage.setItem('sb_operator_role', op.role)
    localStorage.setItem('sb_operator_name', op.name)
    localStorage.setItem('sb_operator_id', op.id)
    localStorage.setItem('sb_operator_time', Date.now().toString())
    localStorage.setItem('sb_operator_activity_id', activity?.id || '')
    localStorage.setItem('sb_operator_permissions', JSON.stringify(op.permissions || []))

    setLocStatus('')
    router.push('/operator')
    setLoading(false)
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
          <img src="/logo.png" alt="Logo" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', marginBottom: '0.75rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f' }}>
            Student<span style={{ color: '#f97316' }}>Brief</span>
          </div>
          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
            👤 Operator Login
          </span>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {locStatus && (
          <div style={{ background: '#dbeafe', color: '#1e40af', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
            {locStatus}
          </div>
        )}

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Username</label>
          <input style={inputStyle} value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" autoComplete="off" />
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

        <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '8px 12px', marginBottom: '1rem', fontSize: '0.72rem', color: '#92400e' }}>
          ⚠️ 5 baar galat password dene par account block ho jayega
        </div>

        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
          {loading ? '⏳ Verifying...' : '🔐 Login Karo'}
        </button>


      </div>
    </div>
  )
}
