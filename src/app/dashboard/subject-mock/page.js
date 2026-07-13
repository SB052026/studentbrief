'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function SubjectMockPage() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data } = await supabase.from('mock_subjects').select('*').order('name')
      setSubjects(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>🎯 Subject Wise Mock Test</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Select subject and start practice</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {subjects.map(subject => (
              <Link key={subject.id} href={`/dashboard/subject-mock/${subject.id}/tests`} style={{ textDecoration: 'none' }}>
                <div style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`, borderRadius: '16px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>{subject.icon}</span>
                  <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>{subject.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
