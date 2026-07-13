import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Syllabus - StudentBrief',
  description: 'Latest Exam Syllabus on StudentBrief.in',
}

export default async function SyllabusPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('syllabus')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1rem' }}>📚 Syllabus</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items?.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '3px solid #3730a3' }}>
              <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</h3>
              {item.exam_name && <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>📋 {item.exam_name}</p>}
              {item.description && <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '8px' }}>{item.description}</p>}

              {/* Content */}
              {item.content && (
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.75rem', marginBottom: '8px', fontSize: '0.78rem', color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>
                  {item.content}
                </div>
              )}

              {/* PDF Download */}
              {item.syllabus_link && (
                <a href={item.syllabus_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #3730a3, #4f46e5)', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', marginTop: '4px' }}>
                  📥 Download PDF
                </a>
              )}
            </div>
          ))}

          {(!items || items.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '2rem' }}>📚</p>
              <p>Koi syllabus nahi hai</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
