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

      <section className="hero-gradient py-20 px-4 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-fadeInDown">
            <span className="badge-live">Live</span>
            <span className="text-white text-xs font-medium">StudentBrief Live Test Ab Available Hai</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight animate-fadeInUp">
            Apni <span style={{ color: '#f97316' }}>Taiyari</span> Ko
            <br className="hidden md:block" />
            Next Level Pe Le Jao
          </h1>
          <p className="text-blue-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fadeInUp delay-200">
            Latest Govt Jobs, Results, Mock Tests, PYP aur Live Tests — sab kuch ek jagah
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeInUp delay-300">
            <Link href="/jobs" className="btn-secondary text-base px-8 py-3">💼 Latest Jobs</Link>
            <Link href="/login" className="btn-outline text-white text-base px-8 py-3" style={{ borderColor: 'white' }}>🚀 Free Shuru Karo</Link>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-14 animate-fadeInUp delay-400">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">500+</div>
              <div className="text-blue-200 text-xs mt-1">Jobs</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">200+</div>
              <div className="text-blue-200 text-xs mt-1">Results</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">50+</div>
              <div className="text-blue-200 text-xs mt-1">Tests</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#f0f4ff"/>
          </svg>
        </div>
      </section>

      <section className="py-4 px-4" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce-slow">🎯</span>
            <div>
              <p className="font-bold text-orange-800 text-sm">Mock Test + Previous Year Papers</p>
              <p className="text-orange-600 text-xs">Sirf ₹29/month — 7 Din Free Trial ke saath</p>
            </div>
          </div>
          <Link href="/login" className="btn-secondary text-sm px-6 py-2 shrink-0">Free Trial Shuru Karo →</Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title-center animate-fadeInUp">Kyu Chunein <span style={{ color: '#f97316' }}>StudentBrief</span>?</h2>
          <p className="section-subtitle text-center mb-10 animate-fadeInUp delay-100">Exam ki taiyari ke liye sab kuch ek jagah</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '💼', title: 'Latest Jobs', desc: 'Govt, Bank, Railway, Defence — sab latest jobs', color: '#dbeafe' },
              { icon: '📊', title: 'Latest Results', desc: 'Sabhi exams ke results ek jagah dekho', color: '#dcfce7' },
              { icon: '📝', title: 'Mock Tests', desc: 'Practice tests se apni taiyari test karo', color: '#fef3c7' },
              { icon: '🏆', title: 'Live Test', desc: '₹9 me participate karo aur prizes jeeto', color: '#fce7f3' },
            ].map((feature, index) => (
              <div key={index} className={`card animate-fadeInUp delay-${(index + 1) * 100}`}>
                <div className="category-icon mb-4" style={{ backgroundColor: feature.color }}>
                  <span style={{ fontSize: '1.75rem' }}>{feature.icon}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">💼 Latest Jobs</h2>
              <p className="section-subtitle">Naye government jobs dekho</p>
            </div>
            <Link href="/jobs" className="btn-outline text-sm px-4 py-2">Sab Dekho →</Link>
          </div>
          {jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {jobs.map((job, index) => (
                <Link key={job.id} href={`/jobs/${job.job_categories?.slug}/${job.id}`} className={`card block animate-fadeInUp delay-${(index + 1) * 100}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">💼</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">{job.job_categories?.name}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-3 leading-snug">{job.title}</h3>
                  <div className="divider"></div>
                  <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>📅 Last Date</span>
                      <span className="font-semibold text-red-500">{formatDate(job.last_date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>👤 Age Limit</span>
                      <span className="font-semibold text-gray-700">{job.age_min}-{job.age_max} yrs</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-xs font-semibold text-orange-500">Details Dekho →</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <span className="text-5xl block mb-3">💼</span>
              <p>Abhi koi job available nahi hai</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">📊 Latest Results</h2>
              <p className="section-subtitle">Naye exam results dekho</p>
            </div>
            <Link href="/results" className="btn-outline text-sm px-4 py-2">Sab Dekho →</Link>
          </div>
          {results && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {results.map((result, index) => (
                <Link key={result.id} href={`/results/${result.result_categories?.slug}/${result.id}`} className={`card block animate-fadeInUp delay-${(index + 1) * 100}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">📊</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${result.result_status === 'Declared' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {result.result_status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-3 leading-snug">{result.title}</h3>
                  <div className="divider"></div>
                  <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>🏢 Organization</span>
                      <span className="font-semibold text-gray-700 truncate ml-2 max-w-[120px]">{result.organization}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>📅 Result Date</span>
                      <span className="font-semibold text-green-600">{formatDate(result.result_date)}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-xs font-semibold text-orange-500">Result Dekho →</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <span className="text-5xl block mb-3">📊</span>
              <p>Abhi koi result available nahi hai</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 hero-gradient relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="section-title-center text-white mb-2">Subscription Plan</h2>
          <p className="text-blue-200 text-center mb-10">Mock Test + Previous Year Papers unlock karo</p>
          <div className="max-w-sm mx-auto animate-scaleIn">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-blue-900 mb-1">₹29<span className="text-lg font-normal text-gray-400">/month</span></div>
                <div className="badge-active inline-flex mt-2">✅ 7 Din Free Trial</div>
              </div>
              <ul className="flex flex-col gap-3 mb-8">
                {['Unlimited Mock Tests', 'All Previous Year Papers', 'Detailed Solutions', 'Performance Analysis'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn-secondary w-full text-base py-3 block text-center">🚀 Free Trial Shuru Karo</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title-center animate-fadeInUp">Kaise Kaam Karta Hai?</h2>
          <p className="section-subtitle text-center mb-10 animate-fadeInUp delay-100">3 simple steps me shuru karo</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Register Karo', desc: 'Gmail ya Mobile se free me sign up karo', color: '#dbeafe' },
              { step: '02', icon: '📚', title: 'Practice Karo', desc: 'Mock Test aur PYP se taiyari strong karo', color: '#fef3c7' },
              { step: '03', icon: '🏆', title: 'Jeeto', desc: 'Live Test me participate karo aur prizes jeeto', color: '#dcfce7' },
            ].map((item, index) => (
              <div key={index} className={`card text-center animate-fadeInUp delay-${(index + 1) * 200}`}>
                <div className="relative inline-block mb-4">
                  <div className="category-icon mx-auto" style={{ backgroundColor: item.color, width: '70px', height: '70px', fontSize: '2rem' }}>{item.icon}</div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-900 text-white text-xs font-black rounded-full flex items-center justify-center">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4" style={{ backgroundColor: '#fff7ed' }}>
        <div className="max-w-5xl mx-auto">
          <div className="card-gradient rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="badge-live inline-flex mb-3">Live Test</div>
              <h2 className="text-2xl font-black text-blue-900 mb-2">🏆 Live Test Me Join Karo</h2>
              <p className="text-gray-500 text-sm">Sirf ₹9 me participate karo — Books, Laptops aur aur bhi prizes!</p>
            </div>
            <Link href="/dashboard/live-test" className="btn-secondary text-base px-8 py-4 shrink-0">Join Karo — ₹9 Only</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
