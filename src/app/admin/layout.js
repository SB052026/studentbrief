'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const auth = localStorage.getItem('sb_admin_auth')
    if (!auth) {
      window.location.replace('/admin-login')
    } else {
      setIsAuth(true)
    }
  }, [])

  if (!isAuth) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2460, #1a3c8f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem' }}>Loading...</p>
    </div>
  )

  const links = [
    { href: '/admin', label: '📊 Dashboard' },
    { href: '/admin/categories', label: '📁 Categories' },
    { href: '/admin/jobs', label: '💼 Jobs' },
    { href: '/admin/results', label: '📋 Results' },
    { href: '/admin/answerkeys', label: '📝 Answer Keys' },
    { href: '/admin/admitcards', label: '🎫 Admit Cards' },
    { href: '/admin/mock-test', label: '🧪 Mock Test' },
    { href: '/admin/pyp', label: '📄 PYP' },
    { href: '/admin/syllabus', label: '📚 Syllabus' },
    { href: '/admin/subjects', label: '🎯 Subject Mock' },
    { href: '/admin/operators', label: '👥 Operators' },
    { href: '/admin/settings', label: '⚙️ Settings' },
  ]

  function handleLogout() {
    localStorage.removeItem('sb_admin_auth')
    localStorage.removeItem('sb_admin_token')
    localStorage.removeItem('sb_admin_time')
    window.location.replace('/admin-login')
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ background: 'linear-gradient(135deg, #0f2460, #1a3c8f)', padding: '0 1rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>
            Student<span style={{ color: '#f97316' }}>Brief</span>
            <span style={{ fontSize: '0.7rem', background: 'rgba(249,115,22,0.3)', color: '#fb923c', padding: '2px 8px', borderRadius: '9999px', marginLeft: '8px' }}>Admin</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
            🚪 Logout
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: '38px', height: '38px', borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(15,36,96,0.98)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 999, maxHeight: '80vh', overflowY: 'auto' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ color: pathname === link.href ? '#f97316' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: pathname === link.href ? 700 : 500, padding: '10px 12px', borderRadius: '8px', background: pathname === link.href ? 'rgba(249,115,22,0.1)' : 'transparent' }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Body */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Desktop Sidebar */}
        <aside style={{ width: '220px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'none', flexDirection: 'column', position: 'sticky', top: '56px', height: 'calc(100vh - 56px)', overflowY: 'auto' }} className="admin-sidebar">
          {links.map(link => (
            <Link key={link.href} href={link.href} style={{ color: pathname === link.href ? '#1a3c8f' : '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: pathname === link.href ? 700 : 500, padding: '12px 16px', borderRight: pathname === link.href ? '3px solid #1a3c8f' : '3px solid transparent', background: pathname === link.href ? '#dbeafe' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {link.label}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '1.5rem 1rem', background: '#f8fafc', minHeight: 'calc(100vh - 56px)', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      {/* CSS for desktop sidebar */}
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
