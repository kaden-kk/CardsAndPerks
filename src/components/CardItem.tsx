import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import type { UserCard, Card, CardProtection } from '../types/index'
import {
  getEarnRateIcon,
  getEarnRateLabel,
  getPerkIcon,
  getPerkLabel,
  getProtectionIcon,
  getProtectionLabel,
} from '../constants/categories'
import { ISSUER_COLORS } from '../constants/issuers'

interface Props {
  userCard: UserCard
  onRemove: (userCardId: string) => void
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
            <p className="text-xs text-gray-500 mt-0.5">{totalCount} benefits</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          {Object.entries(perkGroups).map(([category, perks]) => (
            <div key={`perk-${category}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400">{getPerkIcon(category)}</span>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {getPerkLabel(category)}
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
                <span className="text-gray-400">{getProtectionIcon(category)}</span>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {getProtectionLabel(category)}
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
  const color = ISSUER_COLORS[card.issuer] ?? 'bg-gray-600'
  const [showDetails, setShowDetails] = useState(false)

  type BenefitPreview = {
    id: string
    name: string
    displayValue: string | null
    icon: React.ReactNode
  }

  const perkPreviews: BenefitPreview[] = card.card_perks.map(cp => ({
    id: cp.id,
    name: cp.perk.name,
    displayValue: cp.value,
    icon: getPerkIcon(cp.perk.category),
  }))

  const protectionPreviews: BenefitPreview[] = card.card_protections.map(cp => ({
    id: cp.id,
    name: cp.protection.name,
    displayValue: cp.coverage_amount,
    icon: getProtectionIcon(cp.protection.category),
  }))

  const topBenefits = [...perkPreviews, ...protectionPreviews].slice(0, 4)
  const totalBenefits = card.card_perks.length + card.card_protections.length

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className={`${color} px-5 py-4`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">{card.issuer}</p>
              <h3 className="text-white font-semibold text-base mt-0.5">{card.name}</h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-white/70 text-xs">{card.point_currency}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/70 text-xs">
                  {card.annual_fee === 0 ? 'No annual fee' : `$${card.annual_fee}/yr`}
                </span>
                {card.foreign_transaction_fee > 0 && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-xs text-amber-200 font-medium">
                      {card.foreign_transaction_fee}% Foreign Fee
                    </span>
                  </>
                )}
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
                    <span className="flex-shrink-0">{getEarnRateIcon(earnRate.category)}</span>
                    <span className="text-xs text-gray-600 truncate">
                      {getEarnRateLabel(earnRate.category)}
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
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Benefits</p>
            {totalBenefits === 0 ? (
              <p className="text-xs text-gray-400">No benefits data</p>
            ) : (
              <>
                <div className="space-y-1.5">
                  {topBenefits.map(b => (
                    <div key={b.id} className="flex items-start gap-1.5">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">{b.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 leading-tight">{b.name}</p>
                        {b.displayValue && (
                          <p className="text-xs font-medium text-green-700 mt-0.5">{b.displayValue}</p>
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
                    <span>All {totalBenefits} benefits</span>
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