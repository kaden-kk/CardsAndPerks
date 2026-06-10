import type { EarnRate } from '../types/index'

interface Props {
  earnRate: EarnRate
  cardType?: 'cashback' | 'points'
}

export default function BenefitBadge({ earnRate, cardType = 'points' }: Props) {
  const rateDisplay = cardType === 'cashback'
    ? `${earnRate.earn_rate}%`
    : `${earnRate.earn_rate}x`

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600 capitalize">{earnRate.category}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">{rateDisplay}</span>
        {earnRate.cap && (
          <span className="text-xs text-gray-400">
            up to ${earnRate.cap.toLocaleString()}/{earnRate.cap_period}
          </span>
        )}
      </div>
    </div>
  )
}