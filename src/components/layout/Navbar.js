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
    <nav style={{ backgroundColor: '#1a3c8f' }} className="text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Student<span style={{ color: '#f97316' }}>Brief</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/jobs" className="hover:text-orange-400 transition">Jobs</Link>
          <Link href="/results" className="hover:text-orange-400 transition">Results</Link>
          {user && (
            <>
              <Link href="/dashboard/mock-test" className="hover:text-orange-400 transition">Mock Test</Link>
              <Link href="/dashboard/pyp" className="hover:text-orange-400 transition">PYP</Link>
              <Link href="/dashboard/live-test" className="hover:text-orange-400 transition">Live Test</Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm hover:text-orange-400 transition">
                {dbUser?.name || 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Login / Sign Up
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/jobs" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition">Jobs</Link>
          <Link href="/results" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition">Results</Link>
          {user && (
            <>
              <Link href="/dashboard/mock-test" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition">Mock Test</Link>
              <Link href="/dashboard/pyp" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition">PYP</Link>
              <Link href="/dashboard/live-test" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition">Live Test</Link>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 transition">Logout</button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-orange-400 hover:text-orange-300 transition">Login / Sign Up</Link>
 )}
        </div>
      )}
    </nav>
  )
}
