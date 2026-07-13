'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function MockTestListPage({ params }) {
  const [category, setCategory] = useState(null)
  const [subcategory, setSubcategory] = useState(null)
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { id, subid } = await params
      const supabase = createClient()
      const [{ data: cat }, { data: sub }, { data: testsData }] = await Promise.all([
        supabase.from('mock_categories').select('*').eq('id', id).single(),
        supabase.from('mock_subcategories').select('*').eq('id', subid).single(),
        supabase.from('mock_tests').select('*').eq('mock_subcategory_id', subid).eq('test_type', 'category').order('created_at', { ascending: false }),
      ])
      setCategory(cat)
      setSubcategory(sub)
      setTests(testsData || [])
      setLoading(false)
    }
    fetchData()
  }, [params])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/mock-test" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Mock Test</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/dashboard/mock-test/category/${category?.id}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{category?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{subcategory?.name}</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>
          {subcategory?.icon} {subcategory?.name}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Available Mock Tests</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
        ) : tests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tests.map(test => (
              <div key={test.id} style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{test.title}</h3>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{test.total_questions} Q</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>⏱️ {test.duration_minutes} minutes</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link href={`/dashboard/mock-test/instructions?id=${test.id}&title=${encodeURIComponent(test.title)}`} style={{ flex: 2, display: 'block', textAlign: 'center', background: `linear-gradient(135deg, ${category?.color || '#1a3c8f'}, ${category?.color || '#1a3c8f'}dd)`, color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                    📝 Practice
                  </Link>
                  {test.pdf_url ? (
                    <a href={test.pdf_url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                      ⬇️ PDF
                    </a>
                  ) : (
                    <div style={{ flex: 1, textAlign: 'center', background: '#f1f5f9', color: '#94a3b8', padding: '10px', borderRadius: '10px', fontSize: '0.82rem' }}>
                      PDF N/A
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</p>
            <p style={{ fontWeight: 600 }}>No tests available for this exam yet</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>Coming soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
