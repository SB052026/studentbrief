'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
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
        { count: questions },
        { data: latestJobs },
        { data: latestUsers },
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('results').select('*', { count: 'exact', head: true }),
        supabase.from('answerkeys').select('*', { count: 'exact', head: true }),
        supabase.from('admitcards').select('*', { count: 'exact', head: true }),
        supabase.from('mock_tests').select('*', { count: 'exact', head: true }),
        supabase.from('pyp').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('mock_questions').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('title, created_at, job_categories(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('users').select('name, email, created_at').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ jobs, results, answerkeys, admitcards, mockTests, pyp, users, questions })
      setRecentJobs(latestJobs || [])
      setRecentUsers(latestUsers || [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
      Loading Dashboard...
    </div>
  )

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: '👥', color: '#dbeafe', text: '#1e40af', href: '/admin', change: '+12%' },
    { label: 'Total Jobs', value: stats.jobs, icon: '💼', color: '#dcfce7', text: '#166534', href: '/admin/jobs', change: '+5%' },
    { label: 'Results', value: stats.results, icon: '📋', color: '#fef3c7', text: '#92400e', href: '/admin/results', change: '+8%' },
    { label: 'Answer Keys', value: stats.answerkeys, icon: '📝', color: '#fce7f3', text: '#9d174d', href: '/admin/answerkeys', change: '+3%' },
    { label: 'Admit Cards', value: stats.admitcards, icon: '🎫', color: '#fef9c3', text: '#713f12', href: '/admin/admitcards', change: '+2%' },
    { label: 'Mock Tests', value: stats.mockTests, icon: '🧪', color: '#ede9fe', text: '#5b21b6', href: '/admin/mock-test', change: '+15%' },
    { label: 'PYP Papers', value: stats.pyp, icon: '📄', color: '#cffafe', text: '#0e7490', href: '/admin/pyp', change: '+1%' },
    { label: 'Questions', value: stats.questions, icon: '❓', color: '#fce7f3', text: '#be185d', href: '/admin/mock-test', change: '+20%' },
  ]

  const totalContent = (stats.jobs || 0) + (stats.results || 0) + (stats.answerkeys || 0) + (stats.admitcards || 0)
  const maxVal = Math.max(stats.jobs, stats.results, stats.answerkeys, stats.admitcards, 1)

  const barData = [
    { label: 'Jobs', value: stats.jobs, color: '#1a3c8f' },
    { label: 'Results', value: stats.results, color: '#16a34a' },
    { label: 'Ans Keys', value: stats.answerkeys, color: '#db2777' },
    { label: 'Admit', value: stats.admitcards, color: '#d97706' },
    { label: 'Mock', value: stats.mockTests, color: '#7c3aed' },
    { label: 'PYP', value: stats.pyp, color: '#0891b2' },
  ]

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '4px' }}>📊 Admin Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Website ka sara data ek jagah</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {statCards.map((card, i) => (
          <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '14px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '10px', transition: 'transform 0.2s' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                {card.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '2px' }}>{card.label}</p>
                <p style={{ fontSize: '1.4rem', fontWeight: 900, color: card.text, lineHeight: 1 }}>{card.value || 0}</p>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '9999px' }}>{card.change}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📈 Content Overview</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', padding: '0 4px' }}>
          {barData.map((bar, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: bar.color }}>{bar.value || 0}</span>
              <div style={{ width: '100%', background: bar.color, borderRadius: '6px 6px 0 0', height: `${Math.max(((bar.value || 0) / maxVal) * 90, 4)}px`, transition: 'height 0.5s ease' }} />
              <span style={{ fontSize: '0.55rem', color: '#94a3b8', textAlign: 'center', fontWeight: 600 }}>{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Chart - Content Distribution */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>🎯 Content Distribution</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
            <svg viewBox="0 0 36 36" style={{ width: '100px', height: '100px', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              {totalContent > 0 && (() => {
                const segments = [
                  { value: stats.jobs, color: '#1a3c8f' },
                  { value: stats.results, color: '#16a34a' },
                  { value: stats.answerkeys, color: '#db2777' },
                  { value: stats.admitcards, color: '#d97706' },
                ]
                let offset = 0
                return segments.map((seg, i) => {
                  const pct = ((seg.value || 0) / totalContent) * 100
                  const dash = `${pct} ${100 - pct}`
                  const el = <circle key={i} cx="18" cy="18" r="15.9" fill="none" stroke={seg.color} strokeWidth="3" strokeDasharray={dash} strokeDashoffset={-offset} />
                  offset += pct
                  return el
                })
              })()}
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1a3c8f', lineHeight: 1 }}>{totalContent}</p>
              <p style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Total</p>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { label: 'Jobs', value: stats.jobs, color: '#1a3c8f' },
              { label: 'Results', value: stats.results, color: '#16a34a' },
              { label: 'Answer Keys', value: stats.answerkeys, color: '#db2777' },
              { label: 'Admit Cards', value: stats.admitcards, color: '#d97706' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{item.value || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem' }}>💼 Recent Jobs</h2>
          <Link href="/admin/jobs" style={{ fontSize: '0.72rem', color: '#1a3c8f', textDecoration: 'none', fontWeight: 600 }}>Sab dekho →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recentJobs.map((job, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>💼</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{job.job_categories?.name}</p>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', flexShrink: 0 }}>{new Date(job.created_at).toLocaleDateString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem' }}>👥 Recent Users</h2>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Last 5 users</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recentUsers.map((user, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'Unknown'}</p>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', flexShrink: 0 }}>{new Date(user.created_at).toLocaleDateString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>⚡ Quick Actions</h2>
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
