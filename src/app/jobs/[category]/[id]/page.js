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

  const dateItems = [
    { label: 'Published Date', value: formatDate(job.published_date), color: '#1e293b' },
    { label: 'Last Date', value: formatDate(job.last_date), color: '#ef4444' },
    { label: 'Exam Date', value: formatDate(job.exam_date), color: '#1e293b' },
    { label: 'Physical Date', value: formatDate(job.physical_date), color: '#1e293b' },
    { label: 'Medical Date', value: formatDate(job.medical_date), color: '#1e293b' },
  ]

  const detailCards = [
    { icon: '👤', title: 'Age Limit', value: `${job.age_min} - ${job.age_max} Years`, bg: '#dbeafe' },
    { icon: '🎓', title: 'Education', value: job.education, bg: '#dcfce7' },
    { icon: '📄', title: 'Required Documents', value: job.documents, bg: '#fef3c7' },
    { icon: '📏', title: 'Physical Measurements', value: job.physical_measurements, bg: '#fce7f3' },
    { icon: '🏥', title: 'Medical Criteria', value: job.medical_criteria, bg: '#e0e7ff' },
  ]

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

        {/* Description Card */}
        {job.description && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderLeft: '4px solid #f97316' }}>
            <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📋 Job Description</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7 }}>{job.description}</p>
          </div>
        )}

        {/* Short Info Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: '#dbeafe', borderRadius: '12px', padding: '0.875rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: '#1e40af', marginBottom: '4px', fontWeight: 600 }}>👤 Age Limit</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{job.age_min}-{job.age_max} Yrs</p>
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
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Important Dates
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {dateItems.map((item, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>{item.label}</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {detailCards.map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  {card.icon}
                </div>
                <h3 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.9rem' }}>{card.title}</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, paddingLeft: '50px' }}>{card.value || 'N/A'}</p>
            </div>
          ))}
        </div>

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
