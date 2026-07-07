'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function OperatorDashboard() {
  const [role, setRole] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    setRole(localStorage.getItem('sb_operator_role') || '')
    setName(localStorage.getItem('sb_operator_name') || '')
  }, [])

  const contentLinks = [
    { href: '/operator/jobs', label: '💼 Jobs', desc: 'Job listings manage karo', color: '#dbeafe', text: '#1e40af' },
    { href: '/operator/results', label: '📋 Results', desc: 'Results manage karo', color: '#dcfce7', text: '#166534' },
    { href: '/operator/answerkeys', label: '📝 Answer Keys', desc: 'Answer keys manage karo', color: '#fce7f3', text: '#9d174d' },
    { href: '/operator/admitcards', label: '🎫 Admit Cards', desc: 'Admit cards manage karo', color: '#fef3c7', text: '#92400e' },
    { href: '/operator/syllabus', label: '📚 Syllabus', desc: 'Syllabus manage karo', color: '#e0e7ff', text: '#3730a3' },
  ]

  const pypLinks = [
    { href: '/operator/pyp', label: '📄 PYP Papers', desc: 'Previous year papers manage karo', color: '#cffafe', text: '#0e7490' },
  ]

  const mockLinks = [
    { href: '/operator/mock-test', label: '🧪 Mock Test', desc: 'Mock tests manage karo', color: '#ede9fe', text: '#5b21b6' },
    { href: '/operator/subjects', label: '🎯 Subject Mock', desc: 'Subject wise mock manage karo', color: '#fce7f3', text: '#be185d' },
  ]

  const links = role === 'content' ? contentLinks : role === 'pyp' ? pypLinks : mockLinks

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '4px' }}>
          👋 Welcome, {name}!
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          {role === 'content' ? 'Content Management Panel' : role === 'pyp' ? 'PYP Management Panel' : 'Mock Test Management Panel'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {links.map((link, i) => (
          <Link key={i} href={link.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '0.75rem' }}>
                {link.label.split(' ')[0]}
              </div>
              <p style={{ fontWeight: 700, color: link.text, fontSize: '0.9rem', marginBottom: '4px' }}>{link.label.split(' ').slice(1).join(' ')}</p>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>🔑 Account</h2>
        <Link href="/operator/change-password" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
          🔑 Password Change Karo
        </Link>
      </div>
    </div>
  )
}
