'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'

function InstructionsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const testId = searchParams.get('id')
  const testTitle = searchParams.get('title')
  const [test, setTest] = useState(null)
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(true)
  const [locStatus, setLocStatus] = useState('')
  const [locationDone, setLocationDone] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const [{ data: testData }, { data: instrData }] = await Promise.all([
        supabase.from('mock_tests').select('*').eq('id', testId).single(),
        supabase.from('site_settings').select('value').eq('key', 'mock_instructions').single(),
      ])
      setTest(testData)
      let instr = instrData?.value || ''
      instr = instr.replace('{questions}', testData?.total_questions || '?')
      instr = instr.replace('{duration}', testData?.duration_minutes || '?')
      setInstructions(instr)
      setLoading(false)
    }
    if (testId) fetchData()
  }, [testId])

  async function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: null, lng: null, name: 'Not supported' })
        return
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            const data = await res.json()
            resolve({ lat, lng, name: data.display_name || `${lat},${lng}` })
          } catch {
            resolve({ lat, lng, name: `${lat},${lng}` })
          }
        },
        () => resolve({ lat: null, lng: null, name: 'Denied' }),
        { timeout: 5000 }
      )
    })
  }

  function getDevice() {
    const ua = navigator.userAgent
    if (/Android/i.test(ua)) return `Android`
    if (/iPhone|iPad/i.test(ua)) return `iOS`
    if (/Windows/i.test(ua)) return `Windows`
    if (/Mac/i.test(ua)) return 'MacOS'
    return 'Unknown'
  }

  async function handleStart() {
    setLocStatus('📍 Location verify ho rahi hai...')
    const location = await getLocation()
    const device = getDevice()
    const supabase = createClient()
    await supabase.from('user_activity').insert({
      test_id: testId,
      test_type: 'mock',
      test_title: testTitle || test?.title,
      location_lat: location.lat,
      location_lng: location.lng,
      location_name: location.name,
      device: device,
    })
    setLocStatus('')
    router.push(`/dashboard/mock-test/${testId}`)
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="loader" style={{ margin: '0 auto' }}></div>
    </div>
  )

  return (
    <main style={{ flex: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', marginBottom: '4px' }}>{testTitle || test?.title}</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>⏱️ {test?.duration_minutes} min</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>❓ {test?.total_questions} Questions</span>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
        <h2 style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '1rem' }}>📋 Instructions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {instructions.split('\n').filter(l => l.trim()).map((line, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
              <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>{line}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#92400e' }}>
        📍 Test shuru karne par aapki location access ki jayegi — sirf analytics ke liye
      </div>

      {locStatus && (
        <div style={{ background: '#dbeafe', color: '#1e40af', padding: '10px', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
          {locStatus}
        </div>
      )}

      <button onClick={handleStart} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', border: 'none', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 25px rgba(249,115,22,0.4)' }}>
        🚀 Test Shuru Karo
      </button>
    </main>
  )
}

export default function InstructionsPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>}>
        <InstructionsContent />
      </Suspense>
      <Footer />
    </div>
  )
}
