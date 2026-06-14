'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const [user, setUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchOrCreateDbUser(supabase, authUser) {
    if (!authUser) return null

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      if (existingUser) return existingUser

      const newUser = {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.email || 'Student',
        email: authUser.email || null,
        mobile: authUser.phone || null,
        role: 'student',
        trial_start: new Date().toISOString(),
        subscription_status: 'trial',
      }

      const { data: insertedUser } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .maybeSingle()

      return insertedUser || newUser
    } catch (err) {
      console.error('fetchOrCreateDbUser error:', err)
      return null
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(user)
        if (user) {
          const dbUserData = await fetchOrCreateDbUser(supabase, user)
          if (mounted) setDbUser(dbUserData)
        }
      } catch (err) {
        console.error('getUser error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          const dbUserData = await fetchOrCreateDbUser(supabase, session.user)
          if (mounted) setDbUser(dbUserData)
        } else {
          setDbUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, dbUser, loading }
}
