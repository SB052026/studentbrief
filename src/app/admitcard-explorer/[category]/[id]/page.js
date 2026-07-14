import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function AdmitCardDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('admitcards').select('*, admitcard_categories(name, slug)').eq('id', id).single()

  const sectionStyle = { background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admitcard-explorer" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Admit Cards</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/admitcard-explorer/${category}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{item?.admitcard_categories?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{item?.title}</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{item?.admitcard_categories?.name}</span>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white', marginTop: '6px' }}>{item?.title}</h1>
        </div>

        {item?.exam_date && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📅 Exam Date</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#d97706' }}>{formatDate(item.exam_date)}</p>
          </div>
        )}

        {item?.description && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📋 Description</h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>{item.description}</p>
          </div>
        )}

        {item?.admit_card_link && (
          <a href={item.admit_card_link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', marginTop: '1rem' }}>
            Download Admit Card →
          </a>
        )}
      </main>
      <Footer />
    </div>
  )
}
