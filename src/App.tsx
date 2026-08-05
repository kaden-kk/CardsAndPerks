import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import CardsPage from './pages/CardsPage'
import OptimizerPage from './pages/OptimizerPage'
import PartnersPage from './pages/PartnersPage'
import LandingPage from './pages/LandingPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import SettingsPanel from './components/SettingsPanel'
import { useProfile } from './hooks/useProfile'
import { supabase } from './lib/supabase'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import ResetPasswordForm from './components/ResetPasswordForm'
import Navbar from './components/Navbar'

type Page = 'cards' | 'optimizer' | 'partners'
type StaticPage = 'privacy' | 'terms' | null

export default function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>('cards')
  const [showAuth, setShowAuth] = useState(false)
  const [staticPage, setStaticPage] = useState<StaticPage>(null)
  const [showSettings, setShowSettings] = useState(false)
  const { profile } = useProfile(user?.id ?? '')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  
  // listen for password recovery event
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setShowResetPassword(true)
    })
  }, [])

  // add before the !user checks
  if (showResetPassword) return (
    <ResetPasswordForm onDone={() => setShowResetPassword(false)} />
  )

  if (showForgotPassword) return (
    <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
  )

  // update the AuthForm to pass the forgot password handler
  if (!user && showAuth) return (
    <AuthForm
      onBack={() => setShowAuth(false)}
      onForgotPassword={() => setShowForgotPassword(true)}
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
      <Navbar
        page={page}
        onPageChange={setPage}
        onShowSettings={() => setShowSettings(true)}
      />

      {page === 'cards' && <CardsPage />}
      {page === 'optimizer' && <OptimizerPage />}
      {page === 'partners' && <PartnersPage />}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}