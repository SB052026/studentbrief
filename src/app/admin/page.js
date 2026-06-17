'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/ui/Loader'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      const { count: totalStudents } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

      const { count: totalJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })

      const { count: totalResults } = await supabase
        .from('results')
        .select('*', { count: 'exact', head: true })

      const { count: totalMockTests } = await supabase
        .from('mock_tests')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalStudents: totalStudents || 0,
        totalJobs: totalJobs || 0,
        totalResults: totalResults || 0,
        totalMockTests: totalMockTests || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Total Students</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Total Jobs</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalJobs}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Total Results</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalResults}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Mock Tests</p>
          <p className="text-3xl font-bold text-orange-500">{stats.totalMockTests}</p>
        </div>
      </div>
    </div>
  )
}
