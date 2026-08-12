'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2.5rem 1rem 1.5rem',
      }}>
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }}/>
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }}/>

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9999px',
            padding: '6px 16px', marginBottom: '1.5rem',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>
            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
              StudentBrief Live Test Ab Available Hai
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.6rem, 6vw, 4.5rem)',
            fontWeight: 900, color: 'white',
            lineHeight: 1.1, marginBottom: '1rem',
          }}>
            Apni <span style={{ color: '#f97316' }}>Taiyari</span> Ko<br/>
            Next Level Pe Le Jao
          </h1>

          <p style={{
            color: 'rgba(191,219,254,0.9)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            marginBottom: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem',
          }}>
            Latest Govt Jobs, Results, Mock Tests, PYP aur Live Tests — sab kuch ek jagah
          </p>


          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem', maxWidth: '400px', margin: '0 auto',
          }}>
            {[
              { num: '500+', label: 'Jobs' },
              { num: '200+', label: 'Results' },
              { num: '50+', label: 'Tests' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px',
                padding: '0.75rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{stat.num}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(191,219,254,0.8)', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#f0f4ff"/>
          </svg>
        </div>
      </section>

      {/* JOBS RESULTS ANSWERKEY ADMITCARD CARDS */}
      <section style={{ padding: '2.5rem 1rem', background: '#f0f4ff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a3c8f', textAlign: 'center', marginBottom: '0.5rem' }}>
            What Are You Looking For?
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Select as per your requirement
          </p>
          <div className="home-cards-grid">
            <Link href="/jobs-explorer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)' }} className="home-card">
                <div className="home-card-icon">💼</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Latest Jobs</h3>
                <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Govt, Bank, Railway Jobs</p>
                <span className="badge">View →</span>
              </div>
            </Link>

            <Link href="/results-explorer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }} className="home-card">
                <div className="home-card-icon">📊</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Latest Results</h3>
                <p style={{ color: 'rgba(220,252,231,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>SSC, Railway, Bank Results</p>
                <span className="badge">View →</span>
              </div>
            </Link>

            <Link href="/answerkey-explorer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #db2777, #ec4899)' }} className="home-card">
                <div className="home-card-icon">📝</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Answer Keys</h3>
                <p style={{ color: 'rgba(252,231,243,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>View Latest Answer Keys</p>
                <span className="badge">View →</span>
              </div>
            </Link>

            <Link href="/admitcard-explorer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }} className="home-card">
                <div className="home-card-icon">🎫</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Admit Cards</h3>
                <p style={{ color: 'rgba(254,243,199,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>View Latest Admit Cards</p>
                <span className="badge">View →</span>
              </div>
            </Link>

            <Link href="/dashboard/mock-test" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #7c3aed, #9c5cf0)' }} className="home-card">
                <div className="home-card-icon">📝</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '2px' }}>Mock Test</h3>
                <span style={{ background: '#f97316', color: 'white', fontSize: '0.55rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px', letterSpacing: '0.5px' }}>FREE</span>
                <p style={{ color: 'rgba(237,233,254,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Practice with Mock Tests</p>
                <span className="badge">Start Now →</span>
              </div>
            </Link>

            <Link href="/dashboard/pyp" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }} className="home-card">
                <div className="home-card-icon">📄</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '2px' }}>PYP</h3>
                <span style={{ background: '#f97316', color: 'white', fontSize: '0.55rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px', letterSpacing: '0.5px' }}>FREE</span>
                <p style={{ color: 'rgba(207,250,254,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Previous Year Papers</p>
                <span className="badge">Download →</span>
              </div>
            </Link>

            <Link href="/syllabus-explorer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)' }} className="home-card">
                <div className="home-card-icon">📚</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Syllabus</h3>
                <p style={{ color: 'rgba(204,251,241,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Exam wise syllabus</p>
                <span className="badge">View →</span>
              </div>
            </Link>

            <Link href="/dashboard/subject-mock" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #be185d, #ec4899)' }} className="home-card">
                <div className="home-card-icon">🎯</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '2px' }}>Subject Mock</h3>
                <span style={{ background: '#f97316', color: 'white', fontSize: '0.55rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px', letterSpacing: '0.5px' }}>FREE</span>
                <p style={{ color: 'rgba(251,207,232,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Subject Wise Practice</p>
                <span className="badge">Start Now →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>



      {showInstall && (
        <div style={{ position: 'fixed', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'white', borderRadius: '14px', padding: '0.75rem 1.25rem', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px', width: '90%' }}>
          <img src="/logo.png" alt="logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginBottom: '2px' }}>Install StudentBrief</p>
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Add to Home Screen</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => { installPrompt?.prompt(); setShowInstall(false) }} style={{ background: '#1a3c8f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>Install</button>
            <button onClick={() => setShowInstall(false)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif' }}>✕</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}