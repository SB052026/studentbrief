import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { JOB_CATEGORIES } from '@/constants'

export const metadata = {
  title: 'Latest Jobs - StudentBrief',
  description: 'Latest Govt Jobs, Bank Jobs, Railway Jobs and more on StudentBrief.in',
}

export default function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <h1 className="section-title text-2xl md:text-3xl mb-2">Latest Jobs</h1>
        <p className="text-gray-500 text-sm mb-8">Apni category select karo</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {JOB_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/jobs/${category.slug}`}
              className="card flex flex-col items-center justify-center text-center py-8 cursor-pointer"
            >
              <span className="text-4xl mb-3">{category.icon}</span>
              <span className="font-semibold text-gray-800 text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
