import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { UserCard } from '../types/index'
import type { Benefit } from '../types/index'

export function useUserCards(userId: string) {
  const [userCards, setUserCards] = useState<UserCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserCards = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('user_cards')
      .select(`
        *,
        card:cards (
          *,
          benefits (*),
          redemptions (*),
          perks (*)
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false })

    if (error) setError(error.message)
    else {
      const sorted = (data ?? []).sort((a, b) =>
        a.card.name.localeCompare(b.card.name)
      )

      sorted.forEach(userCard => {
        userCard.card.benefits.sort((a : Benefit, b : Benefit) => b.earn_rate - a.earn_rate)
      })

      setUserCards(sorted)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchUserCards()
  }, [fetchUserCards])

  return { userCards, loading, error, refetch: fetchUserCards }
}