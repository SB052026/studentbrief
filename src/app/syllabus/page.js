'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Loader from '@/components/ui/Loader'

export default function SyllabusPage() {
  const [syllabus, setSyllabus] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSyllabus() {
      const supabase = createClient()
      const { data } = await supabase
        .from('syllabus')
        .select('*')
        .order('created_at', { ascending: false })
      setSyllabus(data || [])
      setLoading(false)
    }
    fetchSyllabus()
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.5rem' }}>📚 Syllabus</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Exam syllabus PDF download karo</p>

        {loading ? (
          <Loader />
        ) : syllabus.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {syllabus.map((item) => (
              <div key={item.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  📄
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{item.title}</h3>
                  {item.exam_name && <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.exam_name}</p>}
                  {item.description && <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{item.description}</p>}
                </div>
                {item.file_url ? (
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer" download style={{
                    background: 'linear-gradient(135deg, #1a3c8f, #2952c4)',
                    color: 'white', padding: '8px 16px', borderRadius: '10px',
                    fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', flexShrink: 0,
                  }}>
                    ⬇️ Download
                  </a>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1', flexShrink: 0 }}>Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📚</span>
            <p>Abhi koi syllabus available nahi hai</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
