import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { UserCard, EarnRate } from '../types/index'

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
        id,
        card_id,
        added_at,
        card:cards (
          *,
          earn_rates (*),
          card_perks (
            id, value, notes,
            perk:perk_definitions (*)
          ),
          card_protections (
            id, coverage_amount, notes, source, verified_at,
            protection:protection_definitions (*)
          ),
          card_transfer_partners (
            id, ratio, notes,
            partner:transfer_partners (*)
          ),
          redemption_values (*)
        )
      `)
      .eq('user_id', userId)

    if (error) {
      setError(error.message)
    } else {
      const sorted = (data ?? []).sort((a, b) =>
        a.card.name.localeCompare(b.card.name)
      )

      sorted.forEach(userCard => {
        userCard.card.earn_rates.sort((a: EarnRate, b: EarnRate) =>
          b.earn_rate - a.earn_rate
        )
      })

      setUserCards(sorted as UserCard[])
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchUserCards()
  }, [fetchUserCards])

  return { userCards, loading, error, refetch: fetchUserCards }
}