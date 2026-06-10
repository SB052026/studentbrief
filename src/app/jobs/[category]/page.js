import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/ui/EmptyState'

export default async function JobCategoryPage({ params }) {
  const { category } = await params
  const supabase = await createClient()

  const { data: categoryData } = await supabase
    .from('job_categories')
    .select('*')
    .eq('slug', category)
    .single()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('category_id', categoryData?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/jobs" className="text-blue-600 hover:underline text-sm">Jobs</Link>
          <span className="text-gray-400">→</span>
          <span className="text-sm font-medium text-gray-700">
            {categoryData?.icon} {categoryData?.name}
          </span>
        </div>
        <h1 className="section-title mb-6">{categoryData?.name}</h1>
        {jobs && jobs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${category}/${job.id}`}
                className="card block hover:border-l-4 hover:border-blue-600"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-800 mb-1">{job.title}</h2>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>📅 Last Date: {formatDate(job.last_date)}</span>
                      <span>🎓 {job.education}</span>
                      <span>👤 Age: {job.age_min}-{job.age_max} yrs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.exam_date && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Exam: {formatDate(job.exam_date)}
                      </span>
                    )}
                    <span className="text-orange-500 text-sm font-medium">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Koi job nahi mili"
            description="Is category me abhi koi job available nahi hai"
            icon="💼"
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
