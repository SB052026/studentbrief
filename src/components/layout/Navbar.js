'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showQuickLinks, setShowQuickLinks] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [siteSettings, setSiteSettings] = useState({ logo_url: '', logo_size: '38', slogan: 'Every Student Deserves to Excel' })
  const lastScrollRef = useRef(0)

  const [showLangMenu, setShowLangMenu] = useState(false)

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ur', label: 'اردو' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ]

  function changeLanguage(langCode) {
    setShowLangMenu(false)
    if (langCode === 'en') {
      // Reset to English
      const iframe = document.querySelector('.goog-te-banner-frame')
      if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document
        const restoreBtn = innerDoc.querySelector('.goog-te-banner-frame')
        if (restoreBtn) restoreBtn.click()
      }
      const select = document.querySelector('.goog-te-combo')
      if (select) {
        select.value = 'en'
        select.dispatchEvent(new Event('change'))
      }
      // Cookie method
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname
      window.location.reload()
      return
    }
    const select = document.querySelector('.goog-te-combo')
    if (select) {
      select.value = langCode
      select.dispatchEvent(new Event('change'))
    } else {
      document.cookie = 'googtrans=/en/' + langCode
      document.cookie = 'googtrans=/en/' + langCode + '; domain=.' + window.location.hostname
      window.location.reload()
    }
  }

  useEffect(() => {
    // Load Google Translate silently
    const addScript = document.createElement('script')
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    addScript.async = true
    document.body.appendChild(addScript)
    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'hi,en,ur,pa,bn,gu,mr,ta,te,kn,ml',
        autoDisplay: false,
      }, 'google_translate_element')
    }
    // Hide Google Translate toolbar
    const style = document.createElement('style')
    style.innerHTML = `
      .goog-te-banner-frame, .goog-te-gadget, #google_translate_element, .skiptranslate { display: none !important; }
      body { top: 0 !important; }
      .goog-te-menu-value span { display: none; }
    `
    document.head.appendChild(style)
  }, [])

  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        const cached = sessionStorage.getItem('sb_site_settings')
        const cachedTime = sessionStorage.getItem('sb_cache_time')
        const cacheValid = cachedTime && (Date.now() - parseInt(cachedTime)) < 30 * 60 * 1000
        if (cached && cacheValid) {
          setSiteSettings(prev => ({ ...prev, ...JSON.parse(cached) }))
          return
        }
        const supabase = createClient()
        const { data } = await supabase.from('site_settings').select('*')
        const obj = {}
        data?.forEach(s => { obj[s.key] = s.value })
        sessionStorage.setItem('sb_site_settings', JSON.stringify(obj))
        sessionStorage.setItem('sb_cache_time', Date.now().toString())
        setSiteSettings(prev => ({ ...prev, ...obj }))
      } catch(e) {}
    }
    fetchSiteSettings()
  }, [])

  useEffect(() => {
    function handleScroll() {
      const currentScroll = window.scrollY
      if (currentScroll <= 50) {
        setShowQuickLinks(true)
      } else if (currentScroll > lastScrollRef.current + 50) {
        setShowQuickLinks(false)
      } else if (currentScroll < lastScrollRef.current - 50) {
        setShowQuickLinks(true)
      }
      lastScrollRef.current = currentScroll
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleSearch(query) {
    // Sanitize input
    const clean = query.replace(/[<>'"]/g, '').substring(0, 100)
    setSearchQuery(clean)
    if (!clean || clean.length < 2) { setSearchResults([]); return }
    setSearching(true)
    try {
      const supabase = createClient()
      const { data } = await supabase.from('search_index').select('*').ilike('title', `%${clean}%`).limit(10)
      setSearchResults(data || [])
    } catch(e) {}
    setSearching(false)
  }

  function getSearchLink(item) {
    if (item.type === 'job') return `/jobs/${item.section}/${item.id}`
    if (item.type === 'result') return `/results/${item.section}/${item.id}`
    if (item.type === 'answerkey') return `/answerkey/${item.section}/${item.id}`
    if (item.type === 'admitcard') return `/admitcard/${item.section}/${item.id}`
    if (item.type === 'mock_test') return `/dashboard/mock-test/instructions?id=${item.id}&title=${encodeURIComponent(item.title)}`
    if (item.type === 'pyp') return `/dashboard/pyp`
    return `/${item.section}`
  }

  function getTypeIcon(type) {
    const icons = { job: '💼', result: '📊', answerkey: '📝', admitcard: '🎫', syllabus: '📚', mock_test: '🧪', pyp: '📄' }
    return icons[type] || '📋'
  }

  function getTypeLabel(type) {
    const labels = { job: 'Job', result: 'Result', answerkey: 'Answer Key', admitcard: 'Admit Card', syllabus: 'Syllabus', mock_test: 'Mock Test', pyp: 'PYP' }
    return labels[type] || type
  }

  const menuLink = {
    color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
    fontSize: '0.9rem', fontWeight: 500, padding: '10px 12px', borderRadius: '8px',
  }

  return (
    <nav style={{ background: 'rgba(26,60,143,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={siteSettings.logo_url || '/logo.png'} alt="StudentBrief" style={{ borderRadius: '8px', objectFit: 'cover', display: 'block', width: `${siteSettings.logo_size || 38}px`, height: `${siteSettings.logo_size || 38}px` }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>Student<span style={{ color: '#f97316' }}>Brief</span></span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(191,219,254,0.8)', fontWeight: 500 }}>{siteSettings.slogan || 'Every Student Deserves to Excel'}</span>
            </div>
          </div>
        </Link>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button onClick={() => { setSearchOpen(prev => !prev); setSearchQuery(''); setSearchResults([]) }} style={{ background: 'none', border: 'none', color: 'white', width: '38px', height: '38px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            🔍
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: 'none', border: 'none', color: 'white', width: '38px', height: '38px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              🌐
            </button>
            {showLangMenu && (
              <>
                <div onClick={() => setShowLangMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998 }} />
                <div style={{ position: 'absolute', top: '44px', right: 0, background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '150px', overflow: 'hidden' }}>
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => changeLanguage(lang.code)} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#374151', fontFamily: 'Poppins, sans-serif' }}
                      onMouseOver={e => e.target.style.background='#f1f5f9'}
                      onMouseOut={e => e.target.style.background='none'}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div id="google_translate_element" style={{ display: 'none' }}></div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div style={{ background: 'white', padding: '0.75rem 1rem', position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <input autoFocus value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Search jobs, results, mock tests..." style={{ width: '100%', padding: '10px 40px 10px 16px', borderRadius: '12px', border: '2px solid #1a3c8f', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>{searching ? '⏳' : '🔍'}</span>
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
            <div style={{ maxWidth: '600px', margin: '0.5rem auto 0', padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>Koi result nahi mila 😔</div>
          )}
        </div>
      )}

      {/* Menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(15,36,96,0.98)', backdropFilter: 'blur(10px)', padding: '0.75rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 9999, maxHeight: '80vh', overflowY: 'auto' }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={menuLink}>🏠 Home</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={menuLink}>📞 Contact Us</Link>
          <Link href="/admin-login" onClick={() => setMenuOpen(false)} style={menuLink}>🔐 Admin Login</Link>
          <Link href="/operator-login" onClick={() => setMenuOpen(false)} style={menuLink}>👤 Operator Login</Link>
        </div>
      )}

      {/* Quick Links */}
      {showQuickLinks && (
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0.4rem 0.75rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <Link href="/jobs" style={{ flex: 1, textAlign: 'center', background: '#dbeafe', color: '#1e40af', padding: '8px 6px', borderRadius: '9999px', fontSize: '0.72rem', minHeight: '36px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, display: 'block' }}>💼 Jobs</Link>
          <Link href="/results" style={{ flex: 1, textAlign: 'center', background: '#dcfce7', color: '#166534', padding: '6px 4px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, display: 'block' }}>📊 Results</Link>
          <Link href="/admitcard" style={{ flex: 1, textAlign: 'center', background: '#fef3c7', color: '#92400e', padding: '6px 4px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, display: 'block' }}>🎫 Admit Cards</Link>
          <Link href="/answerkey" style={{ flex: 1, textAlign: 'center', background: '#fce7f3', color: '#9d174d', padding: '6px 4px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, display: 'block' }}>📝 Answer Keys</Link>
          <Link href="/syllabus" style={{ flex: 1, textAlign: 'center', background: '#e0e7ff', color: '#3730a3', padding: '6px 4px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, display: 'block' }}>📚 Syllabus</Link>
        </div>
      )}
    </nav>
  )
}
