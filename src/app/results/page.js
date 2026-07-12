import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Latest Exam Results 2026 - StudentBrief',
  description: 'Latest SSC, Railway, Bank Exam Results on StudentBrief.in',
}

export default async function ResultsPage() {
  const supabase = await createClient()
  const { data: results } = await supabase
    .from('results')
    .select('*, result_categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📊 Latest Results</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sabhi Latest Exam Results</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {results?.map(result => (
            <Link key={result.id} href={`/results/${result.result_categories?.slug}/${result.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '0.6rem 0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '4px solid #16a34a' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{result.result_categories?.name}</span>
                    {result.result_status && <span style={{ background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{result.result_status}</span>}
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.4 }}>{result.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', flexWrap: 'wrap' }}>
                    {result.result_date && <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>📅 Result Date: {formatDate(result.result_date)}</span>}
                    {result.organization && <span style={{ fontSize: '0.7rem', color: '#64748b' }}>🏛️ {result.organization}</span>}
                  </div>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
          {(!results || results.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '3rem' }}>📊</p>
              <p style={{ fontWeight: 600 }}>Abhi koi result nahi hai</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
