'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function OperatorDashboard() {
  const [role, setRole] = useState('')
  const [name, setName] = useState('')

  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    setRole(localStorage.getItem('sb_operator_role') || '')
    setName(localStorage.getItem('sb_operator_name') || '')
    const perms = localStorage.getItem('sb_operator_permissions')
    setPermissions(perms ? JSON.parse(perms) : [])
  }, [])

  const allLinks = {
    jobs: { href: '/operator/jobs', label: '💼 Jobs', desc: 'Manage job listings', color: '#dbeafe', text: '#1e40af' },
    results: { href: '/operator/results', label: '📋 Results', desc: 'Manage results', color: '#dcfce7', text: '#166534' },
    answerkeys: { href: '/operator/answerkeys', label: '📝 Answer Keys', desc: 'Manage answer keys', color: '#fce7f3', text: '#9d174d' },
    admitcards: { href: '/operator/admitcards', label: '🎫 Admit Cards', desc: 'Manage admit cards', color: '#fef3c7', text: '#92400e' },
    syllabus: { href: '/operator/syllabus', label: '📚 Syllabus', desc: 'Manage syllabus', color: '#e0e7ff', text: '#3730a3' },
    mock: { href: '/operator/mock-test', label: '🧪 Mock Test', desc: 'Manage mock tests', color: '#ede9fe', text: '#5b21b6' },
    subject_mock: { href: '/operator/subjects', label: '🎯 Subject Mock', desc: 'Manage subject mock', color: '#fce7f3', text: '#be185d' },
    pyp: { href: '/operator/pyp', label: '📄 PYP Papers', desc: 'Manage PYP papers', color: '#cffafe', text: '#0e7490' },
  }

  const links = permissions.map(p => allLinks[p]).filter(Boolean)

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


    </div>
  )
}
