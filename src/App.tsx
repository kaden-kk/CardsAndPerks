import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import CardsPage from './pages/CardsPage'
import OptimizerPage from './pages/OptimizerPage'

type Page = 'cards' | 'optimizer'

export default function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>('cards')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) return <AuthForm />

  return (
    <div>
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-semibold text-blue-600">PointPilot</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage('cards')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              page === 'cards'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            My cards
          </button>
          <button
            onClick={() => setPage('optimizer')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              page === 'optimizer'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Optimizer
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button
            onClick={() => useAuth().signOut()}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      {page === 'cards' && <CardsPage/>}
      {page === 'optimizer' && <OptimizerPage/>}
    </div>
  )
}