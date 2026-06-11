import type { UserCard } from '../types/index'
import { compareEarnRateCategories } from '../constants/categories'

export interface OptimizedCategory {
  category: string
  bestCard: string
  issuer: string
  earnRate: number
  pointCurrency: string
  effectiveReturn: number
  notes: string | null
  cardType: 'cashback' | 'points'
  tiedCards: { name: string; issuer: string }[]
}

export function optimizeCards(userCards: UserCard[]): OptimizedCategory[] {
  const categoryMap: Record<string, OptimizedCategory> = {}

  for (const userCard of userCards) {
    const { card } = userCard
    const pointValue = card.point_currency_value ?? 0.01

    for (const earnRate of card.earn_rates) {
      const category = earnRate.category
      const effectiveReturn = earnRate.earn_rate * pointValue
      const existing = categoryMap[category]

      if (!existing) {
        categoryMap[category] = {
          category,
          bestCard: card.name,
          issuer: card.issuer,
          earnRate: earnRate.earn_rate,
          pointCurrency: card.point_currency,
          effectiveReturn,
          notes: earnRate.notes,
          cardType: card.card_type ?? 'points',
          tiedCards: [],
        }
      } else if (effectiveReturn === existing.effectiveReturn) {
        const alreadyTied = existing.tiedCards.some(c => c.name === card.name)
        if (!alreadyTied && card.name !== existing.bestCard) {
          existing.tiedCards.push({ name: card.name, issuer: card.issuer })
        }
      } else if (effectiveReturn > existing.effectiveReturn) {
        categoryMap[category] = {
          category,
          bestCard: card.name,
          issuer: card.issuer,
          earnRate: earnRate.earn_rate,
          pointCurrency: card.point_currency,
          effectiveReturn,
          notes: earnRate.notes,
          cardType: card.card_type ?? 'points',
          tiedCards: [],
        }
      }
    }
  }

  return Object.values(categoryMap).sort((a, b) =>
    compareEarnRateCategories(a.category, b.category)
  )
}