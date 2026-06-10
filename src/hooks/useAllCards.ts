import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Card } from '../types/index'

export function useAllCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await supabase
        .from('cards')
        .select(`
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
        `)
        .order('name')

      setCards((data ?? []) as Card[])
      setLoading(false)
    }

    fetchCards()
  }, [])

  return { cards, loading }
}