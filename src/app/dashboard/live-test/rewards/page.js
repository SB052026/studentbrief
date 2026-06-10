'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function RewardsPage() {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRewards() {
      const supabase = createClient()
      const { data } = await supabase
        .from('rewards')
        .select('*, users(name), live_tests(title)')
        .order('created_at', { ascending: false })
      setRewards(data || [])
      setLoading(false)
    }
    fetchRewards()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/dashboard/live-test" className="text-blue-600 hover:underline text-sm mb-6 block">
        ← Wapas Live Tests pe jao
      </Link>

      <h1 className="section-title mb-2">🎁 Rewards</h1>
      <p className="text-gray-500 text-sm mb-8">
        Live Test winners ko ye prizes milenge
      </p>

      {rewards.length > 0 ? (
        <div className="flex flex-col gap-4">
          {rewards.map((reward, index) => (
            <div key={reward.id} className="card flex items-center gap-4">
              <div className="text-4xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎁'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{reward.reward_name}</h3>
                <p className="text-xs text-gray-500 mt-1">{reward.reward_description}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Test: {reward.live_tests?.title}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {reward.users?.name || 'Winner'}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  reward.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reward.status === 'delivered' ? 'Delivered ✓' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Abhi koi reward nahi hai"
          description="Live Test me participate karo aur prizes jeeto"
          icon="🎁"
        />
      )}
    </div>
  )
}
