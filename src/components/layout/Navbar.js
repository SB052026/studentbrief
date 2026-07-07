'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, dbUser, loading } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showQuickLinks, setShowQuickLinks] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [siteSettings, setSiteSettings] = useState({ logo_url: '', logo_size: '38', slogan: 'Every Student Deserves to Excel' })

  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        const cached = sessionStorage.getItem('sb_site_settings')
        if (cached) {
          setSiteSettings(prev => ({ ...prev, ...JSON.parse(cached) }))
          return
        }
        const supabase = createClient()
        const { data } = await supabase.from('site_settings').select('*')
        const obj = {}
        data?.forEach(s => { obj[s.key] = s.value })
        sessionStorage.setItem('sb_site_settings', JSON.stringify(obj))
        setSiteSettings(prev => ({ ...prev, ...obj }))
      } catch(e) {}
    }
    fetchSiteSettings()
  }, [])
  const lastScrollRef = require('react').useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentScroll = window.scrollY
      if (currentScroll <= 50) {
        setShowQuickLinks(true)
      } else if (currentScroll > lastScrollRef.current + 50) {
        setShowQuickLinks(false)
        setExpandedSection(null)
      } else if (currentScroll < lastScrollRef.current - 50) {
        setShowQuickLinks(true)
      }
      lastScrollRef.current = currentScroll
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
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
      const cachedLinks = sessionStorage.getItem('sb_quick_links')
      if (cachedLinks) {
        setQuickLinks(JSON.parse(cachedLinks))
        return
      }
      const supabase = createClient()
      const { data: job } = await supabase.from('jobs').select('id, job_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      const { data: result } = await supabase.from('results').select('id, result_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      const { data: admitcard } = await supabase.from('admitcards').select('id, admitcard_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      const { data: answerkey } = await supabase.from('answerkeys').select('id, answerkey_categories(slug)').order('created_at', { ascending: false }).limit(1).maybeSingle()
      const links = {
        job: job ? `/jobs/${job.job_categories?.slug}/${job.id}` : '/jobs',
        result: result ? `/results/${result.result_categories?.slug}/${result.id}` : '/results',
        admitcard: admitcard ? `/admitcard/${admitcard.admitcard_categories?.slug}/${admitcard.id}` : '/admitcard',
        answerkey: answerkey ? `/answerkey/${answerkey.answerkey_categories?.slug}/${answerkey.id}` : '/answerkey',
      }
      setQuickLinks(links)
      sessionStorage.setItem('sb_quick_links', JSON.stringify(links))
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={siteSettings.logo_url || '/logo.png'} alt="StudentBrief Logo" style={{ borderRadius: '8px', objectFit: 'cover', display: 'block', width: `${siteSettings.logo_size || 38}px`, height: `${siteSettings.logo_size || 38}px` }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>
              Student<span style={{ color: '#f97316' }}>Brief</span>
            </span>
            <span style={{ fontSize: '0.6rem', color: 'rgba(191,219,254,0.8)', fontWeight: 500, letterSpacing: '0.02em' }}>
              {siteSettings.slogan || 'Every Student Deserves to Excel'}
            </span>
            </div>
          </div>
        </Link>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Profile Icon / Login */}
          {/* Search Button */}
          <button
            onClick={() => { setSearchOpen(prev => !prev); setSearchQuery(''); setSearchResults([]) }}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', width: '38px', height: '38px', borderRadius: '10px',
              cursor: 'pointer', fontSize: '1.1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            🔍
          </button>
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
      {searchOpen && (
        <div style={{ background: 'white', padding: '0.75rem 1rem', position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search jobs, results, mock tests..."
              style={{ width: '100%', padding: '10px 40px 10px 16px', borderRadius: '12px', border: '2px solid #1a3c8f', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box' }}
            />
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              {searching ? '⏳' : '🔍'}
            </span>
          </div>

          {searchResults.length > 0 && (
            <div style={{ maxWidth: '600px', margin: '0.5rem auto 0', maxHeight: '60vh', overflowY: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {searchResults.map((item, i) => (
                <Link key={i} href={getSearchLink(item)} onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]) }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{getTypeIcon(item.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{getTypeLabel(item.type)}</p>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>→</span>
                </Link>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
            <div style={{ maxWidth: '600px', margin: '0.5rem auto 0', padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              Koi result nahi mila 😔
            </div>
          )}
        </div>
      )}

      {menuOpen && (
        <div style={{
          background: 'rgba(15,36,96,0.98)', backdropFilter: 'blur(10px)',
          padding: '0.75rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          position: 'fixed', top: '56px', left: 0, right: 0,
          zIndex: 9999, maxHeight: '80vh', overflowY: 'auto',
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={menuLink}>🏠 Home</Link>
          <Link href="/jobs" onClick={() => setMenuOpen(false)} style={menuLink}>💼 Jobs</Link>
          <Link href="/results" onClick={() => setMenuOpen(false)} style={menuLink}>📊 Results</Link>
<Link href="/syllabus" onClick={() => setMenuOpen(false)} style={menuLink}>📚 Syllabus</Link>
          <Link href="/answerkey" onClick={() => setMenuOpen(false)} style={menuLink}>📝 Answer Keys</Link>
          <Link href="/admitcard" onClick={() => setMenuOpen(false)} style={menuLink}>🎫 Admit Cards</Link>
          <Link href="/dashboard/mock-test" onClick={() => setMenuOpen(false)} style={menuLink}>📝 Mock Test</Link>
          <Link href="/dashboard/pyp" onClick={() => setMenuOpen(false)} style={menuLink}>📄 PYP</Link>
          {user && (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={menuLink}>👤 My Profile</Link>
          )}
          <Link href="/about" onClick={() => setMenuOpen(false)} style={menuLink}>ℹ️ About Us</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={menuLink}>📞 Contact Us</Link>

        </div>
      )}

      {showQuickLinks && <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0.4rem 0.75rem", display: "flex", gap: "0.5rem", overflowX: "auto", overflowY: "hidden", transition: "all 0.3s ease", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
        <button onClick={() => handleQuickLink('job', quickLinks.job)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'job' ? "#1e40af" : "#dbeafe", color: expandedSection === 'job' ? "white" : "#1e40af", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>💼 Jobs</button>
        <button onClick={() => handleQuickLink('result', quickLinks.result)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'result' ? "#166534" : "#dcfce7", color: expandedSection === 'result' ? "white" : "#166534", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>📊 Results</button>
        <button onClick={() => handleQuickLink('admitcard', quickLinks.admitcard)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'admitcard' ? "#92400e" : "#fef3c7", color: expandedSection === 'admitcard' ? "white" : "#92400e", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>🎫 Admit Cards</button>
        <button onClick={() => handleQuickLink('answerkey', quickLinks.answerkey)} style={{ flex: 1, textAlign: "center", background: expandedSection === 'answerkey' ? "#9d174d" : "#fce7f3", color: expandedSection === 'answerkey' ? "white" : "#9d174d", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>📝 Answer Keys</button>
        <button onClick={() => handleQuickLink('syllabus', '/syllabus')} style={{ flex: 1, textAlign: "center", background: expandedSection === 'syllabus' ? "#3730a3" : "#e0e7ff", color: expandedSection === 'syllabus' ? "white" : "#3730a3", padding: "6px 4px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>📚 Syllabus</button>
      </div>}

      {expandedSection && (
        <div style={{ background: "white", borderBottom: "2px solid #e2e8f0", padding: "0.75rem 1rem", maxHeight: "60vh", overflowY: "auto", position: "fixed", top: "96px", left: 0, right: 0, zIndex: 9998, boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
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
