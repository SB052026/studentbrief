'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' })
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [siteSettings, setSiteSettings] = useState({})

  useEffect(() => {
    async function fetchSettings() {
      try {
        const cached = sessionStorage.getItem('sb_site_settings')
        if (cached) { setSiteSettings(JSON.parse(cached)); return }
        const supabase = createClient()
        const { data } = await supabase.from('site_settings').select('*')
        const obj = {}
        data?.forEach(s => { obj[s.key] = s.value })
        setSiteSettings(obj)
      } catch(e) {}
    }
    fetchSettings()
  }, [])

  async function handleGoogleLogin() {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    })
    if (error) setError('Google login failed!')
  }

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setForm(p => ({
          ...p,
          email: user.email || '',
          name: p.name || user.user_metadata?.full_name || '',
        }))
      }
    }
    checkUser()
  }, [])

  async function handleSubmit() {
    if (!form.name) return setError('Name zaroori hai!')
    if (!form.mobile || form.mobile.length < 10) return setError('Valid mobile number daalo!')
    if (!form.message) return setError('Message zaroori hai!')
    setError('')
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name,
      mobile: form.mobile,
      email: form.email || null,
      message: form.message,
    })
    if (error) { setError('Error: ' + error.message); setSaving(false); return }
    setSubmitted(true)
    setSaving(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    border: '1.5px solid #e2e8f0', fontSize: '0.88rem',
    fontFamily: 'Poppins, sans-serif', outline: 'none',
    boxSizing: 'border-box', marginBottom: '0.75rem',
    background: 'white', color: '#1e293b',
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📞 Contact Us</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Hamse sampark karein — hum madad ke liye taiyaar hain!</p>

        {/* Contact Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#dbeafe', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '4px' }}>📧</p>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1e40af' }}>{siteSettings.contact_email || 'studentbrief26@gmail.com'}</p>
          </div>
          <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '4px' }}>📍</p>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#166534' }}>Bawal, Rewari, Haryana</p>
          </div>
        </div>

        {submitted ? (
          <div style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>🎉</span>
            <h2 style={{ fontWeight: 900, color: '#16a34a', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Message Sent!</h2>
            <p style={{ color: '#166534', fontSize: '0.82rem' }}>Hum jald hi aapse sampark karenge.</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}

            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>👤 Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Apna naam likhein" />

            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>📱 Mobile *</label>
            <input style={inputStyle} type="tel" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} placeholder="10 digit mobile number" maxLength={10} />

            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>📧 Email (Optional)</label>
            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email address" />

            {/* Google Login */}
            <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#374151', marginBottom: '0.75rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google se Email Auto-Fill karo
            </button>

            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>💬 Message *</label>
            <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Apna message likhein..." />

            <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 24px rgba(26,60,143,0.3)' }}>
              {saving ? '⏳ Sending...' : '📨 Send Message'}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
