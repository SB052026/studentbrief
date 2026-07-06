'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [msg, setMsg] = useState('')

  async function fetchSettings() {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('*')
    const obj = {}
    data?.forEach(s => { obj[s.key] = s.value })
    setSettings(obj)
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    }
    setSaving(false)
    setMsg('✅ Settings save ho gayi!')
    setTimeout(() => setMsg(''), 3000)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '0.6rem' }
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }
  const textareaStyle = { ...inputStyle, height: '200px', resize: 'vertical' }

  const tabs = [
    { key: 'general', label: '⚙️ General' },
    { key: 'contact', label: '📞 Contact' },
    { key: 'social', label: '📱 Social' },
    { key: 'privacy', label: '🔒 Privacy' },
    { key: 'terms', label: '📜 Terms' },
    { key: 'refund', label: '💰 Refund' },
  ]

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f' }}>⚙️ Website Settings</h1>
        <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          {saving ? 'Saving...' : '💾 Save Karo'}
        </button>
      </div>

      {msg && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: '10px', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        {activeTab === 'general' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>⚙️ General Settings</h2>
            <label style={labelStyle}>💬 Website Slogan</label>
            <input style={inputStyle} value={settings.slogan || ''} onChange={e => setSettings(p => ({ ...p, slogan: e.target.value }))} placeholder="e.g. Every Student Deserves to Excel" />
            <label style={labelStyle}>📲 App Download Link</label>
<label style={labelStyle}>🖼️ Logo Upload</label>
            <input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return
              const supabase = createClient()
              const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`
              const { data, error } = await supabase.storage.from('site-assets').upload(fileName, file, { upsert: true })
              if (!error) {
                const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName)
                setSettings(p => ({ ...p, logo_url: urlData.publicUrl }))
                alert('Logo upload ho gaya!')
              } else {
                alert('Error: ' + error.message)
              }
            }} style={{ ...inputStyle, padding: '8px' }} />
            {settings.logo_url && (
              <div style={{ marginBottom: '0.6rem' }}>
                <img src={settings.logo_url} alt="Logo" style={{ width: `${settings.logo_size || 38}px`, height: `${settings.logo_size || 38}px`, borderRadius: '8px', objectFit: 'cover' }} />
              </div>
            )}
            <label style={labelStyle}>📐 Logo Size (px)</label>
            <input style={inputStyle} type="number" value={settings.logo_size || '38'} onChange={e => setSettings(p => ({ ...p, logo_size: e.target.value }))} placeholder="38" min="20" max="100" />
            <input style={inputStyle} value={settings.app_download_link || ''} onChange={e => setSettings(p => ({ ...p, app_download_link: e.target.value }))} placeholder="https://..." />
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>📞 Contact Details</h2>
            <label style={labelStyle}>📧 Email</label>
            <input style={inputStyle} value={settings.contact_email || ''} onChange={e => setSettings(p => ({ ...p, contact_email: e.target.value }))} placeholder="support@studentbrief.in" />
            <label style={labelStyle}>📱 Phone</label>
            <input style={inputStyle} value={settings.contact_phone || ''} onChange={e => setSettings(p => ({ ...p, contact_phone: e.target.value }))} placeholder="+91 XXXXXXXXXX" />
            <label style={labelStyle}>📍 Address</label>
            <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={settings.contact_address || ''} onChange={e => setSettings(p => ({ ...p, contact_address: e.target.value }))} placeholder="Address likhein..." />
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>📱 Social Media Links</h2>
            <label style={labelStyle}>📘 Facebook</label>
            <input style={inputStyle} value={settings.social_facebook || ''} onChange={e => setSettings(p => ({ ...p, social_facebook: e.target.value }))} placeholder="https://facebook.com/..." />
            <label style={labelStyle}>📸 Instagram</label>
            <input style={inputStyle} value={settings.social_instagram || ''} onChange={e => setSettings(p => ({ ...p, social_instagram: e.target.value }))} placeholder="https://instagram.com/..." />
            <label style={labelStyle}>▶️ YouTube</label>
            <input style={inputStyle} value={settings.social_youtube || ''} onChange={e => setSettings(p => ({ ...p, social_youtube: e.target.value }))} placeholder="https://youtube.com/..." />
            <label style={labelStyle}>🐦 Twitter/X</label>
            <input style={inputStyle} value={settings.social_twitter || ''} onChange={e => setSettings(p => ({ ...p, social_twitter: e.target.value }))} placeholder="https://twitter.com/..." />
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>🔒 Privacy Policy</h2>
            <label style={labelStyle}>Privacy Policy Content</label>
            <textarea style={textareaStyle} value={settings.privacy_policy || ''} onChange={e => setSettings(p => ({ ...p, privacy_policy: e.target.value }))} placeholder="Privacy policy likhein..." />
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>📜 Terms & Conditions</h2>
            <label style={labelStyle}>Terms & Conditions Content</label>
            <textarea style={textareaStyle} value={settings.terms_conditions || ''} onChange={e => setSettings(p => ({ ...p, terms_conditions: e.target.value }))} placeholder="Terms & conditions likhein..." />
          </div>
        )}

        {activeTab === 'refund' && (
          <div>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>💰 Refund Policy</h2>
            <label style={labelStyle}>Refund Policy Content</label>
            <textarea style={textareaStyle} value={settings.refund_policy || ''} onChange={e => setSettings(p => ({ ...p, refund_policy: e.target.value }))} placeholder="Refund policy likhein..." />
          </div>
        )}
      </div>
    </div>
  )
}
