import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const isEmailConfirmed = (user: User | null | undefined) =>
  Boolean(user?.email_confirmed_at || user?.confirmed_at)

const emailNotConfirmedError = {
  message: 'Please confirm your email before signing in',
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle email confirmation redirect
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !isEmailConfirmed(session.user)) {
        supabase.auth.signOut()
        setSession(null)
        setUser(null)
        setLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for the confirmation token in the URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !isEmailConfirmed(session.user)) {
        supabase.auth.signOut()
        setSession(null)
        setUser(null)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error?.message.toLowerCase().includes('email not confirmed')) {
      return { error: emailNotConfirmedError }
    }

    if (!error && !isEmailConfirmed(data.user)) {
      await supabase.auth.signOut()
      return { error: emailNotConfirmedError }
    }

    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const deleteAccount = async () => {
    const { error } = await supabase.rpc('delete_user')
    if (!error) await supabase.auth.signOut()
    return { error }
  }

  return { user, session, loading, signIn, signUp, signOut, deleteAccount }
}
