import { Utensils, ShoppingCart, Plane, Hotel, Car, Tv, Pill, Fuel, Home, RefreshCw, CreditCard } from 'lucide-react'
import type { OptimizedCategory } from '../lib/optimizer'

interface Props {
  result: OptimizedCategory
}

const issuerColors: Record<string, string> = {
  'Chase': 'border-blue-200 bg-blue-50',
  'American Express': 'border-gray-200 bg-gray-50',
  'Capital One': 'border-red-200 bg-red-50',
  'Citi': 'border-blue-200 bg-blue-50',
  'Discover': 'border-orange-200 bg-orange-50',
  'Wells Fargo': 'border-yellow-200 bg-yellow-50',
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
  'dining': <Utensils size={18} />,
  'groceries': <ShoppingCart size={18} />,
  'travel': <Plane size={18} />,
  'flights': <Plane size={18} />,
  'hotels': <Hotel size={18} />,
  'car rentals': <Car size={18} />,
  'streaming': <Tv size={18} />,
  'drugstores': <Pill size={18} />,
  'gas': <Fuel size={18} />,
  'rent': <Home size={18} />,
  'rotating': <RefreshCw size={18} />,
  'everything else': <CreditCard size={18} />,
}

export default function OptimizerCard({ result }: Props) {
  const colorClass = issuerColors[result.issuer] ?? 'border-gray-200 bg-gray-50'
  const textClass = issuerText[result.issuer] ?? 'text-gray-700'
  const icon = CATEGORY_ICONS[result.category] ?? <CreditCard size={18} />
  const returnPct = (result.effectiveReturn * 100).toFixed(2)

  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-gray-600">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 capitalize">{result.category}</p>
            <p className={`text-xs font-medium mt-0.5 ${textClass}`}>{result.bestCard}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-gray-900">{result.earnRate}x</p>
          <p className="text-xs text-gray-500">{returnPct}% back</p>
        </div>
      </div>
      {result.notes && (
        <p className="text-xs text-gray-500 mt-2 pl-9">{result.notes}</p>
      )}
    </div>
  )
}