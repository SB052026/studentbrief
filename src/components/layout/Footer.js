'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Footer() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    async function fetchSettings() {
      try {
        const cached = sessionStorage.getItem('sb_site_settings')
        if (cached) {
          setSettings(JSON.parse(cached))
          return
        }
        const supabase = createClient()
        const { data } = await supabase.from('site_settings').select('*')
        const obj = {}
        data?.forEach(s => { obj[s.key] = s.value })
        sessionStorage.setItem('sb_site_settings', JSON.stringify(obj))
        setSettings(obj)
      } catch(e) {}
    }
    fetchSettings()
  }, [])
  return (
    <footer style={{ background: 'linear-gradient(135deg, #0f2460, #1a3c8f)', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>
              Student<span style={{ color: '#f97316' }}>Brief</span>
            </h3>
            <p style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', lineHeight: 1.6 }}>
              Latest Govt Jobs, Results, Mock Tests, Previous Year Papers aur Live Tests students ke liye.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: '#f97316', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/jobs" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Latest Jobs</Link></li>
              <li><Link href="/results" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Latest Results</Link></li>
              <li><Link href="/dashboard/mock-test" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Mock Test</Link></li>
              <li><Link href="/dashboard/pyp" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Previous Year Papers</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: '#f97316', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/about" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link href="/contact" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Contact Us</Link></li>
              <li><Link href="/privacy" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Terms & Conditions</Link></li>
              <li><Link href="/refund" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: '#f97316', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem' }}>📧 support@studentbrief.in</li>
              <li style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.8rem' }}>🌐 www.studentbrief.in</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(191,219,254,0.6)', fontSize: '0.8rem' }}>
            {(settings.social_facebook || settings.social_instagram || settings.social_youtube || settings.social_twitter) && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
              {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '1.2rem', textDecoration: 'none' }}>📘</a>}
              {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '1.2rem', textDecoration: 'none' }}>📸</a>}
              {settings.social_youtube && <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '1.2rem', textDecoration: 'none' }}>▶️</a>}
              {settings.social_twitter && <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(191,219,254,0.7)', fontSize: '1.2rem', textDecoration: 'none' }}>🐦</a>}
            </div>
          )}
          © 2026 StudentBrief.in — All Rights Reserved
          <a href="/admin-login" style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.65rem', textDecoration: 'none', marginLeft: '8px' }}>Admin</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
