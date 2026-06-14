'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/UserProvider'
import { useSubscription } from '@/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function MockTestPage() {
  const { dbUser, loading: userLoading } = useUser()
  const { hasAccess, trialDaysLeft, loading: subLoading } = useSubscription(dbUser)
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      const supabase = createClient()
      const { data } = await supabase
        .from('mock_tests')
        .select('*')
        .order('created_at', { ascending: false })
      setTests(data || [])
      setLoading(false)
    }
    fetchTests()
  }, [])

  if (userLoading || subLoading || loading) return <Loader />

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-6 block">🔒</span>
        <h2 className="text-2xl font-bold text-blue-900 mb-3">Subscription Required</h2>
        <p className="text-gray-500 mb-6">Mock Test use karne ke liye ₹29/month subscribe karo ya free trial shuru karo</p>
        <Link
          href="/dashboard/subscribe"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Subscribe Karo — ₹29/month
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Mock Tests</h1>
          <p className="text-gray-500 text-sm">Practice karo aur taiyari strong karo</p>
        </div>
        {trialDaysLeft > 0 && (
          <span className="badge-trial">{trialDaysLeft} din baaki</span>
        )}
      </div>

      {tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">📝</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {test.total_questions} Questions
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{test.title}</h3>
              <p className="text-xs text-gray-500 mb-4">
                ⏱️ {test.duration_minutes} minutes
              </p>
              <Link
                href={`/dashboard/mock-test/${test.id}`}
                className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium py-2 rounded-lg transition"
              >
                Test Shuru Karo
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Koi mock test nahi mila"
          description="Abhi koi mock test available nahi hai"
          icon="📝"
        />
      )}
    </div>
  )
}
