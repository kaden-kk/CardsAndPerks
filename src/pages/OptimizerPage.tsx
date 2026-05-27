import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'
import { optimizeCards, optimizeByPartner } from '../lib/optimizer'
import OptimizerCard from '../components/OptimizerCard'
import PartnerCard from '../components/PartnerCard'

type Tab = 'category' | 'partners'

export default function OptimizerPage() {
  const { user } = useAuth()
  const { userCards, loading } = useUserCards(user?.id ?? '')
  const [tab, setTab] = useState<Tab>('category')
  const [partnerFilter, setPartnerFilter] = useState<'all' | 'airline' | 'hotel'>('all')

  const categoryResults = optimizeCards(userCards)
  const partnerResults = optimizeByPartner(userCards)

  const filteredPartners = partnerResults.filter(p =>
    partnerFilter === 'all' ? true : p.partnerType === partnerFilter
  )

  const isEmpty = !loading && userCards.length === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Optimizer</h1>
          <p className="text-gray-500 text-sm mt-1">
            The best card from your wallet for every situation
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          <button
            onClick={() => setTab('category')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'category' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            By category
          </button>
          <button
            onClick={() => setTab('partners')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'partners' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            By transfer partner
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 text-sm">Calculating...</p>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-sm">Add some cards first to see recommendations.</p>
          </div>
        )}

        {/* Category tab */}
        {!loading && tab === 'category' && categoryResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryResults.map(result => (
              <OptimizerCard key={result.category} result={result} />
            ))}
          </div>
        )}

        {/* Partners tab */}
        {!loading && tab === 'partners' && (
          <>
            {partnerResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-gray-500 text-sm">
                  None of your cards have transfer partners.
                </p>
              </div>
            ) : (
              <>
                {/* Filter */}
                <div className="flex gap-2 mb-6">
                  {(['all', 'airline', 'hotel'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setPartnerFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                        partnerFilter === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {f === 'all' ? 'All partners' : f === 'airline' ? '✈️ Airlines' : '🏨 Hotels'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPartners.map(rec => (
                    <PartnerCard key={rec.partnerName} recommendation={rec} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </main>
    </div>
  )
}