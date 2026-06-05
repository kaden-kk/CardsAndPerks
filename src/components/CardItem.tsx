import { useState } from 'react'
import {
  Shield, Wrench, Plane, Smartphone, Car, AlertCircle,
  DollarSign, Coffee, CreditCard, ChevronDown,
  Utensils, ShoppingCart, Hotel, Tv, Pill, Fuel, Home, RefreshCw, X, Globe,
} from 'lucide-react'
import type { UserCard, Perk } from '../types/index'

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
  'purchase_protection': <Shield size={14} />,
  'extended_warranty': <Wrench size={14} />,
  'travel_protection': <Plane size={14} />,
  'cell_phone': <Smartphone size={14} />,
  'rental_car': <Car size={14} />,
  'travel_assistance': <AlertCircle size={14} />,
  'credits': <DollarSign size={14} />,
  'lounge_access': <Coffee size={14} />,
  'cashback_match': <CreditCard size={14} />,
  'foreign_transaction': <Globe size={14} />,
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
}

interface PerkModalProps {
  perks: Perk[]
  cardName: string
  onClose: () => void
}

function PerkModal({ perks, cardName, onClose }: PerkModalProps) {
  const grouped = perks.reduce<Record<string, Perk[]>>((acc, perk) => {
    if (!acc[perk.category]) acc[perk.category] = []
    acc[perk.category]!.push(perk)
    return acc
  }, {})

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
            <h2 className="text-base font-semibold text-gray-900">{cardName}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{perks.length} hidden perks</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          {Object.entries(grouped).map(([category, categoryPerks]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400">
                  {PERK_ICONS[category] ?? <CreditCard size={14} />}
                </span>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {category.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="space-y-2">
                {categoryPerks.map(perk => (
                  <div key={perk.id} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800">{perk.title}</p>
                      {perk.value && (
                        <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          {perk.value}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{perk.description}</p>
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
  const [showPerks, setShowPerks] = useState(false)

  const topPerks = card.perks
    .filter(p => p.value)
    .slice(0, 4)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

       {/* Header */}
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
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                card.card_type === 'cashback'
                  ? 'bg-green-500/20 text-green-200'
                  : 'bg-blue-400/20 text-blue-200'
              }`}>
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

        {/* Two column body */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">

          {/* Earn rates */}
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Earn rates</p>
            <div className="space-y-1.5">
              {card.benefits.map(benefit => (
                <div key={benefit.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-gray-500 min-w-0">
                    <div className="flex items-center gap-1.5 text-gray-500 min-w-0">
                    <span className="flex-shrink-0">
                      {CATEGORY_ICONS[benefit.category] ?? <CreditCard size={14} />}
                    </span>
                    <span className="text-xs text-gray-600 truncate capitalize">
                      {CATEGORY_DISPLAY[benefit.category] ?? benefit.category}
                    </span>
                  </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
                    {card.card_type === 'cashback'
                      ? `${benefit.earn_rate}%`
                      : `${benefit.earn_rate}x`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Perks */}
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Perks</p>
            {card.perks.length === 0 ? (
              <p className="text-xs text-gray-400">No perks data</p>
            ) : (
              <>
                <div className="space-y-1.5">
                  {topPerks.map(perk => (
                    <div key={perk.id} className="flex items-start gap-1.5">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">
                        {PERK_ICONS[perk.category] ?? <CreditCard size={14} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 leading-tight">{perk.title}</p>
                        {perk.value && (
                          <p className="text-xs font-medium text-green-700 mt-0.5">{perk.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {card.perks.length > 0 && (
                  <button
                    onClick={() => setShowPerks(true)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>All {card.perks.length} perks</span>
                    <ChevronDown size={12} />
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      {showPerks && (
        <PerkModal
          perks={card.perks}
          cardName={card.name}
          onClose={() => setShowPerks(false)}
        />
      )}
    </>
  )
}