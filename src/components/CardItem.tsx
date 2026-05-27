import type { UserCard, Redemption } from '../types/index'
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

function RedemptionSection({ redemptions }: { redemptions: Redemption[] }) {
  const airlines = redemptions.filter(r => r.partner_type === 'airline')
  const hotels = redemptions.filter(r => r.partner_type === 'hotel')
  const portal = redemptions.filter(r => r.redemption_type === 'travel_portal')
  const cash = redemptions.filter(r => r.redemption_type === 'cash')

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Redemptions</p>

      {portal.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Travel portal</p>
          <div className="flex flex-wrap gap-1.5">
            {portal.map(r => (
              <span key={r.id} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                {r.partner_name} · {(r.value * 100).toFixed(2)}cpp
              </span>
            ))}
          </div>
        </div>
      )}

      {airlines.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Airlines</p>
          <div className="flex flex-wrap gap-1.5">
            {airlines.map(r => (
              <span key={r.id} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                {r.partner_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {hotels.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Hotels</p>
          <div className="flex flex-wrap gap-1.5">
            {hotels.map(r => (
              <span key={r.id} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                {r.partner_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {cash.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Cash back</p>
          <div className="flex flex-wrap gap-1.5">
            {cash.map(r => (
              <span key={r.id} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                {(r.value * 100).toFixed(2)}cpp
              </span>
            ))}
          </div>
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

      <div className="px-6 py-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Earn rates</p>
        {card.benefits.map(benefit => (
          <BenefitBadge key={benefit.id} benefit={benefit} />
        ))}
      </div>

      {card.redemptions.length > 0 && (
        <RedemptionSection redemptions={card.redemptions} />
      )}

    </div>
  )
}