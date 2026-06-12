'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [authType, setAuthType] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleEmailSignup() {
    if (!name || !email || !password) {
      setError('Sab fields bharni zaroori hain')
      return
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })
    if (error) {
      setError(error.message)
    } else {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()
      if (!existingUser) {
        await supabase.from('users').insert({
          id: data.user.id,
          name: name,
          email: email,
          role: 'student',
          trial_start: new Date().toISOString(),
          subscription_status: 'trial',
        })
      }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  async function handleEmailLogin() {
    if (!email || !password) {
      setError('Email aur password daalo')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError('Email ya password galat hai')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  async function handleSendOtp() {
    if (!phone || phone.length < 10) {
      setError('Sahi mobile number daalo')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    })
    if (error) {
      setError(error.message)
    } else {
      setOtpSent(true)
    }
    setLoading(false)
  }

  async function handleVerifyOtp() {
    if (!otp || otp.length < 4) {
      setError('Sahi OTP daalo')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: 'sms',
    })
    if (error) {
      setError(error.message)
    } else {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()
      if (!existingUser) {
        await supabase.from('users').insert({
          id: data.user.id,
          name: `User ${phone}`,
          mobile: phone,
          role: 'student',
          trial_start: new Date().toISOString(),
          subscription_status: 'trial',
        })
      }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
      }}/>
      <div style={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
      }}/>

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>
              Student<span style={{ color: '#f97316' }}>Brief</span>
            </span>
          </Link>
          <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.85rem', marginTop: '4px' }}>
            Exam ki taiyari ka best platform
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '24px', padding: '2rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}>
          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
            <button
              onClick={() => { setMode('login'); setError('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                background: mode === 'login' ? '#1a3c8f' : 'transparent',
                color: mode === 'login' ? 'white' : '#64748b',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                background: mode === 'signup' ? '#1a3c8f' : 'transparent',
                color: mode === 'signup' ? 'white' : '#64748b',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Type Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            {['email', 'phone', 'gmail'].map((type) => (
              <button
                key={type}
                onClick={() => { setAuthType(type); setError('') }}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: '10px',
                  border: `2px solid ${authType === type ? '#1a3c8f' : '#e2e8f0'}`,
                  background: authType === type ? '#dbeafe' : 'white',
                  color: authType === type ? '#1a3c8f' : '#64748b',
                  fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
                }}
              >
                {type === 'email' ? '📧 Email' : type === 'phone' ? '📱 Mobile' : '🌐 Gmail'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: '10px', padding: '10px 14px',
              color: '#991b1b', fontSize: '0.8rem', marginBottom: '1rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Gmail Auth */}
          {authType === 'gmail' && (
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                border: '2px solid #e2e8f0', borderRadius: '12px',
                background: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', fontWeight: 700, fontSize: '0.95rem',
                fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
                color: '#374151',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>G</span>
              {loading ? 'Loading...' : 'Google se Login karo'}
            </button>
          )}

          {/* Email Auth */}
          {authType === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Apna naam daalo"
                    style={{
                      width: '100%', padding: '12px 16px',
                      border: '2px solid #e2e8f0', borderRadius: '10px',
                      fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif',
                      outline: 'none', color: '#1e293b',
                    }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="apna@email.com"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '2px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif',
                    outline: 'none', color: '#1e293b',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password daalo"
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '2px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif',
                    outline: 'none', color: '#1e293b',
                  }}
                />
              </div>
              <button
                onClick={mode === 'signup' ? handleEmailSignup : handleEmailLogin}
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #1a3c8f, #2952c4)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0 8px 25px rgba(26,60,143,0.3)',
                }}
              >
                {loading ? 'Loading...' : mode === 'signup' ? '🚀 Account Banao' : '🔐 Login Karo'}
              </button>
            </div>
          )}

          {/* Phone Auth */}
          {authType === 'phone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    padding: '12px 16px', background: '#f1f5f9',
                    border: '2px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '0.875rem', color: '#64748b', fontWeight: 600,
                  }}>+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10 digit number"
                    disabled={otpSent}
                    style={{
                      flex: 1, padding: '12px 16px',
                      border: '2px solid #e2e8f0', borderRadius: '10px',
                      fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif',
                      outline: 'none', color: '#1e293b',
                    }}
                  />
                </div>
              </div>
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, #1a3c8f, #2952c4)',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {loading ? 'Sending...' : '📱 OTP Bhejo'}
                </button>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>OTP *</label>
                    <input
                      type="tel"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="OTP daalo"
                      style={{
                        width: '100%', padding: '12px 16px',
                        border: '2px solid #e2e8f0', borderRadius: '10px',
                        fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif',
                        outline: 'none', color: '#1e293b',
                      }}
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'linear-gradient(135deg, #f97316, #fb923c)',
                      color: 'white', border: 'none', borderRadius: '12px',
                      fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {loading ? 'Verifying...' : '✅ Verify Karo'}
                  </button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp('') }}
                    style={{
                      background: 'none', border: 'none', color: '#1a3c8f',
                      fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    Number badlo
                  </button>
                </>
              )}
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem' }}>
            Login karke aap StudentBrief ki Terms aur Privacy Policy se agree karte ho
          </p>
        </div>
      </div>
    </div>
  )
}
