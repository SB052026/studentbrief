import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Latest Jobs - StudentBrief',
  description: 'Latest Govt Jobs, Bank Jobs, Railway Jobs and more on StudentBrief.in',
}

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('job_categories')
    .select('*')
    .order('name')

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>💼 Latest Jobs</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Apni category select karo</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {categories?.map(category => (
            <Link key={category.slug} href={`/jobs/${category.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem 0.75rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{category.icon}</span>
                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
