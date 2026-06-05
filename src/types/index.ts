export interface Card {
  id: string
  name: string
  issuer: string
  network: string
  annual_fee: number
  point_currency: string
  point_currency_value: number
  card_type: 'cashback' | 'points'
  created_at: string
}

export interface Benefit {
  id: string
  card_id: string
  category: string
  earn_rate: number
  cap: number | null
  cap_period: string | null
  notes: string | null
}

export interface Redemption {
  id: string
  card_id: string
  redemption_type: 'transfer' | 'cash' | 'travel_portal'
  partner_name: string | null
  partner_type: 'airline' | 'hotel' | 'cash' | 'travel_portal' | null
  value: number
  notes: string | null
}

export interface Perk {
  id: string
  card_id: string
  category: string
  title: string
  description: string
  value: string | null
}

export interface UserCard {
  id: string
  user_id: string
  card_id: string
  added_at: string
  card: Card & {
    benefits: Benefit[]
    redemptions: Redemption[]
    perks: Perk[]
  }
}