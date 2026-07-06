import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function JobDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .eq('id', id)
    .single()

  if (!job) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontWeight: 700, color: '#475569' }}>Job nahi mili</h2>
            <Link href="/jobs" style={{ color: '#1a3c8f', marginTop: '8px', display: 'block' }}>← Wapas Jobs pe jao</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const sectionStyle = { background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }
  const headingStyle = { fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }
  const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }
  const thStyle = { padding: '8px 12px', background: '#1a3c8f', color: 'white', fontWeight: 700, textAlign: 'left' }
  const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #f1f5f9', color: '#374151' }
  const tdAltStyle = { ...tdStyle, background: '#f8fafc' }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem' }}>
          <Link href="/jobs" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Jobs</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/jobs/${category}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{job.job_categories?.name}</Link>
        </div>

        {/* Title Card */}
        <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 8px 25px rgba(26,60,143,0.25)' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-block', marginBottom: '8px' }}>
            {job.job_categories?.name}
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', lineHeight: 1.3 }}>{job.title}</h1>
        </div>

        {/* Description */}
        {job.description && (
          <div style={{ ...sectionStyle, borderLeft: '4px solid #f97316' }}>
            <h3 style={headingStyle}>📋 Job Description</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7 }}>{job.description}</p>
          </div>
        )}

        {/* Short Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: '#dbeafe', borderRadius: '12px', padding: '0.875rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: '#1e40af', marginBottom: '4px', fontWeight: 600 }}>👤 Age Limit</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{job.age_criteria?.[0]?.min_age || 'N/A'}-{job.age_criteria?.[0]?.max_age || 'N/A'} Yrs</p>
          </div>
          <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '0.875rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: '#166534', marginBottom: '4px', fontWeight: 600 }}>📅 Last Date</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444' }}>{formatDate(job.last_date)}</p>
          </div>
          <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '0.875rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: '#92400e', marginBottom: '4px', fontWeight: 600 }}>📝 Exam Date</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{formatDate(job.exam_date)}</p>
          </div>
        </div>

        {/* Important Dates */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>📅 Important Dates</h3>
          <table style={tableStyle}>
            <tbody>
              {[
                { label: 'Published Date', value: formatDate(job.published_date) },
                { label: 'Last Date to Apply', value: formatDate(job.last_date), highlight: true },
                { label: 'Exam Date', value: formatDate(job.exam_date) },
                { label: 'Physical Date', value: formatDate(job.physical_date) },
                { label: 'Medical Date', value: formatDate(job.medical_date) },
              ].map((item, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{item.label}</td>
                  <td style={{ ...(i % 2 === 0 ? tdStyle : tdAltStyle), color: item.highlight ? '#ef4444' : '#374151', fontWeight: item.highlight ? 700 : 400 }}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Age Criteria Table */}
        {job.age_criteria && job.age_criteria.length > 0 && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>👤 Age Limit (Category Wise)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Category</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Min Age</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Max Age</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Relaxation</th>
                  </tr>
                </thead>
                <tbody>
                  {job.age_criteria.map((row, i) => (
                    <tr key={i}>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.category}</td>
                      <td style={{ ...(i % 2 === 0 ? tdStyle : tdAltStyle), textAlign: 'center' }}>{row.min_age} Years</td>
                      <td style={{ ...(i % 2 === 0 ? tdStyle : tdAltStyle), textAlign: 'center' }}>{row.max_age} Years</td>
                      <td style={{ ...(i % 2 === 0 ? tdStyle : tdAltStyle), textAlign: 'center' }}>{row.relaxation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fee Criteria Table */}
        {job.fee_criteria && job.fee_criteria.length > 0 && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>💰 Application Fee</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Category</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Fee Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {job.fee_criteria.map((row, i) => (
                    <tr key={i}>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.category}</td>
                      <td style={{ ...(i % 2 === 0 ? tdStyle : tdAltStyle), textAlign: 'center', fontWeight: 700, color: row.fee === '0' ? '#16a34a' : '#1e293b' }}>
                        {row.fee === '0' ? 'Free' : `₹${row.fee}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vacancy Details */}
        {job.vacancy_details && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>📊 Vacancy Details</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{job.vacancy_details}</p>
          </div>
        )}

        {/* Education */}
        {job.education && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>🎓 Education Qualification</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7 }}>{job.education}</p>
          </div>
        )}

        {/* Selection Process */}
        {job.selection_process && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>📋 Selection Process</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7 }}>{job.selection_process}</p>
          </div>
        )}

        {/* Physical Requirements */}
        {job.physical_measurements && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>🏃 Physical Requirements</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{job.physical_measurements}</p>
          </div>
        )}

        {/* Medical Criteria */}
        {job.medical_criteria && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>🏥 Medical Criteria</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{job.medical_criteria}</p>
          </div>
        )}

        {/* Required Documents */}
        {job.documents && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>📄 Required Documents</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{job.documents}</p>
          </div>
        )}

        {/* Apply Button */}
        <a href={job.apply_link} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          background: 'linear-gradient(135deg, #f97316, #fb923c)',
          color: 'white', padding: '16px', borderRadius: '14px',
          fontWeight: 800, fontSize: '1.05rem',
          boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
        }}>
          Apply Now — Official Website →
        </a>

      </main>
      <Footer />
    </div>
  )
}
