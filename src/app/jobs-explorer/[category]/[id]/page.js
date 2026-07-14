import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function JobsExplorerDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .eq('id', id)
    .single()

  const sectionStyle = { background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
  const thStyle = { padding: '8px 12px', background: '#1a3c8f', color: 'white', fontWeight: 700, textAlign: 'left', fontSize: '0.78rem' }
  const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #f1f5f9', color: '#374151', fontSize: '0.78rem' }
  const tdAltStyle = { ...tdStyle, background: '#f8fafc' }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/jobs-explorer" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Jobs</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/jobs-explorer/${category}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{job?.job_categories?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{job?.title}</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{job?.job_categories?.name}</span>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white', marginTop: '6px' }}>{job?.title}</h1>
        </div>

        {job?.description && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📋 Description</h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>{job.description}</p>
          </div>
        )}

        <div style={sectionStyle}>
          <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📅 Important Dates</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Published Date', formatDate(job?.published_date)],
                ['Last Date', formatDate(job?.last_date)],
                ['Exam Date', formatDate(job?.exam_date)],
                ['Physical Date', formatDate(job?.physical_date)],
                ['Medical Date', formatDate(job?.medical_date)],
              ].filter(([, v]) => v !== 'N/A').map(([label, value], i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{label}</td>
                  <td style={{ ...(i % 2 === 0 ? tdStyle : tdAltStyle), color: label === 'Last Date' ? '#ef4444' : '#374151', fontWeight: label === 'Last Date' ? 700 : 400 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {job?.age_criteria?.length > 0 && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>👤 Age Limit</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Category', 'Min Age', 'Max Age', 'Relaxation'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {job.age_criteria.map((row, i) => (
                    <tr key={i}>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.category}</td>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.min_age} Yrs</td>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.max_age} Yrs</td>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.relaxation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {job?.fee_criteria?.length > 0 && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>💰 Application Fee</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Category', 'Fee'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {job.fee_criteria.map((row, i) => (
                  <tr key={i}>
                    <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.category}</td>
                    <td style={{ ...(i % 2 === 0 ? tdStyle : tdAltStyle), fontWeight: 700, color: row.fee === '0' ? '#16a34a' : '#1e293b' }}>{row.fee === '0' ? 'Free' : `₹${row.fee}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {job?.education && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>🎓 Education</h3>
            <p style={{ fontSize: '0.82rem', color: '#475569' }}>{job.education}</p>
          </div>
        )}

        {job?.selection_process && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📋 Selection Process</h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>{job.selection_process}</p>
          </div>
        )}

        {job?.vacancy_details && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📊 Vacancy Details</h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{job.vacancy_details}</p>
          </div>
        )}

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
