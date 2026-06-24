'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function InstructionsContent() {
  const searchParams = useSearchParams()
  const testId = searchParams.get('id')
  const testTitle = searchParams.get('title')

  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '0.25rem' }}>📋 Instructions</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{testTitle}</p>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '1rem', marginBottom: '1rem' }}>📌 महत्वपूर्ण निर्देश</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '⏱️', text: 'टेस्ट में समय सीमा है — टाइमर शुरू होने के बाद रुकेगा नहीं।' },
              { icon: '📝', text: 'सभी प्रश्न बहुविकल्पीय (MCQ) हैं।' },
              { icon: '✅', text: 'आप किसी भी प्रश्न को छोड़ सकते हैं और बाद में वापस आ सकते हैं।' },
              { icon: '🔄', text: 'प्रश्नों का क्रम हर बार अलग होगा।' },
              { icon: '🚫', text: 'Copy-Paste और Right Click बंद है।' },
              { icon: '📵', text: 'टेस्ट के दौरान दूसरा Tab न खोलें।' },
              { icon: '💾', text: 'Submit करने के बाद आपका स्कोर दिखेगा।' },
              { icon: '🔒', text: 'एक बार Submit करने के बाद टेस्ट दोबारा नहीं दे सकते।' },
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
          <p style={{ color: '#92400e', fontSize: '0.82rem' }}>टेस्ट शुरू करने के बाद पेज रिफ्रेश न करें — आपका progress खो सकता है।</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard/mock-test" style={{ flex: 1, display: 'block', textAlign: 'center', background: '#f1f5f9', color: '#64748b', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            ← वापस जाओ
          </Link>
          <Link href={`/dashboard/mock-test/${testId}`} style={{ flex: 2, display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            टेस्ट शुरू करो →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function InstructionsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>}>
      <InstructionsContent />
    </Suspense>
  )
}
