interface Props {
  onBack: () => void
}

export default function PrivacyPage({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline mb-8 inline-block"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What we collect</h2>
            <p className="text-sm leading-relaxed">We collect your email address when you create an account. We also store which credit cards you add to your account. We do not collect actual card numbers, financial account details, or transaction history.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">How we use your data</h2>
            <p className="text-sm leading-relaxed">Your email is used solely to authenticate your account. Your card selections are used to power the optimizer and transfer partner features. We do not sell, share, or use your data for advertising purposes.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Data storage</h2>
            <p className="text-sm leading-relaxed">Your data is stored securely using Supabase, a managed database platform. Data is encrypted at rest and in transit. You can review Supabase's privacy policy at <a href="https://supabase.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">supabase.com/privacy</a>.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Card benefit data</h2>
            <p className="text-sm leading-relaxed">All credit card benefit information displayed in this app is publicly available information sourced from card issuer websites. We do not guarantee the accuracy or completeness of this data and recommend verifying directly with your card issuer.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Deleting your data</h2>
            <p className="text-sm leading-relaxed">You can remove any card from your account at any time. You can also delete your account directly from your account settings. When you delete your account, all associated personal data will be permanently removed from our systems. </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-sm leading-relaxed">If you have questions about this policy, reach out via the app.</p>
          </section>
        </div>
      </div>
    </div>
  )
}