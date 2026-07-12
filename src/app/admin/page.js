'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [recentJobs, setRecentJobs] = useState([])
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
        { count: questions },
        { data: latestJobs },
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('results').select('*', { count: 'exact', head: true }),
        supabase.from('answerkeys').select('*', { count: 'exact', head: true }),
        supabase.from('admitcards').select('*', { count: 'exact', head: true }),
        supabase.from('mock_tests').select('*', { count: 'exact', head: true }),
        supabase.from('pyp').select('*', { count: 'exact', head: true }),
        supabase.from('mock_questions').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('title, created_at, job_categories(name)').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ jobs, results, answerkeys, admitcards, mockTests, pyp, questions })
      setRecentJobs(latestJobs || [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</div>
  )

  const cards = [
    { label: 'Jobs', value: stats.jobs, icon: '💼', color: '#dbeafe', text: '#1e40af', href: '/admin/jobs' },
    { label: 'Results', value: stats.results, icon: '📋', color: '#dcfce7', text: '#166534', href: '/admin/results' },
    { label: 'Answer Keys', value: stats.answerkeys, icon: '📝', color: '#fce7f3', text: '#9d174d', href: '/admin/answerkeys' },
    { label: 'Admit Cards', value: stats.admitcards, icon: '🎫', color: '#fef3c7', text: '#92400e', href: '/admin/admitcards' },
    { label: 'Mock Tests', value: stats.mockTests, icon: '🧪', color: '#ede9fe', text: '#5b21b6', href: '/admin/mock-test' },
    { label: 'PYP Papers', value: stats.pyp, icon: '📄', color: '#cffafe', text: '#0e7490', href: '/admin/pyp' },
    { label: 'Questions', value: stats.questions, icon: '❓', color: '#fce7f3', text: '#be185d', href: '/admin/mock-test' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '1.5rem' }}>📊 Admin Dashboard</h1>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {cards.map((card, i) => (
          <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{card.label}</p>
                <p style={{ fontSize: '1.4rem', fontWeight: 900, color: card.text, lineHeight: 1 }}>{card.value || 0}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Jobs */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.9rem' }}>💼 Recent Jobs</h2>
          <Link href="/admin/jobs" style={{ fontSize: '0.72rem', color: '#1a3c8f', textDecoration: 'none', fontWeight: 600 }}>Sab dekho →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recentJobs.map((job, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
              <span style={{ fontSize: '1rem' }}>💼</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{job.job_categories?.name}</p>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', flexShrink: 0 }}>{new Date(job.created_at).toLocaleDateString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.9rem', marginBottom: '1rem' }}>⚡ Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {[
            { href: '/admin/jobs', label: '+ New Job', bg: '#1a3c8f' },
            { href: '/admin/results', label: '+ New Result', bg: '#16a34a' },
            { href: '/admin/mock-test', label: '+ Mock Test', bg: '#7c3aed' },
            { href: '/admin/settings', label: '⚙️ Settings', bg: '#f97316' },
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
