// src/components/Navbar.tsx
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import Avatar from './Avatar'
import NavSkeleton from './skeletons/NavSkeleton'

type Page = 'cards' | 'optimizer' | 'partners'

interface Props {
  page: Page
  onPageChange: (page: Page) => void
  onShowSettings: () => void
  isGuest: boolean
  onShowAuth: () => void
}

const TABS: { key: Page; label: string }[] = [
  { key: 'cards', label: 'My Cards' },
  { key: 'optimizer', label: 'Optimizer' },
  { key: 'partners', label: 'Transfer Partners' },
]

export default function Navbar({ page, onPageChange, onShowSettings, isGuest, onShowAuth }: Props) {
  const { user } = useAuth()
  const { profile } = useProfile(user?.id ?? '')

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => onPageChange('cards')}
        className="text-xl font-semibold text-blue-600"
      >
        Cards & Perks
      </button>

      <div className="flex items-center gap-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onPageChange(tab.key)}
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
        {isGuest ? (
          <button
            onClick={onShowAuth}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Sign up to save your cards
          </button>
        ) : profile ? (
          <Avatar
            email={user?.email ?? ''}
            color={profile.avatar_color}
            onClick={onShowSettings}
          />
        ) : (
          <NavSkeleton />
        )}
      </div>
    </nav>
  )
}