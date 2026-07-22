import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle, Car, Coffee, CreditCard, DollarSign, Fuel, Globe, Home,
  Hotel, Moon, Pill, Plane, RefreshCw, Shield, ShoppingCart, Smartphone,
  Sparkles, Train, Tv, Utensils, Wrench,
} from 'lucide-react'

interface CategoryConfig {
  label: string
  icon: LucideIcon
}

function icon(Icon: LucideIcon, size: number) {
  return <Icon size={size} />
}

export const EARN_RATE_CATEGORIES: Record<string, CategoryConfig> = {
  'dining': { label: 'Dining', icon: Utensils },
  'groceries': { label: 'Groceries', icon: ShoppingCart },
  'travel': { label: 'Travel', icon: Plane },
  'flights': { label: 'Flights', icon: Plane },
  'hotels': { label: 'Hotels', icon: Hotel },
  'car rentals': { label: 'Car Rentals', icon: Car },
  'streaming': { label: 'Streaming', icon: Tv },
  'drugstores': { label: 'Drugstores', icon: Pill },
  'gas': { label: 'Gas', icon: Fuel },
  'rent': { label: 'Rent', icon: Home },
  'rotating': { label: 'Rotating Categories', icon: RefreshCw },
  'everything else': { label: 'Everything Else', icon: CreditCard },
  'entertainment': { label: 'Entertainment', icon: Tv },
  'transit': { label: 'Transit', icon: Train },
  'self-select': { label: 'Self-Select', icon: Sparkles },
  'citi nights dining': { label: 'Citi Nights Dining', icon: Moon },
  'chase travel portal': { label: 'Chase Travel', icon: Plane },
  'chase travel portal - flights': { label: 'Chase Flights', icon: Plane },
  'chase travel portal - hotels': { label: 'Chase Hotels', icon: Hotel },
  'capital one travel portal - flights': { label: 'Capital One Flights', icon: Plane },
  'capital one travel portal - hotels': { label: 'Capital One Hotels', icon: Hotel },
  'capital one travel portal - car rentals': { label: 'Capital One Car Rentals', icon: Car },
  'capital one entertainment': { label: 'Capital One Entertainment', icon: Tv },
  'amex travel portal - flights': { label: 'Amex Flights', icon: Plane },
  'amex travel portal - hotels': { label: 'Amex Hotels', icon: Hotel },
  'amex travel portal - car rentals': { label: 'Amex Car Rentals', icon: Car },
  'citi travel portal': { label: 'Citi Travel', icon: Plane },
  'citi travel portal - flights': { label: 'Citi Flights', icon: Plane },
  'apple purchases': { label: 'Apple Purchases', icon: Smartphone },
  'select partners': { label: 'Select Partners', icon: Sparkles },
  'apple pay': { label: 'Apple Pay', icon: Smartphone },
}

export const EARN_RATE_CATEGORY_ORDER = Object.keys(EARN_RATE_CATEGORIES)

export const PERK_CATEGORIES: Record<string, CategoryConfig> = {
  'credits': { label: 'Credits', icon: DollarSign },
  'lounge_access': { label: 'Lounge Access', icon: Coffee },
  'cashback_match': { label: 'Cashback Match', icon: CreditCard },
  'foreign_transaction': { label: 'Foreign Transaction', icon: Globe },
}

export const PROTECTION_CATEGORIES: Record<string, CategoryConfig> = {
  'purchase_protection': { label: 'Purchase Protection', icon: Shield },
  'extended_warranty': { label: 'Extended Warranty', icon: Wrench },
  'travel_protection': { label: 'Travel Protection', icon: Plane },
  'cell_phone': { label: 'Cell Phone', icon: Smartphone },
  'rental_car': { label: 'Rental Car', icon: Car },
  'travel_assistance': { label: 'Travel Assistance', icon: AlertCircle },
}

export const CATEGORY_GROUPS: Record<string, string[]> = {
  'Everyday': ['dining', 'groceries', 'gas', 'transit', 'self-select', 'apple purchases', 'select partners', 'apple pay', 'everything else'],
  'Travel': ['flights', 'hotels', 'car rentals', 'travel', 'chase travel portal', 'chase travel portal - flights', 'chase travel portal - hotels', 'capital one travel portal - flights', 'capital one travel portal - hotels', 'capital one travel portal - car rentals', 'amex travel portal - flights', 'amex travel portal - hotels', 'amex travel portal - car rentals', 'citi travel portal', 'citi travel portal - flights'],
  'Lifestyle': ['streaming', 'drugstores', 'rent', 'rotating', 'entertainment', 'capital one entertainment', 'citi nights dining'],
}

export const GROUP_COLORS: Record<string, string> = {
  'Everyday': 'bg-green-50', 'Travel': 'bg-blue-50', 'Lifestyle': 'bg-amber-50',
}

export const GROUP_ICON_COLORS: Record<string, string> = {
  'Everyday': 'text-green-600', 'Travel': 'text-blue-600', 'Lifestyle': 'text-amber-600',
}


export function getEarnRateLabel(category: string): string {
  return EARN_RATE_CATEGORIES[category]?.label ?? category
}

export function getEarnRateIcon(category: string, size = 14) {
  const Icon = EARN_RATE_CATEGORIES[category]?.icon ?? CreditCard
  return icon(Icon, size)
}

export function getPerkLabel(category: string): string {
  return PERK_CATEGORIES[category]?.label ?? category.replace(/_/g, ' ')
}

export function getPerkIcon(category: string, size = 14) {
  const Icon = PERK_CATEGORIES[category]?.icon ?? CreditCard
  return icon(Icon, size)
}

export function getProtectionLabel(category: string): string {
  return PROTECTION_CATEGORIES[category]?.label ?? category.replace(/_/g, ' ')
}

export function getProtectionIcon(category: string, size = 14) {
  const Icon = PROTECTION_CATEGORIES[category]?.icon ?? Shield
  return icon(Icon, size)
}

export function compareEarnRateCategories(a: string, b: string): number {
  const ai = EARN_RATE_CATEGORY_ORDER.indexOf(a)
  const bi = EARN_RATE_CATEGORY_ORDER.indexOf(b)
  if (ai === -1 && bi === -1) return 0
  if (ai === -1) return 1
  if (bi === -1) return -1
  return ai - bi
}

export function groupEarnRateResults<T extends { category: string; effectiveReturn: number }>(results: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {}
  const used = new Set<string>()
  for (const [group, categories] of Object.entries(CATEGORY_GROUPS)) {
    const matches = results.filter(r => categories.includes(r.category)).sort((a, b) => b.effectiveReturn - a.effectiveReturn)
    if (matches.length > 0) { grouped[group] = matches; matches.forEach(m => used.add(m.category)) }
  }
  const uncategorized = results.filter(r => !used.has(r.category)).sort((a, b) => b.effectiveReturn - a.effectiveReturn)
  if (uncategorized.length > 0) grouped['Other'] = uncategorized
  return grouped
}
