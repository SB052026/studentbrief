'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const [user, setUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchOrCreateDbUser(supabase, authUser) {
    if (!authUser) return null

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

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
      .single()

    return insertedUser || newUser
  }

  useEffect(() => {
    const supabase = createClient()

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const dbUserData = await fetchOrCreateDbUser(supabase, user)
        setDbUser(dbUserData)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const dbUserData = await fetchOrCreateDbUser(supabase, session.user)
          setDbUser(dbUserData)
        } else {
          setDbUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, dbUser, loading }
}
