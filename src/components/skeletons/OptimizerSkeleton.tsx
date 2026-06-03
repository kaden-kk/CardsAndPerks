export default function OptimizerSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="h-3 w-8 bg-gray-200 rounded ml-auto" />
              <div className="h-3 w-14 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}