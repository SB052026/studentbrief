import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function JobDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, job_categories(name, slug)')
    .eq('id', id)
    .single()

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Job nahi mili</h2>
            <Link href="/jobs" className="text-blue-600 hover:underline mt-2 block">
              Wapas Jobs pe jao
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/jobs" className="text-blue-600 hover:underline">Jobs</Link>
          <span className="text-gray-400">→</span>
          <Link href={`/jobs/${category}`} className="text-blue-600 hover:underline">
            {job.job_categories?.name}
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 truncate">{job.title}</span>
        </div>

        <div className="card">
          <h1 className="text-xl md:text-2xl font-bold text-blue-900 mb-6 pb-4 border-b">
            {job.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  📅 Important Dates
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Published Date</span>
                    <span className="font-medium">{formatDate(job.published_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Date</span>
                    <span className="font-medium text-red-600">{formatDate(job.last_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exam Date</span>
                    <span className="font-medium">{formatDate(job.exam_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Physical Date</span>
                    <span className="font-medium">{formatDate(job.physical_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Medical Date</span>
                    <span className="font-medium">{formatDate(job.medical_date)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  👤 Age Limit
                </h3>
                <p className="text-sm font-medium">
                  {job.age_min} - {job.age_max} Years
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  🎓 Education Qualification
                </h3>
                <p className="text-sm text-gray-700">{job.education}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  📄 Required Documents
                </h3>
                <p className="text-sm text-gray-700">{job.documents}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  📏 Physical Measurements
                </h3>
                <p className="text-sm text-gray-700">{job.physical_measurements}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  🏥 Medical Criteria
                </h3>
                <p className="text-sm text-gray-700">{job.medical_criteria}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full md:w-auto md:inline-block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition text-lg"
            >
              Apply Now — Official Website →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
