'use client'

import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'

export default function AdminLayout({ children }) {
  const { dbUser, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!dbUser || dbUser.role !== 'admin')) {
      router.push('/')
    }
  }, [dbUser, loading])

  if (loading) return <Loader />

  if (!dbUser || dbUser.role !== 'admin') return null

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-blue-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-blue-800">
          <Link href="/" className="text-xl font-bold">
            Student<span className="text-orange-400">Brief</span>
          </Link>
          <p className="text-blue-300 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <Link href="/admin" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            📊 Dashboard
          </Link>
          <Link href="/admin/jobs" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            💼 Jobs
          </Link>
          <Link href="/admin/results" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            📋 Results
          </Link>
          <Link href="/admin/mock-test" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            📝 Mock Tests
          </Link>
          <Link href="/admin/pyp" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            📄 PYP Papers
          </Link>
          <Link href="/admin/live-test" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            🎯 Live Tests
          </Link>
          <Link href="/admin/students" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            👥 Students
          </Link>
          <Link href="/admin/rewards" className="px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition">
            🎁 Rewards
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  )
}
