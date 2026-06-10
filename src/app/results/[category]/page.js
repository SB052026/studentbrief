import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import EmptyState from '@/components/ui/EmptyState'

export default async function ResultCategoryPage({ params }) {
  const { category } = await params
  const supabase = await createClient()

  const { data: categoryData } = await supabase
    .from('result_categories')
    .select('*')
    .eq('slug', category)
    .single()

  const { data: results } = await supabase
    .from('results')
    .select('*')
    .eq('category_id', categoryData?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/results" className="text-blue-600 hover:underline text-sm">Results</Link>
          <span className="text-gray-400">→</span>
          <span className="text-sm font-medium text-gray-700">
            {categoryData?.icon} {categoryData?.name}
          </span>
        </div>
        <h1 className="section-title mb-6">{categoryData?.name}</h1>
        {results && results.length > 0 ? (
          <div className="flex flex-col gap-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/results/${category}/${result.id}`}
                className="card block hover:border-l-4 hover:border-blue-600"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-800 mb-1">{result.title}</h2>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>🏢 {result.organization}</span>
                      <span>📅 Result Date: {formatDate(result.result_date)}</span>
                      <span>📋 {result.post_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${result.result_status === 'Declared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {result.result_status}
                    </span>
                    <span className="text-orange-500 text-sm font-medium">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Koi result nahi mila"
            description="Is category me abhi koi result available nahi hai"
            icon="📋"
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
