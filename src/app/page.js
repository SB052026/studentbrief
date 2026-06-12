import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function Home() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: results } = await supabase
    .from('results')
    .select('*, result_categories(name, slug)')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* HERO SECTION - GLASSMORPHISM */}
      <section style={{
        background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem 1rem',
      }}>
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }}/>
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }}/>

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9999px',
            padding: '6px 16px', marginBottom: '24px',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
              animation: 'pulseDot 1.5s ease-in-out infinite',
            }}/>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>
              StudentBrief Live Test Ab Available Hai
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900, color: 'white',
            lineHeight: 1.1, marginBottom: '1.5rem',
            animation: 'fadeInUp 0.8s ease forwards',
          }}>
            Apni <span style={{ color: '#f97316' }}>Taiyari</span> Ko<br/>
            Next Level Pe Le Jao
          </h1>

          <p style={{
            color: 'rgba(191,219,254,0.9)', fontSize: '1.1rem',
            marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem',
            animation: 'fadeInUp 0.8s ease 0.2s forwards', opacity: 0,
          }}>
            Latest Govt Jobs, Results, Mock Tests, PYP aur Live Tests — sab kuch ek jagah. Bilkul free shuru karo!
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '1rem', marginBottom: '4rem',
            animation: 'fadeInUp 0.8s ease 0.4s forwards', opacity: 0,
          }}>
            <Link href="/jobs" style={{
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              color: 'white', padding: '14px 32px', borderRadius: '12px',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
              transition: 'all 0.3s ease', display: 'inline-flex',
              alignItems: 'center', gap: '8px',
            }}>
              💼 Latest Jobs
            </Link>
            <Link href="/login" style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              color: 'white', padding: '14px 32px', borderRadius: '12px',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease', display: 'inline-flex',
              alignItems: 'center', gap: '8px',
            }}>
              🚀 Free Shuru Karo
            </Link>
          </div>

          {/* Stats glass cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem', maxWidth: '500px', margin: '0 auto',
            animation: 'fadeInUp 0.8s ease 0.6s forwards', opacity: 0,
          }}>
            {[
              { num: '500+', label: 'Jobs' },
              { num: '200+', label: 'Results' },
              { num: '50+', label: 'Tests' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px',
                padding: '1rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>{stat.num}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(191,219,254,0.8)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 65C120 50 240 20 360 15C480 10 600 25 720 30C840 35 960 30 1080 22C1200 14 1320 8 1380 4L1440 0V80H0Z" fill="#f0f4ff"/>
          </svg>
        </div>
      </section>

      {/* SUBSCRIPTION BANNER */}
      <section style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', padding: '1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <div>
              <p style={{ fontWeight: 700, color: '#9a3412', fontSize: '0.9rem' }}>Mock Test + Previous Year Papers</p>
              <p style={{ color: '#c2410c', fontSize: '0.75rem' }}>Sirf ₹29/month — 7 Din Free Trial ke saath</p>
            </div>
          </div>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #f97316, #fb923c)',
            color: 'white', padding: '10px 24px', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
          }}>
            Free Trial Shuru Karo →
          </Link>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section style={{ padding: '5rem 1rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a3c8f', marginBottom: '4px' }}>💼 Latest Jobs</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Naye government jobs dekho</p>
            </div>
            <Link href="/jobs" style={{
              color: '#1a3c8f', fontWeight: 700, fontSize: '0.85rem',
              textDecoration: 'none', border: '2px solid #1a3c8f',
              padding: '8px 20px', borderRadius: '10px', transition: 'all 0.3s',
            }}>
              Sab Dekho →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {jobs && jobs.length > 0 ? jobs.map((job, index) => (
              <Link key={job.id} href={`/jobs/${job.job_categories?.slug}/${job.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: '16px', padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                  borderLeft: '4px solid #1a3c8f',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(26,60,143,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>💼</span>
                    <span style={{
                      background: '#dbeafe', color: '#1e40af',
                      padding: '4px 10px', borderRadius: '9999px',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      {job.job_categories?.name}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '12px', lineHeight: 1.4 }}>
                    {job.title}
                  </h3>
                  <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)', margin: '12px 0' }}/>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: '#64748b' }}>📅 Last Date</span>
                      <span style={{ fontWeight: 700, color: '#ef4444' }}>{formatDate(job.last_date)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: '#64748b' }}>👤 Age Limit</span>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{job.age_min}-{job.age_max} yrs</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', textAlign: 'center', color: '#f97316', fontSize: '0.8rem', fontWeight: 700 }}>
                    Details Dekho →
                  </div>
                </div>
              </Link>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', gridColumn: '1/-1' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💼</span>
                Abhi koi job available nahi hai
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LATEST RESULTS */}
      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a3c8f', marginBottom: '4px' }}>📊 Latest Results</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Naye exam results dekho</p>
            </div>
            <Link href="/results" style={{
              color: '#1a3c8f', fontWeight: 700, fontSize: '0.85rem',
              textDecoration: 'none', border: '2px solid #1a3c8f',
              padding: '8px 20px', borderRadius: '10px',
            }}>
              Sab Dekho →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {results && results.length > 0 ? results.map((result, index) => (
              <Link key={result.id} href={`/results/${result.result_categories?.slug}/${result.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: '16px', padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                  borderLeft: `4px solid ${result.result_status === 'Declared' ? '#22c55e' : '#f59e0b'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>📊</span>
                    <span style={{
                      background: result.result_status === 'Declared' ? '#dcfce7' : '#fef3c7',
                      color: result.result_status === 'Declared' ? '#166534' : '#92400e',
                      padding: '4px 10px', borderRadius: '9999px',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      {result.result_status}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '12px', lineHeight: 1.4 }}>
                    {result.title}
                  </h3>
                  <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)', margin: '12px 0' }}/>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: '#64748b' }}>🏢 Organization</span>
                      <span style={{ fontWeight: 700, color: '#1e293b', maxWidth: '130px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.organization}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: '#64748b' }}>📅 Result Date</span>
                      <span style={{ fontWeight: 700, color: '#22c55e' }}>{formatDate(result.result_date)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: '#64748b' }}>📋 Vacancies</span>
                      <span style={{ fontWeight: 700, color: '#1a3c8f' }}>{result.total_vacancies?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', textAlign: 'center', color: '#f97316', fontSize: '0.8rem', fontWeight: 700 }}>
                    Result Dekho →
                  </div>
                </div>
              </Link>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', gridColumn: '1/-1' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📊</span>
                Abhi koi result available nahi hai
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION SECTION */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #0f2460 0%, #1a3c8f 50%, #2952c4 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }}/>
        <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: '8px' }}>
            Subscription Plan
          </h2>
          <p style={{ color: 'rgba(191,219,254,0.8)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
            Mock Test + Previous Year Papers unlock karo
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.95)', borderRadius: '24px',
            padding: '2.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1a3c8f' }}>
                ₹29<span style={{ fontSize: '1rem', fontWeight: 400, color: '#94a3b8' }}>/month</span>
              </div>
              <span style={{
                background: '#dcfce7', color: '#166534',
                padding: '4px 16px', borderRadius: '9999px',
                fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', marginTop: '8px',
              }}>
                ✅ 7 Din Free Trial
              </span>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Unlimited Mock Tests', 'All Previous Year Papers', 'Detailed Solutions', 'Performance Analysis'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#374151' }}>
                  <span style={{
                    width: '22px', height: '22px', background: '#dcfce7', color: '#16a34a',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 900, flexShrink: 0,
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{
              display: 'block', textAlign: 'center', textDecoration: 'none',
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              color: 'white', padding: '16px', borderRadius: '12px',
              fontWeight: 700, fontSize: '1rem',
              boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
            }}>
              🚀 Free Trial Shuru Karo
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '5rem 1rem', background: '#f0f4ff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1a3c8f', textAlign: 'center', marginBottom: '8px' }}>
            Kaise Kaam Karta Hai?
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '3rem', fontSize: '0.9rem' }}>
            3 simple steps me shuru karo
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', icon: '📝', title: 'Register Karo', desc: 'Gmail ya Mobile se free me sign up karo — sirf 30 seconds', color: '#dbeafe', border: '#93c5fd' },
              { step: '02', icon: '📚', title: 'Practice Karo', desc: 'Mock Test aur PYP se exam ki taiyari strong karo', color: '#fef3c7', border: '#fcd34d' },
              { step: '03', icon: '🏆', title: 'Jeeto', desc: 'Live Test me participate karo aur amazing prizes jeeto', color: '#dcfce7', border: '#86efac' },
            ].map((item, index) => (
              <div key={index} style={{
                background: 'white', borderRadius: '20px', padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `2px solid ${item.border}`,
                textAlign: 'center', transition: 'all 0.3s ease',
              }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '18px',
                    background: item.color, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', margin: '0 auto',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    width: '24px', height: '24px', background: '#1a3c8f',
                    color: 'white', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 900,
                  }}>
                    {item.step}
                  </span>
                </div>
                <h3 style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE TEST PROMO */}
      <section style={{ padding: '3rem 1rem', background: '#fff7ed' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, white, #f0f4ff)',
            borderRadius: '24px', padding: '2.5rem',
            boxShadow: '0 8px 30px rgba(26,60,143,0.1)',
            border: '2px solid #dbeafe',
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem',
          }}>
            <div>
              <span style={{
                background: '#dcfce7', color: '#166534',
                padding: '4px 12px', borderRadius: '9999px',
                fontSize: '0.7rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                marginBottom: '12px',
              }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}/>
                Live Test
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3c8f', marginBottom: '8px' }}>
                🏆 Live Test Me Join Karo
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Sirf ₹9 me participate karo — Books, Laptops aur aur bhi prizes!
              </p>
            </div>
            <Link href="/dashboard/live-test" style={{
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              color: 'white', padding: '16px 36px', borderRadius: '14px',
              fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
              flexShrink: 0,
            }}>
              Join Karo — ₹9 Only
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
