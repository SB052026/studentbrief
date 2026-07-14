import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Syllabus Explorer - StudentBrief',
  description: 'Exam wise Syllabus and Calendar on StudentBrief.in',
}

export default async function SyllabusExplorerPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('job_categories')
    .select('*')
    .order('name')

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📚 Syllabus Explorer</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select exam category</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {categories?.map(cat => (
            <Link key={cat.id} href={`/syllabus-explorer/${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '3px solid #0f766e', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{cat.icon || '📋'}</span>
                <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        {(!categories || categories.length === 0) && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <p style={{ fontSize: '2rem' }}>📚</p>
            <p>No categories found</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
