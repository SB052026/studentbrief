'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function SubsectionTestsPage({ params }) {
  const [subject, setSubject] = useState(null)
  const [topic, setTopic] = useState(null)
  const [section, setSection] = useState(null)
  const [subsection, setSubsection] = useState(null)
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { subject: subjectId, topic: topicId, section: sectionId, subsection: subsectionId } = await params
      const supabase = createClient()
      const [
        { data: subjectData },
        { data: topicData },
        { data: sectionData },
        { data: subsectionData },
        { data: testsData },
      ] = await Promise.all([
        supabase.from('mock_subjects').select('*').eq('id', subjectId).single(),
        supabase.from('mock_topics').select('*').eq('id', topicId).single(),
        supabase.from('mock_sections').select('*').eq('id', sectionId).single(),
        supabase.from('mock_subsections').select('*').eq('id', subsectionId).single(),
        supabase.from('mock_tests').select('*').eq('subsection_id', subsectionId).order('created_at', { ascending: false }),
      ])
      setSubject(subjectData)
      setTopic(topicData)
      setSection(sectionData)
      setSubsection(subsectionData)
      setTests(testsData || [])
      setLoading(false)
    }
    fetchData()
  }, [params])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/subject-mock" style={{ color: '#1a3c8f', textDecoration: 'none' }}>Subject Mock</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/dashboard/subject-mock/${subject?.id}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{subject?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/dashboard/subject-mock/${subject?.id}/${topic?.id}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{topic?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <Link href={`/dashboard/subject-mock/${subject?.id}/${topic?.id}/${section?.id}`} style={{ color: '#1a3c8f', textDecoration: 'none' }}>{section?.name}</Link>
          <span style={{ color: '#94a3b8' }}>→</span>
          <span style={{ color: '#64748b' }}>{subsection?.name}</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>{subsection?.icon} {subsection?.name}</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Available Mock Tests</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
        ) : tests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tests.map(test => (
              <div key={test.id} style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{test.title}</h3>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{test.total_questions} Q</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>⏱️ {test.duration_minutes} minutes</p>
                <Link href={`/dashboard/mock-test/instructions?id=${test.id}&title=${encodeURIComponent(test.title)}`} style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                  Test Shuru Karo →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</p>
            <p style={{ fontWeight: 600 }}>Is section me abhi koi test nahi hai</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>Jald add kiye jayenge!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
