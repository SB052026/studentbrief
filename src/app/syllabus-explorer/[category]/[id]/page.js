import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PDFDownload from '@/components/PDFDownload'

export default async function SyllabusDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .eq('id', id)
    .single()

  // Get syllabus for this exam
  const { data: syllabus } = await supabase
    .from('syllabus')
    .select('*')
    .ilike('exam_name', `%${job?.title?.split(' ')[0]}%`)
    .limit(5)

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/syllabus-explorer" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Syllabus</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/syllabus-explorer/${category}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{job?.job_categories?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{job?.title}</span>
        </div>

        {/* Job Title */}
        <div style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>{job?.title}</h1>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{job?.job_categories?.name}</span>
        </div>

        {/* Syllabus Content */}
        {syllabus && syllabus.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {syllabus.map(syl => (
              <div key={syl.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginBottom: '8px' }}>{syl.title}</h3>
                {syl.description && <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>{syl.description}</p>}
                {syl.content && (
                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.75rem', marginBottom: '8px', fontSize: '0.78rem', color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>
                    {syl.content}
                  </div>
                )}
                {syl.syllabus_link && (
                  <PDFDownload url={syl.syllabus_link} title={syl.title} type="syllabus" category={job?.job_categories?.name || ''} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</p>
            <p style={{ fontWeight: 600, color: '#475569' }}>Syllabus coming soon!</p>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>We are working on adding syllabus for this exam.</p>
          </div>
        )}

        {/* Apply Link */}
        {job?.apply_link && (
          <a href={job.apply_link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', marginTop: '1rem', boxShadow: '0 8px 25px rgba(249,115,22,0.3)' }}>
            Apply Now — Official Website →
          </a>
        )}
      </main>
      <Footer />
    </div>
  )
}
