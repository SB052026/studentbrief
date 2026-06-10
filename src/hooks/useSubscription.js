'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { hasAccessToContent, getTrialDaysLeft } from '@/lib/utils'

export function useSubscription(user) {
  const [subscription, setSubscription] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [trialDaysLeft, setTrialDaysLeft] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    async function getSubscription() {
      const supabase = createClient()
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
      setSubscription(data)
      setHasAccess(hasAccessToContent(user, data))
      setTrialDaysLeft(getTrialDaysLeft(user.trial_start))
      setLoading(false)
    }
    getSubscription()
  }, [user])

  return { subscription, hasAccess, trialDaysLeft, loading }
}
