'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inputStyle, labelStyle, btnPrimary, pageTitle } from '@/lib/adminStyles'

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
      await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
    }
    setSaving(false)
    setMsg('✅ Saved!')
    setTimeout(() => setMsg(''), 3000)
  }

  const tabs = [
    { key: 'general', label: '⚙️ General' },
    { key: 'meta', label: '🔍 SEO' },
    { key: 'contact', label: '📞 Contact' },
    { key: 'social', label: '📱 Social' },
    { key: 'privacy', label: '🔒 Privacy' },
    { key: 'terms', label: '📜 Terms' },
    { key: 'refund', label: '💰 Refund' },
  ]

  const textareaStyle = { ...inputStyle, height: '180px', resize: 'vertical' }

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={pageTitle}>⚙️ Settings</h1>
        <button onClick={handleSave} disabled={saving} style={{ background: '#f97316', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
          {saving ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      {msg && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '10px', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', background: activeTab === tab.key ? '#1a3c8f' : '#f1f5f9', color: activeTab === tab.key ? 'white' : '#64748b' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {activeTab === 'general' && (
          <div>
            <label style={labelStyle}>💬 Slogan</label>
            <input style={inputStyle} value={settings.slogan || ''} onChange={e => setSettings(p => ({ ...p, slogan: e.target.value }))} placeholder="Every Student Deserves to Excel" />
            <label style={labelStyle}>🖼️ Logo Upload</label>
            <input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return
              const supabase = createClient()
              const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`
              const { error } = await supabase.storage.from('site-assets').upload(fileName, file, { upsert: true })
              if (!error) {
                const { data } = supabase.storage.from('site-assets').getPublicUrl(fileName)
                setSettings(p => ({ ...p, logo_url: data.publicUrl }))
                alert('Logo uploaded!')
              }
            }} style={{ ...inputStyle, padding: '8px' }} />
            {settings.logo_url && <img src={settings.logo_url} alt="Logo" style={{ width: `${settings.logo_size || 38}px`, height: `${settings.logo_size || 38}px`, borderRadius: '8px', objectFit: 'cover', marginBottom: '0.6rem' }} />}
            <label style={labelStyle}>📐 Logo Size (px)</label>
            <input style={inputStyle} type="number" value={settings.logo_size || '38'} onChange={e => setSettings(p => ({ ...p, logo_size: e.target.value }))} min="20" max="200" />
            <label style={labelStyle}>📲 App Download Link</label>
            <input style={inputStyle} value={settings.app_download_link || ''} onChange={e => setSettings(p => ({ ...p, app_download_link: e.target.value }))} placeholder="https://..." />
          </div>
        )}

        {activeTab === 'meta' && (
          <div>
            <div style={{ background: '#f0f4ff', borderRadius: '8px', padding: '8px 12px', marginBottom: '1rem', fontSize: '0.78rem', color: '#1a3c8f' }}>💡 Ye settings Google search me dikhengi</div>
            <label style={labelStyle}>📋 Site Title</label>
            <input style={inputStyle} value={settings.meta_title || ''} onChange={e => setSettings(p => ({ ...p, meta_title: e.target.value }))} />
            <label style={labelStyle}>📝 Meta Description</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={settings.meta_description || ''} onChange={e => setSettings(p => ({ ...p, meta_description: e.target.value }))} />
            <label style={labelStyle}>🏷️ Keywords</label>
            <input style={inputStyle} value={settings.meta_keywords || ''} onChange={e => setSettings(p => ({ ...p, meta_keywords: e.target.value }))} />
            <label style={labelStyle}>💼 Jobs Title</label>
            <input style={inputStyle} value={settings.meta_jobs_title || ''} onChange={e => setSettings(p => ({ ...p, meta_jobs_title: e.target.value }))} />
            <label style={labelStyle}>💼 Jobs Description</label>
            <input style={inputStyle} value={settings.meta_jobs_desc || ''} onChange={e => setSettings(p => ({ ...p, meta_jobs_desc: e.target.value }))} />
            <label style={labelStyle}>📊 Results Title</label>
            <input style={inputStyle} value={settings.meta_results_title || ''} onChange={e => setSettings(p => ({ ...p, meta_results_title: e.target.value }))} />
            <label style={labelStyle}>📊 Results Description</label>
            <input style={inputStyle} value={settings.meta_results_desc || ''} onChange={e => setSettings(p => ({ ...p, meta_results_desc: e.target.value }))} />
            <label style={labelStyle}>🧪 Mock Test Title</label>
            <input style={inputStyle} value={settings.meta_mock_title || ''} onChange={e => setSettings(p => ({ ...p, meta_mock_title: e.target.value }))} />
            <label style={labelStyle}>🧪 Mock Test Description</label>
            <input style={inputStyle} value={settings.meta_mock_desc || ''} onChange={e => setSettings(p => ({ ...p, meta_mock_desc: e.target.value }))} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <label style={labelStyle}>📧 Email</label>
            <input style={inputStyle} value={settings.contact_email || ''} onChange={e => setSettings(p => ({ ...p, contact_email: e.target.value }))} />
            <label style={labelStyle}>📱 Phone</label>
            <input style={inputStyle} value={settings.contact_phone || ''} onChange={e => setSettings(p => ({ ...p, contact_phone: e.target.value }))} />
            <label style={labelStyle}>📍 Address</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={settings.contact_address || ''} onChange={e => setSettings(p => ({ ...p, contact_address: e.target.value }))} />
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            {[['social_facebook','📘 Facebook'],['social_instagram','📸 Instagram'],['social_youtube','▶️ YouTube'],['social_twitter','🐦 Twitter/X'],['app_download_link','📲 App Link']].map(([key, lbl]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl}</label>
                <input style={inputStyle} value={settings[key] || ''} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} placeholder="https://..." />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <label style={labelStyle}>🔒 Privacy Policy</label>
            <textarea style={textareaStyle} value={settings.privacy_policy || ''} onChange={e => setSettings(p => ({ ...p, privacy_policy: e.target.value }))} />
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <label style={labelStyle}>📜 Terms & Conditions</label>
            <textarea style={textareaStyle} value={settings.terms_conditions || ''} onChange={e => setSettings(p => ({ ...p, terms_conditions: e.target.value }))} />
          </div>
        )}

        {activeTab === 'refund' && (
          <div>
            <label style={labelStyle}>💰 Refund Policy</label>
            <textarea style={textareaStyle} value={settings.refund_policy || ''} onChange={e => setSettings(p => ({ ...p, refund_policy: e.target.value }))} />
          </div>
        )}
      </div>
    </div>
  )
}
