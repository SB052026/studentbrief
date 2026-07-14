import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function SyllabusCategoryPage({ params }) {
  const { category } = await params
  const supabase = await createClient()

  const { data: cat } = await supabase
    .from('job_categories')
    .select('*')
    .eq('slug', category)
    .single()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, apply_link')
    .eq('category_id', cat?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem' }}>
          <Link href="/syllabus-explorer" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Syllabus</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{cat?.name}</span>
        </div>

        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>{cat?.icon} {cat?.name}</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select exam to view syllabus</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {jobs?.map(job => (
            <Link key={job.id} href={`/syllabus-explorer/${category}/${job.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '0.875rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid #0f766e' }}>
                <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>{job.title}</p>
                <span style={{ color: '#94a3b8', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}

          {(!jobs || jobs.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '2rem' }}>📚</p>
              <p>No exams found in this category</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
