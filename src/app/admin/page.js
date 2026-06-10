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

      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: totalJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })

      const { count: totalResults } = await supabase
        .from('results')
        .select('*', { count: 'exact', head: true })

      const { count: totalLiveTests } = await supabase
        .from('live_tests')
        .select('*', { count: 'exact', head: true })

      const { count: totalPayments } = await supabase
        .from('live_payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'paid')

      setStats({
        totalStudents: totalStudents || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalJobs: totalJobs || 0,
        totalResults: totalResults || 0,
        totalLiveTests: totalLiveTests || 0,
        totalPayments: totalPayments || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Total Students</p>
          <p className="text-3xl font-bold text-blue-900">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Active Subscriptions</p>
          <p className="text-3xl font-bold text-green-600">{stats.activeSubscriptions}</p>
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
          <p className="text-gray-500 text-sm mb-1">Live Tests</p>
          <p className="text-3xl font-bold text-orange-500">{stats.totalLiveTests}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm mb-1">Paid Entries</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalPayments}</p>
        </div>
      </div>
    </div>
  )
}
