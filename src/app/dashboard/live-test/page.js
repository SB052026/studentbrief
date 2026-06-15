'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/UserProvider'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'

export default function LiveTestPage() {
  const { dbUser, loading: userLoading } = useUser()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      const supabase = createClient()
      const { data } = await supabase
        .from('live_tests')
        .select('*')
        .order('test_date', { ascending: false })
      setTests(data || [])
      setLoading(false)
    }
    fetchTests()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="section-title">Live Tests</h1>
        <p className="text-gray-500 text-sm">₹9 me participate karo aur prizes jeeto</p>
      </div>

      <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <div>
          <p className="font-semibold text-orange-800 text-sm">Rewards Available!</p>
          <p className="text-orange-700 text-xs">Top students ko books, laptops aur aur bhi prizes milenge</p>
        </div>
        <Link href="/dashboard/live-test/rewards" className="ml-auto text-xs text-orange-600 hover:underline shrink-0">
          Rewards dekho →
        </Link>
      </div>

      {tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">🎯</span>
                <Badge type={test.status} text={test.status} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{test.title}</h3>
              <div className="flex flex-col gap-1 text-xs text-gray-500 mb-4">
                <span>📅 {formatDate(test.test_date)}</span>
                <span>⏱️ {test.duration_minutes} minutes</span>
                <span>❓ {test.total_questions} questions</span>
                <span className="font-semibold text-orange-600">💰 Fee: ₹{test.fee}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/dashboard/live-test/${test.id}`}
                  className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium py-2 rounded-lg transition"
                >
                  {test.status === 'completed' ? 'Result Dekho' : 'Join Karo — ₹9'}
                </Link>
                <Link
                  href={`/dashboard/live-test/${test.id}/leaderboard`}
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition"
                >
                  Leaderboard Dekho
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Koi live test nahi mila"
          description="Abhi koi live test available nahi hai"
          icon="🎯"
        />
      )}
    </div>
  )
}
