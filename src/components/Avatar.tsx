interface Props {
  email: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-16 h-16 text-xl',
}

export default function Avatar({ email, color, size = 'md', onClick }: Props) {
  const initial = email.charAt(0).toUpperCase()

  return (
    <button
      onClick={onClick}
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 transition-opacity hover:opacity-80`}
    >
      {initial}
    </button>
  )
}