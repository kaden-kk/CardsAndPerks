import type { Benefit } from '../types/index'

interface Props {
  benefit: Benefit
  cardType?: 'cashback' | 'points'
}

export default function BenefitBadge({ benefit, cardType = 'points' }: Props) {
  const rateDisplay = cardType === 'cashback'
    ? `${benefit.earn_rate}%`
    : `${benefit.earn_rate}x`

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600 capitalize">{benefit.category}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">{rateDisplay}</span>
        {benefit.cap && (
          <span className="text-xs text-gray-400">
            up to ${benefit.cap.toLocaleString()}/{benefit.cap_period}
          </span>
        )}
      </div>
    </div>
  )
}