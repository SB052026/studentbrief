'use client'

import { useUser } from '@/hooks/useUser'
import { useSubscription } from '@/hooks/useSubscription'
import { getTrialDaysLeft, isTrialActive } from '@/lib/utils'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'

export default function DashboardPage() {
  const { user, dbUser, loading } = useUser()
  const { subscription, hasAccess, trialDaysLeft } = useSubscription(dbUser)

  if (loading) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">
          Welcome, {dbUser?.name || 'Student'} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">StudentBrief Dashboard</p>
      </div>

      <div className="mb-8">
        {hasAccess ? (
          isTrialActive(dbUser?.trial_start) ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-semibold text-yellow-800 text-sm">Free Trial Active</p>
                <p className="text-yellow-700 text-xs">{trialDaysLeft} din baaki hain — Mock Test aur PYP use karo</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-800 text-sm">Subscription Active</p>
                <p className="text-green-700 text-xs">Mock Test aur PYP available hain</p>
              </div>
            </div>
          )
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-semibold text-red-800 text-sm">Trial Expired</p>
                <p className="text-red-700 text-xs">₹29/month me subscribe karo</p>
              </div>
            </div>
            <Link
              href="/dashboard/subscribe"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shrink-0"
            >
              Subscribe Karo
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/mock-test" className="card flex flex-col items-center text-center py-8 hover:shadow-lg">
          <span className="text-5xl mb-4">📝</span>
          <h2 className="font-bold text-blue-900 text-lg mb-1">Mock Test</h2>
          <p className="text-gray-500 text-sm">Practice tests se taiyari karo</p>
          {!hasAccess && (
            <span className="mt-3 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              Subscription Required
            </span>
          )}
        </Link>

        <Link href="/dashboard/pyp" className="card flex flex-col items-center text-center py-8 hover:shadow-lg">
          <span className="text-5xl mb-4">📚</span>
          <h2 className="font-bold text-blue-900 text-lg mb-1">Previous Year Papers</h2>
          <p className="text-gray-500 text-sm">Purane papers se practice karo</p>
          {!hasAccess && (
            <span className="mt-3 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              Subscription Required
            </span>
          )}
        </Link>

        <Link href="/dashboard/live-test" className="card flex flex-col items-center text-center py-8 hover:shadow-lg">
          <span className="text-5xl mb-4">🏆</span>
          <h2 className="font-bold text-blue-900 text-lg mb-1">Live Test</h2>
          <p className="text-gray-500 text-sm">₹9 me participate karo aur prizes jeeto</p>
          <span className="mt-3 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            ₹9 per test
          </span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/jobs" className="card flex items-center gap-4">
          <span className="text-3xl">💼</span>
          <div>
            <h3 className="font-semibold text-gray-800">Latest Jobs</h3>
            <p className="text-sm text-gray-500">Naukri dhundo</p>
          </div>
        </Link>
        <Link href="/results" className="card flex items-center gap-4">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="font-semibold text-gray-800">Latest Results</h3>
            <p className="text-sm text-gray-500">Apna result dekho</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
