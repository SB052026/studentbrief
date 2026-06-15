'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const UserContext = createContext({ user: null, dbUser: null, loading: true })

export function UserProvider({ children }) {
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
      console.error(err)
      return null
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const sessionUser = session?.user ?? null
        if (!mounted) return
        setUser(sessionUser)
        if (sessionUser) {
          const dbUserData = await fetchOrCreateDbUser(supabase, sessionUser)
          if (mounted) setDbUser(dbUserData)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

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
        if (mounted) setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, dbUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
