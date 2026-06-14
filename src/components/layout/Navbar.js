'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, dbUser, loading } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

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
          {/* Profile Icon / Login */}          {!loading && (
            user ? (
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f97316, #fb923c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 900, color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                }}>
                  {dbUser?.name?.charAt(0)?.toUpperCase() || '👤'}
                </div>
              </Link>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                }}>
                  👤
                </div>
              </Link>
            )
          )}

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
          {user && (
            <>
              <Link href="/dashboard/mock-test" onClick={() => setMenuOpen(false)} style={menuLink}>📝 Mock Test</Link>
              <Link href="/dashboard/pyp" onClick={() => setMenuOpen(false)} style={menuLink}>📄 PYP</Link>
              <Link href="/dashboard/live-test" onClick={() => setMenuOpen(false)} style={menuLink}>🏆 Live Test</Link>
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
