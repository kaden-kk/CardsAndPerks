import { useState } from 'react'
import {
  Shield, Wrench, Plane, Smartphone, Car, AlertCircle,
  DollarSign, Coffee, CreditCard, ChevronDown,
  Utensils, ShoppingCart, Hotel, Tv, Pill, Fuel, Home, RefreshCw, X, Globe,
  Moon, Sparkles, Train
} from 'lucide-react'
import type { UserCard, Card, CardPerk, CardProtection } from '../types/index'

interface Props {
  userCard: UserCard
  onRemove: (userCardId: string) => void
}

const issuerColors: Record<string, string> = {
  'Chase': 'bg-blue-600',
  'American Express': 'bg-yellow-600',
  'Capital One': 'bg-red-600',
  'Citi': 'bg-blue-800',
  'Discover': 'bg-orange-500',
  'Bilt': 'bg-gray-950',
}

const PERK_ICONS: Record<string, React.ReactNode> = {
  'credits': <DollarSign size={14} />,
  'lounge_access': <Coffee size={14} />,
  'cashback_match': <CreditCard size={14} />,
  'foreign_transaction': <Globe size={14} />,
}

const PROTECTION_ICONS: Record<string, React.ReactNode> = {
  'purchase_protection': <Shield size={14} />,
  'extended_warranty': <Wrench size={14} />,
  'travel_protection': <Plane size={14} />,
  'cell_phone': <Smartphone size={14} />,
  'rental_car': <Car size={14} />,
  'travel_assistance': <AlertCircle size={14} />,
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'dining': <Utensils size={14} />,
  'groceries': <ShoppingCart size={14} />,
  'travel': <Plane size={14} />,
  'flights': <Plane size={14} />,
  'hotels': <Hotel size={14} />,
  'car rentals': <Car size={14} />,
  'streaming': <Tv size={14} />,
  'drugstores': <Pill size={14} />,
  'gas': <Fuel size={14} />,
  'rent': <Home size={14} />,
  'rotating': <RefreshCw size={14} />,
  'everything else': <CreditCard size={14} />,
  'entertainment': <Tv size={14} />,
  'transit': <Train size={14} />,
  'self-select': <Sparkles size={14} />,
  'dining (citi nights)': <Moon size={14} />,
  'citi travel portal - flights': <Plane size={14} />,
}

const CATEGORY_DISPLAY: Record<string, string> = {
  'dining': 'Dining',
  'entertainment': 'Entertainment',
  'groceries': 'Groceries',
  'travel': 'Travel',
  'flights': 'Flights',
  'hotels': 'Hotels',
  'car rentals': 'Car Rentals',
  'streaming': 'Streaming',
  'drugstores': 'Drugstores',
  'gas': 'Gas',
  'rent': 'Rent',
  'rotating': 'Rotating',
  'everything else': 'Everything Else',
  'chase travel portal': 'Chase Travel',
  'chase travel portal - flights': 'Chase Flights',
  'chase travel portal - hotels': 'Chase Hotels',
  'capital one travel portal - flights': 'Capital One Flights',
  'capital one travel portal - hotels': 'Capital One Hotels',
  'capital one travel portal - car rentals': 'Capital One Car Rentals',
  'capital one entertainment': 'Capital One Entertainment',
  'amex travel portal - flights': 'Amex Flights',
  'amex travel portal - hotels': 'Amex Hotels',
  'amex travel portal - car rentals': 'Amex Car Rentals',
  'citi travel portal': 'Citi Travel',
  'transit': 'Transit',
  'self-select': 'Self-Select',
  'dining (citi nights)': 'Dining (Nights)',
  'citi travel portal - flights': 'Citi Flights',
}

function groupByCategory<T>(
  items: T[],
  getCategory: (item: T) => string
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const cat = getCategory(item)
    if (!acc[cat]) acc[cat] = []
    acc[cat]!.push(item)
    return acc
  }, {})
}

function CardDetailsModal({ card, onClose }: { card: Card; onClose: () => void }) {
  const perkGroups = groupByCategory(card.card_perks, cp => cp.perk.category)
  const protectionGroups = groupByCategory(card.card_protections, cp => cp.protection.category)
  const totalCount = card.card_perks.length + card.card_protections.length

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{card.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{totalCount} perks & protections</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          {Object.entries(perkGroups).map(([category, perks]) => (
            <div key={`perk-${category}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400">
                  {PERK_ICONS[category] ?? <CreditCard size={14} />}
                </span>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {category.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="space-y-2">
                {perks.map(cp => (
                  <div key={cp.id} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800">{cp.perk.name}</p>
                      {cp.value && (
                        <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          {cp.value}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{cp.perk.description}</p>
                    {cp.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">{cp.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.entries(protectionGroups).map(([category, protections]) => (
            <div key={`protection-${category}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400">
                  {PROTECTION_ICONS[category] ?? <Shield size={14} />}
                </span>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {category.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="space-y-2">
                {protections.map((cp: CardProtection) => (
                  <div key={cp.id} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800">{cp.protection.name}</p>
                      {cp.coverage_amount && (
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          {cp.coverage_amount}
                        </span>
                      )}
                    </div>
                    {cp.protection.description && (
                      <p className="text-xs text-gray-500 mt-1">{cp.protection.description}</p>
                    )}
                    {cp.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">{cp.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CardItem({ userCard, onRemove }: Props) {
  const { card } = userCard
  const color = issuerColors[card.issuer] ?? 'bg-gray-600'
  const [showDetails, setShowDetails] = useState(false)

  const topPerks = card.card_perks
    .filter(p => p.value)
    .slice(0, 4)

  const totalBenefits = card.card_perks.length + card.card_protections.length

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className={`${color} px-5 py-4`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">{card.issuer}</p>
              <h3 className="text-white font-semibold text-base mt-0.5">{card.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/70 text-xs">{card.point_currency}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/70 text-xs">
                  {card.annual_fee === 0 ? 'No annual fee' : `$${card.annual_fee}/yr`}
                </span>
                <span className="text-white/30">·</span>
                <span className={`text-xs text-white/70 font-medium`}>
                  {card.card_type === 'cashback' ? 'Cash back' : 'Points'}
                </span>
              </div>
            </div>
            <button
              onClick={() => onRemove(userCard.id)}
              className="text-white/40 hover:text-white/80 transition-colors"
              title="Remove card"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Earn rates</p>
            <div className="space-y-1.5">
              {card.earn_rates.map(earnRate => (
                <div key={earnRate.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-gray-500 min-w-0">
                    <span className="flex-shrink-0">
                      {CATEGORY_ICONS[earnRate.category] ?? <CreditCard size={14} />}
                    </span>
                    <span className="text-xs text-gray-600 truncate capitalize">
                      {CATEGORY_DISPLAY[earnRate.category] ?? earnRate.category}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
                    {card.card_type === 'cashback'
                      ? `${earnRate.earn_rate}%`
                      : `${earnRate.earn_rate}x`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Perks</p>
            {totalBenefits === 0 ? (
              <p className="text-xs text-gray-400">No perks data</p>
            ) : (
              <>
                <div className="space-y-1.5">
                  {topPerks.map(cp => (
                    <div key={cp.id} className="flex items-start gap-1.5">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">
                        {PERK_ICONS[cp.perk.category] ?? <CreditCard size={14} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 leading-tight">{cp.perk.name}</p>
                        {cp.value && (
                          <p className="text-xs font-medium text-green-700 mt-0.5">{cp.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {totalBenefits > 0 && (
                  <button
                    onClick={() => setShowDetails(true)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>All {totalBenefits} perks & protections</span>
                    <ChevronDown size={12} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <CardDetailsModal
          card={card}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  )
}
