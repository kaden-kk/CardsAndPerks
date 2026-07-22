import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'
import { optimizeCards } from '../lib/optimizer'
import OptimizerCard from '../components/OptimizerCard'
import OptimizerSkeleton from '../components/skeletons/OptimizerSkeleton'
import { groupEarnRateResults, GROUP_COLORS, GROUP_ICON_COLORS } from '../constants/categories'

export default function OptimizerPage() {
  const { user } = useAuth()
  const { userCards, loading } = useUserCards(user?.id ?? '')
  const results = optimizeCards(userCards)
  const grouped = groupEarnRateResults(results)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Optimizer</h1>
          <p className="text-gray-500 text-sm mt-1">
            The best card from your wallet for every spend category
          </p>
        </div>

        {loading && <OptimizerSkeleton />}

        {!loading && userCards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-sm">Add some cards first to see recommendations.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-8">
            {Object.entries(grouped).map(([group, groupResults]) => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-semibold uppercase tracking-widest ${GROUP_ICON_COLORS[group] ?? 'text-gray-500'}`}>
                    {group}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">
                    {groupResults.length} {groupResults.length === 1 ? 'category' : 'categories'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupResults.map(result => (
                    <OptimizerCard
                      key={result.category}
                      result={result}
                      groupColor={GROUP_COLORS[group] ?? 'bg-gray-50'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}