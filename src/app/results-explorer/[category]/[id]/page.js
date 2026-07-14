import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function ResultsDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()
  const { data: result } = await supabase.from('results').select('*, result_categories(name, slug)').eq('id', id).single()

  const sectionStyle = { background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
  const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #f1f5f9', color: '#374151', fontSize: '0.78rem' }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/results-explorer" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Results</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/results-explorer/${category}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{result?.result_categories?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{result?.title}</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{result?.result_categories?.name}</span>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white', marginTop: '6px' }}>{result?.title}</h1>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📅 Details</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Organization', result?.organization],
                ['Post Name', result?.post_name],
                ['Total Vacancies', result?.total_vacancies],
                ['Result Status', result?.result_status],
                ['Exam Date', formatDate(result?.exam_date)],
                ['Result Date', formatDate(result?.result_date)],
              ].filter(([, v]) => v && v !== 'N/A').map(([label, value], i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, background: i % 2 === 0 ? 'white' : '#f8fafc' }}>{label}</td>
                  <td style={{ ...tdStyle, background: i % 2 === 0 ? 'white' : '#f8fafc', fontWeight: 600 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result?.description && (
          <div style={sectionStyle}>
            <h3 style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '8px' }}>📋 Description</h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>{result.description}</p>
          </div>
        )}

        {result?.result_link && (
          <a href={result.result_link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', marginTop: '1rem' }}>
            View Result — Official Website →
          </a>
        )}
      </main>
      <Footer />
    </div>
  )
}
