'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient()
      const { data } = await supabase.from('site_settings').select('*')
      const obj = {}
      data?.forEach(s => { obj[s.key] = s.value })
      setSettings(obj)
      setLoading(false)
    }
    fetchSettings()
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📞 Contact Us</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Get in touch with us</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {settings.contact_email && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📧</div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>Email</p>
                  <a href={`mailto:${settings.contact_email}`} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a3c8f', textDecoration: 'none' }}>{settings.contact_email}</a>
                </div>
              </div>
            )}

            {settings.contact_phone && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📱</div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>Phone</p>
                  <a href={`tel:${settings.contact_phone}`} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a3c8f', textDecoration: 'none' }}>{settings.contact_phone}</a>
                </div>
              </div>
            )}

            {settings.contact_address && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📍</div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>Address</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{settings.contact_address}</p>
                </div>
              </div>
            )}

            {/* Social Media */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>🌐 Social Media</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" style={{ background: '#1877f2', color: 'white', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>📘 Facebook</a>}
                {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" style={{ background: '#e1306c', color: 'white', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>📸 Instagram</a>}
                {settings.social_youtube && <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" style={{ background: '#ff0000', color: 'white', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>▶️ YouTube</a>}
                {settings.social_twitter && <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" style={{ background: '#1da1f2', color: 'white', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>🐦 Twitter</a>}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
