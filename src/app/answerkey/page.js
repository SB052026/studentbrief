import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Latest Answer Keys 2026 - StudentBrief',
  description: 'Latest Answer Keys on StudentBrief.in',
}

export default async function AnswerKeyPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('answerkeys')
    .select('id, title, exam_date, answerkey_categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1rem' }}>📝 Answer Keys</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {items?.map(item => (
            <Link key={item.id} href={`/answerkey/${item.answerkey_categories?.slug}/${item.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '10px', padding: '0.75rem 1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '3px solid #db2777', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ background: '#fce7f3', color: '#9d174d', padding: '1px 6px', borderRadius: '9999px', fontSize: '0.62rem', fontWeight: 700 }}>{item.answerkey_categories?.name}</span>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                </div>
                <span style={{ color: '#94a3b8', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
          {(!items || items.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '2rem' }}>📝</p>
              <p>No answer keys found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}