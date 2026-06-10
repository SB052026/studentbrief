'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, isTrialActive, getTrialDaysLeft } from '@/lib/utils'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function fetchStudents() {
    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('*, subscriptions(status, end_date)')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
    setStudents(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchStudents() }, [])

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.mobile?.includes(search)
  )

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Students</h1>
        <span className="text-sm text-gray-500">{students.length} total</span>
      </div>

      <input
        className="input-field mb-6 max-w-md"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Name, email ya mobile se search karo..."
      />

      {filtered.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="grid grid-cols-12 bg-blue-900 text-white text-xs font-semibold px-4 py-3">
            <div className="col-span-4">Student</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-3">Subscription</div>
            <div className="col-span-2">Joined</div>
          </div>
          {filtered.map((student, index) => {
            const trialActive = isTrialActive(student.trial_start)
            const trialDays = getTrialDaysLeft(student.trial_start)
            const subscription = student.subscriptions?.[0]
            const subActive = subscription?.status === 'active' && new Date() < new Date(subscription?.end_date)

            return (
              <div
                key={student.id}
                className={`grid grid-cols-12 px-4 py-3 border-b text-sm items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="col-span-4">
                  <p className="font-medium text-gray-800 truncate">{student.name || 'N/A'}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-gray-500 truncate">{student.email || student.mobile || 'N/A'}</p>
                </div>
                <div className="col-span-3">
                  {subActive ? (
                    <span className="badge-active">Active</span>
                  ) : trialActive ? (
                    <span className="badge-trial">{trialDays}d trial</span>
                  ) : (
                    <span className="badge-expired">Expired</span>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">{formatDate(student.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState title="Koi student nahi mila" description="Abhi koi student registered nahi hai" icon="👥" />
      )}
    </div>
  )
}
