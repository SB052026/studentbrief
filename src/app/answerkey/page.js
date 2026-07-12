import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Latest Answer Keys 2026 - StudentBrief',
  description: 'Latest Answer Keys on StudentBrief.in',
}

export default async function AnswerKeyPage() {
  const supabase = await createClient()
  const { data: answerkeys } = await supabase
    .from('answerkeys')
    .select('*, answerkey_categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📝 Answer Keys</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sabhi Latest Answer Keys</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {answerkeys?.map(ak => (
            <Link key={ak.id} href={`/answerkey/${ak.answerkey_categories?.slug}/${ak.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '1rem 1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid #db2777' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ background: '#fce7f3', color: '#9d174d', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{ak.answerkey_categories?.name}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.4 }}>{ak.title}</h3>
                  {ak.exam_date && <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px', display: 'block' }}>📅 Exam: {formatDate(ak.exam_date)}</span>}
                </div>
                <span style={{ color: '#94a3b8', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
          {(!answerkeys || answerkeys.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '3rem' }}>📝</p>
              <p style={{ fontWeight: 600 }}>Abhi koi answer key nahi hai</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
