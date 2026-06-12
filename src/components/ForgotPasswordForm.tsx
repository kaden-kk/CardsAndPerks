import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  onBack: () => void
}

export default function ForgotPasswordForm({ onBack }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setMessage(
        'If an account exists for that email, a reset link has been sent.'
      )
    } else {
      setMessage(
        'If an account exists for that email, a reset link has been sent.'
      )
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">

        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block transition-colors"
        >
          ← Back to sign in
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Reset password</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {!message ? (
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

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <div className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
            <p className="font-medium">Email sent</p>
            <p className="mt-0.5 text-green-500">
              Check your inbox for a password reset link. It expires in 1 hour.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}