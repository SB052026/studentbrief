'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function SubsectionPage({ params }) {
  const [subject, setSubject] = useState(null)
  const [topic, setTopic] = useState(null)
  const [section, setSection] = useState(null)
  const [subsections, setSubsections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { subject: subjectId, topic: topicId, section: sectionId } = await params
      const supabase = createClient()
      const { data: subjectData } = await supabase.from('mock_subjects').select('*').eq('id', subjectId).single()
      const { data: topicData } = await supabase.from('mock_topics').select('*').eq('id', topicId).single()
      const { data: sectionData } = await supabase.from('mock_sections').select('*').eq('id', sectionId).single()
      const { data: subsectionsData } = await supabase.from('mock_subsections').select('*').eq('section_id', sectionId).order('name')
      setSubject(subjectData)
      setTopic(topicData)
      setSection(sectionData)
      setSubsections(subsectionsData || [])
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
          <span style={{ color: '#64748b' }}>{section?.name}</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>{section?.icon} {section?.name}</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sub-section select karo</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {subsections.map(sub => (
              <Link key={sub.id} href={`/dashboard/subject-mock/${subject?.id}/${topic?.id}/${section?.id}/${sub.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '1rem 1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{sub.icon}</span>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{sub.name}</h3>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
