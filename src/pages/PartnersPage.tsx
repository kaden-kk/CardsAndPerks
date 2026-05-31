import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'
import type { Redemption } from '../types/index'

interface EcosystemGroup {
  issuer: string
  pointCurrency: string
  airlines: Redemption[]
  hotels: Redemption[]
}

const issuerColors: Record<string, string> = {
  'Chase': 'bg-blue-600',
  'American Express': 'bg-gray-800',
  'Capital One': 'bg-red-600',
  'Citi': 'bg-blue-800',
}

function formatRatio(value: number): string {
  if (value === 1) return '1:1'
  if (value === 2) return '1:2'
  return `1:${value.toFixed(2).replace(/\.?0+$/, '')}`
}

function getRatioColor(value: number): string {
  if (value >= 1.5) return 'text-green-600'
  if (value < 1) return 'text-red-500'
  return 'text-gray-400'
}

export default function PartnersPage() {
  const { user } = useAuth()
  const { userCards, loading } = useUserCards(user?.id ?? '')

  const ecosystems = userCards.reduce<Record<string, EcosystemGroup>>((acc, userCard) => {
    const { card } = userCard
    const transfers = card.redemptions.filter(r => r.redemption_type === 'transfer')
    if (transfers.length === 0) return acc

    if (!acc[card.point_currency]) {
      acc[card.point_currency] = {
        issuer: card.issuer,
        pointCurrency: card.point_currency,
        airlines: [],
        hotels: [],
      }
    }

    for (const t of transfers) {
      if (!t.partner_name || !t.partner_type) continue
      const ecosystem = acc[card.point_currency]
      if (!ecosystem) continue

      if (t.partner_type === 'airline' && !ecosystem.airlines.find(a => a.partner_name === t.partner_name)) {
        ecosystem.airlines.push(t)
      }
      if (t.partner_type === 'hotel' && !ecosystem.hotels.find(h => h.partner_name === t.partner_name)) {
        ecosystem.hotels.push(t)
      }
    }

    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Transfer partners</h1>
          <p className="text-gray-500 text-sm mt-1">
            All transfer partners grouped by your points ecosystem
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        )}

        {!loading && Object.keys(ecosystems).length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-sm">None of your cards have transfer partners.</p>
          </div>
        )}

        <div className="space-y-6">
          {Object.values(ecosystems).map(ecosystem => {
            const color = issuerColors[ecosystem.issuer] ?? 'bg-gray-600'

            return (
              <div key={ecosystem.pointCurrency} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className={`${color} px-6 py-4`}>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{ecosystem.issuer}</p>
                  <h2 className="text-white font-semibold text-lg mt-0.5">{ecosystem.pointCurrency}</h2>
                  <p className="text-white/60 text-xs mt-1">
                    {ecosystem.airlines.length} airline{ecosystem.airlines.length !== 1 ? 's' : ''} · {ecosystem.hotels.length} hotel{ecosystem.hotels.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                  {ecosystem.airlines.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                        ✈️ Airlines
                      </p>
                      <div className="space-y-1">
                        {ecosystem.airlines
                          .sort((a, b) => (a.partner_name ?? '').localeCompare(b.partner_name ?? ''))
                          .map(partner => (
                            <div key={partner.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700 flex-1">{partner.partner_name}</span>
                              <span className={`text-xs font-medium ${getRatioColor(partner.value)}`}>
                                {formatRatio(partner.value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {ecosystem.hotels.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                        🏨 Hotels
                      </p>
                      <div className="space-y-1">
                        {ecosystem.hotels
                          .sort((a, b) => (a.partner_name ?? '').localeCompare(b.partner_name ?? ''))
                          .map(partner => (
                            <div key={partner.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700 flex-1">{partner.partner_name}</span>
                              <span className={`text-xs font-medium ${getRatioColor(partner.value)}`}>
                                {formatRatio(partner.value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}