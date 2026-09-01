'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'

export default function CareersPage() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetchCareers() {
      const supabase = createClient()
      const { data } = await supabase.from('careers').select('*').eq('is_active', true).order('order_no')
      setCareers(data || [])
      setLoading(false)
    }
    fetchCareers()
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>🚀 Join Our Team</h1>
          <p style={{ color: 'rgba(191,219,254,0.85)', fontSize: '0.88rem' }}>StudentBrief ke saath apna career banao</p>
          <p style={{ color: 'rgba(191,219,254,0.7)', fontSize: '0.75rem', marginTop: '6px' }}>📧 studentbrief26@gmail.com</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
        ) : careers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <h2 style={{ fontWeight: 800, color: '#1a3c8f', marginBottom: '0.5rem' }}>No Openings Right Now</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Abhi koi vacancy nahi hai — baad me check karo!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {careers.map(career => (
              <div key={career.id} style={{ background: 'white', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                {/* Job Header */}
                <div style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setSelected(selected === career.id ? null : career.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem', marginBottom: '6px' }}>{career.title}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {career.department && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>🏢 {career.department}</span>}
                        {career.location && <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>📍 {career.location}</span>}
                        {career.job_type && <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>⏰ {career.job_type}</span>}
                        {career.experience && <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>💼 {career.experience}</span>}
                        {career.salary && <span style={{ background: '#fce7f3', color: '#9d174d', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>💰 {career.salary}</span>}
                      </div>
                      {career.last_date && <p style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600, marginTop: '6px' }}>⏰ Last Date: {new Date(career.last_date).toLocaleDateString('en-IN')}</p>}
                    </div>
                    <span style={{ fontSize: '1rem', color: '#1a3c8f', transform: selected === career.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0, display: 'inline-block' }}>▾</span>
                  </div>
                </div>

                {/* Job Details */}
                {selected === career.id && (
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '1.25rem' }}>
                    {career.description && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.85rem', marginBottom: '6px' }}>📋 Job Description</h4>
                        <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{career.description}</p>
                      </div>
                    )}
                    {career.requirements && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.85rem', marginBottom: '6px' }}>✅ Requirements</h4>
                        <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{career.requirements}</p>
                      </div>
                    )}
                    <a href={`mailto:studentbrief26@gmail.com?subject=Application for ${career.title}`} style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                      📧 Apply Now — Email Karen
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
