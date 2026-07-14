import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function ResultsCategoryPage({ params }) {
  const { category } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase.from('result_categories').select('*').eq('slug', category).single()
  const { data: results } = await supabase.from('results').select('id, title, result_date, result_status').eq('category_id', cat?.id).order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem' }}>
          <Link href="/results-explorer" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Results</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{cat?.name}</span>
        </div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1rem' }}>{cat?.icon} {cat?.name}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {results?.map(r => (
            <Link key={r.id} href={`/results-explorer/${category}/${r.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '0.875rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '3px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>{r.title}</p>
                  {r.result_date && <p style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '3px' }}>📅 {formatDate(r.result_date)}</p>}
                </div>
                {r.result_status && <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{r.result_status}</span>}
                <span style={{ color: '#94a3b8', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
          {(!results || results.length === 0) && <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><p style={{ fontSize: '2rem' }}>📊</p><p>No results found</p></div>}
        </div>
      </main>
      <Footer />
    </div>
  )
}
