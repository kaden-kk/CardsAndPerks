import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAllCards } from '../hooks/useAllCards'
import type { Card } from '../types/index'
import { ISSUER_COLORS } from '../constants/issuers'

interface Props {
  userId: string
  existingCardIds: string[]
  onClose: () => void
  onCardAdded: () => void
}

export default function AddCardModal({ userId, existingCardIds, onClose, onCardAdded }: Props) {
  const { cards, loading } = useAllCards()
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState<string | null>(null)
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null)

  const filtered = cards.filter(card =>
    !existingCardIds.includes(card.id) &&
    (card.name.toLowerCase().includes(search.toLowerCase()) ||
     card.issuer.toLowerCase().includes(search.toLowerCase()))
  )

  const addCard = async (card: Card) => {
    setAdding(card.id)
    await supabase.from('user_cards').insert({
      user_id: userId,
      card_id: card.id,
    })
    onCardAdded()
    setRecentlyAdded(card.id)
    setAdding(null)
    setTimeout(() => setRecentlyAdded(null), 2000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-xl"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add a card</h2>
            <p className="text-sm text-gray-500 mt-0.5">Select a card from your wallet</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search by card name or issuer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Card list */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">Loading cards...</p>
          )}
          
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              {search ? 'No cards match your search' : 'All available cards have been added'}
            </p>
          )}

          {filtered.map(card => {
            const color = ISSUER_COLORS[card.issuer] ?? 'bg-gray-600'
            const isAdding = adding === card.id
            
            return (
              <button
                key={card.id}
                onClick={() => addCard(card)}
                disabled={!!adding}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left disabled:opacity-50"
              >
                <div className={`${color} w-10 h-10 rounded-lg flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{card.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {card.issuer} · {card.point_currency} · {card.annual_fee === 0 ? 'No annual fee' : `$${card.annual_fee}/yr`}
                  </p>
                </div>
                <span className="text-sm font-medium flex-shrink-0">
                  {recentlyAdded === card.id ? (
                    <span className="text-green-600">✓ Added</span>
                  ) : isAdding ? (
                    <span className="text-blue-400">Adding...</span>
                  ) : (
                    <span className="text-blue-600">Add</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}