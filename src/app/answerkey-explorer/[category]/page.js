import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function AnswerKeyCategoryPage({ params }) {
  const { category } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase.from('answerkey_categories').select('*').eq('slug', category).single()
  const { data: items } = await supabase.from('answerkeys').select('id, title, exam_date').eq('category_id', cat?.id).order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem' }}>
          <Link href="/answerkey-explorer" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Answer Keys</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{cat?.name}</span>
        </div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1rem' }}>{cat?.icon} {cat?.name}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items?.map(item => (
            <Link key={item.id} href={`/answerkey-explorer/${category}/${item.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '0.875rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '3px solid #db2777', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>{item.title}</p>
                  {item.exam_date && <p style={{ fontSize: '0.7rem', color: '#db2777', marginTop: '3px' }}>📅 Exam: {formatDate(item.exam_date)}</p>}
                </div>
                <span style={{ color: '#94a3b8', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
          {(!items || items.length === 0) && <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><p style={{ fontSize: '2rem' }}>📝</p><p>No answer keys found</p></div>}
        </div>
      </main>
      <Footer />
    </div>
  )
}
