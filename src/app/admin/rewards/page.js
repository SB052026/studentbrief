'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [liveTests, setLiveTests] = useState([])
  const [selectedTest, setSelectedTest] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    user_id: '',
    test_id: '',
    reward_name: '',
    reward_description: '',
  })

  async function fetchData() {
    const supabase = createClient()
    const { data: rewardsData } = await supabase
      .from('rewards')
      .select('*, users(name), live_tests(title)')
      .order('created_at', { ascending: false })
    const { data: testsData } = await supabase
      .from('live_tests')
      .select('*')
      .order('created_at', { ascending: false })
    setRewards(rewardsData || [])
    setLiveTests(testsData || [])
    setLoading(false)
  }

  async function fetchLeaderboard(testId) {
    const supabase = createClient()
    const { data } = await supabase
      .from('leaderboard')
      .select('*, users(name)')
      .eq('test_id', testId)
      .order('score', { ascending: false })
      .order('time_taken', { ascending: true })
    setLeaderboard(data || [])
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (selectedTest) {
      fetchLeaderboard(selectedTest)
      setForm(p => ({ ...p, test_id: selectedTest }))
    }
  }, [selectedTest])

  async function handleSave() {
    if (!form.user_id || !form.test_id || !form.reward_name) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('rewards').insert({
      user_id: form.user_id,
      test_id: form.test_id,
      reward_name: form.reward_name,
      reward_description: form.reward_description || null,
      status: 'pending',
    })
    await fetchData()
    setShowForm(false)
    setForm({ user_id: '', test_id: '', reward_name: '', reward_description: '' })
    setSaving(false)
  }

  async function handleMarkDelivered(id) {
    const supabase = createClient()
    await supabase.from('rewards').update({ status: 'delivered' }).eq('id', id)
    await fetchData()
  }

  async function handleDelete(id) {
    if (!confirm('Kya aap sure hain?')) return
    const supabase = createClient()
    await supabase.from('rewards').delete().eq('id', id)
    await fetchData()
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Rewards Manage Karo</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Reward Assign Karo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="font-bold text-blue-900 mb-4">Reward Assign Karo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Live Test Select Karo</label>
              <select
                className="input-field"
                value={selectedTest}
                onChange={e => setSelectedTest(e.target.value)}
              >
                <option value="">Test select karo</option>
                {liveTests.map(test => (
                  <option key={test.id} value={test.id}>{test.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Student Select Karo</label>
              <select
                className="input-field"
                value={form.user_id}
                onChange={e => setForm(p => ({ ...p, user_id: e.target.value }))}
              >
                <option value="">Student select karo</option>
                {leaderboard.map((entry, index) => (
                  <option key={entry.user_id} value={entry.user_id}>
                    #{index + 1} {entry.users?.name} (Score: {entry.score})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Reward Name *</label>
              <input
                className="input-field"
                value={form.reward_name}
                onChange={e => setForm(p => ({ ...p, reward_name: e.target.value }))}
                placeholder="Laptop, Books, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
              <input
                className="input-field"
                value={form.reward_description}
                onChange={e => setForm(p => ({ ...p, reward_description: e.target.value }))}
                placeholder="Reward details..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Assign Karo'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {rewards.length > 0 ? (
        <div className="flex flex-col gap-3">
          {rewards.map((reward, index) => (
            <div key={reward.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎁'}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{reward.reward_name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {reward.users?.name} • {reward.live_tests?.title}
                  </p>
                  {reward.reward_description && (
                    <p className="text-xs text-gray-400 mt-0.5">{reward.reward_description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${reward.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {reward.status === 'delivered' ? 'Delivered ✓' : 'Pending'}
                </span>
                {reward.status !== 'delivered' && (
                  <button
                    onClick={() => handleMarkDelivered(reward.id)}
                    className="text-xs bg-green-100 hover:bg-green-200 text-green-800 font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    Delivered Mark Karo
                  </button>
                )}
                <button
                  onClick={() => handleDelete(reward.id)}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Koi reward nahi hai" description="Kisi winner ko reward assign karo" icon="🎁" />
      )}
    </div>
  )
}
