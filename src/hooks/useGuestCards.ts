// src/hooks/useGuestCards.ts
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'guest_card_ids'

function readStored(): string[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useGuestCards() {
  const [guestCardIds, setGuestCardIds] = useState<string[]>(readStored)

  const addGuestCard = useCallback((cardId: string) => {
    setGuestCardIds(prev => {
      if (prev.includes(cardId)) return prev
      const updated = [...prev, cardId]
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeGuestCard = useCallback((cardId: string) => {
    setGuestCardIds(prev => {
      const updated = prev.filter(id => id !== cardId)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearGuestCards = useCallback(() => {
    setGuestCardIds([])
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  return { guestCardIds, addGuestCard, removeGuestCard, clearGuestCards }
}