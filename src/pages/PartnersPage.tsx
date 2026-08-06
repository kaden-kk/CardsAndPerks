import { useMemo, useState } from 'react'
import PartnersSkeleton from '../components/skeletons/PartnerSkeleton'
import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'
import { useAllCards } from '../hooks/useAllCards'
import { Plane, Hotel, Search } from 'lucide-react'
import { ISSUER_COLORS } from '../constants/issuers'
import type { UserCard } from '../types/index'

interface PartnerEntry {
  issuer: string
  pointCurrency: string
  ratio: number
}

interface PartnerGroup {
  partnerId: string
  name: string
  type: 'airline' | 'hotel'
  entries: PartnerEntry[]
  bestRatio: number
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

type Filter = 'all' | 'airline' | 'hotel'
type SortMode = 'name' | 'ratio'

interface Props {
  isGuest: boolean
  guestCardIds: string[]
}

export default function PartnersPage({ isGuest, guestCardIds }: Props) {
  const { user } = useAuth()
  const { userCards: realUserCards, loading: realLoading } = useUserCards(isGuest ? '' : user?.id ?? '')
  const { cards: allCards, loading: allCardsLoading } = useAllCards()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<SortMode>('name')

  const guestUserCards: UserCard[] = useMemo(() => {
    if (!isGuest) return []
    return guestCardIds
      .map(id => allCards.find(c => c.id === id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map(card => ({
        id: card.id,
        card_id: card.id,
        added_at: new Date().toISOString(),
        card,
      }))
  }, [isGuest, guestCardIds, allCards])

  const userCards = isGuest ? guestUserCards : realUserCards
  const loading = isGuest ? allCardsLoading : realLoading

  const partnerGroups = useMemo(() => {
    const map: Record<string, PartnerGroup> = {}

    for (const userCard of userCards) {
      const { card } = userCard
      for (const t of card.card_transfer_partners) {
        if (!t.partner.name || !t.partner.type) continue

        const key = t.partner.id
        if (!map[key]) {
          map[key] = {
            partnerId: key,
            name: t.partner.name,
            type: t.partner.type,
            entries: [],
            bestRatio: t.ratio,
          }
        }

        const group = map[key]
        const alreadyHasCurrency = group.entries.some(
          e => e.pointCurrency === card.point_currency
        )
        if (!alreadyHasCurrency) {
          group.entries.push({
            issuer: card.issuer,
            pointCurrency: card.point_currency,
            ratio: t.ratio,
          })
          if (t.ratio > group.bestRatio) group.bestRatio = t.ratio
        } else {
          const existing = group.entries.find(e => e.pointCurrency === card.point_currency)
          if (existing && existing.ratio !== t.ratio) {
            console.warn(
              `Ratio mismatch for ${t.partner.name} within ${card.point_currency}: ${existing.ratio} vs ${t.ratio}`
            )
          }
        }
      }
    }

    return Object.values(map)
  }, [userCards])

  const filtered = useMemo(() => {
    let result = partnerGroups

    if (filter !== 'all') {
      result = result.filter(g => g.type === filter)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(g => g.name.toLowerCase().includes(q))
    }

    return [...result].sort((a, b) => {
      if (sort === 'ratio') {
        if (b.bestRatio !== a.bestRatio) return b.bestRatio - a.bestRatio
      }
      return a.name.localeCompare(b.name)
    })
  }, [partnerGroups, filter, search, sort])

  const airlines = filtered.filter(g => g.type === 'airline')
  const hotels = filtered.filter(g => g.type === 'hotel')

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Transfer Partners</h1>
          <p className="text-gray-500 text-sm mt-1">
            Compare transfer rates across all your point currencies
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search partners..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {([
              { key: 'all', label: 'All' },
              { key: 'airline', label: 'Airlines' },
              { key: 'hotel', label: 'Hotels' },
            ] as { key: Filter; label: string }[]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.key
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-800'
                }`}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => setSort(sort === 'ratio' ? 'name' : 'ratio')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === 'ratio'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-800'
              }`}
            >
              Best ratio
            </button>
          </div>
        </div>

        {loading && <PartnersSkeleton />}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-sm">
              {search ? 'No partners match your search.' : 'None of your cards have transfer partners.'}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-8">
            {airlines.length > 0 && (
              <PartnerSection title="Airlines" icon={<Plane size={14} className="text-blue-500" />} groups={airlines} />
            )}
            {hotels.length > 0 && (
              <PartnerSection title="Hotels" icon={<Hotel size={14} className="text-amber-500" />} groups={hotels} />
            )}
          </div>
        )}

      </main>
    </div>
  )
}

function PartnerSection({
  title,
  icon,
  groups,
}: {
  title: string
  icon: React.ReactNode
  groups: PartnerGroup[]
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</p>
      </div>
      <div className="space-y-2">
        {groups.map(group => (
          <div
            key={group.partnerId}
            className="bg-white rounded-xl border border-gray-100 px-4 py-3"
          >
            <p className="text-sm font-medium text-gray-800 mb-2">{group.name}</p>
            <div className="flex flex-wrap gap-2">
              {group.entries
                .sort((a, b) => b.ratio - a.ratio)
                .map(entry => {
                  const color = ISSUER_COLORS[entry.issuer] ?? 'bg-gray-600'
                  return (
                    <div
                      key={entry.pointCurrency}
                      className="flex items-center gap-1.5 bg-gray-50 rounded-lg pl-1.5 pr-2.5 py-1"
                    >
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-xs text-gray-600">{entry.pointCurrency}</span>
                      <span className={`text-xs font-semibold ${getRatioColor(entry.ratio)}`}>
                        {formatRatio(entry.ratio)}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}