'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PDFDownload({ url, title, type = 'pdf', category = '', btnStyle = {} }) {
  const [downloading, setDownloading] = useState(false)

  function getDevice() {
    const ua = navigator.userAgent
    if (/Android/i.test(ua)) return 'Android'
    if (/iPhone|iPad/i.test(ua)) return 'iOS'
    if (/Windows/i.test(ua)) return 'Windows'
    if (/Mac/i.test(ua)) return 'MacOS'
    return 'Unknown'
  }

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

  async function handleDownload() {
    if (!url) return alert('PDF link available nahi hai!')
    setDownloading(true)

    try {
      // Get location
      const location = await getLocation()
      const device = getDevice()

      // Track download
      const supabase = createClient()
      await supabase.from('pdf_downloads').insert({
        pdf_title: title,
        pdf_type: type,
        pdf_url: url,
        location_lat: location.lat,
        location_lng: location.lng,
        location_name: location.name,
        device: device,
        category: category,
      })

      // Open PDF
      window.open(url, '_blank')
    } catch(e) {
      window.open(url, '_blank')
    }

    setDownloading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      style={{
        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
        color: 'white', border: 'none', padding: '8px 16px',
        borderRadius: '10px', cursor: downloading ? 'not-allowed' : 'pointer',
        fontWeight: 700, fontSize: '0.82rem',
        fontFamily: 'Poppins, sans-serif',
        ...btnStyle
      }}
    >
      {downloading ? '⏳ Opening...' : '📥 Download PDF'}
    </button>
  )
}
