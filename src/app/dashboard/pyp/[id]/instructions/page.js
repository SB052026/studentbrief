'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PypInstructionsPage({ params }) {
  const [pypId, setPypId] = useState(null)
  const [paper, setPaper] = useState(null)

  useEffect(() => {
    async function load() {
      const resolvedParams = await params
      setPypId(resolvedParams.id)
      const supabase = createClient()
      const { data } = await supabase
        .from('pyp')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()
      setPaper(data)
    }
    load()
  }, [params])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📋 Instructions</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{paper?.exam_name} — {paper?.year}</p>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>📌 महत्वपूर्ण निर्देश</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '⏱️', text: 'यह PYP Practice Session है — असली परीक्षा जैसा अनुभव लो।' },
              { icon: '📝', text: 'सभी प्रश्न बहुविकल्पीय (MCQ) हैं।' },
              { icon: '✅', text: 'आप किसी भी प्रश्न को छोड़ सकते हैं और बाद में वापस आ सकते हैं।' },
              { icon: '🔄', text: 'प्रश्नों और विकल्पों का क्रम हर बार अलग होगा।' },
              { icon: '🚫', text: 'Copy-Paste और Right Click बंद है।' },
              { icon: '💡', text: 'Submit के बाद सही उत्तर और स्कोर दिखेगा।' },
              { icon: '📵', text: 'टेस्ट के दौरान दूसरा Tab न खोलें।' },
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.875rem', color: '#374151' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #fcd34d' }}>
          <p style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem', marginBottom: '4px' }}>⚠️ चेतावनी</p>
          <p style={{ color: '#92400e', fontSize: '0.82rem' }}>Practice शुरू करने के बाद पेज रिफ्रेश न करें।</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard/pyp" style={{ flex: 1, display: 'block', textAlign: 'center', background: '#f1f5f9', color: '#64748b', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            ← वापस जाओ
          </Link>
          <Link href={`/dashboard/pyp/${pypId}/practice`} style={{ flex: 2, display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            Practice शुरू करो →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
