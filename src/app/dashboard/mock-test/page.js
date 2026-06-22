'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EmptyState from '@/components/ui/EmptyState'

export default function MockTestPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      const supabase = createClient()
      const { data } = await supabase
        .from('mock_tests')
        .select('*')
        .order('created_at', { ascending: false })
      setTests(data || [])
      setLoading(false)
    }
    fetchTests()
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📝 Mock Tests</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Practice karo aur taiyari strong karo</p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
          </div>
        ) : tests.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {tests.map((test) => (
              <div key={test.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>📝</span>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{test.total_questions} Q</span>
                </div>
                <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>{test.title}</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>⏱️ {test.duration_minutes} minutes</p>
                <Link href={`/dashboard/mock-test/${test.id}`} style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                  Test Shuru Karo
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Koi mock test nahi mila" description="Abhi koi mock test available nahi hai" icon="📝" />
        )}
      </main>
      <Footer />
    </div>
  )
}
