import { useState, useEffect } from 'react'
import { X, Check, AlertTriangle, MessageSquare } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useProfile, AVATAR_COLORS } from '../hooks/useProfile'
import DeleteAccountModal from './DeleteAccountModal'
import SettingsSkeleton from './skeletons/SettingsSkeleton'
import FeedbackModal from './FeedbackModal'

interface Props {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: Props) {
  const { user, signOut } = useAuth()
  const { profile, loading, updateProfile } = useProfile(user?.id ?? '')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name)
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    await updateProfile({ display_name: displayName || null })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleColorSelect = async (color: string) => {
    await updateProfile({ avatar_color: color })
  }

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Profile section */}
          {loading ? (
            <SettingsSkeleton />
            ) : (
            <div className="px-6 py-6 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Profile</p>

                <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 ${profile?.avatar_color ?? 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0`}>
                    {initial}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">
                    {profile?.display_name || user?.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                </div>
                </div>

                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Display name</label>
                <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar color</label>
                <div className="flex gap-2 flex-wrap">
                    {AVATAR_COLORS.map(color => (
                    <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-full ${color} flex items-center justify-center transition-transform hover:scale-110`}
                    >
                        {profile?.avatar_color === color && (
                        <Check size={14} className="text-white" />
                        )}
                    </button>
                    ))}
                </div>
                </div>

                <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                {saved ? (
                    <>
                    <Check size={14} />
                    Saved
                    </>
                ) : saving ? 'Saving...' : 'Save changes'}
                </button>
            </div>
            )}

          {/* Account section */}
          <div className="px-6 py-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Account</p>

            <div className="space-y-2">
              <button
                onClick={() => setShowFeedback(true)}
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <MessageSquare size={14} />
                Send feedback
              </button>
              <button
                onClick={signOut}
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign out
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full text-left px-4 py-3 rounded-xl border border-red-100 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <AlertTriangle size={14} />
                Delete account
              </button>
            </div>
          </div>

        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
    </>
  )
}