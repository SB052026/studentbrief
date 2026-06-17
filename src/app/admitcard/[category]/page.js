import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/ui/EmptyState'

export default async function AdmitCardCategoryPage({ params }) {
  const { category } = await params
  const supabase = await createClient()

  const { data: categoryData } = await supabase
    .from('admitcard_categories')
    .select('*')
    .eq('slug', category)
    .single()

  const { data: admitcards } = await supabase
    .from('admitcards')
    .select('*')
    .eq('category_id', categoryData?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem' }}>
          <Link href="/admitcard" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Admit Cards</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{categoryData?.icon} {categoryData?.name}</span>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1rem' }}>{categoryData?.name}</h1>

        {admitcards && admitcards.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {admitcards.map((item) => (
              <Link key={item.id} href={`/admitcard/${category}/${item.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <h2 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.72rem', color: '#64748b' }}>
                        <span>📅 Download Last Date: {formatDate(item.download_last_date)}</span>
                      </div>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {item.admitcard_status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Koi admit card nahi mila" description="Is category me abhi koi admit card available nahi hai" icon="🎫" />
        )}
      </main>
      <Footer />
    </div>
  )
}
