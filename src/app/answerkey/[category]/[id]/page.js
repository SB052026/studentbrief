import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function AnswerKeyDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('answerkeys')
    .select('*, answerkey_categories(name, slug)')
    .eq('id', id)
    .single()

  if (!item) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontWeight: 700, color: '#475569' }}>Answer key nahi mili</h2>
            <Link href="/answerkey" style={{ color: '#1a3c8f', marginTop: '8px', display: 'block' }}>← Wapas jao</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const dateItems = [
    { label: 'Published Date', value: formatDate(item.published_date) },
    { label: 'Exam Date', value: formatDate(item.exam_date) },
    { label: 'Objection Last Date', value: formatDate(item.objection_last_date) },
  ]

  const detailCards = [
    { icon: '🏢', title: 'Organization', value: item.organization, bg: '#dbeafe' },
    { icon: '📋', title: 'Post Name', value: item.post_name, bg: '#dcfce7' },
    { icon: '📊', title: 'Status', value: item.answerkey_status, bg: '#fef3c7' },
  ]

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem' }}>
          <Link href="/answerkey" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Answer Keys</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/answerkey/${category}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{item.answerkey_categories?.name}</Link>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 8px 25px rgba(26,60,143,0.25)' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-block', marginBottom: '8px' }}>
            {item.answerkey_status}
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', lineHeight: 1.3 }}>{item.title}</h1>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📅 Important Dates</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {dateItems.map((d, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>{d.label}</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {detailCards.map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{card.icon}</div>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>{card.title}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{card.value || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>

        <a href={item.answerkey_link} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          background: 'linear-gradient(135deg, #f97316, #fb923c)',
          color: 'white', padding: '16px', borderRadius: '14px',
          fontWeight: 800, fontSize: '1.05rem',
          boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
        }}>
          Download Answer Key — Official Website →
        </a>
      </main>
      <Footer />
    </div>
  )
}
