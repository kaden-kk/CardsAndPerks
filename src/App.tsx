import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import CardsPage from './pages/CardsPage'
import OptimizerPage from './pages/OptimizerPage'
import PartnersPage from './pages/PartnersPage'
import LandingPage from './pages/LandingPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DeleteAccountModal from './components/DeleteAccountModal'

type Page = 'cards' | 'optimizer' | 'partners'
type StaticPage = 'privacy' | 'terms' | null

export default function App() {
  const { user, loading, signOut } = useAuth()
  const [page, setPage] = useState<Page>('cards')
  const [showAuth, setShowAuth] = useState(false)
  const [staticPage, setStaticPage] = useState<StaticPage>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  if (staticPage === 'privacy') return <PrivacyPage onBack={() => setStaticPage(null)} />
  if (staticPage === 'terms') return <TermsPage onBack={() => setStaticPage(null)} />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!user && !showAuth) return (
    <LandingPage
      onGetStarted={() => setShowAuth(true)}
      onPrivacy={() => setStaticPage('privacy')}
      onTerms={() => setStaticPage('terms')}
    />
  )

  if (!user && showAuth) return <AuthForm onBack={() => setShowAuth(false)} />

  return (
    <div>
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setPage('cards')}
          className="text-xl font-semibold text-blue-600"
        >
          KadoHub
        </button>
        <div className="flex items-center gap-1">
          {([
            { key: 'cards', label: 'My cards' },
            { key: 'optimizer', label: 'Optimizer' },
            { key: 'partners', label: 'Transfer partners' },
          ] as { key: Page; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setPage(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === tab.key
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={signOut}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Sign out
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete account
          </button>
        </div>
        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
      </nav>

      {page === 'cards' && <CardsPage />}
      {page === 'optimizer' && <OptimizerPage />}
      {page === 'partners' && <PartnersPage />}
    </div>
  )
}