import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Latest Govt Jobs 2026 - StudentBrief',
  description: 'Latest Govt Jobs, Bank Jobs, Railway Jobs on StudentBrief.in',
}

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>💼 Latest Jobs</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sabhi Latest Govt Jobs</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jobs?.map(job => (
            <Link key={job.id} href={`/jobs/${job.job_categories?.slug}/${job.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '0.75rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '3px solid #1a3c8f' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{job.job_categories?.name}</span>
                    {job.last_date && new Date(job.last_date) >= new Date() && (
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>Active</span>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.4 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', flexWrap: 'wrap' }}>
                    {job.last_date && <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>⏰ Last Date: {formatDate(job.last_date)}</span>}
                    {job.education && <span style={{ fontSize: '0.7rem', color: '#64748b' }}>🎓 {job.education}</span>}
                  </div>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}

          {(!jobs || jobs.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '3rem' }}>💼</p>
              <p style={{ fontWeight: 600 }}>Abhi koi job nahi hai</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
