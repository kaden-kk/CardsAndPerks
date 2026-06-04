import {
  Utensils, ShoppingCart, Plane, Hotel, Car, Tv,
  Pill, Fuel, Home, RefreshCw, CreditCard
} from 'lucide-react'
import type { OptimizedCategory } from '../lib/optimizer'

interface Props {
  result: OptimizedCategory
  groupColor?: string
}

const issuerText: Record<string, string> = {
  'Chase': 'text-blue-700',
  'American Express': 'text-gray-700',
  'Capital One': 'text-red-700',
  'Citi': 'text-blue-800',
  'Discover': 'text-orange-700',
  'Wells Fargo': 'text-yellow-700',
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'dining': <Utensils size={16} />,
  'groceries': <ShoppingCart size={16} />,
  'travel': <Plane size={16} />,
  'flights': <Plane size={16} />,
  'hotels': <Hotel size={16} />,
  'car rentals': <Car size={16} />,
  'streaming': <Tv size={16} />,
  'drugstores': <Pill size={16} />,
  'gas': <Fuel size={16} />,
  'rent': <Home size={16} />,
  'rotating': <RefreshCw size={16} />,
  'everything else': <CreditCard size={16} />,
  'chase travel portal': <Plane size={16} />,
  'chase travel portal - flights': <Plane size={16} />,
  'chase travel portal - hotels': <Hotel size={16} />,
  'capital one travel portal - flights': <Plane size={16} />,
  'capital one travel portal - hotels': <Hotel size={16} />,
  'capital one travel portal - car rentals': <Car size={16} />,
  'amex travel portal - flights': <Plane size={16} />,
  'amex travel portal - hotels': <Hotel size={16} />,
  'amex travel portal - car rentals': <Car size={16} />,
  'citi travel portal': <Plane size={16} />,
}

const CATEGORY_DISPLAY: Record<string, string> = {
  'dining': 'Dining',
  'groceries': 'Groceries',
  'travel': 'Travel',
  'flights': 'Flights',
  'hotels': 'Hotels',
  'car rentals': 'Car Rentals',
  'streaming': 'Streaming',
  'drugstores': 'Drugstores',
  'gas': 'Gas',
  'rent': 'Rent',
  'rotating': 'Rotating',
  'everything else': 'Everything Else',
  'chase travel portal': 'Chase Travel',
  'chase travel portal - flights': 'Chase Flights',
  'chase travel portal - hotels': 'Chase Hotels',
  'capital one travel portal - flights': 'Capital One Flights',
  'capital one travel portal - hotels': 'Capital One Hotels',
  'capital one travel portal - car rentals': 'Capital One Car Rentals',
  'amex travel portal - flights': 'Amex Flights',
  'amex travel portal - hotels': 'Amex Hotels',
  'amex travel portal - car rentals': 'Amex Car Rentals',
  'citi travel portal': 'Citi Travel',
}

export default function OptimizerCard({ result, groupColor = 'bg-gray-50' }: Props) {
  const textClass = issuerText[result.issuer] ?? 'text-gray-700'
  const icon = CATEGORY_ICONS[result.category] ?? <CreditCard size={16} />
  const displayName = CATEGORY_DISPLAY[result.category] ?? result.category
  const returnPct = (result.effectiveReturn * 100).toFixed(2)

  return (
    <div className={`rounded-xl border border-gray-100 p-4 ${groupColor}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="text-gray-500 flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className={`text-xs font-medium mt-0.5 truncate ${textClass}`}>
              {result.bestCard}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-gray-900">{result.earnRate}x</p>
        </div>
      </div>
      {result.notes && (
        <p className="text-xs text-gray-400 mt-2 leading-tight">{result.notes}</p>
      )}
    </div>
  )
}