'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function OperatorLayout({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const auth = localStorage.getItem('sb_operator_auth')
    const operatorRole = localStorage.getItem('sb_operator_role')
    const operatorName = localStorage.getItem('sb_operator_name')
    const loginTime = parseInt(localStorage.getItem('sb_operator_time') || '0')
    const SESSION = 8 * 60 * 60 * 1000

    if (!auth || Date.now() - loginTime > SESSION) {
      localStorage.removeItem('sb_operator_auth')
      window.location.replace('/operator-login')
    } else {
      setIsAuth(true)
      setRole(operatorRole || '')
      setName(operatorName || '')
    }
  }, [])

  if (!isAuth) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2460, #1a3c8f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white', fontFamily: 'Poppins, sans-serif' }}>Loading...</p>
    </div>
  )

  const allLinks = {
    content: [
      { href: '/operator', label: '📊 Dashboard' },
      { href: '/operator/jobs', label: '💼 Jobs' },
      { href: '/operator/results', label: '📋 Results' },
      { href: '/operator/answerkeys', label: '📝 Answer Keys' },
      { href: '/operator/admitcards', label: '🎫 Admit Cards' },
      { href: '/operator/syllabus', label: '📚 Syllabus' },
      { href: '/operator/change-password', label: '🔑 Change Password' },
    ],
    pyp: [
      { href: '/operator', label: '📊 Dashboard' },
      { href: '/operator/pyp', label: '📄 PYP Papers' },
      { href: '/operator/change-password', label: '🔑 Change Password' },
    ],
    mock: [
      { href: '/operator', label: '📊 Dashboard' },
      { href: '/operator/mock-test', label: '🧪 Mock Test' },
      { href: '/operator/subjects', label: '🎯 Subject Mock' },
      { href: '/operator/change-password', label: '🔑 Change Password' },
    ],
  }

  const links = allLinks[role] || []

  async function handleLogout() {
    const supabase = (await import('@/lib/supabase/client')).createClient()
    const activityId = localStorage.getItem('sb_operator_activity_id')
    if (activityId) {
      await supabase.from('operator_activity').update({
        logout_time: new Date().toISOString(),
        is_active: false
      }).eq('id', activityId)
    }
    localStorage.removeItem('sb_operator_auth')
    localStorage.removeItem('sb_operator_role')
    localStorage.removeItem('sb_operator_name')
    localStorage.removeItem('sb_operator_id')
    localStorage.removeItem('sb_operator_time')
    localStorage.removeItem('sb_operator_activity_id')
    window.location.replace('/operator-login')
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'linear-gradient(135deg, #0f2460, #1a3c8f)', padding: '0 1rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: 'white' }}>Student<span style={{ color: '#f97316' }}>Brief</span></span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(249,115,22,0.3)', color: '#fb923c', padding: '1px 6px', borderRadius: '9999px', marginLeft: '6px' }}>
              {role === 'content' ? 'Content Op' : role === 'pyp' ? 'PYP Op' : 'Mock Op'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(191,219,254,0.8)', display: 'none' }} className="op-name">{name}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
            🚪 Logout
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: '38px', height: '38px', borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ background: 'rgba(15,36,96,0.98)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 999, maxHeight: '80vh', overflowY: 'auto' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ color: pathname === link.href ? '#f97316' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: pathname === link.href ? 700 : 500, padding: '10px 12px', borderRadius: '8px', background: pathname === link.href ? 'rgba(249,115,22,0.1)' : 'transparent' }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '220px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'none', flexDirection: 'column', position: 'sticky', top: '56px', height: 'calc(100vh - 56px)', overflowY: 'auto' }} className="op-sidebar">
          {links.map(link => (
            <Link key={link.href} href={link.href} style={{ color: pathname === link.href ? '#1a3c8f' : '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: pathname === link.href ? 700 : 500, padding: '12px 16px', borderRight: pathname === link.href ? '3px solid #1a3c8f' : '3px solid transparent', background: pathname === link.href ? '#dbeafe' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {link.label}
            </Link>
          ))}
        </aside>

        <main style={{ flex: 1, padding: '1.5rem 1rem', background: '#f8fafc', minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .op-sidebar { display: flex !important; }
          .op-name { display: block !important; }
        }
      `}</style>
    </div>
  )
}
