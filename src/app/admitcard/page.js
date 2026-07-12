import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Latest Admit Cards 2026 - StudentBrief',
  description: 'Latest Admit Cards on StudentBrief.in',
}

export default async function AdmitCardPage() {
  const supabase = await createClient()
  const { data: admitcards } = await supabase
    .from('admitcards')
    .select('*, admitcard_categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>🎫 Admit Cards</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sabhi Latest Admit Cards</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {admitcards?.map(ac => (
            <Link key={ac.id} href={`/admitcard/${ac.admitcard_categories?.slug}/${ac.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '0.75rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '4px solid #d97706' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>{ac.admitcard_categories?.name}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.4 }}>{ac.title}</h3>
                  {ac.exam_date && <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600, marginTop: '6px', display: 'block' }}>📅 Exam: {formatDate(ac.exam_date)}</span>}
                </div>
                <span style={{ color: '#94a3b8', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
          {(!admitcards || admitcards.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '3rem' }}>🎫</p>
              <p style={{ fontWeight: 600 }}>Abhi koi admit card nahi hai</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
