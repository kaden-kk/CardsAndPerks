interface Props {
  onBack: () => void
}

export default function TermsPage({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Use of the service</h2>
            <p className="text-sm leading-relaxed">This app is provided for personal, informational use only. You may not use it for commercial purposes or attempt to reverse engineer, copy, or redistribute any part of it.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Accuracy of information</h2>
            <p className="text-sm leading-relaxed">Credit card benefit data, earn rates, and transfer partner information displayed in this app is sourced from publicly available issuer documentation. We make reasonable efforts to keep this data accurate but do not guarantee its completeness or currency. Always verify benefits directly with your card issuer before making financial decisions.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">No financial advice</h2>
            <p className="text-sm leading-relaxed">Nothing in this app constitutes financial advice. Card recommendations are based purely on earn rates and publicly available data. We are not responsible for any financial decisions made based on information displayed in this app.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your account</h2>
            <p className="text-sm leading-relaxed">You are responsible for maintaining the security of your account credentials. We are not liable for any loss resulting from unauthorized access to your account.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Changes to these terms</h2>
            <p className="text-sm leading-relaxed">We may update these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Limitation of liability</h2>
            <p className="text-sm leading-relaxed">This service is provided as-is without warranties of any kind. We are not liable for any damages arising from use of or inability to use this service.</p>
          </section>
        </div>
      </div>
    </div>
  )
}