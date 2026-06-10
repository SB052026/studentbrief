'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useLeaderboard(testId) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!testId) return

    const supabase = createClient()

    async function getLeaderboard() {
      const { data } = await supabase
        .from('leaderboard')
        .select('*, users(name, avatar_url)')
        .eq('test_id', testId)
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
      setLeaderboard(data || [])
      setLoading(false)
    }

    getLeaderboard()

    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard',
          filter: `test_id=eq.${testId}`,
        },
        () => {
          getLeaderboard()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [testId])

  return { leaderboard, loading }
}

