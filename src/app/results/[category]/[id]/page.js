import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function ResultDetailPage({ params }) {
  const { category, id } = await params
  const supabase = await createClient()

  const { data: result } = await supabase
    .from('results')
    .select('*, result_categories(name, slug)')
    .eq('id', id)
    .single()

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Result nahi mila</h2>
            <Link href="/results" className="text-blue-600 hover:underline mt-2 block">
              Wapas Results pe jao
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
          <Link href="/results" className="text-blue-600 hover:underline">Results</Link>
          <span className="text-gray-400">→</span>
          <Link href={`/results/${category}`} className="text-blue-600 hover:underline">
            {result.result_categories?.name}
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 truncate">{result.title}</span>
        </div>

        <div className="card">
          <div className="flex items-start justify-between mb-6 pb-4 border-b">
            <h1 className="text-xl md:text-2xl font-bold text-blue-900">
              {result.title}
            </h1>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ml-2 shrink-0 ${result.result_status === 'Declared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {result.result_status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  📅 Important Dates
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Published Date</span>
                    <span className="font-medium">{formatDate(result.published_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exam Date</span>
                    <span className="font-medium">{formatDate(result.exam_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Result Date</span>
                    <span className="font-medium text-green-600">{formatDate(result.result_date)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  🏢 Organization
                </h3>
                <p className="text-sm font-medium text-gray-700">{result.organization}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  📋 Post Details
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Post Name</span>
                    <span className="font-medium">{result.post_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Vacancies</span>
                    <span className="font-medium text-blue-600">{result.total_vacancies?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                  📊 Result Status
                </h3>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${result.result_status === 'Declared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {result.result_status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <a
              href={result.result_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full md:w-auto md:inline-block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition text-lg"
            >
              Check Result — Official Website →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
