import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  display_name: string | null
  avatar_color: string
}

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-orange-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-pink-600',
]

export { AVATAR_COLORS }

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (updates: Partial<Pick<Profile, 'display_name' | 'avatar_color'>>) => {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (!error) setProfile(prev => prev ? { ...prev, ...updates } : null)
    return { error }
  }

  return { profile, loading, updateProfile, refetch: fetchProfile }
}