'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="page-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
        minHeight: '90vh',
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
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '0.5rem', marginBottom: '1.5rem',
          }}>
            <Link href="/jobs" style={{
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              color: 'white', padding: '12px 28px', borderRadius: '12px',
              fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
            }}>
              💼 Latest Jobs
            </Link>
            <Link href="/login" style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              color: 'white', padding: '12px 28px', borderRadius: '12px',
              fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              🚀 Free Shuru Karo
            </Link>
          </div>

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

      {/* SUBSCRIPTION BANNER */}
      <section style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', padding: '0.875rem 1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>🎯</span>
            <div>
              <p style={{ fontWeight: 700, color: '#9a3412', fontSize: '0.85rem' }}>Mock Test + Previous Year Papers</p>
              <p style={{ color: '#c2410c', fontSize: '0.72rem' }}>Sirf ₹29/month — 7 Din Free Trial</p>
            </div>
          </div>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #f97316, #fb923c)',
            color: 'white', padding: '8px 20px', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
          }}>
            Free Trial →
          </Link>
        </div>
      </section>

      {/* JOBS RESULTS ANSWERKEY ADMITCARD CARDS */}
      <section style={{ padding: '2.5rem 1rem', background: '#f0f4ff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a3c8f', textAlign: 'center', marginBottom: '0.5rem' }}>
            Kya Dhundh Rahe Ho?
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Apni zaroorat ke hisab se select karo
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <Link href="/jobs" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #1a3c8f, #2952c4)', borderRadius: '16px', padding: '1rem', boxShadow: '0 8px 30px rgba(26,60,143,0.3)', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.5rem' }}>💼</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Latest Jobs</h3>
                <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Govt, Bank, Railway jobs</p>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>Dekho →</span>
              </div>
            </Link>

            <Link href="/results" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '16px', padding: '1rem', boxShadow: '0 8px 30px rgba(22,163,74,0.3)', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.5rem' }}>📊</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Latest Results</h3>
                <p style={{ color: 'rgba(220,252,231,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>SSC, Railway, Bank results</p>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>Dekho →</span>
              </div>
            </Link>

            <Link href="/answerkey" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #db2777, #ec4899)', borderRadius: '16px', padding: '1rem', boxShadow: '0 8px 30px rgba(219,39,119,0.3)', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.5rem' }}>📝</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Answer Keys</h3>
                <p style={{ color: 'rgba(252,231,243,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Latest answer keys dekho</p>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>Dekho →</span>
              </div>
            </Link>

            <Link href="/admitcard" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', borderRadius: '16px', padding: '1rem', boxShadow: '0 8px 30px rgba(217,119,6,0.3)', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.5rem' }}>🎫</div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', marginBottom: '4px' }}>Admit Cards</h3>
                <p style={{ color: 'rgba(254,243,199,0.8)', fontSize: '0.65rem', marginBottom: '0.6rem' }}>Latest admit cards dekho</p>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>Dekho →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* SUBSCRIPTION SECTION */}
      <section style={{
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: '6px' }}>
            Subscription Plan
          </h2>
          <p style={{ color: 'rgba(191,219,254,0.8)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.85rem' }}>
            Mock Test + Previous Year Papers unlock karo
          </p>
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#1a3c8f' }}>
                ₹29<span style={{ fontSize: '1rem', fontWeight: 400, color: '#94a3b8' }}>/month</span>
              </div>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 14px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-block', marginTop: '6px' }}>
                ✅ 7 Din Free Trial
              </span>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Unlimited Mock Tests', 'All Previous Year Papers', 'Detailed Solutions', 'Performance Analysis'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
                  <span style={{ width: '20px', height: '20px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem' }}>
              🚀 Free Trial Shuru Karo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
