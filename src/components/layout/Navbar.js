'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, dbUser, loading } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const [quickLinks, setQuickLinks] = useState({ job: '/jobs', result: '/results', admitcard: '/admitcard', answerkey: '/answerkey' })
  const [expandedSection, setExpandedSection] = useState(null)
  const [sectionData, setSectionData] = useState([])
  const [sectionLoading, setSectionLoading] = useState(false)

  async function handleQuickLink(type, href) {
  if (expandedSection === type) {
    setExpandedSection(null)
    setSectionData([])
    return
  }
  setSectionLoading(true)
  setExpandedSection(type)
  const supabase = createClient()
  let data = []
  if (type === 'job') {
    const { data: d } = await supabase.from('jobs').select('id, title, job_categories(slug)').order('created_at', { ascending: false }).limit(8)
    data = (d || []).map(i => ({ title: i.title, href: `/jobs/${i.job_categories?.slug}/${i.id}` }))
  } else if (type === 'result') {
    const { data: d } = await supabase.from('results').select('id, title, result_categories(slug)').order('created_at', { ascending: false }).limit(8)
    data = (d || []).map(i => ({ title: i.title, href: `/results/${i.result_categories?.slug}/${i.id}` }))
  } else if (type === 'admitcard') {
    const { data: d } = await supabase.from('admitcards').select('id, title, admitcard_categories(slug)').order('created_at', { ascending: false }).limit(8)
    data = (d || []).map(i => ({ title: i.title, href: `/admitcard/${i.admitcard_categories?.slug}/${i.id}` }))
  } else if (type === 'answerkey') {
    const { data: d } = await supabase.from('answerkeys').select('id, title, answerkey_categories(slug)').order('created_at', { ascending: false }).limit(8)
    data = (d || []).map(i => ({ title: i.title, href: `/answerkey/${i.answerkey_categories?.slug}/${i.id}` }))
  } else if (type === 'syllabus') {
    const { data: d } = await supabase.from('syllabus').select('id, title').order('created_at', { ascending: false }).limit(8)
    data = (d || []).map(i => ({ title: i.title, href: `/syllabus` }))
  }
  setSectionData(data)
  setSectionLoading(false)
  }

  useEffect(() => {
    async function fetchLatest() {
      const supabase = createClient()
      const { data: job } = await supabase.from('jobs').select('id, job_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      const { data: result } = await supabase.from('results').select('id, result_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      const { data: admitcard } = await supabase.from('admitcards').select('id, admitcard_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      const { data: answerkey } = await supabase.from('answerkeys').select('id, answerkey_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      setQuickLinks({
        job: job ? `/jobs/${job.job_categories?.slug}/${job.id}` : '/jobs',
        result: result ? `/results/${result.result_categories?.slug}/${result.id}` : '/results',
        admitcard: admitcard ? `/admitcard/${admitcard.admitcard_categories?.slug}/${admitcard.id}` : '/admitcard',
        answerkey: answerkey ? `/answerkey/${answerkey.answerkey_categories?.slug}/${answerkey.id}` : '/answerkey',
      })
    }
    fetchLatest()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
  }

  return (
    <nav style={{
      background: 'rgba(26,60,143,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>

        {/* Logo */}
<Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>
              Student<span style={{ color: '#f97316' }}>Brief</span>
            </span>
            <span style={{ fontSize: '0.6rem', color: 'rgba(191,219,254,0.8)', fontWeight: 500, letterSpacing: '0.02em' }}>
              Every Student Deserves to Excel
            </span>
          </div>
        </Link>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Profile Icon / Login */}
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', width: '38px', height: '38px', borderRadius: '10px',
              cursor: 'pointer', fontSize: '1.1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(15,36,96,0.98)', backdropFilter: 'blur(10px)',
          padding: '0.75rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '1200px', margin: '0 auto',
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={menuLink}>🏠 Home</Link>
          <Link href="/jobs" onClick={() => setMenuOpen(false)} style={menuLink}>💼 Jobs</Link>
          <Link href="/results" onClick={() => setMenuOpen(false)} style={menuLink}>📊 Results</Link>
<Link href="/syllabus" onClick={() => setMenuOpen(false)} style={menuLink}>📚 Syllabus</Link>
          <Link href="/answerkey" onClick={() => setMenuOpen(false)} style={menuLink}>📝 Answer Keys</Link>
          <Link href="/admitcard" onClick={() => setMenuOpen(false)} style={menuLink}>🎫 Admit Cards</Link>
          {user && (
            <>
              <Link href="/dashboard/mock-test" onClick={() => setMenuOpen(false)} style={menuLink}>📝 Mock Test</Link>
              <Link href="/dashboard/pyp" onClick={() => setMenuOpen(false)} style={menuLink}>📄 PYP</Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={menuLink}>👤 My Profile</Link>
            </>
          )}
          <Link href="/about" onClick={() => setMenuOpen(false)} style={menuLink}>ℹ️ About Us</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={menuLink}>📞 Contact Us</Link>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
            {user ? (
              <button onClick={handleLogout} style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.2)', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', width: '100%', textAlign: 'left' }}>
                🚪 Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                🚀 Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}

      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0.75rem", display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
        <button onClick={() => handleQuickLink('job', quickLinks.job)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'job' ? "#1e40af" : "#dbeafe", color: expandedSection === 'job' ? "white" : "#1e40af", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>💼 Jobs</button>
        <button onClick={() => handleQuickLink('result', quickLinks.result)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'result' ? "#166534" : "#dcfce7", color: expandedSection === 'result' ? "white" : "#166534", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>📊 Results</button>
        <button onClick={() => handleQuickLink('admitcard', quickLinks.admitcard)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'admitcard' ? "#92400e" : "#fef3c7", color: expandedSection === 'admitcard' ? "white" : "#92400e", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>🎫 Admit Cards</button>
        <button onClick={() => handleQuickLink('answerkey', quickLinks.answerkey)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'answerkey' ? "#9d174d" : "#fce7f3", color: expandedSection === 'answerkey' ? "white" : "#9d174d", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>📝 Answer Keys</button>
        <button onClick={() => handleQuickLink('syllabus', '/syllabus')} style={{ flex: 1, textAlign: "center", background: expandedSection === 'syllabus' ? "#3730a3" : "#e0e7ff", color: expandedSection === 'syllabus' ? "white" : "#3730a3", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>📚 Syllabus</button>
      </div>

      {expandedSection && (
        <div style={{ background: "white", borderBottom: "2px solid #e2e8f0", padding: "0.75rem 1rem", maxHeight: "280px", overflowY: "auto" }}>
          {sectionLoading ? (
            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8rem" }}>Loading...</p>
          ) : sectionData.length > 0 ? (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {sectionData.map((item, i) => (
                <li key={i} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.4rem" }}>
                  <Link href={item.href} onClick={() => setExpandedSection(null)} style={{ color: "#1a3c8f", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "#f97316", fontSize: "0.6rem" }}>●</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8rem" }}>Koi data nahi mila</p>
          )}
        </div>
      )}
    </nav>
  )
}

const menuLink = {
  color: 'rgba(255,255,255,0.85)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  padding: '10px 12px',
  borderRadius: '8px',
}
