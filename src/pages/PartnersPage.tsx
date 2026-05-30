import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'

interface EcosystemGroup {
  issuer: string
  pointCurrency: string
  airlines: string[]
  hotels: string[]
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

        if (t.partner_type === 'airline' && !ecosystem.airlines.includes(t.partner_name)) {
            ecosystem.airlines.push(t.partner_name)
        }
        if (t.partner_type === 'hotel' && !ecosystem.hotels.includes(t.partner_name)) {
            ecosystem.hotels.push(t.partner_name)
        }
    }

    return acc
  }, {})

  const issuerColors: Record<string, string> = {
    'Chase': 'bg-blue-600',
    'American Express': 'bg-gray-800',
    'Capital One': 'bg-red-600',
    'Citi': 'bg-blue-800',
  }

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
            <p className="text-gray-500 text-sm">
              None of your cards have transfer partners.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {Object.values(ecosystems).map(ecosystem => {
            const color = issuerColors[ecosystem.issuer] ?? 'bg-gray-600'
            return (
              <div key={ecosystem.pointCurrency} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Ecosystem header */}
                <div className={`${color} px-6 py-4`}>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{ecosystem.issuer}</p>
                  <h2 className="text-white font-semibold text-lg mt-0.5">{ecosystem.pointCurrency}</h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Airlines */}
                  {ecosystem.airlines.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                        ✈️ Airlines
                      </p>
                      <div className="space-y-2">
                        {ecosystem.airlines.map(airline => (
                          <div key={airline} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                            <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{airline}</span>
                            <span className="ml-auto text-xs text-gray-400">1:1</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hotels */}
                  {ecosystem.hotels.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                        🏨 Hotels
                      </p>
                      <div className="space-y-2">
                        {ecosystem.hotels.map(hotel => (
                          <div key={hotel} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                            <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{hotel}</span>
                            <span className="ml-auto text-xs text-gray-400">1:1</span>
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