import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Latest Govt Jobs 2026 - StudentBrief',
  description: 'Latest Govt Jobs, Bank Jobs, Railway Jobs on StudentBrief.in',
}

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, last_date, job_categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1rem' }}>💼 Latest Jobs</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {jobs?.map(job => (
            <Link key={job.id} href={`/jobs/${job.job_categories?.slug}/${job.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '10px', padding: '0.75rem 1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '3px solid #1a3c8f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: '9999px', fontSize: '0.62rem', fontWeight: 700 }}>{job.job_categories?.name}</span>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                </div>
                <span style={{ color: '#94a3b8', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          ))}
          {(!jobs || jobs.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '2rem' }}>💼</p>
              <p>No jobs found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}