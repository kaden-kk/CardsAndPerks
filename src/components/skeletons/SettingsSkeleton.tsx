export default function SettingsSkeleton() {
  return (
    <div className="px-6 py-6 animate-pulse">
      <div className="h-3 w-16 bg-gray-200 rounded mb-4" />

      {/* Avatar row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-40 bg-gray-100 rounded" />
        </div>
      </div>

      {/* Display name field */}
      <div className="mb-4 space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded-lg" />
      </div>

      {/* Color picker */}
      <div className="mb-5 space-y-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="flex gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="h-10 w-full bg-gray-200 rounded-lg" />
    </div>
  )
}