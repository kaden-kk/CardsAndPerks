export default function PartnersSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-16 bg-gray-200" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                  <div className="h-3 w-8 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-3 w-12 bg-gray-200 rounded" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                  </div>
                  <div className="h-3 w-8 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}