'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, dbUser, loading } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
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
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>
            Student<span style={{ color: '#f97316' }}>Brief</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden-mobile">
          <Link href="/jobs" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Jobs</Link>
          <Link href="/results" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Results</Link>
          {user && (
            <>
              <Link href="/dashboard/mock-test" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Mock Test</Link>
              <Link href="/dashboard/pyp" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>PYP</Link>
              <Link href="/dashboard/live-test" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Live Test</Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!loading && (
            user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f97316, #fb923c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: 900, color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}>
                    {dbUser?.name?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                  <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }} className="hidden-mobile">
                    {dbUser?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                    color: '#fca5a5', padding: '6px 12px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" style={{
                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                color: 'white', padding: '8px 18px', borderRadius: '10px',
                fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
              }}>
                Login / Sign Up
              </Link>
            )
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', width: '36px', height: '36px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
            className="show-mobile"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(15,36,96,0.98)', backdropFilter: 'blur(10px)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Link href="/jobs" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>💼 Jobs</Link>
          <Link href="/results" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>📊 Results</Link>
          {user && (
            <>
              <Link href="/dashboard/mock-test" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>📝 Mock Test</Link>
              <Link href="/dashboard/pyp" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>📄 PYP</Link>
              <Link href="/dashboard/live-test" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>🏆 Live Test</Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>👤 Profile</Link>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.2)', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'Poppins, sans-serif', textAlign: 'left', marginTop: '0.5rem' }}>
              🚪 Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: '#fb923c', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, padding: '10px 0' }}>Login / Sign Up →</Link>
          )}
        </div>
      )}
    </nav>
  )
}
