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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section style={{ backgroundColor: '#1a3c8f' }} className="text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to <span style={{ color: '#f97316' }}>StudentBrief</span>
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Latest Govt Jobs, Results, Mock Tests, PYP and Live Tests — sab kuch ek jagah
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/jobs" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition">
              Latest Jobs
            </Link>
            <Link href="/results" className="bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 py-3 rounded-lg transition">
              Latest Results
            </Link>
            <Link href="/dashboard/live-test" className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition">
              Live Test
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 px-4" style={{ backgroundColor: '#fff3e0' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-700 font-semibold text-sm md:text-base">
            🎯 Mock Test + Previous Year Papers — sirf ₹29/month | 7 Din Free Trial
          </p>
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Latest Jobs</h2>
          <Link href="/jobs" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            Sab dekho →
          </Link>
        </div>
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.job_categories?.slug}/${job.id}`}
                className="card block"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{job.title}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-1">Last Date: {formatDate(job.last_date)}</p>
                <p className="text-xs text-gray-500">Age: {job.age_min}-{job.age_max} years</p>
                <div className="mt-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {job.job_categories?.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">Koi job abhi available nahi hai</div>
        )}
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Latest Results</h2>
          <Link href="/results" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            Sab dekho →
          </Link>
        </div>
        {results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/results/${result.result_categories?.slug}/${result.id}`}
                className="card block"
              >
                <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2">{result.title}</h3>
                <p className="text-xs text-gray-500 mb-1">Result Date: {formatDate(result.result_date)}</p>
                <p className="text-xs text-gray-500 mb-3">Organization: {result.organization}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${result.result_status === 'Declared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {result.result_status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">Koi result abhi available nahi hai</div>
        )}
      </section>

      <section className="py-12 px-4" style={{ backgroundColor: '#1a3c8f' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscription Plan</h2>
          <p className="text-blue-200 mb-8">Mock Test + Previous Year Papers unlock karo</p>
          <div className="bg-white text-gray-800 rounded-2xl p-8 max-w-sm mx-auto">
            <div className="text-4xl font-bold text-blue-900 mb-1">₹29<span className="text-lg font-normal text-gray-500">/month</span></div>
            <p className="text-green-600 font-semibold mb-6">7 Din Free Trial</p>
            <ul className="text-left text-sm flex flex-col gap-3 mb-6">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited Mock Tests</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Previous Year Papers</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Detailed Solutions</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Performance Analysis</li>
            </ul>
            <Link href="/login" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition text-center">
              Free Trial Shuru Karo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto w-full">
        <h2 className="section-title text-center mb-8">Kaise Kaam Karta Hai</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 card">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="font-semibold mb-2">Register Karo</h3>
            <p className="text-sm text-gray-500">Gmail ya Mobile se free me sign up karo</p>
          </div>
          <div className="text-center p-6 card">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-semibold mb-2">Practice Karo</h3>
            <p className="text-sm text-gray-500">Mock Test aur PYP se exam ki taiyari karo</p>
          </div>
          <div className="text-center p-6 card">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-semibold mb-2">Jeeto</h3>
            <p className="text-sm text-gray-500">Live Test me participate karo aur prizes jeeto</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
