
// src/pages/TermsAndConditions.jsx
export default function TermsAndConditions() {
  return (
    <div className="bg-[#0d0d0d] pt-10 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Terms & Conditions */}
        <section className="bg-[#111] p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">
            NOIRA Ltd – Terms & Conditions
          </h1>
          <p className="text-sm text-gray-400 mb-6">Effective Date: 20 Sept 2025</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-primary">Bookings:</strong> via official channels, age 18+.
            </li>
            <li>
              <strong className="text-primary">Payments:</strong> secure gateways, due at confirmation.
            </li>
            <li>
              <strong className="text-primary">Cancellations & Refunds:</strong> see policies.
            </li>
            <li>
              <strong className="text-primary">Therapist & Client Conduct:</strong> professional only.
            </li>
            <li>
              <strong className="text-primary">Liability:</strong> disclose health issues.
            </li>
            <li>
              <strong className="text-primary">Governing Law:</strong> English law applies.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
