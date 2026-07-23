export interface ProtectionDefinition {
  id: string
  name: string
  category: string
  description: string
}

export interface CardProtection {
  id: string
  protection: ProtectionDefinition
  coverage_amount: string | null
  notes: string | null
  source: string | null
  verified_at: string | null
}

export interface PerkDefinition {
  id: string
  name: string
  category: string
  description: string
}

export interface CardPerk {
  id: string
  perk: PerkDefinition
  value: string | null
  notes: string | null
}

export interface TransferPartner {
  id: string
  name: string
  type: 'airline' | 'hotel'
  alliance: string | null
}

export interface CardTransferPartner {
  id: string
  partner: TransferPartner
  ratio: number
  notes: string | null
}

export interface EarnRate {
  id: string
  category: string
  earn_rate: number
  cap: number | null
  cap_period: string | null
  notes: string | null
}

export interface RedemptionValue {
  id: string
  redemption_type: string
  cpp: number
  notes: string | null
}

export interface Card {
  id: string
  name: string
  issuer: string
  network: string
  annual_fee: number
  foreign_transaction_fee: number   // ← new
  point_currency: string
  point_currency_value: number
  card_type: 'cashback' | 'points'
  earn_rates: EarnRate[]
  card_perks: CardPerk[]
  card_protections: CardProtection[]
  card_transfer_partners: CardTransferPartner[]
}

export interface UserCard {
  id: string
  card_id: string
  added_at: string
  card: Card
}