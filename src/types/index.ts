export interface Card {
  id: string
  name: string
  issuer: string
  network: string
  annual_fee: number
  point_currency: string
  point_currency_value: number
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

export interface TransferPartner {
  id: string
  card_id: string
  partner_name: string
  partner_type: 'airline' | 'hotel'
  transfer_ratio: number
  transfer_time: string
  notes: string | null
}

export interface UserCard {
  id: string
  user_id: string
  card_id: string
  added_at: string
  card: Card & {
    benefits: Benefit[]
    transfer_partners: TransferPartner[]
  }
}