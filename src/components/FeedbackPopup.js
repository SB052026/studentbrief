'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FeedbackPopup() {
  const [show, setShow] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Show after 30 seconds
    const timer = setTimeout(() => {
      const lastShown = localStorage.getItem('sb_feedback_shown')
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000
      if (!lastShown || parseInt(lastShown) < dayAgo) {
        setShow(true)
      }
    }, 30000)

    // Exit intent - mouse leave
    function handleMouseLeave(e) {
      if (e.clientY <= 0) {
        const lastShown = localStorage.getItem('sb_feedback_shown')
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000
        if (!lastShown || parseInt(lastShown) < dayAgo) {
          setShow(true)
        }
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  function getDevice() {
    const ua = navigator.userAgent
    if (/Android/i.test(ua)) return 'Android'
    if (/iPhone|iPad/i.test(ua)) return 'iOS'
    if (/Windows/i.test(ua)) return 'Windows'
    if (/Mac/i.test(ua)) return 'MacOS'
    return 'Unknown'
  }

  async function handleSubmit() {
    if (rating === 0) return alert('Please select a rating!')
    setSaving(true)

    const supabase = createClient()
    await supabase.from('feedback').insert({
      rating,
      comment: comment || null,
      page: window.location.pathname,
      device: getDevice(),
    })

    // If 4-5 stars → redirect to Google Review
    if (rating >= 4) {
      localStorage.setItem('sb_feedback_shown', Date.now().toString())
      setSubmitted(true)
      setTimeout(() => {
        window.open('https://g.page/r/CQrx6_yARiIDEAI/review', '_blank')
        setShow(false)
      }, 1500)
    } else {
      localStorage.setItem('sb_feedback_shown', Date.now().toString())
      setSubmitted(true)
      setTimeout(() => setShow(false), 2000)
    }

    setSaving(false)
  }

  function handleClose() {
    localStorage.setItem('sb_feedback_shown', Date.now().toString())
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 99999, width: '90%', maxWidth: '340px',
      background: 'white', borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      padding: '1.5rem', fontFamily: 'Poppins, sans-serif',
      animation: 'slideUp 0.3s ease'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {rating >= 4 ? '🎉' : '🙏'}
          </p>
          <p style={{ fontWeight: 700, color: '#1a3c8f', fontSize: '0.95rem' }}>
            {rating >= 4 ? 'Thank you! Redirecting to Google Review...' : 'Thank you for your feedback!'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontWeight: 800, color: '#1a3c8f', fontSize: '0.95rem', marginBottom: '2px' }}>Rate Your Experience</p>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>How was StudentBrief?</p>
            </div>
            <button onClick={handleClose} style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
            {[1,2,3,4,5].map(star => (
              <button key={star} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem', filter: star <= rating ? 'none' : 'grayscale(100%)', transition: 'transform 0.1s', transform: star <= rating ? 'scale(1.1)' : 'scale(1)' }}>
                ⭐
              </button>
            ))}
          </div>

          {rating > 0 && rating < 4 && (
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell us how we can improve..."
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', outline: 'none', resize: 'none', height: '70px', boxSizing: 'border-box', marginBottom: '0.75rem' }}
            />
          )}

          {rating >= 4 && (
            <p style={{ fontSize: '0.75rem', color: '#16a34a', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 600 }}>
              🌟 Great! You'll be redirected to Google Review
            </p>
          )}

          {rating > 0 && (
            <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              {saving ? 'Submitting...' : 'Submit Rating'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
