import type { UserCard, Redemption } from '../types/index'

export interface OptimizedCategory {
  category: string
  bestCard: string
  issuer: string
  earnRate: number
  pointCurrency: string
  effectiveReturn: number
  notes: string | null
}

export interface PartnerRecommendation {
  partnerName: string
  partnerType: 'airline' | 'hotel'
  bestCard: string
  issuer: string
  pointCurrency: string
  transferRatio: number
  earnRates: {
    category: string
    earnRate: number
    effectiveReturn: number
  }[]
  cashBackValue: number | null
  cashBackWarning: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  'dining': 'Dining',
  'groceries': 'Groceries',
  'travel': 'Travel',
  'flights': 'Flights',
  'hotels': 'Hotels',
  'car rentals': 'Car rentals',
  'streaming': 'Streaming',
  'drugstores': 'Drugstores',
  'gas': 'Gas',
  'rent': 'Rent',
  'rotating': 'Rotating categories',
  'everything else': 'Everything else',
}

export function optimizeCards(userCards: UserCard[]): OptimizedCategory[] {
  const categoryMap: Record<string, OptimizedCategory> = {}

  for (const userCard of userCards) {
    const { card } = userCard
    const pointValue = card.point_currency_value ?? 0.01

    for (const benefit of card.benefits) {
      const category = benefit.category
      if (category === 'cash back') continue

      const effectiveReturn = benefit.earn_rate * pointValue

      if (
        !categoryMap[category] ||
        effectiveReturn > categoryMap[category].effectiveReturn
      ) {
        categoryMap[category] = {
          category,
          bestCard: card.name,
          issuer: card.issuer,
          earnRate: benefit.earn_rate,
          pointCurrency: card.point_currency,
          effectiveReturn,
          notes: benefit.notes,
        }
      }
    }
  }

  const order = Object.keys(CATEGORY_LABELS)
  return Object.values(categoryMap).sort((a, b) => {
    const ai = order.indexOf(a.category)
    const bi = order.indexOf(b.category)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}