'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import PDFDownload from '@/components/PDFDownload'
import Footer from '@/components/layout/Footer'
import EmptyState from '@/components/ui/EmptyState'

export default function PypPage() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPapers() {
      const supabase = createClient()
      const { data } = await supabase
        .from('pyp')
        .select('*')
        .order('year', { ascending: false })
      setPapers(data || [])
      setLoading(false)
    }
    fetchPapers()
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📄 Previous Year Papers</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Practice karo ya PDF download karo</p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
          </div>
        ) : papers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {papers.map((paper) => (
              <div key={paper.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{paper.year}</span>
                    <h3 style={{ fontWeight: 700, color: '#1e293b', marginTop: '6px', fontSize: '0.95rem' }}>{paper.exam_name}</h3>
                  </div>
                  <span style={{ fontSize: '2rem' }}>📄</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link href={`/dashboard/pyp/${paper.id}/instructions`} style={{ flex: 1, display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                    📝 Practice करो
                  </Link>
                  {paper.file_url ? (
                    <a href={paper.file_url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                      ⬇️ Download PDF
                    </a>
                  ) : (
                    <div style={{ flex: 1, textAlign: 'center', background: '#f1f5f9', color: '#94a3b8', padding: '10px', borderRadius: '10px', fontSize: '0.82rem' }}>
                      PDF Coming Soon
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Koi paper nahi mila" description="Abhi koi previous year paper available nahi hai" icon="📄" />
        )}
      </main>
      <Footer />
    </div>
  )
}
