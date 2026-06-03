import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface Props {
  onClose: () => void
}

export default function DeleteAccountModal({ onClose }: Props) {
  const { deleteAccount } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await deleteAccount()
    if (error) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Delete account</h2>
              <p className="text-xs text-gray-500 mt-0.5">This cannot be undone</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          This will permanently delete your account and remove all your saved cards. Your email and card data will be erased immediately.
        </p>

        {!confirming ? (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              Delete my account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Are you sure? This is permanent.</p>
            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {loading ? 'Deleting...' : 'Yes, delete everything'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}