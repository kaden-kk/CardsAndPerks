import type { UserCard } from '../types/index'

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

const CATEGORY_LABELS: Record<string, string> = {
  'dining': 'Dining',
  'groceries': 'Groceries',
  'travel': 'Travel',
  'chase travel portal': 'Chase Travel Portal',
  'chase travel portal - flights': 'Chase Portal Flights',
  'chase travel portal - hotels': 'Chase Portal Hotels',
  'capital one travel portal - flights': 'Capital One Portal Flights',
  'capital one travel portal - hotels': 'Capital One Portal Hotels',
  'capital one travel portal - car rentals': 'Capital One Portal Car Rentals',
  'capital one entertainment': 'Capital One Entertainment',
  'amex travel portal - flights': 'Amex Portal Flights',
  'amex travel portal - hotels': 'Amex Portal Hotels',
  'amex travel portal - car rentals': 'Amex Portal Car Rentals',
  'citi travel portal': 'Citi Travel Portal',
  'citi travel portal - flights': 'Citi Portal Flights',
  'transit': 'Transit',
  'self-select': 'Self-Select',
  'dining (citi nights)': 'Dining (Citi Nights)',
  'flights': 'Flights',
  'hotels': 'Hotels',
  'car rentals': 'Car Rentals',
  'streaming': 'Streaming',
  'drugstores': 'Drugstores',
  'gas': 'Gas',
  'rent': 'Rent',
  'entertainment': 'Entertainment',
  'rotating': 'Rotating Categories',
  'everything else': 'Everything Else',
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
      const existing = categoryMap[category]

      if (!existing) {
        categoryMap[category] = {
          category,
          bestCard: card.name,
          issuer: card.issuer,
          earnRate: benefit.earn_rate,
          pointCurrency: card.point_currency,
          effectiveReturn,
          notes: benefit.notes,
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
          earnRate: benefit.earn_rate,
          pointCurrency: card.point_currency,
          effectiveReturn,
          notes: benefit.notes,
          cardType: card.card_type ?? 'points',
          tiedCards: [],
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