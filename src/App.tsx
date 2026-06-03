import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import CardsPage from './pages/CardsPage'
import OptimizerPage from './pages/OptimizerPage'
import PartnersPage from './pages/PartnersPage'
import LandingPage from './pages/LandingPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import Avatar from './components/Avatar'
import SettingsPanel from './components/SettingsPanel'
import { useProfile } from './hooks/useProfile'
import NavSkeleton from './components/skeletons/NavSkeleton'

type Page = 'cards' | 'optimizer' | 'partners'
type StaticPage = 'privacy' | 'terms' | null

export default function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>('cards')
  const [showAuth, setShowAuth] = useState(false)
  const [staticPage, setStaticPage] = useState<StaticPage>(null)
  const [showSettings, setShowSettings] = useState(false)
  const { profile } = useProfile(user?.id ?? '')

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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {profile ? (
              <Avatar
                email={user?.email ?? ''}
                color={profile.avatar_color}
                onClick={() => setShowSettings(true)}
              />
            ) : (
              <NavSkeleton />
            )}
          </div>
        </div>
      </nav>

      {page === 'cards' && <CardsPage />}
      {page === 'optimizer' && <OptimizerPage />}
      {page === 'partners' && <PartnersPage />}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}