'use client'

import { useEffect, useState } from 'react'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function LeaderboardPage({ params }) {
  const { user } = useUser()
  const [testId, setTestId] = useState(null)
  const [testTitle, setTestTitle] = useState('')

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setTestId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  const { leaderboard, loading } = useLeaderboard(testId)

  if (loading) return <Loader />

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/dashboard/live-test" className="text-blue-600 hover:underline text-sm mb-6 block">
        ← Wapas Live Tests pe jao
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">🏆 Live Leaderboard</h1>
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold animate-pulse">
          Live
        </span>
      </div>

      {leaderboard.length > 0 ? (
        <div className="card overflow-hidden p-0">
          <div className="grid grid-cols-12 bg-blue-900 text-white text-xs font-semibold px-4 py-3">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-5">Student</div>
            <div className="col-span-3 text-center">Score</div>
            <div className="col-span-2 text-center">Time</div>
          </div>
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`grid grid-cols-12 px-4 py-3 border-b text-sm items-center ${
                entry.user_id === user?.id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="col-span-2 text-center font-bold">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div className="col-span-5 font-medium text-gray-800">
                {entry.users?.name || 'Student'}
                {entry.user_id === user?.id && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <div className="col-span-3 text-center font-bold text-blue-900">
                {entry.score}
              </div>
              <div className="col-span-2 text-center text-gray-500 text-xs">
                {entry.time_taken ? `${Math.floor(entry.time_taken / 60)}m ${entry.time_taken % 60}s` : '-'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Leaderboard abhi empty hai"
          description="Jab students test submit karenge tab rankings yahan dikhegi"
          icon="🏆"
        />
      )}

      <div className="mt-6 text-center">
        <Link
          href="/dashboard/live-test/rewards"
          className="text-sm text-orange-500 hover:underline font-medium"
        >
          Rewards dekho →
        </Link>
      </div>
    </div>
  )
}
