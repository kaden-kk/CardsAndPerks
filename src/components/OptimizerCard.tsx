import type { OptimizedCategory } from '../lib/optimizer'
import { getEarnRateIcon, getEarnRateLabel } from '../constants/categories'

interface Props {
  result: OptimizedCategory
  groupColor?: string
}

const issuerText: Record<string, string> = {
  'Chase': 'text-blue-700',
  'American Express': 'text-yellow-700',
  'Capital One': 'text-red-700',
  'Citi': 'text-blue-800',
  'Discover': 'text-orange-700',
  'Bilt': 'text-gray-700',
}

export default function OptimizerCard({ result, groupColor = 'bg-gray-50' }: Props) {
  const textClass = issuerText[result.issuer] ?? 'text-gray-700'
  const icon = getEarnRateIcon(result.category, 16)
  const displayName = getEarnRateLabel(result.category)
  const rateDisplay = result.cardType === 'cashback'
    ? `${result.earnRate}%`
    : `${result.earnRate}x`

  return (
    <div className={`rounded-xl border border-gray-100 p-4 ${groupColor}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="text-gray-500 flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className={`text-xs font-medium mt-0.5 truncate ${textClass}`}>
              {result.bestCard}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-gray-900">{rateDisplay}</p>
        </div>
      </div>

      {result.notes && (
        <p className="text-xs text-gray-400 mt-2 leading-tight">{result.notes}</p>
      )}

      {result.tiedCards.length > 0 && (
        <div className="mt-2 pt-2 border-t border-black/5">
          <p className="text-xs text-gray-400 leading-relaxed">
            Also: {result.tiedCards.map(c => c.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
