'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      const [
        { count: jobs },
        { count: results },
        { count: answerkeys },
        { count: admitcards },
        { count: mockTests },
        { count: pyp },
        { count: users },
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('results').select('*', { count: 'exact', head: true }),
        supabase.from('answerkeys').select('*', { count: 'exact', head: true }),
        supabase.from('admitcards').select('*', { count: 'exact', head: true }),
        supabase.from('mock_tests').select('*', { count: 'exact', head: true }),
        supabase.from('pyp').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
      ])
      setStats({ jobs, results, answerkeys, admitcards, mockTests, pyp, users })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = stats ? [
    { label: 'Total Users', value: stats.users, icon: '👥', color: '#dbeafe', text: '#1e40af', href: '/admin' },
    { label: 'Jobs', value: stats.jobs, icon: '💼', color: '#dcfce7', text: '#166534', href: '/admin/jobs' },
    { label: 'Results', value: stats.results, icon: '📋', color: '#fef3c7', text: '#92400e', href: '/admin/results' },
    { label: 'Answer Keys', value: stats.answerkeys, icon: '📝', color: '#fce7f3', text: '#9d174d', href: '/admin/answerkeys' },
    { label: 'Admit Cards', value: stats.admitcards, icon: '🎫', color: '#fef9c3', text: '#713f12', href: '/admin/admitcards' },
    { label: 'Mock Tests', value: stats.mockTests, icon: '🧪', color: '#ede9fe', text: '#5b21b6', href: '/admin/mock-test' },
    { label: 'PYP Papers', value: stats.pyp, icon: '📄', color: '#cffafe', text: '#0e7490', href: '/admin/pyp' },
  ] : []

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📊 Admin Dashboard</h1>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Website ka sara data yahan manage karo</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {cards.map((card, i) => (
            <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>{card.label}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: card.text }}>{card.value || 0}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>⚡ Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {[
            { href: '/admin/jobs', label: '+ New Job', bg: '#1a3c8f' },
            { href: '/admin/results', label: '+ New Result', bg: '#16a34a' },
            { href: '/admin/mock-test', label: '+ New Mock Test', bg: '#7c3aed' },
            { href: '/admin/pyp', label: '+ New PYP', bg: '#0891b2' },
          ].map((btn, i) => (
            <Link key={i} href={btn.href} style={{ display: 'block', textAlign: 'center', background: btn.bg, color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
