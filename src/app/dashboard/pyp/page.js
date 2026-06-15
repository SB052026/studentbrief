'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function PypPage() {
  const { user, loading: userLoading } = useUser()
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPapers() {
      const supabase = createClient()
      const { data } = await supabase.from('pyp').select('*').order('year', { ascending: false })
      setPapers(data || [])
      setLoading(false)
    }
    fetchPapers()
  }, [])

  if (userLoading || loading) return <div className="page-wrapper"><Navbar /><Loader /><Footer /></div>

  if (!user) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, maxWidth: '500px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>lock</span>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Login Required</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>PYP ke liye pehle login karo</p>
          <Link href="/login" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>Login Karo</Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>Previous Year Papers</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Purane papers se practice karo</p>
        {papers.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {papers.map((paper) => (
              <div key={paper.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>PDF</span>
                  <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{paper.year}</span>
                </div>
                <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>{paper.exam_name}</h3>
                {paper.file_url ? (
                  <a href={paper.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Download / View PDF</a>
                ) : (
                  <div style={{ textAlign: 'center', background: '#f1f5f9', color: '#94a3b8', padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}>Coming Soon</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Koi paper nahi mila" description="Abhi koi previous year paper available nahi hai" icon="file" />
        )}
      </main>
      <Footer />
    </div>
  )
}
