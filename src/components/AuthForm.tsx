import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface Props {
  onBack?: () => void
  onForgotPassword?: () => void
}

export default function AuthForm({ onBack, onForgotPassword }: Props) {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setPasswordError(null)

    if (isSignUp && password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (isSignUp && password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    setMessage(null)
    setPasswordError(null)
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">

        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block transition-colors"
          >
            ← Back
          </button>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isSignUp ? 'Start maximizing your rewards' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          )}
          {!isSignUp && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {passwordError && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{passwordError}</p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
          )}

          {message && (
            <div className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
              <p className="font-medium">Check your email</p>
              <p className="mt-0.5 text-green-500">Click the confirmation link to activate your account. You'll be signed in automatically.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={handleToggleMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

      </div>
    </div>
  )
}