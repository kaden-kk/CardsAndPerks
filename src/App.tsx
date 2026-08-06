import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useGuestCards } from './hooks/useGuestCards'
import AuthForm from './components/AuthForm'
import CardsPage from './pages/CardsPage'
import OptimizerPage from './pages/OptimizerPage'
import PartnersPage from './pages/PartnersPage'
import LandingPage from './pages/LandingPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import Navbar from './components/Navbar'
import SettingsPanel from './components/SettingsPanel'
import { useProfile } from './hooks/useProfile'
import { supabase } from './lib/supabase'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import ResetPasswordForm from './components/ResetPasswordForm'

type Page = 'cards' | 'optimizer' | 'partners'
type StaticPage = 'privacy' | 'terms' | null

export default function App() {
  const { user, loading } = useAuth()
  const guestCards = useGuestCards()
  const [page, setPage] = useState<Page>('cards')
  const [showAuth, setShowAuth] = useState(false)
  const [guestMode, setGuestMode] = useState(false)
  const [staticPage, setStaticPage] = useState<StaticPage>(null)
  const [showSettings, setShowSettings] = useState(false)
  const { profile, loading: profileLoading } = useProfile(user?.id ?? '')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setShowResetPassword(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Detect account deleted from another session
  useEffect(() => {
    if (user && !profileLoading && profile === null) {
      supabase.auth.signOut()
    }
  }, [user, profile, profileLoading])

  // Migrate guest cards into real user_cards rows after sign-up
  const migrateGuestCards = async (userId: string) => {
    if (guestCards.guestCardIds.length === 0) return
    for (const cardId of guestCards.guestCardIds) {
      await supabase.from('user_cards').insert({ user_id: userId, card_id: cardId })
    }
    guestCards.clearGuestCards()
  }

  if (showResetPassword) return (
    <ResetPasswordForm onDone={() => setShowResetPassword(false)} />
  )

  if (showForgotPassword) return (
    <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
  )

  if (!user && showAuth) return (
    <AuthForm
      onBack={() => setShowAuth(false)}
      onForgotPassword={() => setShowForgotPassword(true)}
      onSignedUp={migrateGuestCards}
    />
  )

  if (staticPage === 'privacy') return <PrivacyPage onBack={() => setStaticPage(null)} />
  if (staticPage === 'terms') return <TermsPage onBack={() => setStaticPage(null)} />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!user && !showAuth && !guestMode) return (
    <LandingPage
      onGetStarted={() => setShowAuth(true)}
      onContinueAsGuest={() => setGuestMode(true)}
      onPrivacy={() => setStaticPage('privacy')}
      onTerms={() => setStaticPage('terms')}
    />
  )

  const isGuest = !user && guestMode

  return (
    <div>
      <Navbar
        page={page}
        onPageChange={setPage}
        onShowSettings={() => setShowSettings(true)}
        isGuest={isGuest}
        onShowAuth={() => setShowAuth(true)}
      />

      {page === 'cards' && (
        <CardsPage
          isGuest={isGuest}
          guestCardIds={guestCards.guestCardIds}
          onAddGuestCard={guestCards.addGuestCard}
          onRemoveGuestCard={guestCards.removeGuestCard}
        />
      )}
      {page === 'optimizer' && <OptimizerPage isGuest={isGuest} guestCardIds={guestCards.guestCardIds} />}
      {page === 'partners' && <PartnersPage isGuest={isGuest} guestCardIds={guestCards.guestCardIds} />}

      {showSettings && !isGuest && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}