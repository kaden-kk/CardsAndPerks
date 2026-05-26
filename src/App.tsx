import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import CardsPage from './pages/CardsPage'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) return <AuthForm />
  return <CardsPage />
}