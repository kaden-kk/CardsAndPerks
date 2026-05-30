import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'
import { optimizeCards } from '../lib/optimizer'
import OptimizerCard from '../components/OptimizerCard'

export default function OptimizerPage() {
  const { user } = useAuth()
  const { userCards, loading } = useUserCards(user?.id ?? '')
  const results = optimizeCards(userCards)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Optimizer</h1>
          <p className="text-gray-500 text-sm mt-1">
            The best card from your wallet for every spend category
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 text-sm">Calculating...</p>
          </div>
        )}

        {!loading && userCards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-sm">Add some cards first to see recommendations.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(result => (
              <OptimizerCard key={result.category} result={result} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}