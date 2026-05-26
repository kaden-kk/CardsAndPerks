import { useState, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserCards } from '../hooks/useUserCards'
import Navbar from '../components/Navbar'
import CardItem from '../components/CardItem'
import AddCardModal from '../components/AddCardModal'

export default function CardsPage() {
  const { user } = useAuth()
  const { userCards, loading, refetch } = useUserCards(user?.id ?? '')
  const [showModal, setShowModal] = useState(false)

  const handleCardAdded = useCallback(() => {
    refetch()
    setShowModal(false)
  }, [refetch])

  const existingCardIds = userCards.map(uc => uc.card_id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My cards</h1>
            <p className="text-gray-500 text-sm mt-1">
              {userCards.length === 0
                ? 'Add your first card to get started'
                : `${userCards.length} card${userCards.length > 1 ? 's' : ''} in your wallet`}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            + Add card
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 text-sm">Loading your cards...</p>
          </div>
        )}

        {!loading && userCards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">No cards yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Add the credit cards you use and we'll tell you which one to use for every purchase.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Add your first card
            </button>
          </div>
        )}

        {!loading && userCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCards.map(userCard => (
              <CardItem key={userCard.id} userCard={userCard} />
            ))}
          </div>
        )}

      </main>

      {showModal && (
        <AddCardModal
          userId={user!.id}
          existingCardIds={existingCardIds}
          onClose={() => setShowModal(false)}
          onCardAdded={handleCardAdded}
        />
      )}

    </div>
  )
}