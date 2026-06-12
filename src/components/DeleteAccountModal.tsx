import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface Props {
  onClose: () => void
}

export default function DeleteAccountModal({ onClose }: Props) {
  const { deleteAccount } = useAuth()
  const [step, setStep] = useState<'confirm' | 'password'>('confirm')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!password) return
    setLoading(true)
    setError(null)

    // Re-authenticate first
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      setError('Could not verify your session.')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    })

    if (signInError) {
      setError('Incorrect password.')
      setLoading(false)
      return
    }

    const { error } = await deleteAccount()
    if (error) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    window.location.reload()
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
        {step === 'confirm' ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <AlertTriangle
                  size={18}
                  className="text-red-600 flex-shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-medium text-red-800">
                    Final confirmation
                  </p>

                  <p className="text-xs text-red-700 mt-1">
                    This action cannot be undone. Enter your password to permanently
                    delete your account and all saved data.
                  </p>
                </div>
              </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('password')}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Delete my account
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Enter your password to confirm deletion.</p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading || !password}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
