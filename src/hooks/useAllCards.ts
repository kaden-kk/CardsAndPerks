import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Card } from '../types/index'

export function useAllCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCards() {
      const { data } = await supabase
        .from('cards')
        .select('*')
        .order('issuer', { ascending: true })

      setCards(data ?? [])
      setLoading(false)
    }

    fetchCards()
  }, [])

  return { cards, loading }
}