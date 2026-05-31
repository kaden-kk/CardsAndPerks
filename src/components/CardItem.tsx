import { useState } from 'react'
import type { UserCard, Perk } from '../types/index'
import BenefitBadge from './BenefitBadge'

interface Props {
  userCard: UserCard
  onRemove: (userCardId: string) => void
}

const issuerColors: Record<string, string> = {
  'Chase': 'bg-blue-600',
  'American Express': 'bg-gray-800',
  'Capital One': 'bg-red-600',
  'Citi': 'bg-blue-800',
  'Discover': 'bg-orange-500',
  'Wells Fargo': 'bg-yellow-600',
}

const PERK_ICONS: Record<string, string> = {
  'purchase_protection': '🛡️',
  'extended_warranty': '🔧',
  'travel_protection': '✈️',
  'cell_phone': '📱',
  'rental_car': '🚗',
  'travel_assistance': '🆘',
  'credits': '💰',
  'lounge_access': '🛋️',
  'cashback_match': '💵',
}

function PerksSection({ perks }: { perks: Perk[] }) {
  const [expanded, setExpanded] = useState(false)

  const grouped = perks.reduce<Record<string, Perk[]>>((acc, perk) => {
    if (!acc[perk.category]) acc[perk.category] = []
    acc[perk.category]!.push(perk)
    return acc
  }, {})


  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Hidden perks</span>
          <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">
            {perks.length}
          </span>
        </div>
        <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-6 pb-4 space-y-4">
          {Object.entries(grouped).map(([category, categoryPerks]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span>{PERK_ICONS[category] ?? '✨'}</span>
                <p className="text-xs font-medium text-gray-400 tracking-wide capitalize">
                  {category.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="space-y-2">
                {categoryPerks.map(perk => (
                  <div key={perk.id} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800">{perk.title}</p>
                      {perk.value && (
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
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
      )}
    </div>
  )
}

export default function CardItem({ userCard, onRemove }: Props) {
  const { card } = userCard
  const color = issuerColors[card.issuer] ?? 'bg-gray-600'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Card header */}
      <div className={`${color} px-6 py-5`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{card.issuer}</p>
            <h3 className="text-white font-semibold text-lg mt-0.5">{card.name}</h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-white/80 text-sm">{card.point_currency}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 text-sm">
                {card.annual_fee === 0 ? 'No annual fee' : `$${card.annual_fee}/yr`}
              </span>
            </div>
          </div>
          <button
            onClick={() => onRemove(userCard.id)}
            className="text-white/50 hover:text-white/90 transition-colors text-xl leading-none"
            title="Remove card"
          >
            ×
          </button>
        </div>
      </div>

      {/* Earn rates */}
      <div className="px-6 py-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Earn rates</p>
        {card.benefits.map(benefit => (
          <BenefitBadge key={benefit.id} benefit={benefit} />
        ))}
      </div>

      {/* Perks dropdown */}
      {card.perks.length > 0 && <PerksSection perks={card.perks} />}

    </div>
  )
}