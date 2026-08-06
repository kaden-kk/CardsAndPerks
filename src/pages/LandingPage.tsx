import { useAuth } from '../hooks/useAuth'

interface Props {
  onGetStarted: () => void
  onContinueAsGuest: () => void
  onPrivacy: () => void
  onTerms: () => void
}

export default function LandingPage({ onGetStarted, onContinueAsGuest, onPrivacy, onTerms }: Props) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen text-gray-900" style={{ backgroundColor: '#FAFAF7' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 relative z-10 border-b border-gray-200/60">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Kado<span className="text-blue-600">Hub</span>
        </span>
        <button
          onClick={onGetStarted}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          {user ? 'Go to app →' : 'Sign in'}
        </button>
      </nav>

      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">

        <div className="relative z-10 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium text-blue-600 tracking-wide">Free to use · No card required</span>
        </div>

        <h1 className="relative z-10 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl text-gray-900">
          Stop leaving
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            rewards on the table
          </span>
        </h1>

        <p className="relative z-10 text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          Add your credit cards and instantly see which one to use for every purchase — dining, travel, groceries, and more.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5"
          >
            Get started for free
          </button>
          <button
            onClick={onContinueAsGuest}
            className="text-gray-500 hover:text-gray-800 font-medium px-6 py-3.5 text-sm transition-colors"
          >
            Try it out first →
          </button>
        </div>

        {/* Floating card mockups */}
        <div className="relative z-10 mt-20 w-full max-w-4xl">
          <div className="grid grid-cols-3 gap-4">

            <div className="bg-blue-600 rounded-2xl p-5 text-left shadow-xl shadow-blue-900/20 rotate-[-2deg] translate-y-2">
              <p className="text-blue-200/70 text-xs font-medium uppercase tracking-widest mb-1">Chase</p>
              <p className="text-white font-semibold text-sm mb-4">Sapphire Reserve</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200/70 text-xs">Dining</span>
                  <span className="text-white text-xs font-bold">3x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200/70 text-xs">Chase Travel</span>
                  <span className="text-white text-xs font-bold">8x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200/70 text-xs">Direct Flights</span>
                  <span className="text-white text-xs font-bold">4x</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 text-left shadow-xl shadow-gray-900/20 scale-105 -translate-y-2 border border-gray-700/50">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">American Express</p>
              <p className="text-white font-semibold text-sm mb-4">Gold Card</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Dining</span>
                  <span className="text-white text-xs font-bold">4x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Groceries</span>
                  <span className="text-white text-xs font-bold">4x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Amex Flights</span>
                  <span className="text-white text-xs font-bold">3x</span>
                </div>
              </div>
            </div>

            <div className="bg-red-700 rounded-2xl p-5 text-left shadow-xl shadow-red-900/20 rotate-[2deg] translate-y-2">
              <p className="text-red-200/70 text-xs font-medium uppercase tracking-widest mb-1">Capital One</p>
              <p className="text-white font-semibold text-sm mb-4">Venture X</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-red-200/70 text-xs">Capital One Hotels</span>
                  <span className="text-white text-xs font-bold">10x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-200/70 text-xs">Capital One Flights</span>
                  <span className="text-white text-xs font-bold">5x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-200/70 text-xs">Everything else</span>
                  <span className="text-white text-xs font-bold">2x</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">Smart optimizer</h3>
            <p className="text-gray-500 text-sm leading-relaxed">See the best card from your wallet for every spend category — dining, travel, groceries, and more.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">Transfer partners</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Browse all transfer partners grouped by points ecosystem — Chase, Amex, Capital One, and Citi.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">Hidden perks</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Discover benefits you didn't know you had — travel credits, lounge access, cell phone protection, and more.</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200/60 px-8 py-6 flex items-center justify-between">
        <span className="text-gray-400 text-sm">© 2026 KadoHub</span>
        <div className="flex items-center gap-6">
          <button onClick={onPrivacy} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Privacy</button>
          <button onClick={onTerms} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Terms</button>
        </div>
      </div>

    </div>
  )
}