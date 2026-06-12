import { useState } from 'react'
import { X, MessageSquare, Bug, Database, Lightbulb, MessageCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface Props {
  onClose: () => void
}

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug report', icon: Bug, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
  { value: 'wrong_data', label: 'Wrong card data', icon: Database, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  { value: 'feature_request', label: 'Feature request', icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  { value: 'general', label: 'General feedback', icon: MessageCircle, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
]

export default function FeedbackModal({ onClose }: Props) {
  const { user } = useAuth()
  const [type, setType] = useState('general')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Please enter a message.')
      return
    }
    if (message.trim().length > 2000) {
      setError('Feedback must be under 2000 characters.')
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('feedback').insert({
      user_id: user?.id ?? null,
      type,
      message: message.trim(),
    })

    if (error) setError('Something went wrong. Please try again.')
    else setSubmitted(true)
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Send feedback</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={20} className="text-green-600" />
            </div>
            <p className="text-gray-900 font-medium mb-1">Thanks for the feedback</p>
            <p className="text-gray-500 text-sm mb-6">It helps make the app better for everyone.</p>
            <button onClick={onClose} className="text-sm text-blue-600 hover:underline">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TYPES.map(ft => {
                  const Icon = ft.icon
                  const isSelected = type === ft.value
                  return (
                    <button
                      key={ft.value}
                      type="button"
                      onClick={() => setType(ft.value)}
                      className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border flex items-center gap-2 ${
                        isSelected
                          ? `${ft.bg} border-opacity-100`
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Icon
                        size={14}
                        className={isSelected ? ft.color : 'text-gray-400'}
                      />
                      <span className={isSelected ? ft.color.replace('text-', 'text-').replace('-500', '-700') : ''}>
                        {ft.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                value={message}
                maxLength={2000}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Tell us what's on your mind..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {loading ? 'Sending...' : 'Send feedback'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}