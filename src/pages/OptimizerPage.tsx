import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'
import { optimizeCards } from '../lib/optimizer'
import OptimizerCard from '../components/OptimizerCard'
import OptimizerSkeleton from '../components/skeletons/OptimizerSkeleton'
import type { OptimizedCategory } from '../lib/optimizer'

const CATEGORY_GROUPS: Record<string, string[]> = {
  'Everyday': [
    'dining',
    'groceries',
    'gas',
    'transit',
    'self-select',
    'everything else',
  ],
  'Travel': [
    'flights',
    'hotels',
    'car rentals',
    'travel',
    'chase travel portal',
    'chase travel portal - flights',
    'chase travel portal - hotels',
    'capital one travel portal - flights',
    'capital one travel portal - hotels',
    'capital one travel portal - car rentals',
    'amex travel portal - flights',
    'amex travel portal - hotels',
    'amex travel portal - car rentals',
    'citi travel portal',
    'citi travel portal - flights',
  ],
  'Lifestyle': [
    'streaming',
    'drugstores',
    'rent',
    'rotating',
    'entertainment',
    'capital one entertainment',
    'citi nights dining',
  ],
}

const GROUP_COLORS: Record<string, string> = {
  'Everyday': 'bg-green-50',
  'Travel': 'bg-blue-50',
  'Lifestyle': 'bg-amber-50',
}

const GROUP_ICON_COLORS: Record<string, string> = {
  'Everyday': 'text-green-600',
  'Travel': 'text-blue-600',
  'Lifestyle': 'text-amber-600',
}

function groupResults(results: OptimizedCategory[]) {
  const grouped: Record<string, OptimizedCategory[]> = {}
  const used = new Set<string>()

  for (const [group, categories] of Object.entries(CATEGORY_GROUPS)) {
    const matches = results
      .filter(r => categories.includes(r.category))
      .sort((a, b) => b.effectiveReturn - a.effectiveReturn)

    if (matches.length > 0) {
      grouped[group] = matches
      matches.forEach(m => used.add(m.category))
    }
  }

  const uncategorized = results
    .filter(r => !used.has(r.category))
    .sort((a, b) => b.effectiveReturn - a.effectiveReturn)

  if (uncategorized.length > 0) grouped['Other'] = uncategorized

  return grouped
}

export default function OptimizerPage() {
  const { user } = useAuth()
  const { userCards, loading } = useUserCards(user?.id ?? '')
  const results = optimizeCards(userCards)
  const grouped = groupResults(results)

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