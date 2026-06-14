import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function ResultDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()

  const { data: result } = await supabase
    .from('results')
    .select('*, result_categories(name, slug)')
    .eq('id', id)
    .single()

  if (!result) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontWeight: 700, color: '#475569' }}>Result nahi mila</h2>
            <Link href="/results" style={{ color: '#1a3c8f', marginTop: '8px', display: 'block' }}>← Wapas Results pe jao</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const dateItems = [
    { label: 'Published Date', value: formatDate(result.published_date), color: '#1e293b' },
    { label: 'Exam Date', value: formatDate(result.exam_date), color: '#1e293b' },
    { label: 'Result Date', value: formatDate(result.result_date), color: '#22c55e' },
  ]

  const detailCards = [
    { icon: '🏢', title: 'Organization', value: result.organization, bg: '#dbeafe' },
    { icon: '📋', title: 'Post Name', value: result.post_name, bg: '#dcfce7' },
    { icon: '👥', title: 'Total Vacancies', value: result.total_vacancies?.toLocaleString('en-IN'), bg: '#fef3c7' },
    { icon: '📊', title: 'Result Status', value: result.result_status, bg: '#fce7f3' },
  ]

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem' }}>
          <Link href="/results" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Results</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/results/${category}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{result.result_categories?.name}</Link>
        </div>

        {/* Title Card */}
        <div style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 8px 25px rgba(22,163,74,0.25)' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-block', marginBottom: '8px' }}>
            {result.result_status}
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', lineHeight: 1.3 }}>{result.title}</h1>
        </div>

        {/* Important Dates */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Important Dates
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {dateItems.map((item, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>{item.label}</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {detailCards.map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                {card.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>{card.title}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{card.value || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Check Result Button */}
        <a href={result.result_link} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          background: 'linear-gradient(135deg, #f97316, #fb923c)',
          color: 'white', padding: '16px', borderRadius: '14px',
          fontWeight: 800, fontSize: '1.05rem',
          boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
        }}>
          Check Result — Official Website →
        </a>
      </main>
      <Footer />
    </div>
  )
}
