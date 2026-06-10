'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useSubscription } from '@/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function PypPage() {
  const { dbUser, loading: userLoading } = useUser()
  const { hasAccess, trialDaysLeft, loading: subLoading } = useSubscription(dbUser)
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPapers() {
      const supabase = createClient()
      const { data } = await supabase
        .from('pyp')
        .select('*')
        .order('year', { ascending: false })
      setPapers(data || [])
      setLoading(false)
    }
    fetchPapers()
  }, [])

  if (userLoading || subLoading || loading) return <Loader />

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-6 block">🔒</span>
        <h2 className="text-2xl font-bold text-blue-900 mb-3">Subscription Required</h2>
        <p className="text-gray-500 mb-6">
          Previous Year Papers use karne ke liye ₹29/month subscribe karo
        </p>
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
          <h1 className="section-title">Previous Year Papers</h1>
          <p className="text-gray-500 text-sm">Purane papers se practice karo</p>
        </div>
        {trialDaysLeft > 0 && (
          <span className="badge-trial">{trialDaysLeft} din baaki</span>
        )}
      </div>

      {papers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map((paper) => (
            <div key={paper.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">📄</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
                  {paper.year}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-4">{paper.exam_name}</h3>
              {paper.file_url ? (
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium py-2 rounded-lg transition"
                >
                  Download / View PDF
                </a>
              ) : (
                <div className="w-full text-center bg-gray-100 text-gray-500 text-sm py-2 rounded-lg">
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Koi paper nahi mila"
          description="Abhi koi previous year paper available nahi hai"
          icon="📄"
        />
      )}
    </div>
  )
}
