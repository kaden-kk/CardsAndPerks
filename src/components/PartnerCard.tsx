import { useState } from 'react'
import type { PartnerRecommendation } from '../lib/optimizer'

interface Props {
  recommendation: PartnerRecommendation
}

const issuerColors: Record<string, string> = {
  'Chase': 'border-blue-200 bg-blue-50',
  'American Express': 'border-gray-200 bg-gray-50',
  'Capital One': 'border-red-200 bg-red-50',
  'Citi': 'border-blue-200 bg-blue-50',
  'Discover': 'border-orange-200 bg-orange-50',
  'Wells Fargo': 'border-yellow-200 bg-yellow-50',
}

const issuerText: Record<string, string> = {
  'Chase': 'text-blue-700',
  'American Express': 'text-gray-700',
  'Capital One': 'text-red-700',
  'Citi': 'text-blue-800',
  'Discover': 'text-orange-700',
  'Wells Fargo': 'text-yellow-700',
}

export default function PartnerCard({ recommendation }: Props) {
  const [expanded, setExpanded] = useState(false)
  const colorClass = issuerColors[recommendation.issuer] ?? 'border-gray-200 bg-gray-50'
  const textClass = issuerText[recommendation.issuer] ?? 'text-gray-700'
  const icon = recommendation.partnerType === 'airline' ? '✈️' : '🏨'
  const topEarnRate = recommendation.earnRates[0]

  return (
    <div className={`rounded-xl border ${colorClass} overflow-hidden`}>

      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{recommendation.partnerName}</p>
              <p className={`text-xs font-medium mt-0.5 ${textClass}`}>{recommendation.bestCard}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500">Transfer ratio</p>
            <p className="text-sm font-semibold text-gray-900">
              1:{recommendation.transferRatio.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Best earn rate */}
        {topEarnRate && (
          <div className="mt-3 flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-600 capitalize">Best via: {topEarnRate.category}</p>
            <p className="text-xs font-semibold text-gray-900">
              {topEarnRate.earnRate}x → {(topEarnRate.effectiveReturn * 100).toFixed(2)}% back
            </p>
          </div>
        )}

        {/* Cash back warning */}
        {recommendation.cashBackWarning && (
          <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <span className="text-amber-500 text-xs mt-0.5">⚠️</span>
            <p className="text-xs text-amber-700">
              Cash back gives {recommendation.cashBackValue?.toFixed(2)}cpp — transferring to this partner is worth more.
            </p>
          </div>
        )}
      </div>

      {/* Expandable earn rates */}
      {recommendation.earnRates.length > 1 && (
        <div className="border-t border-black/5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2.5 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-between transition-colors"
          >
            <span>All earn rates for this partner</span>
            <span>{expanded ? '▲' : '▼'}</span>
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-1.5">
              {recommendation.earnRates.map(rate => (
                <div
                  key={rate.category}
                  className="flex items-center justify-between py-1 border-b border-black/5 last:border-0"
                >
                  <span className="text-xs text-gray-600 capitalize">{rate.category}</span>
                  <span className="text-xs font-medium text-gray-900">
                    {rate.earnRate}x · {(rate.effectiveReturn * 100).toFixed(2)}% back
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}